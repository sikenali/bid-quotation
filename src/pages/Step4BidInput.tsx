import React, { useEffect, useState } from 'react';
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
  // === 所有 Hooks 必须在组件最顶层声明（所有条件/return 之前）===
  const navigate = useNavigate();
  const { setCurrentStep, calculate, unitScores, calculationResult, addBidUnit, bidUnits } = useConfigStore();
  const [isCalculating, setIsCalculating] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // 1. hydrated 延迟
  useEffect(() => {
    const t = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(t);
  }, []);

  // 2. URL 参数模式下，刷新后若已有 bidUnits 但无 calculationResult，自动重算
  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams(window.location.search);
    const showTotal = params.get('total') === '1';
    const showCalc = params.get('calc') === '1';
    if ((showTotal || showCalc) && !calculationResult && bidUnits.length > 0 && bidUnits.some((b) => b.price > 0)) {
      setIsCalculating(true);
      const id = setTimeout(() => {
        calculate();
        setIsCalculating(false);
        setCurrentStep(5);
      }, 100);
      return () => clearTimeout(id);
    }
  }, [hydrated, calculationResult, bidUnits, calculate, setCurrentStep]);

  // 3. URL 参数模式下，完全没数据时跳转
  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams(window.location.search);
    const showTotal = params.get('total') === '1';
    const showCalc = params.get('calc') === '1';
    if ((showTotal || showCalc) && !calculationResult && !isCalculating) {
      if (bidUnits.length === 0 || !bidUnits.some((b) => b.price > 0)) {
        navigate('/bids', { replace: true });
      }
    }
  }, [hydrated, calculationResult, isCalculating, bidUnits, navigate]);

  // === 以下为非 Hook 逻辑与渲染 ===
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
    const id = setTimeout(() => {
      calculate();
      setIsCalculating(false);
      setCurrentStep(5);
      navigate('/bids?calc=1');
    }, 100);
    // 清理定时器避免组件卸载后继续执行
    return () => clearTimeout(id);
  };
  const handleTotalCalc = () => {
    setIsCalculating(true);
    const id = setTimeout(() => {
      calculate();
      setIsCalculating(false);
      navigate('/bids?total=1');
    }, 100);
    return () => clearTimeout(id);
  };

  // hydrated=false 时显示骨架（注意：此 return 在所有 Hook 之后，符合规则）
  if (!hydrated) {
    return <div className="py-20" />;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const showTotal = searchParams.get('total') === '1';
  const showCalc = searchParams.get('calc') === '1';

  if ((showTotal || showCalc) && calculationResult) {
    return <Step5Results includeTotalScores={showTotal} />;
  }

  if ((showTotal || showCalc) && isCalculating) {
    return (
      <div className="text-center py-20">
        <div className="inline-block">
          <i className="ri-loader-2-line animate-spin text-4xl text-primary"></i>
        </div>
        <p className="text-text-secondary text-lg mt-4">正在恢复测算结果...</p>
      </div>
    );
  }

  if (showTotal || showCalc) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-[#C43A31]/10 flex items-center justify-center mx-auto mb-4">
          <i className="ri-alert-line text-3xl text-[#C43A31]"></i>
        </div>
        <p className="text-text-secondary text-lg">暂无测算数据</p>
        <button onClick={() => navigate('/bids', { replace: true })} className="btn-primary mt-6">
          前往录入报价
        </button>
      </div>
    );
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
