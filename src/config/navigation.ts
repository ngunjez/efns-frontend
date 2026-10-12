import type { Route } from 'next';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Boxes,
  Building2,
  CalendarClock,
  ClipboardCheck,
  Grid2x2,
  Headset,
  LayoutGrid,
  Lock,
  MonitorSmartphone,
  Settings,
  ShieldCheck,
  Truck,
  UserRound,
  UsersRound,
  Wallet,
  Wifi,
  Workflow,
} from 'lucide-react';
import { PERMISSIONS as P, hasPermission, type PermissionRule } from './permissions';

const to = <T extends string>(path: Route<T>): Route => path as Route;

export type AppKey = 'desk' | 'admin';

export interface NavLink {
  title: string;
  href: Route;
  permission?: PermissionRule;
}

export interface NavItem extends Partial<NavLink> {
  title: string;
  icon: LucideIcon;
  children?: NavLink[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const deskNavigation: NavSection[] = [
  {
    label: 'My station',
    items: [
      {
        title: 'Floorboard',
        href: to('/desk/floorboard'),
        icon: LayoutGrid,
        permission: P.floorboardView,
      },
      {
        title: 'Floor Host',
        href: to('/desk/floor-host'),
        icon: UserRound,
        permission: P.floorHost,
      },
      {
        title: 'Appointments',
        href: to('/desk/appointments'),
        icon: CalendarClock,
        permission: P.appointmentsManage,
      },
      {
        title: 'Document check',
        href: to('/desk/reception'),
        icon: ClipboardCheck,
        permission: P.receptionTriage,
      },
      {
        title: 'Service Point',
        href: to('/desk/service-point'),
        icon: UsersRound,
        permission: P.servicePoint,
      },
      {
        title: 'Workbench',
        href: to('/desk/workbench'),
        icon: MonitorSmartphone,
        permission: [P.casesVerify, P.casesQa],
      },
      {
        title: 'Client Support',
        href: to('/desk/support'),
        icon: Headset,
        permission: P.supportOperate,
      },
      {
        title: 'Journey Board',
        href: to('/desk/journey-board'),
        icon: Grid2x2,
        permission: P.journeyBoardView,
      },
    ],
  },
];

export const adminNavigation: NavSection[] = [
  {
    label: 'Manage',
    items: [
      {
        title: 'Hubs and Centres',
        icon: Building2,
        children: [
          { title: 'Applications', href: to('/admin/hubs/applications'), permission: P.hubsManage },
          {
            title: 'Accreditation',
            href: to('/admin/hubs/accreditation'),
            permission: P.hubsManage,
          },
        ],
      },
      {
        title: 'Agents',
        icon: UsersRound,
        children: [
          {
            title: 'Training and certification',
            href: to('/admin/agents/certification'),
            permission: P.agentsManage,
          },
          {
            title: 'Discipline and coaching',
            href: to('/admin/agents/discipline'),
            permission: P.agentsManage,
          },
        ],
      },
      {
        title: 'Services',
        icon: Workflow,
        children: [
          {
            title: 'Forms and checklists',
            href: to('/admin/services/forms'),
            permission: P.servicesManage,
          },
          {
            title: 'Fees and SLAs',
            href: to('/admin/services/fees'),
            permission: P.servicesManage,
          },
        ],
      },
      {
        title: 'Assets',
        icon: Boxes,
        children: [
          {
            title: 'Procurement',
            href: to('/admin/assets/procurement'),
            permission: P.assetsManage,
          },
        ],
      },
    ],
  },
  {
    label: 'Operations',
    items: [
      {
        title: 'Vault and custody',
        href: to('/admin/vault'),
        icon: Lock,
        permission: P.vaultManage,
      },
      {
        title: 'Courier and logistics',
        href: to('/admin/logistics'),
        icon: Truck,
        permission: P.logisticsManage,
      },
    ],
  },
  {
    label: 'Govern',
    items: [
      {
        title: 'Compliance',
        icon: ShieldCheck,
        children: [
          {
            title: 'Quality and rework',
            href: to('/admin/compliance/quality'),
            permission: P.complianceView,
          },
          {
            title: 'Corrective actions',
            href: to('/admin/compliance/corrective-actions'),
            permission: P.complianceView,
          },
          {
            title: 'Exception ledger',
            href: to('/admin/compliance/exceptions'),
            permission: P.exceptionsResolve,
          },
          {
            title: 'Audit trail',
            href: to('/admin/compliance/audit'),
            permission: P.complianceView,
          },
        ],
      },
      {
        title: 'Analytics',
        icon: BarChart3,
        children: [
          {
            title: 'Hub performance',
            href: to('/admin/analytics/performance'),
            permission: P.analyticsView,
          },
          {
            title: 'Feedback and complaints',
            href: to('/admin/analytics/feedback'),
            permission: P.feedbackView,
          },
        ],
      },
      {
        title: 'Finance',
        icon: Wallet,
        children: [
          {
            title: 'Reconciliation',
            href: to('/admin/finance/reconciliation'),
            permission: P.financeManage,
          },
          {
            title: 'Disputes and refunds',
            href: to('/admin/finance/disputes'),
            permission: P.financeManage,
          },
          {
            title: 'Revenue allocation',
            href: to('/admin/finance/allocation'),
            permission: P.financeManage,
          },
          {
            title: 'Partner settlements',
            href: to('/admin/finance/settlements'),
            permission: P.financeManage,
          },
        ],
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        title: 'Network and security',
        href: to('/admin/network'),
        icon: Wifi,
        permission: P.networkView,
      },
      {
        title: 'Settings',
        icon: Settings,
        children: [
          {
            title: 'Roles and access',
            href: to('/admin/settings/roles'),
            permission: P.settingsManage,
          },
          {
            title: 'Notifications',
            href: to('/admin/settings/notifications'),
            permission: P.settingsManage,
          },
          {
            title: 'Exception rules',
            href: to('/admin/settings/exception-rules'),
            permission: P.settingsManage,
          },
          {
            title: 'Integrations',
            href: to('/admin/settings/integrations'),
            permission: P.settingsManage,
          },
          {
            title: 'Sign-in and privacy',
            href: to('/admin/settings/sign-in'),
            permission: P.settingsManage,
          },
          {
            title: 'Modules and fields',
            href: to('/admin/settings/modules'),
            permission: P.settingsManage,
          },
        ],
      },
    ],
  },
];

const extraRoutes: NavLink[] = [
  { title: 'Case', href: to('/desk/service-point/case'), permission: P.servicePoint },
];

const landingOrder: Route[] = [
  to('/desk/floorboard'),
  to('/desk/workbench'),
  to('/desk/service-point'),
  to('/desk/appointments'),
  to('/desk/reception'),
  to('/desk/floor-host'),
  to('/desk/support'),
  to('/admin/network'),
  to('/admin/analytics/performance'),
  to('/admin/services/forms'),
  to('/admin/agents/certification'),
  to('/admin/finance/reconciliation'),
  to('/admin/compliance/quality'),
  to('/admin/analytics/feedback'),
  to('/admin/vault'),
  to('/admin/logistics'),
  to('/admin/compliance/exceptions'),
];

function flatten(sections: NavSection[]): NavLink[] {
  return sections.flatMap((section) =>
    section.items.flatMap((item) =>
      item.children ? item.children : item.href ? [item as NavLink] : [],
    ),
  );
}

const linksByApp: Record<AppKey, NavLink[]> = {
  desk: flatten(deskNavigation),
  admin: flatten(adminNavigation),
};

const allLinks = [...linksByApp.desk, ...linksByApp.admin, ...extraRoutes];

export const navigationByApp: Record<AppKey, NavSection[]> = {
  desk: deskNavigation,
  admin: adminNavigation,
};

export function filterNavigation(
  sections: NavSection[],
  permissions: readonly string[],
): NavSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items
        .map((item) =>
          item.children
            ? {
                ...item,
                children: item.children.filter((child) =>
                  hasPermission(permissions, child.permission),
                ),
              }
            : item,
        )
        .filter((item) =>
          item.children ? item.children.length > 0 : hasPermission(permissions, item.permission),
        ),
    }))
    .filter((section) => section.items.length > 0);
}

export function permissionForPath(pathname: string): PermissionRule | undefined {
  const match = allLinks
    .filter((link) => pathname === link.href || pathname.startsWith(`${link.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.permission;
}

export function homeForPermissions(permissions: readonly string[], app?: AppKey): Route {
  const candidates = app ? linksByApp[app] : allLinks;
  const allowed = (href: Route) =>
    candidates.some((link) => link.href === href && hasPermission(permissions, link.permission));
  return (
    landingOrder.find(allowed) ??
    candidates.find((link) => hasPermission(permissions, link.permission))?.href ??
    '/unauthorized'
  );
}

export function appsForPermissions(permissions: readonly string[]): AppKey[] {
  return (Object.keys(linksByApp) as AppKey[]).filter((app) =>
    linksByApp[app].some((link) => hasPermission(permissions, link.permission)),
  );
}

export function titleForPath(pathname: string): string | undefined {
  return allLinks
    .filter((link) => pathname === link.href || pathname.startsWith(`${link.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.title;
}
