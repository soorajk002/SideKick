import { create } from 'zustand';
import zoomSdk from '@zoom/appssdk';

interface ZoomUser {
  userId: string;
  participantId: string;
  userName: string;
  role: string;
}

interface ZoomState {
  isConnected: boolean;
  isLoading: boolean;
  isInMeeting: boolean;
  meetingId: string | null;
  currentUser: ZoomUser | null;
  transcriptEnabled: boolean;
  error: string | null;

  initializeZoom: () => Promise<void>;
  startTranscription: () => Promise<void>;
  stopTranscription: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useZoomStore = create<ZoomState>((set) => ({
  isConnected: false,
  isLoading: true,
  isInMeeting: false,
  meetingId: null,
  currentUser: null,
  transcriptEnabled: false,
  error: null,

  initializeZoom: async () => {
    try {
      set({ isLoading: true, error: null });

      console.log('Initializing Zoom SDK...');
      console.log('SDK available:', typeof zoomSdk);

      // Configure Zoom SDK with all required parameters
      const configResponse = await zoomSdk.config({
        capabilities: [],
        version: '0.16.0',
        size: { width: 480, height: 720 }, // App window size
        popoutSize: { width: 480, height: 720 }, // Popout window size
      });

      console.log('Zoom SDK configured successfully:', configResponse);

      // Don't try to get running context yet - just mark as connected
      set({
        isConnected: true,
        isLoading: false,
        isInMeeting: true,
        meetingId: 'meeting-' + Date.now(), // Use timestamp as placeholder
        currentUser: {
          userId: 'user-' + Date.now(),
          participantId: '',
          userName: 'Guest',
          role: 'attendee',
        },
      });

      console.log('Zoom SDK initialized successfully with zero capabilities!');

    } catch (error) {
      console.error('Failed to initialize Zoom SDK:', error);

      let errorMessage = 'Failed to connect to Zoom.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }

      console.error('Detailed error:', errorMessage);

      set({
        isLoading: false,
        error: `Zoom SDK Error: ${errorMessage}`,
      });
    }
  },

  startTranscription: async () => {
    try {
      // Note: Zoom Apps SDK doesn't directly control transcription
      // This would typically be done via backend using Zoom API
      console.log('Requesting transcription start...');
      set({ transcriptEnabled: true });
    } catch (error) {
      console.error('Failed to start transcription:', error);
      set({ error: 'Failed to start transcription' });
    }
  },

  stopTranscription: async () => {
    try {
      console.log('Requesting transcription stop...');
      set({ transcriptEnabled: false });
    } catch (error) {
      console.error('Failed to stop transcription:', error);
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
