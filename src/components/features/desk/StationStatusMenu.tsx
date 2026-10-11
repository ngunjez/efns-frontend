'use client';

import { ChevronDown } from 'lucide-react';
import { useSetStationStatus, useStation } from '@/api/hooks/use-desk';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PERMISSIONS } from '@/config/permissions';
import { useElapsedSeconds } from '@/hooks/use-elapsed-seconds';
import { useHasPermission } from '@/hooks/use-has-permission';
import { formatDuration } from '@/lib/format';
import { cn } from '@/lib/utils';

const dot = {
  info: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
  neutral: 'bg-muted-foreground',
} as const;

/** Frame 20: the bay officer's own status, visible to the supervisor on the floorboard. */
export function StationStatusMenu() {
  const canServe = useHasPermission(PERMISSIONS.servicePoint);
  if (!canServe) return null;
  return <StatusMenu />;
}

function StatusMenu() {
  const { data: station } = useStation();
  const setStatus = useSetStationStatus();
  const elapsed = useElapsedSeconds(station?.serving?.calledAt);
  if (!station) return null;

  const label = station.serving
    ? `${station.status.label} ${station.serving.ticket}, ${formatDuration(elapsed)}`
    : station.status.label;
  const groups = (['status', 'break', 'end'] as const).map((group) =>
    station.statusOptions.filter((option) => option.group === group),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden items-center gap-2 rounded-field border px-3 py-2 text-sm font-semibold hover:bg-muted sm:flex">
        <span aria-hidden className={cn('size-2 rounded-full', dot[station.status.tone])} />
        <span className="tabular">{label}</span>
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>My status</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={station.status.key}
          onValueChange={(value) => setStatus.mutate(value)}
        >
          {groups.map((options, index) => (
            <div key={index}>
              {index > 0 && <DropdownMenuSeparator />}
              {options.map((option) => (
                <DropdownMenuRadioItem
                  key={option.key}
                  value={option.key}
                  className={cn(
                    'justify-between',
                    option.group === 'end' && 'text-destructive-foreground',
                  )}
                >
                  <span>{option.label}</span>
                  {option.hint && (
                    <span className="text-xs text-muted-foreground">{option.hint}</span>
                  )}
                </DropdownMenuRadioItem>
              ))}
            </div>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <p className="px-3 py-2 text-xs text-muted-foreground">
          Your supervisor sees your status and timer on the floorboard.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
