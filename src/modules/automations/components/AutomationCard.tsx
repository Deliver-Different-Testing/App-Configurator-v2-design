import { ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
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
import {
  getAutomationIcons,
  getTriggerSummary,
  getActionSummary,
  getScopeSummary,
} from '../types';
import { AutomationEditForm } from './AutomationEditForm';

interface AutomationCardProps {
  automation: AutomationRule;
  customers: CustomerOption[];
  speeds: SpeedOption[];
  jobStatuses: JobStatus[];
  taskTemplates: TaskTemplate[];
  notificationTemplates: NotificationTemplate[];
  sites: SiteOption[];
  regions: RegionOption[];
  isExpanded: boolean;
  isNew?: boolean;
  onToggle: () => void;
  onSave: (automation: AutomationRule) => void;
  onDelete: () => void;
  onCancel?: () => void;
}

export function AutomationCard({
  automation,
  customers,
  speeds,
  jobStatuses,
  taskTemplates,
  notificationTemplates,
  sites,
  regions,
  isExpanded,
  isNew = false,
  onToggle,
  onSave,
  onDelete,
  onCancel,
}: AutomationCardProps) {
  const icons = getAutomationIcons(automation);
  const triggerSummary = getTriggerSummary(automation);
  const actionSummary = getActionSummary(automation);
  const { customerText, speedText } = getScopeSummary(automation.scope, customers, speeds);

  // If new and expanded, just show the form
  if (isNew && isExpanded) {
    return (
      <div className="border border-brand-cyan rounded-lg overflow-hidden shadow-lg">
        <div className="bg-brand-cyan/10 px-4 py-3 border-b border-brand-cyan/30">
          <h3 className="text-lg font-semibold text-brand-cyan">New Automation</h3>
        </div>
        <AutomationEditForm
          automation={automation}
          customers={customers}
          speeds={speeds}
          jobStatuses={jobStatuses}
          taskTemplates={taskTemplates}
          notificationTemplates={notificationTemplates}
          sites={sites}
          regions={regions}
          onSave={onSave}
          onCancel={onCancel || onToggle}
          isNew={true}
        />
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all duration-200 ${
        isExpanded
          ? 'border-brand-cyan shadow-lg'
          : 'border-border hover:border-gray-300'
      }`}
    >
      {/* Collapsed Header */}
      <div
        onClick={onToggle}
        className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors ${
          isExpanded ? 'bg-brand-cyan/5' : 'bg-white hover:bg-surface-cream/50'
        }`}
      >
        {/* Name and Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-text-primary font-semibold truncate">
              {automation.name || 'Untitled Automation'}
            </span>
            <Badge variant={automation.isActive ? 'customized' : 'system'}>
              {automation.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {automation.description && (
            <p className="text-sm text-text-muted truncate mt-0.5">
              {automation.description}
            </p>
          )}
        </div>

        {/* Scope Chips */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-text-secondary">
            {customerText}
          </span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-text-secondary">
            {speedText}
          </span>
        </div>

        {/* Icons Summary */}
        {icons && (
          <div className="flex items-center gap-1 flex-shrink-0 text-lg" title="Actions">
            {icons}
          </div>
        )}

        {/* Rule Summary */}
        <div className="flex-shrink-0 text-xs text-text-secondary max-w-48 truncate">
          When {triggerSummary} → {actionSummary}
        </div>

        {/* Action Buttons */}
        <div
          className="flex items-center gap-1 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onToggle}
            className="p-1.5 text-text-muted hover:text-brand-cyan transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-text-muted hover:text-error transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-5 h-5 text-text-secondary transition-transform duration-200 flex-shrink-0 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Expanded Edit Form */}
      {isExpanded && !isNew && (
        <AutomationEditForm
          automation={automation}
          customers={customers}
          speeds={speeds}
          jobStatuses={jobStatuses}
          taskTemplates={taskTemplates}
          notificationTemplates={notificationTemplates}
          sites={sites}
          regions={regions}
          onSave={onSave}
          onCancel={onToggle}
        />
      )}
    </div>
  );
}
