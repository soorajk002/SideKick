import { useState, useEffect } from 'react';
import { FileText, Save, Download, CheckSquare, Plus, X } from 'lucide-react';
import clsx from 'clsx';

interface ActionItem {
  id: string;
  title: string;
  assignee?: string;
  dueDate?: string;
  completed: boolean;
}

interface MeetingNotesProps {
  meetingId: string;
  checklistId?: string;
  onSave?: (notes: string, actionItems: ActionItem[]) => void;
}

export default function MeetingNotes({ meetingId, checklistId: _checklistId, onSave }: MeetingNotesProps) {
  const [notes, setNotes] = useState('');
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newActionItem, setNewActionItem] = useState('');
  const [showActionItemInput, setShowActionItemInput] = useState(false);

  // Load existing notes
  useEffect(() => {
    if (meetingId) {
      loadNotes();
    }
  }, [meetingId]);

  const loadNotes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meetings/${meetingId}/notes`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data.data.notes || '');
        setActionItems(data.data.actionItems || []);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meetings/${meetingId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, actionItems }),
      });

      if (response.ok) {
        console.log('Notes saved successfully');
        onSave?.(notes, actionItems);
      }
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'markdown') => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/meetings/${meetingId}/export?format=${format}`,
        { method: 'GET' }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meeting-${meetingId}.${format === 'pdf' ? 'pdf' : 'md'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  const addActionItem = () => {
    if (!newActionItem.trim()) return;

    const actionItem: ActionItem = {
      id: `action-${Date.now()}`,
      title: newActionItem,
      completed: false,
    };

    setActionItems([...actionItems, actionItem]);
    setNewActionItem('');
    setShowActionItemInput(false);
  };

  const toggleActionItem = (id: string) => {
    setActionItems(
      actionItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const removeActionItem = (id: string) => {
    setActionItems(actionItems.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Meeting Notes</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('markdown')}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              title="Export as Markdown"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              title="Export as PDF"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Notes Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-5 overflow-y-auto scrollbar-thin">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take notes during the meeting..."
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
            />
          </div>

          {/* Action Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Action Items
              </label>
              <button
                onClick={() => setShowActionItemInput(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>

            {/* Add Action Item Input */}
            {showActionItemInput && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="text"
                  value={newActionItem}
                  onChange={(e) => setNewActionItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addActionItem()}
                  placeholder="Enter action item..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={addActionItem}
                    className="px-3 py-1 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition-all"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowActionItemInput(false);
                      setNewActionItem('');
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Action Items List */}
            <div className="space-y-2">
              {actionItems.map((item) => (
                <div
                  key={item.id}
                  className={clsx(
                    'flex items-start gap-3 p-3 rounded-lg border transition-all',
                    item.completed
                      ? 'bg-accent-50/50 border-accent-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  )}
                >
                  <button
                    onClick={() => toggleActionItem(item.id)}
                    className="flex-shrink-0 mt-0.5"
                  >
                    <CheckSquare
                      className={clsx(
                        'w-4 h-4 transition-colors',
                        item.completed ? 'text-accent-600' : 'text-gray-300'
                      )}
                    />
                  </button>
                  <span
                    className={clsx(
                      'flex-1 text-sm',
                      item.completed
                        ? 'text-gray-500 line-through'
                        : 'text-gray-800'
                    )}
                  >
                    {item.title}
                  </span>
                  <button
                    onClick={() => removeActionItem(item.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {actionItems.length === 0 && !showActionItemInput && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No action items yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="px-5 py-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      </div>
    </div>
  );
}
