import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CustomerScreen } from '@/components/features/journey/CustomerScreen';
import { JOURNEY_STEPS, type JourneyStep } from '@/types/journey';

export const metadata: Metadata = { title: 'Hub' };

export function generateStaticParams() {
  return JOURNEY_STEPS.map((step) => ({ step }));
}

export const dynamicParams = false;

export default async function HubStepPage({ params }: PageProps<'/hub/[step]'>) {
  const { step } = await params;
  if (!JOURNEY_STEPS.includes(step as JourneyStep)) notFound();
  return <CustomerScreen step={step as JourneyStep} />;
}
