import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { applyFilters } from '../src/filter.js';

describe('applyFilters', () => {
  it('passes payload that matches all rules', () => {
    const payload = { event: 'push', ref: 'refs/heads/main' };
    const rules = [
      { field: 'event', operator: 'eq' as const, value: 'push' },
      { field: 'ref', operator: 'contains' as const, value: 'main' },
    ];
    assert.ok(applyFilters(payload, rules));
  });

  it('drops payload that fails one rule', () => {
    const payload = { event: 'pull_request' };
    const rules = [{ field: 'event', operator: 'eq' as const, value: 'push' }];
    assert.ok(!applyFilters(payload, rules));
  });
});
