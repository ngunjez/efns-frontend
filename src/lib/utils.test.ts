import { cn, getByPath, initials } from './utils';

describe('utils', () => {
  it('lets later Tailwind classes win', () => {
    expect(cn('p-2 text-sm', 'p-4')).toBe('text-sm p-4');
  });
  it('builds two-letter initials', () => {
    expect(initials('Grace Wanjiru Mwangi')).toBe('GW');
  });
  it('reads dotted paths safely', () => {
    expect(getByPath({ hub: { name: 'Nairobi' } }, 'hub.name')).toBe('Nairobi');
    expect(getByPath({}, 'hub.name')).toBeUndefined();
  });
});
