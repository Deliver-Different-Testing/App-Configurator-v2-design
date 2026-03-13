import { X } from 'lucide-react';
import type {
  Action,
  ActionType,
  SmsRecipientType,
} from '../types';
import {
  ACTION_TYPE_OPTIONS,
  SMS_RECIPIENT_OPTIONS,
  createEmptyAction,
} from '../types';
import type { JobStatus, TaskTemplate, NotificationTemplate } from '../types';

interface ActionRowProps {
  action: Action;
  jobStatuses: JobStatus[];
  taskTemplates: TaskTemplate[];
  notificationTemplates: NotificationTemplate[];
  onChange: (action: Action) => void;
  onRemove: () => void;
}

export function ActionRow({
  action,
  jobStatuses,
  taskTemplates,
  notificationTemplates,
  onChange,
  onRemove,
}: ActionRowProps) {
  // Handle action type change - creates new action with defaults
  const handleTypeChange = (type: ActionType) => {
    const newAction = createEmptyAction(type);
    newAction.id = action.id; // Preserve ID
    onChange(newAction);
  };

  // Render type-specific fields
  const renderTypeFields = () => {
    switch (action.type) {
      case 'update_job_status':
        return (
          <div className="flex items-center gap-2">
            <label className="text-sm text-text-secondary">Set status to:</label>
            <select
              value={action.statusId}
              onChange={(e) =>
                onChange({
                  ...action,
                  statusId: e.target.value,
                })
              }
              className="px-2 py-1.5 text-sm border border-border rounded bg-white text-text-primary focus:outline-none focus:border-brand-cyan"
            >
              <option value="">Select status...</option>
              {jobStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        );

      case 'create_task':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm text-text-secondary">Task template:</label>
              <select
                value={action.taskTemplateId}
                onChange={(e) =>
                  onChange({
                    ...action,
                    taskTemplateId: e.target.value,
                  })
                }
                className="px-2 py-1.5 text-sm border border-border rounded bg-white text-text-primary focus:outline-none focus:border-brand-cyan"
              >
                <option value="">Select task template...</option>
                {taskTemplates.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-text-secondary">Due time offset:</label>
              <input
                type="number"
                value={action.dueTimeOffsetMinutes ?? ''}
                onChange={(e) =>
                  onChange({
                    ...action,
                    dueTimeOffsetMinutes: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined,
                  })
                }
                placeholder="minutes"
                className="w-24 px-2 py-1.5 text-sm border border-border rounded bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-cyan"
              />
              <span className="text-xs text-text-muted">minutes (optional)</span>
            </div>
          </div>
        );

      case 'complete_task':
        return (
          <div className="flex items-center gap-2">
            <label className="text-sm text-text-secondary">Task to complete:</label>
            <select
              value={action.taskTemplateId}
              onChange={(e) =>
                onChange({
                  ...action,
                  taskTemplateId: e.target.value,
                })
              }
              className="px-2 py-1.5 text-sm border border-border rounded bg-white text-text-primary focus:outline-none focus:border-brand-cyan"
            >
              <option value="">Select task template...</option>
              {taskTemplates.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
          </div>
        );

      case 'trigger_notification':
        return (
          <div className="flex items-center gap-2">
            <label className="text-sm text-text-secondary">Notification:</label>
            <select
              value={action.notificationTemplateId}
              onChange={(e) =>
                onChange({
                  ...action,
                  notificationTemplateId: e.target.value,
                })
              }
              className="px-2 py-1.5 text-sm border border-border rounded bg-white text-text-primary focus:outline-none focus:border-brand-cyan"
            >
              <option value="">Select notification...</option>
              {notificationTemplates.map((notif) => (
                <option key={notif.id} value={notif.id}>
                  {notif.name} ({notif.type})
                </option>
              ))}
            </select>
          </div>
        );

      case 'send_sms':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm text-text-secondary">Send to:</label>
              <select
                value={action.recipientType}
                onChange={(e) =>
                  onChange({
                    ...action,
                    recipientType: e.target.value as SmsRecipientType,
                    fixedPhoneNumber:
                      e.target.value === 'fixed_number'
                        ? action.fixedPhoneNumber
                        : undefined,
                  })
                }
                className="px-2 py-1.5 text-sm border border-border rounded bg-white text-text-primary focus:outline-none focus:border-brand-cyan"
              >
                {SMS_RECIPIENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {action.recipientType === 'fixed_number' && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-text-secondary">Phone number:</label>
                <input
                  type="tel"
                  value={action.fixedPhoneNumber || ''}
                  onChange={(e) =>
                    onChange({
                      ...action,
                      fixedPhoneNumber: e.target.value,
                    })
                  }
                  placeholder="+1 555 123 4567"
                  className="w-48 px-2 py-1.5 text-sm border border-border rounded bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-cyan"
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-text-secondary mb-1">Message:</label>
              <textarea
                value={action.messageContent}
                onChange={(e) =>
                  onChange({
                    ...action,
                    messageContent: e.target.value,
                  })
                }
                placeholder="Enter message content... Use [JobNumber], [CustomerName] for variables."
                rows={2}
                className="w-full px-2 py-1.5 text-sm border border-border rounded bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-cyan resize-y"
              />
            </div>
          </div>
        );

      case 'change_status':
        return (
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-sm text-text-secondary">From:</label>
            <select
              value={action.fromStatusId || ''}
              onChange={(e) =>
                onChange({
                  ...action,
                  fromStatusId: e.target.value || undefined,
                })
              }
              className="px-2 py-1.5 text-sm border border-border rounded bg-white text-text-primary focus:outline-none focus:border-brand-cyan"
            >
              <option value="">(any status)</option>
              {jobStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
            <span className="text-sm text-text-secondary">→</span>
            <label className="text-sm text-text-secondary">To:</label>
            <select
              value={action.toStatusId}
              onChange={(e) =>
                onChange({
                  ...action,
                  toStatusId: e.target.value,
                })
              }
              className="px-2 py-1.5 text-sm border border-border rounded bg-white text-text-primary focus:outline-none focus:border-brand-cyan"
            >
              <option value="">Select status...</option>
              {jobStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-white border border-border rounded-lg">
      {/* Action Type */}
      <div className="flex-shrink-0">
        <select
          value={action.type}
          onChange={(e) => handleTypeChange(e.target.value as ActionType)}
          className="px-3 py-1.5 text-sm border border-border rounded bg-white text-text-primary font-medium focus:outline-none focus:border-brand-cyan"
        >
          {ACTION_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.icon} {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Action Details */}
      <div className="flex-1">{renderTypeFields()}</div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 p-1 text-text-muted hover:text-error transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
