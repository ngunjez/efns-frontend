'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { adminNavigation, filterNavigation, type NavLink } from '@/config/navigation';
import { useAppSelector } from '@/store/hooks';

export function AdminSearch() {
  const router = useRouter();
  const permissions = useAppSelector((state) => state.auth.user?.permissions ?? []);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const pages = useMemo(
    () =>
      filterNavigation(adminNavigation, permissions).flatMap((section) =>
        section.items.flatMap((item) =>
          (item.children ?? [item as NavLink]).map((link) => ({
            ...link,
            section: item.children ? item.title : section.label,
          })),
        ),
      ),
    [permissions],
  );
  const term = query.trim().toLowerCase();
  const results = term
    ? pages
        .filter((page) => `${page.title} ${page.section}`.toLowerCase().includes(term))
        .slice(0, 8)
    : [];

  const go = (href: NavLink['href']) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <Popover open={open && results.length > 0} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <label className="relative block max-w-xs">
          <span className="sr-only">Search pages</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            role="combobox"
            aria-expanded={open && results.length > 0}
            aria-controls="admin-search-results"
            value={query}
            placeholder="Search"
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && results[0]) go(results[0].href);
            }}
            className="h-10 w-full rounded-field border bg-card pr-3 pl-9 text-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none"
          />
        </label>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) min-w-64 p-1"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <ul id="admin-search-results" role="listbox" aria-label="Pages">
          {results.map((page) => (
            <li key={page.href} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => go(page.href)}
                className="grid w-full rounded-control px-3 py-2 text-left hover:bg-muted"
              >
                <span className="text-sm font-medium">{page.title}</span>
                <span className="text-xs text-muted-foreground">{page.section}</span>
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
