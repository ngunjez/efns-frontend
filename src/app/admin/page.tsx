import { redirect } from 'next/navigation';

/** The admin console opens on network-wide hub performance. */
export default function AdminHome() {
  redirect('/admin/analytics/performance');
}
