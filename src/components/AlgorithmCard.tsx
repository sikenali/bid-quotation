import React from 'react';
import { AlgorithmOption } from '../types';

interface Props {
  option: AlgorithmOption;
  isSelected: boolean;
  onSelect: () => void;
  isDark?: boolean;
}

export function AlgorithmCard({ option, isSelected, onSelect, isDark = false }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${
        isSelected
          ? 'border-[#C43A31] bg-white shadow-sm'
          : isDark
            ? 'border-[#3D3D3D] bg-[#2D2D2D] hover:border-[#C43A31]/40'
            : 'border-[#E8DCC8] bg-[#FBF7EF] hover:border-[#C43A31]/40'
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-[#C43A31] rounded-full flex items-center justify-center">
          <i className="ri-check-line text-white text-sm"></i>
        </div>
      )}
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isSelected ? 'bg-[#FFF0ED]' : isDark ? 'bg-[#3D3D3D]' : 'bg-[#F0E8D5]'
        }`}>
          <i className={`${option.icon} text-[20px] ${isSelected ? 'text-[#C43A31]' : isDark ? 'text-[#C0B098]' : 'text-[#5C4033]'}`}></i>
        </div>
        <div className="flex flex-col">
          <div className={`font-semibold text-[15px] ${isSelected ? 'text-[#C43A31]' : isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>
            {option.name}
          </div>
          <div className={`text-[11px] leading-tight mt-0.5 ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>
            {option.shortDesc || option.description}
          </div>
        </div>
      </div>
    </button>
  );
}
