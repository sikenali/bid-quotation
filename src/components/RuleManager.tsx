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
      <div className="flex flex-wrap gap-3">
        {(Object.keys(ACTION_LABELS) as TrimAction[]).map((action) => (
          <button
            key={action}
            onClick={() => addNewRule(action)}
            className="px-4 py-2 bg-card border border-border rounded-xl text-textSecondary text-sm hover:bg-white hover:border-primary hover:text-primary transition-all"
          >
            + {ACTION_LABELS[action]}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        {validRules.length === 0 ? (
          <p className="text-textSecondary text-center py-8">暂无规则，点击上方按钮添加</p>
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
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border/50">
      <div className="flex items-center gap-2 flex-1">
        <span className="text-textSecondary text-sm">当投标家数</span>
        <input
          type="number"
          value={rule.minCount}
          onChange={(e) => onUpdate({ minCount: parseInt(e.target.value) || 0 })}
          className="input-field w-16 text-center"
        />
        <span className="text-textSecondary text-sm">~</span>
        <input
          type="number"
          value={rule.maxCount === -1 ? '' : rule.maxCount}
          onChange={(e) => onUpdate({ maxCount: e.target.value ? parseInt(e.target.value) : -1 })}
          className="input-field w-16 text-center"
                placeholder="无限"
        />
        <span className="text-textSecondary text-sm">家时</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-textSecondary text-sm">执行</span>
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
          <span className="text-textSecondary text-sm">各去</span>
          <input
            type="number"
            value={rule.params.trimPercent ?? 20}
            onChange={(e) => onUpdate({ params: { ...rule.params, trimPercent: parseInt(e.target.value) || 0 } })}
            className="input-field w-16 text-center"
          />
          <span className="text-textSecondary text-sm">%</span>
        </div>
      )}

      {rule.action === 'remove_highest_n' && (
        <div className="flex items-center gap-2">
          <span className="text-textSecondary text-sm">去掉最高</span>
          <input
            type="number"
            value={rule.params.removeN ?? 1}
            onChange={(e) => onUpdate({ params: { ...rule.params, removeN: parseInt(e.target.value) || 0 } })}
            className="input-field w-16 text-center"
          />
          <span className="text-textSecondary text-sm">家</span>
        </div>
      )}

      {rule.action === 'nth_lowest' && (
        <div className="flex items-center gap-2">
          <span className="text-textSecondary text-sm">取第</span>
          <input
            type="number"
            value={rule.params.nth ?? 2}
            onChange={(e) => onUpdate({ params: { ...rule.params, nth: parseInt(e.target.value) || 0 } })}
            className="input-field w-16 text-center"
          />
          <span className="text-textSecondary text-sm">低</span>
        </div>
      )}

      <button
        onClick={onRemove}
        className="ml-2 text-textSecondary hover:text-primary transition-colors"
        aria-label="删除规则"
      >
        <i className="ri-close-line text-lg"></i>
      </button>
    </div>
  );
}
