import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import BidInput from '../components/BidInput';
import Step5Results from '../pages/Step5Results';

export default function Step4BidInput() {
  const navigate = useNavigate();
  const { setCurrentStep, calculate, unitScores } = useConfigStore();

  const handlePrev = () => { setCurrentStep(3); navigate('/deduction'); };
  const handlePriceCalc = () => {
    calculate();
    setCurrentStep(5);
    navigate('/bids?calc=1');
  };
  const handleTotalCalc = () => {
    calculate();
    navigate('/bids?total=1');
  };

  // Check if we should show total scores (from URL)
  const showTotal = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('total') === '1';
  const showCalc = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('calc') === '1';

  if ((showTotal && unitScores.length > 0) || showCalc) {
    return <Step5Results includeTotalScores={showTotal} />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-[28px] font-semibold text-text">投标报价</h2>
        <p className="text-text-secondary text-[14px]">录入各投标单位名称与报价金额</p>
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
            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 min-h-[44px]"
          >
            <i className="ri-calculator-line"></i>
            <span>总价测算</span>
          </button>
          <button onClick={handlePriceCalc} className="flex-1 sm:flex-none btn-primary min-h-[44px]">
            <i className="ri-bar-chart-grouped-line"></i>
            <span>报价测算</span>
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-text-secondary pt-6">© {new Date().getFullYear()} 文价猩 Powered by <a href="https://lazycat.cloud/" target="_blank" className="text-primary hover:underline">LightOS</a></p>
    </div>
  );
}
