import type { Metadata } from 'next';
import { FloorHost } from '@/components/features/desk/FloorHost';

export const metadata: Metadata = { title: 'Floor Host' };

export default function Page() {
  return <FloorHost />;
}
