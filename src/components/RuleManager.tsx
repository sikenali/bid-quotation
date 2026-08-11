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
  const { validRules, addValidRule, removeValidRule, updateValidRule } = useConfigStore();

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
          className="w-[120px] h-[52px] bg-[#FBF7EF] border-2 border-dashed border-[#D4C4A8] rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#C43A31] hover:text-[#C43A31] transition-colors"
        >
          <i className="ri-add-line text-[#8B7355] text-xl hover:text-[#C43A31]"></i>
          <span className="text-text-secondary text-[13px]">添加规则</span>
        </button>
      </div>

      {/* 规则参数区 */}
      <div className="bg-[#F5EFE0] border border-[#E8DCC8] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-5">
          <div className="w-1.5 h-4.5 bg-[#D4C4A8] rounded-[3px] flex-shrink-0" />
          <h3 className="font-semibold text-text text-[15px]">
            {validRules.length > 0 ? `规则${validRules.length} · 参数配置` : '规则参数配置'}
          </h3>
        </div>

        {validRules.length === 0 ? (
          <p className="text-text-secondary text-center py-8">暂无规则，点击上方按钮添加</p>
        ) : (
          validRules.map((rule) => (
            <RuleRow
              key={rule.id}
              rule={rule}
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
  onUpdate,
  onRemove,
}: {
  rule: ValidRule;
  onUpdate: (updates: Partial<ValidRule>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[#E8DCC8]/50">
      <div className="flex items-center gap-2 flex-1">
        <span className="text-text-secondary text-sm">当投标家数</span>
        <input
          type="number"
          value={rule.minCount}
          onChange={(e) => onUpdate({ minCount: parseInt(e.target.value) || 0 })}
          className="input-field w-16 text-center"
        />
        <span className="text-text-secondary text-sm">~</span>
        <input
          type="number"
          value={rule.maxCount === -1 ? '' : rule.maxCount}
          onChange={(e) => onUpdate({ maxCount: e.target.value ? parseInt(e.target.value) : -1 })}
          className="input-field w-16 text-center"
          placeholder="无限"
        />
        <span className="text-text-secondary text-sm">家时</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-text-secondary text-sm">执行</span>
        <select
          value={rule.action}
          onChange={(e) => onUpdate({ action: e.target.value as TrimAction })}
          className="input-field"
        >
          {Object.entries(ACTION_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {rule.action === 'trim_percent' && (
        <div className="flex items-center gap-2">
          <span className="text-text-secondary text-sm">各去</span>
          <input
            type="number"
            value={rule.params.trimPercent ?? 20}
            onChange={(e) => onUpdate({ params: { ...rule.params, trimPercent: parseInt(e.target.value) || 0 } })}
            className="input-field w-16 text-center"
          />
          <span className="text-text-secondary text-sm">%</span>
        </div>
      )}

      {rule.action === 'remove_highest_n' && (
        <div className="flex items-center gap-2">
          <span className="text-text-secondary text-sm">去掉最高</span>
          <input
            type="number"
            value={rule.params.removeN ?? 1}
            onChange={(e) => onUpdate({ params: { ...rule.params, removeN: parseInt(e.target.value) || 0 } })}
            className="input-field w-16 text-center"
          />
          <span className="text-text-secondary text-sm">家</span>
        </div>
      )}

      {rule.action === 'nth_lowest' && (
        <div className="flex items-center gap-2">
          <span className="text-text-secondary text-sm">取第</span>
          <input
            type="number"
            value={rule.params.nth ?? 2}
            onChange={(e) => onUpdate({ params: { ...rule.params, nth: parseInt(e.target.value) || 0 } })}
            className="input-field w-16 text-center"
          />
          <span className="text-text-secondary text-sm">低</span>
        </div>
      )}

      <button
        onClick={onRemove}
        className="ml-2 text-text-secondary hover:text-[#C43A31] transition-colors"
        aria-label="删除规则"
      >
        <i className="ri-close-line text-lg"></i>
      </button>
    </div>
  );
}
