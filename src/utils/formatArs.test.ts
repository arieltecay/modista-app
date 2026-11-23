import { describe, expect, it } from 'vitest';
import { formatArs } from './formatArs';

describe('formatArs', () => {
  it('shows whole Argentine pesos with the thousands separator', () => {
    expect(formatArs(20900)).toMatch(/20\.900/);
    expect(formatArs(20900)).toContain('$');
    expect(formatArs(20900)).not.toMatch(/,00/);
  });
});
