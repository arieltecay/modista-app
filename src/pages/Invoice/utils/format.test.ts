import { describe, expect, it } from 'vitest';
import { formatAmount, formatDate, formatPlainDate, padNumber } from './format';

describe('invoice formatting (as printed by ARCA)', () => {
  it('uses a decimal comma and no thousands separator', () => {
    expect(formatAmount(20900)).toBe('20900,00');
    expect(formatAmount(0.5)).toBe('0,50');
    expect(formatAmount(1234.567)).toBe('1234,57');
  });

  it('formats an instant as the Argentine calendar day', () => {
    expect(formatDate('2026-11-21T18:00:00Z')).toBe('21/11/2026');
    // 01:30 UTC is still the previous evening in Argentina.
    expect(formatDate('2026-11-22T01:30:00Z')).toBe('21/11/2026');
  });

  it('turns a plain YYYY-MM-DD into DD/MM/YYYY without time zones', () => {
    expect(formatPlainDate('2026-12-02')).toBe('02/12/2026');
  });

  it('pads the point of sale and number to ARCA widths', () => {
    expect(padNumber(1, 5)).toBe('00001');
    expect(padNumber(37, 8)).toBe('00000037');
    expect(padNumber(undefined, 5)).toBe('00000');
  });
});
