import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { SummaryCard as SummaryCardData } from '@/types/register';
import { IconTile } from './IconTile';
import { KpiStat } from './KpiStat';

export function SummaryCard({ card }: { card: SummaryCardData }) {
  return (
    <Card className="flex flex-col justify-between gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <KpiStat kpi={card} size="lg" />
        <IconTile icon={BarChart3} className="size-8" />
      </div>
      {card.href && (
        <Button asChild variant="outline" size="sm" className="self-start">
          <Link href={card.href as Route}>
            See Report <ArrowRight className="rtl:rotate-180" aria-hidden />
          </Link>
        </Button>
      )}
    </Card>
  );
}
