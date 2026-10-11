import type { Route } from 'next';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Boxes,
  Building2,
  CalendarClock,
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
  Grid2x2,
} from 'lucide-react';
import { PERMISSIONS, hasPermission, type PermissionRule } from './permissions';

const to = <T extends string>(path: Route<T>): Route => path as Route;

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
        title: 'Appointments',
        href: to('/desk/appointments'),
        icon: CalendarClock,
        permission: PERMISSIONS.appointmentsManage,
      },
      {
        title: 'Floor Host',
        href: to('/desk/floor-host'),
        icon: UserRound,
        permission: PERMISSIONS.floorHost,
      },
      {
        title: 'Service Point',
        href: to('/desk/service-point'),
        icon: UsersRound,
        permission: PERMISSIONS.servicePoint,
      },
      {
        title: 'Workbench',
        href: to('/desk/workbench'),
        icon: MonitorSmartphone,
        permission: [PERMISSIONS.casesVerify, PERMISSIONS.casesQa],
      },
      {
        title: 'Floorboard',
        href: to('/desk/floorboard'),
        icon: LayoutGrid,
        permission: PERMISSIONS.floorboardView,
      },
      {
        title: 'Client Support',
        href: to('/desk/support'),
        icon: Headset,
        permission: PERMISSIONS.supportOperate,
      },
      {
        title: 'Journey Board',
        href: to('/desk/journey-board'),
        icon: Grid2x2,
        permission: PERMISSIONS.journeyBoardView,
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
          {
            title: 'Applications',
            href: to('/admin/hubs/applications'),
            permission: PERMISSIONS.hubsManage,
          },
          {
            title: 'Accreditation',
            href: to('/admin/hubs/accreditation'),
            permission: PERMISSIONS.hubsManage,
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
            permission: PERMISSIONS.agentsManage,
          },
          {
            title: 'Discipline and coaching',
            href: to('/admin/agents/discipline'),
            permission: PERMISSIONS.agentsManage,
          },
        ],
      },
      {
        title: 'Services',
        icon: Workflow,
        children: [
          {
            title: 'Fees and SLAs',
            href: to('/admin/services/fees'),
            permission: PERMISSIONS.servicesManage,
          },
          {
            title: 'Forms and checklists',
            href: to('/admin/services/forms'),
            permission: PERMISSIONS.servicesManage,
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
            permission: PERMISSIONS.assetsManage,
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
        permission: PERMISSIONS.vaultManage,
      },
      {
        title: 'Courier and logistics',
        href: to('/admin/logistics'),
        icon: Truck,
        permission: PERMISSIONS.logisticsManage,
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
            permission: PERMISSIONS.complianceView,
          },
          {
            title: 'Corrective actions',
            href: to('/admin/compliance/corrective-actions'),
            permission: PERMISSIONS.complianceView,
          },
          {
            title: 'Audit trail',
            href: to('/admin/compliance/audit'),
            permission: PERMISSIONS.complianceView,
          },
          {
            title: 'Exception ledger',
            href: to('/admin/compliance/exceptions'),
            permission: PERMISSIONS.complianceView,
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
            permission: PERMISSIONS.analyticsView,
          },
          {
            title: 'Feedback and complaints',
            href: to('/admin/analytics/feedback'),
            permission: PERMISSIONS.analyticsView,
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
            permission: PERMISSIONS.financeManage,
          },
          {
            title: 'Revenue allocation',
            href: to('/admin/finance/allocation'),
            permission: PERMISSIONS.financeManage,
          },
          {
            title: 'Disputes and refunds',
            href: to('/admin/finance/disputes'),
            permission: PERMISSIONS.financeManage,
          },
          {
            title: 'Partner settlements',
            href: to('/admin/finance/settlements'),
            permission: PERMISSIONS.financeManage,
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
        permission: PERMISSIONS.networkView,
      },
      {
        title: 'Settings',
        icon: Settings,
        children: [
          {
            title: 'Roles and access',
            href: to('/admin/settings/roles'),
            permission: PERMISSIONS.settingsManage,
          },
          {
            title: 'Notifications',
            href: to('/admin/settings/notifications'),
            permission: PERMISSIONS.settingsManage,
          },
          {
            title: 'Exception rules',
            href: to('/admin/settings/exception-rules'),
            permission: PERMISSIONS.settingsManage,
          },
          {
            title: 'Integrations',
            href: to('/admin/settings/integrations'),
            permission: PERMISSIONS.settingsManage,
          },
          {
            title: 'Sign-in and privacy',
            href: to('/admin/settings/sign-in'),
            permission: PERMISSIONS.settingsManage,
          },
          {
            title: 'Modules and fields',
            href: to('/admin/settings/modules'),
            permission: PERMISSIONS.settingsManage,
          },
        ],
      },
    ],
  },
];

function flatten(sections: NavSection[]): NavLink[] {
  return sections.flatMap((section) =>
    section.items.flatMap((item) =>
      item.children ? item.children : item.href ? [item as NavLink] : [],
    ),
  );
}

const allLinks = [...flatten(deskNavigation), ...flatten(adminNavigation)];

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

export function homeForPermissions(permissions: readonly string[]): Route {
  return (
    allLinks.find((link) => hasPermission(permissions, link.permission))?.href ?? '/unauthorized'
  );
}
