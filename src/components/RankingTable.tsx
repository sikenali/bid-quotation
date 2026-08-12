import React from 'react';
import { CalcResult } from '../types';
import { useConfigStore } from '../stores/configStore';

interface Props {
  result: CalcResult;
  includeTotalScores?: boolean;
}

function getRankBadgeClass(rank: number): string {
  switch (rank) {
    case 1: return 'bg-[#FFE8D6] text-[#D97706] border-[#FCD9A8]';
    case 2: return 'bg-[#DBEAFE] text-[#2563EB] border-[#BFDBFE]';
    case 3: return 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]';
    default: return 'bg-white text-gray-600 border-gray-200';
  }
}

function getRankMedalClass(rank: number): string {
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

export default function RankingTable({ result, includeTotalScores = false }: Props) {
  const { theme, unitScores } = useConfigStore();
  const isDark = theme === 'dark';
  const fullScore = 60;

  const getUnitScore = (unitId: string) => unitScores.find(us => us.unitId === unitId);

  return (
    <div className={`rounded-2xl overflow-hidden border ${isDark ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-[#F5EFE0] border-[#E8DCC8]'}`}>
      <div className="p-6 pt-5">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-4.5 rounded-[3px] flex-shrink-0 ${isDark ? 'bg-[#C0B098]' : 'bg-[#D4C4A8]'}`} />
          <h3 className={`font-semibold text-[15px] ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>排名结果</h3>
        </div>
      </div>

      <div className="overflow-x-auto mobile-scroll-table">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-t border-b ${isDark ? 'border-[#3D3D3D] bg-[#252525]' : 'border-[#E8DCC8] bg-white'}`}>
              <th className={`px-6 py-3 text-left font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>排名</th>
              <th className={`px-6 py-3 text-left font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>单位名称</th>
              <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>报价</th>
              <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>偏差率</th>
              <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>得分</th>
              {includeTotalScores && (
                <>
                  <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>商务分</th>
                  <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>技术分</th>
                  <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>总分</th>
                </>
              )}
              <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>与基准价差</th>
            </tr>
          </thead>
          <tbody>
            {result.rankings.map((item) => {
              const us = includeTotalScores ? getUnitScore(item.unit.id) : null;
              const totalScore = us ? us.priceScore + us.businessScore + us.technicalScore : item.score;
              return (
                <tr key={item.unit.id} className={`border-b transition-colors ${isDark ? 'border-[#3D3D3D]/50 hover:bg-[#252525]/50' : 'border-[#E8DCC8]/50 hover:bg-white/60'} ${getRankRowBg(item.rank)}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full border text-sm font-semibold ${getRankBadgeClass(item.rank)}`}>
                        {item.rank}
                      </span>
                      <span className={`text-lg font-bold leading-none ${getRankMedalClass(item.rank)}`} style={{ fontSize: '16px', lineHeight: 1 }}>
                        {item.rank === 1 ? '🏆' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : ''}
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 font-medium flex items-center gap-2 ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>
                    {item.unit.name || '未命名'}
                     {item.rank === 1 && (
                       <div className="ml-3 flex flex-col items-center">
                         <div className="w-10 h-10 relative" style={{ transform: 'rotate(-12deg)' }}>
                           <svg viewBox="0 0 48 48" className="w-full h-full">
                             <circle cx="24" cy="24" r="24" fill="#C43A31" opacity="0.85"/>
                             <circle cx="24" cy="24" r="16" fill="white"/>
                             <circle cx="24" cy="24" r="9" fill="#C43A31"/>
                             <circle cx="24" cy="24" r="3.5" fill="white"/>
                             <circle cx="24" cy="24" r="1.5" fill="#C43A31"/>
                             <line x1="24" y1="1" x2="24" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                             <line x1="24" y1="42" x2="24" y2="47" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                             <line x1="1" y1="24" x2="6" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                             <line x1="42" y1="24" x2="47" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                           </svg>
                         </div>
                         <span className="mt-1 text-[10px] font-bold text-[#C43A31] opacity-80 whitespace-nowrap">中回旋标</span>
                       </div>
                     )}
                  </td>
                  <td className={`px-6 py-4 text-right font-mono ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>{item.unit.price.toLocaleString()}</td>
                  <td className={`px-6 py-4 text-right font-mono ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>{item.deviationPercent > 0 ? '+' : ''}{item.deviationPercent}%</td>
                  <td className={`px-6 py-4 text-right font-semibold ${getScoreColor(item.score, fullScore)}`}>
                    {includeTotalScores && us ? us.priceScore.toFixed(2) : item.score}
                  </td>
                  {includeTotalScores && us && (
                    <>
                      <td className={`px-6 py-4 text-right font-mono ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>{us.businessScore.toFixed(2)}</td>
                      <td className={`px-6 py-4 text-right font-mono ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>{us.technicalScore.toFixed(2)}</td>
                      <td className={`px-6 py-4 text-right font-bold text-[#C43A31]`}>{totalScore.toFixed(2)}</td>
                    </>
                  )}
                  <td className={`px-6 py-4 text-right font-mono ${item.priceDiff > 0 ? 'text-[#C43A31]' : item.priceDiff < 0 ? 'text-[#5B8C5A]' : isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>
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
