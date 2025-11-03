import { CheckCircle2, Circle, Sparkles, X } from 'lucide-react';
import { useChecklistStore, ChecklistItem as ChecklistItemType } from '../store/checklistStore';
import clsx from 'clsx';

interface ChecklistItemProps {
  item: ChecklistItemType;
  userId: string;
}

export default function ChecklistItem({ item, userId }: ChecklistItemProps) {
  const { toggleItem, removeItem } = useChecklistStore();

  const handleToggle = async () => {
    console.log('=== ITEM TOGGLE DEBUG ===');
    console.log('Item:', item.content);
    console.log('Item ID:', item.id);
    console.log('User ID:', userId);
    console.log('API URL:', import.meta.env.VITE_API_URL);

    try {
      await toggleItem(item.id, userId);
      console.log('✅ Item toggled successfully!');
    } catch (error) {
      console.error('❌ Failed to toggle item:', error);
      alert(`Failed to toggle item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div
      className={clsx(
        'group relative flex items-start gap-2 px-2.5 py-2 rounded-lg transition-all duration-200',
        item.completed
          ? 'bg-accent-50/60 border border-accent-200/40'
          : 'bg-white border border-gray-200 hover:border-gray-300'
      )}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className="flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 rounded-full"
      >
        {item.completed ? (
          <CheckCircle2 className="w-4 h-4 text-accent-600" />
        ) : (
          <Circle className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={clsx(
            'text-xs leading-snug transition-all',
            item.completed
              ? 'text-gray-500 line-through'
              : 'text-gray-800 font-medium'
          )}
        >
          {item.content}
        </p>

        {item.description && (
          <p className="text-xs text-gray-400 mt-0.5 leading-snug">
            {item.description}
          </p>
        )}

        {/* Auto-checked indicator */}
        {item.autoChecked && item.matchConfidence && (
          <div className="flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-primary-50 rounded w-fit">
            <Sparkles className="w-2.5 h-2.5 text-primary-600" />
            <span className="text-[10px] text-primary-700 font-medium">
              AI {Math.round(item.matchConfidence * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Remove button (shown on hover) */}
      <button
        onClick={() => removeItem(item.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all focus:opacity-100 focus:outline-none"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
