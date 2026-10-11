'use client';

import { useSaveSettings, useSettings } from '@/api/hooks/use-settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { LoadingBlock, QueryState } from '@/components/common/QueryState';

interface Channels extends Record<string, unknown> {
  sms: boolean;
  email: boolean;
  inApp: boolean;
  retries: number;
}

const CHANNELS = [
  { key: 'sms', label: 'SMS', hint: 'Clients and staff' },
  { key: 'email', label: 'Email', hint: 'Clients and staff' },
  { key: 'inApp', label: 'In-app', hint: 'Client portal and staff bell' },
] as const;

/** Frame 63: the channels messages may use, and how many times to retry before falling back. */
export default function NotificationChannels() {
  const query = useSettings<Channels>('notification-channels');
  const save = useSaveSettings('notification-channels');

  return (
    <Card>
      <CardHeader>
        <div className="grid gap-0.5">
          <CardTitle>Channels</CardTitle>
          <p className="text-xs text-muted-foreground">
            The channel the client prefers is tried first, then the rule&apos;s channel, then its
            fallback.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <QueryState query={query} loading={<LoadingBlock rows={3} className="p-0" />}>
          {(channels) => (
            <ul className="divide-y">
              {CHANNELS.map((channel) => (
                <li key={channel.key} className="flex items-center justify-between gap-4 py-3">
                  <span className="grid leading-tight">
                    <span className="text-sm font-semibold">{channel.label}</span>
                    <span className="text-xs text-muted-foreground">{channel.hint}</span>
                  </span>
                  <Switch
                    aria-label={channel.label}
                    checked={channels[channel.key]}
                    onCheckedChange={(on) => save.mutate({ ...channels, [channel.key]: on })}
                  />
                </li>
              ))}
              <li className="flex items-center justify-between gap-4 py-3">
                <span className="grid leading-tight">
                  <span className="text-sm font-semibold">Tries before fallback</span>
                  <span className="text-xs text-muted-foreground">On each channel</span>
                </span>
                <Select
                  value={String(channels.retries)}
                  onValueChange={(value) => save.mutate({ ...channels, retries: Number(value) })}
                >
                  <SelectTrigger aria-label="Tries before fallback" className="h-9 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((count) => (
                      <SelectItem key={count} value={String(count)}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
            </ul>
          )}
        </QueryState>
      </CardContent>
    </Card>
  );
}
