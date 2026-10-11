import type { Metadata } from 'next';
import { SignInForm } from '@/components/features/account/SignInForm';

export const metadata: Metadata = { title: 'Sign in' };

export default function SignInPage() {
  return <SignInForm />;
}
