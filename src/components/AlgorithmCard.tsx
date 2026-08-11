import React from 'react';
import { AlgorithmOption } from '../types';

interface Props {
  option: AlgorithmOption;
  isSelected: boolean;
  onSelect: () => void;
}

export function AlgorithmCard({ option, isSelected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border bg-card hover:border-primary/40'
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
          <i className="ri-check-line text-white text-sm"></i>
        </div>
      )}
      <div className="w-10 h-10 rounded-lg bg-border-light flex items-center justify-center mb-3">
        <i className={`${option.icon} text-xl text-text`}></i>
      </div>
      <div className="font-semibold text-text text-sm mb-1">{option.name}</div>
      <div className="text-text-secondary text-xs leading-relaxed">{option.description}</div>
    </button>
  );
}
