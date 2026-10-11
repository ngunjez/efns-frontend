'use client';

import { usePathname } from 'next/navigation';
import { deskNavigation } from '@/config/navigation';
import { useAppSelector } from '@/store/hooks';

/** Top-bar title for the Service Desk: the station name, prefixed with the bay where there is one. */
export function DeskTitle() {
  const pathname = usePathname();
  const station = useAppSelector((state) => state.auth.user?.station);
  const item = deskNavigation
    .flatMap((section) => section.items)
    .find((entry) => entry.href && pathname.startsWith(entry.href));
  const title = item?.title ?? 'Service Desk';
  const prefixed = item?.href === '/desk/service-point' && station ? `${station}, ${title}` : title;
  return <p className="truncate font-semibold">{prefixed}</p>;
}
