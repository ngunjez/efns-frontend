const LOCALE = 'en-KE';

const money = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat(LOCALE, { notation: 'compact', maximumFractionDigits: 1 });
const integer = new Intl.NumberFormat(LOCALE);

export function formatMoney(amount: number, currency = 'KES') {
  return `${currency} ${money.format(amount)}`;
}

export function formatMoneyCompact(amount: number, currency = 'KES') {
  return `${currency} ${compact.format(amount)}`;
}

export function formatNumber(value: number) {
  return integer.format(value);
}

export function formatPercent(value: number, digits = 0) {
  return `${value.toFixed(digits)}%`;
}

export function formatDelta(value: number, unit: '%' | '' = '') {
  const sign = value > 0 ? '+' : '';
  return `${sign}${unit === '%' ? value.toFixed(1) : value}${unit}`;
}

function toDate(value: string | number | Date) {
  return value instanceof Date ? value : new Date(value);
}

export function formatDate(value: string | number | Date, locale: string = LOCALE) {
  return toDate(value).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatShortDate(value: string | number | Date, locale: string = LOCALE) {
  return toDate(value).toLocaleDateString(locale, { day: '2-digit', month: 'short' });
}

export function formatTime(value: string | number | Date, locale: string = LOCALE) {
  return toDate(value).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatDateTime(value: string | number | Date, locale: string = LOCALE) {
  return `${formatShortDate(value, locale)}, ${formatTime(value, locale)}`;
}

export function formatDuration(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\s+/g, '');
  if (digits.length < 7) return phone;
  return `${digits.slice(0, 4)} *** ${digits.slice(-3)}`;
}
