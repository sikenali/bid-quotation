import { BidConfig } from '../types';

export function exportCSV(config: BidConfig, result: ReturnType<typeof import('./algorithms').calculateResult>) {
  // TODO: Implement CSV export
  console.log('Export CSV', config, result);
}
