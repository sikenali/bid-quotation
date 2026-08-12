import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { DeductionParams } from '../types';

interface DeductionFormProps {
  bidDocumentText?: string;
}

export default function DeductionForm({ bidDocumentText = '' }: DeductionFormProps) {
  const { deduction, setDeduction, theme } = useConfigStore();
  const [docText, setDocText] = useState(bidDocumentText);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const update = (partial: Partial<DeductionParams>) =>
    setDeduction({ ...deduction, ...partial });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setDocText(text);
      };
      reader.readAsText(file);
    }
  };

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
              value={deduction.deductPerHighPercent}
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
              value={deduction.deductPerLowPercent}
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

        {/* 公式说明 */}
        <div className={`rounded-lg px-4 py-3 text-xs space-y-1 ${isDark ? 'bg-[#1A1A1A] text-[#A89880]' : 'bg-bg text-text-secondary'}`}>
          <p>
            <span className={`font-medium ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>得分公式：</span>
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

      {/* 招标文件规则原文对照 */}
      <div className={`rounded-2xl p-6 space-y-4 border ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-[#F5EFE0] border-[#E8DCC8]'}`}>
        <div className="flex items-center gap-5">
          <div className={`w-1.5 h-4.5 rounded-[3px] flex-shrink-0 ${isDark ? 'bg-[#C8A45C]' : 'bg-[#C8A45C]'}`} />
          <h3 className={`font-semibold text-[15px] ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>招标文件规则原文对照</h3>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`rounded-xl p-5 border-2 transition-colors ${
            isDragging
              ? 'border-[#C43A31] bg-[#FFF0ED]'
              : isDark
                ? 'border-[#3A3A3A] bg-[#1A1A1A]'
                : 'border-[#D4C4A8] bg-white'
          }`}
        >
          {uploadedFile ? (
            <div className="flex items-center gap-3">
              <i className="ri-file-text-line text-[#C43A31] text-xl"></i>
              <span className={`text-sm ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>{uploadedFile}</span>
              <button
                onClick={() => { setUploadedFile(null); setDocText(''); }}
                className={`ml-auto transition-colors ${isDark ? 'text-[#A89880] hover:text-red-500' : 'text-text-secondary hover:text-red-500'}`}
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <i className={`ri-upload-cloud-2-line text-3xl mb-2 ${isDark ? 'text-[#A89880]' : 'text-[#D4C4A8]'}`}></i>
              <p className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>拖拽文件到此处，或点击下方按钮上传</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-[#A89880]/60' : 'text-text-secondary/60'}`}>支持 .txt .pdf .doc 格式</p>
            </div>
          )}
          {!uploadedFile && (
            <div className="mt-3 flex justify-center">
              <label className="px-4 py-2 bg-[#C43A31] text-white rounded-lg text-sm font-medium hover:bg-[#A83028] transition-colors cursor-pointer flex items-center gap-2">
                <i className="ri-upload-line"></i>
                选择文件
                <input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadedFile(file.name);
                      const reader = new FileReader();
                      reader.onload = (ev) => setDocText(ev.target?.result as string);
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
            </div>
          )}
        </div>

        <textarea
          value={docText}
          onChange={(e) => setDocText(e.target.value)}
          rows={4}
          placeholder="粘贴招标文件中关于扣分规则的原文描述..."
          className={`input-field w-full text-sm resize-none ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
        />
        <p className={`text-xs ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>
          将招标文件原文粘贴到上方，便于与配置的扣分参数进行对照校验。
        </p>
      </div>
    </div>
  );
}
