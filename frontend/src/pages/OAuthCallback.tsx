import { useEffect } from 'react';

/**
 * OAuth Callback Handler
 *
 * This page handles the OAuth redirect from Zoom after user authorization.
 * For Zoom Apps SDK apps, the SDK handles authentication internally,
 * so we just need to redirect back to the main app.
 */
export default function OAuthCallback() {
  useEffect(() => {
    // Get the authorization code from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    console.log('OAuth callback received:', { code: code?.substring(0, 10) + '...', error });

    if (error) {
      console.error('OAuth error:', error);
      // Redirect back to main app even on error
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return;
    }

    if (code) {
      // Store the code in sessionStorage if needed for later use
      sessionStorage.setItem('zoom_oauth_code', code);
      console.log('OAuth code saved to sessionStorage');
    }

    // Redirect back to the main app
    // The Zoom SDK will handle the authentication
    console.log('Redirecting to main app...');
    window.location.href = '/';
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center max-w-md p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Completing Authorization...
        </h2>
        <p className="text-gray-600">
          Please wait while we complete your Zoom authorization.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          You will be redirected automatically.
        </p>
      </div>
    </div>
  );
}
