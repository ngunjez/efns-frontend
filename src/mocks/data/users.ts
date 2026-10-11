import { PERMISSIONS as P, type Permission } from '@/config/permissions';
import type { StaffUser } from '@/types/auth';

const hub = { id: 'hub-nbo', name: 'Nairobi CBD Hub', code: 'NBO-001' };
const allPermissions = Object.values(P) as Permission[];

/**
 * Demo accounts for working without the backend. Sign in with any of these
 * emails, any password and any 6-digit code (000000 shows the outside-hub refusal).
 */
export const demoUsers: Record<string, StaffUser> = {
  'grace.mwangi': {
    id: 'u-grace',
    name: 'Grace Mwangi',
    email: 'grace.mwangi@nairobicbd.aaas.example',
    roleLabel: 'Service Officer',
    station: 'Bay 3',
    hub,
    permissions: [P.servicePoint, P.journeyBoardView],
  },
  'mary.achieng': {
    id: 'u-mary',
    name: 'Mary Achieng',
    email: 'mary.achieng@nairobicbd.aaas.example',
    roleLabel: 'Service Officer',
    station: 'Reception',
    hub,
    permissions: [P.appointmentsManage, P.journeyBoardView],
  },
  'mary.njoki': {
    id: 'u-njoki',
    name: 'Mary Njoki',
    email: 'mary.njoki@nairobicbd.aaas.example',
    roleLabel: 'Floor Host',
    hub,
    permissions: [P.floorHost, P.journeyBoardView],
  },
  'joseph.kariuki': {
    id: 'u-joseph',
    name: 'Joseph Kariuki',
    email: 'joseph.kariuki@nairobicbd.aaas.example',
    roleLabel: 'Verification Officer',
    hub,
    permissions: [P.casesVerify, P.journeyBoardView],
  },
  'rose.auma': {
    id: 'u-rose',
    name: 'Rose Auma',
    email: 'rose.auma@nairobicbd.aaas.example',
    roleLabel: 'QA Reviewer',
    hub,
    permissions: [P.casesQa, P.journeyBoardView],
  },
  'wanjiku.kamau': {
    id: 'u-wanjiku',
    name: 'Wanjiku Kamau',
    email: 'wanjiku.kamau@nairobicbd.aaas.example',
    roleLabel: 'Hub Manager',
    hub,
    permissions: [
      P.floorboardView,
      P.overridesApprove,
      P.journeyBoardView,
      P.appointmentsManage,
      P.floorHost,
      P.servicePoint,
      P.exceptionsResolve,
      P.officersReassign,
    ],
  },
  'wambui.gathoni': {
    id: 'u-wambui',
    name: 'Wambui Gathoni',
    email: 'wambui.gathoni@nairobicbd.aaas.example',
    roleLabel: 'Support Agent',
    hub,
    permissions: [P.supportOperate, P.journeyBoardView],
  },
  'njeri.mwangi': {
    id: 'u-njeri',
    name: 'Njeri Mwangi',
    email: 'njeri.mwangi@aaas.example',
    roleLabel: 'Platform Administrator',
    hub: null,
    permissions: allPermissions,
  },
};

export function demoUserFor(email: string): StaffUser {
  const handle = email.split('@')[0]?.toLowerCase() ?? '';
  return demoUsers[handle] ?? demoUsers['njeri.mwangi']!;
}
