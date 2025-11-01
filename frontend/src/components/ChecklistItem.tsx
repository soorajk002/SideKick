import { CheckCircle2, Circle, Sparkles, X } from 'lucide-react';
import { useChecklistStore, ChecklistItem as ChecklistItemType } from '../store/checklistStore';
import clsx from 'clsx';

interface ChecklistItemProps {
  item: ChecklistItemType;
}

export default function ChecklistItem({ item }: ChecklistItemProps) {
  const { toggleItem, removeItem } = useChecklistStore();

  // TODO: Get actual userId from auth/session
  const userId = 'current-user';

  return (
    <div
      className={clsx(
        'group relative flex items-start gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300',
        item.completed
          ? 'bg-gradient-to-r from-accent-50/80 to-accent-100/50 border border-accent-200/50 shadow-sm'
          : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-soft'
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => toggleItem(item.id, userId)}
        className="flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500/30 rounded-full transition-all"
      >
        {item.completed ? (
          <div className="relative">
            <CheckCircle2 className="w-5 h-5 text-accent-600 drop-shadow-sm" />
          </div>
        ) : (
          <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={clsx(
            'text-sm leading-relaxed transition-all duration-200',
            item.completed
              ? 'text-gray-500 line-through'
              : 'text-gray-800 font-medium'
          )}
        >
          {item.content}
        </p>

        {item.description && (
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Auto-checked indicator */}
        {item.autoChecked && item.matchConfidence && (
          <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg w-fit">
            <Sparkles className="w-3 h-3 text-primary-600" />
            <span className="text-xs text-primary-700 font-medium">
              AI detected ({Math.round(item.matchConfidence * 100)}%)
            </span>
          </div>
        )}
      </div>

      {/* Remove button (shown on hover) */}
      <button
        onClick={() => removeItem(item.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500/30"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
