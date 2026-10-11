'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBookAppointment, useHubs, useServices, useSlots } from '@/api/hooks/use-catalogue';
import { useClientLookup } from '@/api/hooks/use-desk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { FormField } from '@/components/common/FormField';
import { TimeSlotPicker } from '@/components/common/TimeSlotPicker';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useAppSelector } from '@/store/hooks';

/**
 * Frame 85: reception books for a client on the phone. The client is found by
 * phone, ID or passport number so no duplicate profile is created.
 */
export function BookForClientDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const hub = useAppSelector((state) => state.auth.user?.hub);
  const [client, setClient] = useState('');
  const [serviceId, setServiceId] = useState<string>();
  const [hubId, setHubId] = useState<string | undefined>(hub?.id);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState<string>();
  const lookup = useClientLookup(useDebouncedValue(client));
  const services = useServices();
  const hubs = useHubs();
  const slots = useSlots({ serviceId, hubId, date });
  const book = useBookAppointment();

  const reset = () => {
    setClient('');
    setServiceId(undefined);
    setTime(undefined);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Book appointment</SheetTitle>
          <SheetDescription>The client gets a booking code by SMS and email.</SheetDescription>
        </SheetHeader>
        <SheetBody className="grid content-start gap-6">
          <section className="grid gap-4" aria-label="Client">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Client
            </h3>
            <FormField label="Phone, ID or passport number" required>
              {(control) => (
                <Input
                  {...control}
                  value={client}
                  onChange={(event) => setClient(event.target.value)}
                />
              )}
            </FormField>
            {lookup.data?.found && (
              <p
                role="status"
                className="flex items-start gap-2 rounded-control bg-success-tint p-3 text-sm"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                <span>
                  <strong>Existing client found.</strong> {lookup.data.name},{' '}
                  {lookup.data.reference}. No new profile is created.
                </span>
              </p>
            )}
          </section>
          <section className="grid gap-4" aria-label="Appointment">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Appointment
            </h3>
            <FormField label="Service" required>
              {(control) => (
                <Select value={serviceId} onValueChange={setServiceId}>
                  <SelectTrigger {...control}>
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.data?.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Hub" required>
                {(control) => (
                  <Select value={hubId} onValueChange={setHubId}>
                    <SelectTrigger {...control}>
                      <SelectValue placeholder="Choose a hub" />
                    </SelectTrigger>
                    <SelectContent>
                      {hubs.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormField>
              <FormField label="Date" required>
                {(control) => (
                  <Input
                    {...control}
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                  />
                )}
              </FormField>
            </div>
            <fieldset className="grid gap-2">
              <legend className="mb-2 text-[0.9375rem] font-semibold">Time</legend>
              {slots.data ? (
                <TimeSlotPicker
                  slots={slots.data}
                  value={time}
                  onValueChange={setTime}
                  label="Time"
                  fullLabel={(slot) => `${slot}, full`}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Choose a service, hub and date to see times.
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Only times with a certified officer on the roster are offered.
              </p>
            </fieldset>
          </section>
        </SheetBody>
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!client || !serviceId || !hubId || !time}
            loading={book.isPending}
            onClick={() =>
              serviceId &&
              hubId &&
              time &&
              book.mutate(
                { client, serviceId, hubId, date, time },
                {
                  onSuccess: (booking) => {
                    toast.success(
                      `Booked, ${booking.code}. The client gets the code by SMS and email.`,
                    );
                    reset();
                    onOpenChange(false);
                  },
                },
              )
            }
          >
            Book appointment
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
