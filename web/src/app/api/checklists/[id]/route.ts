import { NextRequest, NextResponse } from 'next/server'
import { db, checklists, checklistItems } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { corsResponse, handleCorsOptions } from '@/lib/cors'

// Handle CORS preflight
export async function OPTIONS() {
  return handleCorsOptions()
}

// GET /api/checklists/[id] - Get checklist with items
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const checklistId = params.id

    const [checklist] = await db
      .select()
      .from(checklists)
      .where(eq(checklists.id, checklistId))

    if (!checklist) {
      return corsResponse(
        { success: false, error: 'Checklist not found' },
        { status: 404 }
      )
    }

    // Get checklist items
    const items = await db
      .select()
      .from(checklistItems)
      .where(eq(checklistItems.checklistId, checklistId))
      .orderBy(checklistItems.order)

    return corsResponse({
      success: true,
      data: {
        ...checklist,
        items,
      },
    })
  } catch (error) {
    console.error('Error fetching checklist:', error)
    return corsResponse(
      { success: false, error: 'Failed to fetch checklist' },
      { status: 500 }
    )
  }
}

// PATCH /api/checklists/[id] - Update checklist progress
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const checklistId = params.id
    const body = await request.json()

    // Check if checklist exists
    const [existingChecklist] = await db
      .select()
      .from(checklists)
      .where(eq(checklists.id, checklistId))

    if (!existingChecklist) {
      return corsResponse(
        { success: false, error: 'Checklist not found' },
        { status: 404 }
      )
    }

    // Calculate completion stats
    const items = await db
      .select()
      .from(checklistItems)
      .where(eq(checklistItems.checklistId, checklistId))

    const completedItems = items.filter((item) => item.isCompleted).length
    const totalItems = items.length
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

    // Update checklist
    const [updatedChecklist] = await db
      .update(checklists)
      .set({
        completedItems,
        completionPercentage: completionPercentage.toString(),
        aiAnalysis: body.aiAnalysis || existingChecklist.aiAnalysis,
        updatedAt: new Date(),
      })
      .where(eq(checklists.id, checklistId))
      .returning()

    return corsResponse({
      success: true,
      data: updatedChecklist,
    })
  } catch (error) {
    console.error('Error updating checklist:', error)
    return corsResponse(
      { success: false, error: 'Failed to update checklist' },
      { status: 500 }
    )
  }
}
