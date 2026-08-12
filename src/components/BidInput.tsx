import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { BidUnit, UnitScore } from '../types';

export default function BidInput() {
  const { bidUnits, addBidUnit, updateBidUnit, removeBidUnit, clearBidUnits, randomFill, theme, calculate, unitScores, setUnitScores } = useConfigStore();
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [randomCount, setRandomCount] = useState(5);
  const [randomCenter, setRandomCenter] = useState(100);
  const [randomFluctuation, setRandomFluctuation] = useState(10);
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [priceScores, setPriceScores] = useState<Record<string, number>>({});
  const isDark = theme === 'dark';

  // 打开弹窗时重新计算价格得分
  const openScoreModal = () => {
    calculate();
    const state = useConfigStore.getState();
    const result = state.calculationResult;
    if (result) {
      const map: Record<string, number> = {};
      result.rankings.forEach(r => { map[r.unit.id] = r.score; });
      setPriceScores(map);
    }
    setShowScoreModal(true);
  };

  const DEFAULT_NAMES = [
    '武汉锂钠氪锶科技有限公司',
    '武汉懒猫微服科技有限公司',
    '武汉铀锂氪锶科技合伙企业（有限合伙）',
    '广西锂钠氪锶软件科技有限公司',
  ];

  const handleAdd = () => {
    const units = useConfigStore.getState().bidUnits;
    const count = units.length;
    let name = '';
    if (count < DEFAULT_NAMES.length) {
      name = DEFAULT_NAMES[count];
    } else {
      name = `武汉锶氪钠锂科技有限公司${count - DEFAULT_NAMES.length + 1}`;
    }
    addBidUnit(name, 0);
    setActiveUnitId(useConfigStore.getState().bidUnits[useConfigStore.getState().bidUnits.length - 1]?.id || null);
  };

  const handleChange = (id: string, field: keyof BidUnit, value: string | number | boolean) => {
    updateBidUnit(id, { [field]: value });
  };

  const handleSaveScores = () => {
    calculate();
    const state = useConfigStore.getState();
    const result = state.calculationResult;
    if (!result) return;

    const scores: UnitScore[] = bidUnits.map((unit) => {
      const priceScore = priceScores[unit.id] ?? 0;
      return {
        id: crypto.randomUUID(),
        unitId: unit.id,
        priceScore,
        businessScore: unit.businessScore ?? 0,
        technicalScore: unit.technicalScore ?? 0,
      };
    });
    setUnitScores(scores);
    setShowScoreModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 投标单位标签横排 */}
      <div className="flex flex-wrap gap-3">
        {bidUnits.map((unit) => (
          <button
            key={unit.id}
            onClick={() => setActiveUnitId(unit.id === activeUnitId ? null : unit.id)}
            className={`flex flex-col items-center justify-center px-4 py-3 sm:px-5 sm:py-3 rounded-xl min-w-[120px] sm:min-w-[140px] transition-all border-2 flex-1 sm:flex-none ${
              unit.id === activeUnitId
                ? 'bg-[#C43A31] text-white border-[#C43A31] shadow-sm'
                : isDark
                  ? 'bg-[#2D2D2D] border-[#3D3D3D] text-[#F2EDE4] hover:border-[#C43A31]/50'
                  : 'bg-[#F5EFE0] border-[#E0D5C0] text-text hover:border-[#C43A31]/40'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                unit.id === activeUnitId ? 'border-white bg-white' : isDark ? 'border-[#A89880] bg-transparent' : 'border-[#8B7355] bg-transparent'
              }`} />
              <span className={`text-[14px] font-medium truncate max-w-[100px] sm:max-w-none ${unit.id === activeUnitId ? 'text-white' : isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>
                {unit.name || '未命名'}
              </span>
            </div>
            <span className={`text-[11px] ${unit.id === activeUnitId ? 'text-white/70' : isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>
              ¥ {unit.price.toLocaleString()}
            </span>
          </button>
        ))}
        <button
          onClick={handleAdd}
          className={`w-[90px] sm:w-[120px] h-[50px] sm:h-[60px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 cursor-pointer transition-colors ${
            isDark
              ? 'border-[#3D3D3D] text-[#C0B098] hover:border-[#C43A31] hover:text-[#C43A31] bg-[#252525]'
              : 'bg-[#FBF7EF] border-[#D4C4A8] text-text-secondary hover:border-[#C43A31] hover:text-[#C43A31]'
          }`}
        >
          <i className="ri-add-line text-base sm:text-xl"></i>
          <span className="text-[11px] sm:text-[13px]">添加单位</span>
        </button>
      </div>

      {/* 单位编辑区 */}
      <div className={`rounded-2xl p-6 border ${isDark ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-[#F5EFE0] border-[#E8DCC8]'}`}>
        <div className="flex items-center gap-5 mb-4">
          <div className={`w-1.5 h-4.5 rounded-[3px] flex-shrink-0 ${isDark ? 'bg-[#C0B098]' : 'bg-[#D4C4A8]'}`} />
          <h3 className={`font-semibold text-[15px] ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>
            {bidUnits.length > 0
              ? `${activeUnitId ? (bidUnits.find(u => u.id === activeUnitId)?.name || '单位') : '全部'} · 编辑`
              : '投标单位列表'}
          </h3>
        </div>

        {bidUnits.length === 0 ? (
          <p className={`text-center py-8 ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>暂无投标单位，点击上方的「添加单位」按钮开始录入</p>
        ) : (
          <div className="space-y-3">
            {bidUnits.map((unit) => (
              <div
                key={unit.id}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors flex-col sm:flex-row ${
                  unit.id === activeUnitId
                    ? isDark
                      ? 'bg-[#252525] border-[#C43A31]/40 ring-1 ring-[#C43A31]/20'
                      : 'bg-white border-[#C43A31]/40 ring-1 ring-[#C43A31]/10'
                    : isDark
                      ? 'bg-[#252525] border-[#3D3D3D]'
                      : 'bg-white border-[#E8DCC8]/50'
                }`}
              >
                <input
                  type="text"
                  value={unit.name}
                  onChange={(e) => handleChange(unit.id, 'name', e.target.value)}
                  placeholder="单位名称"
                  className={`input-field w-full sm:flex-1 ${isDark ? 'bg-[#252525] border-[#3D3D3D] text-[#F2EDE4]' : ''}`}
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="number"
                    value={unit.price}
                    onChange={(e) => handleChange(unit.id, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="报价金额"
                    className={`input-field w-full sm:w-[200px] text-center ${isDark ? 'bg-[#252525] border-[#3D3D3D] text-[#F2EDE4]' : ''}`}
                  />
                  <span className={`text-sm font-medium whitespace-nowrap ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>元</span>
                </div>
                <button
                  onClick={() => removeBidUnit(unit.id)}
                  className="px-4 py-3 sm:py-2 bg-[#FFF0ED] border border-[#F5C6C0] rounded-lg text-[#C43A31] text-sm font-medium hover:bg-[#FFE0DC] transition-colors flex items-center gap-1 min-h-[44px] w-full sm:w-auto justify-center"
                  aria-label="删除"
                >
                  <i className="ri-delete-bin-line"></i>
                  <span>删除</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 快捷操作区 */}
      <div className="flex items-center gap-2 sm:gap-3 flex-nowrap">
        <button
          onClick={() => setShowRandomModal(true)}
          className={`px-2.5 py-2 sm:px-5 sm:py-2 rounded-lg text-[11px] sm:text-sm flex items-center gap-1 sm:gap-2 min-h-[36px] sm:min-h-[44px] transition-colors flex-1 sm:flex-none justify-center ${
            isDark
              ? 'bg-[#2D2D2D] border border-[#3D3D3D] text-[#C0B098] hover:text-[#F2EDE4] hover:border-[#C43A31]/50'
              : 'bg-[#F5EFE0] border border-[#E0D5C0] text-text-secondary hover:text-[#C43A31] hover:border-[#C43A31]'
          }`}
        >
          <i className="ri-dice-line"></i>
          随机厂商
        </button>
        <button
          onClick={() => openScoreModal()}
          className={`px-2.5 py-2 sm:px-5 sm:py-2 rounded-lg text-[11px] sm:text-sm flex items-center gap-1 sm:gap-2 min-h-[36px] sm:min-h-[44px] transition-colors flex-1 sm:flex-none justify-center ${
            isDark
              ? 'bg-[#2D2D2D] border border-[#3D3D3D] text-[#C0B098] hover:text-[#F2EDE4] hover:border-[#C43A31]/50'
              : 'bg-[#F5EFE0] border border-[#E0D5C0] text-text-secondary hover:text-[#C43A31] hover:border-[#C43A31]'
          }`}
        >
          <i className="ri-file-search-line"></i>
          总价计算
        </button>
        <button
          onClick={clearBidUnits}
          className="px-2.5 py-2 sm:px-5 sm:py-2 bg-[#FFF0ED] border border-[#F5C6C0] rounded-lg text-[#C43A31] text-[11px] sm:text-sm hover:bg-[#FFE0DC] transition-colors flex items-center gap-1 sm:gap-2 min-h-[36px] sm:min-h-[44px] flex-1 sm:flex-none justify-center"
        >
          <i className="ri-delete-bin-line"></i>
          清空所有
        </button>
      </div>

      {/* 随机厂商弹窗 */}
      {showRandomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRandomModal(false)}>
          <div className={`rounded-xl p-6 w-full max-w-md mx-4 sm:mx-auto mobile-modal sm:rounded-xl sm:max-w-md ${isDark ? 'bg-[#2D2D2D]' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className={`font-semibold text-lg ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>随机厂商</span>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>自动生成投标单位数据</p>
              </div>
              <button onClick={() => setShowRandomModal(false)} className={`hover:text-[#C43A31] transition-colors ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className={`text-sm ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>投标家数</label>
                <input
                  type="number"
                  value={randomCount}
                  onChange={(e) => setRandomCount(parseInt(e.target.value) || 0)}
                  className={`input-field w-full mt-1 ${isDark ? 'bg-[#252525] border-[#3D3D3D] text-[#F2EDE4]' : ''}`}
                />
              </div>
              <div>
                <label className={`text-sm ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>基准价中值</label>
                <input
                  type="number"
                  value={randomCenter}
                  onChange={(e) => setRandomCenter(parseFloat(e.target.value) || 0)}
                  className={`input-field w-full mt-1 ${isDark ? 'bg-[#252525] border-[#3D3D3D] text-[#F2EDE4]' : ''}`}
                />
              </div>
              <div>
                <label className={`text-sm ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>波动 ±%</label>
                <input
                  type="number"
                  value={randomFluctuation}
                  onChange={(e) => setRandomFluctuation(parseFloat(e.target.value) || 0)}
                  className={`input-field w-full mt-1 ${isDark ? 'bg-[#252525] border-[#3D3D3D] text-[#F2EDE4]' : ''}`}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowRandomModal(false)} className={`px-5 py-2 rounded-lg text-sm transition-colors ${isDark ? 'bg-[#3D3D3D] text-[#C0B098] hover:text-[#F2EDE4]' : 'bg-[#F5EFE0] border border-[#E0D5C0] text-text-secondary hover:text-text'}`}>
                取消
              </button>
              <button
                onClick={() => { randomFill(randomCount, randomCenter, randomFluctuation); setShowRandomModal(false); }}
                className="btn-primary py-2"
              >
                <i className="ri-magic-line"></i>
                <span>生成</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 报价解析 / 测算得分弹窗 */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowScoreModal(false)}>
          <div className={`rounded-xl p-6 w-full max-w-[720px] mx-4 sm:mx-auto max-h-[80vh] overflow-y-auto mobile-modal sm:rounded-xl sm:max-w-[720px] ${isDark ? 'bg-[#2D2D2D]' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className={`font-semibold text-lg ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>总价计算</span>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>价格得分自动计算，商务/技术得分可手动调整</p>
              </div>
              <button onClick={() => setShowScoreModal(false)} className={`hover:text-[#C43A31] transition-colors ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className={`rounded-xl overflow-hidden border ${isDark ? 'bg-[#252525] border-[#3D3D3D]' : 'bg-white border-[#E8DCC8]'}`}>
              <table className="w-full text-xs table-fixed">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-[#3D3D3D] bg-[#252525]' : 'border-[#E8DCC8] bg-white'}`}>
                    <th className="w-10 px-3 py-2 text-left font-medium whitespace-nowrap">序号</th>
                    <th className="px-3 py-2 text-left font-medium whitespace-nowrap">单位名称</th>
                    <th className="w-24 px-3 py-2 text-right font-medium whitespace-nowrap">报价(元)</th>
                    <th className="w-16 px-3 py-2 text-right font-medium whitespace-nowrap">价格得分</th>
                    <th className="w-16 px-3 py-2 text-right font-medium whitespace-nowrap">商务得分</th>
                    <th className="w-16 px-3 py-2 text-right font-medium whitespace-nowrap">技术得分</th>
                    <th className="w-16 px-3 py-2 text-right font-medium whitespace-nowrap">合计</th>
                  </tr>
                </thead>
                <tbody>
                  {bidUnits.map((unit, index) => {
                    const existingScore = unitScores.find(us => us.unitId === unit.id);
                    const priceScore = priceScores[unit.id] ?? (existingScore?.priceScore ?? 0);
                    const businessScore = unit.businessScore ?? existingScore?.businessScore ?? 0;
                    const technicalScore = unit.technicalScore ?? existingScore?.technicalScore ?? 0;
                    const total = priceScore + businessScore + technicalScore;
                    return (
                      <tr key={unit.id} className={`border-b transition-colors ${isDark ? 'border-[#3D3D3D]/50 hover:bg-[#252525]/50' : 'border-[#E8DCC8]/50 hover:bg-white/60'}`}>
                        <td className="px-3 py-2 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold ${index < 3 ? 'bg-[#C43A31]/10 text-[#C43A31]' : isDark ? 'bg-[#3D3D3D] text-[#C0B098]' : 'bg-[#F5EFE0] text-text-secondary'}`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className={`px-3 py-2 font-medium truncate max-w-[80px] ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`} title={unit.name}>{unit.name}</td>
                        <td className={`px-3 py-2 text-right font-mono whitespace-nowrap ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>
                          {unit.price > 0 ? unit.price.toLocaleString() : '-'}
                        </td>
                        <td className={`px-3 py-2 text-right font-mono font-semibold whitespace-nowrap ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>
                          {priceScore > 0 ? priceScore.toFixed(2) : '-'}
                        </td>
                        <td className="px-3 py-2 text-right whitespace-nowrap">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={businessScore}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              updateBidUnit(unit.id, { businessScore: val });
                            }}
                            className={`input-field w-14 text-right text-xs ${isDark ? 'bg-[#252525] border-[#3D3D3D] text-[#F2EDE4]' : ''}`}
                          />
                        </td>
                        <td className="px-3 py-2 text-right whitespace-nowrap">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={technicalScore}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              updateBidUnit(unit.id, { technicalScore: val });
                            }}
                            className={`input-field w-14 text-right text-xs ${isDark ? 'bg-[#252525] border-[#3D3D3D] text-[#F2EDE4]' : ''}`}
                          />
                        </td>
                        <td className={`px-3 py-2 text-right font-bold whitespace-nowrap ${total > 0 ? 'text-[#C43A31]' : (isDark ? 'text-[#C0B098]' : 'text-text-secondary')}`}>
                          {total > 0 ? total.toFixed(2) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowScoreModal(false)} className={`px-5 py-2 rounded-lg text-sm transition-colors ${isDark ? 'bg-[#3D3D3D] text-[#C0B098] hover:text-[#F2EDE4]' : 'bg-[#F5EFE0] border border-[#E0D5C0] text-text-secondary hover:text-text'}`}>
                取消
              </button>
              <button onClick={handleSaveScores} className="btn-primary py-2">
                <i className="ri-save-line"></i>
                <span>得分</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
