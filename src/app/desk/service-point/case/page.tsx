import type { Metadata } from 'next';
import { CaseConsole } from '@/components/features/desk/case/CaseConsole';

export const metadata: Metadata = { title: 'Case' };

export default async function CasePage({ searchParams }: PageProps<'/desk/service-point/case'>) {
  const { flow } = await searchParams;
  return <CaseConsole flow={flow === 'collection' ? 'collection' : 'filing'} />;
}
