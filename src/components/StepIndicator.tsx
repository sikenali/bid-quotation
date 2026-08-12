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
    <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
      {steps.slice(0, totalSteps).map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;

        return (
          <React.Fragment key={stepNum}>
            <div className="group relative">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
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
                  <i className="ri-check-line text-white text-[14px] sm:text-[16px]"></i>
                ) : (
                  <span className={`text-[11px] sm:text-sm font-medium ${
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
            {index < totalSteps - 1 && (
              <div
                className={`w-3 h-0.5 sm:w-4 rounded-full mt-2.5 sm:mt-3 md:w-6 ${
                  stepNum < currentStep ? 'bg-[#5B8C5A]' : isDark ? 'bg-[#3D3D3D]' : 'bg-[#D4C4A8]'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
