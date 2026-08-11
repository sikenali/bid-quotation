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

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-border rounded-full" />
            <h3 className="font-semibold text-text">投标单位列表</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRandomModal(true)}
              className="px-3 py-1.5 text-sm bg-white border border-border rounded-lg text-text-secondary hover:text-primary hover:border-primary transition-colors"
            >
              随机填充
            </button>
            <button
              onClick={() => setShowParseModal(true)}
              className="px-3 py-1.5 text-sm bg-white border border-border rounded-lg text-text-secondary hover:text-primary hover:border-primary transition-colors"
            >
              报价解析
            </button>
            <button
              onClick={clearBidUnits}
              className="px-3 py-1.5 text-sm bg-white border border-border rounded-lg text-text-secondary hover:text-red-500 hover:border-red-300 transition-colors"
            >
              清空
            </button>
          </div>
        </div>

        {bidUnits.length === 0 ? (
          <p className="text-text-secondary text-center py-8">暂无投标单位，点击下方按钮添加</p>
        ) : (
          <div className="space-y-3">
            {bidUnits.map((unit) => (
              <div key={unit.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border/50">
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
                  className="input-field w-32 text-center"
                />
                <button
                  onClick={() => removeBidUnit(unit.id)}
                  className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                  aria-label="删除"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleAdd}
          className="mt-4 w-full py-3 border-2 border-dashed border-border rounded-xl text-text-secondary hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2"
        >
          <i className="ri-add-line text-lg"></i>
          添加投标单位
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
