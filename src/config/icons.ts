import {
  AlertTriangle,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CalendarClock,
  ClipboardList,
  CreditCard,
  FileText,
  Fingerprint,
  Flag,
  Gavel,
  IdCard,
  Landmark,
  LayoutGrid,
  Lock,
  MapPin,
  Package,
  Plug,
  Receipt,
  ScrollText,
  ShieldCheck,
  Shapes,
  Truck,
  UserRound,
  UsersRound,
  Wallet,
  Wifi,
  type LucideIcon,
} from 'lucide-react';

/**
 * Icons referenced by name from config and API data (a service's icon, a
 * table's entity icon). Keeps icon choice declarative and serialisable.
 */
export const icons = {
  alert: AlertTriangle,
  bell: Bell,
  book: BookOpen,
  briefcase: Briefcase,
  building: Building2,
  calendar: CalendarClock,
  checklist: ClipboardList,
  card: CreditCard,
  document: FileText,
  fingerprint: Fingerprint,
  flag: Flag,
  gavel: Gavel,
  id: IdCard,
  landmark: Landmark,
  grid: LayoutGrid,
  lock: Lock,
  pin: MapPin,
  package: Package,
  plug: Plug,
  receipt: Receipt,
  scroll: ScrollText,
  shield: ShieldCheck,
  shapes: Shapes,
  truck: Truck,
  user: UserRound,
  users: UsersRound,
  wallet: Wallet,
  wifi: Wifi,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof icons;

export function iconFor(key: string | undefined): LucideIcon {
  return (key && icons[key as IconKey]) || FileText;
}
