import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { BidUnit } from '../types';

export default function BidInput() {
  const { bidUnits, addBidUnit, updateBidUnit, removeBidUnit, clearBidUnits, randomFill, parsePrices, theme } = useConfigStore();
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [showParseModal, setShowParseModal] = useState(false);
  const [randomCount, setRandomCount] = useState(5);
  const [randomCenter, setRandomCenter] = useState(100);
  const [randomFluctuation, setRandomFluctuation] = useState(10);
  const [parseText, setParseText] = useState('');
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);

  const isDark = theme === 'dark';

  // 显示所有投标单位，不裁剪、不随机打乱
  const displayUnits = bidUnits;

  const handleAdd = () => {
    addBidUnit('', 0);
    const units = useConfigStore.getState().bidUnits;
    setActiveUnitId(units[units.length - 1]?.id || null);
  };

  const handleChange = (id: string, field: keyof BidUnit, value: string | number | boolean) => {
    updateBidUnit(id, { [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* 投标单位标签横排 */}
      <div className="flex flex-wrap gap-3">
        {displayUnits.map((unit) => (
          <button
            key={unit.id}
            onClick={() => setActiveUnitId(unit.id === activeUnitId ? null : unit.id)}
            className={`flex flex-col items-center justify-center px-5 py-3 rounded-xl min-w-[140px] transition-all border-2 ${
              unit.id === activeUnitId
                ? 'bg-[#C43A31] text-white border-[#C43A31] shadow-sm'
                : isDark
                  ? 'bg-[#2A2A2A] border-[#3A3A3A] text-[#E8E0D0] hover:border-[#C43A31]/50'
                  : 'bg-[#F5EFE0] border-[#E0D5C0] text-text hover:border-[#C43A31]/40'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                unit.id === activeUnitId ? 'border-white bg-white' : isDark ? 'border-[#A89880] bg-transparent' : 'border-[#8B7355] bg-transparent'
              }`} />
              <span className={`text-[14px] font-medium ${unit.id === activeUnitId ? 'text-white' : isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>
                {unit.name || '未命名'}
              </span>
            </div>
            <span className={`text-[11px] ${unit.id === activeUnitId ? 'text-white/70' : isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>
              ¥ {unit.price.toLocaleString()}
            </span>
          </button>
        ))}
        <button
          onClick={handleAdd}
          className={`w-[120px] h-[60px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
            isDark
              ? 'border-[#3A3A3A] text-[#A89880] hover:border-[#C43A31] hover:text-[#C43A31] bg-[#1A1A1A]'
              : 'bg-[#FBF7EF] border-[#D4C4A8] text-text-secondary hover:border-[#C43A31] hover:text-[#C43A31]'
          }`}
        >
          <i className="ri-add-line text-xl"></i>
          <span className="text-[13px]">添加单位</span>
        </button>
      </div>

      {/* 单位编辑区 */}
      <div className={`rounded-2xl p-6 border ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-[#F5EFE0] border-[#E8DCC8]'}`}>
        <div className="flex items-center gap-5 mb-4">
          <div className={`w-1.5 h-4.5 rounded-[3px] flex-shrink-0 ${isDark ? 'bg-[#A89880]' : 'bg-[#D4C4A8]'}`} />
          <h3 className={`font-semibold text-[15px] ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>
            {displayUnits.length > 0
              ? `${activeUnitId ? (bidUnits.find(u => u.id === activeUnitId)?.name || '单位') : '全部'} · 编辑`
              : '投标单位列表'}
          </h3>
        </div>

        {displayUnits.length === 0 ? (
          <p className={`text-center py-8 ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>暂无投标单位，点击上方的「添加单位」按钮开始录入</p>
        ) : (
          <div className="space-y-3">
            {displayUnits.map((unit) => (
              <div
                key={unit.id}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                  unit.id === activeUnitId
                    ? isDark
                      ? 'bg-[#1A1A1A] border-[#C43A31]/40 ring-1 ring-[#C43A31]/20'
                      : 'bg-white border-[#C43A31]/40 ring-1 ring-[#C43A31]/10'
                    : isDark
                      ? 'bg-[#1A1A1A] border-[#3A3A3A]'
                      : 'bg-white border-[#E8DCC8]/50'
                }`}
              >
                <input
                  type="text"
                  value={unit.name}
                  onChange={(e) => handleChange(unit.id, 'name', e.target.value)}
                  placeholder="单位名称"
                  className={`input-field flex-1 ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
                />
                <input
                  type="number"
                  value={unit.price}
                  onChange={(e) => handleChange(unit.id, 'price', parseFloat(e.target.value) || 0)}
                  placeholder="报价金额"
                  className={`input-field w-[200px] text-center ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
                />
                <span className={`text-sm font-medium ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>元</span>
                <button
                  onClick={() => removeBidUnit(unit.id)}
                  className="px-4 py-2 bg-[#FFF0ED] border border-[#F5C6C0] rounded-lg text-[#C43A31] text-sm font-medium hover:bg-[#FFE0DC] transition-colors flex items-center gap-1"
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
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowRandomModal(true)}
          className={`px-5 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
            isDark
              ? 'bg-[#2A2A2A] border border-[#3A3A3A] text-[#A89880] hover:text-[#E8E0D0] hover:border-[#C43A31]/50'
              : 'bg-[#F5EFE0] border border-[#E0D5C0] text-text-secondary hover:text-[#C43A31] hover:border-[#C43A31]'
          }`}
        >
          <i className="ri-dice-line"></i>
随机厂商
        </button>
        <button
          onClick={() => setShowParseModal(true)}
          className={`px-5 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
            isDark
              ? 'bg-[#2A2A2A] border border-[#3A3A3A] text-[#A89880] hover:text-[#E8E0D0] hover:border-[#C43A31]/50'
              : 'bg-[#F5EFE0] border border-[#E0D5C0] text-text-secondary hover:text-[#C43A31] hover:border-[#C43A31]'
          }`}
        >
          <i className="ri-file-search-line"></i>
          报价解析
        </button>
        <button
          onClick={clearBidUnits}
          className="px-5 py-2 bg-[#FFF0ED] border border-[#F5C6C0] rounded-lg text-[#C43A31] text-sm hover:bg-[#FFE0DC] transition-colors flex items-center gap-2"
        >
          <i className="ri-delete-bin-line"></i>
          清空所有
        </button>
      </div>

      {showRandomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRandomModal(false)}>
          <div className={`rounded-xl p-6 w-96 ${isDark ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>随机填充</h3>
            <div className="space-y-3">
              <div>
                <label className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>投标家数</label>
                <input
                  type="number"
                  value={randomCount}
                  onChange={(e) => setRandomCount(parseInt(e.target.value) || 0)}
                  className={`input-field w-full mt-1 ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
                />
              </div>
              <div>
                <label className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>基准价中值</label>
                <input
                  type="number"
                  value={randomCenter}
                  onChange={(e) => setRandomCenter(parseFloat(e.target.value) || 0)}
                  className={`input-field w-full mt-1 ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
                />
              </div>
              <div>
                <label className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>波动 ±%</label>
                <input
                  type="number"
                  value={randomFluctuation}
                  onChange={(e) => setRandomFluctuation(parseFloat(e.target.value) || 0)}
                  className={`input-field w-full mt-1 ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowRandomModal(false)} className={`btn-secondary ${isDark ? 'bg-[#3A3A3A] text-[#A89880] hover:bg-[#2A2A2A]' : ''}`}>取消</button>
              <button
                onClick={() => { randomFill(randomCount, randomCenter, randomFluctuation); setShowRandomModal(false); }}
                className="btn-primary"
              >
                生成
              </button>
            </div>
          </div>
        </div>
      )}

      {showParseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowParseModal(false)}>
          <div className={`rounded-xl p-6 w-[500px] ${isDark ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>报价解析</h3>
            <textarea
              value={parseText}
              onChange={(e) => setParseText(e.target.value)}
              className={`input-field w-full h-32 resize-none ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
              placeholder="输入报价，支持逗号、全角逗号分隔，如：100,110,120 或 100，110，120"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowParseModal(false)} className={`btn-secondary ${isDark ? 'bg-[#3A3A3A] text-[#A89880] hover:bg-[#2A2A2A]' : ''}`}>取消</button>
              <button
                onClick={() => { parsePrices(parseText); setShowParseModal(false); }}
                className="btn-primary"
              >
                解析填入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
