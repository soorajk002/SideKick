import { NextRequest, NextResponse } from 'next/server'
import { db, templates, templateItems } from '@/lib/db'
import { eq, and, or, ilike, desc } from 'drizzle-orm'

// GET /api/templates - List all templates with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const userId = searchParams.get('userId') // From session
    const isPublic = searchParams.get('public') === 'true'

    let query = db.select().from(templates).$dynamic()

    // Build where conditions
    const conditions = []

    if (search) {
      conditions.push(
        or(
          ilike(templates.name, `%${search}%`),
          ilike(templates.description, `%${search}%`)
        )
      )
    }

    if (category) {
      conditions.push(eq(templates.category, category))
    }

    if (isPublic) {
      conditions.push(eq(templates.isPublic, true))
    } else if (userId) {
      // Show public templates and user's private templates
      conditions.push(
        or(
          eq(templates.isPublic, true),
          eq(templates.createdBy, userId)
        )
      )
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const results = await query.orderBy(desc(templates.isFeatured), desc(templates.usageCount))

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST /api/templates - Create a new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      category,
      items,
      aiEnabled,
      aiPrompt,
      isPublic,
      organizationId,
      createdBy,
      tags
    } = body

    // Validate required fields
    if (!name || !organizationId || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create template
    const [template] = await db.insert(templates).values({
      name,
      description,
      category,
      aiEnabled: aiEnabled || false,
      aiPrompt,
      isPublic: isPublic || false,
      organizationId,
      createdBy,
      tags: tags || [],
    }).returning()

    // Create template items if provided
    if (items && items.length > 0) {
      const itemsToInsert = items.map((item: any, index: number) => ({
        templateId: template.id,
        title: item.title,
        description: item.description,
        order: index,
        required: item.required || false,
        aiKeywords: item.aiKeywords || [],
      }))

      await db.insert(templateItems).values(itemsToInsert)
    }

    return NextResponse.json({
      success: true,
      data: template,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
