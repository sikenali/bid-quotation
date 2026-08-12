import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import BidInput from '../components/BidInput';
import Step5Results from '../pages/Step5Results';

const DEFAULT_NAMES = [
  '武汉锂钠氪锶科技有限公司',
  '武汉懒猫微服科技有限公司',
  '武汉铀锂氪锶科技合伙企业（有限合伙）',
  '广西锂钠氪锶软件科技有限公司',
];

export default function Step4BidInput() {
  const navigate = useNavigate();
  const { setCurrentStep, calculate, unitScores, calculationResult, addBidUnit } = useConfigStore();
  const [isCalculating, setIsCalculating] = useState(false);

  const handleAddUnit = () => {
    const units = useConfigStore.getState().bidUnits;
    const count = units.length;
    const name = count < DEFAULT_NAMES.length
      ? DEFAULT_NAMES[count]
      : `武汉锶氪钠锂科技有限公司${count - DEFAULT_NAMES.length + 1}`;
    addBidUnit(name, 0);
  };

  const handlePrev = () => { setCurrentStep(3); navigate('/deduction'); };
  const handlePriceCalc = () => {
    setIsCalculating(true);
    setTimeout(() => {
      calculate();
      setIsCalculating(false);
      setCurrentStep(5);
      navigate('/bids?calc=1');
    }, 100);
  };
  const handleTotalCalc = () => {
    setIsCalculating(true);
    setTimeout(() => {
      calculate();
      setIsCalculating(false);
      navigate('/bids?total=1');
    }, 100);
  };

  // Check if we should show total scores (from URL)
  const showTotal = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('total') === '1';
  const showCalc = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('calc') === '1';

  if ((showTotal || showCalc) && unitScores.length > 0 && calculationResult) {
    return <Step5Results includeTotalScores={showTotal} />;
  }

  if (showTotal || showCalc) {
    navigate('/bids');
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 sm:gap-0">
          <h2 className="text-[22px] sm:text-[28px] font-semibold text-text">投标报价</h2>
          <button
            onClick={handleAddUnit}
            className="sm:hidden border-2 border-dashed rounded-lg flex items-center justify-center gap-0.5 px-2 py-1 text-[11px] text-text-secondary border-[#D4C4A8] hover:border-[#C43A31] hover:text-[#C43A31]"
          >
            <i className="ri-add-line text-sm"></i>
            添加单位
          </button>
        </div>
        <p className="text-text-secondary text-[12px] sm:text-[14px]">录入各投标单位名称与报价金额</p>
      </div>

      <BidInput />

      <div className="flex items-center justify-center sm:justify-between pt-4 flex-col sm:flex-row gap-3 sm:gap-0">
        <button onClick={handlePrev} className="btn-secondary w-full sm:w-auto">
          <i className="ri-arrow-left-line"></i>
          <span>上一步</span>
        </button>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleTotalCalc}
            disabled={isCalculating}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 min-h-[44px] disabled:opacity-50"
          >
            {isCalculating ? <i className="ri-loader-2-line animate-spin"></i> : <i className="ri-calculator-line"></i>}
            <span>{isCalculating ? '计算中...' : '总价测算'}</span>
          </button>
          <button onClick={handlePriceCalc} disabled={isCalculating} className="flex-1 sm:flex-none btn-primary min-h-[44px] disabled:opacity-50">
            {isCalculating ? <i className="ri-loader-2-line animate-spin"></i> : <i className="ri-bar-chart-grouped-line"></i>}
            <span>{isCalculating ? '计算中...' : '报价测算'}</span>
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-text-secondary pt-6 md:pt-3 lg:pt-6">© {new Date().getFullYear()} 文价猩 Powered by <a href="https://lazycat.cloud/" target="_blank" className="text-primary hover:underline">LightOS</a></p>
    </div>
  );
}
