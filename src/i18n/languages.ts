export interface Language {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  intl: string;
}

export const languages = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', intl: 'en-KE' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', dir: 'ltr', intl: 'sw-KE' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', intl: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr', intl: 'de-DE' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', intl: 'es-ES' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr', intl: 'pt-PT' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr', intl: 'it-IT' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', intl: 'ar' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr', intl: 'zh-CN' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr', intl: 'ja-JP' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', intl: 'hi-IN' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr', intl: 'ru-RU' },
] as const satisfies readonly Language[];

export type Locale = (typeof languages)[number]['code'];
