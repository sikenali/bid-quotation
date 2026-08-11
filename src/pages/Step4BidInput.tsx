import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import BidInput from '../components/BidInput';

export default function Step4BidInput() {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep, calculate } = useConfigStore();

  const handlePrev = () => { setCurrentStep(3); navigate('/step-3'); };
  const handleNext = () => {
    setCurrentStep(5);
    calculate();
    navigate('/step-5');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text">录入投标报价</h2>
        <p className="text-text-secondary">添加投标单位名称和报价金额，支持批量解析</p>
      </div>

      <BidInput />

      <div className="flex items-center justify-between pt-4">
        <button onClick={handlePrev} className="btn-secondary">上一步</button>
        <button onClick={handleNext} className="btn-primary">
          <span>测算结果</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
