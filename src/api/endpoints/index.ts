const resource = (base: string) =>
  ({ list: base, detail: (id: string) => `${base}/${id}` }) as const;

export const ENDPOINTS = {
  auth: {
    staffSignIn: '/auth/staff/sign-in',
    staffVerify: '/auth/staff/verify',
    me: '/auth/me',
    unlock: '/auth/unlock',
    signOut: '/auth/sign-out',
  },
  client: {
    signIn: '/clients/sign-in',
    signOut: '/clients/sign-out',
    register: '/clients/register',
    verifyPhone: '/clients/verify-phone',
    me: '/clients/me',
    application: '/clients/me/application',
    appointment: '/clients/me/appointment',
    track: (reference: string) => `/track/${reference}`,
    uploadDocument: (reference: string) => `/track/${reference}/documents`,
  },
  catalogue: {
    services: '/catalogue/services',
    hubs: '/catalogue/hubs',
    slots: '/catalogue/slots',
  },
  appointments: {
    ...resource('/appointments'),
    checkIn: (id: string) => `/appointments/${id}/check-in`,
  },
  desk: {
    hubStatus: '/desk/hub-status',
    visits: '/desk/visits',
    clientLookup: '/desk/clients/lookup',
    priorityOverride: '/desk/priority-overrides',
    station: '/desk/station',
    stationAction: (action: string) => `/desk/station/actions/${action}`,
    stationStatus: '/desk/station/status',
    floorboard: '/desk/floorboard',
    floorboardAction: (action: string) => `/desk/floorboard/actions/${action}`,
    journeyBoard: '/desk/journey-board',
    workbench: '/desk/workbench',
    caseAction: (caseId: string) => `/cases/${caseId}/actions`,
    notifications: '/desk/notifications',
    support: (caseId: string) => `/support/cases/${caseId}`,
  },
  displays: {
    hall: '/displays/hall',
    bay: (bay: string) => `/displays/bay/${bay}`,
    customer: '/displays/customer',
    customerAction: '/displays/customer/actions',
  },
  settings: (key: string) => `/settings/${key}`,
  registers: (key: string) => resource(`/registers/${key}`),
  customFields: (page: string) => `/settings/custom-fields/${page}`,
  customField: (page: string, name: string) => `/settings/custom-fields/${page}/${name}`,
  logistics: {
    openManifest: '/logistics/manifests/open',
    scan: '/logistics/manifests/open/scan',
    handover: '/logistics/manifests/open/handover',
  },
} as const;
