import React from 'react';
import { useConfigStore } from '../stores/configStore';
import { ValidRule, TrimAction } from '../types';

const ACTIONS: { value: TrimAction; label: string }[] = [
  { value: 'trim_percent', label: '去极值' },
  { value: 'remove_highest_n', label: '去最高N家' },
  { value: 'remove_lowest_n', label: '去最低N家' },
  { value: 'nth_lowest', label: '第N低' },
  { value: 'direct', label: '全部参与' },
];

export default function RuleManager() {
  const { validRules, addValidRule, removeValidRule, updateValidRule, theme } = useConfigStore();
  const isDark = theme === 'dark';

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
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {validRules.map((rule, index) => (
          <div
            key={rule.id}
            className="flex flex-col items-center justify-center px-5 py-3 bg-[#C43A31] rounded-xl gap-1 min-w-[100px]"
          >
            <span className="text-white text-[14px] font-medium">规则{index + 1}</span>
            <span className="text-white/70 text-[11px]">
              {rule.maxCount === -1 ? `≥${rule.minCount}家` : `${rule.minCount}~${rule.maxCount}家`}
            </span>
          </div>
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
              isDark={isDark}
              onUpdate={(updates) => updateValidRule(rule.id, updates)}
              onRemove={() => removeValidRule(rule.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function RuleRow({
  rule,
  isDark,
  onUpdate,
  onRemove,
}: {
  rule: ValidRule;
  isDark: boolean;
  onUpdate: (updates: Partial<ValidRule>) => void;
  onRemove: () => void;
}) {
  return (
    <div className={`rounded-xl border ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A]' : 'bg-white border-[#E8DCC8]/50'}`}>
      {/* 第一行：家数区间 + 动作选择 */}
      <div className="flex items-center gap-4 px-4 py-3 flex-wrap">
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

        <div className={`h-5 w-px ${isDark ? 'bg-[#3A3A3A]' : 'bg-[#E8DCC8]'}`} />

        <div className="flex items-center gap-1">
          {ACTIONS.map((a) => (
            <button
              key={a.value}
              onClick={() => {
                const baseParams: Record<string, Record<string, number>> = {
                  trim_percent: { trimPercent: 20 },
                  remove_highest_n: { removeN: 1 },
                  remove_lowest_n: { removeN: 1 },
                  nth_lowest: { nth: 2 },
                };
                onUpdate({
                  action: a.value,
                  params: rule.action === a.value ? rule.params : (baseParams[a.value] ?? {}),
                });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                rule.action === a.value
                  ? 'bg-[#C43A31] text-white'
                  : isDark
                    ? 'bg-[#2A2A2A] text-[#A89880] hover:text-white'
                    : 'bg-[#F5EFE0] text-text-secondary hover:text-text'
              }`}
            >
              {a.label}
            </button>
          ))}
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

      {/* 第二行：动作参数 */}
      {rule.action === 'trim_percent' && (
        <div className={`flex items-center gap-2 px-4 py-2.5 border-t ${isDark ? 'border-[#3A3A3A] bg-[#2A2A2A]/50' : 'border-[#F5EFE0] bg-[#FBF7EF]'}`}>
          <span className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>各去</span>
          <input
            type="number"
            value={rule.params.trimPercent ?? 20}
            onChange={(e) => onUpdate({ params: { ...rule.params, trimPercent: parseInt(e.target.value) || 0 } })}
            className={`input-field w-16 text-center ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
          />
          <span className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>%</span>
        </div>
      )}
      {rule.action === 'remove_highest_n' && (
        <div className={`flex items-center gap-2 px-4 py-2.5 border-t ${isDark ? 'border-[#3A3A3A] bg-[#2A2A2A]/50' : 'border-[#F5EFE0] bg-[#FBF7EF]'}`}>
          <span className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>去掉最高</span>
          <input
            type="number"
            value={rule.params.removeN ?? 1}
            onChange={(e) => onUpdate({ params: { ...rule.params, removeN: parseInt(e.target.value) || 0 } })}
            className={`input-field w-16 text-center ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
          />
          <span className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>家</span>
        </div>
      )}
      {rule.action === 'remove_lowest_n' && (
        <div className={`flex items-center gap-2 px-4 py-2.5 border-t ${isDark ? 'border-[#3A3A3A] bg-[#2A2A2A]/50' : 'border-[#F5EFE0] bg-[#FBF7EF]'}`}>
          <span className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>去掉最低</span>
          <input
            type="number"
            value={rule.params.removeN ?? 1}
            onChange={(e) => onUpdate({ params: { ...rule.params, removeN: parseInt(e.target.value) || 0 } })}
            className={`input-field w-16 text-center ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
          />
          <span className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>家</span>
        </div>
      )}
      {rule.action === 'nth_lowest' && (
        <div className={`flex items-center gap-2 px-4 py-2.5 border-t ${isDark ? 'border-[#3A3A3A] bg-[#2A2A2A]/50' : 'border-[#F5EFE0] bg-[#FBF7EF]'}`}>
          <span className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>取第</span>
          <input
            type="number"
            value={rule.params.nth ?? 2}
            onChange={(e) => onUpdate({ params: { ...rule.params, nth: parseInt(e.target.value) || 0 } })}
            className={`input-field w-16 text-center ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
          />
          <span className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>低</span>
        </div>
      )}
    </div>
  );
}

