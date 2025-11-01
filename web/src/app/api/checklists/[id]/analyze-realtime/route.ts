import { NextRequest, NextResponse } from 'next/server'
import { db, checklists, checklistItems, meetings, templates } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { analyzeTranscriptRealtime, ChecklistItem } from '@/lib/ai/openai'
import transcriptService from '@/lib/services/transcript-service'
import { emitItemChecked, emitAnalysisStarted, emitAnalysisCompleted } from '@/lib/websocket/server'

/**
 * POST /api/checklists/[id]/analyze-realtime
 * Real-time analysis endpoint - called every 30 seconds with new transcript chunks
 * Uses GPT-4o-mini for fast, cheap analysis
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const checklistId = params.id
    const body = await request.json()
    const { transcriptChunk, speaker, userId } = body

    if (!transcriptChunk) {
      return NextResponse.json(
        { success: false, error: 'Transcript chunk is required' },
        { status: 400 }
      )
    }

    // Get checklist with items
    const [checklist] = await db
      .select()
      .from(checklists)
      .where(eq(checklists.id, checklistId))

    if (!checklist) {
      return NextResponse.json(
        { success: false, error: 'Checklist not found' },
        { status: 404 }
      )
    }

    // Get meeting
    const [meeting] = await db
      .select()
      .from(meetings)
      .where(eq(meetings.id, checklist.meetingId))

    if (!meeting) {
      return NextResponse.json(
        { success: false, error: 'Meeting not found' },
        { status: 404 }
      )
    }

    // Add transcript chunk to service
    transcriptService.addChunk(meeting.id, {
      text: transcriptChunk,
      speaker,
      timestamp: new Date(),
    })

    // Check if we should analyze
    if (!transcriptService.shouldAnalyze(meeting.id)) {
      const stats = transcriptService.getStats(meeting.id)
      return NextResponse.json({
        success: true,
        analyzed: false,
        message: 'Not enough new content to analyze yet',
        stats,
      })
    }

    // Emit analysis started event
    emitAnalysisStarted(meeting.id)

    // Get transcript context
    const transcriptData = transcriptService.getTranscriptContext(meeting.id, 200)

    if (!transcriptData) {
      return NextResponse.json(
        { success: false, error: 'No transcript data available' },
        { status: 400 }
      )
    }

    // Get checklist items
    const items = await db
      .select()
      .from(checklistItems)
      .where(eq(checklistItems.checklistId, checklistId))
      .orderBy(checklistItems.order)

    // Convert to AI format
    const aiItems: ChecklistItem[] = items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || undefined,
      required: item.required,
      aiKeywords: item.aiKeywords || [],
    }))

    // Get already checked item IDs
    const alreadyCheckedItemIds = items
      .filter((item) => item.isCompleted)
      .map((item) => item.id)

    // Run real-time AI analysis (GPT-4o-mini)
    const results = await analyzeTranscriptRealtime(
      transcriptData.newContent,
      transcriptData.context,
      aiItems,
      alreadyCheckedItemIds
    )

    // Update items that should be checked (confidence >= 70)
    let itemsChecked = 0
    for (const result of results) {
      if (result.shouldCheck && result.confidence >= 70) {
        // Update in database
        await db
          .update(checklistItems)
          .set({
            isCompleted: true,
            completedAt: new Date(),
            completedBy: 'AI',
            aiChecked: true,
            aiConfidence: result.confidence,
            notes: `AI (realtime): ${result.reasoning}\n\nEvidence: ${result.evidenceSnippets.join('; ')}`,
            updatedAt: new Date(),
          })
          .where(eq(checklistItems.id, result.itemId))

        // Find the item title
        const item = items.find((i) => i.id === result.itemId)

        // Emit WebSocket event for instant update
        emitItemChecked(meeting.id, {
          itemId: result.itemId,
          checklistId: checklistId,
          title: item?.title || 'Unknown item',
          confidence: result.confidence,
          reasoning: result.reasoning,
          evidence: result.evidenceSnippets,
        })

        itemsChecked++
      }
    }

    // Recalculate completion stats
    const updatedItems = await db
      .select()
      .from(checklistItems)
      .where(eq(checklistItems.checklistId, checklistId))

    const completedCount = updatedItems.filter((item) => item.isCompleted).length
    const totalCount = updatedItems.length
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    // Update checklist
    await db
      .update(checklists)
      .set({
        completedItems: completedCount,
        completionRate,
        updatedAt: new Date(),
      })
      .where(eq(checklists.id, checklistId))

    // Mark as analyzed in service
    transcriptService.markAnalyzed(meeting.id)

    // Emit analysis completed event
    emitAnalysisCompleted(meeting.id, {
      itemsChecked,
      totalItems: totalCount,
      completionRate,
    })

    return NextResponse.json({
      success: true,
      analyzed: true,
      itemsChecked,
      completionRate,
      results: results.map(r => ({
        itemId: r.itemId,
        confidence: r.confidence,
        checked: r.shouldCheck && r.confidence >= 70,
      })),
    })
  } catch (error) {
    console.error('Error in real-time analysis:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze',
      },
      { status: 500 }
    )
  }
}
