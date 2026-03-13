import type { FeatureFlag } from '../types';

export const INITIAL_FEATURES: FeatureFlag[] = [
  { id: 'gps', icon: '📡', name: 'GPS Location Update', desc: 'Real-time courier location tracking', enabled: true, overrides: 3 },
  { id: 'photo-delivery', icon: '📸', name: 'Photo on Delivery', desc: 'Require photo proof at delivery', enabled: true, overrides: 5 },
  { id: 'signature', icon: '✍️', name: 'Signature Capture', desc: 'Capture recipient signature on delivery', enabled: true, overrides: 4 },
  { id: 'smart-parcel', icon: '📐', name: 'Smart Parcel Capture', desc: 'AI-assisted parcel dimension and weight capture', enabled: true, overrides: 0 },
  { id: 'courier-lead', icon: '💼', name: 'Courier Lead Capture', desc: 'Allow couriers to capture new business leads in-app', enabled: false, overrides: 0 },
  { id: 'live-chat', icon: '💬', name: 'Live Chat', desc: 'In-app messaging between courier and dispatch', enabled: true, overrides: 0 },
  { id: 'barcode', icon: '🔖', name: 'Barcode Scanning', desc: 'Scan parcels on pickup and delivery for tracking', enabled: true, overrides: 2 },
  { id: 'route-nav', icon: '🧭', name: 'Route Navigation', desc: 'In-app turn-by-turn navigation to job locations', enabled: true, overrides: 0 },
  { id: 'pod-email', icon: '📧', name: 'POD Email', desc: 'Auto-send proof of delivery via email to client', enabled: true, overrides: 6 },
  { id: 'geofence', icon: '📍', name: 'Geofence Arrival', desc: 'Auto-detect courier arrival via GPS geofence', enabled: true, overrides: 1 },
  { id: 'delivery-notes', icon: '📝', name: 'Delivery Notes', desc: 'Allow courier free-text notes on delivery', enabled: true, overrides: 0 },
  { id: 'weight-dim', icon: '⚖️', name: 'Weight & Dimensions', desc: 'Manual weight and size capture by courier', enabled: false, overrides: 1 },
  { id: 'instruction-note', icon: '📋', name: 'Instruction Notes', desc: 'Show custom instruction notes to couriers during workflow stages — requires read acknowledgement', enabled: false, overrides: 0 },
];
