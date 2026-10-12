import type { PageDefinition } from '@/components/features/register-page';
import { ICON_ACTIONS, ROLES, SYSTEMS, hubColumn, options } from '../shared';

export const networkPage: PageDefinition = {
  key: 'network',
  title: 'Network and geofencing',
  description:
    'Link health, device authentication and attempts to file from outside a hub. Addresses and tunnel identifiers are never shown here.',
  customizable: true,
  createLabel: 'Add node',
  form: {
    title: 'Add node',
    description:
      'Register a hub edge device. It is provisioned centrally and has no local admin access.',
    submitLabel: 'Register node',
    successMessage: 'Node registered. It joins the network after zero-touch provisioning.',
    sections: [
      {
        title: 'Hub',
        fields: [
          {
            name: 'hubId',
            label: 'Hub',
            type: 'select',
            optionsSource: 'hubs',
            required: true,
            span: 1,
          },
          { name: 'serial', label: 'Device serial', type: 'text', required: true, span: 1 },
        ],
      },
      {
        title: 'Links',
        fields: [
          {
            name: 'primaryLink',
            label: 'Primary link',
            type: 'select',
            required: true,
            span: 1,
            options: options('Dedicated fibre', 'Microwave'),
          },
          {
            name: 'backupCircuit',
            label: 'Backup circuit',
            type: 'select',
            required: true,
            span: 1,
            options: options('LTE', '5G', 'Secondary fibre'),
          },
          {
            name: 'tunnel',
            label: 'Tunnel',
            type: 'segmented',
            required: true,
            options: options('IPSec', 'WireGuard'),
            defaultValue: 'IPSec',
          },
        ],
      },
      {
        title: 'Access',
        fields: [
          {
            name: 'geofence',
            label: 'Allow filing only through this hub tunnel',
            type: 'switch',
            defaultValue: true,
          },
          {
            name: 'portAuth',
            label: 'Require 802.1X on every counter port',
            type: 'switch',
            defaultValue: true,
          },
        ],
      },
    ],
  },
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Hub links',
          searchPlaceholder: 'Search hubs',
          selectable: true,
          rowActions: [
            { action: 'failover-test', label: 'Run failover test' },
            { action: 'rotate-certificate', label: 'Rotate device certificate' },
          ],
          columns: [
            hubColumn,
            {
              key: 'primary',
              header: 'Primary link',
              kind: 'status',
              tones: { up: 'success', degraded: 'warning', down: 'danger' },
            },
            {
              key: 'tunnel',
              header: 'Tunnel',
              kind: 'status',
              tones: { up: 'success', down: 'danger' },
              hideBelow: 'md',
            },
            {
              key: 'failover',
              header: 'Backup circuit',
              kind: 'status',
              tones: { standby: 'info', active: 'warning', down: 'danger' },
              hideBelow: 'sm',
            },
            {
              key: 'certificate',
              header: 'Device certificate',
              kind: 'status',
              tones: { valid: 'success', expiring: 'warning', expired: 'danger' },
              hideBelow: 'lg',
            },
            { key: 'heartbeat', header: 'Heartbeat', kind: 'muted', hideBelow: 'md' },
            {
              key: 'status',
              header: 'Status',
              kind: 'status',
              tones: { up: 'success', on_backup: 'warning', down: 'danger' },
              labels: { on_backup: 'On backup' },
            },
          ],
        },
      ],
      aside: [{ type: 'list', id: 'security', title: 'Security events' }],
    },
    { main: [{ type: 'tiles', id: 'portAuth', title: '802.1X port authentication' }] },
  ],
};

export const rolesPage: PageDefinition = {
  key: 'roles',
  title: 'Roles and access',
  description: 'What each role can open and do. A change takes effect as soon as you save it.',
  createLabel: 'Add role',
  form: {
    title: 'Add role',
    description: 'Takes effect as soon as you save. Recorded in the audit trail.',
    submitLabel: 'Save role',
    successMessage: 'Role saved. It applies from the next screen each user opens.',
    sections: [
      {
        fields: [
          { name: 'name', label: 'Role name', type: 'text', required: true, span: 1 },
          {
            name: 'scope',
            label: 'Sees records for',
            type: 'select',
            required: true,
            span: 1,
            options: options('Own hub', 'Own region', 'All hubs'),
          },
        ],
      },
      {
        fields: [
          {
            name: 'systems',
            label: 'Systems',
            type: 'matrix',
            options: SYSTEMS,
            matrixColumns: options('View', 'Edit'),
          },
        ],
      },
      {
        title: 'Special actions',
        fields: [
          {
            name: 'resolveExceptions',
            label: 'Resolve exceptions and escalations',
            type: 'switch',
            help: 'At the hubs this role can see',
          },
          {
            name: 'reassignOfficers',
            label: 'Reassign officers to cover a gap',
            type: 'switch',
            help: 'Only officers certified for the service',
          },
          {
            name: 'suspendHub',
            label: 'Restrict or suspend a hub',
            type: 'switch',
            help: 'Stops services at that hub at once',
          },
        ],
      },
    ],
  },
  remove: {
    title: 'Delete this role?',
    description: 'Users with {name} lose its access. Choose the role they move to.',
    successMessage: 'Role deleted. Its users have moved.',
    reassignLabel: 'Move its users to',
  },
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Roles',
          searchPlaceholder: 'Search roles',
          actionStyle: 'icons',
          rowActions: ICON_ACTIONS,
          columns: [
            { key: 'name', header: 'Role', kind: 'entity', subKey: 'summary', icon: 'users' },
            { key: 'systemsLabel', header: 'Systems it works in', hideBelow: 'md' },
            { key: 'users', header: 'Users', kind: 'number' },
          ],
        },
      ],
    },
  ],
};

export const notificationsPage: PageDefinition = {
  key: 'notification-rules',
  title: 'Notifications',
  description: 'Which event sends which message, to whom and by which channel.',
  createLabel: 'Add rule',
  form: {
    title: 'Add rule',
    submitLabel: 'Save rule',
    successMessage: 'Rule added. It sends from now.',
    sections: [
      {
        fields: [
          {
            name: 'name',
            label: 'Event',
            type: 'select',
            required: true,
            options: options(
              'Accreditation expiring',
              'Vault item overdue',
              'Unreconciled cash',
              'QA rejection',
              'Support escalation',
            ),
          },
          {
            name: 'recipient',
            label: 'Recipient',
            type: 'select',
            required: true,
            span: 1,
            options: options(
              'Client',
              'The officer',
              'Assigned officer',
              'Hub Manager',
              'Escalation owner',
            ),
          },
          {
            name: 'channel',
            label: 'Channel',
            type: 'select',
            required: true,
            span: 1,
            options: options('SMS', 'Email', 'In-app'),
          },
          {
            name: 'fallback',
            label: 'Fallback',
            type: 'select',
            span: 1,
            options: options('None', 'SMS', 'Email', 'In-app'),
          },
          {
            name: 'message',
            label: 'Message',
            type: 'textarea',
            required: true,
            help: 'Merge fields such as {reference} and {hub} are filled in when it sends.',
          },
        ],
      },
    ],
  },
  remove: {
    title: 'Delete this rule?',
    description: '{name} will stop sending.',
    successMessage: 'Rule deleted.',
  },
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Rules',
          searchPlaceholder: 'Search rules',
          actionStyle: 'icons',
          rowActions: ICON_ACTIONS,
          columns: [
            {
              key: 'name',
              header: 'Message',
              kind: 'entity',
              subKey: 'trigger',
              icon: 'bell',
              toneKey: 'tone',
            },
            { key: 'recipient', header: 'Recipient', hideBelow: 'sm' },
            { key: 'channel', header: 'Channel', hideBelow: 'md' },
            { key: 'fallback', header: 'Fallback', hideBelow: 'md' },
            {
              key: 'status',
              header: 'Status',
              kind: 'status',
              tones: { mandatory: 'info', on: 'success', off: 'neutral' },
            },
          ],
        },
      ],
      aside: [{ type: 'custom', id: 'channels', component: 'notification-channels' }],
    },
  ],
};

export const exceptionRulesPage: PageDefinition = {
  key: 'exception-rules',
  title: 'Exception rules',
  description:
    'Who owns each kind of problem, how long they have, and who it goes to if it is not resolved in time.',
  createLabel: 'Add category',
  form: {
    title: 'Add category',
    description: 'Applies to new exceptions as soon as you save.',
    submitLabel: 'Save category',
    successMessage: 'Category added. New exceptions of this kind go to its owner.',
    sections: [
      {
        title: '1. Category',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true, span: 1 },
          {
            name: 'raisedBy',
            label: 'Raised by',
            type: 'select',
            required: true,
            span: 1,
            options: SYSTEMS,
          },
        ],
      },
      {
        title: '2. Owner',
        fields: [
          { name: 'owner', label: 'Owner role', type: 'select', required: true, options: ROLES },
        ],
      },
      {
        title: '3. Deadline',
        fields: [
          {
            name: 'deadline',
            label: 'Resolve within',
            type: 'select',
            required: true,
            span: 1,
            options: options('1 hour', '4 hours', '1 day', '2 days', '3 days', '5 days'),
          },
          {
            name: 'warnAt',
            label: 'Warn the owner',
            type: 'select',
            required: true,
            span: 1,
            options: options('At 50% of the time', 'At 80% of the time'),
          },
        ],
      },
      {
        title: '4. If not resolved in time',
        fields: [
          {
            name: 'escalatesTo',
            label: 'Escalate to',
            type: 'segmented',
            required: true,
            options: options('Management', 'Specialist', 'Government'),
            defaultValue: 'Management',
          },
          {
            name: 'managementRole',
            label: 'Management role',
            type: 'select',
            required: true,
            options: ROLES,
          },
        ],
      },
    ],
  },
  remove: {
    title: 'Delete this category?',
    description: 'Open exceptions of {name} keep their owner; new ones go to the default queue.',
    successMessage: 'Category deleted.',
  },
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Categories',
          searchPlaceholder: 'Search categories',
          actionStyle: 'icons',
          rowActions: ICON_ACTIONS,
          columns: [
            { key: 'name', header: 'Category', kind: 'entity', icon: 'alert', toneKey: 'tone' },
            { key: 'raisedBy', header: 'Raised by', hideBelow: 'md' },
            { key: 'owner', header: 'Owner', hideBelow: 'sm' },
            { key: 'deadline', header: 'Deadline' },
            { key: 'escalatesTo', header: 'Escalates to', hideBelow: 'md' },
          ],
        },
      ],
    },
  ],
};

export const integrationsPage: PageDefinition = {
  key: 'integrations',
  title: 'Integrations',
  description:
    'The outside systems the platform talks to. Each connection is tested when you save it.',
  createLabel: 'Add connection',
  form: {
    title: 'Add connection',
    submitLabel: 'Save connection',
    successMessage: 'Connection checked and connected.',
    sections: [
      {
        fields: [
          { name: 'name', label: 'Party', type: 'text', required: true, span: 1 },
          {
            name: 'channel',
            label: 'Channel',
            type: 'select',
            required: true,
            span: 1,
            options: options('REST API', 'SFTP', 'Message queue', 'SMS gateway', 'Email relay'),
          },
          { name: 'endpoint', label: 'Endpoint URL', type: 'text', required: true },
          {
            name: 'key',
            label: 'API key',
            type: 'text',
            required: true,
            help: 'Stored encrypted. It is never shown again after you save.',
          },
        ],
      },
    ],
  },
  remove: {
    title: 'Remove this connection?',
    description: 'The platform stops calling {name} immediately.',
    successMessage: 'Connection removed.',
  },
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Connections',
          searchPlaceholder: 'Search connections',
          actionStyle: 'icons',
          rowActions: ICON_ACTIONS,
          columns: [
            { key: 'name', header: 'Party', kind: 'entity', subKey: 'purpose', icon: 'plug' },
            { key: 'channel', header: 'Channel', hideBelow: 'sm' },
            { key: 'lastCheck', header: 'Last check', hideBelow: 'md' },
            {
              key: 'status',
              header: 'Status',
              kind: 'status',
              tones: { connected: 'success', degraded: 'warning', failed: 'danger' },
            },
          ],
        },
      ],
    },
  ],
};

export const modulesPage: PageDefinition = {
  key: 'modules',
  title: 'Modules and fields',
  description: 'Add your own modules to the menu, and your own fields to any page.',
  createLabel: 'Add module',
  form: {
    title: 'Add module',
    submitLabel: 'Save module',
    successMessage: 'Module added to the menu. Add its fields next.',
    sections: [
      {
        fields: [
          { name: 'name', label: 'Module name', type: 'text', required: true },
          {
            name: 'section',
            label: 'Menu section',
            type: 'select',
            required: true,
            span: 1,
            options: options('Manage', 'Operations', 'Govern', 'System'),
          },
          {
            name: 'openedBy',
            label: 'Who can open it',
            type: 'multiselect',
            required: true,
            options: ROLES,
          },
        ],
      },
    ],
  },
  remove: {
    title: 'Delete this module?',
    description: '{name} and its fields are removed from the menu. Its records are archived.',
    successMessage: 'Module deleted.',
  },
  rows: [
    {
      main: [
        {
          type: 'table',
          title: 'Pages',
          searchPlaceholder: 'Search pages',
          actionStyle: 'icons',
          rowActions: ICON_ACTIONS,
          columns: [
            {
              key: 'name',
              header: 'Page',
              kind: 'entity',
              subKey: 'section',
              icon: 'grid',
              toneKey: 'tone',
            },
            {
              key: 'type',
              header: 'Type',
              kind: 'status',
              tones: { built_in: 'neutral', custom: 'info' },
              labels: { built_in: 'Built-in' },
            },
            { key: 'customFields', header: 'Custom fields', kind: 'number' },
          ],
        },
      ],
      aside: [{ type: 'custom', id: 'fields', component: 'page-fields' }],
    },
  ],
};
