import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db, meetings, checklists } from '@/lib/db'
import { eq } from 'drizzle-orm'

// Verify Zoom webhook signature
function verifyZoomWebhook(payload: string, signature: string, timestamp: string): boolean {
  if (!process.env.ZOOM_WEBHOOK_SECRET) {
    console.warn('ZOOM_WEBHOOK_SECRET not configured')
    return false
  }

  const message = `v0:${timestamp}:${payload}`
  const hashForVerify = crypto
    .createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET)
    .update(message)
    .digest('hex')

  const computedSignature = `v0=${hashForVerify}`

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  )
}

// POST /api/webhooks/zoom - Handle Zoom webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-zm-signature') || ''
    const timestamp = request.headers.get('x-zm-request-timestamp') || ''

    // Verify webhook signature in production
    if (process.env.NODE_ENV === 'production' && !verifyZoomWebhook(body, signature, timestamp)) {
      return NextResponse.json(
        { success: false, error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    const data = JSON.parse(body)
    const event = data.event

    // Handle URL validation
    if (event === 'endpoint.url_validation') {
      const plainToken = data.payload.plainToken
      const encryptedToken = crypto
        .createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET || '')
        .update(plainToken)
        .digest('hex')

      return NextResponse.json({
        plainToken,
        encryptedToken,
      })
    }

    // Handle meeting ended event
    if (event === 'meeting.ended') {
      const meetingData = data.payload.object
      const meetingId = meetingData.id
      const uuid = meetingData.uuid

      console.log('Meeting ended:', meetingId)

      // Find meeting in database
      const [meeting] = await db
        .select()
        .from(meetings)
        .where(eq(meetings.zoomMeetingId, meetingId.toString()))

      if (meeting) {
        // Update meeting end time
        await db
          .update(meetings)
          .set({
            endedAt: new Date(meetingData.end_time),
            duration: meetingData.duration,
            participants: meetingData.participant_count
              ? Array.from({ length: meetingData.participant_count }, (_, i) => ({
                  name: `Participant ${i + 1}`,
                }))
              : meeting.participants,
            updatedAt: new Date(),
          })
          .where(eq(meetings.id, meeting.id))
      }

      return NextResponse.json({ success: true, message: 'Meeting ended event processed' })
    }

    // Handle recording completed event (contains transcript)
    if (event === 'recording.completed') {
      const recordingData = data.payload.object
      const meetingId = recordingData.id
      const recordingFiles = recordingData.recording_files || []

      console.log('Recording completed:', meetingId)

      // Find meeting in database
      const [meeting] = await db
        .select()
        .from(meetings)
        .where(eq(meetings.zoomMeetingId, meetingId.toString()))

      if (!meeting) {
        console.log('Meeting not found in database')
        return NextResponse.json({ success: true, message: 'Meeting not found' })
      }

      // Extract transcript file
      const transcriptFile = recordingFiles.find(
        (file: any) => file.file_type === 'TRANSCRIPT' || file.recording_type === 'audio_transcript'
      )

      if (transcriptFile && transcriptFile.download_url) {
        // In production, you would download the transcript file here
        // For now, we'll simulate it
        console.log('Transcript available at:', transcriptFile.download_url)

        // Update meeting with recording info
        await db
          .update(meetings)
          .set({
            recordingUrl: recordingData.share_url || transcriptFile.download_url,
            transcriptUrl: transcriptFile.download_url,
            hasRecording: true,
            hasTranscript: true,
            updatedAt: new Date(),
          })
          .where(eq(meetings.id, meeting.id))

        // TODO: Download and process transcript
        // const transcript = await downloadTranscript(transcriptFile.download_url)
        // await processTranscriptForMeeting(meeting.id, transcript)
      }

      return NextResponse.json({ success: true, message: 'Recording processed' })
    }

    // Handle transcript available event
    if (event === 'meeting.transcript_completed') {
      const transcriptData = data.payload.object
      const meetingId = transcriptData.id
      const transcriptText = transcriptData.transcript || ''

      console.log('Transcript completed for meeting:', meetingId)

      // Find meeting in database
      const [meeting] = await db
        .select()
        .from(meetings)
        .where(eq(meetings.zoomMeetingId, meetingId.toString()))

      if (!meeting) {
        console.log('Meeting not found in database')
        return NextResponse.json({ success: true, message: 'Meeting not found' })
      }

      // Update meeting with transcript
      await db
        .update(meetings)
        .set({
          transcript: transcriptText,
          hasTranscript: true,
          updatedAt: new Date(),
        })
        .where(eq(meetings.id, meeting.id))

      // Find active checklist for this meeting
      const [checklist] = await db
        .select()
        .from(checklists)
        .where(eq(checklists.meetingId, meeting.id))

      if (checklist && transcriptText) {
        // Trigger AI analysis asynchronously
        // In production, use a queue system like Bull or AWS SQS
        console.log('Triggering AI analysis for checklist:', checklist.id)

        // For now, we'll just log it
        // You would call the analyze endpoint here or use a background job
        // await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/checklists/${checklist.id}/analyze`, {
        //   method: 'POST',
        //   body: JSON.stringify({ transcript: transcriptText }),
        // })
      }

      return NextResponse.json({ success: true, message: 'Transcript processed' })
    }

    // Log unhandled events
    console.log('Unhandled Zoom webhook event:', event)

    return NextResponse.json({ success: true, message: 'Event received' })
  } catch (error) {
    console.error('Error processing Zoom webhook:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

// GET /api/webhooks/zoom - Webhook health check
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Zoom webhook endpoint is active',
    configured: !!process.env.ZOOM_WEBHOOK_SECRET,
  })
}
