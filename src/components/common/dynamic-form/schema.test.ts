import { buildDefaults, buildSchema } from './schema';
import type { FormSectionDef } from './types';

const sections: FormSectionDef[] = [
  {
    fields: [
      { name: 'name', label: 'Role name', type: 'text', required: true },
      { name: 'amount', label: 'Amount', type: 'number', required: true, min: 0 },
      { name: 'channels', label: 'Channels', type: 'multiselect', required: true },
      { name: 'secondApproval', label: 'Second approval', type: 'switch' },
    ],
  },
];

describe('form schema builder', () => {
  it('derives empty defaults per field type', () => {
    expect(buildDefaults(sections)).toEqual({
      name: '',
      amount: undefined,
      channels: [],
      secondApproval: false,
    });
  });

  it('reports required fields with readable messages', () => {
    const result = buildSchema(sections).safeParse(buildDefaults(sections));
    expect(result.success).toBe(false);
    const messages = result.error!.issues.map((issue) => issue.message);
    expect(messages).toContain('Role name is required');
    expect(messages).toContain('Choose at least one channels');
  });

  it('coerces numeric input from text fields', () => {
    const result = buildSchema(sections).safeParse({
      name: 'Trainer',
      amount: '50000',
      channels: ['SMS'],
      secondApproval: true,
    });
    expect(result.success && result.data.amount).toBe(50000);
  });
});
