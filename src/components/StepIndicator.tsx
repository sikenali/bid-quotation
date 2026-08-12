import React from 'react';
import { useConfigStore } from '../stores/configStore';

interface Props {
  currentStep: number;
  totalSteps?: number;
}

const steps = ['报价方法', '判定规则', '扣分规则', '投标报价'];

export function StepIndicator({ currentStep, totalSteps = 4 }: Props) {
  const { theme } = useConfigStore();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2 md:gap-3 whitespace-nowrap">
      {steps.slice(0, totalSteps).map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;

        return (
          <div key={stepNum} className="group relative">
            <div
              className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-[#C43A31]'
                  : isDone
                  ? 'bg-[#5B8C5A]'
                  : isDark
                    ? 'bg-[#3D3D3D]'
                    : 'bg-[#F0E8D5]'
              }`}
            >
              {isDone ? (
                <i className="ri-check-line text-white text-xs md:text-sm"></i>
              ) : (
                <span className={`text-xs md:text-sm font-medium ${
                  isActive ? 'text-white' : isDark ? 'text-[#C0B098]' : 'text-text-secondary'
                }`}>
                  {stepNum}
                </span>
              )}
            </div>
            <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap ${
              isActive
                ? 'text-[#C43A31] font-medium'
                : isDark ? 'text-[#C0B098]' : 'text-text-secondary'
            }`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
