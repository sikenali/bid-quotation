import React from 'react';
import { CalcResult } from '../types';
import { useConfigStore } from '../stores/configStore';

interface Props {
  result: CalcResult;
}

function getRankBadgeClass(rank: number): string {
  switch (rank) {
    case 1: return 'bg-[#FFE8D6] text-[#D97706] border-[#FCD9A8]';
    case 2: return 'bg-[#DBEAFE] text-[#2563EB] border-[#BFDBFE]';
    case 3: return 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]';
    default: return 'bg-white text-gray-600 border-gray-200';
  }
}

function getRankMedalIcon(rank: number): string {
  switch (rank) {
    case 1: return 'ri-trophy-line';
    case 2: return 'ri-medal-line';
    case 3: return 'ri-medal-2-line';
    default: return '';
  }
}

function getRankMedalColor(rank: number): string {
  switch (rank) {
    case 1: return 'text-[#D97706]';
    case 2: return 'text-[#2563EB]';
    case 3: return 'text-[#059669]';
    default: return 'text-gray-400';
  }
}

function getRankRowBg(rank: number): string {
  switch (rank) {
    case 1: return 'bg-[#FFF8F5]';
    case 2: return 'bg-[#F8FAFE]';
    case 3: return 'bg-[#F8FDF8]';
    default: return 'bg-white';
  }
}

function getScoreColor(score: number, fullScore: number): string {
  const ratio = score / fullScore;
  if (ratio >= 0.95) return 'text-[#059669]';
  if (ratio >= 0.85) return 'text-[#D97706]';
  return 'text-[#C43A31]';
}

export default function RankingTable({ result }: Props) {
  const { theme } = useConfigStore();
  const isDark = theme === 'dark';
  const fullScore = 60;

  return (
    <div className={`rounded-2xl overflow-hidden border ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-[#F5EFE0] border-[#E8DCC8]'}`}>
      <div className="p-6 pt-5">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-4.5 rounded-[3px] flex-shrink-0 ${isDark ? 'bg-[#A89880]' : 'bg-[#D4C4A8]'}`} />
          <h3 className={`font-semibold text-[15px] ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>排名结果</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-t border-b ${isDark ? 'border-[#3A3A3A] bg-[#1A1A1A]' : 'border-[#E8DCC8] bg-white'}`}>
              <th className={`px-6 py-3 text-left font-medium ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>排名</th>
              <th className={`px-6 py-3 text-left font-medium ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>单位名称</th>
              <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>报价</th>
              <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>偏差率</th>
              <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>得分</th>
              <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>与基准价差</th>
            </tr>
          </thead>
          <tbody>
            {result.rankings.map((item) => {
              const medalIcon = getRankMedalIcon(item.rank);
              const medalColor = getRankMedalColor(item.rank);
              return (
                <tr key={item.unit.id} className={`border-b transition-colors ${isDark ? 'border-[#3A3A3A]/50 hover:bg-[#1A1A1A]/50' : 'border-[#E8DCC8]/50 hover:bg-white/60'} ${getRankRowBg(item.rank)}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full border text-sm font-semibold ${getRankBadgeClass(item.rank)}`}>
                        {item.rank}
                      </span>
                      {medalIcon && <i className={`text-lg ${medalColor}`}>{medalIcon}</i>}
                    </div>
                  </td>
                  <td className={`px-6 py-4 font-medium flex items-center gap-2 ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>
                    {item.unit.name || '未命名'}
                    {item.rank === 1 && (
                      <span className="ml-3 relative inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-[#C43A31] text-[#C43A31] text-[10px] font-bold leading-none text-center select-none opacity-80 shadow-sm" style={{ transform: 'rotate(-12deg)' }}>
                        <i className="ri-target-line text-base absolute top-1 left-1/2 -translate-x-1/2"></i>
                        <span className="pt-4">中<br/>回<br/>旋<br/>标</span>
                      </span>
                    )}
                  </td>
                  <td className={`px-6 py-4 text-right font-mono ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>{item.unit.price.toLocaleString()}</td>
                  <td className={`px-6 py-4 text-right font-mono ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>{item.deviationPercent > 0 ? '+' : ''}{item.deviationPercent}%</td>
                  <td className={`px-6 py-4 text-right font-semibold ${getScoreColor(item.score, fullScore)}`}>
                    {item.score}
                  </td>
                  <td className={`px-6 py-4 text-right font-mono ${item.priceDiff > 0 ? 'text-[#C43A31]' : item.priceDiff < 0 ? 'text-[#5B8C5A]' : isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>
                    {item.priceDiff > 0 ? '+' : ''}{item.priceDiff.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
