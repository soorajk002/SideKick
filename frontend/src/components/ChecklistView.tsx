import { useState, useEffect } from 'react';
import { useChecklistStore } from '../store/checklistStore';
import { useZoomStore } from '../store/zoomStore';
import ChecklistItem from './ChecklistItem';
import { Plus, ChevronDown } from 'lucide-react';

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
    <div className="flex flex-col h-full bg-white">
      {/* Combined Template Selector + Active Checklist + Progress */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          {/* Template Selector styled as Active Checklist Header */}
          <div className="flex-1 relative">
            <select
              value={selectedTemplate}
              onChange={handleTemplateChange}
              disabled={isCreating}
              className="w-full appearance-none bg-transparent border-0 px-0 py-0 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ paddingRight: '20px' }}
            >
              <option value="">
                {activeChecklist ? activeChecklist.name : 'Select Playbook'}
              </option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
              <option value="custom">+ Create Custom</option>
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Compact Progress on the Right */}
          {activeChecklist && (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                {completedCount}/{totalCount}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Checklist Content */}
      {!activeChecklist ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">No checklist selected</p>
            <p className="text-xs text-gray-400">Select a playbook above to get started</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Compact Checklist Items */}
          <div className="px-4 py-2 space-y-1">
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
