import { useEffect, useState } from 'react';
import { useZoomStore } from './store/zoomStore';
import { useChecklistStore } from './store/checklistStore';
import ChecklistView from './components/ChecklistView';
import TemplateSelector from './components/TemplateSelector';
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { initializeZoom, isConnected, isLoading } = useZoomStore();
  const { activeChecklist } = useChecklistStore();
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    initializeZoom();
  }, [initializeZoom]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Connecting to Zoom...
          </h2>
          <p className="text-gray-500">
            Please wait while we connect to your Zoom meeting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header onNewChecklist={() => setShowTemplates(true)} />

      <div className="flex-1 overflow-hidden">
        {showTemplates || !activeChecklist ? (
          <TemplateSelector onClose={() => setShowTemplates(false)} />
        ) : (
          <ChecklistView />
        )}
      </div>
    </div>
  );
}

export default App;
