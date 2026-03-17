import { RelayConfig, Target } from './types.js';

export class Delivery {
  constructor(private config: RelayConfig) {}

  async deliver(target: Target, payload: Buffer, headers: Record<string, string>): Promise<boolean> {
    const maxRetries = this.config.retries ?? 3;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const resp = await fetch(target.url, {
          method: 'POST',
          body: payload,
          headers: {
            'Content-Type': 'application/json',
            ...target.headers,
            ...headers,
          },
          signal: AbortSignal.timeout(target.timeout ?? this.config.timeout ?? 5000),
        });
        if (resp.ok) return true;
      } catch {
        if (attempt === maxRetries) return false;
        await this.sleep(this.backoffMs(attempt));
      }
    }
    return false;
  }

  private backoffMs(attempt: number): number {
    if (this.config.backoff === 'exponential') {
      return Math.min(1000 * 2 ** attempt, 30000);
    }
    return 1000 * (attempt + 1);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
