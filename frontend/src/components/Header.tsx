import { Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  onNewChecklist: () => void;
}

export default function Header({ onNewChecklist }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-soft">
          <Sparkles className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">SideKick</h1>
          <p className="text-xs text-gray-500">AI Sales Assistant</p>
        </div>
      </div>

      <button
        onClick={onNewChecklist}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-soft hover:shadow-soft-lg"
      >
        <Plus className="w-4 h-4" />
        New
      </button>
    </header>
  );
}
