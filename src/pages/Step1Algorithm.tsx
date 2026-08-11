import type { Algorithm } from '../types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import { ALGORITHM_OPTIONS } from './step1Data';
import { AlgorithmGrid } from '../components/AlgorithmGrid';
import { AlgorithmParams } from '../components/AlgorithmParams';
import { TemplateSelector } from '../components/TemplateSelector';

export default function Step1Algorithm() {
  const navigate = useNavigate();
  const { algorithm, setAlgorithm, setCurrentStep } = useConfigStore();

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
        selectedId={algorithm}
        onSelect={(id) => setAlgorithm(id as Algorithm)}
      />

      <AlgorithmParams />

      <div className="flex justify-end pt-2">
        <button
          onClick={handleNext}
          className="btn-primary"
        >
          下一步：判定规则
          <i className="ri-arrow-right-s-line text-lg"></i>
        </button>
      </div>
    </div>
  );
}
