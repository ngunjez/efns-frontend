import type { PageDefinition } from '@/components/features/register-page';
import { certificationPage, disciplinePage } from './agents';
import { feedbackPage, performancePage } from './analytics';
import { procurementPage } from './assets';
import { auditPage, correctiveActionsPage, exceptionsPage, qualityPage } from './compliance';
import { allocationPage, disputesPage, reconciliationPage, settlementsPage } from './finance';
import { accreditationPage, applicationsPage } from './hubs';
import { logisticsPage, vaultPage } from './operations';
import { feesPage, formsPage } from './services';
import {
  exceptionRulesPage,
  integrationsPage,
  modulesPage,
  networkPage,
  notificationsPage,
  rolesPage,
} from './system';

export const adminPages: Record<string, PageDefinition> = {
  'hubs/applications': applicationsPage,
  'hubs/accreditation': accreditationPage,
  'agents/certification': certificationPage,
  'agents/discipline': disciplinePage,
  'services/fees': feesPage,
  'services/forms': formsPage,
  'assets/procurement': procurementPage,
  vault: vaultPage,
  logistics: logisticsPage,
  'compliance/quality': qualityPage,
  'compliance/corrective-actions': correctiveActionsPage,
  'compliance/audit': auditPage,
  'compliance/exceptions': exceptionsPage,
  'analytics/performance': performancePage,
  'analytics/feedback': feedbackPage,
  'finance/reconciliation': reconciliationPage,
  'finance/allocation': allocationPage,
  'finance/disputes': disputesPage,
  'finance/settlements': settlementsPage,
  network: networkPage,
  'settings/roles': rolesPage,
  'settings/notifications': notificationsPage,
  'settings/exception-rules': exceptionRulesPage,
  'settings/integrations': integrationsPage,
  'settings/modules': modulesPage,
};
