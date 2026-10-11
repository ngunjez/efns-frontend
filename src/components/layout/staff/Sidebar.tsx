'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import type { NavItem, NavSection } from '@/config/navigation';
import { cn } from '@/lib/utils';

const isActive = (pathname: string, href?: string) =>
  Boolean(href && (pathname === href || pathname.startsWith(`${href}/`)));

/** Brand card, permission-filtered navigation and a footer card (bottom-left in every staff design). */
export function Sidebar({
  brand,
  sections,
  footer,
  onNavigate,
}: {
  brand: string;
  sections: NavSection[];
  footer?: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-5 bg-sidebar p-4">
      <div className="rounded-card border px-3 py-2.5">
        <Logo name={brand} size="sm" />
      </div>
      <nav aria-label="Main" className="grid flex-1 content-start gap-5 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label} className="grid gap-1">
            <p className="px-2 pb-1 text-[0.6875rem] font-semibold tracking-wider text-muted-foreground uppercase">
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavEntry key={item.title} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </nav>
      {footer}
    </div>
  );
}

const itemClasses =
  'flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-[0.9375rem] font-medium transition-colors';

function NavEntry({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const childActive = item.children?.some((child) => isActive(pathname, child.href)) ?? false;
  const [open, setOpen] = useState(childActive);
  const Icon = item.icon;

  if (!item.children) {
    const active = isActive(pathname, item.href);
    return (
      <Link
        href={item.href!}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={cn(
          itemClasses,
          active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
        )}
      >
        <Icon className="size-[1.125rem]" aria-hidden />
        {item.title}
      </Link>
    );
  }

  const expanded = open || childActive;
  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setOpen(!expanded)}
        className={cn(
          itemClasses,
          childActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
        )}
      >
        <Icon className="size-[1.125rem]" aria-hidden />
        <span className="flex-1 text-left">{item.title}</span>
        {expanded ? (
          <ChevronDown className="size-4" aria-hidden />
        ) : (
          <ChevronRight className="size-4" aria-hidden />
        )}
      </button>
      {expanded && (
        <ul className="mt-1 ml-5 grid border-l">
          {item.children.map((child) => {
            const active = isActive(pathname, child.href);
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    '-ml-px block border-l-2 py-2 pl-4 text-sm transition-colors',
                    active
                      ? 'border-primary font-medium text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )}
                >
                  {child.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
