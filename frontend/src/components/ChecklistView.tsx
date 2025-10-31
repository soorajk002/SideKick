import { useState } from 'react';
import { useChecklistStore } from '../store/checklistStore';
import ChecklistItem from './ChecklistItem';
import { Plus, TrendingUp } from 'lucide-react';

export default function ChecklistView() {
  const { activeChecklist, addItem, isConnected } = useChecklistStore();
  const [newItemText, setNewItemText] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);

  if (!activeChecklist) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No active checklist</p>
      </div>
    );
  }

  const completedCount = activeChecklist.items.filter((item) => item.completed).length;
  const totalCount = activeChecklist.items.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAddItem = () => {
    if (newItemText.trim()) {
      addItem(newItemText.trim());
      setNewItemText('');
      setShowAddItem(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Checklist Header */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeChecklist.name}
          </h2>
          {isConnected && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {completedCount} of {totalCount} completed
            </span>
            <span className="text-gray-600 font-medium">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
        {activeChecklist.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 mb-2">No items yet</p>
            <button
              onClick={() => setShowAddItem(true)}
              className="text-primary-600 text-sm font-medium hover:text-primary-700"
            >
              Add your first item
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {activeChecklist.items
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <ChecklistItem key={item.id} item={item} />
              ))}
          </div>
        )}
      </div>

      {/* Add Item Section */}
      <div className="border-t border-gray-200 p-4">
        {showAddItem ? (
          <div className="space-y-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddItem();
                if (e.key === 'Escape') setShowAddItem(false);
              }}
              placeholder="Enter item text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddItem}
                disabled={!newItemText.trim()}
                className="flex-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddItem(false);
                  setNewItemText('');
                }}
                className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddItem(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 border-dashed rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Item</span>
          </button>
        )}
      </div>
    </div>
  );
}
