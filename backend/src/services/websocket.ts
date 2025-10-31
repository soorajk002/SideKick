import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger.js';
import { ConversationAnalyzer } from './conversationAnalyzer.js';

interface MeetingRoom {
  meetingId: string;
  sockets: Set<string>;
  analyzer: ConversationAnalyzer;
}

const meetingRooms = new Map<string, MeetingRoom>();

export function initializeSocketIO(io: Server) {
  io.on('connection', (socket: Socket) => {
    const meetingId = socket.handshake.query.meetingId as string;

    if (!meetingId) {
      logger.warn('Socket connection without meetingId');
      socket.disconnect();
      return;
    }

    logger.info(`Client connected: ${socket.id} to meeting ${meetingId}`);

    // Join meeting room
    socket.join(meetingId);

    // Initialize or get meeting room
    if (!meetingRooms.has(meetingId)) {
      const analyzer = new ConversationAnalyzer(io, meetingId);
      meetingRooms.set(meetingId, {
        meetingId,
        sockets: new Set([socket.id]),
        analyzer,
      });
      logger.info(`Meeting room created: ${meetingId}`);
    } else {
      meetingRooms.get(meetingId)!.sockets.add(socket.id);
    }

    // Handle transcription events
    socket.on('transcription', async (data: { text: string; speaker: string; checklistId: string }) => {
      logger.info(`Transcription received for meeting ${meetingId}:`, data);

      const room = meetingRooms.get(meetingId);
      if (!room) {
        logger.warn(`No room found for meeting ${meetingId}`);
        return;
      }

      // Broadcast transcription to all clients in the meeting
      io.to(meetingId).emit('transcription', data);

      // Analyze conversation for checklist matches
      try {
        await room.analyzer.analyzeTranscription(
          data.text,
          data.speaker,
          data.checklistId
        );
      } catch (error) {
        logger.error('Failed to analyze transcription:', error);
      }
    });

    // Handle manual item toggle
    socket.on('toggle-item', (data: { checklistId: string; itemId: string }) => {
      logger.info(`Item toggled: ${data.itemId} in checklist ${data.checklistId}`);
      io.to(meetingId).emit('item-toggled', data);
    });

    // Handle checklist updates
    socket.on('update-checklist', (data: { checklistId: string; items: any[] }) => {
      logger.info(`Checklist updated: ${data.checklistId}`);
      io.to(meetingId).emit('checklist-updated', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id} from meeting ${meetingId}`);

      const room = meetingRooms.get(meetingId);
      if (room) {
        room.sockets.delete(socket.id);

        // Clean up room if no more clients
        if (room.sockets.size === 0) {
          meetingRooms.delete(meetingId);
          logger.info(`Meeting room cleaned up: ${meetingId}`);
        }
      }
    });
  });

  logger.info('Socket.IO initialized');
}

export function getMeetingRoom(meetingId: string): MeetingRoom | undefined {
  return meetingRooms.get(meetingId);
}
