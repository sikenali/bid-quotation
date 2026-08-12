import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import RuleManager from '../components/RuleManager';

export default function Step2Rules() {
  const navigate = useNavigate();
  const { setCurrentStep } = useConfigStore();

  const handlePrev = () => { setCurrentStep(1); navigate('/algorithm'); };
  const handleNext = () => { setCurrentStep(3); navigate('/deduction'); };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-[28px] font-semibold text-text">判定规则</h2>
        <p className="text-text-secondary text-[14px]">配置有效投标判定规则，按区间从上到下命中执行</p>
      </div>

      <RuleManager />

      <div className="flex items-center justify-between pt-4">
        <button onClick={handlePrev} className="btn-secondary">
          <i className="ri-arrow-left-line"></i>
          <span>上一步</span>
        </button>
        <button onClick={handleNext} className="btn-primary">下一步</button>
      </div>
      <p className="text-center text-xs text-text-secondary pt-6">© {new Date().getFullYear()} 文价猩 Powered by <a href="https://lazycat.cloud/" target="_blank" className="text-primary hover:underline">LightOS</a></p>
    </div>
  );
}
