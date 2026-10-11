import { adminPages } from './pages/admin';
import {
  adminNavigation,
  filterNavigation,
  homeForPermissions,
  permissionForPath,
} from './navigation';
import { PERMISSIONS, hasPermission } from './permissions';

describe('navigation and permissions', () => {
  it('lands each role on the first screen it may open', () => {
    expect(homeForPermissions([PERMISSIONS.casesQa])).toBe('/desk/workbench');
    expect(homeForPermissions([PERMISSIONS.financeManage])).toBe('/admin/finance/reconciliation');
    expect(homeForPermissions([])).toBe('/unauthorized');
  });

  it('finds the permission a nested path needs', () => {
    expect(permissionForPath('/admin/settings/roles')).toBe(PERMISSIONS.settingsManage);
    expect(permissionForPath('/hub/payment')).toBeUndefined();
  });

  it('accepts any one of several permissions', () => {
    expect(
      hasPermission([PERMISSIONS.casesQa], [PERMISSIONS.casesVerify, PERMISSIONS.casesQa]),
    ).toBe(true);
    expect(hasPermission([PERMISSIONS.casesQa], PERMISSIONS.settingsManage)).toBe(false);
  });

  it('hides sections with nothing the user can open', () => {
    const sections = filterNavigation(adminNavigation, [PERMISSIONS.vaultManage]);
    expect(sections.map((section) => section.label)).toEqual(['Operations']);
  });

  it('has a page definition for every admin register link', () => {
    const links = adminNavigation.flatMap((section) =>
      section.items.flatMap((item) => (item.children ?? [item]).map((link) => link.href!)),
    );
    const bespoke = ['/admin/settings/sign-in'];
    links
      .filter((href) => !bespoke.includes(href))
      .forEach((href) => expect(adminPages[href.replace('/admin/', '')]).toBeDefined());
  });
});
