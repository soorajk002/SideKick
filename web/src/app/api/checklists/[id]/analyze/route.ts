import { NextRequest, NextResponse } from 'next/server'
import { db, checklists, checklistItems, meetings, templates, organizations, templateItems } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { analyzeTranscriptWithAI, ChecklistItem } from '@/lib/ai/openai'

// POST /api/checklists/[id]/analyze - Run AI analysis on checklist
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const checklistId = params.id
    const body = await request.json()
    const { transcript, userId } = body

    if (!transcript) {
      return NextResponse.json(
        { success: false, error: 'Transcript is required' },
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

    // Get meeting details
    if (!checklist.meetingId) {
      return NextResponse.json(
        { success: false, error: 'Checklist has no associated meeting' },
        { status: 400 }
      )
    }

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

    // Check AI credits
    if (!meeting.organizationId) {
      return NextResponse.json(
        { success: false, error: 'Meeting has no organization' },
        { status: 400 }
      )
    }

    const [organization] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, meeting.organizationId))

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Check if organization has AI credits
    if (
      organization.aiCreditsLimit !== null &&
      (organization.aiCreditsUsed || 0) >= organization.aiCreditsLimit
    ) {
      return NextResponse.json(
        { success: false, error: 'AI credits limit reached. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Get template for AI prompt
    let templatePrompt: string | undefined
    if (checklist.templateId) {
      const [template] = await db
        .select()
        .from(templates)
        .where(eq(templates.id, checklist.templateId))

      templatePrompt = (template?.aiPrompts as string | undefined) || undefined
    }

    // Get checklist items with template info (for isRequired field)
    const items = await db
      .select({
        id: checklistItems.id,
        checklistId: checklistItems.checklistId,
        templateItemId: checklistItems.templateItemId,
        title: checklistItems.title,
        description: checklistItems.description,
        order: checklistItems.order,
        isCompleted: checklistItems.isCompleted,
        completedAt: checklistItems.completedAt,
        completedBy: checklistItems.completedBy,
        aiChecked: checklistItems.aiChecked,
        aiConfidence: checklistItems.aiConfidence,
        aiReasoning: checklistItems.aiReasoning,
        aiEvidence: checklistItems.aiEvidence,
        isRequired: templateItems.isRequired,
        aiKeywords: templateItems.aiKeywords,
      })
      .from(checklistItems)
      .leftJoin(templateItems, eq(checklistItems.templateItemId, templateItems.id))
      .where(eq(checklistItems.checklistId, checklistId))
      .orderBy(checklistItems.order)

    // Convert to AI format
    const aiItems: ChecklistItem[] = items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || undefined,
      required: item.isRequired ?? false,
      aiKeywords: item.aiKeywords || [],
    }))

    // Run AI analysis
    const analysis = await analyzeTranscriptWithAI(transcript, aiItems, templatePrompt)

    // Update checklist items based on AI results
    for (const result of analysis.checkedItems) {
      if (result.shouldCheck && result.confidence >= 70) {
        // Auto-check items with high confidence
        await db
          .update(checklistItems)
          .set({
            isCompleted: true,
            completedAt: new Date(),
            completedBy: userId || null,
            aiChecked: true,
            aiConfidence: result.confidence.toString(),
            aiReasoning: `AI: ${result.reasoning}\n\nEvidence: ${result.evidenceSnippets.join('; ')}`,
            updatedAt: new Date(),
          })
          .where(eq(checklistItems.id, result.itemId))
      }
    }

    // Recalculate completion stats
    const updatedItems = await db
      .select()
      .from(checklistItems)
      .where(eq(checklistItems.checklistId, checklistId))

    const completedCount = updatedItems.filter((item) => item.isCompleted).length
    const totalCount = updatedItems.length
    const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    // Update checklist with AI analysis
    const [updatedChecklist] = await db
      .update(checklists)
      .set({
        completedItems: completedCount,
        completionPercentage: completionPercentage.toString(),
        aiAnalysis: {
          summary: analysis.summary,
          sentiment: analysis.sentiment,
          keyTopics: analysis.keyTopics,
          recommendations: analysis.recommendations,
          analyzedAt: new Date().toISOString(),
        },
        updatedAt: new Date(),
      })
      .where(eq(checklists.id, checklistId))
      .returning()

    // Update meeting with transcript and AI summary
    await db
      .update(meetings)
      .set({
        transcriptText: transcript,
        aiSummary: analysis.summary,
        aiSentiment: analysis.sentiment,
        aiAnalyzedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(meetings.id, meeting.id))

    // Increment AI credits used
    await db
      .update(organizations)
      .set({
        aiCreditsUsed: (organization.aiCreditsUsed || 0) + 1,
      })
      .where(eq(organizations.id, organization.id))

    return NextResponse.json({
      success: true,
      data: {
        checklist: updatedChecklist,
        analysis,
        creditsRemaining:
          organization.aiCreditsLimit !== null
            ? organization.aiCreditsLimit - (organization.aiCreditsUsed || 0) - 1
            : null,
      },
    })
  } catch (error) {
    console.error('Error analyzing checklist:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to analyze checklist' },
      { status: 500 }
    )
  }
}
