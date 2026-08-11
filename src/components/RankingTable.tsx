import React from 'react';
import { CalcResult } from '../types';

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
  const fullScore = 60;

  return (
    <div className="bg-[#F5EFE0] border border-[#E8DCC8] rounded-2xl overflow-hidden">
      <div className="p-6 pt-5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4.5 bg-[#D4C4A8] rounded-[3px] flex-shrink-0" />
          <h3 className="font-semibold text-text text-[15px]">排名结果</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-b border-[#E8DCC8] bg-white">
              <th className="px-6 py-3 text-left text-text-secondary font-medium">排名</th>
              <th className="px-6 py-3 text-left text-text-secondary font-medium">单位名称</th>
              <th className="px-6 py-3 text-right text-text-secondary font-medium">报价</th>
              <th className="px-6 py-3 text-right text-text-secondary font-medium">偏差率</th>
              <th className="px-6 py-3 text-right text-text-secondary font-medium">得分</th>
              <th className="px-6 py-3 text-right text-text-secondary font-medium">与基准价差</th>
            </tr>
          </thead>
          <tbody>
            {result.rankings.map((item) => (
              <tr key={item.unit.id} className={`border-b border-[#E8DCC8]/50 hover:bg-white/60 transition-colors ${getRankRowBg(item.rank)}`}>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full border text-sm font-semibold ${getRankBadgeClass(item.rank)}`}>
                    {item.rank}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-text">{item.unit.name || '未命名'}</td>
                <td className="px-6 py-4 text-right font-mono">{item.unit.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-right font-mono">{item.deviationPercent > 0 ? '+' : ''}{item.deviationPercent}%</td>
                <td className={`px-6 py-4 text-right font-semibold ${getScoreColor(item.score, fullScore)}`}>
                  {item.score}
                </td>
                <td className={`px-6 py-4 text-right font-mono ${item.priceDiff > 0 ? 'text-[#C43A31]' : item.priceDiff < 0 ? 'text-[#5B8C5A]' : 'text-text-secondary'}`}>
                  {item.priceDiff > 0 ? '+' : ''}{item.priceDiff.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
