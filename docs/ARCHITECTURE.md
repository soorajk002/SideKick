# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Zoom Meeting                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    SideKick Sidebar                     │ │
│  │                   (React Frontend)                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Zoom Apps SDK
                           │ WebSocket
                           │ REST API
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Server                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Express    │  │  Socket.IO   │  │    Zoom      │      │
│  │   REST API   │  │   WebSocket  │  │   Webhooks   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                           │                                  │
│  ┌────────────────────────┴────────────────────────┐       │
│  │        Conversation Analyzer (OpenAI)           │       │
│  └────────────────────────┬────────────────────────┘       │
└───────────────────────────┼─────────────────────────────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │  PostgreSQL  │
                   │   Database   │
                   └──────────────┘
```

## Components

### 1. Frontend (React + Zoom Apps SDK)

**Location:** `/frontend`

**Key Technologies:**
- React 18 with TypeScript
- Zoom Apps SDK (v0.16+)
- Zustand for state management
- Tailwind CSS for styling
- Socket.io client for real-time updates

**Key Features:**
- Sidebar app that runs inside Zoom meeting
- Real-time checklist display and updates
- Template selection interface
- Manual and automatic item checking
- Live conversation indicator

**Store Structure:**
- `zoomStore`: Manages Zoom SDK connection and meeting context
- `checklistStore`: Manages checklists, items, and WebSocket connection

### 2. Backend (Node.js + Express)

**Location:** `/backend`

**Key Technologies:**
- Node.js 18+ with TypeScript
- Express.js for REST API
- Socket.io for WebSocket communication
- Drizzle ORM for database
- OpenAI API for conversation analysis

**Key Services:**

#### a. REST API
- `/api/checklists` - CRUD for checklists
- `/api/templates` - Template management
- `/api/webhooks/zoom` - Zoom event handling

#### b. WebSocket Service
- Real-time communication with frontend
- Meeting room management
- Transcription broadcasting
- Item checking notifications

#### c. Conversation Analyzer
- Processes transcription text
- Uses OpenAI GPT-4 for semantic matching
- Maintains conversation context
- Calculates confidence scores
- Auto-checks matching items

### 3. Database (PostgreSQL)

**Schema:**

```sql
users
├── id (uuid, primary key)
├── zoom_user_id (varchar, unique)
├── email (varchar)
├── name (varchar)
└── created_at, updated_at

templates
├── id (uuid, primary key)
├── name (varchar)
├── description (text)
├── category (varchar)
├── items (jsonb)
├── is_public (boolean)
├── created_by (fk → users)
└── created_at, updated_at

checklists
├── id (uuid, primary key)
├── name (varchar)
├── template_id (fk → templates)
├── meeting_id (varchar)
├── user_id (fk → users)
├── items (jsonb)
├── completed_at (timestamp)
└── created_at, updated_at

transcriptions
├── id (uuid, primary key)
├── meeting_id (varchar)
├── speaker (varchar)
├── speaker_id (varchar)
├── text (text)
├── timestamp (timestamp)
└── analyzed_at (timestamp)

checklist_matches
├── id (uuid, primary key)
├── checklist_id (fk → checklists)
├── item_id (varchar)
├── transcription_id (fk → transcriptions)
├── confidence (integer 0-100)
├── matched_text (text)
└── matched_at (timestamp)
```

## Data Flow

### 1. Checklist Creation

```
User → Frontend → REST API → Database
                    ↓
                  WebSocket ← Frontend
```

1. User selects template or creates custom checklist
2. Frontend sends request to backend API
3. Backend creates checklist in database
4. Backend returns checklist data
5. Frontend connects to WebSocket for real-time updates

### 2. Transcription Processing

```
Zoom → Zoom SDK → Frontend → WebSocket → Backend
                                            ↓
                                    Conversation Analyzer
                                            ↓
                                    OpenAI GPT-4 API
                                            ↓
                                    Match Detection
                                            ↓
                                    Database Update
                                            ↓
                                    WebSocket Broadcast
                                            ↓
                                    Frontend Update
```

1. Zoom captures audio transcription
2. Zoom SDK delivers transcription to frontend
3. Frontend sends transcription via WebSocket
4. Backend stores in database
5. Conversation Analyzer processes text
6. OpenAI analyzes semantic match to checklist items
7. High-confidence matches auto-check items
8. Backend broadcasts updates to all clients
9. Frontend updates UI in real-time

### 3. Manual Item Toggle

```
User → Frontend → Local State → WebSocket → Backend → Broadcast
```

1. User clicks checkbox
2. Frontend updates local state immediately
3. Frontend sends update via WebSocket
4. Backend updates database
5. Backend broadcasts to other participants

## AI Conversation Analysis

### Matching Algorithm

The `ConversationAnalyzer` uses OpenAI's GPT-4 to match conversation to checklist items:

**Input:**
- Recent conversation history (last 20 messages)
- Uncompleted checklist items
- Item descriptions and context

**Process:**
1. Build conversation context
2. Format checklist items
3. Send to GPT-4 with specialized prompt
4. Parse JSON response with matches

**Output:**
```json
[
  {
    "itemId": "item-123",
    "confidence": 0.85,
    "reasoning": "User explicitly discussed budget range"
  }
]
```

**Thresholds:**
- confidence ≥ 0.7 → Auto-check item
- confidence < 0.7 → Ignore (avoid false positives)

### Context Window

- Maintains sliding window of 20 recent messages
- Stores full transcription in database
- Can be extended for post-call analysis

## Security Considerations

### Authentication
- Zoom handles user authentication
- JWT tokens for API authentication
- User IDs from Zoom SDK

### Data Privacy
- Transcriptions stored temporarily
- Can be deleted after meeting
- Encrypted database connections
- No audio/video storage

### API Security
- Webhook signature verification
- Rate limiting
- CORS configuration
- Helmet.js security headers

## Scalability

### Current Limitations
- Single server instance
- In-memory meeting rooms
- Limited concurrent meetings

### Scaling Strategies

**Horizontal Scaling:**
- Use Redis for shared state
- Socket.io Redis adapter
- Load balancer for multiple instances

**Database Optimization:**
- Connection pooling
- Indexes on meeting_id and user_id
- Archived transcriptions

**Caching:**
- Redis for checklist cache
- Template caching
- Rate limiting with Redis

## Performance Optimizations

1. **Frontend:**
   - Optimistic UI updates
   - Debounced WebSocket messages
   - React component memoization

2. **Backend:**
   - Async processing
   - Batch database operations
   - Connection pooling

3. **AI:**
   - Batched transcription analysis
   - Cached embeddings (future)
   - Temperature tuning for consistency

## Monitoring & Logging

- Winston logger for structured logging
- Request/response logging
- Error tracking
- WebSocket connection monitoring
- OpenAI API usage tracking
