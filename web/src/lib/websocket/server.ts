import { Server as SocketIOServer } from 'socket.io'
import type { Server as HTTPServer } from 'http'

let io: SocketIOServer | null = null

export function initializeWebSocket(httpServer: HTTPServer) {
  if (io) {
    console.log('WebSocket server already initialized')
    return io
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/api/socket',
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Join meeting room
    socket.on('join-meeting', (meetingId: string) => {
      console.log(`Socket ${socket.id} joined meeting ${meetingId}`)
      socket.join(`meeting:${meetingId}`)
      socket.emit('joined', { meetingId })
    })

    // Leave meeting room
    socket.on('leave-meeting', (meetingId: string) => {
      console.log(`Socket ${socket.id} left meeting ${meetingId}`)
      socket.leave(`meeting:${meetingId}`)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  console.log('WebSocket server initialized')
  return io
}

export function getIO(): SocketIOServer | null {
  return io
}

/**
 * Emit item checked event to meeting room
 */
export function emitItemChecked(meetingId: string, data: {
  itemId: string
  checklistId: string
  title: string
  confidence: number
  reasoning: string
  evidence: string[]
}) {
  if (!io) {
    console.warn('WebSocket not initialized')
    return
  }

  io.to(`meeting:${meetingId}`).emit('item-checked', data)
  console.log(`Emitted item-checked for meeting ${meetingId}, item ${data.itemId}`)
}

/**
 * Emit transcript chunk to meeting room
 */
export function emitTranscriptChunk(meetingId: string, data: {
  text: string
  speaker?: string
  timestamp: Date
}) {
  if (!io) {
    console.warn('WebSocket not initialized')
    return
  }

  io.to(`meeting:${meetingId}`).emit('transcript-chunk', data)
}

/**
 * Emit analysis started event
 */
export function emitAnalysisStarted(meetingId: string) {
  if (!io) return
  io.to(`meeting:${meetingId}`).emit('analysis-started')
}

/**
 * Emit analysis completed event
 */
export function emitAnalysisCompleted(meetingId: string, data: {
  itemsChecked: number
  totalItems: number
  completionRate: number
}) {
  if (!io) return
  io.to(`meeting:${meetingId}`).emit('analysis-completed', data)
}

export default { initializeWebSocket, getIO, emitItemChecked, emitTranscriptChunk }
