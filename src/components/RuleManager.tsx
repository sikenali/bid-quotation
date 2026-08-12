import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { ValidRule } from '../types';

function getRuleIcon(action: ValidRule['action']) {
  const map: Record<string, string> = {
    trim_percent: 'ri-filter-line',
    remove_highest_n: 'ri-arrow-up-circle-line',
    remove_lowest_n: 'ri-arrow-down-circle-line',
    nth_lowest: 'ri-order-play-line',
    direct: 'ri-check-line',
  };
  return map[action] || 'ri-settings-line';
}

function DiceDots({ count }: { count: number }) {
  const dots = count >= 6 ? 6 : count;
  const grid: Record<number, [number, number][]> = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
  };
  const cells = grid[dots] || grid[1];
  return (
    <div className="grid grid-cols-3 gap-0.5 w-5 h-5 flex-shrink-0">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={`w-1 h-1 rounded-full ${cells.some(([r, c]) => r === Math.floor(i / 3) && c === i % 3) ? 'bg-current' : 'bg-transparent'}`} />
      ))}
    </div>
  );
}

export default function RuleManager() {
  const { validRules, addValidRule, removeValidRule, updateValidRule, theme } = useConfigStore();
  const isDark = theme === 'dark';
  const [activeRuleId, setActiveRuleId] = useState<string | null>(
    () => {
      const rules = useConfigStore.getState().validRules;
      return rules.find(r => r.minCount === 4 && r.maxCount === 4)?.id || rules[0]?.id || null;
    }
  );

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
        {validRules.map((rule, index) => {
          const isActive = rule.id === activeRuleId;
          const displayCount = rule.maxCount === -1 ? 6 : Math.min(rule.minCount, 6);
          return (
            <button
              key={rule.id}
              onClick={() => setActiveRuleId(rule.id === activeRuleId ? null : rule.id)}
              className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                isActive
                  ? 'border-[#C43A31] bg-white shadow-sm'
                  : isDark
                    ? 'border-[#3A3A3A] bg-[#2A2A2A] hover:border-[#C43A31]/40'
                    : 'border-[#E8DCC8] bg-[#FBF7EF] hover:border-[#C43A31]/40'
              }`}
            >
              {isActive && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-[#C43A31] rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
              )}
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'bg-[#FFF0ED]' : isDark ? 'bg-[#3A3A3A]' : 'bg-[#F0E8D5]'
                }`}>
                  <i className={`${getRuleIcon(rule.action)} text-[20px] ${isActive ? 'text-[#C43A31]' : isDark ? 'text-[#A89880]' : 'text-[#5C4033]'}`}></i>
                </div>
                <div className="flex flex-col">
                  <span className={`font-semibold text-[15px] ${isActive ? 'text-[#C43A31]' : isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>
                    规则{index + 1}
                  </span>
                  <span className={`text-[11px] leading-tight mt-0.5 ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>
                    {rule.maxCount === -1 ? `≥${rule.minCount}家` : `${rule.minCount}~${rule.maxCount}家`}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
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

