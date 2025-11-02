import { NextRequest, NextResponse } from 'next/server'
import { db, checklistItems, checklists } from '@/lib/db'
import { eq, and } from 'drizzle-orm'

// PATCH /api/checklists/[id]/items/[itemId] - Toggle or update item
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const { id: checklistId, itemId } = params
    const body = await request.json()
    const { isCompleted, notes, completedBy, aiChecked, aiConfidence } = body

    // Check if item exists
    const [existingItem] = await db
      .select()
      .from(checklistItems)
      .where(
        and(
          eq(checklistItems.id, itemId),
          eq(checklistItems.checklistId, checklistId)
        )
      )

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: 'Checklist item not found' },
        { status: 404 }
      )
    }

    // Update item
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (typeof isCompleted === 'boolean') {
      updateData.isCompleted = isCompleted
      updateData.completedAt = isCompleted ? new Date() : null
      if (completedBy) {
        updateData.completedBy = completedBy
      }
    }

    if (notes !== undefined) {
      updateData.aiReasoning = notes
    }

    if (typeof aiChecked === 'boolean') {
      updateData.aiChecked = aiChecked
    }

    if (typeof aiConfidence === 'number') {
      updateData.aiConfidence = aiConfidence.toString()
    }

    const [updatedItem] = await db
      .update(checklistItems)
      .set(updateData)
      .where(eq(checklistItems.id, itemId))
      .returning()

    // Recalculate checklist completion
    const allItems = await db
      .select()
      .from(checklistItems)
      .where(eq(checklistItems.checklistId, checklistId))

    const completedCount = allItems.filter((item) => item.isCompleted).length
    const totalCount = allItems.length
    const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    await db
      .update(checklists)
      .set({
        completedItems: completedCount,
        completionPercentage: completionPercentage.toString(),
        updatedAt: new Date(),
      })
      .where(eq(checklists.id, checklistId))

    return NextResponse.json({
      success: true,
      data: updatedItem,
    })
  } catch (error) {
    console.error('Error updating checklist item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update checklist item' },
      { status: 500 }
    )
  }
}
