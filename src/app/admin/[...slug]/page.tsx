import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RegisterPage } from '@/components/features/register-page';
import { adminPages } from '@/config/pages/admin';

export function generateStaticParams() {
  return Object.keys(adminPages).map((path) => ({ slug: path.split('/') }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<'/admin/[...slug]'>): Promise<Metadata> {
  const { slug } = await params;
  return { title: adminPages[slug.join('/')]?.title };
}

export default async function AdminRegisterRoute({ params }: PageProps<'/admin/[...slug]'>) {
  const { slug } = await params;
  const definition = adminPages[slug.join('/')];
  if (!definition) notFound();
  return <RegisterPage definition={definition} />;
}
