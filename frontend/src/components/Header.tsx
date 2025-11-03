import { ChevronDown } from 'lucide-react';

interface HeaderProps {
  templates: any[];
  selectedTemplate: string;
  onTemplateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isCreating: boolean;
}

export default function Header({ templates, selectedTemplate, onTemplateChange, isCreating }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2.5">
        <img
          src="/images/sidekick-logo.svg"
          alt="Sidekick"
          className="h-6 w-auto"
        />
      </div>

      {/* Template Selector */}
      <div className="relative">
        <select
          value={selectedTemplate}
          onChange={onTemplateChange}
          disabled={isCreating}
          className="appearance-none px-3 py-1.5 pr-8 bg-gray-100 border-0 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          style={{ fontFamily: 'inherit' }}
        >
          <option value="" style={{ fontFamily: 'inherit' }}>Select Playbook</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id} style={{ fontFamily: 'inherit' }}>
              {template.name}
            </option>
          ))}
          <option value="custom" style={{ fontFamily: 'inherit' }}>+ Create Custom</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
      </div>
    </header>
  );
}
