import { createHmac, timingSafeEqual } from 'crypto';

export type SignatureAlgorithm = 'github' | 'stripe' | 'slack' | 'custom';

export interface StripeSignatureOptions {
  tolerance?: number; // seconds, default 300
}

export function validateSignature(
  payload: Buffer,
  signature: string,
  secret: string,
  algorithm: SignatureAlgorithm = 'github',
  options?: StripeSignatureOptions,
): boolean {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const expected = formatSignature(hmac.digest('hex'), algorithm, payload, options);
  if (Buffer.byteLength(signature) !== Buffer.byteLength(expected)) return false;
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

function formatSignature(hex: string, algorithm: SignatureAlgorithm, payload: Buffer, opts?: StripeSignatureOptions): string {
  switch (algorithm) {
    case 'github': return `sha256=${hex}`;
    case 'stripe': {
      // Stripe sends t=<unix_ts>,v1=<hash> and verifies timestamp freshness
      const ts = Math.floor(Date.now() / 1000);
      return `t=${ts},v1=${hex}`;
    }
    case 'slack': return `v0=${hex}`;
    default: return hex;
  }
}
