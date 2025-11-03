import { useEffect, useState } from 'react';
import { useChecklistStore, Template } from '../store/checklistStore';
import { useZoomStore } from '../store/zoomStore';
import { X, CheckCircle2, Sparkles, Plus, ListChecks } from 'lucide-react';

interface TemplateSelectorProps {
  onClose: () => void;
}

export default function TemplateSelector({ onClose }: TemplateSelectorProps) {
  const { templates, loadTemplates, createChecklistFromTemplate, createCustomChecklist } =
    useChecklistStore();
  const { meetingId, currentUser } = useZoomStore();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleSelectTemplate = async (template: Template) => {
    // IMMEDIATE VISUAL FEEDBACK
    alert('CLICKED: ' + template.name);

    console.log('=== TEMPLATE CLICK DEBUG ===');
    console.log('Template:', template.name);
    console.log('Meeting ID:', meetingId);
    console.log('Current User:', currentUser);
    console.log('API URL:', import.meta.env.VITE_API_URL);

    if (!meetingId) {
      alert('ERROR: No meeting ID!');
      setError('No meeting ID found');
      return;
    }

    if (!currentUser) {
      alert('ERROR: No user info!');
      setError('No user information found');
      return;
    }

    setIsCreating(true);
    setError(null);

    alert('Starting to create checklist...');

    try {
      // Use the default Zoom app organization UUID
      const organizationId = '00000000-0000-0000-0000-000000000002';
      console.log('Creating checklist...');
      await createChecklistFromTemplate(template.id, meetingId, currentUser.userId, organizationId);
      console.log('✅ Checklist created successfully!');
      alert('SUCCESS! Checklist created!');
      onClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('❌ Failed to create checklist:', errorMsg, error);
      alert('FAILED: ' + errorMsg);
      setError(`Failed: ${errorMsg}`);
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
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="px-5 py-5 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Select Playbook</h2>
            <p className="text-sm text-gray-500 mt-0.5">Choose a template or create your own</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-600 hover:text-red-700 mt-1"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto px-5 py-5 scrollbar-thin">
        {/* Custom Checklist Option */}
        <button
          onClick={handleCreateCustom}
          disabled={isCreating}
          className="w-full mb-5 p-5 border-2 border-dashed border-primary-300 rounded-xl text-left hover:border-primary-500 hover:bg-gradient-to-br hover:from-primary-50 hover:to-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-soft-lg transition-shadow">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 text-base">
                Create Custom Checklist
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Start from scratch with your own sales playbook items
              </p>
            </div>
          </div>
        </button>

        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Standard Playbooks
          </h3>
        </div>

        {/* Template Cards */}
        <div className="space-y-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              disabled={isCreating}
              className="w-full p-4 border rounded-xl text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group border-gray-200 hover:border-primary-200 hover:bg-white hover:shadow-soft bg-white/60"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center group-hover:from-primary-100 group-hover:to-primary-50 transition-all">
                  <ListChecks className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {template.name}
                    </h3>
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-md text-xs font-medium">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{template.items.length} items</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No templates available</p>
            <p className="text-sm text-gray-400 mt-1">Create a custom checklist to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
