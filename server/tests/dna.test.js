import test from 'node:test';import assert from 'node:assert/strict';import{analyzeJourney,descendants}from '../dna-rules.js';
const event=(stage,day)=>({stage,organization:stage,timestamp:'2026-10-'+String(day).padStart(2,'0')+'T08:00:00Z'});
test('DNA flags missing transporter checkpoint',()=>{const a=analyzeJourney([event('manufacturer',1),event('warehouse',3)]);assert.deepEqual(a.missing,['transporter']);assert.equal(a.complete,false)});
test('complete journey when all stages recorded',()=>assert.equal(analyzeJourney([event('manufacturer',1),event('transporter',2),event('warehouse',3),event('retailer',4)]).complete,true));
test('does not fabricate inferred events',()=>assert.equal(analyzeJourney([event('manufacturer',1),event('retailer',4)]).observedCount,2));
test('recall follows batch split and mixing lineage',()=>assert.deepEqual(descendants('MILK-RAW-A',[{parentBatch:'MILK-RAW-A',childBatch:'MIX-1'},{parentBatch:'MILK-RAW-B',childBatch:'MIX-1'},{parentBatch:'MIX-1',childBatch:'PACK-1'}]),['MIX-1','PACK-1']));
test('recall handles cyclic invalid legacy data without looping',()=>assert.deepEqual(descendants('A',[{parentBatch:'A',childBatch:'B'},{parentBatch:'B',childBatch:'A'}]),['B']));
