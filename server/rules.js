export function reorderSuggestion(stock,reorderPoint,target){if(![stock,reorderPoint,target].every(Number.isFinite))throw Error('Invalid input');return stock<=reorderPoint?Math.max(0,target-stock):0}
export function applyQuantity(current,delta){if(!Number.isInteger(delta)||delta===0)throw Error('Invalid movement');if(current+delta<0)throw Error('Insufficient stock');return current+delta}
export function receiptStatus(received,total){return received>=total?'received':received>0?'partially_received':'confirmed'}
