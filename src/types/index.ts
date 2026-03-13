// ── Task Types ──
export interface TaskConfig {
  minPhotos?: number;
  maxPhotos?: number;
  label?: string;
  mandatory?: string;
  signerNameReq?: boolean;
  minAge?: number;
  idTypes?: string[];
  matchField?: string;
  action?: string;
  scanRequired?: boolean;
  mustMatch?: boolean;
  message?: string;
  acknowledge?: boolean;
  required?: boolean;
  options?: string[];
  radius?: number;
  mode?: string;
  docType?: string;
  note?: string;
  minTemp?: number;
  maxTemp?: number;
  requirePhoto?: boolean;
  // Awaiting Time
  gpsArrivalRadius?: number;
  freeMinutes?: number;
  ratePerMinute?: number;
  maxWaitMinutes?: number;
  autoStartOnArrival?: boolean;
  requireReason?: boolean;
  waitReasons?: string[];
}

export interface TaskType {
  id: string;
  icon: string;
  name: string;
  desc: string;
  cat: 'Capture' | 'Verification' | 'Confirmation' | 'Communication';
  config: TaskConfig;
}

export interface StageTask {
  taskId: string;
  required: boolean;
  config: TaskConfig;
}

export type StageName = 'Enroute to Pickup' | 'Pickup' | 'Enroute to Delivery' | 'Delivery';

export type StagesMap = Partial<Record<StageName, StageTask[]>>;

export interface PresetWorkflow {
  name: string;
  stages: StagesMap;
}

// ── Services & Clients ──
export interface ServiceType {
  id: number;
  name: string;
  code: string;
}

export interface Client {
  id: number;
  name: string;
  code: string;
}

// ── Supports ──
export interface WaitingTimeConfig {
  gpsArrivalRadius: number;
  distanceUnit: 'm' | 'ft';
  autoStartOnArrival: boolean;
  requireReason: boolean;
  waitReasons: string[];
}

export interface SupportType {
  id: string;
  icon: string;
  color: string;
  name: string;
  desc: string;
  enabled: boolean;
  order: number;
  kind?: 'form' | 'link';
  url?: string;
  waitingTimeConfig?: WaitingTimeConfig;
}

// ── Feature Flags ──
export interface FeatureFlag {
  id: string;
  icon: string;
  name: string;
  desc: string;
  enabled: boolean;
  overrides: number;
}

// ── Templates ──
export interface SavedTemplate {
  name: string;
  status: string;
  linked: string;
  steps: number;
  modified: string;
  preset?: string;
}

// ── API DTOs (matching backend) ──
export interface AppConfigDto {
  id: number;
  configKey: string;
  configValue: string | null;
  dataType: string;
  category: string;
  description: string | null;
  isActive: boolean;
  created: string;
  createdBy: string | null;
  lastModified: string | null;
  lastModifiedBy: string | null;
}

export interface WorkflowTemplateDto {
  id: number;
  name: string;
  description: string | null;
  clientId: number | null;
  clientName: string | null;
  speedId: number | null;
  speedName: string | null;
  isActive: boolean;
  created: string;
  createdBy: string | null;
  lastModified: string | null;
  lastModifiedBy: string | null;
  scopeLabel: string;
  mirrorToAgentPortal: boolean;
  stepCount: number;
  details: WorkflowTemplateDetailDto[];
}

export interface WorkflowTemplateDetailDto {
  id: number;
  templateId: number;
  statusId: number;
  statusName: string;
  eventTypeId: number;
  eventTypeName: string;
  timeOffset: number;
  sequence: number;
  isActive: boolean;
}

export interface MobileWorkflowStepResponse {
  templateDetailId: number;
  sequence: number;
  eventTypeName: string;
  eventTypeId: number;
  stageTrigger: string;
  timeOffset: number;
  isCompleted: boolean;
  completedAt: string | null;
  source: string;
  required: boolean;
  configJson: string | null;
}

export type AppliesToScope = 'default' | 'client' | 'service' | 'both' | 'np';
