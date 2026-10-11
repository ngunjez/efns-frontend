import type { Metadata } from 'next';
import { ApplicationView } from '@/components/features/application/ApplicationView';

export const metadata: Metadata = { title: 'My application', robots: { index: false } };

export default function MyApplicationPage() {
  return <ApplicationView />;
}
