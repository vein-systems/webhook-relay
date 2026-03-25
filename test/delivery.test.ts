import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Delivery backoff', () => {
  it('exponential backoff caps at 30s', () => {
    // backoff(0)=1000, backoff(1)=2000, backoff(5)=30000 (capped)
    const backoff = (attempt: number) => Math.min(1000 * 2 ** attempt, 30000);
    assert.equal(backoff(0), 1000);
    assert.equal(backoff(4), 16000);
    assert.equal(backoff(10), 30000);
  });
});
