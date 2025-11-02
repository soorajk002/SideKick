import { NextRequest, NextResponse } from 'next/server'
import { db, meetings, checklists, checklistItems, meetingNotes, actionItems, templates } from '@/lib/db'
import { eq } from 'drizzle-orm'

// GET /api/meetings/[id]/export?format=pdf|markdown
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meetingId = params.id
    const format = request.nextUrl.searchParams.get('format') || 'markdown'

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

    // Get checklist with items
    const [checklist] = await db
      .select()
      .from(checklists)
      .where(eq(checklists.meetingId, meetingId))

    let checklistData: any = null
    if (checklist) {
      const items = await db
        .select()
        .from(checklistItems)
        .where(eq(checklistItems.checklistId, checklist.id))
        .orderBy(checklistItems.order)

      // Get template name
      let templateName = 'Custom Checklist'
      if (checklist.templateId) {
        const [template] = await db
          .select()
          .from(templates)
          .where(eq(templates.id, checklist.templateId))

        if (template) {
          templateName = template.name
        }
      }

      checklistData = {
        ...checklist,
        templateName,
        items,
      }
    }

    // Get notes
    const notes = await db
      .select()
      .from(meetingNotes)
      .where(eq(meetingNotes.meetingId, meetingId))

    // Get action items
    const items = await db
      .select()
      .from(actionItems)
      .where(eq(actionItems.meetingId, meetingId))

    if (format === 'markdown') {
      const markdown = generateMarkdown(meeting, checklistData, notes, items)

      return new NextResponse(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="meeting-${meetingId}.md"`,
        },
      })
    } else if (format === 'pdf') {
      // For PDF, we'll generate HTML and return it
      // In production, use a library like puppeteer or PDFKit
      const html = generateHTML(meeting, checklistData, notes, items)

      return new NextResponse(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `inline; filename="meeting-${meetingId}.html"`,
        },
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid format' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error exporting meeting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export meeting' },
      { status: 500 }
    )
  }
}

function generateMarkdown(
  meeting: any,
  checklist: any,
  notes: any[],
  actionItems: any[]
): string {
  const date = new Date(meeting.startedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const time = new Date(meeting.startedAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  let md = `# ${meeting.title || 'Meeting Summary'}\n\n`
  md += `**Date:** ${date}\n`
  md += `**Time:** ${time}\n`

  if (meeting.duration) {
    md += `**Duration:** ${meeting.duration} minutes\n`
  }

  if (meeting.outcome) {
    md += `**Outcome:** ${meeting.outcome}\n`
  }

  md += `\n---\n\n`

  // Checklist
  if (checklist) {
    md += `## 📋 Checklist: ${checklist.templateName}\n\n`
    md += `**Completion Rate:** ${checklist.completionPercentage}%\n\n`

    checklist.items.forEach((item: any) => {
      const checkbox = item.isCompleted ? '[x]' : '[ ]'
      md += `${checkbox} **${item.title}**\n`

      if (item.description) {
        md += `   ${item.description}\n`
      }

      if (item.aiChecked && item.aiConfidence) {
        md += `   _AI detected (${item.aiConfidence}% confidence)_\n`
      }

      if (item.notes) {
        md += `   > ${item.notes}\n`
      }

      md += `\n`
    })

    md += `\n`
  }

  // AI Summary
  if (meeting.aiSummary) {
    md += `## 🤖 AI Summary\n\n`
    md += `${meeting.aiSummary}\n\n`

    if (meeting.aiSentiment) {
      const sentimentEmoji = {
        positive: '😊',
        neutral: '😐',
        negative: '😟',
      }[meeting.aiSentiment as 'positive' | 'neutral' | 'negative'] || '😐'

      md += `**Sentiment:** ${sentimentEmoji} ${meeting.aiSentiment}\n\n`
    }
  }

  // Notes
  if (notes.length > 0) {
    md += `## 📝 Notes\n\n`
    notes.forEach((note) => {
      md += `${note.content}\n\n`
    })
  }

  // Action Items
  if (actionItems.length > 0) {
    md += `## ✅ Action Items\n\n`
    actionItems.forEach((item) => {
      const checkbox = item.isCompleted ? '[x]' : '[ ]'
      md += `${checkbox} ${item.title}\n`

      if (item.assignedTo) {
        md += `   Assigned to: ${item.assignedTo}\n`
      }

      if (item.dueDate) {
        const due = new Date(item.dueDate).toLocaleDateString()
        md += `   Due: ${due}\n`
      }

      md += `\n`
    })
  }

  // Deal Information
  if (meeting.dealStage || meeting.dealValue) {
    md += `\n---\n\n## 💼 Deal Information\n\n`

    if (meeting.dealStage) {
      md += `**Stage:** ${meeting.dealStage}\n`
    }

    if (meeting.dealValue) {
      md += `**Value:** $${meeting.dealValue.toLocaleString()}\n`
    }
  }

  md += `\n---\n\n_Generated by Sidekick_\n`

  return md
}

function generateHTML(
  meeting: any,
  checklist: any,
  notes: any[],
  actionItems: any[]
): string {
  const date = new Date(meeting.startedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const time = new Date(meeting.startedAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${meeting.title || 'Meeting Summary'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      color: #1f2937;
      line-height: 1.6;
    }
    h1 {
      color: #111827;
      border-bottom: 3px solid #6366f1;
      padding-bottom: 10px;
    }
    h2 {
      color: #374151;
      margin-top: 30px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
    }
    .meta {
      color: #6b7280;
      margin: 20px 0;
    }
    .checklist-item {
      margin: 15px 0;
      padding: 12px;
      background: #f9fafb;
      border-left: 4px solid #d1d5db;
      border-radius: 4px;
    }
    .checklist-item.completed {
      border-left-color: #10b981;
      background: #ecfdf5;
    }
    .checkbox {
      display: inline-block;
      width: 18px;
      height: 18px;
      border: 2px solid #9ca3af;
      border-radius: 3px;
      margin-right: 10px;
      vertical-align: middle;
    }
    .checkbox.checked {
      background: #10b981;
      border-color: #10b981;
      position: relative;
    }
    .checkbox.checked::after {
      content: '✓';
      color: white;
      font-weight: bold;
      position: absolute;
      top: -2px;
      left: 3px;
    }
    .ai-badge {
      display: inline-block;
      background: #dbeafe;
      color: #1e40af;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      margin-left: 10px;
    }
    .action-item {
      margin: 10px 0;
      padding: 10px;
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      border-radius: 4px;
    }
    .sentiment {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
    }
    .sentiment.positive { background: #d1fae5; color: #065f46; }
    .sentiment.neutral { background: #e5e7eb; color: #374151; }
    .sentiment.negative { background: #fee2e2; color: #991b1b; }
    @media print {
      body { margin: 0; padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <h1>${meeting.title || 'Meeting Summary'}</h1>

  <div class="meta">
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Time:</strong> ${time}</p>
    ${meeting.duration ? `<p><strong>Duration:</strong> ${meeting.duration} minutes</p>` : ''}
    ${meeting.outcome ? `<p><strong>Outcome:</strong> ${meeting.outcome}</p>` : ''}
  </div>

  <hr>
`

  // Checklist
  if (checklist) {
    html += `
  <h2>📋 Checklist: ${checklist.templateName}</h2>
  <p><strong>Completion Rate:</strong> ${checklist.completionPercentage}%</p>
`

    checklist.items.forEach((item: any) => {
      html += `
  <div class="checklist-item ${item.isCompleted ? 'completed' : ''}">
    <span class="checkbox ${item.isCompleted ? 'checked' : ''}"></span>
    <strong>${item.title}</strong>
    ${item.aiChecked ? `<span class="ai-badge">AI ${item.aiConfidence}%</span>` : ''}
    ${item.description ? `<p style="margin: 8px 0 0 28px; color: #6b7280;">${item.description}</p>` : ''}
    ${item.notes ? `<p style="margin: 8px 0 0 28px; font-style: italic; color: #4b5563;">${item.notes}</p>` : ''}
  </div>
`
    })
  }

  // AI Summary
  if (meeting.aiSummary) {
    html += `
  <h2>🤖 AI Summary</h2>
  <p>${meeting.aiSummary}</p>
`

    if (meeting.aiSentiment) {
      html += `<p><span class="sentiment ${meeting.aiSentiment}">${meeting.aiSentiment}</span></p>`
    }
  }

  // Notes
  if (notes.length > 0) {
    html += `<h2>📝 Notes</h2>`
    notes.forEach((note) => {
      html += `<p>${note.content}</p>`
    })
  }

  // Action Items
  if (actionItems.length > 0) {
    html += `<h2>✅ Action Items</h2>`
    actionItems.forEach((item) => {
      html += `
  <div class="action-item">
    <span class="checkbox ${item.isCompleted ? 'checked' : ''}"></span>
    ${item.title}
    ${item.assignedTo ? `<p style="margin: 5px 0 0 28px;"><em>Assigned to: ${item.assignedTo}</em></p>` : ''}
    ${item.dueDate ? `<p style="margin: 5px 0 0 28px;"><em>Due: ${new Date(item.dueDate).toLocaleDateString()}</em></p>` : ''}
  </div>
`
    })
  }

  // Deal Information
  if (meeting.dealStage || meeting.dealValue) {
    html += `
  <hr>
  <h2>💼 Deal Information</h2>
  ${meeting.dealStage ? `<p><strong>Stage:</strong> ${meeting.dealStage}</p>` : ''}
  ${meeting.dealValue ? `<p><strong>Value:</strong> $${meeting.dealValue.toLocaleString()}</p>` : ''}
`
  }

  html += `
  <hr>
  <p style="text-align: center; color: #9ca3af; margin-top: 40px;">Generated by Sidekick</p>

  <div class="no-print" style="margin-top: 30px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
      Print / Save as PDF
    </button>
  </div>
</body>
</html>
`

  return html
}
