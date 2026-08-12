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
    <div className="flex items-center gap-2">
      {steps.slice(0, totalSteps).map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;

        return (
          <React.Fragment key={stepNum}>
            <div className="group relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-[#C43A31]'
                    : isDone
                    ? 'bg-[#5B8C5A]'
                    : isDark
                      ? 'bg-[#3A3A3A]'
                      : 'bg-[#F0E8D5]'
                }`}
              >
                {isDone ? (
                  <i className="ri-check-line text-white text-[16px]"></i>
                ) : (
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-white' : isDark ? 'text-[#A89880]' : 'text-text-secondary'
                  }`}>
                    {stepNum}
                  </span>
                )}
              </div>
              <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap ${
                isActive
                  ? 'text-[#C43A31] font-medium'
                  : isDark ? 'text-[#A89880]' : 'text-text-secondary'
              }`}>
                {label}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-6 h-0.5 rounded-full mt-3 ${
                  stepNum < currentStep ? 'bg-[#5B8C5A]' : isDark ? 'bg-[#3A3A3A]' : 'bg-[#D4C4A8]'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
