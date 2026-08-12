import React from 'react';
import { useConfigStore } from '../stores/configStore';
import { ValidRule, TrimAction } from '../types';

const ACTION_LABELS: Record<TrimAction, string> = {
  trim_percent: '去极值',
  remove_highest_n: '去最高 N 家',
  remove_lowest_n: '去最低 N 家',
  nth_lowest: '第 N 低',
  direct: '全部参与',
};

export default function RuleManager() {
  const { validRules, addValidRule, removeValidRule, updateValidRule, theme } = useConfigStore();
  const isDark = theme === 'dark';

  const addNewRule = (action: TrimAction) => {
    const newRule: ValidRule = {
      id: crypto.randomUUID(),
      minCount: 1,
      maxCount: -1,
      action,
      params: action === 'trim_percent' ? { trimPercent: 20 } :
              action === 'remove_highest_n' ? { removeN: 1 } :
              action === 'nth_lowest' ? { nth: 2 } : {},
    };
    addValidRule(newRule);
  };

  return (
    <div className="space-y-6">
      {/* 规则标签横排 */}
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
          onClick={() => addNewRule('trim_percent')}
          className={`w-[120px] h-[52px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
            isDark ? 'border-[#3A3A3A] text-[#A89880] hover:border-[#C43A31] hover:text-[#C43A31] bg-[#1A1A1A]' : 'bg-[#FBF7EF] border-[#D4C4A8] hover:border-[#C43A31] hover:text-[#C43A31]'
          }`}
        >
          <i className="ri-add-line text-xl"></i>
          <span className="text-[13px]">添加规则</span>
        </button>
      </div>

      {/* 规则参数区 */}
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
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A]' : 'bg-white border-[#E8DCC8]/50'}`}>
      <div className="flex items-center gap-2 flex-1 flex-wrap">
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

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>执行</span>
        <select
          value={rule.action}
          onChange={(e) => onUpdate({ action: e.target.value as TrimAction })}
          className="styled-select"
        >
          {Object.entries(ACTION_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {rule.action === 'trim_percent' && (
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
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

      {rule.action === 'nth_lowest' && (
        <div className="flex items-center gap-2">
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

      <button
        onClick={onRemove}
        className={`ml-2 transition-colors ${isDark ? 'text-[#A89880] hover:text-[#C43A31]' : 'text-text-secondary hover:text-[#C43A31]'}`}
        aria-label="删除规则"
      >
        <i className="ri-close-line text-lg"></i>
      </button>
    </div>
  );
}
