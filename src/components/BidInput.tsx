import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { BidUnit } from '../types';

export default function BidInput() {
  const { bidUnits, addBidUnit, updateBidUnit, removeBidUnit, clearBidUnits, randomFill, parsePrices } = useConfigStore();
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [showParseModal, setShowParseModal] = useState(false);
  const [randomCount, setRandomCount] = useState(5);
  const [randomCenter, setRandomCenter] = useState(100);
  const [randomFluctuation, setRandomFluctuation] = useState(10);
  const [parseText, setParseText] = useState('');

  const handleAdd = () => addBidUnit('', 0);

  const handleChange = (id: string, field: keyof BidUnit, value: string | number | boolean) => {
    updateBidUnit(id, { [field]: value });
  };

  const activeUnit = bidUnits[0]?.id || null;

  return (
    <div className="space-y-6">
      {/* 投标单位标签横排 */}
      <div className="flex flex-wrap gap-3">
        {bidUnits.map((unit) => (
          <button
            key={unit.id}
            onClick={() => { /* select unit */ }}
            className={`flex flex-col items-center justify-center px-5 py-3 rounded-xl min-w-[140px] transition-all ${
              unit.id === activeUnit
                ? 'bg-[#C43A31] text-white'
                : 'bg-[#F5EFE0] border border-[#E0D5C0] text-text'
            }`}
          >
            <span className={`text-[14px] font-medium ${unit.id === activeUnit ? 'text-white' : 'text-text'}`}>
              {unit.name || '未命名'}
            </span>
            <span className={`text-[11px] ${unit.id === activeUnit ? 'text-white/70' : 'text-text-secondary'}`}>
              ¥ {unit.price.toLocaleString()}
            </span>
          </button>
        ))}
        <button
          onClick={handleAdd}
          className="w-[120px] h-[60px] bg-[#FBF7EF] border-2 border-dashed border-[#D4C4A8] rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#C43A31] hover:text-[#C43A31] transition-colors"
        >
          <i className="ri-add-line text-[#8B7355] text-xl hover:text-[#C43A31]"></i>
          <span className="text-text-secondary text-[13px]">添加单位</span>
        </button>
      </div>

      {/* 单位编辑区 */}
      <div className="bg-[#F5EFE0] border border-[#E8DCC8] rounded-2xl p-6">
        <div className="flex items-center gap-5 mb-4">
          <div className="w-1.5 h-4.5 bg-[#D4C4A8] rounded-[3px] flex-shrink-0" />
          <h3 className="font-semibold text-text text-[15px]">
            {activeUnit ? `${bidUnits.find(u => u.id === activeUnit)?.name || '单位'} · 编辑` : '投标单位列表'}
          </h3>
        </div>

        {bidUnits.length === 0 ? (
          <p className="text-text-secondary text-center py-8">暂无投标单位，点击上方的「添加单位」按钮开始录入</p>
        ) : (
          <div className="space-y-3">
            {bidUnits.map((unit) => (
              <div key={unit.id} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E8DCC8]/50">
                <input
                  type="text"
                  value={unit.name}
                  onChange={(e) => handleChange(unit.id, 'name', e.target.value)}
                  placeholder="单位名称"
                  className="input-field flex-1"
                />
                <input
                  type="number"
                  value={unit.price}
                  onChange={(e) => handleChange(unit.id, 'price', parseFloat(e.target.value) || 0)}
                  placeholder="报价金额"
                  className="input-field w-[240px] text-center"
                />
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
          className="px-5 py-2 bg-[#F5EFE0] border border-[#E0D5C0] rounded-lg text-text-secondary text-sm hover:text-[#C43A31] hover:border-[#C43A31] transition-colors flex items-center gap-2"
        >
          <i className="ri-dice-line text-[#5C4033]"></i>
          随机填充
        </button>
        <button
          onClick={() => setShowParseModal(true)}
          className="px-5 py-2 bg-[#F5EFE0] border border-[#E0D5C0] rounded-lg text-text-secondary text-sm hover:text-[#C43A31] hover:border-[#C43A31] transition-colors flex items-center gap-2"
        >
          <i className="ri-file-search-line text-[#5C4033]"></i>
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
          <div className="bg-white rounded-xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-text mb-4">随机填充</h3>
            <div className="space-y-3">
              <div>
                <label className="text-text-secondary text-sm">投标家数</label>
                <input
                  type="number"
                  value={randomCount}
                  onChange={(e) => setRandomCount(parseInt(e.target.value) || 0)}
                  className="input-field w-full mt-1"
                />
              </div>
              <div>
                <label className="text-text-secondary text-sm">基准价中值</label>
                <input
                  type="number"
                  value={randomCenter}
                  onChange={(e) => setRandomCenter(parseFloat(e.target.value) || 0)}
                  className="input-field w-full mt-1"
                />
              </div>
              <div>
                <label className="text-text-secondary text-sm">波动 ±%</label>
                <input
                  type="number"
                  value={randomFluctuation}
                  onChange={(e) => setRandomFluctuation(parseFloat(e.target.value) || 0)}
                  className="input-field w-full mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowRandomModal(false)} className="btn-secondary">取消</button>
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
          <div className="bg-white rounded-xl p-6 w-[500px]" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-text mb-4">报价解析</h3>
            <textarea
              value={parseText}
              onChange={(e) => setParseText(e.target.value)}
              className="input-field w-full h-32 resize-none"
              placeholder="输入报价，支持逗号、全角逗号分隔，如：100,110,120 或 100，110，120"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowParseModal(false)} className="btn-secondary">取消</button>
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
