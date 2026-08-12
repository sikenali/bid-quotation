import React, { useState, useEffect } from 'react';
import { useConfigStore } from '../stores/configStore';
import { UnitScore } from '../types';

interface ScoreInputProps {
  onClose: () => void;
}

export default function ScoreInput({ onClose }: ScoreInputProps) {
  const {
    bidUnits, unitScores,
    setUnitScores, theme, calculate,
  } = useConfigStore();
  const isDark = theme === 'dark';

  // Local editable scores state
  const [editableScores, setEditableScores] = useState<Record<string, { businessScore: number; technicalScore: number }>>({});

  useEffect(() => {
    // Initialize from store unitScores
    const initial: Record<string, { businessScore: number; technicalScore: number }> = {};
    (unitScores as any[]).forEach((us) => {
      initial[us.unitId] = {
        businessScore: us.businessScore ?? 0,
        technicalScore: us.technicalScore ?? 0,
      };
    });
    // Also fill for all units that don't have scores yet
    bidUnits.forEach((unit) => {
      if (!(unit.id in initial)) {
        initial[unit.id] = { businessScore: 0, technicalScore: 0 };
      }
    });
    setEditableScores(initial);
  }, [bidUnits, unitScores]);

  const handleBusinessChange = (unitId: string, value: string) => {
    const num = parseFloat(value) || 0;
    setEditableScores(prev => ({ ...prev, [unitId]: { ...prev[unitId], businessScore: num } }));
  };

  const handleTechnicalChange = (unitId: string, value: string) => {
    const num = parseFloat(value) || 0;
    setEditableScores(prev => ({ ...prev, [unitId]: { ...prev[unitId], technicalScore: num } }));
  };

  const handleSave = () => {
    // Re-calculate price scores first
    calculate();
    const freshState = useConfigStore.getState();
    const freshResult = freshState.calculationResult;
    if (!freshResult) return;

    const scores: UnitScore[] = bidUnits.map((unit) => {
      const ranking = freshResult.rankings.find(r => r.unit.id === unit.id);
      const priceScore = ranking ? ranking.score : 0;
      const local = editableScores[unit.id] || { businessScore: 0, technicalScore: 0 };
      return {
        id: crypto.randomUUID(),
        unitId: unit.id,
        priceScore,
        businessScore: local.businessScore,
        technicalScore: local.technicalScore,
      };
    });
    setUnitScores(scores);
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className={`relative ml-auto w-full max-w-3xl flex flex-col ${isDark ? 'bg-[#2D2D2D]' : 'bg-[#FBF7EF]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-8 py-5 border-b ${isDark ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-[#FBF7EF] border-[#E8DCC8]'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C43A31] flex items-center justify-center">
              <i className="ri-file-list-3-line text-white text-xl"></i>
            </div>
            <div>
              <span className={`font-semibold text-lg ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>测算得分</span>
              <p className={`text-xs ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>录入商务评分与技术评分，价格得分自动计算</p>
            </div>
          </div>
          <button onClick={onClose} className={`hover:text-[#C43A31] transition-colors ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Table */}
        <div className={`flex-1 overflow-y-auto p-6 ${isDark ? 'bg-[#252525]' : 'bg-[#EAE5D9]'}`}>
          <div className={`rounded-2xl overflow-hidden border ${isDark ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-[#F5EFE0] border-[#E8DCC8]'}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${isDark ? 'border-[#3D3D3D] bg-[#252525]' : 'border-[#E8DCC8] bg-white'}`}>
                  <th className={`px-6 py-3 text-left font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>序号</th>
                  <th className={`px-6 py-3 text-left font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>单位名称</th>
                  <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>报价 (元)</th>
                  <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>价格得分</th>
                  <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>商务得分</th>
                  <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>技术得分</th>
                  <th className={`px-6 py-3 text-right font-medium ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>合计</th>
                </tr>
              </thead>
              <tbody>
                {bidUnits.map((unit, index) => {
                  const unitScore = (unitScores as any[]).find((us: any) => us.unitId === unit.id);
                  const priceScore = unitScore ? unitScore.priceScore : 0;
                  const local = editableScores[unit.id] || { businessScore: 0, technicalScore: 0 };
                  const total = priceScore + local.businessScore + local.technicalScore;
                  return (
                    <tr key={unit.id} className={`border-b transition-colors ${isDark ? 'border-[#3D3D3D]/50 hover:bg-[#252525]/50' : 'border-[#E8DCC8]/50 hover:bg-white/60'}`}>
                      <td className={`px-6 py-4 text-center ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${index < 3 ? 'bg-[#C43A31]/10 text-[#C43A31]' : isDark ? 'bg-[#3D3D3D] text-[#C0B098]' : 'bg-[#F5EFE0] text-text-secondary'}`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className={`px-6 py-4 font-medium ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>{unit.name}</td>
                      <td className={`px-6 py-4 text-right font-mono ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>
                        {unit.price > 0 ? unit.price.toLocaleString() : '-'}
                      </td>
                      <td className={`px-6 py-4 text-right font-mono font-semibold ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>
                        {priceScore > 0 ? priceScore.toFixed(2) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={local.businessScore}
                          onChange={(e) => handleBusinessChange(unit.id, e.target.value)}
                          className={`input-field w-20 text-right text-sm ${isDark ? 'bg-[#252525] border-[#3D3D3D] text-[#F2EDE4]' : ''}`}
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={local.technicalScore}
                          onChange={(e) => handleTechnicalChange(unit.id, e.target.value)}
                          className={`input-field w-20 text-right text-sm ${isDark ? 'bg-[#252525] border-[#3D3D3D] text-[#F2EDE4]' : ''}`}
                        />
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${total > 0 ? (isDark ? 'text-[#C43A31]' : 'text-[#C43A31]') : (isDark ? 'text-[#C0B098]' : 'text-text-secondary')}`}>
                        {total > 0 ? total.toFixed(2) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Total row */}
              <tfoot>
                <tr className={`border-t font-semibold ${isDark ? 'border-[#3D3D3D] bg-[#252525]' : 'border-[#E8DCC8] bg-white'}`}>
                  <td className="px-6 py-3" colSpan={3}></td>
                  <td className={`px-6 py-3 text-right ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>-</td>
                  <td className={`px-6 py-3 text-right ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>{Object.values(editableScores).reduce((s, v) => s + v.businessScore, 0).toFixed(2)}</td>
                  <td className={`px-6 py-3 text-right ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>{Object.values(editableScores).reduce((s, v) => s + v.technicalScore, 0).toFixed(2)}</td>
                  <td className={`px-6 py-3 text-right ${isDark ? 'text-[#C43A31]' : 'text-[#C43A31]'}`}>
                    {(() => {
                      let t = 0;
                      bidUnits.forEach((unit) => {
                        const us = (unitScores as any[]).find((u: any) => u.unitId === unit.id);
                        const es = editableScores[unit.id] || { businessScore: 0, technicalScore: 0 };
                        if (us) t += us.priceScore + es.businessScore + es.technicalScore;
                      });
                      return t > 0 ? t.toFixed(2) : '-';
                    })()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer buttons */}
        <div className={`px-8 py-5 border-t flex items-center justify-end gap-3 ${isDark ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-[#FDF5E6]'}`}>
          <button onClick={onClose} className={`px-6 py-2.5 rounded-xl text-sm transition-colors ${isDark ? 'bg-[#3D3D3D] text-[#C0B098] hover:text-[#F2EDE4]' : 'bg-[#F5EFE0] border border-[#E0D5C0] text-text-secondary hover:text-text'}`}>
            取消
          </button>
          <button onClick={handleSave} className="btn-primary">
            <i className="ri-save-line"></i>
            <span>保存得分</span>
          </button>
        </div>
      </div>
    </div>
  );
}
