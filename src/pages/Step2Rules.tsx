import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import RuleManager from '../components/RuleManager';
import { generateId } from '../utils/id';

export default function Step2Rules() {
  const navigate = useNavigate();
  const { setCurrentStep, validRules, addValidRule, setActiveRuleId } = useConfigStore();

  const handlePrev = () => { setCurrentStep(1); navigate('/algorithm'); };
  const handleNext = () => { setCurrentStep(3); navigate('/deduction'); };

  const handleAddRule = () => {
    const infiniteRule = validRules.find(r => r.maxCount === -1);
    let nextMin = infiniteRule ? infiniteRule.minCount + 1 : 5;
    if (!infiniteRule) {
      for (let n = 5; n <= 20; n++) {
        const covered = validRules.some(r => n >= r.minCount && n <= r.maxCount);
        if (!covered) { nextMin = n; break; }
      }
    }
    const newRule = {
      id: generateId(),
      minCount: nextMin,
      maxCount: nextMin >= 7 ? 10 : -1,
      action: 'trim_percent' as const,
      params: { trimPercent: 20 },
    };
    addValidRule(newRule);
    setActiveRuleId(newRule.id);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 sm:gap-0">
          <h2 className="text-[22px] sm:text-[28px] font-semibold text-text">判定规则</h2>
          <button
            onClick={handleAddRule}
            className="sm:hidden border-2 border-dashed rounded-lg flex items-center justify-center gap-0.5 px-2 py-1 text-[11px] text-text-secondary border-[#D4C4A8] hover:border-[#C43A31] hover:text-[#C43A31]"
          >
            <i className="ri-add-line text-sm"></i>
            <span>添加规则</span>
          </button>
        </div>
        <p className="text-text-secondary text-[12px] sm:text-[14px]">配置有效投标判定规则，按区间从上到下命中执行</p>
      </div>

      <RuleManager />

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
