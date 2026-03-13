import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Toggle } from '../../../components/ui/Toggle';
import { ScopeSelector } from './ScopeSelector';
import { ConditionRow } from './ConditionRow';
import { ActionRow } from './ActionRow';
import type {
  AutomationRule,
  Condition,
  Action,
  ConditionType,
  ActionType,
  ConditionMatchMode,
  CustomerOption,
  SpeedOption,
  JobStatus,
  TaskTemplate,
  NotificationTemplate,
  SiteOption,
  RegionOption,
} from '../types';
import {
  CONDITION_TYPE_OPTIONS,
  ACTION_TYPE_OPTIONS,
  CONDITION_MATCH_MODE_OPTIONS,
  createEmptyCondition,
  createEmptyAction,
} from '../types';

interface AutomationEditFormProps {
  automation: AutomationRule;
  customers: CustomerOption[];
  speeds: SpeedOption[];
  jobStatuses: JobStatus[];
  taskTemplates: TaskTemplate[];
  notificationTemplates: NotificationTemplate[];
  sites: SiteOption[];
  regions: RegionOption[];
  onSave: (automation: AutomationRule) => void;
  onCancel: () => void;
  isNew?: boolean;
}

export function AutomationEditForm({
  automation,
  customers,
  speeds,
  jobStatuses,
  taskTemplates,
  notificationTemplates,
  sites,
  regions,
  onSave,
  onCancel,
  isNew = false,
}: AutomationEditFormProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: automation.name,
    description: automation.description || '',
    scope: { ...automation.scope },
    conditionMatchMode: automation.conditionMatchMode,
    conditions: [...automation.conditions],
    actions: [...automation.actions],
    isActive: automation.isActive,
  });

  // Dropdown state for adding conditions/actions
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<string[]>([]);

  // Update field
  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  // Add condition
  const addCondition = (type: ConditionType) => {
    const newCondition = createEmptyCondition(type);
    updateField('conditions', [...formData.conditions, newCondition]);
    setShowConditionDropdown(false);
  };

  // Update condition
  const updateCondition = (index: number, condition: Condition) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = condition;
    updateField('conditions', newConditions);
  };

  // Remove condition
  const removeCondition = (index: number) => {
    updateField(
      'conditions',
      formData.conditions.filter((_, i) => i !== index)
    );
  };

  // Add action
  const addAction = (type: ActionType) => {
    const newAction = createEmptyAction(type);
    updateField('actions', [...formData.actions, newAction]);
    setShowActionDropdown(false);
  };

  // Update action
  const updateAction = (index: number, action: Action) => {
    const newActions = [...formData.actions];
    newActions[index] = action;
    updateField('actions', newActions);
  };

  // Remove action
  const removeAction = (index: number) => {
    updateField(
      'actions',
      formData.actions.filter((_, i) => i !== index)
    );
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push('Automation name is required');
    }

    if (formData.conditions.length === 0) {
      newErrors.push('At least one condition is required');
    }

    if (formData.actions.length === 0) {
      newErrors.push('At least one action is required');
    }

    if (!formData.scope.allCustomers && formData.scope.customerIds.length === 0) {
      newErrors.push('Please select at least one customer or apply to all');
    }

    if (!formData.scope.allSpeeds && formData.scope.speedIds.length === 0) {
      newErrors.push('Please select at least one speed or apply to all');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (!validate()) return;

    const updatedAutomation: AutomationRule = {
      ...automation,
      name: formData.name,
      description: formData.description || undefined,
      scope: formData.scope,
      conditionMatchMode: formData.conditionMatchMode,
      conditions: formData.conditions,
      actions: formData.actions,
      isActive: formData.isActive,
      updatedAt: new Date().toISOString(),
    };

    if (isNew) {
      updatedAutomation.createdAt = new Date().toISOString();
    }

    onSave(updatedAutomation);
  };

  return (
    <div className="p-6 bg-surface-cream space-y-6">
      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="p-3 bg-error/10 border border-error/30 rounded-lg">
          <p className="text-sm font-medium text-error mb-1">Please fix the following:</p>
          <ul className="text-sm text-error list-disc list-inside">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 1: Basics */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-text-primary">Basics</h4>

        <Input
          label="Automation Name"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="Enter a descriptive name..."
          required
        />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Explain what this automation does..."
            rows={2}
            className="w-full px-3.5 py-2.5 text-base border-2 border-border rounded-md bg-white text-text-primary placeholder:text-text-muted transition-all duration-normal focus:outline-none focus:border-brand-cyan focus:shadow-cyan-glow resize-y"
          />
        </div>
      </div>

      {/* Section 2: Scope */}
      <div className="border-t border-border pt-4 space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-text-primary">Scope</h4>
          <p className="text-xs text-text-muted mt-0.5">
            Define which customers and speeds this automation applies to
          </p>
        </div>

        <ScopeSelector
          scope={formData.scope}
          customers={customers}
          speeds={speeds}
          onChange={(scope) => updateField('scope', scope)}
        />
      </div>

      {/* Section 3: Conditions (Triggers) */}
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-text-primary">
              Trigger Conditions (IF)
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              Define when this automation should fire
            </p>
          </div>
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowConditionDropdown(!showConditionDropdown)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Condition
            </Button>
            {showConditionDropdown && (
              <div className="absolute right-0 mt-1 w-64 bg-white border border-border rounded-lg shadow-lg z-50">
                {CONDITION_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => addCondition(opt.value)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-cream transition-colors"
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Match Mode */}
        {formData.conditions.length > 1 && (
          <div className="flex items-center gap-2 p-2 bg-white border border-border rounded">
            <span className="text-sm text-text-secondary">Match mode:</span>
            <select
              value={formData.conditionMatchMode}
              onChange={(e) =>
                updateField('conditionMatchMode', e.target.value as ConditionMatchMode)
              }
              className="px-2 py-1 text-sm border border-border rounded bg-white text-text-primary focus:outline-none focus:border-brand-cyan"
            >
              {CONDITION_MATCH_MODE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Condition List */}
        {formData.conditions.length > 0 ? (
          <div className="space-y-2">
            {formData.conditions.map((condition, index) => (
              <ConditionRow
                key={condition.id}
                condition={condition}
                jobStatuses={jobStatuses}
                sites={sites}
                regions={regions}
                onChange={(c) => updateCondition(index, c)}
                onRemove={() => removeCondition(index)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white border-2 border-dashed border-border rounded-lg">
            <p className="text-text-muted">No conditions yet.</p>
            <p className="text-sm text-text-muted mt-1">
              Click "Add Condition" to define when this automation triggers.
            </p>
          </div>
        )}
      </div>

      {/* Section 4: Actions (THEN) */}
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-text-primary">
              Actions (THEN)
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              Define what happens when conditions are met
            </p>
          </div>
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowActionDropdown(!showActionDropdown)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Action
            </Button>
            {showActionDropdown && (
              <div className="absolute right-0 mt-1 w-72 bg-white border border-border rounded-lg shadow-lg z-50">
                {ACTION_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => addAction(opt.value)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-cream transition-colors"
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action List */}
        {formData.actions.length > 0 ? (
          <div className="space-y-2">
            {formData.actions.map((action, index) => (
              <ActionRow
                key={action.id}
                action={action}
                jobStatuses={jobStatuses}
                taskTemplates={taskTemplates}
                notificationTemplates={notificationTemplates}
                onChange={(a) => updateAction(index, a)}
                onRemove={() => removeAction(index)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white border-2 border-dashed border-border rounded-lg">
            <p className="text-text-muted">No actions yet.</p>
            <p className="text-sm text-text-muted mt-1">
              Click "Add Action" to define what happens when triggered.
            </p>
          </div>
        )}
      </div>

      {/* Section 5: Status & Actions */}
      <div className="border-t border-border pt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Toggle
            checked={formData.isActive}
            onChange={(checked) => updateField('isActive', checked)}
            label={formData.isActive ? 'Active' : 'Inactive'}
          />
          <span className="text-xs text-text-muted">
            {formData.conditions.length} condition
            {formData.conditions.length !== 1 ? 's' : ''},{' '}
            {formData.actions.length} action
            {formData.actions.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="save" size="sm" onClick={handleSave}>
            {isNew ? 'Create Automation' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
