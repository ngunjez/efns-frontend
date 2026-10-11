import type { Metadata } from 'next';
import { ApplicationView } from '@/components/features/application/ApplicationView';

export const metadata: Metadata = { title: 'Track your application', robots: { index: false } };

export default async function TrackPage({ params }: PageProps<'/track/[reference]'>) {
  const { reference } = await params;
  return <ApplicationView reference={decodeURIComponent(reference)} />;
}
