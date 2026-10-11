import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AuthCard } from '@/components/layout/staff/AuthCard';

export default function NotFound() {
  return (
    <AuthCard
      title="Page not found"
      description="The page you asked for does not exist or has moved."
    >
      <Button asChild>
        <Link href="/">Go to the home page</Link>
      </Button>
    </AuthCard>
  );
}
