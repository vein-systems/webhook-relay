import { Delivery } from './delivery.js';
import { Target } from './types.js';

export interface FanOutResult {
  target: string;
  success: boolean;
  latencyMs: number;
}

export class FanOut {
  constructor(private delivery: Delivery) {}

  async deliver(
    targets: Target[],
    payload: Buffer,
    headers: Record<string, string>,
  ): Promise<FanOutResult[]> {
    const start = Date.now();
    const results = await Promise.allSettled(
      targets.map(async (t) => {
        const tStart = Date.now();
        const success = await this.delivery.deliver(t, payload, headers);
        return { target: t.url, success, latencyMs: Date.now() - tStart };
      }),
    );
    return results.map((r) =>
      r.status === 'fulfilled' ? r.value : { target: 'unknown', success: false, latencyMs: Date.now() - start },
    );
  }
}

// fix typo in comment
