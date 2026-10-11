'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useServices } from '@/api/hooks/use-catalogue';
import { Card } from '@/components/ui/card';
import { DefinitionList } from '@/components/common/DefinitionList';
import { IconTile } from '@/components/common/IconTile';
import { QueryState } from '@/components/common/QueryState';
import { Skeleton } from '@/components/ui/skeleton';
import { StaggerItem, StaggerList } from '@/components/motion/Stagger';
import { iconFor } from '@/config/icons';
import { formatMoney } from '@/lib/format';

export function ServiceGrid() {
  const t = useTranslations('landing');
  const query = useServices();

  return (
    <QueryState
      query={query}
      loading={
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-64 rounded-card" />
          ))}
        </div>
      }
    >
      {(services) => (
        <StaggerList inView className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <Card className="flex h-full flex-col gap-4 p-5 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <IconTile icon={iconFor(service.icon)} className="size-10" />
                <div className="grid gap-0.5 border-b pb-3">
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.summary}</p>
                </div>
                <DefinitionList
                  dense
                  className="divide-y-0"
                  rows={[
                    { label: t('governmentFee'), value: formatMoney(service.governmentFee) },
                    { label: t('serviceCharge'), value: formatMoney(service.serviceCharge) },
                    { label: t('usuallyTakes'), value: service.turnaround },
                  ]}
                />
                <Link
                  href={`/book?service=${service.id}`}
                  className="mt-auto text-sm font-semibold text-primary hover:underline"
                >
                  {t('bookService')}
                  <span className="sr-only">: {service.name}</span>
                </Link>
              </Card>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </QueryState>
  );
}
