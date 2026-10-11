import type { Metadata } from 'next';
import { SignInPrivacySettings } from '@/components/features/settings/SignInPrivacySettings';

export const metadata: Metadata = { title: 'Sign-in and privacy' };

export default function Page() {
  return <SignInPrivacySettings />;
}
