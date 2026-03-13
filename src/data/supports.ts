import type { SupportType } from '../types';

export const INITIAL_SUPPORTS: SupportType[] = [
  { id: 'vehicle-check', icon: '🚗', color: '#3bc7f4', name: 'Vehicle Check', desc: 'Pre-shift vehicle safety inspection', enabled: true, order: 1 },
  { id: 'hazard-report', icon: '⚠️', color: '#fe811a', name: 'Hazard Report', desc: 'Report a safety hazard encountered on route', enabled: true, order: 2 },
  { id: 'fuel-receipt', icon: '⛽', color: '#13b964', name: 'Fuel Receipt', desc: 'Submit fuel purchase receipt for reimbursement', enabled: true, order: 3 },
  { id: 'breakdown', icon: '🔧', color: '#dc3246', name: 'Breakdown', desc: 'Report vehicle breakdown or mechanical failure', enabled: true, order: 4 },
  { id: 'incident', icon: '🚨', color: '#dc3246', name: 'Incident Report', desc: 'Report an accident or safety incident', enabled: true, order: 5 },
  { id: 'customer-issue', icon: '👤', color: '#824ae0', name: 'Customer Issue', desc: 'Report a customer complaint or concern', enabled: true, order: 6 },
  { id: 'damage-report', icon: '📦', color: '#fe811a', name: 'Damage Report', desc: 'Report damaged goods or packaging', enabled: false, order: 7 },
  { id: 'route-issue', icon: '🗺️', color: '#2a4eff', name: 'Route Issue', desc: 'Report road closure, access problem, or address error', enabled: true, order: 8 },
  { id: 'rest-break', icon: '☕', color: '#824ae0', name: 'Rest Break', desc: 'Log mandatory rest or meal break', enabled: false, order: 9 },
  { id: 'expenses', icon: '💰', color: '#13b964', name: 'Expense Claim', desc: 'Submit miscellaneous expense for approval', enabled: false, order: 10 },
  { id: 'hs-hazard-form', icon: '🔗', color: '#dc3246', name: 'H&S Hazard Form', desc: 'Opens external H&S hazard/event reporting form', enabled: true, order: 11, kind: 'link', url: 'https://forms.example.com/hazard-report' },
  { id: 'waiting-time', icon: '⏳', color: '#f59e0b', name: 'Waiting Time', desc: 'Track waiting time at pickup/delivery — GPS-verified arrival, configurable free time and charge rate', enabled: true, order: 12, waitingTimeConfig: { gpsArrivalRadius: 150, distanceUnit: 'm', autoStartOnArrival: true, requireReason: true, waitReasons: ['Client not ready', 'Loading/Unloading', 'Queue at dock', 'Security clearance', 'Paperwork delays', 'Other'] } },
];
