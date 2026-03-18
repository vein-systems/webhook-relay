import { createHmac, timingSafeEqual } from 'crypto';

export type SignatureAlgorithm = 'github' | 'stripe' | 'slack' | 'custom';

export function validateSignature(
  payload: Buffer,
  signature: string,
  secret: string,
  algorithm: SignatureAlgorithm = 'github',
): boolean {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const expected = formatSignature(hmac.digest('hex'), algorithm);
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

function formatSignature(hex: string, algorithm: SignatureAlgorithm): string {
  switch (algorithm) {
    case 'github': return `sha256=${hex}`;
    case 'stripe': return `t=${Date.now()},v1=${hex}`;
    case 'slack': return `v0=${hex}`;
    default: return hex;
  }
}
