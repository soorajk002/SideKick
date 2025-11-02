import { NextRequest, NextResponse } from 'next/server'
import { db, templates, templateItems } from '@/lib/db'
import { eq } from 'drizzle-orm'

// GET /api/templates/[id] - Get a specific template with items
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id

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

    // Get template items
    const items = await db
      .select()
      .from(templateItems)
      .where(eq(templateItems.templateId, templateId))
      .orderBy(templateItems.order)

    return NextResponse.json({
      success: true,
      data: {
        ...template,
        items,
      },
    })
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

// PUT /api/templates/[id] - Update a template
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
    const body = await request.json()
    const {
      name,
      description,
      category,
      items,
      aiEnabled,
      aiPrompt,
      isPublic,
      tags
    } = body

    // Check if template exists
    const [existingTemplate] = await db
      .select()
      .from(templates)
      .where(eq(templates.id, templateId))

    if (!existingTemplate) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }

    // Update template
    const [updatedTemplate] = await db
      .update(templates)
      .set({
        name,
        description,
        category,
        aiEnabled,
        aiPrompt,
        isPublic,
        tags,
        updatedAt: new Date(),
      })
      .where(eq(templates.id, templateId))
      .returning()

    // Update items if provided
    if (items) {
      // Delete existing items
      await db.delete(templateItems).where(eq(templateItems.templateId, templateId))

      // Insert new items
      if (items.length > 0) {
        const itemsToInsert = items.map((item: any, index: number) => ({
          templateId: templateId,
          title: item.title,
          description: item.description,
          order: index,
          required: item.isRequired || false,
          aiKeywords: item.aiKeywords || [],
        }))

        await db.insert(templateItems).values(itemsToInsert)
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedTemplate,
    })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

// DELETE /api/templates/[id] - Delete a template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id

    // Check if template exists
    const [existingTemplate] = await db
      .select()
      .from(templates)
      .where(eq(templates.id, templateId))

    if (!existingTemplate) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }

    // Soft delete by setting deletedAt
    await db
      .update(templates)
      .set({ deletedAt: new Date() })
      .where(eq(templates.id, templateId))

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
