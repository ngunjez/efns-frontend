import { useTranslations } from 'next-intl';
import { Logo } from '@/components/common/Logo';
import { site } from '@/config/site';

export function SiteFooter({ atHub }: { atHub?: boolean }) {
  const t = useTranslations();
  if (atHub) {
    return (
      <footer className="border-t bg-card px-gutter py-5 text-center text-sm text-muted-foreground">
        {t('common.needHelpHub', { phone: site.supportPhone })}
      </footer>
    );
  }
  return (
    <footer className="border-t bg-card">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted-foreground">
        <Logo name={site.name} size="sm" className="text-foreground" />
        <span>
          {t('landing.footerHelp', { phone: site.supportPhone, email: site.supportEmail })}
        </span>
        <span>{t('common.decisionsNote')}</span>
      </div>
    </footer>
  );
}
