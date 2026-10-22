import test from 'node:test';import assert from 'node:assert/strict';import {reorderSuggestion,applyQuantity,receiptStatus} from '../rules.js';
test('reorder below threshold',()=>assert.equal(reorderSuggestion(4,10,40),36));
test('no reorder above threshold',()=>assert.equal(reorderSuggestion(15,10,40),0));
test('prevent negative inventory',()=>assert.throws(()=>applyQuantity(3,-4)));
test('allow receipt',()=>assert.equal(applyQuantity(3,5),8));
test('partial receipt',()=>assert.equal(receiptStatus(2,5),'partially_received'));
test('full receipt',()=>assert.equal(receiptStatus(5,5),'received'));
