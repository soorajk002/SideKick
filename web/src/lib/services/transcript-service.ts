/**
 * Real-time transcript accumulation and management service
 * Handles streaming transcripts from Zoom and triggers AI analysis
 */

interface TranscriptChunk {
  text: string
  speaker?: string
  timestamp: Date
  confidence?: number
}

interface MeetingTranscript {
  meetingId: string
  chunks: TranscriptChunk[]
  fullText: string
  lastAnalyzedAt: Date | null
  lastAnalyzedLength: number
  wordCount: number
}

class TranscriptService {
  private transcripts: Map<string, MeetingTranscript> = new Map()
  private readonly MIN_WORDS_FOR_ANALYSIS = 50 // Minimum words before analyzing
  private readonly ANALYSIS_INTERVAL_MS = 30000 // 30 seconds between analyses

  /**
   * Add a transcript chunk for a meeting
   */
  addChunk(meetingId: string, chunk: TranscriptChunk): void {
    let transcript = this.transcripts.get(meetingId)

    if (!transcript) {
      transcript = {
        meetingId,
        chunks: [],
        fullText: '',
        lastAnalyzedAt: null,
        lastAnalyzedLength: 0,
        wordCount: 0,
      }
      this.transcripts.set(meetingId, transcript)
    }

    // Add chunk
    transcript.chunks.push(chunk)
    transcript.fullText += (transcript.fullText ? ' ' : '') + chunk.text
    transcript.wordCount = this.countWords(transcript.fullText)
  }

  /**
   * Check if meeting is ready for analysis
   */
  shouldAnalyze(meetingId: string): boolean {
    const transcript = this.transcripts.get(meetingId)
    if (!transcript) return false

    const now = new Date()

    // Check minimum word count
    const newWords = transcript.wordCount - this.countWords(
      transcript.fullText.substring(0, transcript.lastAnalyzedLength)
    )
    if (newWords < this.MIN_WORDS_FOR_ANALYSIS) return false

    // Check time interval
    if (transcript.lastAnalyzedAt) {
      const timeSinceLastAnalysis = now.getTime() - transcript.lastAnalyzedAt.getTime()
      if (timeSinceLastAnalysis < this.ANALYSIS_INTERVAL_MS) return false
    }

    return true
  }

  /**
   * Get new content since last analysis
   */
  getNewContent(meetingId: string): string | null {
    const transcript = this.transcripts.get(meetingId)
    if (!transcript) return null

    // Get only the new content since last analysis
    const newContent = transcript.fullText.substring(transcript.lastAnalyzedLength)
    return newContent.trim()
  }

  /**
   * Get full transcript
   */
  getFullTranscript(meetingId: string): string | null {
    const transcript = this.transcripts.get(meetingId)
    return transcript?.fullText || null
  }

  /**
   * Get transcript context (last N words + new content)
   * This provides context for AI without re-analyzing everything
   */
  getTranscriptContext(meetingId: string, contextWords: number = 200): {
    context: string
    newContent: string
  } | null {
    const transcript = this.transcripts.get(meetingId)
    if (!transcript) return null

    const newContent = this.getNewContent(meetingId) || ''

    // Get context from before the new content
    const words = transcript.fullText.substring(0, transcript.lastAnalyzedLength).split(/\s+/)
    const contextStart = Math.max(0, words.length - contextWords)
    const context = words.slice(contextStart).join(' ')

    return { context, newContent }
  }

  /**
   * Mark transcript as analyzed
   */
  markAnalyzed(meetingId: string): void {
    const transcript = this.transcripts.get(meetingId)
    if (!transcript) return

    transcript.lastAnalyzedAt = new Date()
    transcript.lastAnalyzedLength = transcript.fullText.length
  }

  /**
   * Get transcript stats
   */
  getStats(meetingId: string): {
    totalChunks: number
    totalWords: number
    newWordsSinceLastAnalysis: number
    timeSinceLastAnalysis: number | null
  } | null {
    const transcript = this.transcripts.get(meetingId)
    if (!transcript) return null

    const newWords = transcript.wordCount - this.countWords(
      transcript.fullText.substring(0, transcript.lastAnalyzedLength)
    )

    const timeSinceLastAnalysis = transcript.lastAnalyzedAt
      ? new Date().getTime() - transcript.lastAnalyzedAt.getTime()
      : null

    return {
      totalChunks: transcript.chunks.length,
      totalWords: transcript.wordCount,
      newWordsSinceLastAnalysis: newWords,
      timeSinceLastAnalysis,
    }
  }

  /**
   * Clear transcript for a meeting
   */
  clear(meetingId: string): void {
    this.transcripts.delete(meetingId)
  }

  /**
   * Clear all transcripts older than N hours
   */
  clearOld(hoursOld: number = 24): number {
    const cutoff = new Date(Date.now() - hoursOld * 60 * 60 * 1000)
    let cleared = 0

    for (const [meetingId, transcript] of this.transcripts.entries()) {
      const lastActivity = transcript.lastAnalyzedAt || transcript.chunks[0]?.timestamp
      if (lastActivity && lastActivity < cutoff) {
        this.transcripts.delete(meetingId)
        cleared++
      }
    }

    return cleared
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length
  }

  /**
   * Detect if there's a speaker change in recent chunks
   */
  hasSpeakerChange(meetingId: string, recentChunks: number = 5): boolean {
    const transcript = this.transcripts.get(meetingId)
    if (!transcript || transcript.chunks.length < 2) return false

    const recent = transcript.chunks.slice(-recentChunks)
    const speakers = new Set(recent.map(c => c.speaker).filter(Boolean))

    return speakers.size > 1
  }

  /**
   * Detect significant pause (gap between chunks)
   */
  hasSignificantPause(meetingId: string, pauseSeconds: number = 30): boolean {
    const transcript = this.transcripts.get(meetingId)
    if (!transcript || transcript.chunks.length < 2) return false

    const lastTwo = transcript.chunks.slice(-2)
    const gap = lastTwo[1].timestamp.getTime() - lastTwo[0].timestamp.getTime()

    return gap >= pauseSeconds * 1000
  }
}

// Singleton instance
export const transcriptService = new TranscriptService()

// Auto-cleanup old transcripts every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const cleared = transcriptService.clearOld(24)
    if (cleared > 0) {
      console.log(`Cleaned up ${cleared} old transcripts`)
    }
  }, 60 * 60 * 1000) // Every hour
}

export default transcriptService
