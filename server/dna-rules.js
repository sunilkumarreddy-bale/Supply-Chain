export const STAGES=['manufacturer','transporter','warehouse','retailer'];
export function analyzeJourney(events){
 const records=[...events].sort((a,b)=>new Date(a.timestamp)-new Date(b.timestamp));
 const present=new Set(records.map(e=>e.stage));
 const highest=Math.max(-1,...records.map(e=>STAGES.indexOf(e.stage)));
 const missing=STAGES.filter((stage,i)=>i<highest&&!present.has(stage));
 const conflicts=[];
 for(let i=1;i<records.length;i++){if(records[i].stage===records[i-1].stage&&records[i].organization===records[i-1].organization)conflicts.push('Duplicate sequential checkpoint: '+records[i].stage)}
 return {missing,conflicts,observedCount:records.length,complete:missing.length===0&&highest===STAGES.length-1,notice:'Missing stages are unverified; no event is fabricated.'};
}
export function descendants(root,relationships){
 const result=[],seen=new Set([root]),queue=[root];
 while(queue.length){const current=queue.shift();for(const item of relationships){if(item.parentBatch===current&&!seen.has(item.childBatch)){seen.add(item.childBatch);result.push(item.childBatch);queue.push(item.childBatch)}}}
 return result;
}
