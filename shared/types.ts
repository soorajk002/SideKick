// Shared type definitions between frontend and backend

export interface User {
  id: string;
  zoomUserId: string;
  email?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistItem {
  id: string;
  content: string;
  description?: string;
  completed: boolean;
  autoChecked: boolean;
  matchedAt?: Date;
  matchConfidence?: number;
  order: number;
}

export interface Checklist {
  id: string;
  name: string;
  templateId?: string;
  meetingId: string;
  userId: string;
  items: ChecklistItem[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  items: Omit<ChecklistItem, 'id' | 'completed' | 'autoChecked' | 'matchedAt'>[];
  isPublic: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transcription {
  id: string;
  meetingId: string;
  speaker?: string;
  speakerId?: string;
  text: string;
  timestamp: Date;
  analyzedAt?: Date;
}

export interface ChecklistMatch {
  id: string;
  checklistId: string;
  itemId: string;
  transcriptionId?: string;
  confidence: number;
  matchedText?: string;
  matchedAt: Date;
}

// WebSocket event types
export interface TranscriptionEvent {
  text: string;
  speaker: string;
  checklistId: string;
}

export interface ItemCheckedEvent {
  itemId: string;
  confidence: number;
  matchedText?: string;
}

export interface ItemToggledEvent {
  checklistId: string;
  itemId: string;
}

export interface ChecklistUpdatedEvent {
  checklistId: string;
  items: ChecklistItem[];
}

// API request/response types
export interface CreateChecklistRequest {
  templateId: string;
  meetingId: string;
  userId: string;
}

export interface CreateCustomChecklistRequest {
  name: string;
  items: string[];
  meetingId: string;
  userId: string;
}

export interface UpdateChecklistRequest {
  items: ChecklistItem[];
}

// Zoom-related types
export interface ZoomMeetingContext {
  meetingID: string;
  meetingTopic?: string;
  meetingUUID?: string;
}

export interface ZoomUser {
  userId: string;
  participantId: string;
  userName: string;
  role: string;
}
