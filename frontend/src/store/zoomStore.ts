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

      // Configure Zoom SDK
      const configResponse = await zoomSdk.config({
        capabilities: [
          'shareApp',
          'getMeetingContext',
          'getMeetingParticipants',
          'onMeetingConfigChanged',
          'onActiveSpeakerChange',
          'onMyActiveSpeakerChange',
          'openUrl',
          'getRunningContext',
          'getMeetingUUID',
        ],
        version: '0.16.0',
      });

      console.log('Zoom SDK configured successfully:', configResponse);

      // Get meeting context
      const meetingContext = await zoomSdk.getMeetingContext();
      console.log('Meeting context:', meetingContext);

      // Get current user info
      const runningContext = await zoomSdk.getRunningContext();
      console.log('Running context:', runningContext);

      // Extract user info from running context (handle different context types)
      const contextData = typeof runningContext.context === 'object' ? runningContext.context : {};
      const userInfo = (contextData as any)?.user || {};

      set({
        isConnected: true,
        isLoading: false,
        isInMeeting: true,
        meetingId: meetingContext.meetingID || null,
        currentUser: {
          userId: userInfo?.id || '',
          participantId: (contextData as any)?.participantId || '',
          userName: userInfo?.name || 'Guest',
          role: (contextData as any)?.role || 'attendee',
        },
      });

      // Set up event listeners
      zoomSdk.onMeetingConfigChanged((event) => {
        console.log('Meeting config changed:', event);
      });

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
