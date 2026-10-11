import type { Metadata } from 'next';
import { Workbench } from '@/components/features/desk/Workbench';

export const metadata: Metadata = { title: 'Workbench' };

export default function Page() {
  return <Workbench />;
}
