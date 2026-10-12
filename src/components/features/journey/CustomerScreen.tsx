'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useCustomerDisplay } from '@/api/hooks/use-displays';
import { LoadingBlock, QueryState } from '@/components/common/QueryState';
import { OfflineBanner, type OfflineCopy } from '@/components/common/OfflineBanner';
import { SkipLink } from '@/components/common/SkipLink';
import { StepTransition } from '@/components/motion/StepTransition';
import { StageProgress } from '@/components/common/StageProgress';
import { HubScreenHeader } from '@/components/layout/client/HubScreenHeader';
import { SiteFooter } from '@/components/layout/client/SiteFooter';
import { journeySteps } from '@/config/journey';
import { FollowModeContext } from './journey-mode';
import type { JourneyData, JourneyStep, OfflineState } from '@/types/journey';

export interface StepProps {
  step: JourneyStep;
  data: Partial<JourneyData>;
  client: { name: string; reference: string };
  officer: string;
  offline: OfflineState | null;
}

const load = (loader: () => Promise<{ default: React.ComponentType<StepProps> }>) =>
  dynamic(loader, { loading: () => <LoadingBlock rows={5} /> });

const steps: Record<JourneyStep, React.ComponentType<StepProps>> = {
  welcome: load(() => import('./steps/WelcomeStep')),
  'visit-logged': load(() => import('./steps/VisitLoggedStep')),
  documents: load(() => import('./steps/DocumentsStep')),
  ticket: load(() => import('./steps/TicketStep')),
  'check-details': load(() => import('./steps/CheckDetailsStep')),
  consent: load(() => import('./steps/ConsentStep')),
  'documents-captured': load(() => import('./steps/CapturedStep')),
  biometrics: load(() => import('./steps/BiometricsStep')),
  payment: load(() => import('./steps/PaymentStep')),
  'payment-confirmed': load(() => import('./steps/ReceiptStep')),
  'provisional-slip': load(() => import('./steps/ReceiptStep')),
  lodgement: load(() => import('./steps/ReceiptStep')),
  submitted: load(() => import('./steps/ReceiptStep')),
  collection: load(() => import('./steps/CollectionStep')),
  feedback: load(() => import('./steps/FeedbackStep')),
};

export function CustomerScreen({ step: fixedStep }: { step?: JourneyStep }) {
  const t = useTranslations('offline');
  const query = useCustomerDisplay();
  const follow = !fixedStep;
  const step = fixedStep ?? query.data?.step ?? 'welcome';
  const meta = journeySteps[step];
  const Step = steps[step];

  const copy: OfflineCopy = {
    title: t('title'),
    detail: (since) => t('detail', { since }),
    waiting: (count) => t('waiting', { count }),
    deviceOffline: t('deviceOffline'),
  };

  return (
    <FollowModeContext.Provider value={follow}>
      <div className="flex min-h-dvh flex-col">
        <SkipLink />
        <HubScreenHeader
          hubName={query.data?.hubName ?? ''}
          client={meta.showClient ? query.data?.client : undefined}
        />
        {query.data?.offline && (
          <div className="container-page pt-4">
            <OfflineBanner offline={query.data.offline} copy={copy} />
          </div>
        )}
        {step !== 'welcome' && (
          <div className="border-b bg-card py-4">
            <StageProgress stage={meta.stage} className="container-page" />
          </div>
        )}
        <main id="main" className="container-page flex-1 py-section">
          <QueryState query={query} loading={<LoadingBlock rows={6} />}>
            {(view) => (
              <StepTransition stepKey={step}>
                <Step
                  step={step}
                  data={view.data}
                  client={view.client}
                  officer={view.officer}
                  offline={view.offline}
                />
              </StepTransition>
            )}
          </QueryState>
        </main>
        <SiteFooter atHub />
      </div>
    </FollowModeContext.Provider>
  );
}
