import type { Permission } from '@/config/permissions';

export interface HubRef {
  id: string;
  name: string;
  code: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  roleLabel: string;
  station?: string;
  hub: HubRef | null;
  permissions: Permission[];
}

export type ClientCategory = 'citizen' | 'resident' | 'other';

export interface ClientUser {
  id: string;
  name: string;
  reference: string;
}
