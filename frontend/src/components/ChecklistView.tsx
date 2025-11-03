import { useState, useEffect } from 'react';
import { useChecklistStore } from '../store/checklistStore';
import { useZoomStore } from '../store/zoomStore';
import ChecklistItem from './ChecklistItem';
import { Plus, TrendingUp, ChevronDown } from 'lucide-react';

export default function ChecklistView() {
  const { activeChecklist, addItem, isConnected, templates, loadTemplates, createChecklistFromTemplate, createCustomChecklist } = useChecklistStore();
  const { meetingId, currentUser } = useZoomStore();
  const [newItemText, setNewItemText] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleTemplateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTemplate(value);

    if (!value) return;

    if (!meetingId || !currentUser) {
      alert('Meeting information not available');
      return;
    }

    setIsCreating(true);

    try {
      if (value === 'custom') {
        // Create custom checklist
        const name = prompt('Enter checklist name:');
        if (!name) {
          setIsCreating(false);
          setSelectedTemplate('');
          return;
        }

        const itemsInput = prompt('Enter items (comma-separated):');
        if (!itemsInput) {
          setIsCreating(false);
          setSelectedTemplate('');
          return;
        }

        const items = itemsInput.split(',').map((item) => item.trim()).filter(Boolean);
        if (items.length === 0) {
          setIsCreating(false);
          setSelectedTemplate('');
          return;
        }

        await createCustomChecklist(name, items, meetingId, currentUser.userId);
      } else {
        // Create from template
        const organizationId = '00000000-0000-0000-0000-000000000002';
        await createChecklistFromTemplate(value, meetingId, currentUser.userId, organizationId);
      }
    } catch (error) {
      console.error('Failed to create checklist:', error);
      alert('Failed to create checklist: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsCreating(false);
      setSelectedTemplate('');
    }
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
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
      {/* Template Selector */}
      <div className="px-5 py-4 border-b border-gray-100 bg-white">
        <div className="relative">
          <select
            value={selectedTemplate}
            onChange={handleTemplateChange}
            disabled={isCreating}
            className="w-full appearance-none px-4 py-2.5 pr-10 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {activeChecklist ? activeChecklist.name : 'Select a playbook...'}
            </option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
            <option value="custom">+ Create Custom Checklist</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Checklist Content */}
      {!activeChecklist ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Active Checklist
            </h3>
            <p className="text-sm text-gray-500">
              Select a playbook from the dropdown above to get started
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Checklist Header */}
          <div className="px-5 py-4 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Active Checklist
              </h2>
              {isConnected && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-accent-50 to-accent-100 text-accent-700 rounded-full text-xs font-medium">
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
                <span className="text-primary-600 font-semibold">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
            {activeChecklist.items
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  userId={currentUser?.userId || ''}
                />
              ))}

            {/* Add Item Button */}
            {showAddItem ? (
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                  placeholder="Enter new item..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddItem(false);
                    setNewItemText('');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddItem(true)}
                className="w-full mt-3 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
