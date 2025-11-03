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
          className="h-6 w-auto"
        />
      </div>

      <button
        onClick={onNewChecklist}
        className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
      </button>
    </header>
  );
}
