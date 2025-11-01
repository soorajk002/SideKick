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

      console.log('=== ZOOM SDK INITIALIZATION ===');
      console.log('SDK available:', typeof zoomSdk);
      console.log('Current URL:', window.location.href);
      console.log('Build timestamp:', new Date().toISOString());

      // Configure Zoom SDK with all required parameters
      // IMPORTANT: capabilities must match the APIs enabled in Zoom Marketplace
      const config = {
        capabilities: [
          'getRunningContext' as const,  // Enabled in Marketplace
          'openUrl' as const,            // Enabled in Marketplace
        ],
        version: '0.16.0' as const,
        size: { width: 480, height: 720 },
        popoutSize: { width: 480, height: 720 },
      };

      console.log('Config object:', JSON.stringify(config, null, 2));
      console.log('Calling zoomSdk.config()...');

      const configResponse = await zoomSdk.config(config);

      console.log('✅ Zoom SDK configured successfully!');
      console.log('Config response:', configResponse);

      // Get running context now that we have the capability
      console.log('Getting running context...');
      const runningContext = await zoomSdk.getRunningContext();
      console.log('Running context:', runningContext);

      // Extract context data
      const contextData = typeof runningContext.context === 'object' ? runningContext.context : {};
      const userInfo = (contextData as any)?.user || {};

      set({
        isConnected: true,
        isLoading: false,
        isInMeeting: true,
        meetingId: (contextData as any)?.meetingID || 'meeting-' + Date.now(),
        currentUser: {
          userId: userInfo?.id || 'user-' + Date.now(),
          participantId: (contextData as any)?.participantId || '',
          userName: userInfo?.name || 'Guest',
          role: (contextData as any)?.role || 'attendee',
        },
      });

      console.log('✅ Zoom SDK initialized successfully!');

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
