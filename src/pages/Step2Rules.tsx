import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import RuleManager from '../components/RuleManager';

export default function Step2Rules() {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep } = useConfigStore();

  const handlePrev = () => { setCurrentStep(1); navigate('/step-1'); };
  const handleNext = () => { setCurrentStep(3); navigate('/step-3'); };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text">设置有效投标判定规则</h2>
        <p className="text-textSecondary">根据招标文件，配置有效投标的判定条件和计算方式</p>
      </div>

      <RuleManager />

      <div className="flex items-center justify-between pt-4">
        <button onClick={handlePrev} className="btn-secondary">上一步</button>
        <button onClick={handleNext} className="btn-primary">下一步</button>
      </div>
    </div>
  );
}
