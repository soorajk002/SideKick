import { CheckCircle2, Circle, Sparkles, X } from 'lucide-react';
import { useChecklistStore, ChecklistItem as ChecklistItemType } from '../store/checklistStore';
import clsx from 'clsx';

interface ChecklistItemProps {
  item: ChecklistItemType;
}

export default function ChecklistItem({ item }: ChecklistItemProps) {
  const { toggleItem, removeItem } = useChecklistStore();

  return (
    <div
      className={clsx(
        'group relative flex items-start gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200',
        item.completed
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-gray-200 hover:border-gray-300'
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => toggleItem(item.id)}
        className="flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
      >
        {item.completed ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={clsx(
            'text-sm transition-all',
            item.completed
              ? 'text-gray-500 line-through'
              : 'text-gray-900'
          )}
        >
          {item.content}
        </p>

        {item.description && (
          <p className="text-xs text-gray-500 mt-0.5">
            {item.description}
          </p>
        )}

        {/* Auto-checked indicator */}
        {item.autoChecked && item.matchConfidence && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs text-purple-600 font-medium">
              Auto-checked ({Math.round(item.matchConfidence * 100)}% confidence)
            </span>
          </div>
        )}
      </div>

      {/* Remove button (shown on hover) */}
      <button
        onClick={() => removeItem(item.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
