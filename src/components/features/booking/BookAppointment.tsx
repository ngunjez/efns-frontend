'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CalendarCheck, CheckCircle2, Download } from 'lucide-react';
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
import { DefinitionList } from '@/components/common/DefinitionList';
import { FormField } from '@/components/common/FormField';
import { PageIntro } from '@/components/common/PageIntro';
import { TimeSlotPicker } from '@/components/common/TimeSlotPicker';
import { Reveal } from '@/components/motion/Reveal';
import { useIntlLocale } from '@/hooks/use-intl-locale';
import { formatDate, formatMoney } from '@/lib/format';

const today = () => new Date().toISOString().slice(0, 10);

export function BookAppointment() {
  const session = useClientSession();
  const [booking, setBooking] = useState<Booking | null>(null);

  if (session.isPending) return <BookingSkeleton />;
  if (!session.data) return <SignInFirst />;
  if (booking) return <Booked booking={booking} />;
  return <BookingForm onBooked={setBooking} />;
}

function SignInFirst() {
  const t = useTranslations('booking');
  const common = useTranslations('common');
  const pathname = usePathname();
  const params = useSearchParams();
  const next = params.size ? `${pathname}?${params.toString()}` : pathname;

  return (
    <div className="container-narrow max-w-xl py-section">
      <Reveal>
        <Card className="grid justify-items-center gap-4 p-8 text-center">
          <span className="grid size-12 place-items-center rounded-control bg-primary-tint text-primary">
            <CalendarCheck className="size-5" aria-hidden />
          </span>
          <h1 className="text-h3">{t('title')}</h1>
          <p className="max-w-md text-muted-foreground">{t('accountNeeded')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href={{ pathname: '/create-account', query: { next } }}>
                {common('createAccount')}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={{ pathname: '/sign-in', query: { next } }}>{common('signIn')}</Link>
            </Button>
          </div>
        </Card>
      </Reveal>
    </div>
  );
}

function BookingForm({ onBooked }: { onBooked: (booking: Booking) => void }) {
  const t = useTranslations('booking');
  const landing = useTranslations('landing');
  const params = useSearchParams();
  const services = useServices();
  const hubs = useHubs();
  const [serviceId, setServiceId] = useState(params.get('service') ?? undefined);
  const [hubId, setHubId] = useState(params.get('hub') ?? undefined);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState<string>();
  const slots = useSlots({ serviceId, hubId, date });
  const book = useBookAppointment();
  const service = services.data?.find((item) => item.id === serviceId);

  const submit = () =>
    serviceId &&
    hubId &&
    time &&
    book.mutate({ serviceId, hubId, date, time }, { onSuccess: onBooked });

  return (
    <Reveal className="container-page grid gap-6 py-section">
      <PageIntro title={t('title')} body={t('body')} />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <FormField label={landing('serviceLabel')} required className="sm:col-span-2">
            {(control) => (
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger {...control}>
                  <SelectValue placeholder={landing('servicePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {services.data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
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
          <FormField label={t('date')} required>
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
              <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2">
                {Array.from({ length: 8 }, (_, index) => (
                  <Skeleton key={index} className="h-11" />
                ))}
              </div>
            ) : slots.data?.some((slot) => slot.available) ? (
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

        <div className="grid gap-5">
          <Card className="grid gap-2 p-5">
            <h2 className="font-semibold">{t('bring')}</h2>
            {service ? (
              <ul>
                {service.documents.map((document) => (
                  <CheckItem key={document} label={document} className="py-1 text-sm" />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('chooseService')}</p>
            )}
          </Card>
          {service && (
            <Reveal>
              <Card className="grid gap-2 p-5">
                <h2 className="font-semibold">{t('payAtHub')}</h2>
                <DefinitionList
                  dense
                  rows={[
                    { label: landing('governmentFee'), value: formatMoney(service.governmentFee) },
                    { label: landing('serviceCharge'), value: formatMoney(service.serviceCharge) },
                    {
                      label: t('onePayment'),
                      value: formatMoney(service.governmentFee + service.serviceCharge),
                    },
                  ]}
                />
                <p className="text-xs text-muted-foreground">{t('payNote')}</p>
              </Card>
            </Reveal>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!serviceId || !hubId || !time}
          loading={book.isPending}
          onClick={submit}
        >
          {t('book')}
        </Button>
      </div>
    </Reveal>
  );
}

function Booked({ booking }: { booking: Booking }) {
  const t = useTranslations('booking');
  const intl = useIntlLocale();
  const common = useTranslations('common');

  return (
    <Reveal className="container-narrow grid gap-5 py-section">
      <h1 className="flex items-center gap-3 text-h1">
        <CheckCircle2 className="size-[1.1em] shrink-0 fill-success text-white" aria-hidden />
        {t('bookedTitle')}
      </h1>
      <Card className="grid gap-5 p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
        <div className="grid gap-0.5 rounded-card bg-primary-tint px-6 py-4 text-center">
          <span className="text-xs text-muted-foreground">{t('code')}</span>
          <span className="text-ticket font-bold text-primary tabular">{booking.code}</span>
        </div>
        <div className="grid gap-1">
          <span className="text-lg font-semibold">{booking.service}</span>
          <span className="text-sm">{booking.hub}</span>
          <span className="text-sm">
            {formatDate(booking.date, intl)}, {booking.time}
          </span>
          {booking.email && (
            <span className="text-xs text-muted-foreground">
              {t('ticketEmailed', { email: booking.email })}
            </span>
          )}
        </div>
      </Card>
      <Card className="grid gap-2 p-5 sm:p-6">
        <h2 className="font-semibold">{t('onTheDay')}</h2>
        <ul>
          <CheckItem label={t('day1')} className="py-1 text-sm" />
          <CheckItem label={t('day2')} className="py-1 text-sm" />
          {booking.documents.length > 0 && (
            <CheckItem
              label={t('day3', { documents: booking.documents.join(', ') })}
              className="py-1 text-sm"
            />
          )}
        </ul>
      </Card>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <p className="me-auto max-w-sm text-xs text-muted-foreground">{t('keepCopy')}</p>
        <Button asChild size="lg" variant="outline">
          <Link href="/my-application">{common('done')}</Link>
        </Button>
        <Button size="lg" onClick={() => window.print()}>
          <Download aria-hidden /> {t('download')}
        </Button>
      </div>
    </Reveal>
  );
}

function BookingSkeleton() {
  return (
    <div className="container-page grid gap-6 py-section" aria-busy aria-label="Loading">
      <Skeleton className="h-10 w-80 max-w-full" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Skeleton className="h-96 rounded-card" />
        <Skeleton className="h-48 rounded-card" />
      </div>
    </div>
  );
}
