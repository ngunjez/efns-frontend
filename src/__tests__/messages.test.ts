import en from '../../messages/en.json';
import sw from '../../messages/sw.json';

const keys = (value: unknown, prefix = ''): string[] =>
  value && typeof value === 'object'
    ? Object.entries(value).flatMap(([key, child]) =>
        keys(child, prefix ? `${prefix}.${key}` : key),
      )
    : [prefix];

describe('translations', () => {
  it('Kiswahili has every English key, and no extras', () => {
    expect(keys(sw).sort()).toEqual(keys(en).sort());
  });
});
