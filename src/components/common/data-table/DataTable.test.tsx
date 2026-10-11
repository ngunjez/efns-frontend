import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from './DataTable';

const rows = [
  { id: '1', hub: 'Nairobi CBD Hub', collected: 9840000, status: 'reconciled' },
  { id: '2', hub: 'Eldoret Hub', collected: 1405000, status: 'under_review' },
];

describe('DataTable', () => {
  it('renders declarative columns, enum statuses and money', () => {
    render(
      <DataTable
        title="Reconciliation by hub"
        rows={rows}
        columns={[
          { key: 'hub', header: 'Hub' },
          { key: 'collected', header: 'Collected', kind: 'money' },
          { key: 'status', header: 'Status', kind: 'status', tones: { reconciled: 'success' } },
        ]}
      />,
    );
    const table = screen.getByRole('table', { name: 'Reconciliation by hub' });
    expect(within(table).getByText('KES 9,840,000')).toBeInTheDocument();
    expect(within(table).getByText('Under review')).toBeInTheDocument();
  });

  it('runs a row action from the menu', async () => {
    const onRowAction = jest.fn();
    render(
      <DataTable
        rows={rows}
        columns={[{ key: 'hub', header: 'Hub' }]}
        rowActions={[{ action: 'edit', label: 'Edit' }]}
        actionStyle="icons"
        onRowAction={onRowAction}
      />,
    );
    await userEvent.click(screen.getAllByRole('button', { name: 'Edit' })[1]!);
    expect(onRowAction).toHaveBeenCalledWith('edit', rows[1]);
  });

  it('shows an empty state instead of an empty table', () => {
    render(
      <DataTable rows={[]} columns={[{ key: 'hub', header: 'Hub' }]} emptyTitle="No hubs yet" />,
    );
    expect(screen.getByText('No hubs yet')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
