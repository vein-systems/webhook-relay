import { FilterRule } from './types.js';

export function applyFilters(payload: unknown, rules: FilterRule[]): boolean {
  for (const rule of rules) {
    const value = getNestedValue(payload, rule.field);
    if (!matchesRule(value, rule)) return false;
  }
  return true;
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

function matchesRule(value: unknown, rule: FilterRule): boolean {
  const str = String(value ?? '');
  switch (rule.operator) {
    case 'eq': return str === rule.value;
    case 'contains': return str.includes(rule.value);
    case 'matches': return new RegExp(rule.value).test(str);
    default: return false;
  }
}
