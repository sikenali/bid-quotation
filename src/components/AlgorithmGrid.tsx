import React from 'react';
import { AlgorithmOption } from '../types';
import { AlgorithmCard } from './AlgorithmCard';
import { useConfigStore } from '../stores/configStore';

interface Props {
  options: AlgorithmOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function AlgorithmGrid({ options, selectedId, onSelect }: Props) {
  const { theme } = useConfigStore();
  const isDark = theme === 'dark';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {options.map((option) => (
        <AlgorithmCard
          key={option.id}
          option={option}
          isSelected={option.id === selectedId}
          onSelect={() => onSelect(option.id)}
          isDark={isDark}
        />
      ))}
    </div>
  );
}
