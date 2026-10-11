import { Avatar } from '@/components/ui/avatar';
import { LanguageSwitch } from '@/components/common/LanguageSwitch';
import { Logo } from '@/components/common/Logo';

/**
 * Header of the client-facing hub screens (welcome tablet, customer display):
 * the hub's name, the client being served and the language switch.
 */
export function HubScreenHeader({
  hubName,
  subtitle,
  client,
  end,
}: {
  hubName: string;
  subtitle?: string;
  client?: { name: string; reference: string };
  end?: React.ReactNode;
}) {
  return (
    <header className="border-b bg-card">
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-gutter py-3 sm:min-h-20">
        <Logo name={hubName} subtitle={subtitle} />
        <div className="flex items-center gap-4">
          {client && (
            <span className="flex items-center gap-2.5">
              <Avatar name={client.name} />
              <span className="grid leading-tight">
                <span className="text-sm font-semibold">{client.name}</span>
                <span className="text-xs text-muted-foreground">{client.reference}</span>
              </span>
            </span>
          )}
          {end}
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
}
