/**
 * Automation Engine API Client
 *
 * Typed helper functions for communicating with the .NET backend API.
 * Base URL is configured via VITE_API_BASE_URL environment variable.
 */

import type {
  AutomationRule,
  CustomerOption,
  SpeedOption,
  JobStatus,
  TaskTemplate,
  NotificationTemplate,
  SiteOption,
  RegionOption,
  Condition,
  Action,
  ConditionMatchMode,
} from './types';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

// ---------------------------------------------------------------------------
// Types — Backend DTOs (what the API actually returns)
// ---------------------------------------------------------------------------

/** Mirrors DfrntAutomation.Core.DTOs.AutomationRuleDto */
export interface ApiAutomationRule {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  conditionMatchMode: string;
  scope: {
    allCustomers: boolean;
    customerIds: number[];
    allSpeeds: boolean;
    speedIds: number[];
  };
  conditions: ApiCondition[];
  actions: ApiAction[];
  createdDate: string;
  modifiedDate: string | null;
}

export interface ApiCondition {
  id: number | null;
  conditionType: string;
  sortOrder: number;
  jobTypeFilter: string;
  statusConditionMode: string | null;
  statusId: number | null;
  scheduledTimeField: string | null;
  offsetValue: number | null;
  offsetUnit: string | null;
  scanTypes: string[] | null;
  priorityFilter: string | null;
  fromSiteFilter: string | null;
  toSiteFilter: string | null;
  fromRegionFilter: string | null;
  toRegionFilter: string | null;
  timeThreshold: number | null;
}

export interface ApiAction {
  id: number | null;
  actionType: string;
  sortOrder: number;
  toStatusId: number | null;
  fromStatusId: number | null;
  taskTemplateId: number | null;
  taskAssigneeId: number | null;
  taskAssigneeGroupId: number | null;
  taskDueOffsetMinutes: number | null;
  notificationTemplateId: number | null;
  smsRecipientType: string | null;
  smsFixedNumber: string | null;
  smsMessageContent: string | null;
}

export interface ApiExecutionLog {
  id: number;
  ruleId: number;
  ruleName: string;
  jobId: number | null;
  evaluatedAt: string;
  conditionsMet: boolean;
  triggerType: string;
  triggerDetail: string | null;
  actionsExecuted: number;
  actionsSummary: string | null;
  errorMessage: string | null;
  durationMs: number;
  actionDetails: {
    id: number;
    actionType: string;
    success: boolean;
    detail: string | null;
    errorMessage: string | null;
    durationMs: number;
  }[];
}

// ---------------------------------------------------------------------------
// Generic fetch wrapper
// ---------------------------------------------------------------------------

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Detect demo mode — true when no real backend is configured
 * (e.g. running on GitHub Pages with default /api path).
 */
export const IS_DEMO = !import.meta.env.VITE_API_BASE_URL;

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new ApiError(res.status, body || `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  return res.json();
}

// ---------------------------------------------------------------------------
// Demo data — shown when no backend is connected (GitHub Pages)
// ---------------------------------------------------------------------------

const DEMO_RULES: ApiAutomationRule[] = [
  {
    id: 1,
    name: 'Escalate unassigned urgent jobs',
    description: 'If an urgent job remains unassigned for 15 minutes, create a task for dispatch and send SMS to the customer.',
    isActive: true,
    conditionMatchMode: 'all',
    scope: { allCustomers: true, customerIds: [], allSpeeds: false, speedIds: [3] },
    conditions: [
      {
        id: 1, conditionType: 'JobUnassigned', sortOrder: 1, jobTypeFilter: 'All',
        statusConditionMode: null, statusId: null, scheduledTimeField: null,
        offsetValue: null, offsetUnit: null, scanTypes: null,
        priorityFilter: 'ALL', fromSiteFilter: null, toSiteFilter: null,
        fromRegionFilter: null, toRegionFilter: null, timeThreshold: 15,
      },
    ],
    actions: [
      {
        id: 1, actionType: 'CreateTask', sortOrder: 1, toStatusId: null, fromStatusId: null,
        taskTemplateId: 1, taskAssigneeId: null, taskAssigneeGroupId: null,
        taskDueOffsetMinutes: 10, notificationTemplateId: null,
        smsRecipientType: null, smsFixedNumber: null, smsMessageContent: null,
      },
      {
        id: 2, actionType: 'SendSms', sortOrder: 2, toStatusId: null, fromStatusId: null,
        taskTemplateId: null, taskAssigneeId: null, taskAssigneeGroupId: null,
        taskDueOffsetMinutes: null, notificationTemplateId: null,
        smsRecipientType: 'CustomerContact', smsFixedNumber: null,
        smsMessageContent: 'Your delivery is being assigned to a driver. We\'ll notify you shortly.',
      },
    ],
    createdDate: '2026-02-15T09:00:00Z',
    modifiedDate: '2026-03-10T14:30:00Z',
  },
  {
    id: 2,
    name: 'Auto-status on run scan',
    description: 'When a driver scans a job onto their run, update status to In Transit.',
    isActive: true,
    conditionMatchMode: 'all',
    scope: { allCustomers: true, customerIds: [], allSpeeds: true, speedIds: [] },
    conditions: [
      {
        id: 2, conditionType: 'Scan', sortOrder: 1, jobTypeFilter: 'All',
        statusConditionMode: null, statusId: null, scheduledTimeField: null,
        offsetValue: null, offsetUnit: null, scanTypes: ['run_scan'],
        priorityFilter: 'ALL', fromSiteFilter: '1,3', toSiteFilter: null,
        fromRegionFilter: null, toRegionFilter: null, timeThreshold: null,
      },
    ],
    actions: [
      {
        id: 3, actionType: 'UpdateJobStatus', sortOrder: 1, toStatusId: 5, fromStatusId: null,
        taskTemplateId: null, taskAssigneeId: null, taskAssigneeGroupId: null,
        taskDueOffsetMinutes: null, notificationTemplateId: null,
        smsRecipientType: null, smsFixedNumber: null, smsMessageContent: null,
      },
    ],
    createdDate: '2026-01-20T11:00:00Z',
    modifiedDate: null,
  },
  {
    id: 3,
    name: 'Late delivery notification',
    description: 'Send notification 30 minutes after scheduled delivery time if job still in transit.',
    isActive: false,
    conditionMatchMode: 'all',
    scope: { allCustomers: false, customerIds: [101, 205], allSpeeds: true, speedIds: [] },
    conditions: [
      {
        id: 3, conditionType: 'AfterScheduledTime', sortOrder: 1, jobTypeFilter: 'Delivery',
        statusConditionMode: null, statusId: null, scheduledTimeField: 'Delivery',
        offsetValue: 30, offsetUnit: 'minutes', scanTypes: null,
        priorityFilter: '2', fromSiteFilter: null, toSiteFilter: '2,4,7',
        fromRegionFilter: null, toRegionFilter: null, timeThreshold: null,
      },
    ],
    actions: [
      {
        id: 4, actionType: 'TriggerNotification', sortOrder: 1, toStatusId: null, fromStatusId: null,
        taskTemplateId: null, taskAssigneeId: null, taskAssigneeGroupId: null,
        taskDueOffsetMinutes: null, notificationTemplateId: 1,
        smsRecipientType: null, smsFixedNumber: null, smsMessageContent: null,
      },
    ],
    createdDate: '2026-03-01T08:00:00Z',
    modifiedDate: '2026-03-11T16:45:00Z',
  },
];

// ---------------------------------------------------------------------------
// Automation Rule CRUD
// ---------------------------------------------------------------------------

export interface ListAutomationsParams {
  customerId?: number;
  speedId?: number;
  search?: string;
  isActive?: boolean;
}

/** GET /api/automations — list rules with optional filters */
export async function fetchAutomations(
  params?: ListAutomationsParams,
): Promise<ApiAutomationRule[]> {
  if (IS_DEMO) return DEMO_RULES;
  const qs = new URLSearchParams();
  if (params?.customerId != null) qs.set('customerId', String(params.customerId));
  if (params?.speedId != null) qs.set('speedId', String(params.speedId));
  if (params?.search) qs.set('search', params.search);
  if (params?.isActive != null) qs.set('isActive', String(params.isActive));
  const query = qs.toString();
  return apiFetch<ApiAutomationRule[]>(`/automations${query ? `?${query}` : ''}`);
}

/** GET /api/automations/{id} — get a single rule */
export async function fetchAutomation(id: number): Promise<ApiAutomationRule> {
  if (IS_DEMO) return DEMO_RULES.find(r => r.id === id) ?? DEMO_RULES[0];
  return apiFetch<ApiAutomationRule>(`/automations/${id}`);
}

/** POST /api/automations — create a new rule */
export async function createAutomation(
  rule: Omit<ApiAutomationRule, 'id' | 'createdDate' | 'modifiedDate'>,
): Promise<ApiAutomationRule> {
  if (IS_DEMO) return { ...rule, id: Date.now(), createdDate: new Date().toISOString(), modifiedDate: null } as ApiAutomationRule;
  return apiFetch<ApiAutomationRule>('/automations', {
    method: 'POST',
    body: JSON.stringify(rule),
  });
}

/** PUT /api/automations/{id} — update an existing rule */
export async function updateAutomation(
  id: number,
  rule: Omit<ApiAutomationRule, 'id' | 'createdDate' | 'modifiedDate'>,
): Promise<ApiAutomationRule> {
  if (IS_DEMO) return { ...rule, id, createdDate: new Date().toISOString(), modifiedDate: new Date().toISOString() } as ApiAutomationRule;
  return apiFetch<ApiAutomationRule>(`/automations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(rule),
  });
}

/** DELETE /api/automations/{id} — soft-delete a rule */
export async function deleteAutomation(id: number): Promise<void> {
  if (IS_DEMO) return;
  await apiFetch<void>(`/automations/${id}`, { method: 'DELETE' });
}

/** POST /api/automations/{id}/toggle — toggle rule active/inactive */
export async function toggleAutomation(id: number): Promise<void> {
  if (IS_DEMO) return;
  await apiFetch<void>(`/automations/${id}/toggle`, { method: 'POST' });
}

/**
 * POST /api/automations/{id}/test?jobId={jobId} — dry-run test a rule against a job.
 * @scaffolded Intentionally not called from the UI yet — the test panel component
 * needs to be built. Wire this up when the "Test Rule" modal is added.
 */
export async function testAutomation(
  id: number,
  jobId: number,
): Promise<ApiExecutionLog> {
  return apiFetch<ApiExecutionLog>(
    `/automations/${id}/test?jobId=${jobId}`,
    { method: 'POST' },
  );
}

/**
 * POST /api/automations/evaluate — trigger event evaluation.
 * @scaffolded Intentionally not called from the frontend — this endpoint is
 * called by backend services (e.g. scan handlers, status change hooks).
 * Exposed here for completeness; do not wire to a UI button.
 */
export async function evaluateAutomation(event: {
  triggerType: string;
  jobId?: number;
  customerId?: number;
  speedId?: number;
  newStatusId?: number;
  oldStatusId?: number;
  scanType?: string;
  triggerDetail?: string;
}): Promise<void> {
  await apiFetch<void>('/automations/evaluate', {
    method: 'POST',
    body: JSON.stringify(event),
  });
}

/** GET /api/automations/logs — execution logs with optional filters */
export async function fetchExecutionLogs(params?: {
  ruleId?: number;
  jobId?: number;
  from?: string;
  to?: string;
  triggerType?: string;
  conditionsMet?: boolean;
  skip?: number;
  take?: number;
}): Promise<ApiExecutionLog[]> {
  const qs = new URLSearchParams();
  if (params?.ruleId != null) qs.set('ruleId', String(params.ruleId));
  if (params?.jobId != null) qs.set('jobId', String(params.jobId));
  if (params?.from) qs.set('from', params.from);
  if (params?.to) qs.set('to', params.to);
  if (params?.triggerType) qs.set('triggerType', params.triggerType);
  if (params?.conditionsMet != null)
    qs.set('conditionsMet', String(params.conditionsMet));
  if (params?.skip != null) qs.set('skip', String(params.skip));
  if (params?.take != null) qs.set('take', String(params.take));
  const query = qs.toString();
  return apiFetch<ApiExecutionLog[]>(`/automations/logs${query ? `?${query}` : ''}`);
}

// ---------------------------------------------------------------------------
// Reference data endpoints
// ---------------------------------------------------------------------------

/**
 * Fetch customers from the existing TMS API.
 * @scaffolded The exact endpoint depends on how the TMS API is exposed.
 * Currently returns an empty array — wire to the real customers endpoint
 * (e.g. GET /api/clients) once the base URL and auth are configured.
 */
export async function fetchCustomers(): Promise<CustomerOption[]> {
  // TODO: Wire to real TMS endpoint — e.g. GET /api/clients
  // The backend reads from tucClient (ucclID, ucclName, ucclCode)
  return [];
}

/**
 * Fetch speeds/service levels from the existing TMS API.
 * @scaffolded Wire to the real speeds endpoint once available.
 * The backend reads from tucJobType (ucjtID, ucjtName, ucjtCode).
 */
export async function fetchSpeeds(): Promise<SpeedOption[]> {
  // TODO: Wire to real TMS endpoint
  return [];
}

/**
 * Fetch job statuses from the existing TMS API.
 * @scaffolded Wire to the real statuses endpoint once available.
 * The backend reads from tucJobStatus (ucjsID, ucjsName, ucjsCode).
 */
export async function fetchJobStatuses(): Promise<JobStatus[]> {
  // TODO: Wire to real TMS endpoint
  return [];
}

/**
 * Fetch task templates from the existing TMS API.
 * @scaffolded Wire to the real task templates endpoint once available.
 * The backend reads from tucEventTemplate (ucetID, ucetName).
 */
export async function fetchTaskTemplates(): Promise<TaskTemplate[]> {
  // TODO: Wire to real TMS endpoint
  return [];
}

/**
 * Fetch notification templates from the existing TMS API.
 * @scaffolded Wire to the real notification templates endpoint once available.
 */
export async function fetchNotificationTemplates(): Promise<NotificationTemplate[]> {
  // TODO: Wire to real TMS endpoint
  return [];
}

/**
 * Fetch sites from the existing TMS API.
 * @scaffolded Wire to the real sites endpoint once available.
 */
export async function fetchSites(): Promise<SiteOption[]> {
  // TODO: Wire to real TMS endpoint
  return [];
}

/**
 * Fetch regions from the existing TMS API.
 * @scaffolded Wire to the real regions endpoint once available.
 */
export async function fetchRegions(): Promise<RegionOption[]> {
  // TODO: Wire to real TMS endpoint
  return [];
}

// ---------------------------------------------------------------------------
// DTO ↔ Frontend type mappers
// ---------------------------------------------------------------------------

/**
 * Convert a backend API rule DTO to the frontend AutomationRule type.
 * The frontend uses string IDs and a different condition/action shape.
 */
export function apiRuleToFrontend(api: ApiAutomationRule): AutomationRule {
  return {
    id: String(api.id),
    name: api.name,
    description: api.description ?? undefined,
    isActive: api.isActive,
    conditionMatchMode: api.conditionMatchMode as ConditionMatchMode,
    scope: {
      allCustomers: api.scope.allCustomers,
      customerIds: api.scope.customerIds.map(String),
      allSpeeds: api.scope.allSpeeds,
      speedIds: api.scope.speedIds.map(String),
    },
    conditions: api.conditions.map(apiConditionToFrontend),
    actions: api.actions.map(apiActionToFrontend),
    createdAt: api.createdDate,
    updatedAt: api.modifiedDate ?? api.createdDate,
  };
}

function apiConditionToFrontend(c: ApiCondition): Condition {
  const parseCsv = (s: string | null): string[] =>
    s ? s.split(',').map(v => v.trim()).filter(Boolean) : [];

  const base = {
    id: c.id != null ? String(c.id) : `cond-${Date.now()}-${Math.random()}`,
    jobTypeFilter: mapJobTypeFilter(c.jobTypeFilter),
    priorityFilter: c.priorityFilter ?? 'ALL',
    fromSiteIds: parseCsv(c.fromSiteFilter),
    toSiteIds: parseCsv(c.toSiteFilter),
    fromRegionIds: parseCsv(c.fromRegionFilter),
    toRegionIds: parseCsv(c.toRegionFilter),
  };

  const ct = c.conditionType.toLowerCase().replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

  switch (ct) {
    case 'jobunassigned':
    case 'job_unassigned':
      return { ...base, type: 'job_unassigned', timeThresholdMinutes: c.timeThreshold ?? undefined };
    case 'jobassigned':
    case 'job_assigned':
      return { ...base, type: 'job_assigned', timeThresholdMinutes: c.timeThreshold ?? undefined };
    case 'beforescheduledtime':
    case 'before_scheduled_time':
      return {
        ...base,
        type: 'before_scheduled_time',
        scheduledTimeField: (c.scheduledTimeField?.toLowerCase() ?? 'pickup') as 'pickup' | 'delivery' | 'flight',
        offsetValue: c.offsetValue ?? 0,
        offsetUnit: (c.offsetUnit ?? 'minutes') as 'minutes' | 'hours',
      };
    case 'afterscheduledtime':
    case 'after_scheduled_time':
      return {
        ...base,
        type: 'after_scheduled_time',
        scheduledTimeField: (c.scheduledTimeField?.toLowerCase() ?? 'pickup') as 'pickup' | 'delivery' | 'flight',
        offsetValue: c.offsetValue ?? 0,
        offsetUnit: (c.offsetUnit ?? 'minutes') as 'minutes' | 'hours',
      };
    case 'atscheduledtime':
    case 'at_scheduled_time':
      return {
        ...base,
        type: 'at_scheduled_time',
        scheduledTimeField: (c.scheduledTimeField?.toLowerCase() ?? 'pickup') as 'pickup' | 'delivery' | 'flight',
      };
    case 'status':
      return {
        ...base,
        type: 'status',
        mode: mapStatusMode(c.statusConditionMode),
        statusId: c.statusId != null ? String(c.statusId) : undefined,
      };
    case 'scan':
      return {
        ...base,
        type: 'scan',
        scanTypes: (c.scanTypes ?? []) as Condition extends { type: 'scan'; scanTypes: infer S } ? S : never,
      };
    default:
      return { ...base, type: 'job_unassigned' };
  }
}

function mapJobTypeFilter(s: string): 'all' | 'child_1_pickup' | 'child_2_flight' | 'child_3_delivery' | 'standard' {
  switch (s.toLowerCase()) {
    case 'pickup': return 'child_1_pickup';
    case 'delivery': return 'child_3_delivery';
    case 'transfer': return 'child_2_flight';
    default: return 'all';
  }
}

function mapStatusMode(s: string | null): 'any_change' | 'changes_to' | 'leaves' | 'is_not' {
  if (!s) return 'any_change';
  switch (s.toLowerCase().replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()) {
    case 'anychange':
    case 'any_change':
      return 'any_change';
    case 'changesto':
    case 'changes_to':
      return 'changes_to';
    case 'leaves':
      return 'leaves';
    case 'isnot':
    case 'is_not':
      return 'is_not';
    default:
      return 'any_change';
  }
}

function apiActionToFrontend(a: ApiAction): Action {
  const base = {
    id: a.id != null ? String(a.id) : `action-${Date.now()}-${Math.random()}`,
  };

  const at = a.actionType.toLowerCase().replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

  switch (at) {
    case 'updatejobstatus':
    case 'update_job_status':
      return { ...base, type: 'update_job_status', statusId: String(a.toStatusId ?? '') };
    case 'createtask':
    case 'create_task':
      return {
        ...base,
        type: 'create_task',
        taskTemplateId: String(a.taskTemplateId ?? ''),
        assigneeId: a.taskAssigneeId != null ? String(a.taskAssigneeId) : undefined,
        assigneeGroupId: a.taskAssigneeGroupId != null ? String(a.taskAssigneeGroupId) : undefined,
        dueTimeOffsetMinutes: a.taskDueOffsetMinutes ?? undefined,
      };
    case 'completetask':
    case 'complete_task':
      return { ...base, type: 'complete_task', taskTemplateId: String(a.taskTemplateId ?? '') };
    case 'triggernotification':
    case 'trigger_notification':
      return { ...base, type: 'trigger_notification', notificationTemplateId: String(a.notificationTemplateId ?? '') };
    case 'sendsms':
    case 'send_sms':
      return {
        ...base,
        type: 'send_sms',
        recipientType: (a.smsRecipientType?.toLowerCase().replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() ?? 'customer_contact') as 'customer_contact' | 'driver' | 'fixed_number',
        fixedPhoneNumber: a.smsFixedNumber ?? undefined,
        messageContent: a.smsMessageContent ?? '',
      };
    case 'changestatus':
    case 'change_status':
      return {
        ...base,
        type: 'change_status',
        fromStatusId: a.fromStatusId != null ? String(a.fromStatusId) : undefined,
        toStatusId: String(a.toStatusId ?? ''),
      };
    default:
      return { ...base, type: 'update_job_status', statusId: '' };
  }
}

/**
 * Convert a frontend AutomationRule to the backend create/update request shape.
 */
export function frontendRuleToApi(
  rule: AutomationRule,
): Omit<ApiAutomationRule, 'id' | 'createdDate' | 'modifiedDate'> {
  return {
    name: rule.name,
    description: rule.description ?? null,
    isActive: rule.isActive,
    conditionMatchMode: rule.conditionMatchMode,
    scope: {
      allCustomers: rule.scope.allCustomers,
      customerIds: rule.scope.customerIds.map(Number).filter((n) => !isNaN(n)),
      allSpeeds: rule.scope.allSpeeds,
      speedIds: rule.scope.speedIds.map(Number).filter((n) => !isNaN(n)),
    },
    conditions: rule.conditions.map((c, i) => frontendConditionToApi(c, i)),
    actions: rule.actions.map((a, i) => frontendActionToApi(a, i)),
  };
}

function frontendConditionToApi(c: Condition, index: number): ApiCondition {
  const joinCsv = (arr?: string[]): string | null =>
    arr && arr.length > 0 ? arr.join(',') : null;

  const base: ApiCondition = {
    id: null,
    conditionType: c.type
      .split('_')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(''),
    sortOrder: index + 1,
    jobTypeFilter: mapJobTypeFilterToApi(c.jobTypeFilter),
    statusConditionMode: null,
    statusId: null,
    scheduledTimeField: null,
    offsetValue: null,
    offsetUnit: null,
    scanTypes: null,
    priorityFilter: c.priorityFilter ?? 'ALL',
    fromSiteFilter: joinCsv(c.fromSiteIds),
    toSiteFilter: joinCsv(c.toSiteIds),
    fromRegionFilter: joinCsv(c.fromRegionIds),
    toRegionFilter: joinCsv(c.toRegionIds),
    timeThreshold: null,
  };

  switch (c.type) {
    case 'job_unassigned':
    case 'job_assigned':
      base.timeThreshold = c.timeThresholdMinutes ?? null;
      break;
    case 'before_scheduled_time':
    case 'after_scheduled_time':
      base.scheduledTimeField = c.scheduledTimeField.charAt(0).toUpperCase() + c.scheduledTimeField.slice(1);
      base.offsetValue = c.offsetValue;
      base.offsetUnit = c.offsetUnit;
      break;
    case 'at_scheduled_time':
      base.scheduledTimeField = c.scheduledTimeField.charAt(0).toUpperCase() + c.scheduledTimeField.slice(1);
      break;
    case 'status':
      base.statusConditionMode = c.mode
        .split('_')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('');
      base.statusId = c.statusId != null ? Number(c.statusId) : null;
      break;
    case 'scan':
      base.scanTypes = c.scanTypes as string[];
      break;
  }

  return base;
}

function mapJobTypeFilterToApi(s: string): string {
  switch (s) {
    case 'child_1_pickup': return 'Pickup';
    case 'child_2_flight': return 'Transfer';
    case 'child_3_delivery': return 'Delivery';
    case 'standard': return 'Collection';
    default: return 'All';
  }
}

function frontendActionToApi(a: Action, index: number): ApiAction {
  const base: ApiAction = {
    id: null,
    actionType: a.type
      .split('_')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(''),
    sortOrder: index + 1,
    toStatusId: null,
    fromStatusId: null,
    taskTemplateId: null,
    taskAssigneeId: null,
    taskAssigneeGroupId: null,
    taskDueOffsetMinutes: null,
    notificationTemplateId: null,
    smsRecipientType: null,
    smsFixedNumber: null,
    smsMessageContent: null,
  };

  switch (a.type) {
    case 'update_job_status':
      base.toStatusId = Number(a.statusId) || null;
      break;
    case 'create_task':
      base.taskTemplateId = Number(a.taskTemplateId) || null;
      base.taskAssigneeId = a.assigneeId ? Number(a.assigneeId) : null;
      base.taskAssigneeGroupId = a.assigneeGroupId ? Number(a.assigneeGroupId) : null;
      base.taskDueOffsetMinutes = a.dueTimeOffsetMinutes ?? null;
      break;
    case 'complete_task':
      base.taskTemplateId = Number(a.taskTemplateId) || null;
      break;
    case 'trigger_notification':
      base.notificationTemplateId = Number(a.notificationTemplateId) || null;
      break;
    case 'send_sms':
      base.smsRecipientType = a.recipientType
        .split('_')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('');
      base.smsFixedNumber = a.fixedPhoneNumber ?? null;
      base.smsMessageContent = a.messageContent;
      break;
    case 'change_status':
      base.fromStatusId = a.fromStatusId ? Number(a.fromStatusId) : null;
      base.toStatusId = Number(a.toStatusId) || null;
      break;
  }

  return base;
}
