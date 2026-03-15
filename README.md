# webhook-relay

A lightweight HTTP webhook relay for Node.js with built-in retry logic, payload filtering, and fan-out delivery to multiple endpoints.

## Features

- **Fan-out delivery** — forward a single webhook to multiple upstream targets simultaneously
- **Retry with backoff** — automatic retry with configurable exponential backoff on delivery failure
- **Payload filtering** — drop or transform events before forwarding using a simple rule engine
- **HMAC signature validation** — verify incoming webhook signatures (GitHub, Stripe, Slack, and custom)
- **Dead-letter queue** — failed deliveries are persisted to disk for manual replay
- **Prometheus metrics** — `/metrics` endpoint for delivery latency and success rate observability

## Quick Start

```bash
npm install webhook-relay
```

```js
import { WebhookRelay } from 'webhook-relay';

const relay = new WebhookRelay({
  port: 3000,
  targets: [
    { url: 'https://internal.example.com/hooks', secret: process.env.TARGET_SECRET },
  ],
  retries: 3,
  backoff: 'exponential',
});

relay.start();
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `port` | number | `3000` | Port to listen on |
| `targets` | Target[] | `[]` | Upstream delivery targets |
| `retries` | number | `3` | Max retry attempts per delivery |
| `backoff` | `'linear'` \| `'exponential'` | `'exponential'` | Retry backoff strategy |
| `timeout` | number | `5000` | Per-request timeout in ms |
| `dlq.enabled` | boolean | `true` | Enable dead-letter queue |
| `dlq.path` | string | `'.dlq'` | Directory for DLQ files |

## License

MIT
