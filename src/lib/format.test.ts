import { formatDelta, formatDuration, formatMoney, maskPhone } from './format';

describe('format', () => {
  it('formats Kenyan shillings without decimals', () => {
    expect(formatMoney(51500)).toBe('KES 51,500');
  });

  it('formats elapsed timers as mm:ss and never goes negative', () => {
    expect(formatDuration(42)).toBe('00:42');
    expect(formatDuration(1800)).toBe('30:00');
    expect(formatDuration(-5)).toBe('00:00');
  });

  it('signs deltas', () => {
    expect(formatDelta(7.3, '%')).toBe('+7.3%');
    expect(formatDelta(-2)).toBe('-2');
  });

  it('masks the middle of a phone number', () => {
    expect(maskPhone('0745 220 318')).toBe('0745 *** 318');
  });
});
