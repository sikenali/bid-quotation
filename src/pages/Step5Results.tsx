import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import SummaryCards from '../components/SummaryCards';
import RankingTable from '../components/RankingTable';
import { exportCSV } from '../utils/export';

export default function Step5Results() {
  const navigate = useNavigate();
  const { calculationResult, setCurrentStep } = useConfigStore();

  if (!calculationResult) {
    return (
      <div className="text-center py-20">
        <p className="text-textSecondary text-lg">暂无测算结果，请先完成前面的步骤</p>
        <button onClick={() => { setCurrentStep(1); navigate('/step-1'); }} className="btn-primary mt-6">
          返回开始
        </button>
      </div>
    );
  }

  const handleExport = () => exportCSV(calculationResult);
  const handlePrev = () => { setCurrentStep(4); navigate('/step-4'); };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text">测算结果</h2>
        <p className="text-textSecondary">基准价计算完成，以下为各投标单位排名和得分</p>
      </div>

      <SummaryCards result={calculationResult} />
      <RankingTable result={calculationResult} />

      <div className="flex items-center justify-between pt-4">
        <button onClick={handlePrev} className="btn-secondary">上一步</button>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="btn-secondary">
            <span><i className="ri-download-line"></i></span>
            <span>导出 CSV</span>
          </button>
          <button onClick={() => { setCurrentStep(1); navigate('/step-1'); }} className="btn-secondary">
            重新测算
          </button>
        </div>
      </div>
    </div>
  );
}
