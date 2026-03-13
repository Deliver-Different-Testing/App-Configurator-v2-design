import { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, Zap, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/filters/SearchInput';
import { FilterDropdown } from '../../components/filters/FilterDropdown';
import { AutomationCard } from './components/AutomationCard';
import type {
  AutomationRule,
  AutomationFilterState,
  CustomerOption,
  SpeedOption,
  JobStatus,
  TaskTemplate,
  NotificationTemplate,
  SiteOption,
  RegionOption,
} from './types';
import { createEmptyAutomation } from './types';
import {
  fetchAutomations,
  fetchCustomers,
  fetchSpeeds,
  fetchJobStatuses,
  fetchTaskTemplates,
  fetchNotificationTemplates,
  fetchSites,
  fetchRegions,
  createAutomation,
  updateAutomation,
  deleteAutomation as deleteAutomationApi,
  toggleAutomation as _toggleAutomation,
  apiRuleToFrontend,
  frontendRuleToApi,
  IS_DEMO,
} from './api';
import {
  sampleAutomations,
  sampleCustomers,
  sampleSpeeds,
  sampleJobStatuses,
  sampleTaskTemplates,
  sampleNotificationTemplates,
  sampleSites,
  sampleRegions,
} from './data/sampleData';

// ---------------------------------------------------------------------------
// Hook: load data from the API
// ---------------------------------------------------------------------------

function useAutomationsData() {
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [speeds, setSpeeds] = useState<SpeedOption[]>([]);
  const [jobStatuses, setJobStatuses] = useState<JobStatus[]>([]);
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([]);
  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>([]);
  const [sites, setSites] = useState<SiteOption[]>([]);
  const [regions, setRegions] = useState<RegionOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (IS_DEMO) {
        // Use rich sample data for demo/GitHub Pages
        setAutomations(sampleAutomations);
        setCustomers(sampleCustomers);
        setSpeeds(sampleSpeeds);
        setJobStatuses(sampleJobStatuses);
        setTaskTemplates(sampleTaskTemplates);
        setNotificationTemplates(sampleNotificationTemplates);
        setSites(sampleSites);
        setRegions(sampleRegions);
      } else {
        const [rulesData, custData, speedData, statusData, taskData, notifData, sitesData, regionsData] =
          await Promise.all([
            fetchAutomations(),
            fetchCustomers(),
            fetchSpeeds(),
            fetchJobStatuses(),
            fetchTaskTemplates(),
            fetchNotificationTemplates(),
            fetchSites(),
            fetchRegions(),
          ]);
        setAutomations(rulesData.map(apiRuleToFrontend));
        setCustomers(custData);
        setSpeeds(speedData);
        setJobStatuses(statusData);
        setTaskTemplates(taskData);
        setNotificationTemplates(notifData);
        setSites(sitesData);
        setRegions(regionsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    automations,
    setAutomations,
    customers,
    speeds,
    jobStatuses,
    taskTemplates,
    notificationTemplates,
    sites,
    regions,
    loading,
    error,
    reload: loadAll,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AutomationsPage() {
  const {
    automations,
    setAutomations,
    customers,
    speeds,
    jobStatuses,
    taskTemplates,
    notificationTemplates,
    sites,
    regions,
    loading,
    error,
    reload,
  } = useAutomationsData();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newAutomation, setNewAutomation] = useState<AutomationRule | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<AutomationFilterState>({
    customerId: 'all',
    speedId: 'all',
    search: '',
  });

  // Filter automations
  const filteredAutomations = useMemo(() => {
    return automations.filter((auto) => {
      if (filters.customerId !== 'all') {
        if (
          !auto.scope.allCustomers &&
          !auto.scope.customerIds.includes(filters.customerId)
        ) {
          return false;
        }
      }
      if (filters.speedId !== 'all') {
        if (!auto.scope.allSpeeds && !auto.scope.speedIds.includes(filters.speedId)) {
          return false;
        }
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesSearch =
          auto.name.toLowerCase().includes(query) ||
          auto.description?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [automations, filters]);

  // Create
  const handleNewAutomation = () => {
    const empty = createEmptyAutomation();
    setNewAutomation({
      ...empty,
      id: `auto-new-${Date.now()}`,
      createdAt: '',
      updatedAt: '',
    });
    setIsCreating(true);
    setExpandedId(null);
  };

  const handleSaveNew = async (automation: AutomationRule) => {
    setSaving(true);
    try {
      const created = await createAutomation(frontendRuleToApi(automation));
      setAutomations((prev) => [apiRuleToFrontend(created), ...prev]);
      setIsCreating(false);
      setNewAutomation(null);
    } catch (err) {
      alert(`Failed to create: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelNew = () => {
    setIsCreating(false);
    setNewAutomation(null);
  };

  // Update
  const handleUpdate = async (automation: AutomationRule) => {
    setSaving(true);
    try {
      const updated = await updateAutomation(
        Number(automation.id),
        frontendRuleToApi(automation),
      );
      setAutomations((prev) =>
        prev.map((a) => (a.id === automation.id ? apiRuleToFrontend(updated) : a)),
      );
      setExpandedId(null);
    } catch (err) {
      alert(`Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this automation?')) return;
    try {
      await deleteAutomationApi(Number(id));
      setAutomations((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Filter options
  const customerOptions = ['All Customers', ...customers.map((c) => c.shortName)];
  const speedOptions = ['All Speeds', ...speeds.map((s) => s.name)];

  const handleCustomerChange = (values: string[]) => {
    const value = values[0];
    if (!value || value === 'All Customers') {
      setFilters((prev) => ({ ...prev, customerId: 'all' }));
    } else {
      const customer = customers.find((c) => c.shortName === value);
      setFilters((prev) => ({ ...prev, customerId: customer?.id || 'all' }));
    }
  };

  const handleSpeedChange = (values: string[]) => {
    const value = values[0];
    if (!value || value === 'All Speeds') {
      setFilters((prev) => ({ ...prev, speedId: 'all' }));
    } else {
      const speed = speeds.find((s) => s.name === value);
      setFilters((prev) => ({ ...prev, speedId: speed?.id || 'all' }));
    }
  };

  const clearAllFilters = () => {
    setFilters({ customerId: 'all', speedId: 'all', search: '' });
  };

  const hasActiveFilters =
    filters.customerId !== 'all' || filters.speedId !== 'all' || filters.search !== '';

  const getSelectedCustomer = (): string[] => {
    if (filters.customerId === 'all') return [];
    const customer = customers.find((c) => c.id === filters.customerId);
    return customer ? [customer.shortName] : [];
  };

  const getSelectedSpeed = (): string[] => {
    if (filters.speedId === 'all') return [];
    const speed = speeds.find((s) => s.id === filters.speedId);
    return speed ? [speed.name] : [];
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-cyan mx-auto mb-3" />
          <p className="text-text-secondary">Loading automations…</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-surface-light flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-text-primary font-medium mb-1">Failed to load automations</p>
          <p className="text-sm text-text-secondary mb-4">{error}</p>
          <Button onClick={reload}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light">
      {/* Header */}
      <div className="bg-white border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-brand-cyan" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Automations</h1>
              <p className="text-sm text-text-secondary">
                Create "if this then that" rules to automate workflows
              </p>
            </div>
          </div>
          <Button onClick={handleNewAutomation} disabled={isCreating || saving}>
            <Plus className="w-4 h-4 mr-2" />
            New Automation
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-4">
        {/* Filters */}
        <div className="space-y-3">
          <SearchInput
            value={filters.search}
            onChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
            placeholder="Search automations by name or description..."
          />
          <div className="flex items-center gap-2 flex-wrap">
            <FilterDropdown
              id="customer"
              label="Customer"
              options={customerOptions}
              selectedValues={getSelectedCustomer()}
              onChange={handleCustomerChange}
            />
            <FilterDropdown
              id="speed"
              label="Speed"
              options={speedOptions}
              selectedValues={getSelectedSpeed()}
              onChange={handleSpeedChange}
            />
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-text-muted hover:text-brand-cyan ml-2 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-text-secondary">
          Showing {filteredAutomations.length} of {automations.length} automations
        </div>

        {/* New Automation Card */}
        {isCreating && newAutomation && (
          <AutomationCard
            automation={newAutomation}
            customers={customers}
            speeds={speeds}
            jobStatuses={jobStatuses}
            taskTemplates={taskTemplates}
            notificationTemplates={notificationTemplates}
            sites={sites}
            regions={regions}
            isExpanded={true}
            isNew={true}
            onToggle={() => {}}
            onSave={handleSaveNew}
            onDelete={handleCancelNew}
            onCancel={handleCancelNew}
          />
        )}

        {/* Automations List */}
        <div className="space-y-3">
          {filteredAutomations.map((automation) => (
            <AutomationCard
              key={automation.id}
              automation={automation}
              customers={customers}
              speeds={speeds}
              jobStatuses={jobStatuses}
              taskTemplates={taskTemplates}
              notificationTemplates={notificationTemplates}
              sites={sites}
              regions={regions}
              isExpanded={expandedId === automation.id}
              onToggle={() =>
                setExpandedId(expandedId === automation.id ? null : automation.id)
              }
              onSave={handleUpdate}
              onDelete={() => handleDelete(automation.id)}
            />
          ))}

          {filteredAutomations.length === 0 && !isCreating && (
            <div className="text-center py-12 bg-white border-2 border-dashed border-border rounded-lg">
              <Zap className="w-12 h-12 mx-auto text-text-muted mb-3" />
              <p className="text-text-muted font-medium">No automations found</p>
              <p className="text-sm text-text-muted mt-1">
                {hasActiveFilters
                  ? 'Try adjusting your filters'
                  : 'Click "New Automation" to create your first rule'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
