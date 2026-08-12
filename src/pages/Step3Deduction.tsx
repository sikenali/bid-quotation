import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import DeductionForm from '../components/DeductionForm';

export default function Step3Deduction() {
  const navigate = useNavigate();
  const { setCurrentStep } = useConfigStore();

  const handlePrev = () => {
    setCurrentStep(2);
    navigate('/rules');
  };

  const handleNext = () => {
    setCurrentStep(4);
    navigate('/bids');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-[22px] sm:text-[28px] font-semibold text-text">扣分规则</h2>
        <p className="text-text-secondary text-[12px] sm:text-[14px]">配置报价偏离基准价的扣分标准</p>
      </div>

      <DeductionForm />

      <div className="flex items-center justify-center sm:justify-between pt-4 flex-col sm:flex-row gap-3 sm:gap-0">
        <button onClick={handlePrev} className="btn-secondary w-full sm:w-auto">
          <i className="ri-arrow-left-line"></i>
          <span>上一步</span>
        </button>
        <button onClick={handleNext} className="btn-primary w-full sm:w-auto">下一步</button>
      </div>
      <p className="text-center text-xs text-text-secondary pt-6 md:pt-3 lg:pt-6">© {new Date().getFullYear()} 文价猩 Powered by <a href="https://lazycat.cloud/" target="_blank" className="text-primary hover:underline">LightOS</a></p>
    </div>
  );
}
