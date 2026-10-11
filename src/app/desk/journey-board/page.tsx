import type { Metadata } from 'next';
import { RegisterPage } from '@/components/features/register-page';
import { journeyBoardPage } from '@/config/pages/desk';

export const metadata: Metadata = { title: 'Journey Board' };

export default function Page() {
  return <RegisterPage definition={journeyBoardPage} />;
}
