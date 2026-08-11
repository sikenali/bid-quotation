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
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text">设置扣分规则</h2>
        <p className="text-text-secondary text-sm">
          根据招标文件，配置基准价偏离后的得分扣减参数
        </p>
      </div>

      <DeductionForm />

      <div className="flex items-center justify-between pt-4">
        <button onClick={handlePrev} className="btn-secondary">上一步</button>
        <button onClick={handleNext} className="btn-primary">下一步：报价录入</button>
      </div>
    </div>
  );
}
