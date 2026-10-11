import type { Metadata } from 'next';
import { ApplicationView } from '@/components/features/application/ApplicationView';

export const metadata: Metadata = { title: 'Track your application', robots: { index: false } };

/** Frame 88's tracking link: lets a walk-in with no account follow their case. */
export default async function TrackPage({ params }: PageProps<'/track/[reference]'>) {
  const { reference } = await params;
  return <ApplicationView reference={decodeURIComponent(reference)} />;
}
