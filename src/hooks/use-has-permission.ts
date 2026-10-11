import { hasPermission, type PermissionRule } from '@/config/permissions';
import { useAppSelector } from '@/store/hooks';

/** `const canEdit = useHasPermission(PERMISSIONS.settingsManage)` — hides actions the user cannot take. */
export function useHasPermission(required?: PermissionRule) {
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  return hasPermission(permissions, required);
}
