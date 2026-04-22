import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { DlqConfig } from './types.js';

export interface DlqEntry {
  ts: string;
  target: string;
  payload: string;
  lastError: string;
  attempts: number;
}

export class DeadLetterQueue {
  constructor(private config: DlqConfig) {
    if (config.enabled) {
      mkdirSync(config.path, { recursive: true });
    }
  }

  persist(entry: DlqEntry): void {
    if (!this.config.enabled) return;
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.json`;
    writeFileSync(join(this.config.path, filename), JSON.stringify(entry, null, 2));
    this.enforceMaxEntries();
  }

  private enforceMaxEntries(): void {
    const max = this.config.maxEntries;
    if (!max) return;
    const files = readdirSync(this.config.path)
      .filter((f) => f.endsWith('.json'))
      .sort();
    while (files.length > max) {
      unlinkSync(join(this.config.path, files.shift()!));
    }
  }
}
