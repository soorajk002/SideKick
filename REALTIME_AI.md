# Real-Time AI Auto-Checking 🚀

## Overview

Sidekick now features **hybrid real-time auto-checking** that automatically checks off checklist items **as you speak** during Zoom meetings!

## How It Works

### Hybrid Approach (Best Cost + Performance)

We use a smart combination of two AI models:

1. **Real-Time Checking (GPT-4o-mini)** - During the meeting
   - Analyzes conversation every 30 seconds
   - Fast, cheap, accurate for binary decisions
   - Auto-checks items with ≥70% confidence
   - **Cost: ~$0.03 per 30-min meeting**

2. **Post-Meeting Summary (GPT-4 Turbo)** - After call ends
   - Deep analysis of full transcript
   - Detailed insights, sentiment, recommendations
   - Coaching suggestions
   - **Cost: ~$0.13 per meeting**

**Total Cost: ~$0.16 per meeting** (100 meetings = $16/month)

---

## Architecture

```
┌─────────────────┐
│  Zoom Meeting   │
│  (Live Audio)   │
└────────┬────────┘
         │
         │ Live Transcription
         ▼
┌─────────────────────────┐
│ Zoom Webhook Handler    │
│ /api/webhooks/zoom      │
│                         │
│ Event: meeting.live_    │
│   transcription.message │
└────────┬────────────────┘
         │
         │ Transcript Chunk
         ▼
┌──────────────────────────┐
│  Transcript Service      │
│  - Accumulates chunks    │
│  - Detects analysis      │
│    triggers (30s, 50+    │
│    words, speaker change)│
└────────┬─────────────────┘
         │
         │ Should Analyze?
         ▼
┌───────────────────────────┐
│ Real-Time Analysis API    │
│ /api/checklists/[id]/     │
│   analyze-realtime        │
│                           │
│ GPT-4o-mini:              │
│ - Context: last 200 words │
│ - New: latest chunk       │
│ - Items: unchecked only   │
│ - Response: < 500 tokens  │
└────────┬──────────────────┘
         │
         │ Items to Check
         ▼
┌────────────────────────────┐
│  Database Update           │
│  - Mark items completed    │
│  - Store confidence score  │
│  - Save AI reasoning       │
└────────┬───────────────────┘
         │
         │ WebSocket Emit
         ▼
┌────────────────────────────┐
│  Frontend (Zoom App)       │
│  - Item checks off ✅      │
│  - Show confidence %       │
│  - Display reasoning       │
└────────────────────────────┘
```

---

## Smart Triggers

The system analyzes when it detects:

1. **Time-based**: Every 30 seconds minimum
2. **Content-based**: At least 50 new words accumulated
3. **Event-based** (future):
   - Speaker changes
   - Significant pauses (30+ seconds)
   - Manual item check (validate with AI)

---

## API Endpoints

### 1. Real-Time Analysis
```
POST /api/checklists/{checklistId}/analyze-realtime

Body:
{
  "transcriptChunk": "new conversation text",
  "speaker": "John Doe",
  "userId": "user-123"
}

Response:
{
  "success": true,
  "analyzed": true,
  "itemsChecked": 2,
  "completionRate": 67,
  "results": [
    {
      "itemId": "item-1",
      "confidence": 85,
      "checked": true
    }
  ]
}
```

### 2. Post-Call Analysis
```
POST /api/checklists/{checklistId}/analyze

Body:
{
  "transcript": "full meeting transcript",
  "userId": "user-123"
}

Response:
{
  "success": true,
  "data": {
    "checklist": {...},
    "analysis": {
      "summary": "Meeting summary...",
      "sentiment": "positive",
      "keyTopics": ["pricing", "timeline"],
      "recommendations": [...]
    },
    "creditsRemaining": 42
  }
}
```

### 3. Zoom Webhook
```
POST /api/webhooks/zoom

Handles events:
- endpoint.url_validation (setup)
- meeting.live_transcription.message (real-time)
- meeting.ended (cleanup)
- recording.completed (post-call transcript)
- meeting.transcript_completed (fallback)
```

---

## WebSocket Events

### Server → Client

**item-checked** - Item auto-checked by AI
```javascript
{
  itemId: "item-123",
  checklistId: "checklist-456",
  title: "Budget discussion",
  confidence: 85,
  reasoning: "Prospect mentioned budget of $50K",
  evidence: ["Our budget is around $50,000"]
}
```

**transcript-chunk** - Live transcription chunk
```javascript
{
  text: "So our budget is around fifty thousand",
  speaker: "John Doe",
  timestamp: "2024-01-15T10:30:00Z"
}
```

**analysis-started** - AI analysis beginning
```javascript
{} // No payload
```

**analysis-completed** - AI analysis finished
```javascript
{
  itemsChecked: 2,
  totalItems: 6,
  completionRate: 67
}
```

### Client → Server

**join-meeting** - Join meeting room
```javascript
socket.emit('join-meeting', 'meeting-id-123')
```

**leave-meeting** - Leave meeting room
```javascript
socket.emit('leave-meeting', 'meeting-id-123')
```

---

## Cost Analysis

### Monthly Costs (100 meetings)

| Component | Cost per Meeting | Total (100) |
|-----------|-----------------|-------------|
| Real-time (GPT-4o-mini) | $0.03 | $3.00 |
| Post-call (GPT-4 Turbo) | $0.13 | $13.00 |
| **Total AI Cost** | **$0.16** | **$16.00** |

### Profit Margins

**Pro Plan: $29/user/month**
- AI costs: $16/month (100 meetings)
- Infrastructure: ~$3/month
- **Profit: $10/month (34% margin)**

**Free Plan: 5 meetings**
- AI costs: $0.80
- Cost to acquire user: Very low
- **Great for viral growth!**

---

## Setup Instructions

### 1. Environment Variables

Add to `.env`:
```bash
# OpenAI
OPENAI_API_KEY=sk-your-key-here

# Zoom Webhooks
ZOOM_WEBHOOK_SECRET=your-webhook-secret

# App URL (for webhook callbacks)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. Zoom Marketplace Configuration

1. Go to Zoom Marketplace → Your App → Features
2. Enable **"Live Transcription"**
3. Go to Event Subscriptions
4. Add event: `meeting.live_transcription.message`
5. Set endpoint URL: `https://yourdomain.com/api/webhooks/zoom`
6. Verify endpoint

### 3. Start Development Server

```bash
cd web
npm run dev  # Runs custom server with WebSocket
```

The server will start on http://localhost:3001 with WebSocket at ws://localhost:3001/api/socket

### 4. Test Real-Time

1. Start a Zoom meeting with the app
2. Create a checklist from template
3. Start talking about checklist items
4. Watch items auto-check every ~30 seconds! ✅

---

## Debugging

### Enable Verbose Logging

```javascript
// In frontend checklistStore.ts
socket.on('item-checked', (data) => {
  console.log('✅ AUTO-CHECKED:', data)
  // Item will auto-check in UI
})
```

### Check Transcript Service Stats

```javascript
// In API endpoint
const stats = transcriptService.getStats(meetingId)
console.log('Transcript stats:', stats)
```

### Monitor WebSocket Connections

```javascript
// In server
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  console.log('Total connections:', io.engine.clientsCount)
})
```

---

## Performance Optimizations

1. **Debouncing**: Won't analyze if < 50 new words
2. **Caching**: Only sends new content to AI, not full transcript
3. **Context Window**: Only last 200 words for context
4. **Max Tokens**: Limited to 500 for fast responses
5. **Temperature**: 0.2 for consistent results

---

## Future Enhancements

- [ ] Speaker diarization for better context
- [ ] Multi-language support
- [ ] Custom confidence thresholds per item
- [ ] Manual AI trigger button
- [ ] Real-time suggestions (not just checking)
- [ ] Integration with CRM for deal data
- [ ] Voice tone analysis
- [ ] Competitor mention detection

---

## Support

Issues? Questions?
- GitHub: https://github.com/yourusername/sidekick/issues
- Email: support@yourdomain.com

---

**Built with ❤️ using GPT-4o-mini + GPT-4 Turbo**
