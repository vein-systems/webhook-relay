import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateSignature } from '../src/signature.js';
import { createHmac } from 'crypto';

describe('validateSignature', () => {
  it('accepts a valid GitHub-format signature', () => {
    const secret = 'test-secret';
    const payload = Buffer.from('{"event":"push"}');
    const hex = createHmac('sha256', secret).update(payload).digest('hex');
    const sig = `sha256=${hex}`;
    assert.ok(validateSignature(payload, sig, secret, 'github'));
  });

  it('rejects a tampered payload', () => {
    const secret = 'test-secret';
    const payload = Buffer.from('{"event":"push"}');
    const hex = createHmac('sha256', secret).update(payload).digest('hex');
    const sig = `sha256=${hex}`;
    const tampered = Buffer.from('{"event":"delete"}');
    assert.ok(!validateSignature(tampered, sig, secret, 'github'));
  });
});
