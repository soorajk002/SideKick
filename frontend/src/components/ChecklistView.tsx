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
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
      {/* Checklist Header */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            {activeChecklist.name}
          </h2>
          {isConnected && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-accent-50 to-accent-100 text-accent-700 rounded-full text-xs font-medium shadow-soft">
              <div className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse" />
              Live
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">
              {completedCount} of {totalCount} completed
            </span>
            <span className="text-primary-700 font-semibold">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="flex-1 overflow-y-auto px-5 py-3 scrollbar-thin">
        {activeChecklist.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-primary-500" />
            </div>
            <p className="text-gray-600 mb-3 font-medium">No items yet</p>
            <button
              onClick={() => setShowAddItem(true)}
              className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors"
            >
              Add your first item
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {activeChecklist.items
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <ChecklistItem key={item.id} item={item} />
              ))}
          </div>
        )}
      </div>

      {/* Add Item Section */}
      <div className="border-t border-gray-100 p-5 bg-white">
        {showAddItem ? (
          <div className="space-y-3">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddItem();
                if (e.key === 'Escape') setShowAddItem(false);
              }}
              placeholder="What needs to be covered?"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 text-sm transition-all"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddItem}
                disabled={!newItemText.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-medium hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-soft"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddItem(false);
                  setNewItemText('');
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddItem(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 border-dashed rounded-xl text-gray-600 hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-700 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Item</span>
          </button>
        )}
      </div>
    </div>
  );
}
