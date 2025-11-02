import { NextRequest, NextResponse } from 'next/server'
import { db, meetings, checklists, checklistItems, templates } from '@/lib/db'
import { eq, and, sql, desc, gte, count, isNull } from 'drizzle-orm'

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const organizationId = searchParams.get('organizationId')
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const metric = searchParams.get('metric') // 'overview', 'templates', 'team', 'trends'

    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'organizationId is required' },
        { status: 400 }
      )
    }

    const dateConditions = []
    if (startDate) {
      dateConditions.push(gte(meetings.startTime, new Date(startDate)))
    }
    if (endDate) {
      dateConditions.push(gte(meetings.startTime, new Date(endDate)))
    }

    // Overview metrics
    if (!metric || metric === 'overview') {
      // Total meetings
      const totalMeetingsResult = await db
        .select({ count: count() })
        .from(meetings)
        .where(
          and(
            eq(meetings.organizationId, organizationId),
            isNull(meetings.deletedAt),
            ...dateConditions
          )
        )

      // Meetings with outcomes
      const wonMeetingsResult = await db
        .select({ count: count() })
        .from(meetings)
        .where(
          and(
            eq(meetings.organizationId, organizationId),
            eq(meetings.outcome, 'Closed Won'),
            isNull(meetings.deletedAt),
            ...dateConditions
          )
        )

      // Average completion rate
      const completionRates = await db
        .select({
          avgCompletion: sql<number>`AVG(CAST(completion_percentage AS FLOAT))`,
        })
        .from(checklists)
        .innerJoin(meetings, eq(meetings.id, checklists.meetingId))
        .where(
          and(
            eq(meetings.organizationId, organizationId),
            isNull(meetings.deletedAt),
            ...dateConditions
          )
        )

      // Total revenue
      const revenueResult = await db
        .select({
          totalRevenue: sql<number>`SUM(CAST(deal_value AS NUMERIC))`,
        })
        .from(meetings)
        .where(
          and(
            eq(meetings.organizationId, organizationId),
            eq(meetings.outcome, 'Closed Won'),
            isNull(meetings.deletedAt),
            ...dateConditions
          )
        )

      const totalMeetings = totalMeetingsResult[0]?.count || 0
      const wonMeetings = wonMeetingsResult[0]?.count || 0
      const winRate = totalMeetings > 0 ? (wonMeetings / totalMeetings) * 100 : 0
      const avgCompletionRate = completionRates[0]?.avgCompletion || 0
      const totalRevenue = revenueResult[0]?.totalRevenue || 0

      return NextResponse.json({
        success: true,
        data: {
          totalMeetings,
          wonMeetings,
          winRate: Math.round(winRate * 10) / 10,
          avgCompletionRate: Math.round(avgCompletionRate * 10) / 10,
          totalRevenue,
        },
      })
    }

    // Template performance
    if (metric === 'templates') {
      const templatePerformance = await db
        .select({
          templateId: checklists.templateId,
          templateName: templates.name,
          meetingCount: count(),
          avgCompletionRate: sql<number>`AVG(CAST(${checklists.completionPercentage} AS FLOAT))`,
          wonCount: sql<number>`SUM(CASE WHEN ${meetings.outcome} = 'Closed Won' THEN 1 ELSE 0 END)`,
        })
        .from(meetings)
        .innerJoin(checklists, eq(checklists.meetingId, meetings.id))
        .leftJoin(templates, eq(templates.id, checklists.templateId))
        .where(
          and(
            eq(meetings.organizationId, organizationId),
            isNull(meetings.deletedAt),
            ...dateConditions
          )
        )
        .groupBy(checklists.templateId, templates.name)
        .orderBy(desc(count()))

      return NextResponse.json({
        success: true,
        data: templatePerformance,
      })
    }

    // Team performance
    if (metric === 'team') {
      const teamPerformance = await db
        .select({
          userId: meetings.hostUserId,
          meetingCount: count(),
          avgCompletionRate: sql<number>`AVG(CAST(checklists.completion_percentage AS FLOAT))`,
          wonCount: sql<number>`SUM(CASE WHEN meetings.outcome = 'Closed Won' THEN 1 ELSE 0 END)`,
          totalRevenue: sql<number>`SUM(CAST(COALESCE(meetings.deal_value, 0) AS NUMERIC))`,
        })
        .from(meetings)
        .leftJoin(checklists, eq(checklists.meetingId, meetings.id))
        .where(
          and(
            eq(meetings.organizationId, organizationId),
            isNull(meetings.deletedAt),
            ...dateConditions
          )
        )
        .groupBy(meetings.hostUserId)
        .orderBy(desc(count()))

      return NextResponse.json({
        success: true,
        data: teamPerformance,
      })
    }

    // Completion trends over time
    if (metric === 'trends') {
      const trends = await db
        .select({
          date: sql<string>`DATE(meetings.started_at)`,
          avgCompletionRate: sql<number>`AVG(CAST(checklists.completion_percentage AS FLOAT))`,
          meetingCount: count(),
        })
        .from(meetings)
        .leftJoin(checklists, eq(checklists.meetingId, meetings.id))
        .where(
          and(
            eq(meetings.organizationId, organizationId),
            isNull(meetings.deletedAt),
            ...dateConditions
          )
        )
        .groupBy(sql`DATE(meetings.started_at)`)
        .orderBy(sql`DATE(meetings.started_at)`)

      return NextResponse.json({
        success: true,
        data: trends,
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid metric parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
