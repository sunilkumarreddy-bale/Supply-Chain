import React,{useState} from 'react';
export default function DnaPanel({api}){
 const [batch,setBatch]=useState('MILK-RAW-A'),[form,F]=useState({stage:'manufacturer',organization:'Farm A',timestamp:new Date().toISOString(),quantity:100}),[link,L]=useState({parentBatch:'MILK-RAW-A',childBatch:'MIX-1'}),[journey,J]=useState(null),[recall,R]=useState(null),[error,E]=useState('');
 const run=async(fn)=>{try{await fn();E('')}catch(e){E(e.message)}};
 return <div><h2>SupplyChain DNA — Investigation</h2><p>Track checkpoints, detect gaps, record manufacturing genealogy, and investigate downstream batches. Missing steps are never treated as proven events.</p>
 {error&&<p className="error">{error}</p>}
 <article><h3>1. Record product checkpoint</h3>
 <input aria-label="Batch" value={batch} onChange={e=>setBatch(e.target.value)} placeholder="Batch code"/>
 <select aria-label="Checkpoint" value={form.stage} onChange={e=>F({...form,stage:e.target.value})}>{['manufacturer','transporter','warehouse','retailer'].map(x=><option key={x}>{x}</option>)}</select>
 <input aria-label="Organization" placeholder="Organization" value={form.organization} onChange={e=>F({...form,organization:e.target.value})}/>
 <input aria-label="Timestamp" type="datetime-local" onChange={e=>F({...form,timestamp:new Date(e.target.value).toISOString()})}/>
 <input aria-label="Quantity" type="number" value={form.quantity} onChange={e=>F({...form,quantity:Number(e.target.value)})}/>
 <button onClick={()=>run(async()=>{await api('/dna/events','POST',{batch,...form});J(await api('/dna/journey/'+encodeURIComponent(batch)))})}>Save checkpoint</button>
 <button onClick={()=>run(async()=>J(await api('/dna/journey/'+encodeURIComponent(batch))))}>Analyze journey</button>
 {journey&&<><h4>Missing checkpoints</h4><p>{journey.analysis.missing.join(', ')||'None detected under the configured sequence'}</p><p>{journey.analysis.notice}</p><ul>{journey.events.map(e=><li key={e._id}>{e.stage} — {e.organization} — {new Date(e.timestamp).toLocaleString()}</li>)}</ul></>}
 </article>
 <article><h3>2. Batch genealogy and recall</h3>
 <input aria-label="Parent batch" placeholder="Parent batch" value={link.parentBatch} onChange={e=>L({...link,parentBatch:e.target.value})}/>
 <input aria-label="Child batch" placeholder="Child batch" value={link.childBatch} onChange={e=>L({...link,childBatch:e.target.value})}/>
 <button onClick={()=>run(async()=>{await api('/dna/lineage','POST',link);R(await api('/dna/recall/'+encodeURIComponent(link.parentBatch)))})}>Link batches</button>
 <input aria-label="Recall source batch" placeholder="Recall source batch" value={batch} onChange={e=>setBatch(e.target.value)}/>
 <button onClick={()=>run(async()=>R(await api('/dna/recall/'+encodeURIComponent(batch))))}>Check recall impact</button>
 {recall&&<><p><b>Recorded downstream batches:</b> {recall.count}</p><p>{recall.recordedDownstreamBatches.join(' → ')||'No linked batches found'}</p><small>{recall.qualification}</small></>}
 </article></div>
}
