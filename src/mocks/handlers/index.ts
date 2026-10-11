import { authHandlers } from './auth';
import { catalogueHandlers } from './catalogue';
import { clientHandlers } from './client';
import { deskHandlers } from './desk';
import { registerHandlers } from './registers';
import { settingsHandlers } from './settings';

/** Every mocked endpoint. Each group mirrors a section of src/api/endpoints. */
export const handlers = [
  ...authHandlers,
  ...clientHandlers,
  ...catalogueHandlers,
  ...deskHandlers,
  ...registerHandlers,
  ...settingsHandlers,
];
