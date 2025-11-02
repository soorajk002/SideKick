import { NextRequest, NextResponse } from 'next/server'
import { db, meetings, checklists, checklistItems } from '@/lib/db'
import { eq, and, or, ilike, desc, gte, lte, isNull } from 'drizzle-orm'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET /api/meetings - List all meetings with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const outcome = searchParams.get('outcome')
    const templateId = searchParams.get('templateId')
    const userId = searchParams.get('userId')
    const organizationId = searchParams.get('organizationId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = db.select().from(meetings).$dynamic()

    const conditions = []

    if (search) {
      conditions.push(
        or(
          ilike(meetings.title, `%${search}%`),
          ilike(meetings.zoomMeetingId, `%${search}%`)
        )
      )
    }

    if (outcome) {
      conditions.push(eq(meetings.outcome, outcome))
    }

    // Template ID filtering would require joining with checklists table
    // Skipped for now to keep query simple
    // if (templateId) {
    //   conditions.push(eq(checklists.templateId, templateId))
    // }

    if (userId) {
      conditions.push(eq(meetings.hostUserId, userId))
    }

    if (organizationId) {
      conditions.push(eq(meetings.organizationId, organizationId))
    }

    if (startDate) {
      conditions.push(gte(meetings.startTime, new Date(startDate)))
    }

    if (endDate) {
      conditions.push(lte(meetings.startTime, new Date(endDate)))
    }

    // Only show non-deleted meetings
    conditions.push(isNull(meetings.deletedAt))

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const results = await query.orderBy(desc(meetings.startTime))

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error('Error fetching meetings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch meetings' },
      { status: 500 }
    )
  }
}

// POST /api/meetings - Create a new meeting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      zoomMeetingId,
      templateId,
      hostUserId,
      organizationId,
      startedAt,
      participants,
      dealStage,
      dealValue
    } = body

    // Validate required fields
    if (!zoomMeetingId || !hostUserId || !organizationId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create meeting
    const [meeting] = await db.insert(meetings).values({
      title: title || `Meeting ${zoomMeetingId}`,
      zoomMeetingId,
      hostUserId,
      organizationId,
      startTime: startedAt ? new Date(startedAt) : new Date(),
      participants: participants || [],
      dealStage,
      dealValue,
    }).returning()

    return NextResponse.json({
      success: true,
      data: meeting,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating meeting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create meeting' },
      { status: 500 }
    )
  }
}
