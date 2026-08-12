import React from 'react';
import { useConfigStore } from '../stores/configStore';
import { PRESET_TEMPLATES } from '../utils/templates';

export function TemplateSelector() {
  const { loadTemplate, algorithm, theme } = useConfigStore();
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-2xl p-5 border ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-[#F5EFE0] border-[#E8DCC8]'}`}>
      <h3 className={`font-semibold text-sm mb-3 ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>快速模板</h3>
      <div className="flex flex-wrap gap-2">
        {PRESET_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => loadTemplate(template.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              algorithm === template.config.algorithm
                ? 'bg-[#C43A31] text-white'
                : isDark
                  ? 'bg-[#3A3A3A] text-[#A89880] hover:bg-[#2A2A2A] hover:text-[#E8E0D0]'
                  : 'bg-[#F0E8D5] text-text-secondary hover:bg-white hover:text-text'
            }`}
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
}
