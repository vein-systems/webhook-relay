import { writeFileSync, mkdirSync } from 'fs';
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
  }
}
