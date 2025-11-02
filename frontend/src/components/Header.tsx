import { Plus } from 'lucide-react';

interface HeaderProps {
  onNewChecklist: () => void;
}

export default function Header({ onNewChecklist }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2.5">
        <img
          src="/images/sidekick-logo.svg"
          alt="Sidekick"
          className="h-8 w-auto"
        />
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
