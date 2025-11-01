import { NextRequest, NextResponse } from 'next/server'
import { db, checklists, checklistItems, meetings, templates, templateItems } from '@/lib/db'
import { eq, and, desc } from 'drizzle-orm'
import { analyzeTranscriptWithAI } from '@/lib/ai/openai'

// GET /api/checklists - List checklists
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const meetingId = searchParams.get('meetingId')
    const userId = searchParams.get('userId')

    let query = db.select().from(checklists).$dynamic()

    const conditions = []

    if (meetingId) {
      conditions.push(eq(checklists.meetingId, meetingId))
    }

    if (userId) {
      conditions.push(eq(checklists.userId, userId))
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const results = await query.orderBy(desc(checklists.createdAt))

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error('Error fetching checklists:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch checklists' },
      { status: 500 }
    )
  }
}

// POST /api/checklists - Create a new checklist from template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { meetingId, templateId, userId } = body

    // Validate required fields
    if (!meetingId || !templateId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get template with items
    const [template] = await db
      .select()
      .from(templates)
      .where(eq(templates.id, templateId))

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }

    const items = await db
      .select()
      .from(templateItems)
      .where(eq(templateItems.templateId, templateId))
      .orderBy(templateItems.order)

    // Create checklist
    const [checklist] = await db
      .insert(checklists)
      .values({
        meetingId,
        templateId,
        userId,
        totalItems: items.length,
        completedItems: 0,
        completionRate: 0,
      })
      .returning()

    // Create checklist items from template
    if (items.length > 0) {
      const checklistItemsToCreate = items.map((item) => ({
        checklistId: checklist.id,
        templateItemId: item.id,
        title: item.title,
        description: item.description,
        order: item.order,
        required: item.required,
        isCompleted: false,
        aiKeywords: item.aiKeywords,
      }))

      await db.insert(checklistItems).values(checklistItemsToCreate)
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...checklist,
          items: items.length,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating checklist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create checklist' },
      { status: 500 }
    )
  }
}
