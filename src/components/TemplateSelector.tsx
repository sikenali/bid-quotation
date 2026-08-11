import React from 'react';
import { useConfigStore } from '../stores/configStore';
import { PRESET_TEMPLATES } from '../utils/templates';

export function TemplateSelector() {
  const { loadTemplate, algorithm } = useConfigStore();

  return (
    <div className="bg-[#F5EFE0] border border-[#E8DCC8] rounded-2xl p-5">
      <h3 className="font-semibold text-text text-sm mb-3">快速模板</h3>
      <div className="flex flex-wrap gap-2">
        {PRESET_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => loadTemplate(template.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              algorithm === template.config.algorithm
                ? 'bg-[#C43A31] text-white'
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
