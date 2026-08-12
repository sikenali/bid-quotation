import React from 'react';
import { CalcResult } from '../types';
import { useConfigStore } from '../stores/configStore';

interface Props {
  result: CalcResult;
  includeTotalScores?: boolean;
}

const cards = [
  { label: '基准价', key: 'basePrice' as const, color: 'text-[#C43A31]', icon: 'ri-target-line', bg: 'bg-[#FFF0ED]', iconFill: 'text-[#C43A31]' },
  { label: 'A 值', key: 'aValue' as const, color: 'text-[#5B8C5A]', icon: 'ri-ruler-2-line', bg: 'bg-[#E8F0E7]', iconFill: 'text-[#5B8C5A]' },
  { label: '投标家数', key: 'totalCount' as const, color: 'text-[#C8A45C]', icon: 'ri-user-star-line', bg: 'bg-[#FFF8E1]', iconFill: 'text-[#C8A45C]' },
  { label: '算法', key: 'algorithmName' as const, color: 'text-[#6B8CAE]', icon: 'ri-bar-chart-grouped-line', bg: 'bg-[#E8F0F5]', iconFill: 'text-[#6B8CAE]' },
];

export default function SummaryCards({ result, includeTotalScores = false }: Props) {
  const { theme, bidUnits, unitScores } = useConfigStore();
  const isDark = theme === 'dark';

  const totalPriceScore = includeTotalScores
    ? unitScores.reduce((sum, us) => sum + us.priceScore + us.businessScore + us.technicalScore, 0)
    : 0;

  const extraCards = includeTotalScores ? [
    { label: '价格总分', key: 'totalPrice' as const, color: 'text-[#C43A31]', icon: 'ri-trophy-line', bg: 'bg-[#FFF0ED]', iconFill: 'text-[#C43A31]' },
  ] : [];

  const allCards = [...cards, ...extraCards];

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${allCards.length}, minmax(0, 1fr))` }}>
      {allCards.map((card) => (
        <div key={card.key} className={`rounded-xl p-5 flex items-center gap-4 border ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-[#F5EFE0] border-[#E8DCC8]'}`}>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${card.bg}`}>
            <i className={`text-2xl ${card.iconFill} ${card.icon}`}></i>
          </div>
          <div>
            <div className={`text-[12px] ${isDark ? 'text-[#A89880]' : 'text-[#8B7355]'}`}>{card.label}</div>
            <div className={`font-bold text-[22px] ${card.color}`}>
              {card.key === 'algorithmName' ? result[card.key]
                : card.key === 'totalCount' ? bidUnits.length
                : card.key === 'totalPrice' ? totalPriceScore.toFixed(2)
                : result[card.key]?.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
