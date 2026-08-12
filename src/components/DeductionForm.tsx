import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { Algorithm, DeductionParams } from '../types';

const ALGORITHM_FORMULA: Record<Algorithm, { title: string; steps: string[] }> = {
  low_price_priority: {
    title: '低价优先法',
    steps: [
      '基准价 = 满足要求且最后磋商报价最低的报价',
      '得分 = (基准价 / 最终报价) × 满分',
      '最低价得满分，报价越低得分越高',
    ],
  },
  average_price: {
    title: '平均价计法',
    steps: [
      '基准价 = 满足要求且最后磋商报价的平均值',
      '得分 = ((基准价 - |基准价 - 最终报价|) / 基准价) × 满分',
      '偏离平均值越多，得分越低',
    ],
  },
  gradient_method: {
    title: '基准价梯度法',
    steps: [
      '基准价 = 技术评审得分前两名的投标单位报价的算术平均值',
      '报价 ≤ 基准价：得分 = (1 - |报价 - 基准价| / 基准价) × 标准分',
      '报价 > 基准价：得分 = 上述结果 × 0.95（高于基准价额外打95折）',
    ],
  },
  conventional_method: {
    title: '基准价常规法',
    steps: [
      '基准价为满足磋商文件要求且最后磋商报价的平均值',
      '价格评分 = (评标基准价格 / 评标价格) × 价格分',
      '报价越低得分越高，四舍五入保留两位小数',
    ],
  },
  ai_parse: {
    title: 'AI 智能解析',
    steps: ['粘贴招标文件原文，AI 自动识别评分办法'],
  },
};

interface DeductionFormProps {
  bidDocumentText?: string;
}

export default function DeductionForm({ bidDocumentText = '' }: DeductionFormProps) {
  const { deduction, setDeduction, algorithm, theme } = useConfigStore();
  const [isDragging, setIsDragging] = useState(false);
  const isDark = theme === 'dark';
  const formula = ALGORITHM_FORMULA[algorithm];

  const update = (partial: Partial<DeductionParams>) =>
    setDeduction({ ...deduction, ...partial });

  const currentDeduct = deduction.deductPerHighPercent || 0;
  const currentDeductLow = deduction.deductPerLowPercent || 0;

  return (
    <div className="space-y-6">
      {/* 扣分参数区 */}
      <div className={`rounded-2xl p-6 space-y-5 border ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-[#F5EFE0] border-[#E8DCC8]'}`}>
        <div className="flex items-center gap-5">
          <div className={`w-1.5 h-4.5 rounded-[3px] flex-shrink-0 ${isDark ? 'bg-[#A89880]' : 'bg-[#D4C4A8]'}`} />
          <h3 className={`font-semibold text-[15px] ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>得分扣减规则</h3>
        </div>

        <div className={`flex items-stretch gap-0 rounded-xl overflow-hidden border ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A]' : 'bg-white border-[#E8DCC8]'}`}>
          {/* 满分 */}
          <div className={`flex-1 p-4 flex flex-col gap-1.5 ${isDark ? 'border-r border-[#3A3A3A]' : 'border-r border-[#E8DCC8]'}`}>
            <label className={`text-xs ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>满分 (分)</label>
            <input
              type="number"
              step="1"
              min="0"
              value={deduction.fullScore}
              onChange={(e) => update({ fullScore: parseFloat(e.target.value) || 0 })}
              className={`input-field w-full text-sm text-center ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
            />
          </div>
          <div className={`w-px flex-shrink-0 ${isDark ? 'bg-[#3A3A3A]' : 'bg-[#D4C4A8]'}`} />
          {/* 每高 1% 扣 */}
          <div className={`flex-1 p-4 flex flex-col gap-1.5 ${isDark ? 'border-r border-[#3A3A3A]' : 'border-r border-[#E8DCC8]'}`}>
            <label className={`text-xs ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>每高 1% 扣 (分)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={currentDeduct}
              onChange={(e) => update({ deductPerHighPercent: parseFloat(e.target.value) || 0 })}
              className={`input-field w-full text-sm text-center ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
            />
          </div>
          <div className={`w-px flex-shrink-0 ${isDark ? 'bg-[#3A3A3A]' : 'bg-[#D4C4A8]'}`} />
          {/* 每低 1% 扣 */}
          <div className={`flex-1 p-4 flex flex-col gap-1.5 ${isDark ? 'border-r border-[#3A3A3A]' : 'border-r border-[#E8DCC8]'}`}>
            <label className={`text-xs ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>每低 1% 扣 (分)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={currentDeductLow}
              onChange={(e) => update({ deductPerLowPercent: parseFloat(e.target.value) || 0 })}
              className={`input-field w-full text-sm text-center ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
            />
          </div>
          <div className={`w-px flex-shrink-0 ${isDark ? 'bg-[#3A3A3A]' : 'bg-[#D4C4A8]'}`} />
          {/* 最低得分 */}
          <div className="flex-1 p-4 flex flex-col gap-1.5">
            <label className={`text-xs ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>最低得分 (分)</label>
            <input
              type="number"
              step="1"
              min="0"
              value={deduction.minScore}
              onChange={(e) => update({ minScore: parseFloat(e.target.value) || 0 })}
              className={`input-field w-full text-sm text-center ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
            />
          </div>
        </div>

        {/* 算法评分步骤 + 公式说明 */}
        <div className={`rounded-lg px-4 py-3 text-xs space-y-1 ${isDark ? 'bg-[#1A1A1A] text-[#A89880]' : 'bg-[#FBF7EF] text-text-secondary'}`}>
          {formula && formula.steps.map((step, i) => (
            <p key={i} className="flex items-start gap-2">
              <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-[#3A3A3A] text-[#A89880]' : 'bg-white text-[#8B7355]'}`}>{i + 1}</span>
              <span>{step}</span>
            </p>
          ))}
          {formula && (
            <p className="mt-2">
              <span className={`font-medium ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>{formula.title}评分：</span>
              得分 = 满分 − |报价 − 基准价|/基准价 × 100% × 扣分值
            </p>
          )}
          <p>
            高于基准价：每高 1% 扣 {currentDeduct} 分
            {' · '}
            低于基准价：每低 1% 扣 {currentDeductLow} 分
            {' · '}
            得分不低于 {deduction.minScore} 分
          </p>
          {algorithm === 'gradient_method' && (
            <p className="text-[#C43A31] font-medium mt-1">
              梯度法附加规则：报价高于基准价时，最终得分 × 0.95（打九五折）
            </p>
          )}
        </div>
      </div>

      {/* 招标文件规则原文对照 */}
      <div className={`rounded-2xl p-6 space-y-4 border ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-[#F5EFE0] border-[#E8DCC8]'}`}>
        <div className="flex items-center gap-5">
          <div className={`w-1.5 h-4.5 rounded-[3px] flex-shrink-0 ${isDark ? 'bg-[#C8A45C]' : 'bg-[#C8A45C]'}`} />
          <h3 className={`font-semibold text-[15px] ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>招标文件规则原文对照</h3>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          className={`rounded-xl p-5 border-2 transition-colors ${
            isDragging
              ? 'border-[#C43A31] bg-[#FFF0ED]'
              : isDark
                ? 'border-[#3A3A3A] bg-[#1A1A1A]'
                : 'border-[#D4C4A8] bg-white'
          }`}
        >
          <div className="text-center py-4">
            <i className={`ri-upload-cloud-2-line text-3xl mb-2 ${isDark ? 'text-[#A89880]' : 'text-[#D4C4A8]'}`}></i>
            <p className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>拖拽文件到此处，或点击下方按钮上传</p>
            <p className={`text-xs mt-1 ${isDark ? 'text-[#A89880]/60' : 'text-text-secondary/60'}`}>支持 .txt .pdf .doc 格式</p>
          </div>
          <div className="mt-3 flex justify-center">
            <label className="px-4 py-2 bg-[#C43A31] text-white rounded-lg text-sm font-medium hover:bg-[#A83028] transition-colors cursor-pointer flex items-center gap-2">
              <i className="ri-upload-line"></i>
              选择文件
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
