// src/modules/schedules/components/ScheduleTable.tsx
import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Check, Copy, Trash2, X } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { SearchInput } from '../../../components/filters/SearchInput';
import { FilterDropdown } from '../../../components/filters/FilterDropdown';
import { ConnectionBadge } from '../../../components/tags/ConnectionBadge';
import { DayPills } from '../../../components/ui/DayPills';
import { ActiveToggle } from '../../../components/ui/ActiveToggle';
import type { Schedule, ScheduleFilterState, SortConfig, SortableColumn } from '../types';
import { buildScheduleTableData, getBookingModeLabel } from '../types';
import { sampleDepots, sampleClients, sampleSpeeds } from '../data/sampleData';

interface ScheduleTableProps {
  schedules: Schedule[];
  selectedId: string | null;
  onSelectSchedule: (schedule: Schedule) => void;
  collapsedBaseIds?: Set<string>;
  onToggleCollapse?: (baseId: string) => void;
  externalSearchQuery?: string;
  externalTagSearch?: string;
  onConnectionsClick?: (schedule: Schedule) => void;
  onToggleActive?: (schedule: Schedule, newValue: boolean) => void;
  onCopySchedule?: (schedule: Schedule) => void;
  onDeleteSchedule?: (schedule: Schedule) => void;
}

// Count all connections for a schedule (clients, depots, linehauls, etc.)
function getConnectionCount(schedule: Schedule): number {
  let count = 0;

  // Clients
  if (schedule.clientId) {
    count += 1;
  }

  // Origin depot
  if (schedule.pickupDepotId) {
    count += 1;
  }

  // Linehauls
  count += schedule.legs.filter(l => l.config.type === 'linehaul').length;

  // Depot legs (excluding first if it's origin)
  count += schedule.legs.filter(l => l.config.type === 'depot').length;

  return count;
}

export function ScheduleTable({
  schedules,
  selectedId,
  onSelectSchedule,
  externalSearchQuery = '',
  externalTagSearch = '',
  onConnectionsClick,
  onToggleActive,
  onCopySchedule,
  onDeleteSchedule,
}: ScheduleTableProps) {
  const [filters, setFilters] = useState<ScheduleFilterState>({
    search: '',
    status: 'all',
    type: 'all',
    clientId: 'all',
    originDepotId: 'all',
    destinationDepotId: 'all',
  });

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (column: SortableColumn) => {
    setSortConfig((prev) => {
      if (!prev || prev.column !== column) {
        return { column, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { column, direction: 'desc' };
      }
      return null;
    });
  };

  // Build table data
  const allRows = useMemo(() => {
    return buildScheduleTableData(schedules, sampleDepots, sampleClients, sampleSpeeds);
  }, [schedules]);

  // Combine external search with internal filters
  const combinedSearch = externalSearchQuery || filters.search;

  // Apply filters
  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      // Hide override rows by default - only show base schedules
      // Client overrides are managed via the Client Overrides tab in the edit modal
      if (row.isOverride) {
        return false;
      }

      // Search filter (combined with external search)
      if (combinedSearch) {
        const searchLower = combinedSearch.toLowerCase();
        if (!row.name.toLowerCase().includes(searchLower) &&
            !row.route.toLowerCase().includes(searchLower) &&
            !row.clientDisplay.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Tag search filter (connected entities)
      if (externalTagSearch) {
        const tagLower = externalTagSearch.toLowerCase();
        // Search in client names, depot names, route info
        if (!row.clientDisplay.toLowerCase().includes(tagLower) &&
            !row.originDepot.toLowerCase().includes(tagLower) &&
            !row.destDepot.toLowerCase().includes(tagLower) &&
            !row.route.toLowerCase().includes(tagLower)) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all' && row.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [allRows, filters, combinedSearch, externalTagSearch]);

  // Apply sorting
  const sortedRows = useMemo(() => {
    if (!sortConfig) return filteredRows;

    const { column, direction } = sortConfig;
    const multiplier = direction === 'asc' ? 1 : -1;

    return [...filteredRows].sort((a, b) => {
      if (a.isOverride !== b.isOverride) {
        if (a.baseScheduleName === b.name) return 1;
        if (b.baseScheduleName === a.name) return -1;
      }

      const aVal = a[column] ?? '';
      const bVal = b[column] ?? '';

      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        return ((aVal ? 1 : 0) - (bVal ? 1 : 0)) * multiplier;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * multiplier;
      }

      return (Number(aVal) - Number(bVal)) * multiplier;
    });
  }, [filteredRows, sortConfig]);

  // Since override rows are hidden by default, visibleRows is just sortedRows
  const visibleRows = sortedRows;

  // Filter options
  const statusOptions = ['All Status', 'Active', 'Inactive'];
  const typeOptions = ['All Types', 'Base Schedules', 'Overrides'];
  const depotOptions = ['All Depots', ...sampleDepots.map((d) => d.name)];

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="p-3 border-b border-border bg-surface-light space-y-2">
        <SearchInput
          value={filters.search}
          onChange={(value) => setFilters((f) => ({ ...f, search: value }))}
          placeholder="Search schedules, routes, clients..."
        />
        <div className="flex items-center gap-2 flex-wrap">
          <FilterDropdown
            id="status"
            label="Status"
            options={statusOptions}
            selectedValues={filters.status === 'all' ? [] : [filters.status === 'active' ? 'Active' : 'Inactive']}
            onChange={(values) => {
              const v = values[0];
              setFilters((f) => ({
                ...f,
                status: !v || v === 'All Status' ? 'all' : v === 'Active' ? 'active' : 'inactive',
              }));
            }}
          />
          <FilterDropdown
            id="type"
            label="Type"
            options={typeOptions}
            selectedValues={
              filters.type === 'all'
                ? []
                : [filters.type === 'base' ? 'Base Schedules' : 'Overrides']
            }
            onChange={(values) => {
              const v = values[0];
              setFilters((f) => ({
                ...f,
                type: !v || v === 'All Types' ? 'all' : v === 'Base Schedules' ? 'base' : 'override',
              }));
            }}
          />
          <FilterDropdown
            id="depot"
            label="Depot"
            options={depotOptions}
            selectedValues={[]}
            onChange={() => {}}
          />
        </div>
        <div className="text-xs text-text-muted">
          Showing {visibleRows.length} of {schedules.length} schedules
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-sm" data-testid="schedule-table" aria-label="schedule table">
          <caption className="sr-only">Schedule list with sorting and filtering</caption>
          <thead className="bg-surface-light sticky top-0 z-10">
            <tr className="border-b border-border">
              <th
                onClick={() => handleSort('name')}
                className={`text-left py-2 px-2 font-medium uppercase text-xs cursor-pointer hover:text-text-primary hover:bg-surface-cream select-none transition-colors  ${sortConfig?.column === 'name' ? 'text-brand-dark bg-brand-cyan/5' : 'text-text-muted'}`}
              >
                <div className="flex items-center gap-1">
                  <span>Name</span>
                  <span className="w-4 h-4 flex items-center justify-center">
                    {sortConfig?.column === 'name' && sortConfig.direction === 'asc' && <ChevronUp className="w-3 h-3" />}
                    {sortConfig?.column === 'name' && sortConfig.direction === 'desc' && <ChevronDown className="w-3 h-3" />}
                  </span>
                </div>
              </th>
              <th className="text-center py-2 px-2 font-medium text-text-muted uppercase text-xs ">Days</th>
              <th
                onClick={() => handleSort('originDepot')}
                className={`hidden md:table-cell text-left py-2 px-2 font-medium uppercase text-xs cursor-pointer hover:text-text-primary hover:bg-surface-cream select-none transition-colors  ${sortConfig?.column === 'originDepot' ? 'text-brand-dark bg-brand-cyan/5' : 'text-text-muted'}`}
              >
                <div className="flex items-center gap-1">
                  <span>Origin</span>
                  <span className="w-4 h-4 flex items-center justify-center">
                    {sortConfig?.column === 'originDepot' && sortConfig.direction === 'asc' && <ChevronUp className="w-3 h-3" />}
                    {sortConfig?.column === 'originDepot' && sortConfig.direction === 'desc' && <ChevronDown className="w-3 h-3" />}
                  </span>
                </div>
              </th>
              <th
                onClick={() => handleSort('destDepot')}
                className={`hidden md:table-cell text-left py-2 px-2 font-medium uppercase text-xs cursor-pointer hover:text-text-primary hover:bg-surface-cream select-none transition-colors  ${sortConfig?.column === 'destDepot' ? 'text-brand-dark bg-brand-cyan/5' : 'text-text-muted'}`}
              >
                <div className="flex items-center gap-1">
                  <span>Dest</span>
                  <span className="w-4 h-4 flex items-center justify-center">
                    {sortConfig?.column === 'destDepot' && sortConfig.direction === 'asc' && <ChevronUp className="w-3 h-3" />}
                    {sortConfig?.column === 'destDepot' && sortConfig.direction === 'desc' && <ChevronDown className="w-3 h-3" />}
                  </span>
                </div>
              </th>
              <th className="hidden md:table-cell text-center py-2 px-2 font-medium text-text-muted uppercase text-xs w-12">LH</th>
              <th
                onClick={() => handleSort('speedDisplay')}
                className={`hidden lg:table-cell text-left py-2 px-2 font-medium uppercase text-xs cursor-pointer hover:text-text-primary hover:bg-surface-cream select-none transition-colors  ${sortConfig?.column === 'speedDisplay' ? 'text-brand-dark bg-brand-cyan/5' : 'text-text-muted'}`}
              >
                <div className="flex items-center gap-1">
                  <span>Speed</span>
                  <span className="w-4 h-4 flex items-center justify-center">
                    {sortConfig?.column === 'speedDisplay' && sortConfig.direction === 'asc' && <ChevronUp className="w-3 h-3" />}
                    {sortConfig?.column === 'speedDisplay' && sortConfig.direction === 'desc' && <ChevronDown className="w-3 h-3" />}
                  </span>
                </div>
              </th>
              <th
                onClick={() => handleSort('bookingMode')}
                className={`hidden lg:table-cell text-left py-2 px-2 font-medium uppercase text-xs cursor-pointer hover:text-text-primary hover:bg-surface-cream select-none transition-colors w-[12%] ${sortConfig?.column === 'bookingMode' ? 'text-brand-dark bg-brand-cyan/5' : 'text-text-muted'}`}
              >
                <div className="flex items-center gap-1">
                  <span>Mode</span>
                  <span className="w-4 h-4 flex items-center justify-center">
                    {sortConfig?.column === 'bookingMode' && sortConfig.direction === 'asc' && <ChevronUp className="w-3 h-3" />}
                    {sortConfig?.column === 'bookingMode' && sortConfig.direction === 'desc' && <ChevronDown className="w-3 h-3" />}
                  </span>
                </div>
              </th>
              <th className="hidden lg:table-cell text-left py-2 px-2 font-medium text-text-muted uppercase text-xs w-[18%]">
                Connections
              </th>
              <th
                onClick={() => handleSort('status')}
                className={`text-center py-2 px-2 font-medium uppercase text-xs cursor-pointer hover:text-text-primary hover:bg-surface-cream select-none transition-colors w-16 ${sortConfig?.column === 'status' ? 'text-brand-dark bg-brand-cyan/5' : 'text-text-muted'}`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Status</span>
                  <span className="w-4 h-4 flex items-center justify-center">
                    {sortConfig?.column === 'status' && sortConfig.direction === 'asc' && <ChevronUp className="w-3 h-3" />}
                    {sortConfig?.column === 'status' && sortConfig.direction === 'desc' && <ChevronDown className="w-3 h-3" />}
                  </span>
                </div>
              </th>
              <th className="text-center py-2 px-2 font-medium text-text-muted uppercase text-xs w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => {
              const isSelected = selectedId === String(row.id);
              const hasOverrides = !row.isOverride && row.overrideCount > 0;

              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectSchedule(row.schedule)}
                  className={`
                    border-b border-border cursor-pointer transition-colors
                    ${isSelected ? 'bg-brand-cyan/10 border-l-2 border-l-brand-cyan' : 'hover:bg-surface-cream'}
                    ${row.depth > 0 ? 'bg-surface-cream/50' : ''}
                  `}
                >
                  {/* Name */}
                  <td className={`py-1.5 px-2 font-medium text-text-primary ${row.depth > 0 ? 'pl-5' : ''}`}>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="truncate">{row.name}</span>
                      {row.isOverride && (
                        <Badge variant="system" className="text-xs flex-shrink-0">O</Badge>
                      )}
                      {hasOverrides && (
                        <span className="text-xs text-text-muted flex-shrink-0">
                          +{row.overrideCount}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Days */}
                  <td className="py-1.5 px-2">
                    {!row.isOverride && (
                      <DayPills days={row.schedule.operatingSchedule.days} size="sm" />
                    )}
                  </td>

                  {/* Origin Depot */}
                  <td className="hidden md:table-cell py-1.5 px-2 text-text-secondary text-xs truncate">
                    {row.isOverride ? '—' : row.originDepot}
                  </td>

                  {/* Destination Depot */}
                  <td className="hidden md:table-cell py-1.5 px-2 text-text-secondary text-xs truncate">
                    {row.isOverride ? '—' : row.destDepot}
                  </td>

                  {/* Linehaul Y/N */}
                  <td className="hidden md:table-cell py-1.5 px-2 text-center">
                    {row.isOverride ? (
                      <span className="text-text-muted">—</span>
                    ) : row.hasLinehaul ? (
                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-text-muted mx-auto" />
                    )}
                  </td>

                  {/* Speed */}
                  <td className="hidden lg:table-cell py-1.5 px-2 text-text-secondary text-xs truncate">
                    {row.speedDisplay}
                  </td>

                  {/* Mode */}
                  <td className="hidden lg:table-cell py-1.5 px-2 text-text-secondary text-xs truncate">
                    {row.isOverride ? '—' : getBookingModeLabel(row.bookingMode)}
                  </td>

                  {/* Connections */}
                  <td className="hidden lg:table-cell py-1.5 px-2">
                    <ConnectionBadge
                      connectionCount={getConnectionCount(row.schedule)}
                      onClick={(e) => {
                        e?.stopPropagation();
                        onConnectionsClick?.(row.schedule);
                      }}
                      size="sm"
                    />
                  </td>

                  {/* Status */}
                  <td className="py-1.5 px-2">
                    <ActiveToggle
                      isActive={row.status === 'active'}
                      onToggle={(newValue) => onToggleActive?.(row.schedule, newValue)}
                    />
                  </td>

                  {/* Actions */}
                  <td className="py-1.5 px-2 text-center">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`Copy schedule ${row.name}`}
                        title="Copy schedule"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCopySchedule?.(row.schedule);
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-brand-cyan/10 hover:text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete schedule ${row.name}`}
                        title="Delete schedule"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSchedule?.(row.schedule);
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-error/10 hover:text-error focus:outline-none focus:ring-2 focus:ring-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {visibleRows.length === 0 && (
          <div className="py-12 text-center text-text-muted">
            No schedules found matching your filters
          </div>
        )}
      </div>
    </div>
  );
}
