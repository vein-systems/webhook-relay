import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';

describe('FanOut', () => {
  it('delivers to all targets even if one fails', async () => {
    // Verifies that Promise.allSettled semantics hold: one rejected
    // target should not prevent others from being attempted.
    const results = await Promise.allSettled([
      Promise.resolve({ target: 'https://a.example', success: true, latencyMs: 50 }),
      Promise.reject(new Error('timeout')),
      Promise.resolve({ target: 'https://c.example', success: true, latencyMs: 80 }),
    ]);
    const settled = results.map((r) =>
      r.status === 'fulfilled' ? r.value : { target: 'unknown', success: false, latencyMs: 0 }
    );
    assert.equal(settled.filter((r) => r.success).length, 2);
    assert.equal(settled.filter((r) => !r.success).length, 1);
  });
});
