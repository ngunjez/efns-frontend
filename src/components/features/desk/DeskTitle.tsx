'use client';

import { usePathname } from 'next/navigation';
import { titleForPath } from '@/config/navigation';
import { useAppSelector } from '@/store/hooks';

export function DeskTitle() {
  const pathname = usePathname();
  const station = useAppSelector((state) => state.auth.user?.station);
  const title = titleForPath(pathname) ?? 'Service Desk';
  const atBay = pathname.startsWith('/desk/service-point') && station;
  return <p className="truncate font-semibold">{atBay ? `${station}, ${title}` : title}</p>;
}
