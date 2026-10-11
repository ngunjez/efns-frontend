'use client';

import { useId } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { DynamicForm } from './DynamicForm';
import type { FormDefinition } from './types';

/** The right-hand "Add …" drawer used by every register and settings page. */
export function FormDrawer({
  open,
  onOpenChange,
  definition,
  record,
  saving,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  definition: FormDefinition;
  record?: Record<string, unknown>;
  saving?: boolean;
  onSubmit: (values: Record<string, unknown>) => Promise<unknown>;
}) {
  const formId = useId();
  const editing = Boolean(record);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent {...(!definition.description && { 'aria-describedby': undefined })}>
        <SheetHeader>
          <SheetTitle>
            {editing ? definition.title.replace(/^Add /, 'Edit ') : definition.title}
          </SheetTitle>
          {definition.description && <SheetDescription>{definition.description}</SheetDescription>}
        </SheetHeader>
        <SheetBody>
          {open && (
            <DynamicForm
              formId={formId}
              definition={definition}
              record={record}
              onSubmit={onSubmit}
            />
          )}
        </SheetBody>
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={saving}>
            {editing ? 'Save changes' : definition.submitLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
