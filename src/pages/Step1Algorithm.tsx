import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import { ALGORITHM_OPTIONS } from './step1Data';
import { AlgorithmGrid } from '../components/AlgorithmGrid';
import { AlgorithmParams } from '../components/AlgorithmParams';
import { TemplateSelector } from '../components/TemplateSelector';

export default function Step1Algorithm() {
  const navigate = useNavigate();
  const { config, setAlgorithm, setCurrentStep } = useConfigStore();

  const handleNext = () => {
    setCurrentStep(2);
    navigate('/step-2');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text">选择报价计算方法</h2>
        <p className="text-text-secondary text-sm mt-1">
          根据招标文件中的评分规则，选择适配的基准价计算方法
        </p>
      </div>

      <TemplateSelector />

      <AlgorithmGrid
        options={ALGORITHM_OPTIONS}
        selectedId={config.algorithm}
        onSelect={(id) => setAlgorithm(id as typeof config.algorithm)}
      />

      <AlgorithmParams />

      <div className="flex justify-end pt-2">
        <button
          onClick={handleNext}
          className="btn-primary"
        >
          下一步：判定规则
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
