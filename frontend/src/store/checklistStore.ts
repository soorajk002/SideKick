import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { templatesApi, checklistsApi, meetingsApi } from '../lib/api';

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
  items: ChecklistItem[];
  createdAt: Date;
  meetingId: string;
  userId: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  items: Omit<ChecklistItem, 'id' | 'completed' | 'autoChecked' | 'matchedAt'>[];
  isPublic: boolean;
}

interface ChecklistState {
  activeChecklist: Checklist | null;
  templates: Template[];
  socket: Socket | null;
  isConnected: boolean;
  currentMeetingId: string | null;

  // Actions
  createChecklistFromTemplate: (templateId: string, meetingId: string, userId: string, organizationId: string) => Promise<void>;
  createCustomChecklist: (name: string, items: string[], meetingId: string, userId: string) => Promise<void>;
  toggleItem: (itemId: string, userId: string) => Promise<void>;
  addItem: (content: string) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<ChecklistItem>) => void;
  loadTemplates: () => Promise<void>;
  connectWebSocket: (meetingId: string) => void;
  disconnectWebSocket: () => void;
}

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useChecklistStore = create<ChecklistState>((set, get) => ({
  activeChecklist: null,
  templates: [],
  socket: null,
  isConnected: false,
  currentMeetingId: null,

  createChecklistFromTemplate: async (templateId: string, meetingId: string, userId: string, organizationId: string) => {
    try {
      // First, create or get the meeting
      const zoomMeetingId = await (window as any).zoomSdk?.getMeetingContext?.()?.then((ctx: any) => ctx.meetingID);

      if (zoomMeetingId) {
        await meetingsApi.create({
          title: `Meeting ${zoomMeetingId}`,
          zoomMeetingId: zoomMeetingId.toString(),
          templateId,
          hostUserId: userId,
          organizationId,
          startedAt: new Date(),
        });
      }

      // Create checklist from template
      const checklistData = await checklistsApi.create({
        meetingId,
        templateId,
        userId,
      });

      // Transform backend data to frontend format
      const checklist: Checklist = {
        id: checklistData.id,
        name: 'Checklist',
        templateId: checklistData.templateId,
        items: (checklistData.items || []).map((item) => ({
          id: item.id,
          content: item.title,
          description: item.description || undefined,
          completed: item.isCompleted,
          autoChecked: item.aiChecked,
          matchConfidence: item.aiConfidence || undefined,
          order: item.order,
        })),
        createdAt: new Date(checklistData.createdAt as any),
        meetingId: checklistData.meetingId,
        userId: checklistData.userId,
      };

      set({ activeChecklist: checklist, currentMeetingId: meetingId });

      // Connect to WebSocket for real-time updates
      get().connectWebSocket(meetingId);
    } catch (error) {
      console.error('Failed to create checklist:', error);
      throw error;
    }
  },

  createCustomChecklist: async (name: string, items: string[], meetingId: string, userId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/checklists/custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, items, meetingId, userId }),
      });

      if (!response.ok) throw new Error('Failed to create custom checklist');

      const checklist = await response.json();
      set({ activeChecklist: checklist });

      // Connect to WebSocket for real-time updates
      get().connectWebSocket(meetingId);
    } catch (error) {
      console.error('Failed to create custom checklist:', error);
    }
  },

  toggleItem: async (itemId: string, userId: string) => {
    const { activeChecklist } = get();
    if (!activeChecklist) return;

    const item = activeChecklist.items.find((i) => i.id === itemId);
    if (!item) return;

    // Optimistically update UI
    set((state) => {
      if (!state.activeChecklist) return state;

      return {
        activeChecklist: {
          ...state.activeChecklist,
          items: state.activeChecklist.items.map((i) =>
            i.id === itemId ? { ...i, completed: !i.completed } : i
          ),
        },
      };
    });

    // Sync with backend
    try {
      await checklistsApi.updateItem(activeChecklist.id, itemId, {
        isCompleted: !item.completed,
        completedBy: userId,
      });
    } catch (error) {
      console.error('Failed to update item:', error);
      // Revert on error
      set((state) => {
        if (!state.activeChecklist) return state;

        return {
          activeChecklist: {
            ...state.activeChecklist,
            items: state.activeChecklist.items.map((i) =>
              i.id === itemId ? { ...i, completed: item.completed } : i
            ),
          },
        };
      });
    }
  },

  addItem: (content: string) => {
    set((state) => {
      if (!state.activeChecklist) return state;

      const newItem: ChecklistItem = {
        id: `temp-${Date.now()}`,
        content,
        completed: false,
        autoChecked: false,
        order: state.activeChecklist.items.length,
      };

      return {
        activeChecklist: {
          ...state.activeChecklist,
          items: [...state.activeChecklist.items, newItem],
        },
      };
    });
  },

  removeItem: (itemId: string) => {
    set((state) => {
      if (!state.activeChecklist) return state;

      return {
        activeChecklist: {
          ...state.activeChecklist,
          items: state.activeChecklist.items.filter((item) => item.id !== itemId),
        },
      };
    });
  },

  updateItem: (itemId: string, updates: Partial<ChecklistItem>) => {
    set((state) => {
      if (!state.activeChecklist) return state;

      return {
        activeChecklist: {
          ...state.activeChecklist,
          items: state.activeChecklist.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        },
      };
    });
  },

  loadTemplates: async () => {
    try {
      const templatesData = await templatesApi.list({ public: 'true' });

      // Transform backend data to frontend format
      const templates: Template[] = templatesData.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description || '',
        category: t.category,
        isPublic: t.isPublic,
        items: [], // Items will be loaded when creating checklist
      }));

      set({ templates });
    } catch (error) {
      console.error('Failed to load templates:', error);
      // Use default templates if backend is not available
      set({
        templates: [
          {
            id: 'discovery-call',
            name: 'Discovery Call',
            description: 'Essential questions for understanding prospect needs',
            category: 'Sales',
            isPublic: true,
            items: [
              { content: 'Introduction and agenda setting', order: 0 },
              { content: 'Current challenges and pain points', order: 1 },
              { content: 'Goals and desired outcomes', order: 2 },
              { content: 'Budget and timeline discussion', order: 3 },
              { content: 'Decision-making process', order: 4 },
              { content: 'Next steps and follow-up', order: 5 },
            ],
          },
          {
            id: 'demo-call',
            name: 'Product Demo',
            description: 'Structured demo flow to showcase value',
            category: 'Sales',
            isPublic: true,
            items: [
              { content: 'Recap needs from discovery', order: 0 },
              { content: 'Show key features solving their pain points', order: 1 },
              { content: 'Handle objections and questions', order: 2 },
              { content: 'Discuss pricing and ROI', order: 3 },
              { content: 'Get commitment for next steps', order: 4 },
            ],
          },
          {
            id: 'closing-call',
            name: 'Closing Call',
            description: 'Final steps to close the deal',
            category: 'Sales',
            isPublic: true,
            items: [
              { content: 'Review contract terms', order: 0 },
              { content: 'Address final concerns', order: 1 },
              { content: 'Confirm implementation timeline', order: 2 },
              { content: 'Introduce customer success team', order: 3 },
              { content: 'Get signature commitment', order: 4 },
            ],
          },
        ],
      });
    }
  },

  connectWebSocket: (meetingId: string) => {
    const socket = io(BACKEND_URL, {
      path: '/api/socket',
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('WebSocket connected, joining meeting:', meetingId);
      socket.emit('join-meeting', meetingId);
      set({ isConnected: true });
    });

    socket.on('joined', (data: { meetingId: string }) => {
      console.log('Joined meeting room:', data.meetingId);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      set({ isConnected: false });
    });

    // Real-time item auto-checked event
    socket.on('item-checked', (data: {
      itemId: string;
      checklistId: string;
      title: string;
      confidence: number;
      reasoning: string;
      evidence: string[];
    }) => {
      console.log('✅ Item auto-checked:', data.title, `(${data.confidence}% confidence)`);

      // Show notification
      if ((window as any).showNotification) {
        (window as any).showNotification({
          title: '✅ Item Checked',
          message: `${data.title} (${data.confidence}% confidence)`,
          type: 'success',
        });
      }

      // Update item in store
      get().updateItem(data.itemId, {
        completed: true,
        autoChecked: true,
        matchConfidence: data.confidence,
        matchedAt: new Date(),
      });
    });

    // Real-time transcript chunks
    socket.on('transcript-chunk', (data: { text: string; speaker?: string; timestamp: Date }) => {
      console.log('Transcript:', data.speaker ? `${data.speaker}:` : '', data.text);
      // You can display this in real-time if you want to show live captions
    });

    // Analysis events
    socket.on('analysis-started', () => {
      console.log('🤖 AI analysis started...');
    });

    socket.on('analysis-completed', (data: {
      itemsChecked: number;
      totalItems: number;
      completionRate: number;
    }) => {
      console.log(`✅ Analysis complete: ${data.itemsChecked} items checked (${data.completionRate}% complete)`);
    });

    set({ socket });
  },

  disconnectWebSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));
