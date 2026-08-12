import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { ValidRule } from '../types';

export default function RuleManager() {
  const { validRules, addValidRule, removeValidRule, updateValidRule, theme } = useConfigStore();
  const isDark = theme === 'dark';
  const [activeRuleId, setActiveRuleId] = useState<string | null>(validRules[0]?.id || null);

  const addNewRule = () => {
    const { validRules } = useConfigStore.getState();
    let nextMin = 5;
    for (const r of validRules) {
      if (r.maxCount === -1 || r.maxCount >= nextMin) continue;
      if (r.minCount >= nextMin) nextMin = r.minCount + 1;
    }
    const newRule: ValidRule = {
      id: crypto.randomUUID(),
      minCount: nextMin,
      maxCount: -1,
      action: 'trim_percent',
      params: { trimPercent: 20 },
    };
    addValidRule(newRule);
    setActiveRuleId(newRule.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {validRules.map((rule, index) => (
          <button
            key={rule.id}
            onClick={() => setActiveRuleId(rule.id === activeRuleId ? null : rule.id)}
            className={`flex flex-col items-center justify-center px-5 py-3 rounded-xl min-w-[100px] transition-all border-2 ${
              rule.id === activeRuleId
                ? 'bg-[#C43A31] text-white border-[#C43A31] shadow-sm'
                : isDark
                  ? 'bg-[#2A2A2A] border-[#3A3A3A] text-[#E8E0D0] hover:border-[#C43A31]/50'
                  : 'bg-[#F5EFE0] border-[#E0D5C0] text-text hover:border-[#C43A31]/40'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                rule.id === activeRuleId ? 'border-white bg-white' : isDark ? 'border-[#A89880] bg-transparent' : 'border-[#8B7355] bg-transparent'
              }`} />
              <span className="text-[14px] font-medium">规则{index + 1}</span>
            </div>
            <span className={`text-[11px] ${rule.id === activeRuleId ? 'text-white/70' : isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>
              {rule.maxCount === -1 ? `≥${rule.minCount}家` : `${rule.minCount}~${rule.maxCount}家`}
            </span>
          </button>
        ))}
        <button
          onClick={addNewRule}
          className={`min-w-[120px] py-3 px-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
            isDark
              ? 'border-[#3A3A3A] text-[#A89880] hover:border-[#C43A31] hover:text-[#C43A31] bg-[#1A1A1A]'
              : 'bg-white border-[#D4C4A8] hover:border-[#C43A31]/60 hover:bg-[#FFF8F5] text-text-secondary'
          }`}
        >
          <i className="ri-add-line text-xl"></i>
          <span className="text-[13px]">添加规则</span>
        </button>
      </div>

      <div className={`rounded-2xl p-6 space-y-4 border ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-[#F5EFE0] border-[#E8DCC8]'}`}>
        <div className="flex items-center gap-5">
          <div className={`w-1.5 h-4.5 rounded-[3px] flex-shrink-0 ${isDark ? 'bg-[#A89880]' : 'bg-[#D4C4A8]'}`} />
          <h3 className={`font-semibold text-[15px] ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>
            {validRules.length > 0 ? `规则${validRules.length} · 参数配置` : '规则参数配置'}
          </h3>
        </div>

        {validRules.length === 0 ? (
          <p className={`text-center py-8 ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>暂无规则，点击上方按钮添加</p>
        ) : (
          validRules.map((rule) => (
            <RuleRow
              key={rule.id}
              rule={rule}
              isActive={rule.id === activeRuleId}
              isDark={isDark}
              onSelect={() => setActiveRuleId(rule.id)}
              onUpdate={(updates) => updateValidRule(rule.id, updates)}
              onRemove={() => { removeValidRule(rule.id); if (activeRuleId === rule.id) setActiveRuleId(validRules.find(r => r.id !== rule.id)?.id || null); }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function RuleRow({
  rule,
  isActive,
  isDark,
  onSelect,
  onUpdate,
  onRemove,
}: {
  rule: ValidRule;
  isActive: boolean;
  isDark: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ValidRule>) => void;
  onRemove: () => void;
}) {
  return (
    <div className={`rounded-xl border transition-all ${
      isActive
        ? isDark ? 'bg-[#1A1A1A] border-[#C43A31]/40 ring-1 ring-[#C43A31]/20' : 'bg-white border-[#C43A31]/40 ring-1 ring-[#C43A31]/10'
        : isDark ? 'bg-[#1A1A1A] border-[#3A3A3A]' : 'bg-white border-[#E8DCC8]/50'
    }`}>
      <div className="flex items-center gap-4 px-4 py-3">
        <button
          onClick={onSelect}
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
            isActive ? 'border-[#C43A31] bg-[#C43A31]' : isDark ? 'border-[#3A3A3A] bg-transparent' : 'border-[#D4C4A8] bg-transparent'
          }`}
        />
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>当投标家数</span>
          <input
            type="number"
            value={rule.minCount}
            onChange={(e) => onUpdate({ minCount: parseInt(e.target.value) || 0 })}
            className={`input-field w-16 text-center ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
          />
          <span className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>~</span>
          <input
            type="number"
            value={rule.maxCount === -1 ? '' : rule.maxCount}
            onChange={(e) => onUpdate({ maxCount: e.target.value ? parseInt(e.target.value) : -1 })}
            className={`input-field w-16 text-center ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
            placeholder="无限"
          />
          <span className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>家时</span>
        </div>
        <div className="ml-auto">
          <button
            onClick={onRemove}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'text-[#A89880] hover:text-[#C43A31] hover:bg-[#2A2A2A]' : 'text-text-secondary hover:text-[#C43A31] hover:bg-[#FFF0ED]'}`}
            aria-label="删除规则"
          >
            <i className="ri-close-line text-base"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

