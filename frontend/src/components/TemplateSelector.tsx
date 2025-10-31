import { useEffect, useState } from 'react';
import { useChecklistStore, Template } from '../store/checklistStore';
import { useZoomStore } from '../store/zoomStore';
import { X, CheckCircle2, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface TemplateSelectorProps {
  onClose: () => void;
}

export default function TemplateSelector({ onClose }: TemplateSelectorProps) {
  const { templates, loadTemplates, createChecklistFromTemplate, createCustomChecklist } =
    useChecklistStore();
  const { meetingId, currentUser } = useZoomStore();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleSelectTemplate = async (template: Template) => {
    if (!meetingId || !currentUser) return;

    setIsCreating(true);
    try {
      await createChecklistFromTemplate(template.id, meetingId, currentUser.userId);
      onClose();
    } catch (error) {
      console.error('Failed to create checklist:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateCustom = async () => {
    if (!meetingId || !currentUser) return;

    const name = prompt('Enter checklist name:');
    if (!name) return;

    const itemsInput = prompt('Enter items (comma-separated):');
    if (!itemsInput) return;

    const items = itemsInput.split(',').map((item) => item.trim()).filter(Boolean);
    if (items.length === 0) return;

    setIsCreating(true);
    try {
      await createCustomChecklist(name, items, meetingId, currentUser.userId);
      onClose();
    } catch (error) {
      console.error('Failed to create custom checklist:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Choose a Template</h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        {/* Custom Checklist Option */}
        <button
          onClick={handleCreateCustom}
          disabled={isCreating}
          className="w-full mb-4 p-4 border-2 border-dashed border-primary-300 rounded-lg text-left hover:border-primary-500 hover:bg-primary-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Create Custom Checklist
              </h3>
              <p className="text-sm text-gray-600">
                Start from scratch with your own items
              </p>
            </div>
          </div>
        </button>

        {/* Template Cards */}
        <div className="space-y-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              disabled={isCreating}
              className={clsx(
                'w-full p-4 border rounded-lg text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                selectedTemplate?.id === template.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {template.name}
                    </h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {template.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {template.items.length} items
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates available</p>
          </div>
        )}
      </div>
    </div>
  );
}
