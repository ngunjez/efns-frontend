'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FileText, LogIn, Upload } from 'lucide-react';
import {
  useApplication,
  useClientSession,
  useMyAppointment,
  useUploadRequestedDocument,
} from '@/api/hooks/use-client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState, ErrorState } from '@/components/common/QueryState';
import { PageIntro } from '@/components/common/PageIntro';
import { StageProgress } from '@/components/common/StageProgress';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Timeline } from '@/components/common/Timeline';
import { Reveal } from '@/components/motion/Reveal';
import { site } from '@/config/site';
import { formatDate } from '@/lib/format';
import type { ApplicationSummary } from '@/types/domain';

export function ApplicationView({ reference }: { reference?: string }) {
  const t = useTranslations('application');
  const session = useClientSession();
  const ownPage = !reference;
  const signedIn = Boolean(session.data);
  const query = useApplication(reference, !ownPage || signedIn);

  if (ownPage && session.isPending) return <PageSkeleton />;
  if (ownPage && !signedIn) {
    return (
      <div className="container-narrow py-section">
        <CenteredCard
          icon={<LogIn className="size-5" aria-hidden />}
          title={t('signInTitle')}
          body={t('signInBody')}
        >
          <Button asChild size="lg">
            <Link href={{ pathname: '/sign-in', query: { next: '/my-application' } }}>
              {t('signInAction')}
            </Link>
          </Button>
        </CenteredCard>
      </div>
    );
  }
  if (query.isPending) return <PageSkeleton />;
  if (query.isError) {
    return query.error.status === 404 ? (
      <EmptyState
        title={t('notFoundTitle')}
        detail={t('notFoundBody', { phone: site.supportPhone })}
        className="py-section"
      />
    ) : (
      <ErrorState error={query.error} onRetry={() => query.refetch()} className="py-section" />
    );
  }

  const application = query.data;
  if (!application) return <NothingSubmitted />;

  return (
    <>
      <div className="border-b bg-card py-4">
        <StageProgress stage={application.stage} className="container-page" />
      </div>
      <Reveal className="container-page grid gap-6 py-section">
        {application.documentRequest ? (
          <DocumentRequest application={application} />
        ) : (
          <Overview application={application} />
        )}
      </Reveal>
    </>
  );
}

function NothingSubmitted() {
  const t = useTranslations('application');
  const booking = useTranslations('booking');
  const appointment = useMyAppointment();

  return (
    <div className="container-narrow grid gap-5 py-section">
      <CenteredCard
        icon={<FileText className="size-5" aria-hidden />}
        title={t('noneTitle')}
        body={t('noneBody')}
      >
        {!appointment.data && (
          <Button asChild size="lg">
            <Link href="/book">{t('book')}</Link>
          </Button>
        )}
      </CenteredCard>
      {appointment.isPending ? (
        <Skeleton className="h-36 rounded-card" />
      ) : (
        appointment.data && (
          <Reveal delay={0.1}>
            <Card className="grid gap-4 p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
              <div className="grid gap-0.5 rounded-card bg-primary-tint px-6 py-4 text-center">
                <span className="text-xs text-muted-foreground">{booking('code')}</span>
                <span className="text-2xl font-bold text-primary tabular">
                  {appointment.data.code}
                </span>
              </div>
              <div className="grid gap-1">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {t('upcoming')}
                </span>
                <span className="text-lg font-semibold">{appointment.data.service}</span>
                <span className="text-sm text-muted-foreground">
                  {appointment.data.hub}, {formatDate(appointment.data.date)},{' '}
                  {appointment.data.time}
                </span>
              </div>
            </Card>
          </Reveal>
        )
      )}
    </div>
  );
}

function CenteredCard({
  icon,
  title,
  body,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <Reveal>
      <Card className="grid justify-items-center gap-4 p-8 text-center">
        <span className="grid size-12 place-items-center rounded-control bg-primary-tint text-primary">
          {icon}
        </span>
        <h1 className="text-h3">{title}</h1>
        <p className="max-w-md text-muted-foreground">{body}</p>
        {children}
      </Card>
    </Reveal>
  );
}

function PageSkeleton() {
  return (
    <div className="container-page grid gap-5 py-section" aria-busy aria-label="Loading">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-5 w-96 max-w-full" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Skeleton className="h-80 rounded-card" />
        <div className="grid gap-5">
          <Skeleton className="h-24 rounded-card" />
          <Skeleton className="h-24 rounded-card" />
        </div>
      </div>
    </div>
  );
}

function Overview({ application }: { application: ApplicationSummary }) {
  const t = useTranslations('application');
  return (
    <>
      <PageIntro
        title={t('title')}
        body={t('subtitle', { service: application.service, reference: application.reference })}
      />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>{`${application.service}, ${application.clientName}`}</CardTitle>
            <StatusBadge status={application.status} />
          </CardHeader>
          <CardContent className="pt-2">
            <Timeline steps={application.timeline} />
          </CardContent>
        </Card>
        <div className="grid gap-5">
          <SideCard title={t('documentsRequested')}>{t('nothingNeeded')}</SideCard>
          {application.passport && (
            <SideCard title={t('passport')}>{application.passport}</SideCard>
          )}
          <SideCard title={t('hubSupport')}>
            <a
              href={`tel:${application.hubSupport.phone.replace(/\s/g, '')}`}
              className="block hover:text-primary"
            >
              {application.hubSupport.phone}
            </a>
            <a
              href={`mailto:${application.hubSupport.email}`}
              className="block break-all hover:text-primary"
            >
              {application.hubSupport.email}
            </a>
          </SideCard>
        </div>
      </div>
    </>
  );
}

function DocumentRequest({ application }: { application: ApplicationSummary }) {
  const t = useTranslations('application');
  const request = application.documentRequest!;
  const input = useRef<HTMLInputElement>(null);
  const upload = useUploadRequestedDocument(application.reference);

  return (
    <>
      <PageIntro title={t('docNeededTitle')} body={t('docNeededBody')} />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="grid gap-5">
          <Card className="grid gap-2 border-2 border-warning p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="text-h3">{request.title}</h2>
              <Badge tone="warning">{t('sendBy', { date: request.dueBy })}</Badge>
            </div>
            <p className="text-muted-foreground">{request.detail}</p>
          </Card>
          <Card className="p-5">
            <label className="grid cursor-pointer place-items-center gap-2 rounded-field border-2 border-dashed border-input p-8 text-center focus-within:border-primary hover:border-primary">
              <Upload className="size-6 text-primary" aria-hidden />
              <span className="font-semibold">{t('uploadHint')}</span>
              <span className="text-sm text-muted-foreground">{t('uploadAlt')}</span>
              <input
                ref={input}
                type="file"
                accept="image/*,application/pdf"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) upload.mutate(file);
                }}
              />
            </label>
            {upload.isSuccess && (
              <p role="status" className="mt-3 text-sm text-success-foreground">
                {t('uploaded')}
              </p>
            )}
          </Card>
        </div>
        <SideCard title={t('hubSupport')}>
          {application.hubSupport.phone}
          <br />
          {application.hubSupport.email}
        </SideCard>
      </div>
      <div className="flex justify-end">
        <Button size="lg" loading={upload.isPending} onClick={() => input.current?.click()}>
          {t('upload')}
        </Button>
      </div>
    </>
  );
}

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="grid gap-1.5 p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="text-muted-foreground">{children}</div>
    </Card>
  );
}
