import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import BidInput from '../components/BidInput';
import Step5Results from '../pages/Step5Results';

export default function Step4BidInput() {
  const navigate = useNavigate();
  const { setCurrentStep, calculate, unitScores } = useConfigStore();

  const handlePrev = () => { setCurrentStep(3); navigate('/step-3'); };
  const handlePriceCalc = () => {
    calculate();
    setCurrentStep(5);
    navigate('/step-5');
  };
  const handleTotalCalc = () => {
    calculate();
    // Navigate with total scores flag
    const url = '/step-5?total=1';
    setCurrentStep(5);
    navigate(url);
  };

  // Check if we should show total scores (from URL)
  const showTotal = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('total') === '1';

  if (showTotal && unitScores.length > 0) {
    return <Step5Results includeTotalScores={true} />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-[28px] font-semibold text-text">投标报价</h2>
        <p className="text-text-secondary text-[14px]">录入各投标单位名称与报价金额</p>
      </div>

      <BidInput />

      <div className="flex items-center justify-between pt-4">
        <button onClick={handlePrev} className="btn-secondary">
          <i className="ri-arrow-left-line"></i>
          <span>上一步</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleTotalCalc}
            className="px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <i className="ri-calculator-line"></i>
            <span>总价测算</span>
          </button>
          <button onClick={handlePriceCalc} className="btn-primary">
            <i className="ri-bar-chart-grouped-line"></i>
            <span>报价测算</span>
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-text-secondary pt-6">© 2026 Powered by LightOS</p>
    </div>
  );
}
