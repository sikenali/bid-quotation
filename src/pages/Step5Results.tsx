import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import SummaryCards from '../components/SummaryCards';
import RankingTable from '../components/RankingTable';
import { exportCSV, exportMarkdown } from '../utils/export';

interface Props {
  includeTotalScores?: boolean;
}

export default function Step5Results({ includeTotalScores = false }: Props) {
  const navigate = useNavigate();
  const { calculationResult, setCurrentStep, exportFormat, unitScores } = useConfigStore();

  if (!calculationResult) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary text-lg">暂无测算结果，请先完成前面的步骤</p>
        <button onClick={() => { setCurrentStep(1); navigate('/algorithm'); }} className="btn-primary mt-6">
          返回开始
        </button>
      </div>
    );
  }

  const handleExport = () => exportFormat === 'md'
    ? exportMarkdown(calculationResult, includeTotalScores ? unitScores : undefined)
    : exportCSV(calculationResult, includeTotalScores ? unitScores : undefined);
  const handlePrev = () => { setCurrentStep(4); navigate('/bids'); };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-[22px] sm:text-[28px] font-semibold text-text">测算结果</h2>
        <p className="text-text-secondary text-[12px] sm:text-[14px]">基准价计算完成，以下为各投标单位排名和得分</p>
      </div>

      {/* 基准价摘要区 */}
      <SummaryCards result={calculationResult} includeTotalScores={includeTotalScores} />

      {/* 排名表格区 */}
      <RankingTable result={calculationResult} includeTotalScores={includeTotalScores} />

      <div className="flex items-start justify-between pt-4 flex-col sm:flex-row gap-3 sm:gap-0">
        <button onClick={handlePrev} className="btn-secondary w-full sm:w-auto">
          <i className="ri-arrow-left-line"></i>
          <span>上一步</span>
        </button>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#F5EFE0] border border-[#E0D5C0] rounded-xl text-text-secondary hover:text-text transition-colors text-sm flex items-center gap-2 min-h-[44px]"
          >
            <i className="ri-download-line"></i>
            <span>导出报价</span>
          </button>
          <button
            onClick={() => { setCurrentStep(4); navigate('/bids'); }}
            className="flex-1 sm:flex-none btn-primary min-h-[44px]"
          >
            <i className="ri-arrow-left-right-line"></i>
            <span>重新测算</span>
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-text-secondary pt-6 md:pt-3 lg:pt-6">© {new Date().getFullYear()} 文价猩 Powered by <a href="https://lazycat.cloud/" target="_blank" className="text-primary hover:underline">LightOS</a></p>
    </div>
  );
}
