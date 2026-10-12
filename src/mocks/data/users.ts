import { PERMISSIONS as P, type Permission } from '@/config/permissions';
import type { StaffUser } from '@/types/auth';

const hub = { id: 'hub-nbo', name: 'Nairobi CBD Hub', code: 'NBO-001' };

interface DemoAccount {
  name: string;
  roleLabel: string;
  station?: string;
  atHub: boolean;
  permissions: Permission[];
}

export const demoAccounts: Record<string, DemoAccount> = {
  'mary.njoki': {
    name: 'Mary Njoki',
    roleLabel: 'Service Officer',
    station: 'Floor host',
    atHub: true,
    permissions: [P.floorHost, P.journeyBoardView],
  },
  'mary.achieng': {
    name: 'Mary Achieng',
    roleLabel: 'Service Officer',
    station: 'Reception',
    atHub: true,
    permissions: [P.appointmentsManage, P.receptionTriage, P.journeyBoardView],
  },
  'grace.mwangi': {
    name: 'Grace Mwangi',
    roleLabel: 'Service Officer',
    station: 'Bay 3',
    atHub: true,
    permissions: [P.servicePoint, P.journeyBoardView],
  },
  'joseph.kariuki': {
    name: 'Joseph Kariuki',
    roleLabel: 'Verification Officer',
    atHub: true,
    permissions: [P.casesVerify, P.journeyBoardView],
  },
  'rose.auma': {
    name: 'Rose Auma',
    roleLabel: 'QA Reviewer',
    atHub: true,
    permissions: [P.casesQa, P.journeyBoardView],
  },
  'wanjiku.kamau': {
    name: 'Wanjiku Kamau',
    roleLabel: 'Hub Manager',
    atHub: true,
    permissions: [
      P.floorboardView,
      P.overridesApprove,
      P.officersReassign,
      P.journeyBoardView,
      P.exceptionsResolve,
    ],
  },
  'wambui.gathoni': {
    name: 'Wambui Gathoni',
    roleLabel: 'Support Agent',
    atHub: true,
    permissions: [P.supportOperate, P.journeyBoardView],
  },
  'samuel.kiprop': {
    name: 'Samuel Kiprop',
    roleLabel: 'Vault Custodian',
    atHub: true,
    permissions: [P.vaultManage],
  },
  'peter.otieno': {
    name: 'Peter Otieno',
    roleLabel: 'Despatch Clerk',
    atHub: true,
    permissions: [P.logisticsManage],
  },
  'faith.njeri': {
    name: 'Faith Njeri',
    roleLabel: 'Cashier / Finance Officer',
    atHub: false,
    permissions: [P.financeManage],
  },
  'hassan.omar': {
    name: 'Hassan Omar',
    roleLabel: 'Operations Manager',
    atHub: false,
    permissions: [P.analyticsView, P.hubsManage, P.exceptionsResolve, P.hubsSuspend],
  },
  'david.mutua': {
    name: 'David Mutua',
    roleLabel: 'Service Owner',
    atHub: false,
    permissions: [P.servicesManage],
  },
  'lydia.chebet': {
    name: 'Lydia Chebet',
    roleLabel: 'Workforce / HR Manager',
    atHub: false,
    permissions: [P.agentsManage],
  },
  'lilian.abeno': {
    name: 'Lilian Abeno',
    roleLabel: 'Quality / Compliance Officer',
    atHub: false,
    permissions: [P.complianceView],
  },
  'achieng.odhiambo': {
    name: 'Achieng Odhiambo',
    roleLabel: 'Customer Experience Manager',
    atHub: false,
    permissions: [P.feedbackView],
  },
  'njeri.mwangi': {
    name: 'Njeri Mwangi',
    roleLabel: 'Platform Administrator',
    atHub: false,
    permissions: [P.networkView, P.settingsManage, P.assetsManage],
  },
};

function toUser(handle: string, account: DemoAccount): StaffUser {
  return {
    id: `u-${handle}`,
    name: account.name,
    email: `${handle}@aaas.example`,
    roleLabel: account.roleLabel,
    station: account.station,
    hub: account.atHub ? hub : null,
    permissions: account.permissions,
  };
}

export function demoUserFor(email: string): StaffUser | null {
  const handle = email.split('@')[0]?.toLowerCase() ?? '';
  const account = demoAccounts[handle];
  return account ? toUser(handle, account) : null;
}
