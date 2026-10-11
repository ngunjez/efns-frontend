'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useHubs, useServices } from '@/api/hooks/use-catalogue';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField } from '@/components/common/FormField';

/** Hero booking card (frame 90): choose a service and a hub, then see times. */
export function BookingWidget() {
  const t = useTranslations('landing');
  const router = useRouter();
  const services = useServices();
  const hubs = useHubs();
  const [serviceId, setServiceId] = useState<string>();
  const [hubId, setHubId] = useState<string>();

  return (
    <Card className="grid w-full gap-4 rounded-panel p-6 sm:p-7 lg:w-md">
      <h2 className="text-h3">{t('bookTitle')}</h2>
      <FormField label={t('serviceLabel')}>
        {(control) => (
          <Select value={serviceId} onValueChange={setServiceId}>
            <SelectTrigger {...control} className="h-13 text-[1.0625rem]">
              <SelectValue placeholder={t('servicePlaceholder')} />
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
      <FormField label={t('hubLabel')}>
        {(control) => (
          <Select value={hubId} onValueChange={setHubId}>
            <SelectTrigger {...control} className="h-13 text-[1.0625rem]">
              <SelectValue placeholder={t('hubPlaceholder')} />
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
      <Button
        size="lg"
        className="w-full"
        disabled={!serviceId || !hubId}
        onClick={() => router.push(`/book?service=${serviceId}&hub=${hubId}`)}
      >
        {t('seeTimes')}
      </Button>
    </Card>
  );
}
