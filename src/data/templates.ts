import type { SavedTemplate } from '../types';

export const TEMPLATES: SavedTemplate[] = [
  { name: 'Standard', status: 'Active', linked: 'Default (all jobs)', steps: 4, modified: '2026-02-20', preset: 'standard' },
  { name: 'Alcohol', status: 'Active', linked: 'Alcohol Delivery service', steps: 5, modified: '2026-02-15', preset: 'alcohol' },
  { name: 'Medical', status: 'Active', linked: 'Medlab Central client', steps: 8, modified: '2026-02-10', preset: 'medical' },
  { name: 'Minimal', status: 'Active', linked: 'NP: Castle Parcels', steps: 1, modified: '2026-02-08', preset: 'minimal' },
  { name: 'Temperature Controlled', status: 'Active', linked: 'Chilled services', steps: 7, modified: '2026-02-05' },
  { name: 'Flight Job', status: 'Active', linked: 'Nationwide Flight service', steps: 5, modified: '2026-01-30' },
];
