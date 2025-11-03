import { useState, useEffect } from 'react';
import { useChecklistStore } from '../store/checklistStore';
import { useZoomStore } from '../store/zoomStore';
import ChecklistItem from './ChecklistItem';
import { Plus, Info, X } from 'lucide-react';

export default function ChecklistView() {
  const { activeChecklist, addItem } = useChecklistStore();
  const { currentUser } = useZoomStore();
  const [newItemText, setNewItemText] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showTranscriptBanner, setShowTranscriptBanner] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem('transcriptBannerDismissed');
    if (dismissed === 'true') {
      setShowTranscriptBanner(false);
    }
  }, []);

  const dismissTranscriptBanner = () => {
    setShowTranscriptBanner(false);
    localStorage.setItem('transcriptBannerDismissed', 'true');
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      addItem(newItemText.trim());
      setNewItemText('');
      setShowAddItem(false);
    }
  };

  const completedCount = activeChecklist?.items.filter((item) => item.completed).length || 0;
  const totalCount = activeChecklist?.items.length || 0;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Active Checklist Header with Progress */}
      {activeChecklist && (
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-900">
              {activeChecklist.name}
            </h2>
            <span className="text-xs font-medium text-gray-600">
              {completedCount}/{totalCount}
            </span>
          </div>
          {/* Bigger Progress Bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Checklist Content */}
      {!activeChecklist ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">No checklist selected</p>
            <p className="text-xs text-gray-400">Select a playbook from the menu above</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Transcription Info Banner */}
          {showTranscriptBanner && (
            <div className="mx-4 mt-3 mb-2 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-blue-900 font-medium mb-1">
                  Enable AI Auto-Checking
                </p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Click <strong>"Show Captions"</strong> or <strong>"Live Transcript"</strong> in Zoom to enable AI-powered auto-checking of items during your call.
                </p>
              </div>
              <button
                onClick={dismissTranscriptBanner}
                className="flex-shrink-0 p-0.5 hover:bg-blue-100 rounded transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>
          )}

          {/* Checklist Items with More Spacing */}
          <div className="px-4 py-3 space-y-2">
            {activeChecklist.items
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  userId={currentUser?.userId || ''}
                />
              ))}
          </div>

          {/* Compact Add Item Section */}
          {showAddItem ? (
            <div className="px-4 py-2 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                  placeholder="New item..."
                  className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={handleAddItem}
                  className="px-3 py-1.5 bg-primary-600 text-white rounded text-xs font-medium hover:bg-primary-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddItem(false);
                    setNewItemText('');
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2 border-t border-gray-100">
              <button
                onClick={() => setShowAddItem(true)}
                className="w-full px-3 py-1.5 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
