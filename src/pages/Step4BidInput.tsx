import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import BidInput from '../components/BidInput';
import Step5Results from '../pages/Step5Results';

export default function Step4BidInput() {
  const navigate = useNavigate();
  const { setCurrentStep, calculate, unitScores } = useConfigStore();
  const [isCalculating, setIsCalculating] = useState(false);

  const handlePrev = () => { setCurrentStep(3); navigate('/deduction'); };
  const handlePriceCalc = () => {
    setIsCalculating(true);
    setTimeout(() => {
      calculate();
      setIsCalculating(false);
      setCurrentStep(5);
      navigate('/bids?calc=1');
    }, 100);
  };
  const handleTotalCalc = () => {
    setIsCalculating(true);
    setTimeout(() => {
      calculate();
      setIsCalculating(false);
      navigate('/bids?total=1');
    }, 100);
  };

  // Check if we should show total scores (from URL)
  const showTotal = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('total') === '1';
  const showCalc = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('calc') === '1';

  if ((showTotal || showCalc) && unitScores.length > 0) {
    return <Step5Results includeTotalScores={showTotal} />;
  }

  if (showTotal || showCalc) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary text-lg">暂无测算数据，请先录入报价</p>
        <button onClick={() => navigate('/bids')} className="btn-primary mt-6">
          <i className="ri-arrow-left-line"></i>
          <span>返回录入</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-[22px] sm:text-[28px] font-semibold text-text">投标报价</h2>
        <p className="text-text-secondary text-[12px] sm:text-[14px]">录入各投标单位名称与报价金额</p>
      </div>

      <BidInput />

      <div className="flex items-start justify-between pt-4 flex-col sm:flex-row gap-3 sm:gap-0">
        <button onClick={handlePrev} className="btn-secondary w-full sm:w-auto">
          <i className="ri-arrow-left-line"></i>
          <span>上一步</span>
        </button>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleTotalCalc}
            disabled={isCalculating}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 min-h-[44px] disabled:opacity-50"
          >
            {isCalculating ? <i className="ri-loader-2-line animate-spin"></i> : <i className="ri-calculator-line"></i>}
            <span>{isCalculating ? '计算中...' : '总价测算'}</span>
          </button>
          <button onClick={handlePriceCalc} disabled={isCalculating} className="flex-1 sm:flex-none btn-primary min-h-[44px] disabled:opacity-50">
            {isCalculating ? <i className="ri-loader-2-line animate-spin"></i> : <i className="ri-bar-chart-grouped-line"></i>}
            <span>{isCalculating ? '计算中...' : '报价测算'}</span>
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-text-secondary pt-6">© {new Date().getFullYear()} 文价猩 Powered by <a href="https://lazycat.cloud/" target="_blank" className="text-primary hover:underline">LightOS</a></p>
    </div>
  );
}
