import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import SummaryCards from '../components/SummaryCards';
import RankingTable from '../components/RankingTable';
import { exportCSV, exportMarkdown } from '../utils/export';

export default function Step5Results() {
  const navigate = useNavigate();
  const { calculationResult, setCurrentStep, exportFormat } = useConfigStore();

  if (!calculationResult) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary text-lg">暂无测算结果，请先完成前面的步骤</p>
        <button onClick={() => { setCurrentStep(1); navigate('/step-1'); }} className="btn-primary mt-6">
          返回开始
        </button>
      </div>
    );
  }

  const handleExport = () => exportFormat === 'md' ? exportMarkdown(calculationResult) : exportCSV(calculationResult);
  const handlePrev = () => { setCurrentStep(4); navigate('/step-4'); };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-[28px] font-semibold text-text">测算结果</h2>
        <p className="text-text-secondary text-[14px]">基准价计算完成，以下为各投标单位排名和得分</p>
      </div>

      {/* 基准价摘要区 */}
      <SummaryCards result={calculationResult} />

      {/* 排名表格区 */}
      <RankingTable result={calculationResult} />

      <div className="flex items-center justify-between pt-4">
        <button onClick={handlePrev} className="btn-secondary">
          <i className="ri-arrow-left-line"></i>
          <span>上一步</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-6 py-2.5 bg-[#F5EFE0] border border-[#E0D5C0] rounded-xl text-text-secondary hover:text-text transition-colors text-sm flex items-center gap-2"
          >
            <i className="ri-download-line"></i>
            <span>导出报价</span>
          </button>
          <button
            onClick={() => { setCurrentStep(1); navigate('/step-1'); }}
            className="btn-primary"
          >
            <i className="ri-bar-chart-grouped-line"></i>
            <span>报价测算</span>
          </button>
        </div>
      </div>
    </div>
  );
}
