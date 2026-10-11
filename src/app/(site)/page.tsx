import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/common/Section';
import { Reveal } from '@/components/motion/Reveal';
import { StaggerItem, StaggerList } from '@/components/motion/Stagger';
import { BookingWidget } from '@/components/features/site/BookingWidget';
import { HubList } from '@/components/features/site/HubList';
import { ServiceGrid } from '@/components/features/site/ServiceGrid';

export default async function LandingPage() {
  const t = await getTranslations('landing');
  const steps = [1, 2, 3, 4] as const;

  return (
    <>
      <section className="border-b bg-card py-section">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <Reveal className="grid max-w-2xl gap-5">
            <h1 className="text-display">{t('heroTitle')}</h1>
            <p className="text-lead text-muted-foreground">{t('heroBody')}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <BookingWidget />
          </Reveal>
        </div>
      </section>

      <Section id="services" title={t('servicesTitle')} description={t('servicesBody')}>
        <ServiceGrid />
      </Section>

      <Section id="how-it-works" title={t('howTitle')} description={t('howBody')} tone="surface">
        <StaggerList ordered inView className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <StaggerItem key={step} className="grid content-start gap-3">
              <span
                aria-hidden
                className="grid size-10 place-items-center rounded-full bg-primary font-semibold text-primary-foreground"
              >
                {step}
              </span>
              <h3 className="text-h3">{t(`how${step}Title`)}</h3>
              <p className="text-muted-foreground">{t(`how${step}Body`)}</p>
            </StaggerItem>
          ))}
        </StaggerList>
      </Section>

      <Section id="hubs" title={t('hubsTitle')} description={t('hubsBody')}>
        <HubList />
      </Section>
    </>
  );
}
