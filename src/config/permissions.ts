/**
 * Every permission the frontend checks. The API returns the subset a user
 * holds; roles are assembled from these in Settings › Roles and access, so the
 * UI never branches on a role name.
 */
export const PERMISSIONS = {
  // Service Desk
  /** Reception: today's bookings, check-in and the document check. */
  appointmentsManage: 'appointments:manage',
  floorHost: 'floor:host',
  servicePoint: 'service-point:operate',
  casesVerify: 'cases:verify',
  casesQa: 'cases:qa',
  floorboardView: 'floorboard:view',
  overridesApprove: 'overrides:approve',
  journeyBoardView: 'journey-board:view',
  supportOperate: 'support:operate',
  // Admin
  hubsManage: 'hubs:manage',
  agentsManage: 'agents:manage',
  servicesManage: 'services:manage',
  assetsManage: 'assets:manage',
  vaultManage: 'vault:manage',
  logisticsManage: 'logistics:manage',
  complianceView: 'compliance:view',
  analyticsView: 'analytics:view',
  financeManage: 'finance:manage',
  networkView: 'network:view',
  settingsManage: 'settings:manage',
  // Special actions
  exceptionsResolve: 'exceptions:resolve',
  officersReassign: 'officers:reassign',
  hubsSuspend: 'hubs:suspend',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** One permission, or a list where holding any one is enough. */
export type PermissionRule = Permission | readonly Permission[];

export function hasPermission(granted: readonly string[] | undefined, required?: PermissionRule) {
  if (!required) return true;
  const list: readonly Permission[] = typeof required === 'string' ? [required] : required;
  return list.some((permission) => granted?.includes(permission));
}
