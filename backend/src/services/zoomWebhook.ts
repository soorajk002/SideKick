import { Request, Response } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';
import { getMeetingRoom } from './websocket.js';

/**
 * Verify Zoom webhook signature
 */
function verifyWebhookSignature(
  payload: string,
  timestamp: string,
  signature: string
): boolean {
  const secretToken = process.env.ZOOM_WEBHOOK_SECRET_TOKEN;
  if (!secretToken) {
    logger.warn('Zoom webhook secret not configured');
    return false;
  }

  const message = `v0:${timestamp}:${payload}`;
  const hash = crypto
    .createHmac('sha256', secretToken)
    .update(message)
    .digest('hex');

  const expectedSignature = `v0=${hash}`;
  return signature === expectedSignature;
}

/**
 * Handle Zoom webhook events
 */
export async function handleZoomWebhook(req: Request, res: Response) {
  try {
    const payload = JSON.stringify(req.body);
    const timestamp = req.headers['x-zm-request-timestamp'] as string;
    const signature = req.headers['x-zm-signature'] as string;

    // Verify signature
    if (!verifyWebhookSignature(payload, timestamp, signature)) {
      logger.warn('Invalid Zoom webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;

    // Handle endpoint URL validation
    if (event.event === 'endpoint.url_validation') {
      const hashForValidate = crypto
        .createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN!)
        .update(event.payload.plainToken)
        .digest('hex');

      return res.json({
        plainToken: event.payload.plainToken,
        encryptedToken: hashForValidate,
      });
    }

    // Handle meeting transcription events
    if (event.event === 'meeting.transcription_completed') {
      logger.info('Transcription completed event received:', event.payload);
      await handleTranscriptionCompleted(event.payload);
    }

    // Handle real-time transcription
    if (event.event === 'meeting.transcription_message') {
      logger.info('Transcription message received');
      await handleTranscriptionMessage(event.payload);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Failed to process Zoom webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleTranscriptionCompleted(payload: any) {
  const meetingId = payload.object.id;
  const downloadUrl = payload.object.download_url;

  logger.info(`Transcription completed for meeting ${meetingId}`);
  logger.info(`Download URL: ${downloadUrl}`);

  // TODO: Download and process full transcription
  // This would involve:
  // 1. Downloading the transcription file
  // 2. Parsing it
  // 3. Running through the analyzer
  // 4. Updating checklist items
}

async function handleTranscriptionMessage(payload: any) {
  const meetingId = payload.object.id;
  const transcriptText = payload.object.transcript_text;
  const speaker = payload.object.speaker;

  logger.info(`Real-time transcription from ${speaker}: ${transcriptText}`);

  // Get meeting room and forward to WebSocket clients
  const room = getMeetingRoom(meetingId);
  if (room) {
    // Forward to WebSocket for processing
    // This would typically be handled by the WebSocket service
    logger.info(`Forwarding transcription to room ${meetingId}`);
  }
}
