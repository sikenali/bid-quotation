import React from 'react';
import { CalcResult } from '../types';

interface Props {
  result: CalcResult;
}

const cards = [
  { label: '基准价', key: 'basePrice' as const, color: 'text-primary', icon: '📍' },
  { label: 'A 值', key: 'aValue' as const, color: 'text-success', icon: '📐' },
  { label: '有效家数', key: 'effectiveCount' as const, color: 'text-yellow-600', icon: '👥' },
  { label: '算法', key: 'algorithmName' as const, color: 'text-blue-600', icon: '📊' },
];

export default function SummaryCards({ result }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.key} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-2xl">
            {card.icon}
          </div>
          <div>
            <div className="text-textSecondary text-sm">{card.label}</div>
            <div className={`font-bold text-lg ${card.color}`}>
              {card.key === 'algorithmName' ? result[card.key] : result[card.key]?.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
