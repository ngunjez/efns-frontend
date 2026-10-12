'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  MonitorSmartphone,
} from 'lucide-react';
import { useCustomerDisplay } from '@/api/hooks/use-displays';
import { useCaseCommand, useShowStep } from '@/api/hooks/use-desk';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingBlock, QueryState } from '@/components/common/QueryState';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { StageProgress } from '@/components/common/StageProgress';
import { Reveal } from '@/components/motion/Reveal';
import { StepTransition } from '@/components/motion/StepTransition';
import { caseFlows, journeySteps, type CaseFlow } from '@/config/journey';
import { cn } from '@/lib/utils';
import type { CustomerDisplayView, JourneyStep } from '@/types/journey';
import { StepTools } from './StepTools';

interface PrimaryAction {
  label: string;
  disabled?: boolean;
  waiting?: string;
  run: () => void;
}

interface CaseConsoleProps {
  flow: CaseFlow;
  idle?: ReactNode;
}

export function CaseConsole({ flow, idle }: CaseConsoleProps) {
  const query = useCustomerDisplay();
  return (
    <QueryState query={query} loading={<LoadingBlock rows={8} />}>
      {(view) => <Console view={view} flow={flow} idle={idle} />}
    </QueryState>
  );
}

function Console({ view, flow, idle }: CaseConsoleProps & { view: CustomerDisplayView }) {
  const show = useShowStep();
  const command = useCaseCommand();
  const steps: readonly JourneyStep[] = caseFlows[flow];
  const index = steps.indexOf(view.step);

  if (index < 0) {
    if (idle) return idle;
    return (
      <Card className="grid justify-items-start gap-3 p-6">
        <h1 className="text-xl font-semibold">
          {view.client.name} is at {journeySteps[view.step].staffTitle.toLowerCase()}
        </h1>
        <p className="text-sm text-muted-foreground">
          Bring the case to {journeySteps[steps[0]!].staffTitle.toLowerCase()} to continue here.
        </p>
        <Button loading={show.isPending} onClick={() => show.mutate(steps[0]!)}>
          Start {journeySteps[steps[0]!].staffTitle.toLowerCase()}
        </Button>
      </Card>
    );
  }

  const meta = journeySteps[view.step];
  const previous = steps[index - 1];
  const next = steps[index + 1];
  const primary = primaryAction(
    view,
    next,
    (step) => show.mutate(step),
    (name) => command.mutate({ name }),
  );
  const pending = show.isPending || command.isPending;

  return (
    <Reveal className="grid gap-5">
      {view.offline && <OfflineBanner offline={view.offline} />}
      <Card className="flex flex-wrap items-center gap-x-8 gap-y-4 p-5">
        <div className="flex items-center gap-3">
          <Avatar name={view.client.name} />
          <span className="grid leading-tight">
            <span className="font-semibold">{view.client.name}</span>
            <span className="text-xs text-muted-foreground">
              {view.client.reference}, ticket {view.ticket}
            </span>
          </span>
        </div>
        <StageProgress stage={meta.stage} className="min-w-64 flex-1" />
      </Card>

      <div className="grid items-start gap-5 lg:grid-cols-[15rem_minmax(0,1fr)] 2xl:grid-cols-[15rem_minmax(0,1fr)_18rem]">
        <Card>
          <CardHeader>
            <CardTitle>Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-1">
              {steps.map((step, position) => {
                const state =
                  position < index ? 'done' : position === index ? 'current' : 'upcoming';
                return (
                  <li
                    key={step}
                    aria-current={state === 'current' ? 'step' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-control px-2 py-2 text-sm',
                      state === 'current' && 'bg-primary-tint font-semibold text-primary',
                      state === 'upcoming' && 'text-muted-foreground',
                    )}
                  >
                    {state === 'done' ? (
                      <CheckCircle2
                        className="size-4 shrink-0 fill-success text-white"
                        aria-hidden
                      />
                    ) : (
                      <span
                        aria-hidden
                        className={cn(
                          'size-4 shrink-0 rounded-full border-2',
                          state === 'current' ? 'border-primary' : 'border-input',
                        )}
                      />
                    )}
                    {journeySteps[step].staffTitle}
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <StepTransition stepKey={view.step}>
            <CardHeader>
              <div className="grid gap-0.5">
                <CardTitle>{meta.staffTitle}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  The client sees: {meta.clientSees.toLowerCase()}.
                </p>
              </div>
              <ClientStatus view={view} />
            </CardHeader>
            <CardContent className="grid gap-5">
              <StepTools view={view} />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                {previous ? (
                  <Button variant="ghost" disabled={pending} onClick={() => show.mutate(previous)}>
                    <ArrowLeft className="rtl:rotate-180" aria-hidden />{' '}
                    {journeySteps[previous].staffTitle}
                  </Button>
                ) : (
                  <span />
                )}
                {primary && (
                  <div className="flex items-center gap-3">
                    {primary.waiting && (
                      <span
                        className="flex items-center gap-1.5 text-sm text-muted-foreground"
                        role="status"
                      >
                        <Clock className="size-4" aria-hidden /> {primary.waiting}
                      </span>
                    )}
                    <Button
                      size="lg"
                      disabled={primary.disabled}
                      loading={pending}
                      onClick={primary.run}
                    >
                      {primary.label} <ArrowRight className="rtl:rotate-180" aria-hidden />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </StepTransition>
        </Card>

        <Card className="lg:col-span-2 2xl:col-span-1">
          <CardHeader>
            <CardTitle>Client screen</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid place-items-center gap-1 rounded-field bg-primary p-5 text-center text-primary-foreground">
              <MonitorSmartphone className="size-6" aria-hidden />
              <span className="font-semibold">{meta.staffTitle}</span>
              <span className="text-xs opacity-80">Stage {meta.stage} of 12</span>
            </div>
            <Button asChild variant="outline">
              <Link href="/hub/display" target="_blank" rel="noopener">
                <ExternalLink aria-hidden /> Open the client screen
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Open it on the second monitor. It follows this case on its own.
            </p>
          </CardContent>
        </Card>
      </div>
    </Reveal>
  );
}

function ClientStatus({ view }: { view: CustomerDisplayView }) {
  if (view.review === 'pending') return <Badge tone="info">With verification and QA</Badge>;
  if (view.review === 'returned') return <Badge tone="warning">Returned for correction</Badge>;
  return view.clientDone ? (
    <Badge tone="success">Client has confirmed</Badge>
  ) : (
    <Badge tone="neutral">Waiting for the client</Badge>
  );
}

function primaryAction(
  view: CustomerDisplayView,
  next: JourneyStep | undefined,
  show: (step: JourneyStep) => void,
  run: (name: string) => void,
): PrimaryAction | null {
  const missing = (view.data.checklist ?? []).some((item) => !item.done);
  switch (view.step) {
    case 'documents':
      return missing
        ? { label: 'Print what to bring', run: () => run('print-checklist') }
        : { label: 'Issue queue ticket', run: () => show('ticket') };
    case 'ticket':
      return { label: 'Done, next arrival', run: () => run('close-reception') };
    case 'documents-captured':
      return view.review === 'pending'
        ? {
            label: 'Route to QA',
            disabled: true,
            waiting: 'Waiting for verification and QA',
            run: () => undefined,
          }
        : { label: 'Route to QA', run: () => run('route-to-qa') };
    case 'biometrics':
      return {
        label: 'Start checkout',
        disabled: Boolean(view.data.biometrics?.issue),
        waiting: view.data.biometrics?.issue ? 'Finish the capture first' : undefined,
        run: () => show('payment'),
      };
    case 'payment':
      return {
        label: 'Give the receipt',
        disabled: view.data.invoice?.state !== 'confirmed',
        waiting: view.data.invoice?.state === 'confirmed' ? undefined : 'Waiting for the payment',
        run: () => show('payment-confirmed'),
      };
    case 'submitted':
      return view.clientDone
        ? { label: 'Case submitted, call next', run: () => run('close-case') }
        : { label: 'Submit to the authority', run: () => run('submit') };
    case 'feedback':
      return { label: 'Close the case', run: () => run('close-case') };
    default:
      return next ? { label: journeySteps[next].staffTitle, run: () => show(next) } : null;
  }
}
