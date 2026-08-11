import React from 'react';
import { CalcResult } from '../types';

interface Props {
  result: CalcResult;
}

function getRankBadgeClass(rank: number): string {
  switch (rank) {
    case 1: return 'bg-orange-100 text-orange-700 border-orange-300';
    case 2: return 'bg-blue-100 text-blue-700 border-blue-300';
    case 3: return 'bg-green-100 text-green-700 border-green-300';
    default: return 'bg-gray-100 text-gray-600 border-gray-300';
  }
}

function getScoreColor(score: number, fullScore: number): string {
  const ratio = score / fullScore;
  if (ratio >= 0.95) return 'text-green-600';
  if (ratio >= 0.85) return 'text-orange-500';
  return 'text-red-500';
}

export default function RankingTable({ result }: Props) {
  const fullScore = 60;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-border rounded-full" />
          <h3 className="font-semibold text-text">排名结果</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-b border-border bg-white/50">
              <th className="px-6 py-3 text-left text-textSecondary font-medium">排名</th>
              <th className="px-6 py-3 text-left text-textSecondary font-medium">单位名称</th>
              <th className="px-6 py-3 text-right text-textSecondary font-medium">报价</th>
              <th className="px-6 py-3 text-right text-textSecondary font-medium">偏差率</th>
              <th className="px-6 py-3 text-right text-textSecondary font-medium">得分</th>
              <th className="px-6 py-3 text-right text-textSecondary font-medium">与基准价差</th>
            </tr>
          </thead>
          <tbody>
            {result.rankings.map((item) => (
              <tr key={item.unit.id} className="border-b border-border/50 hover:bg-white/30 transition-colors">
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
                <td className={`px-6 py-4 text-right font-mono ${item.priceDiff > 0 ? 'text-red-500' : item.priceDiff < 0 ? 'text-green-600' : 'text-textSecondary'}`}>
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
