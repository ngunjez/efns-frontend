'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Download } from 'lucide-react';
import {
  useBookAppointment,
  useHubs,
  useServices,
  useSlots,
  type Booking,
} from '@/api/hooks/use-catalogue';
import { useClientSession } from '@/api/hooks/use-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckItem } from '@/components/common/CheckItem';
import { FormField } from '@/components/common/FormField';
import { PageIntro } from '@/components/common/PageIntro';
import { TimeSlotPicker } from '@/components/common/TimeSlotPicker';
import { formatDate } from '@/lib/format';

const today = () => new Date().toISOString().slice(0, 10);

/** Frames 98–99: a signed-in client picks a date and time, then gets a booking code. */
export function BookAppointment() {
  const t = useTranslations('booking');
  const landing = useTranslations('landing');
  const common = useTranslations('common');
  const params = useSearchParams();
  const session = useClientSession();
  const services = useServices();
  const hubs = useHubs();
  const [serviceId, setServiceId] = useState(params.get('service') ?? undefined);
  const [hubId, setHubId] = useState(params.get('hub') ?? undefined);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState<string>();
  const slots = useSlots({ serviceId, hubId, date });
  const book = useBookAppointment();
  const [booking, setBooking] = useState<Booking | null>(null);

  if (session.isPending) return <Skeleton className="container-narrow my-section h-96" />;

  if (!session.data) {
    return (
      <div className="container-narrow grid max-w-lg gap-6 py-section">
        <PageIntro title={t('title')} body={t('body')} />
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={{ pathname: '/create-account', query: Object.fromEntries(params) }}>
              {common('createAccount')}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/sign-in">{common('signIn')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (booking) {
    return (
      <div className="container-narrow grid gap-6 py-section">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-10 shrink-0 fill-success text-white" aria-hidden />
          <PageIntro title={t('bookedTitle')} />
        </div>
        <p className="text-lead text-muted-foreground">{t('bookedBody')}</p>
        <Card className="grid gap-6 p-6 sm:grid-cols-2">
          <div className="grid content-start gap-1 rounded-card bg-primary-tint p-5 text-center">
            <span className="text-sm text-muted-foreground">{t('code')}</span>
            <span className="text-ticket font-bold text-primary tabular">{booking.code}</span>
            <span className="text-sm">
              {t('summary', {
                service: booking.service,
                hub: booking.hub,
                date: formatDate(booking.date),
                time: booking.time,
              })}
            </span>
          </div>
          <div className="grid content-start gap-2">
            <h2 className="font-semibold">{t('bring')}</h2>
            <ul>
              {booking.documents.map((document) => (
                <CheckItem key={document} label={document} state="pending" />
              ))}
            </ul>
          </div>
        </Card>
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" size="lg" onClick={() => window.print()}>
            <Download aria-hidden /> {t('download')}
          </Button>
          <Button asChild size="lg">
            <Link href="/my-application">{common('done')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow grid gap-6 py-section">
      <PageIntro title={t('title')} body={t('body')} />
      <Card className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <FormField label={landing('serviceLabel')} required>
          {(control) => (
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger {...control}>
                <SelectValue placeholder={landing('servicePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {services.data?.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
        <FormField label={landing('hubLabel')} required>
          {(control) => (
            <Select value={hubId} onValueChange={setHubId}>
              <SelectTrigger {...control}>
                <SelectValue placeholder={landing('hubPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {hubs.data?.map((hub) => (
                  <SelectItem key={hub.id} value={hub.id}>
                    {hub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
        <FormField label={t('date')} required className="sm:col-span-2">
          {(control) => (
            <Input
              {...control}
              type="date"
              min={today()}
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setTime(undefined);
              }}
            />
          )}
        </FormField>
        <fieldset className="grid gap-2 sm:col-span-2">
          <legend className="mb-2 text-[0.9375rem] font-semibold">{t('time')}</legend>
          {slots.isFetching ? (
            <Skeleton className="h-24" />
          ) : slots.data && slots.data.some((slot) => slot.available) ? (
            <TimeSlotPicker
              slots={slots.data}
              value={time}
              onValueChange={setTime}
              label={t('chooseTime')}
              fullLabel={(slot) => t('full', { time: slot })}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {serviceId && hubId ? t('noTimes') : t('chooseTime')}
            </p>
          )}
        </fieldset>
      </Card>
      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!serviceId || !hubId || !time}
          loading={book.isPending}
          onClick={() =>
            serviceId &&
            hubId &&
            time &&
            book.mutate({ serviceId, hubId, date, time }, { onSuccess: setBooking })
          }
        >
          {t('book')}
        </Button>
      </div>
    </div>
  );
}
