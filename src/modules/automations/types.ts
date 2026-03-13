// Automations Module Types
// Configuration-only: defines "if this then that" automation rules

// ============================================
// SCOPE TYPES
// ============================================

/**
 * Customer reference for scope selection.
 */
export interface CustomerOption {
  id: string;
  name: string;
  shortName: string;
}

/**
 * Speed/service level reference for scope selection.
 */
export interface SpeedOption {
  id: string;
  name: string;
  code: string;
}

/**
 * Automation scope - which customers and speeds it applies to.
 */
export interface AutomationScope {
  allCustomers: boolean;
  customerIds: string[];
  allSpeeds: boolean;
  speedIds: string[];
}

// ============================================
// CONDITION TYPES
// ============================================

/**
 * Job type filter for conditions.
 */
export type JobTypeFilter =
  | 'all'
  | 'child_1_pickup'    // Child 1 (Pickup / Collection)
  | 'child_2_flight'    // Child 2 (Flight / Transport)
  | 'child_3_delivery'  // Child 3 (Delivery)
  | 'standard';         // Standard job (non parent/child)

export const JOB_TYPE_OPTIONS: { value: JobTypeFilter; label: string }[] = [
  { value: 'all', label: 'All job types' },
  { value: 'child_1_pickup', label: 'Child 1 (Pickup / Collection)' },
  { value: 'child_2_flight', label: 'Child 2 (Flight / Transport)' },
  { value: 'child_3_delivery', label: 'Child 3 (Delivery)' },
  { value: 'standard', label: 'Standard job (non parent/child)' },
];

/**
 * Scheduled time field options for timing conditions.
 */
export type ScheduledTimeField = 'pickup' | 'delivery' | 'flight';

export const SCHEDULED_TIME_OPTIONS: { value: ScheduledTimeField; label: string }[] = [
  { value: 'pickup', label: 'Pickup time' },
  { value: 'delivery', label: 'Delivery time' },
  { value: 'flight', label: 'Flight time' },
];

/**
 * Time unit for offset values.
 */
export type TimeUnit = 'minutes' | 'hours';

export const TIME_UNIT_OPTIONS: { value: TimeUnit; label: string }[] = [
  { value: 'minutes', label: 'minutes' },
  { value: 'hours', label: 'hours' },
];

/**
 * Status condition mode.
 */
export type StatusConditionMode =
  | 'any_change'
  | 'changes_to'
  | 'leaves'
  | 'is_not';

export const STATUS_CONDITION_MODES: { value: StatusConditionMode; label: string }[] = [
  { value: 'any_change', label: 'When status changes (any change)' },
  { value: 'changes_to', label: 'When status changes to a specific status' },
  { value: 'leaves', label: 'When status leaves a specific status' },
  { value: 'is_not', label: 'When status is not a specific status' },
];

/**
 * Scan event types.
 */
export type ScanType =
  | 'sort_scan'
  | 'alternative_sort_scan'
  | 'run_scan'
  | 'invalid_run_scan'
  | 'transit_scan'
  | 'inwards_depot_scan'
  | 'pickup_scan'
  | 'invalid_pickup_scan'
  | 'transfer_scan';

export const SCAN_TYPE_OPTIONS: { value: ScanType; label: string }[] = [
  { value: 'sort_scan', label: 'Sort scan' },
  { value: 'alternative_sort_scan', label: 'Alternative sort scan' },
  { value: 'run_scan', label: 'Run scan' },
  { value: 'invalid_run_scan', label: 'Invalid run scan' },
  { value: 'transit_scan', label: 'Transit scan' },
  { value: 'inwards_depot_scan', label: 'Inwards depot scan' },
  { value: 'pickup_scan', label: 'Pickup scan' },
  { value: 'invalid_pickup_scan', label: 'Invalid pickup scan' },
  { value: 'transfer_scan', label: 'Transfer scan' },
];

/**
 * Condition type discriminator.
 */
export type ConditionType =
  | 'job_unassigned'
  | 'job_assigned'
  | 'before_scheduled_time'
  | 'after_scheduled_time'
  | 'at_scheduled_time'
  | 'status'
  | 'scan';

export const CONDITION_TYPE_OPTIONS: { value: ConditionType; label: string; icon: string }[] = [
  { value: 'job_unassigned', label: 'Job unassigned', icon: '👤' },
  { value: 'job_assigned', label: 'Job assigned', icon: '✓' },
  { value: 'before_scheduled_time', label: 'Before scheduled time', icon: '⏰' },
  { value: 'after_scheduled_time', label: 'After scheduled time', icon: '⏱️' },
  { value: 'at_scheduled_time', label: 'At scheduled time', icon: '🕐' },
  { value: 'status', label: 'Status condition / change', icon: '📊' },
  { value: 'scan', label: 'Scan event', icon: '📷' },
];

/**
 * Site option for from/to site filters.
 */
export interface SiteOption {
  id: string;
  name: string;
  code?: string;
}

/**
 * Region option for from/to region filters.
 */
export interface RegionOption {
  id: string;
  name: string;
}

/**
 * Priority filter options.
 */
export const PRIORITY_OPTIONS: { value: string; label: string }[] = [
  { value: 'ALL', label: 'All priorities' },
  { value: '1', label: 'Critical' },
  { value: '2', label: 'High' },
  { value: '3', label: 'Normal' },
  { value: '4', label: 'Low' },
];

/**
 * Base condition with common fields.
 */
interface BaseCondition {
  id: string;
  type: ConditionType;
  jobTypeFilter: JobTypeFilter;
  /** Priority filter: 'ALL' or specific priority ID */
  priorityFilter?: string;
  /** Comma-separated from site IDs */
  fromSiteIds?: string[];
  /** Comma-separated to site IDs */
  toSiteIds?: string[];
  /** Comma-separated from region IDs */
  fromRegionIds?: string[];
  /** Comma-separated to region IDs */
  toRegionIds?: string[];
  /** Time threshold in minutes (for unassigned/assigned conditions) */
  timeThresholdMinutes?: number;
}

/**
 * Job unassigned condition.
 */
export interface JobUnassignedCondition extends BaseCondition {
  type: 'job_unassigned';
}

/**
 * Job assigned condition.
 */
export interface JobAssignedCondition extends BaseCondition {
  type: 'job_assigned';
}

/**
 * Before scheduled time condition.
 */
export interface BeforeScheduledTimeCondition extends BaseCondition {
  type: 'before_scheduled_time';
  scheduledTimeField: ScheduledTimeField;
  offsetValue: number;
  offsetUnit: TimeUnit;
}

/**
 * After scheduled time condition.
 */
export interface AfterScheduledTimeCondition extends BaseCondition {
  type: 'after_scheduled_time';
  scheduledTimeField: ScheduledTimeField;
  offsetValue: number;
  offsetUnit: TimeUnit;
}

/**
 * At scheduled time condition.
 */
export interface AtScheduledTimeCondition extends BaseCondition {
  type: 'at_scheduled_time';
  scheduledTimeField: ScheduledTimeField;
}

/**
 * Status condition.
 */
export interface StatusCondition extends BaseCondition {
  type: 'status';
  mode: StatusConditionMode;
  statusId?: string; // Required when mode is not 'any_change'
}

/**
 * Scan event condition.
 */
export interface ScanCondition extends BaseCondition {
  type: 'scan';
  scanTypes: ScanType[];
}

/**
 * Union of all condition types.
 */
export type Condition =
  | JobUnassignedCondition
  | JobAssignedCondition
  | BeforeScheduledTimeCondition
  | AfterScheduledTimeCondition
  | AtScheduledTimeCondition
  | StatusCondition
  | ScanCondition;

/**
 * Match mode for multiple conditions.
 */
export type ConditionMatchMode = 'all' | 'any';

export const CONDITION_MATCH_MODE_OPTIONS: { value: ConditionMatchMode; label: string }[] = [
  { value: 'all', label: 'All conditions must be true (AND)' },
  { value: 'any', label: 'Any condition can be true (OR)' },
];

// ============================================
// ACTION TYPES
// ============================================

/**
 * Action type discriminator.
 */
export type ActionType =
  | 'update_job_status'
  | 'create_task'
  | 'complete_task'
  | 'trigger_notification'
  | 'send_sms'
  | 'change_status';

export const ACTION_TYPE_OPTIONS: { value: ActionType; label: string; icon: string }[] = [
  { value: 'update_job_status', label: 'Update job status', icon: '📊' },
  { value: 'create_task', label: 'Create task', icon: '📋' },
  { value: 'complete_task', label: 'Complete task', icon: '✅' },
  { value: 'trigger_notification', label: 'Trigger notification', icon: '🔔' },
  { value: 'send_sms', label: 'Send text message (SMS)', icon: '💬' },
  { value: 'change_status', label: 'Change status from one to another', icon: '🔄' },
];

/**
 * SMS recipient type.
 */
export type SmsRecipientType = 'customer_contact' | 'driver' | 'fixed_number';

export const SMS_RECIPIENT_OPTIONS: { value: SmsRecipientType; label: string }[] = [
  { value: 'customer_contact', label: 'Customer contact' },
  { value: 'driver', label: 'Driver' },
  { value: 'fixed_number', label: 'Fixed phone number' },
];

/**
 * Base action with common fields.
 */
interface BaseAction {
  id: string;
  type: ActionType;
}

/**
 * Update job status action.
 */
export interface UpdateJobStatusAction extends BaseAction {
  type: 'update_job_status';
  statusId: string;
}

/**
 * Create task action.
 */
export interface CreateTaskAction extends BaseAction {
  type: 'create_task';
  taskTemplateId: string;
  assigneeId?: string;
  assigneeGroupId?: string;
  dueTimeOffsetMinutes?: number;
}

/**
 * Complete task action.
 */
export interface CompleteTaskAction extends BaseAction {
  type: 'complete_task';
  taskTemplateId: string;
}

/**
 * Trigger notification action.
 */
export interface TriggerNotificationAction extends BaseAction {
  type: 'trigger_notification';
  notificationTemplateId: string;
  targetType?: string;
}

/**
 * Send SMS action.
 */
export interface SendSmsAction extends BaseAction {
  type: 'send_sms';
  recipientType: SmsRecipientType;
  fixedPhoneNumber?: string; // Required when recipientType is 'fixed_number'
  messageContent: string;
  useTemplate?: boolean;
  templateId?: string;
}

/**
 * Change status from one to another action.
 */
export interface ChangeStatusAction extends BaseAction {
  type: 'change_status';
  fromStatusId?: string; // Optional - if blank, behaves like normal status update
  toStatusId: string;
}

/**
 * Union of all action types.
 */
export type Action =
  | UpdateJobStatusAction
  | CreateTaskAction
  | CompleteTaskAction
  | TriggerNotificationAction
  | SendSmsAction
  | ChangeStatusAction;

// ============================================
// AUTOMATION RULE
// ============================================

/**
 * Complete automation rule.
 */
export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  scope: AutomationScope;
  conditionMatchMode: ConditionMatchMode;
  conditions: Condition[];
  actions: Action[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// ============================================
// FILTER STATE
// ============================================

export interface AutomationFilterState {
  customerId: string | 'all';
  speedId: string | 'all';
  search: string;
}

// ============================================
// REFERENCE DATA TYPES
// ============================================

/**
 * Job status reference.
 */
export interface JobStatus {
  id: string;
  name: string;
  code: string;
}

/**
 * Task template reference.
 */
export interface TaskTemplate {
  id: string;
  name: string;
}

/**
 * Notification template reference.
 */
export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'single' | 'group';
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get summary icons for an automation rule.
 */
export function getAutomationIcons(rule: AutomationRule): string {
  const icons: string[] = [];

  // Add icons based on action types
  for (const action of rule.actions) {
    switch (action.type) {
      case 'update_job_status':
      case 'change_status':
        if (!icons.includes('📊')) icons.push('📊');
        break;
      case 'create_task':
      case 'complete_task':
        if (!icons.includes('📋')) icons.push('📋');
        break;
      case 'trigger_notification':
        if (!icons.includes('🔔')) icons.push('🔔');
        break;
      case 'send_sms':
        if (!icons.includes('💬')) icons.push('💬');
        break;
    }
  }

  return icons.join(' ');
}

/**
 * Get a short trigger summary for an automation.
 */
export function getTriggerSummary(rule: AutomationRule): string {
  if (rule.conditions.length === 0) return 'No triggers';
  if (rule.conditions.length === 1) {
    return getConditionSummary(rule.conditions[0]);
  }
  const mode = rule.conditionMatchMode === 'all' ? 'all of' : 'any of';
  return `${mode} ${rule.conditions.length} conditions`;
}

/**
 * Get a short action summary for an automation.
 */
export function getActionSummary(rule: AutomationRule): string {
  if (rule.actions.length === 0) return 'No actions';
  if (rule.actions.length === 1) {
    return getActionLabel(rule.actions[0]);
  }
  return `${rule.actions.length} actions`;
}

/**
 * Get a human-readable summary of a condition.
 */
export function getConditionSummary(condition: Condition): string {
  switch (condition.type) {
    case 'job_unassigned':
      return 'Job is unassigned';
    case 'job_assigned':
      return 'Job is assigned';
    case 'before_scheduled_time':
      return `${condition.offsetValue} ${condition.offsetUnit} before ${condition.scheduledTimeField}`;
    case 'after_scheduled_time':
      return `${condition.offsetValue} ${condition.offsetUnit} after ${condition.scheduledTimeField}`;
    case 'at_scheduled_time':
      return `At ${condition.scheduledTimeField} time`;
    case 'status':
      return STATUS_CONDITION_MODES.find(m => m.value === condition.mode)?.label ?? 'Status change';
    case 'scan':
      return `Scan event (${condition.scanTypes.length} types)`;
    default:
      return 'Unknown condition';
  }
}

/**
 * Get a human-readable label for an action.
 */
export function getActionLabel(action: Action): string {
  return ACTION_TYPE_OPTIONS.find(a => a.value === action.type)?.label ?? 'Unknown action';
}

/**
 * Get scope summary text.
 */
export function getScopeSummary(
  scope: AutomationScope,
  customers: CustomerOption[],
  speeds: SpeedOption[]
): { customerText: string; speedText: string } {
  let customerText = 'All customers';
  let speedText = 'All speeds';

  if (!scope.allCustomers && scope.customerIds.length > 0) {
    const names = scope.customerIds
      .map(id => customers.find(c => c.id === id)?.shortName ?? id)
      .slice(0, 3);
    if (scope.customerIds.length > 3) {
      customerText = `${names.join(', ')} +${scope.customerIds.length - 3} more`;
    } else {
      customerText = names.join(', ');
    }
  }

  if (!scope.allSpeeds && scope.speedIds.length > 0) {
    const names = scope.speedIds
      .map(id => speeds.find(s => s.id === id)?.name ?? id)
      .slice(0, 3);
    if (scope.speedIds.length > 3) {
      speedText = `${names.join(', ')} +${scope.speedIds.length - 3} more`;
    } else {
      speedText = names.join(', ');
    }
  }

  return { customerText, speedText };
}

/**
 * Create a new empty condition of a given type.
 */
export function createEmptyCondition(type: ConditionType): Condition {
  const base = {
    id: `cond-${Date.now()}`,
    jobTypeFilter: 'all' as JobTypeFilter,
  };

  switch (type) {
    case 'job_unassigned':
      return { ...base, type: 'job_unassigned' };
    case 'job_assigned':
      return { ...base, type: 'job_assigned' };
    case 'before_scheduled_time':
      return { ...base, type: 'before_scheduled_time', scheduledTimeField: 'pickup', offsetValue: 30, offsetUnit: 'minutes' };
    case 'after_scheduled_time':
      return { ...base, type: 'after_scheduled_time', scheduledTimeField: 'pickup', offsetValue: 15, offsetUnit: 'minutes' };
    case 'at_scheduled_time':
      return { ...base, type: 'at_scheduled_time', scheduledTimeField: 'pickup' };
    case 'status':
      return { ...base, type: 'status', mode: 'any_change' };
    case 'scan':
      return { ...base, type: 'scan', scanTypes: [] };
    default:
      return { ...base, type: 'job_unassigned' };
  }
}

/**
 * Create a new empty action of a given type.
 */
export function createEmptyAction(type: ActionType): Action {
  const base = {
    id: `action-${Date.now()}`,
  };

  switch (type) {
    case 'update_job_status':
      return { ...base, type: 'update_job_status', statusId: '' };
    case 'create_task':
      return { ...base, type: 'create_task', taskTemplateId: '' };
    case 'complete_task':
      return { ...base, type: 'complete_task', taskTemplateId: '' };
    case 'trigger_notification':
      return { ...base, type: 'trigger_notification', notificationTemplateId: '' };
    case 'send_sms':
      return { ...base, type: 'send_sms', recipientType: 'customer_contact', messageContent: '' };
    case 'change_status':
      return { ...base, type: 'change_status', toStatusId: '' };
    default:
      return { ...base, type: 'update_job_status', statusId: '' };
  }
}

/**
 * Create a new empty automation rule.
 */
export function createEmptyAutomation(): Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: '',
    description: '',
    scope: {
      allCustomers: true,
      customerIds: [],
      allSpeeds: true,
      speedIds: [],
    },
    conditionMatchMode: 'all',
    conditions: [],
    actions: [],
    isActive: true,
  };
}
