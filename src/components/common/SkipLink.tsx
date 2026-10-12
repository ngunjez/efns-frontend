import { useTranslations } from 'next-intl';

export function SkipLink() {
  const t = useTranslations('common');
  return (
    <a
      href="#main"
      className="sr-only z-50 rounded-control bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:start-3 focus:top-3"
    >
      {t('skipToContent')}
    </a>
  );
}
