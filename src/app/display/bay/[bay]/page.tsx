import { BayDisplay } from '@/components/features/displays/BayDisplay';

export default async function BayDisplayPage({ params }: PageProps<'/display/bay/[bay]'>) {
  const { bay } = await params;
  return <BayDisplay bay={decodeURIComponent(bay)} />;
}
