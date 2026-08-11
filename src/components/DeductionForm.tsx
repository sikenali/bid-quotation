import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { DeductionParams } from '../types';

interface DeductionFormProps {
  bidDocumentText?: string;
}

export default function DeductionForm({ bidDocumentText = '' }: DeductionFormProps) {
  const { deduction, setDeduction } = useConfigStore();
  const [docText, setDocText] = useState(bidDocumentText);
  const [showDocSection, setShowDocSection] = useState(false);

  const update = (partial: Partial<DeductionParams>) =>
    setDeduction({ ...deduction, ...partial });

  return (
    <div className="space-y-6">
      {/* 扣分参数卡片 */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h3 className="font-semibold text-text text-sm">得分扣减规则</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-text-secondary text-xs mb-1">满分 (分)</label>
            <input
              type="number"
              step="1"
              min="0"
              value={deduction.fullScore}
              onChange={(e) => update({ fullScore: parseFloat(e.target.value) || 0 })}
              className="input-field w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-xs mb-1">最低得分 (分)</label>
            <input
              type="number"
              step="1"
              min="0"
              value={deduction.minScore}
              onChange={(e) => update({ minScore: parseFloat(e.target.value) || 0 })}
              className="input-field w-full text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-text-secondary text-xs mb-1">每高 1% 扣 (分)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={deduction.deductPerHighPercent}
              onChange={(e) => update({ deductPerHighPercent: parseFloat(e.target.value) || 0 })}
              className="input-field w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-xs mb-1">每低 1% 扣 (分)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={deduction.deductPerLowPercent}
              onChange={(e) => update({ deductPerLowPercent: parseFloat(e.target.value) || 0 })}
              className="input-field w-full text-sm"
            />
          </div>
        </div>

        {/* 公式说明 */}
        <div className="bg-bg rounded-lg px-4 py-3 text-text-secondary text-xs space-y-1">
          <p>
            <span className="font-medium text-text">得分公式：</span>
            得分 = 满分 − |报价 − 基准价|/基准价 × 100% × 扣分值
          </p>
          <p className="text-text-secondary/70">
            高于基准价：每高 1% 扣 {deduction.deductPerHighPercent} 分
            {' · '}
            低于基准价：每低 1% 扣 {deduction.deductPerLowPercent} 分
            {' · '}
            得分不低于 {deduction.minScore} 分
          </p>
        </div>
      </div>

      {/* 招标文件规则原文对照（可折叠） */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setShowDocSection(!showDocSection)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-border-light/30 transition-colors"
        >
          <span className="font-semibold text-text text-sm">招标文件规则原文对照</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-text-secondary transition-transform ${showDocSection ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {showDocSection && (
          <div className="px-6 pb-5 border-t border-border/50 pt-4">
            <textarea
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              rows={6}
              placeholder="粘贴招标文件中关于扣分规则的原文描述..."
              className="input-field w-full text-sm resize-none"
            />
            <p className="text-text-secondary text-xs mt-2">
              将招标文件原文粘贴到上方，便于与配置的扣分参数进行对照校验。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
