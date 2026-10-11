'use client';

import { useState } from 'react';
import { ScanLine } from 'lucide-react';
import { useOpenManifest, useRecordHandover, useScanItem } from '@/api/hooks/use-logistics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DefinitionList } from '@/components/common/DefinitionList';
import { EmptyState, LoadingBlock, QueryState } from '@/components/common/QueryState';
import { SignaturePad } from '@/components/common/SignaturePad';
import { StatusBadge } from '@/components/common/StatusBadge';

/** Frame 48: scan each vault item into the courier bag, then the runner signs for the sealed bag. */
export default function ManifestScan() {
  const query = useOpenManifest();
  const scan = useScanItem();
  const handover = useRecordHandover();
  const [code, setCode] = useState('');
  const [signature, setSignature] = useState<string | null>(null);

  return (
    <QueryState
      query={query}
      loading={<LoadingBlock rows={5} />}
      isEmpty={(data) => !data}
      empty={
        <Card>
          <EmptyState title="No consignment open" detail="Add a manifest to start packing." />
        </Card>
      }
    >
      {(manifest) => {
        if (!manifest) return null;
        const scanned = manifest.items.filter((item) => item.scanned).length;
        const complete = scanned === manifest.items.length;
        return (
          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <Card>
              <CardHeader>
                <div className="grid gap-0.5">
                  <CardTitle>Manifest {manifest.id}</CardTitle>
                  <p className="text-xs text-muted-foreground">Scan an item into the courier bag</p>
                </div>
                <StatusBadge status={manifest.status} />
              </CardHeader>
              <CardContent className="grid gap-4">
                <form
                  className="flex gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (code.trim()) scan.mutate(code.trim(), { onSuccess: () => setCode('') });
                  }}
                >
                  <label htmlFor="manifest-scan" className="sr-only">
                    Vault label or register entry
                  </label>
                  <Input
                    id="manifest-scan"
                    className="flex-1"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="Scan the vault label or type the register entry"
                    autoComplete="off"
                  />
                  <Button type="submit" size="lg" loading={scan.isPending}>
                    <ScanLine aria-hidden /> Scan
                  </Button>
                </form>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="hidden sm:table-cell">Application</TableHead>
                      <TableHead className="hidden md:table-cell">Vault register</TableHead>
                      <TableHead>Bag</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {manifest.items.map((item) => (
                      <TableRow key={item.register}>
                        <TableCell className="font-semibold">{item.item}</TableCell>
                        <TableCell className="hidden sm:table-cell">{item.application}</TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {item.register}
                        </TableCell>
                        <TableCell>
                          <Badge tone={item.scanned ? 'success' : 'warning'}>
                            {item.scanned ? 'Scanned in' : 'Not scanned'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                  <span>
                    {scanned} of {manifest.items.length} items scanned. Bag seal {manifest.bagSeal}.
                  </span>
                  <span>The hand-over unlocks when every item is scanned.</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Runner handover</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <DefinitionList
                  dense
                  rows={[
                    { label: 'Destination', value: manifest.handover.destination },
                    { label: 'Courier', value: manifest.handover.courier },
                    { label: 'Runner', value: manifest.handover.runner },
                    { label: 'Tamper-evident seal', value: manifest.handover.seal },
                  ]}
                />
                <SignaturePad
                  label="Runner signature"
                  signerName={manifest.handover.runner}
                  hint="Sign on the pad"
                  onChange={setSignature}
                />
                <Button
                  disabled={!complete || !signature}
                  loading={handover.isPending}
                  onClick={() => signature && handover.mutate(signature)}
                >
                  Record handover
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      }}
    </QueryState>
  );
}
