import { NextRequest, NextResponse } from 'next/server'
import { db, meetings, meetingNotes, actionItems } from '@/lib/db'
import { eq, and } from 'drizzle-orm'

// GET /api/meetings/[id]/notes - Get meeting notes and action items
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meetingId = params.id

    // Get meeting
    const [meeting] = await db
      .select()
      .from(meetings)
      .where(eq(meetings.id, meetingId))

    if (!meeting) {
      return NextResponse.json(
        { success: false, error: 'Meeting not found' },
        { status: 404 }
      )
    }

    // Get notes
    const notes = await db
      .select()
      .from(meetingNotes)
      .where(eq(meetingNotes.meetingId, meetingId))
      .orderBy(meetingNotes.createdAt)

    // Get action items
    const items = await db
      .select()
      .from(actionItems)
      .where(eq(actionItems.meetingId, meetingId))
      .orderBy(actionItems.createdAt)

    // Combine notes into single text
    const notesText = notes.map(n => n.content).join('\n\n')

    return NextResponse.json({
      success: true,
      data: {
        notes: notesText,
        actionItems: items,
      },
    })
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

// POST /api/meetings/[id]/notes - Save meeting notes and action items
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meetingId = params.id
    const body = await request.json()
    const { notes, actionItems: items, userId } = body

    // Get meeting
    const [meeting] = await db
      .select()
      .from(meetings)
      .where(eq(meetings.id, meetingId))

    if (!meeting) {
      return NextResponse.json(
        { success: false, error: 'Meeting not found' },
        { status: 404 }
      )
    }

    // Save notes (delete old ones first)
    await db.delete(meetingNotes).where(eq(meetingNotes.meetingId, meetingId))

    if (notes && notes.trim()) {
      await db.insert(meetingNotes).values({
        meetingId,
        userId: userId || meeting.hostUserId,
        content: notes,
      })
    }

    // Save action items (delete old ones first)
    await db.delete(actionItems).where(eq(actionItems.meetingId, meetingId))

    if (items && items.length > 0) {
      const itemsToInsert = items.map((item: any) => ({
        meetingId,
        checklistId: null,
        userId: userId || meeting.hostUserId,
        title: item.title,
        description: item.description || null,
        assignedTo: item.assignee || null,
        dueDate: item.dueDate ? new Date(item.dueDate) : null,
        isCompleted: item.completed || false,
        completedAt: item.completed ? new Date() : null,
      }))

      await db.insert(actionItems).values(itemsToInsert)
    }

    return NextResponse.json({
      success: true,
      message: 'Notes saved successfully',
    })
  } catch (error) {
    console.error('Error saving notes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save notes' },
      { status: 500 }
    )
  }
}
