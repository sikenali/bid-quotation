import React from 'react';
import { useConfigStore } from '../stores/configStore';
import { ValidRule } from '../types';

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
  const { validRules, addValidRule, removeValidRule, updateValidRule, theme, activeRuleId, setActiveRuleId } = useConfigStore();
  const isDark = theme === 'dark';

  const lastRule = validRules[validRules.length - 1];
  const isCappedRange = lastRule ? lastRule.maxCount === -1 && lastRule.minCount >= 7 : false;
  const isFixedRange = lastRule ? lastRule.minCount >= 7 && lastRule.maxCount === 10 : false;

  // 计算下一个可用规则的最小家数（从5开始找未被覆盖的第一个值）
  const nextMin = (() => {
    // 如果存在无限规则，nextMin = 其 minCount + 1
    const infiniteRule = validRules.find(r => r.maxCount === -1);
    if (infiniteRule) return infiniteRule.minCount + 1;
    let n = 5;
    while (n <= 20) {
      const covered = validRules.some(r => n >= r.minCount && n <= r.maxCount);
      if (!covered) return n;
      n++;
    }
    return 5;
  })();

  const addNewRule = () => {
    const newRule: ValidRule = {
      id: crypto.randomUUID(),
      minCount: nextMin,
      maxCount: nextMin >= 7 ? 10 : -1,
      action: 'trim_percent',
      params: { trimPercent: 20 },
    };
    addValidRule(newRule);
    setActiveRuleId(newRule.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {validRules.map((rule, _index) => {
          const isActive = rule.id === activeRuleId;
          const isCappedRule = rule.maxCount === -1 && rule.minCount >= 7;
          const isFixedRange = rule.minCount >= 7 && rule.maxCount === 10;
          const displayCount = isCappedRule || isFixedRange ? 6 : (rule.maxCount === -1 ? 6 : Math.min(rule.minCount, 6));
          return (
            <button
              key={rule.id}
              onClick={() => setActiveRuleId(rule.id === activeRuleId ? null : rule.id)}
              className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 w-full sm:w-[292px] flex-shrink-0 sm:flex-shrink ${
                isActive
                  ? 'border-[#C43A31] bg-white shadow-sm'
                  : isDark
                    ? 'border-[#3D3D3D] bg-[#2D2D2D] hover:border-[#C43A31]/40'
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
                  isActive ? 'bg-[#FFF0ED]' : isDark ? 'bg-[#3D3D3D]' : 'bg-[#F0E8D5]'
                }`}>
                  <DiceDots count={displayCount} />
                </div>
                <div className="flex flex-col">
                  <span className={`font-semibold text-[15px] ${isActive ? 'text-[#C43A31]' : isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>
                    投标人
                  </span>
                  <span className={`text-[11px] leading-tight mt-0.5 ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>
                    {isCappedRule ? `≥${rule.minCount}家` : isFixedRange ? `${rule.minCount}~${rule.maxCount}家` : rule.maxCount === -1 ? `≥${rule.minCount}家` : `${rule.minCount}~${rule.maxCount}家`}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
        {!isCappedRange && !isFixedRange && (
          <button
            onClick={addNewRule}
            className={`min-w-[120px] py-3 px-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
              isDark
                ? 'border-[#3D3D3D] text-[#C0B098] hover:border-[#C43A31] hover:text-[#C43A31] bg-[#252525]'
                : 'bg-white border-[#D4C4A8] hover:border-[#C43A31]/60 hover:bg-[#FFF8F5] text-text-secondary'
            }`}
          >
            <i className="ri-add-line text-xl"></i>
            <span className="text-[13px]">添加规则</span>
          </button>
        )}
      </div>

      <div className={`rounded-2xl p-6 space-y-4 border ${isDark ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-[#F5EFE0] border-[#E8DCC8]'}`}>
        <div className="flex items-center gap-5">
          <div className={`w-1.5 h-4.5 rounded-[3px] flex-shrink-0 ${isDark ? 'bg-[#C0B098]' : 'bg-[#D4C4A8]'}`} />
          <h3 className={`font-semibold text-[15px] ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>
            {validRules.length > 0 ? `投标人${validRules.length} · 参数配置` : '投标人参数配置'}
          </h3>
        </div>

        {validRules.length === 0 ? (
          <p className={`text-center py-8 ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>暂无规则，点击上方按钮添加</p>
        ) : (
          validRules.map((rule, index) => (
            <RuleRow
              key={rule.id}
              rule={rule}
              index={index}
              isActive={rule.id === activeRuleId}
              isLocked={index < 2}
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
  index,
  isActive,
  isLocked,
  isDark,
  onSelect,
  onUpdate,
  onRemove,
}: {
  rule: ValidRule;
  index: number;
  isActive: boolean;
  isLocked: boolean;
  isDark: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ValidRule>) => void;
  onRemove: () => void;
}) {
  const isCapped = rule.maxCount === -1 && rule.minCount >= 7;
  const isFixedRange = rule.minCount >= 7 && rule.maxCount === 10;
  const showCappedBadge = isCapped || isFixedRange;
  return (
    <div className={`rounded-xl border transition-all ${
      isActive
        ? isDark ? 'bg-[#252525] border-[#C43A31]/40 ring-1 ring-[#C43A31]/20' : 'bg-white border-[#C43A31]/40 ring-1 ring-[#C43A31]/10'
        : isDark ? 'bg-[#252525] border-[#3D3D3D]' : 'bg-white border-[#E8DCC8]/50'
    }`}>
      <div className="flex items-center gap-4 px-4 py-3">
        <button
          onClick={onSelect}
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
            isActive ? 'border-[#C43A31] bg-[#C43A31]' : isDark ? 'border-[#3D3D3D] bg-transparent' : 'border-[#D4C4A8] bg-transparent'
          }`}
        />
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>投标人数量</span>
          <input
            type="number"
            value={rule.minCount}
            disabled={isLocked}
            onChange={(e) => onUpdate({ minCount: parseInt(e.target.value) || 0 })}
            className={`input-field w-16 text-center ${isDark ? 'bg-[#252525] border-[#3D3D3D] text-[#F2EDE4]' : ''} ${isLocked ? 'opacity-40 cursor-not-allowed bg-[#F5EFE0] text-text-secondary' : ''}`}
          />
          <span className={`text-sm ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>~</span>
          <input
            type="number"
            value={isCapped ? 10 : (rule.maxCount === -1 ? '' : rule.maxCount)}
            onChange={(e) => onUpdate({ maxCount: e.target.value ? parseInt(e.target.value) : -1 })}
            className={`input-field w-20 text-center ${isDark ? 'bg-[#252525] border-[#3D3D3D] text-[#F2EDE4]' : ''} ${isLocked ? 'opacity-40 cursor-not-allowed bg-[#F5EFE0] text-text-secondary' : ''}`}
            placeholder={isCapped ? '10' : '无限'}
            disabled={isLocked}
          />
          <span className={`text-sm ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>家时</span>
          {isLocked && index > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8DCC8] text-text-secondary">默认</span>}
          {showCappedBadge && <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-[#C43A31]/20 text-[#C43A31]' : 'bg-[#FFF0ED] text-[#C43A31]'}`}>上限10</span>}
        </div>
        <div className="ml-auto">
          <button
            onClick={onRemove}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'text-[#C0B098] hover:text-[#C43A31] hover:bg-[#2D2D2D]' : 'text-text-secondary hover:text-[#C43A31] hover:bg-[#FFF0ED]'}`}
            aria-label="删除规则"
          >
            <i className="ri-close-line text-base"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
