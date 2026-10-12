export const PERMISSIONS = {
  appointmentsManage: 'appointments:manage',
  receptionTriage: 'reception:triage',
  floorHost: 'floor:host',
  servicePoint: 'service-point:operate',
  casesVerify: 'cases:verify',
  casesQa: 'cases:qa',
  floorboardView: 'floorboard:view',
  overridesApprove: 'overrides:approve',
  journeyBoardView: 'journey-board:view',
  supportOperate: 'support:operate',
  hubsManage: 'hubs:manage',
  agentsManage: 'agents:manage',
  servicesManage: 'services:manage',
  assetsManage: 'assets:manage',
  vaultManage: 'vault:manage',
  logisticsManage: 'logistics:manage',
  complianceView: 'compliance:view',
  exceptionsResolve: 'exceptions:resolve',
  analyticsView: 'analytics:view',
  feedbackView: 'feedback:view',
  financeManage: 'finance:manage',
  networkView: 'network:view',
  settingsManage: 'settings:manage',
  officersReassign: 'officers:reassign',
  hubsSuspend: 'hubs:suspend',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type PermissionRule = Permission | readonly Permission[];

export function hasPermission(granted: readonly string[] | undefined, required?: PermissionRule) {
  if (!required) return true;
  const list: readonly Permission[] = typeof required === 'string' ? [required] : required;
  return list.some((permission) => granted?.includes(permission));
}
