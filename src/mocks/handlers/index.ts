import { authHandlers } from './auth';
import { caseHandlers } from './case';
import { catalogueHandlers } from './catalogue';
import { clientHandlers } from './client';
import { deskHandlers } from './desk';
import { registerHandlers } from './registers';
import { settingsHandlers } from './settings';

export const handlers = [
  ...authHandlers,
  ...clientHandlers,
  ...catalogueHandlers,
  ...deskHandlers,
  ...caseHandlers,
  ...registerHandlers,
  ...settingsHandlers,
];
