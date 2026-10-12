'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Lock,
  MessageSquare,
  Printer,
  ScanLine,
  ShieldCheck,
  Smartphone,
  WifiOff,
} from 'lucide-react';
import { useCaseCommand } from '@/api/hooks/use-desk';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CheckItem } from '@/components/common/CheckItem';
import { DefinitionList } from '@/components/common/DefinitionList';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatMoney } from '@/lib/format';
import type { CustomerDisplayView } from '@/types/journey';
import { DocumentProblemDialog } from './DocumentProblemDialog';
import { OverrideDialog } from './OverrideDialog';

const paymentTone = { awaiting: 'warning', verifying: 'info', confirmed: 'success' } as const;

export function StepTools({ view }: { view: CustomerDisplayView }) {
  const command = useCaseCommand();
  const [problemOpen, setProblemOpen] = useState(false);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const run = (name: string, payload?: Record<string, unknown>) =>
    command.mutate({ name, payload });
  const busy = (name: string) => command.isPending && command.variables?.name === name;
  const { data } = view;

  switch (view.step) {
    case 'documents':
      return (
        <div className="grid gap-3">
          <p className="text-sm text-muted-foreground">
            Tick each document you have seen. Anything left unticked is shown to the client as
            missing.
          </p>
          <ul className="divide-y rounded-field border">
            {(data.checklist ?? []).map((item) => (
              <li key={item.label} className="flex items-center justify-between gap-4 px-4 py-3">
                <label htmlFor={`doc-${item.label}`} className="text-sm font-medium">
                  {item.label}
                </label>
                <Switch
                  id={`doc-${item.label}`}
                  checked={item.done}
                  onCheckedChange={(done) => run('checklist', { label: item.label, done })}
                />
              </li>
            ))}
          </ul>
        </div>
      );
    case 'ticket':
      return (
        <div className="grid gap-4">
          {data.ticket && (
            <DefinitionList
              dense
              rows={[
                { label: 'Ticket', value: data.ticket.number },
                { label: 'Queue', value: data.ticket.queue },
                { label: 'People ahead', value: data.ticket.ahead },
                { label: 'Estimated wait', value: data.ticket.estimate },
              ]}
            />
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              loading={busy('print-ticket')}
              onClick={() => run('print-ticket')}
            >
              <Printer aria-hidden /> Print ticket
            </Button>
            <Button
              variant="outline"
              loading={busy('sms-ticket')}
              onClick={() => run('sms-ticket')}
            >
              <Smartphone aria-hidden /> Send by SMS
            </Button>
          </div>
        </div>
      );
    case 'check-details':
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {(data.details ?? []).map((section) => (
            <div key={section.title} className="grid content-start gap-1 rounded-field border p-4">
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <DefinitionList dense rows={section.rows} />
            </div>
          ))}
        </div>
      );
    case 'consent':
      return (
        <p className="text-sm text-muted-foreground">
          Explain the consent in the client&apos;s language. The step completes when they tick and
          sign on the pad.
        </p>
      );
    case 'documents-captured':
      return (
        <div className="grid gap-4">
          <ul className="divide-y rounded-field border px-4">
            {(data.documents ?? []).map((document) => (
              <CheckItem
                key={document.label}
                label={document.label}
                trailing={<StatusBadge status={document.status} />}
              />
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              loading={busy('scan-passport')}
              onClick={() => run('scan-passport')}
            >
              <ScanLine aria-hidden /> Scan passport
            </Button>
            <Button variant="warning" onClick={() => setProblemOpen(true)}>
              <AlertTriangle aria-hidden /> Flag a passport or document problem
            </Button>
          </div>
          <DocumentProblemDialog
            open={problemOpen}
            onOpenChange={setProblemOpen}
            officer={view.officer}
            documents={[
              `Passport ${data.passport?.rows.find((row) => row.label === 'Number')?.value ?? ''}`.trim(),
              ...(data.documents ?? []).map((document) => document.label),
            ]}
          />
        </div>
      );
    case 'biometrics': {
      const bio = data.biometrics;
      if (!bio) return null;
      return (
        <div className="grid gap-4">
          <DefinitionList
            dense
            rows={[
              { label: 'Fingerprints', value: bio.captured },
              { label: 'Face photo', value: <StatusBadge status={bio.photo} /> },
              ...(bio.issue ? [{ label: 'Needs attention', value: bio.issue.finger }] : []),
            ]}
          />
          <div className="flex flex-wrap gap-2">
            {bio.issue && !bio.attempts && (
              <Button loading={busy('retake')} onClick={() => run('retake')}>
                Retake the finger
              </Button>
            )}
            {bio.attempts && (
              <Button variant="warning" onClick={() => setOverrideOpen(true)}>
                <ShieldCheck aria-hidden /> Ask the Hub Manager to override
              </Button>
            )}
          </div>
          {bio.attempts && (
            <OverrideDialog open={overrideOpen} onOpenChange={setOverrideOpen} biometrics={bio} />
          )}
        </div>
      );
    }
    case 'payment': {
      const invoice = data.invoice;
      if (!invoice) return null;
      return (
        <div className="grid gap-4">
          <DefinitionList
            dense
            rows={[
              { label: 'Total, one payment', value: formatMoney(invoice.total) },
              { label: 'M-Pesa number', value: invoice.phone },
              {
                label: 'Payment',
                value: (
                  <Badge tone={paymentTone[invoice.state]}>
                    {invoice.state === 'awaiting'
                      ? 'Awaiting payment'
                      : invoice.state === 'verifying'
                        ? 'Verifying'
                        : 'Confirmed'}
                  </Badge>
                ),
              },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              loading={busy('request-payment')}
              disabled={invoice.state === 'confirmed'}
              onClick={() => run('request-payment')}
            >
              <Smartphone aria-hidden /> Send the M-Pesa prompt
            </Button>
            <Button
              variant="outline"
              loading={busy('go-offline')}
              disabled={invoice.state === 'confirmed'}
              onClick={() => run('go-offline')}
            >
              <WifiOff aria-hidden /> Record a provisional receipt
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Use the provisional receipt only when the government link is down. The payment syncs
            when it returns.
          </p>
        </div>
      );
    }
    case 'lodgement':
      return (
        <div className="grid gap-4">
          {data.lodgement && <DefinitionList dense rows={data.lodgement.rows} />}
          <Button
            className="justify-self-start"
            loading={busy('vault-check-in')}
            onClick={() => run('vault-check-in')}
          >
            <Lock aria-hidden /> Hand the passport to the vault custodian
          </Button>
        </div>
      );
    case 'submitted':
      return data.acknowledgement ? (
        <DefinitionList dense rows={data.acknowledgement.rows} />
      ) : null;
    case 'collection':
      return (
        <div className="grid gap-4">
          <ul className="divide-y rounded-field border px-4">
            {(data.collection?.checks ?? []).map((check) => (
              <CheckItem key={check} label={check} />
            ))}
          </ul>
          <Button
            variant="outline"
            className="justify-self-start"
            loading={busy('request-release')}
            onClick={() => run('request-release')}
          >
            <Lock aria-hidden /> Ask the vault custodian to release it
          </Button>
        </div>
      );
    case 'feedback':
      return (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="size-4" aria-hidden /> The client rates the visit on their
          screen. Close the case when they finish.
        </p>
      );
    default:
      return null;
  }
}
