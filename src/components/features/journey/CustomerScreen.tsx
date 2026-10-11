'use client';

import dynamic from 'next/dynamic';
import { useCustomerDisplay } from '@/api/hooks/use-displays';
import { LoadingBlock, QueryState } from '@/components/common/QueryState';
import { StageProgress } from '@/components/common/StageProgress';
import { HubScreenHeader } from '@/components/layout/client/HubScreenHeader';
import { SiteFooter } from '@/components/layout/client/SiteFooter';
import { journeySteps } from '@/config/journey';
import type { JourneyData, JourneyStep } from '@/types/journey';

export interface StepProps {
  step: JourneyStep;
  data: Partial<JourneyData>;
  client: { name: string; reference: string };
  officer: string;
}

const load = (loader: () => Promise<{ default: React.ComponentType<StepProps> }>) =>
  dynamic(loader, { loading: () => <LoadingBlock rows={5} /> });

/** One lazily loaded component per step: a screen only ships the code it shows. */
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
  lodgement: load(() => import('./steps/ReceiptStep')),
  submitted: load(() => import('./steps/ReceiptStep')),
  collection: load(() => import('./steps/CollectionStep')),
  feedback: load(() => import('./steps/FeedbackStep')),
};

/**
 * The client-facing screen at the hub (welcome tablet and the bay's second
 * monitor). Staff act; the client reads, confirms and signs here.
 */
export function CustomerScreen({ step }: { step: JourneyStep }) {
  const query = useCustomerDisplay();
  const meta = journeySteps[step];
  const Step = steps[step];

  return (
    <div className="flex min-h-dvh flex-col">
      <HubScreenHeader
        hubName={query.data?.hubName ?? ''}
        subtitle={meta.showClient ? undefined : 'AaaS, government services'}
        client={meta.showClient ? query.data?.client : undefined}
      />
      {step !== 'welcome' && (
        <div className="border-b bg-card py-4">
          <StageProgress stage={meta.stage} className="container-page" />
        </div>
      )}
      <main id="main" className="container-page flex-1 py-section">
        <QueryState query={query} loading={<LoadingBlock rows={6} />}>
          {(view) => (
            <Step step={step} data={view.data} client={view.client} officer={view.officer} />
          )}
        </QueryState>
      </main>
      <SiteFooter atHub />
    </div>
  );
}
