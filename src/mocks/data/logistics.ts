import type { OpenManifest } from '@/api/hooks/use-logistics';

const state: { manifest: OpenManifest | null } = {
  manifest: {
    id: 'MNF-NBO-2026-0412',
    status: { label: 'Packing', tone: 'warning' },
    bagSeal: 'SL-0077412',
    items: [
      {
        item: 'Passport Z4418207',
        application: 'AAS-2026-004812',
        register: 'VR-2026-01477',
        scanned: true,
      },
      {
        item: 'Passport N5518830',
        application: 'AAS-2026-004533',
        register: 'VR-2026-01461',
        scanned: true,
      },
      {
        item: 'Passport K2204716',
        application: 'AAS-2026-004410',
        register: 'VR-2026-01438',
        scanned: true,
      },
      {
        item: 'Passport E9930175',
        application: 'AAS-2026-004602',
        register: 'VR-2026-01470',
        scanned: false,
      },
    ],
    handover: {
      destination: 'Directorate of Immigration, Nyayo House',
      courier: 'G4S Courier',
      runner: 'Peter Mwangi, staff ID 20417',
      seal: 'SL-0077412, intact',
    },
  },
};

export function logisticsState() {
  return state;
}
