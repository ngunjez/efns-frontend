import type { Permission } from '@/config/permissions';

export interface HubRef {
  id: string;
  name: string;
  code: string;
}

/** The signed-in staff member. Permissions come from the API, never from the role name. */
export interface StaffUser {
  id: string;
  name: string;
  email: string;
  roleLabel: string;
  /** e.g. "Bay 3" — shown under the name in the top bar. */
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
