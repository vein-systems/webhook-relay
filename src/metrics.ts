export class Metrics {
  private deliveries = { success: 0, failure: 0 };
  private latencies: number[] = [];
  private _p50Cache: number | null = null;
  private _p99Cache: number | null = null;
  private _dirty = false;

  record(success: boolean, latencyMs: number): void {
    if (success) this.deliveries.success++;
    else this.deliveries.failure++;
    this.latencies.push(latencyMs);
    this._dirty = true;
  }

  prometheus(): string {
    if (this._dirty) {
      const sorted = [...this.latencies].sort((a, b) => a - b);
      this._p50Cache = this._percentileFromSorted(sorted, 50);
      this._p99Cache = this._percentileFromSorted(sorted, 99);
      this._dirty = false;
    }
    return [
      `# HELP webhook_relay_deliveries_total Total deliveries`,
      `# TYPE webhook_relay_deliveries_total counter`,
      `webhook_relay_deliveries_total{result="success"} ${this.deliveries.success}`,
      `webhook_relay_deliveries_total{result="failure"} ${this.deliveries.failure}`,
      `# HELP webhook_relay_latency_p50_ms p50 delivery latency`,
      `webhook_relay_latency_p50_ms ${this._p50Cache ?? 0}`,
      `# HELP webhook_relay_latency_p99_ms p99 delivery latency`,
      `webhook_relay_latency_p99_ms ${this._p99Cache ?? 0}`,
    ].join('\n');
  }

  private _percentileFromSorted(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    const idx = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, idx)];
  }
}
