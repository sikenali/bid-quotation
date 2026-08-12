import { calculateResult } from '../utils/algorithms';
import { describe, it, expect } from 'vitest';
describe('debug', () => {
  it('show zero', () => {
    let c:any = { algorithm:'low_price_priority', validRules:[], deduction:{fullScore:20,minScore:0}, bidUnits:[
      {id:'1',name:'A',price:0,isValid:true},{id:'2',name:'B',price:100,isValid:true}], theme:'light' };
    const z = calculateResult(c)!;
    console.log('ZEROOUT', JSON.stringify(z.rankings.map(r=>[r.score, r.deviationPercent])));
    let c2:any = { algorithm:'conventional_method', validRules:[], deduction:{fullScore:20,minScore:0}, bidUnits:[
      {id:'1',name:'A',price:100},{id:'2',name:'B',price:140}], theme:'light' };
    console.log('CONVOUT', JSON.stringify(calculateResult(c2)!.rankings.map(r=>r.score)));
    expect(true).toBe(true);
  });
});
