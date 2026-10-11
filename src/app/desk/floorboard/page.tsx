import type { Metadata } from 'next';
import { Floorboard } from '@/components/features/desk/Floorboard';

export const metadata: Metadata = { title: 'Floorboard' };

export default function Page() {
  return <Floorboard />;
}
