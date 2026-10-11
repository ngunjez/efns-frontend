import { hasPermission, type PermissionRule } from '@/config/permissions';
import { useAppSelector } from '@/store/hooks';

export function useHasPermission(required?: PermissionRule) {
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  return hasPermission(permissions, required);
}
