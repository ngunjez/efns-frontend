'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RotateCw, ZoomIn } from 'lucide-react';
import { useCaseDecision, useWorkbench, type CaseDecision } from '@/api/hooks/use-desk';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState, LoadingBlock, QueryState } from '@/components/common/QueryState';
import { StageProgress } from '@/components/common/StageProgress';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FormField } from '@/components/common/FormField';
import type { WorkbenchView } from '@/types/desk';

/**
 * Frames 102 and 27: maker-checker. The Verification Officer compares scans
 * with keyed data; the QA Reviewer then approves, returns or rejects the file.
 */
export function Workbench() {
  const query = useWorkbench();
  return (
    <QueryState
      query={query}
      loading={<LoadingBlock rows={8} />}
      isEmpty={(data) => !data}
      empty={<EmptyState title="No case waiting" detail="Cases routed to you appear here." />}
    >
      {(view) => <Bench view={view} />}
    </QueryState>
  );
}

function Bench({ view }: { view: WorkbenchView }) {
  const decide = useCaseDecision();
  const [reason, setReason] = useState<string>();
  const [zoomed, setZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);
  const send = (decision: CaseDecision) =>
    decide.mutate({ caseId: view.case.id, decision, reason });
  const pending = (decision: CaseDecision) =>
    decide.isPending && decide.variables?.decision === decision;

  return (
    <div className="grid gap-5">
      <Card className="flex flex-wrap items-center gap-x-8 gap-y-4 p-5">
        <div className="flex items-center gap-3">
          <Avatar name={view.case.client} />
          <span className="grid leading-tight">
            <span className="font-semibold">{view.case.client}</span>
            <span className="text-xs text-muted-foreground">
              {view.case.reference}, {view.case.service}, ticket {view.case.ticket}
            </span>
          </span>
        </div>
        <StageProgress stage={view.case.stage} className="min-w-64 flex-1" />
        <div className="flex items-center gap-3">
          <span className="grid text-right leading-tight">
            <span className="text-xs text-muted-foreground">Time in hub</span>
            <span className="text-xl font-bold tabular">{view.case.timeInHub}</span>
          </span>
          <StatusBadge status={view.case.handleBudget} />
        </div>
      </Card>

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <Card>
          <Tabs defaultValue={view.documents[0]?.key}>
            <CardHeader>
              <CardTitle>Scanned original</CardTitle>
              {view.documents[0] && <StatusBadge status={view.documents[0].check} />}
            </CardHeader>
            <CardContent className="grid gap-4">
              <TabsList aria-label="Documents">
                {view.documents.map((document) => (
                  <TabsTrigger key={document.key} value={document.key}>
                    {document.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {view.documents.map((document) => (
                <TabsContent key={document.key} value={document.key} className="mt-0 grid gap-3">
                  <div className="grid gap-4 overflow-hidden rounded-field bg-muted p-4">
                    <div
                      className="grid origin-center gap-4 transition-transform"
                      style={{ transform: `rotate(${rotation}deg) scale(${zoomed ? 1.6 : 1})` }}
                    >
                      {document.previewUrl ? (
                        <Image
                          src={document.previewUrl}
                          alt={`${document.label}, scanned page`}
                          width={640}
                          height={420}
                          unoptimized
                          className="rounded-control"
                        />
                      ) : (
                        <div className="flex gap-4" aria-hidden>
                          <div className="grid h-28 w-24 place-items-center rounded-control bg-input/60 text-xs text-muted-foreground">
                            Photo
                          </div>
                          <div className="grid flex-1 content-start gap-2 pt-2">
                            {[80, 95, 60, 75].map((width) => (
                              <span
                                key={width}
                                className="h-2 rounded-full bg-input/70"
                                style={{ width: `${width}%` }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {document.mrz && (
                        <pre
                          className="overflow-x-auto rounded-control border-2 border-success bg-card p-3 font-mono text-xs leading-relaxed"
                          aria-label="Machine-readable zone"
                        >
                          {document.mrz.join('\n')}
                        </pre>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{document.meta}</span>
                    <span className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        aria-pressed={zoomed}
                        onClick={() => setZoomed(!zoomed)}
                      >
                        <ZoomIn aria-hidden /> Zoom
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRotation((rotation + 90) % 360)}
                      >
                        <RotateCw aria-hidden /> Rotate
                      </Button>
                    </span>
                  </div>
                </TabsContent>
              ))}
            </CardContent>
          </Tabs>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extracted and keyed data</CardTitle>
            <StatusBadge status={view.matchSummary} />
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="hidden sm:table-cell">Source</TableHead>
                <TableHead>Check</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {view.fields.map((field) => (
                <TableRow key={field.field}>
                  <TableCell className="text-muted-foreground">{field.field}</TableCell>
                  <TableCell className="font-semibold">{field.value}</TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                    {field.source}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={field.check} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Card className="flex flex-wrap items-end gap-4 p-5">
        <p className="min-w-60 flex-1 text-sm text-muted-foreground">
          Prepared by {view.preparedBy}. {view.mode === 'verify' ? 'Verified' : 'Reviewed'} by{' '}
          {view.checkedBy}. The officer who prepared a case cannot check it.
        </p>
        <FormField label="Reason, required to return" className="min-w-64">
          {(control) => (
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger {...control} className="h-11">
                <SelectValue placeholder="Choose a reason" />
              </SelectTrigger>
              <SelectContent>
                {view.returnReasons.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={!reason}
            loading={pending('return')}
            onClick={() => send('return')}
          >
            Return for correction
          </Button>
          {view.mode === 'qa' && (
            <Button
              variant="destructive"
              disabled={!reason}
              loading={pending('reject')}
              onClick={() => send('reject')}
            >
              Reject
            </Button>
          )}
          <Button
            variant="success"
            loading={pending(view.mode === 'verify' ? 'accept' : 'approve')}
            onClick={() => send(view.mode === 'verify' ? 'accept' : 'approve')}
          >
            {view.mode === 'verify' ? 'Accept and send to QA' : 'Approve'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
