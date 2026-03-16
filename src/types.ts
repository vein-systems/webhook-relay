export interface Target {
  url: string;
  secret?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface FilterRule {
  field: string;
  operator: 'eq' | 'contains' | 'matches';
  value: string;
}

export interface DlqConfig {
  enabled: boolean;
  path: string;
  maxEntries?: number;
}

export interface RelayConfig {
  port?: number;
  host?: string;
  targets: Target[];
  retries?: number;
  backoff?: 'linear' | 'exponential';
  timeout?: number;
  filters?: FilterRule[];
  dlq?: DlqConfig;
  metrics?: boolean;
}
