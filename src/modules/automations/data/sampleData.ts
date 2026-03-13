// Sample data for Automations module

import type {
  AutomationRule,
  CustomerOption,
  SpeedOption,
  JobStatus,
  TaskTemplate,
  NotificationTemplate,
  SiteOption,
  RegionOption,
} from '../types';

// ============================================
// REFERENCE DATA (would come from API)
// ============================================

export const sampleCustomers: CustomerOption[] = [
  { id: 'cust-1', name: '1976 Limited', shortName: '1976' },
  { id: 'cust-2', name: 'Acme Corporation', shortName: 'ACME' },
  { id: 'cust-3', name: 'Global Logistics Inc', shortName: 'GLI' },
  { id: 'cust-4', name: 'Metro Traders', shortName: 'Metro' },
  { id: 'cust-5', name: 'Prime Distribution', shortName: 'Prime' },
  { id: 'cust-6', name: 'Swift Transport', shortName: 'Swift' },
  { id: 'cust-7', name: 'Velocity Couriers', shortName: 'Velocity' },
  { id: 'cust-8', name: 'Express Freight', shortName: 'Express' },
];

export const sampleSpeeds: SpeedOption[] = [
  { id: 'speed-1', name: 'Standard', code: 'STD' },
  { id: 'speed-2', name: 'Express', code: 'EXP' },
  { id: 'speed-3', name: 'Same Day', code: 'SD' },
  { id: 'speed-4', name: 'Overnight', code: 'ON' },
  { id: 'speed-5', name: 'Priority', code: 'PRI' },
  { id: 'speed-6', name: 'Economy', code: 'ECO' },
];

export const sampleJobStatuses: JobStatus[] = [
  { id: 'status-1', name: 'Pending', code: 'PND' },
  { id: 'status-2', name: 'Assigned', code: 'ASG' },
  { id: 'status-3', name: 'In Transit', code: 'TRN' },
  { id: 'status-4', name: 'Picked Up', code: 'PKD' },
  { id: 'status-5', name: 'At Depot', code: 'DEP' },
  { id: 'status-6', name: 'Out for Delivery', code: 'OFD' },
  { id: 'status-7', name: 'Delivered', code: 'DLV' },
  { id: 'status-8', name: 'Failed', code: 'FLD' },
  { id: 'status-9', name: 'Cancelled', code: 'CAN' },
  { id: 'status-10', name: 'On Hold', code: 'HLD' },
];

export const sampleTaskTemplates: TaskTemplate[] = [
  { id: 'task-1', name: 'Follow up on late pickup' },
  { id: 'task-2', name: 'Contact customer' },
  { id: 'task-3', name: 'Verify delivery address' },
  { id: 'task-4', name: 'Check driver availability' },
  { id: 'task-5', name: 'Escalate to supervisor' },
  { id: 'task-6', name: 'Update customer on delay' },
  { id: 'task-7', name: 'Reattempt delivery' },
  { id: 'task-8', name: 'Process return' },
];

export const sampleNotificationTemplates: NotificationTemplate[] = [
  { id: 'notif-1', name: 'Pickup Confirmation', type: 'single' },
  { id: 'notif-2', name: 'Delivery Confirmation', type: 'single' },
  { id: 'notif-3', name: 'Delay Notification', type: 'single' },
  { id: 'notif-4', name: 'Unassigned Pickup Overdue', type: 'single' },
  { id: 'notif-5', name: 'Escalation Email', type: 'single' },
  { id: 'notif-6', name: 'Daily Summary', type: 'group' },
  { id: 'notif-7', name: 'Driver Assignment Alert', type: 'single' },
  { id: 'notif-8', name: 'Scan Event Notification', type: 'group' },
];

export const sampleSites: SiteOption[] = [
  { id: 'site-1', name: 'Auckland CBD', code: 'AKL' },
  { id: 'site-2', name: 'East Tamaki', code: 'ETK' },
  { id: 'site-3', name: 'Penrose', code: 'PNR' },
  { id: 'site-4', name: 'Hamilton', code: 'HML' },
  { id: 'site-5', name: 'Christchurch', code: 'CHC' },
  { id: 'site-6', name: 'Wellington', code: 'WLG' },
];

export const sampleRegions: RegionOption[] = [
  { id: 'region-1', name: 'Auckland' },
  { id: 'region-2', name: 'Waikato' },
  { id: 'region-3', name: 'Bay of Plenty' },
  { id: 'region-4', name: 'Wellington' },
  { id: 'region-5', name: 'Canterbury' },
];

// ============================================
// SAMPLE AUTOMATIONS
// ============================================

export const sampleAutomations: AutomationRule[] = [
  // Example 1: Unassigned job reminder
  {
    id: 'auto-1',
    name: 'Unassigned Pickup Reminder',
    description: 'Notify dispatcher when a pickup job remains unassigned 15 minutes after scheduled time',
    scope: {
      allCustomers: true,
      customerIds: [],
      allSpeeds: true,
      speedIds: [],
    },
    conditionMatchMode: 'all',
    conditions: [
      {
        id: 'cond-1-1',
        type: 'job_unassigned',
        jobTypeFilter: 'standard',
        timeThresholdMinutes: 15,
        fromSiteIds: ['site-1', 'site-2'],
      },
      {
        id: 'cond-1-2',
        type: 'after_scheduled_time',
        jobTypeFilter: 'all',
        scheduledTimeField: 'pickup',
        offsetValue: 15,
        offsetUnit: 'minutes',
      },
    ],
    actions: [
      {
        id: 'action-1-1',
        type: 'trigger_notification',
        notificationTemplateId: 'notif-4',
      },
    ],
    isActive: true,
    createdAt: '2024-11-20T10:00:00Z',
    updatedAt: '2024-11-20T10:00:00Z',
    createdBy: 'admin',
  },
  // Example 2: Delivery scan confirmation
  {
    id: 'auto-2',
    name: 'Delivery Scan SMS',
    description: 'Send SMS to customer contact when delivery scan occurs',
    scope: {
      allCustomers: false,
      customerIds: ['cust-2'],
      allSpeeds: true,
      speedIds: [],
    },
    conditionMatchMode: 'all',
    conditions: [
      {
        id: 'cond-2-1',
        type: 'scan',
        jobTypeFilter: 'child_3_delivery',
        scanTypes: ['transfer_scan'],
      },
    ],
    actions: [
      {
        id: 'action-2-1',
        type: 'send_sms',
        recipientType: 'customer_contact',
        messageContent: 'Your delivery has been completed. Thank you for choosing Deliver Different!',
      },
    ],
    isActive: true,
    createdAt: '2024-11-18T14:30:00Z',
    updatedAt: '2024-11-22T09:15:00Z',
    createdBy: 'admin',
  },
  // Example 3: Late pickup escalation
  {
    id: 'auto-3',
    name: 'Express Late Pickup Escalation',
    description: 'Create follow-up task and notify supervisor when Express pickup is 30 mins late and not picked up',
    scope: {
      allCustomers: true,
      customerIds: [],
      allSpeeds: false,
      speedIds: ['speed-2'],
    },
    conditionMatchMode: 'all',
    conditions: [
      {
        id: 'cond-3-1',
        type: 'after_scheduled_time',
        jobTypeFilter: 'child_1_pickup',
        scheduledTimeField: 'pickup',
        offsetValue: 30,
        offsetUnit: 'minutes',
      },
      {
        id: 'cond-3-2',
        type: 'status',
        jobTypeFilter: 'child_1_pickup',
        mode: 'is_not',
        statusId: 'status-4',
      },
    ],
    actions: [
      {
        id: 'action-3-1',
        type: 'create_task',
        taskTemplateId: 'task-1',
        assigneeGroupId: 'dispatcher-group',
      },
      {
        id: 'action-3-2',
        type: 'trigger_notification',
        notificationTemplateId: 'notif-5',
      },
    ],
    isActive: true,
    createdAt: '2024-11-15T08:00:00Z',
    updatedAt: '2024-11-25T11:45:00Z',
    createdBy: 'admin',
  },
  // Example 4: Auto-update status on assignment
  {
    id: 'auto-4',
    name: 'Update Status on Assignment',
    description: 'Automatically change status from Pending to Assigned when job is assigned',
    scope: {
      allCustomers: true,
      customerIds: [],
      allSpeeds: true,
      speedIds: [],
    },
    conditionMatchMode: 'all',
    conditions: [
      {
        id: 'cond-4-1',
        type: 'job_assigned',
        jobTypeFilter: 'all',
      },
    ],
    actions: [
      {
        id: 'action-4-1',
        type: 'change_status',
        fromStatusId: 'status-1',
        toStatusId: 'status-2',
      },
    ],
    isActive: true,
    createdAt: '2024-11-10T16:20:00Z',
    updatedAt: '2024-11-10T16:20:00Z',
    createdBy: 'admin',
  },
  // Example 5: Complete task on status change
  {
    id: 'auto-5',
    name: 'Complete Pickup Task on Pickup',
    description: 'Mark the pickup confirmation task as complete when status changes to Picked Up',
    scope: {
      allCustomers: true,
      customerIds: [],
      allSpeeds: true,
      speedIds: [],
    },
    conditionMatchMode: 'all',
    conditions: [
      {
        id: 'cond-5-1',
        type: 'status',
        jobTypeFilter: 'child_1_pickup',
        mode: 'changes_to',
        statusId: 'status-4',
      },
    ],
    actions: [
      {
        id: 'action-5-1',
        type: 'complete_task',
        taskTemplateId: 'task-2',
      },
    ],
    isActive: false,
    createdAt: '2024-11-08T12:00:00Z',
    updatedAt: '2024-11-20T14:30:00Z',
    createdBy: 'admin',
  },
  // Example 6: Depot scan notification
  {
    id: 'auto-6',
    name: 'Inwards Depot Scan Alert',
    description: 'Notify when package arrives at depot via sort scan',
    scope: {
      allCustomers: false,
      customerIds: ['cust-3', 'cust-5'],
      allSpeeds: false,
      speedIds: ['speed-2', 'speed-3'],
    },
    conditionMatchMode: 'any',
    conditions: [
      {
        id: 'cond-6-1',
        type: 'scan',
        jobTypeFilter: 'all',
        scanTypes: ['sort_scan', 'inwards_depot_scan'],
        priorityFilter: '2',
        toSiteIds: ['site-3', 'site-5'],
        toRegionIds: ['region-1', 'region-5'],
      },
    ],
    actions: [
      {
        id: 'action-6-1',
        type: 'trigger_notification',
        notificationTemplateId: 'notif-8',
      },
      {
        id: 'action-6-2',
        type: 'update_job_status',
        statusId: 'status-5',
      },
    ],
    isActive: true,
    createdAt: '2024-11-05T09:00:00Z',
    updatedAt: '2024-11-24T16:00:00Z',
    createdBy: 'admin',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get job status by ID.
 */
export function getJobStatusById(id: string): JobStatus | undefined {
  return sampleJobStatuses.find(s => s.id === id);
}

/**
 * Get task template by ID.
 */
export function getTaskTemplateById(id: string): TaskTemplate | undefined {
  return sampleTaskTemplates.find(t => t.id === id);
}

/**
 * Get notification template by ID.
 */
export function getNotificationTemplateById(id: string): NotificationTemplate | undefined {
  return sampleNotificationTemplates.find(n => n.id === id);
}

/**
 * Get customer by ID.
 */
export function getCustomerById(id: string): CustomerOption | undefined {
  return sampleCustomers.find(c => c.id === id);
}

/**
 * Get speed by ID.
 */
export function getSpeedById(id: string): SpeedOption | undefined {
  return sampleSpeeds.find(s => s.id === id);
}
