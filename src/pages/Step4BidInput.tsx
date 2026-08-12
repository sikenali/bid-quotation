import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import BidInput from '../components/BidInput';

export default function Step4BidInput() {
  const navigate = useNavigate();
  const { setCurrentStep, calculate } = useConfigStore();

  const handlePrev = () => { setCurrentStep(3); navigate('/step-3'); };
  const handleNext = () => {
    setCurrentStep(5);
    calculate();
    navigate('/step-5');
  };

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
        <button onClick={handleNext} className="btn-primary">
          <i className="ri-bar-chart-grouped-line"></i>
          <span>报价测算</span>
        </button>
      </div>
    </div>
  );
}
