import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import DeductionForm from '../components/DeductionForm';

export default function Step3Deduction() {
  const navigate = useNavigate();
  const { setCurrentStep } = useConfigStore();

  const handlePrev = () => {
    setCurrentStep(2);
    navigate('/step-2');
  };

  const handleNext = () => {
    setCurrentStep(4);
    navigate('/step-4');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-[28px] font-semibold text-text">扣分规则</h2>
        <p className="text-text-secondary text-[14px]">配置报价偏离基准价的扣分标准</p>
      </div>

      <DeductionForm />

      <div className="flex items-center justify-between pt-4">
        <button onClick={handlePrev} className="btn-secondary">
          <i className="ri-arrow-left-line"></i>
          <span>上一步</span>
        </button>
        <button onClick={handleNext} className="btn-primary">下一步：报价录入</button>
      </div>
    </div>
  );
}
