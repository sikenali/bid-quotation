import type { Algorithm } from '../types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import { ALGORITHM_OPTIONS } from './step1Data';
import { AlgorithmGrid } from '../components/AlgorithmGrid';
import { AlgorithmParams } from '../components/AlgorithmParams';

export default function Step1Algorithm() {
  const navigate = useNavigate();
  const { algorithm, setAlgorithm, setCurrentStep } = useConfigStore();

  const handleNext = () => {
    setCurrentStep(2);
    navigate('/rules');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-[28px] font-semibold text-text">报价方法</h2>
        <p className="text-text-secondary text-[14px]">
          选择基准价计算方法，配置对应参数
        </p>
      </div>

      <AlgorithmGrid
        options={ALGORITHM_OPTIONS}
        selectedId={algorithm}
        onSelect={(id) => setAlgorithm(id as Algorithm)}
      />

      <AlgorithmParams />

      <div className="flex justify-end pt-4">
        <button
          onClick={handleNext}
          className="btn-primary"
        >
          下一步
        </button>
      </div>
      <p className="text-center text-xs text-text-secondary pt-6">© {new Date().getFullYear()} 文价猩 Powered by <a href="https://lazycat.cloud/" target="_blank" className="text-primary hover:underline">LightOS</a></p>
    </div>
  );
}
