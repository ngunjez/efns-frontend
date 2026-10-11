/**
 * Display formatting. Every amount, date and duration on screen goes through
 * here so the whole platform reads the same way ("KES 51,500", "2 Oct 2026").
 */
const LOCALE = 'en-KE';

const money = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat(LOCALE, { notation: 'compact', maximumFractionDigits: 1 });
const integer = new Intl.NumberFormat(LOCALE);

export function formatMoney(amount: number, currency = 'KES') {
  return `${currency} ${money.format(amount)}`;
}

/** KES 54.6M — for KPI tiles where the exact figure is in the table below. */
export function formatMoneyCompact(amount: number, currency = 'KES') {
  return `${currency} ${compact.format(amount)}`;
}

export function formatNumber(value: number) {
  return integer.format(value);
}

export function formatPercent(value: number, digits = 0) {
  return `${value.toFixed(digits)}%`;
}

/** Signed change for delta badges: +7.3%, -1.4%, +2. */
export function formatDelta(value: number, unit: '%' | '' = '') {
  const sign = value > 0 ? '+' : '';
  return `${sign}${unit === '%' ? value.toFixed(1) : value}${unit}`;
}

function toDate(value: string | number | Date) {
  return value instanceof Date ? value : new Date(value);
}

export function formatDate(value: string | number | Date) {
  return toDate(value).toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatShortDate(value: string | number | Date) {
  return toDate(value).toLocaleDateString(LOCALE, { day: '2-digit', month: 'short' });
}

export function formatTime(value: string | number | Date) {
  return toDate(value).toLocaleTimeString(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatDateTime(value: string | number | Date) {
  return `${formatShortDate(value)}, ${formatTime(value)}`;
}

/** 00:42 / 52:10 — elapsed timers on the officer desk and workbench. */
export function formatDuration(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Mask all but the last digits of a phone number: 0745 *** 318. */
export function maskPhone(phone: string) {
  const digits = phone.replace(/\s+/g, '');
  if (digits.length < 7) return phone;
  return `${digits.slice(0, 4)} *** ${digits.slice(-3)}`;
}
