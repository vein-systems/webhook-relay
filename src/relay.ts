import { RelayConfig } from './types.js';
import { Delivery } from './delivery.js';
import { validateSignature } from './signature.js';

export class WebhookRelay {
  private config: Required<RelayConfig>;
  private delivery: Delivery;

  constructor(config: RelayConfig) {
    this.config = {
      port: config.port ?? 3000,
      host: config.host ?? '0.0.0.0',
      targets: config.targets,
      retries: config.retries ?? 3,
      backoff: config.backoff ?? 'exponential',
      timeout: config.timeout ?? 5000,
      filters: config.filters ?? [],
      dlq: config.dlq ?? { enabled: true, path: '.dlq' },
      metrics: config.metrics ?? true,
    };
    this.delivery = new Delivery(this.config);
  }

  async start(): Promise<void> {
    console.log(`webhook-relay listening on ${this.config.host}:${this.config.port}`);
  }
}

// TODO: wire fastify server
