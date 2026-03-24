export class Metrics {
  private deliveries = { success: 0, failure: 0 };
  private latencies: number[] = [];

  record(success: boolean, latencyMs: number): void {
    if (success) this.deliveries.success++;
    else this.deliveries.failure++;
    this.latencies.push(latencyMs);
  }

  prometheus(): string {
    const p50 = this.percentile(50);
    const p99 = this.percentile(99);
    return [
      `# HELP webhook_relay_deliveries_total Total deliveries`,
      `# TYPE webhook_relay_deliveries_total counter`,
      `webhook_relay_deliveries_total{result="success"} ${this.deliveries.success}`,
      `webhook_relay_deliveries_total{result="failure"} ${this.deliveries.failure}`,
      `# HELP webhook_relay_latency_p50_ms p50 delivery latency`,
      `webhook_relay_latency_p50_ms ${p50}`,
      `# HELP webhook_relay_latency_p99_ms p99 delivery latency`,
      `webhook_relay_latency_p99_ms ${p99}`,
    ].join('\n');
  }

  private percentile(p: number): number {
    if (this.latencies.length === 0) return 0;
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const idx = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, idx)];
  }
}
