import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set. AI features will be disabled.')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
})

export interface ChecklistItem {
  id: string
  title: string
  description?: string
  required: boolean
  aiKeywords: string[]
}

export interface AICheckResult {
  itemId: string
  shouldCheck: boolean
  confidence: number
  reasoning: string
  evidenceSnippets: string[]
}

export interface AIAnalysisResult {
  checkedItems: AICheckResult[]
  summary: string
  sentiment: 'positive' | 'neutral' | 'negative'
  keyTopics: string[]
  recommendations: string[]
}

/**
 * Analyze meeting transcript and auto-check checklist items
 */
export async function analyzeTranscriptWithAI(
  transcript: string,
  checklistItems: ChecklistItem[],
  templatePrompt?: string
): Promise<AIAnalysisResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured')
  }

  const systemPrompt = `You are an AI assistant that analyzes sales call transcripts and determines which checklist items have been discussed or completed.

Your task is to:
1. Carefully read the meeting transcript
2. For each checklist item, determine if it was discussed or completed
3. Provide confidence scores (0-100) for each determination
4. Extract relevant snippets from the transcript as evidence
5. Provide an overall meeting summary and sentiment analysis
6. Identify key topics discussed
7. Offer recommendations for follow-up

Be thorough but conservative - only mark items as checked if you have clear evidence from the transcript.`

  const userPrompt = `${templatePrompt ? `Template Context: ${templatePrompt}\n\n` : ''}Meeting Transcript:
${transcript}

Checklist Items to Analyze:
${checklistItems.map((item, idx) => `${idx + 1}. ${item.title}${item.description ? ` - ${item.description}` : ''}${item.aiKeywords.length > 0 ? `\nKeywords: ${item.aiKeywords.join(', ')}` : ''}`).join('\n\n')}

Please analyze the transcript and provide a JSON response with the following structure:
{
  "checkedItems": [
    {
      "itemId": "item_id",
      "shouldCheck": true/false,
      "confidence": 0-100,
      "reasoning": "explanation of why this item should/shouldn't be checked",
      "evidenceSnippets": ["relevant quote from transcript"]
    }
  ],
  "summary": "2-3 sentence summary of the meeting",
  "sentiment": "positive/neutral/negative",
  "keyTopics": ["topic1", "topic2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // Lower temperature for more consistent analysis
      response_format: { type: 'json_object' },
    })

    const responseContent = completion.choices[0]?.message?.content

    if (!responseContent) {
      throw new Error('No response from OpenAI')
    }

    const analysis: AIAnalysisResult = JSON.parse(responseContent)

    return analysis
  } catch (error) {
    console.error('Error analyzing transcript with AI:', error)
    throw new Error('Failed to analyze transcript with AI')
  }
}

/**
 * Generate AI insights from meeting data
 */
export async function generateMeetingInsights(
  meetingData: {
    title: string
    transcript: string
    completionRate: number
    outcome?: string
    dealStage?: string
    dealValue?: number
  }
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured')
  }

  const systemPrompt = `You are an AI sales coach analyzing meeting performance. Provide actionable insights and recommendations based on the meeting data and transcript.`

  const userPrompt = `Meeting: ${meetingData.title}
Completion Rate: ${meetingData.completionRate}%
${meetingData.outcome ? `Outcome: ${meetingData.outcome}` : ''}
${meetingData.dealStage ? `Deal Stage: ${meetingData.dealStage}` : ''}
${meetingData.dealValue ? `Deal Value: $${meetingData.dealValue.toLocaleString()}` : ''}

Transcript:
${meetingData.transcript}

Provide 2-3 actionable insights about this meeting's performance and what could be improved.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 500,
    })

    const insights = completion.choices[0]?.message?.content || ''

    return insights
  } catch (error) {
    console.error('Error generating meeting insights:', error)
    throw new Error('Failed to generate meeting insights')
  }
}

/**
 * Generate template AI prompt suggestions
 */
export async function generateTemplatePrompt(
  templateName: string,
  templateDescription: string,
  items: ChecklistItem[]
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured')
  }

  const systemPrompt = `You are an AI assistant helping create effective prompts for sales call analysis. Generate a concise prompt that will help AI understand the context and goals of this sales template.`

  const userPrompt = `Template: ${templateName}
Description: ${templateDescription}

Checklist Items:
${items.map((item, idx) => `${idx + 1}. ${item.title}`).join('\n')}

Generate a 2-3 sentence prompt that explains what this template is for and what the AI should focus on when analyzing transcripts for this template.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    const prompt = completion.choices[0]?.message?.content || ''

    return prompt
  } catch (error) {
    console.error('Error generating template prompt:', error)
    throw new Error('Failed to generate template prompt')
  }
}

export default openai
