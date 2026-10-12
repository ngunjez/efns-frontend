'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  useAddSupportNote,
  useContactClient,
  useSupportCase,
  type ContactChannel,
} from '@/api/hooks/use-desk';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { DefinitionList } from '@/components/common/DefinitionList';
import { FormField } from '@/components/common/FormField';
import { LoadingBlock, QueryState } from '@/components/common/QueryState';
import { StatusBadge } from '@/components/common/StatusBadge';

const CHANNELS: { channel: ContactChannel; label: string }[] = [
  { channel: 'call', label: 'Call client' },
  { channel: 'whatsapp', label: 'WhatsApp' },
  { channel: 'sms', label: 'Send SMS' },
  { channel: 'email', label: 'Log email' },
];

export function ClientSupport({ caseId = 'current' }: { caseId?: string }) {
  const query = useSupportCase(caseId);
  const contact = useContactClient(caseId);
  const [noting, setNoting] = useState(false);

  return (
    <QueryState query={query} loading={<LoadingBlock rows={8} />}>
      {(view) => (
        <div className="grid items-start gap-5 lg:grid-cols-[18rem_minmax(0,1fr)] 2xl:grid-cols-[18rem_minmax(0,1fr)_18rem]">
          <div className="grid gap-5">
            <Card>
              <CardHeader>
                <CardTitle>Client</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={view.client.name} />
                  <span className="grid leading-tight">
                    <span className="font-semibold">{view.client.name}</span>
                    <span className="text-xs text-muted-foreground">{view.client.reference}</span>
                  </span>
                </div>
                <DefinitionList
                  dense
                  rows={[
                    ...view.client.rows,
                    { label: 'Status', value: <StatusBadge status={view.client.status} /> },
                  ]}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contact the client</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {CHANNELS.map((item) => (
                  <Button
                    key={item.channel}
                    variant="outline"
                    size="sm"
                    loading={contact.isPending && contact.variables === item.channel}
                    onClick={() => contact.mutate(item.channel)}
                  >
                    {item.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="grid gap-0.5">
                <CardTitle>Conversation</CardTitle>
                <p className="text-xs text-muted-foreground">
                  WhatsApp, calls, SMS and email in one feed
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setNoting(true)}>
                <Plus aria-hidden /> Add note
              </Button>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-3">
                {view.conversation.map((message) => (
                  <li key={message.id} className="grid gap-2 rounded-field border p-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Badge tone="success">{message.channel}</Badge>
                      <span className="font-semibold">{message.direction}</span>
                      <span className="ms-auto text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <p className="rounded-control bg-muted p-3 text-sm">{message.body}</p>
                    {message.footnote && <p className="text-xs text-primary">{message.footnote}</p>}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 2xl:col-span-1">
            <CardHeader>
              <CardTitle>Activity record</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <ol className="grid gap-3">
                {view.activity.map((entry) => (
                  <li key={entry.label + entry.detail} className="grid leading-tight">
                    <span className="text-sm font-semibold">{entry.label}</span>
                    <span className="text-xs text-muted-foreground">{entry.detail}</span>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-muted-foreground">
                Every visit, payment, vault movement and message is added here automatically and
                cannot be edited.
              </p>
            </CardContent>
          </Card>

          {noting && <AddNoteDialog caseId={caseId} onClose={() => setNoting(false)} />}
        </div>
      )}
    </QueryState>
  );
}

function AddNoteDialog({ caseId, onClose }: { caseId: string; onClose: () => void }) {
  const addNote = useAddSupportNote(caseId);
  const [body, setBody] = useState('');
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Add a note</DialogTitle>
        </DialogHeader>
        <FormField label="Note" required>
          {(control) => (
            <Textarea {...control} value={body} onChange={(event) => setBody(event.target.value)} />
          )}
        </FormField>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!body.trim()}
            loading={addNote.isPending}
            onClick={() => addNote.mutate(body.trim(), { onSuccess: onClose })}
          >
            Add note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
