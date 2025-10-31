import { Plus, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onNewChecklist: () => void;
}

export default function Header({ onNewChecklist }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-6 h-6 text-primary-600" />
        <h1 className="text-lg font-semibold text-gray-900">SideKick</h1>
      </div>

      <button
        onClick={onNewChecklist}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        New Checklist
      </button>
    </header>
  );
}
