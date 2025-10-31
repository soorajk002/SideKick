import OpenAI from 'openai';
import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';
import { getDb } from '../db/index.js';
import { transcriptions, checklistMatches, checklists } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export class ConversationAnalyzer {
  private openai: OpenAI;
  private io: Server;
  private meetingId: string;
  private conversationHistory: Array<{ speaker: string; text: string }> = [];
  private checklistCache: Map<string, any> = new Map();

  constructor(io: Server, meetingId: string) {
    this.io = io;
    this.meetingId = meetingId;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      logger.warn('OpenAI API key not found. Conversation analysis will be disabled.');
      this.openai = null as any;
    } else {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async analyzeTranscription(
    text: string,
    speaker: string,
    checklistId: string
  ): Promise<void> {
    if (!this.openai) {
      logger.warn('OpenAI not configured, skipping analysis');
      return;
    }

    try {
      // Store transcription
      const db = getDb();
      const [transcription] = await db.insert(transcriptions).values({
        meetingId: this.meetingId,
        speaker,
        text,
        timestamp: new Date(),
      }).returning();

      // Add to conversation history
      this.conversationHistory.push({ speaker, text });

      // Keep only last 20 messages for context
      if (this.conversationHistory.length > 20) {
        this.conversationHistory.shift();
      }

      // Get checklist
      let checklist = this.checklistCache.get(checklistId);
      if (!checklist) {
        checklist = await db.query.checklists.findFirst({
          where: eq(checklists.id, checklistId),
        });
        if (checklist) {
          this.checklistCache.set(checklistId, checklist);
        }
      }

      if (!checklist) {
        logger.warn(`Checklist not found: ${checklistId}`);
        return;
      }

      // Get uncompleted items
      const items = checklist.items as any[];
      const uncompletedItems = items.filter((item: any) => !item.completed);

      if (uncompletedItems.length === 0) {
        logger.info('All checklist items completed');
        return;
      }

      // Analyze with AI
      const matches = await this.matchConversationToItems(
        this.conversationHistory,
        uncompletedItems
      );

      // Process matches
      for (const match of matches) {
        if (match.confidence >= 0.7) {
          // Store match in database
          await db.insert(checklistMatches).values({
            checklistId,
            itemId: match.itemId,
            transcriptionId: transcription.id,
            confidence: Math.round(match.confidence * 100),
            matchedText: text,
          });

          // Update checklist item
          const updatedItems = items.map((item: any) =>
            item.id === match.itemId
              ? {
                  ...item,
                  completed: true,
                  autoChecked: true,
                  matchConfidence: match.confidence,
                  matchedAt: new Date(),
                }
              : item
          );

          await db
            .update(checklists)
            .set({ items: updatedItems as any, updatedAt: new Date() })
            .where(eq(checklists.id, checklistId));

          // Update cache
          checklist.items = updatedItems;
          this.checklistCache.set(checklistId, checklist);

          // Emit event to clients
          this.io.to(this.meetingId).emit('item-checked', {
            itemId: match.itemId,
            confidence: match.confidence,
            matchedText: text,
          });

          logger.info(
            `Item auto-checked: ${match.itemId} (confidence: ${match.confidence})`
          );
        }
      }

      // Mark transcription as analyzed
      await db
        .update(transcriptions)
        .set({ analyzedAt: new Date() })
        .where(eq(transcriptions.id, transcription.id));

    } catch (error) {
      logger.error('Failed to analyze transcription:', error);
      throw error;
    }
  }

  private async matchConversationToItems(
    conversation: Array<{ speaker: string; text: string }>,
    items: any[]
  ): Promise<Array<{ itemId: string; confidence: number; reasoning: string }>> {
    try {
      const conversationContext = conversation
        .map((msg) => `${msg.speaker}: ${msg.text}`)
        .join('\n');

      const itemsList = items
        .map((item, idx) => `${idx + 1}. [ID: ${item.id}] ${item.content}`)
        .join('\n');

      const prompt = `You are analyzing a sales call conversation to determine which checklist items have been covered.

Conversation:
${conversationContext}

Checklist Items:
${itemsList}

For each checklist item, determine if it has been covered in the conversation. Consider:
- Direct mentions or discussions of the topic
- Implicit coverage (e.g., "What's your budget?" covers budget discussion)
- Partial coverage (discussed but not fully)

Respond in JSON format with an array of matches:
[
  {
    "itemId": "item-id",
    "confidence": 0.0-1.0,
    "reasoning": "brief explanation"
  }
]

Only include items that have been covered with confidence >= 0.5.`;

      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing sales conversations and matching them to checklist items. Respond only with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return [];
      }

      const result = JSON.parse(content);
      return Array.isArray(result) ? result : result.matches || [];

    } catch (error) {
      logger.error('Failed to match conversation to items:', error);
      return [];
    }
  }
}
