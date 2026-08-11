import { CalcResult } from '../types';

export function exportCSV(result: CalcResult): void {
  const BOM = '\uFEFF';
  const headers = ['排名', '单位名称', '报价', '是否有效', '偏差率(%)', '得分', '与基准价差'];
  const rows = result.rankings.map((r) => [
    r.rank,
    r.unit.name,
    r.unit.price,
    r.unit.isValid ? '有效' : '无效',
    r.deviationPercent,
    r.score,
    r.priceDiff,
  ]);

  const csv = BOM + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `投标报价结果_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
