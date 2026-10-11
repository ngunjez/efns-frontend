import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/common/Section';
import { BookingWidget } from '@/components/features/site/BookingWidget';
import { HubList } from '@/components/features/site/HubList';
import { ServiceGrid } from '@/components/features/site/ServiceGrid';

/** Frame 90 / 89: the public front door. Static copy renders on the server; lists load from the catalogue. */
export default async function LandingPage() {
  const t = await getTranslations('landing');
  const steps = [1, 2, 3, 4] as const;

  return (
    <>
      <section className="border-b bg-card py-section">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="grid max-w-2xl gap-5">
            <h1 className="text-display">{t('heroTitle')}</h1>
            <p className="text-lead text-muted-foreground">{t('heroBody')}</p>
          </div>
          <BookingWidget />
        </div>
      </section>

      <Section id="services" title={t('servicesTitle')} description={t('servicesBody')}>
        <ServiceGrid />
      </Section>

      <Section id="how-it-works" title={t('howTitle')} description={t('howBody')} tone="surface">
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step} className="grid content-start gap-3">
              <span
                aria-hidden
                className="grid size-10 place-items-center rounded-full bg-primary font-semibold text-primary-foreground"
              >
                {step}
              </span>
              <h3 className="text-h3">{t(`how${step}Title`)}</h3>
              <p className="text-muted-foreground">{t(`how${step}Body`)}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="hubs" title={t('hubsTitle')} description={t('hubsBody')}>
        <HubList />
      </Section>
    </>
  );
}
