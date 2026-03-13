import type { AutomationScope, CustomerOption, SpeedOption } from '../types';

interface ScopeSelectorProps {
  scope: AutomationScope;
  customers: CustomerOption[];
  speeds: SpeedOption[];
  onChange: (scope: AutomationScope) => void;
}

export function ScopeSelector({
  scope,
  customers,
  speeds,
  onChange,
}: ScopeSelectorProps) {
  // Toggle all customers
  const handleAllCustomersChange = (checked: boolean) => {
    onChange({
      ...scope,
      allCustomers: checked,
      customerIds: checked ? [] : scope.customerIds,
    });
  };

  // Toggle all speeds
  const handleAllSpeedsChange = (checked: boolean) => {
    onChange({
      ...scope,
      allSpeeds: checked,
      speedIds: checked ? [] : scope.speedIds,
    });
  };

  // Toggle specific customer
  const toggleCustomer = (customerId: string) => {
    const newIds = scope.customerIds.includes(customerId)
      ? scope.customerIds.filter((id) => id !== customerId)
      : [...scope.customerIds, customerId];
    onChange({
      ...scope,
      customerIds: newIds,
    });
  };

  // Toggle specific speed
  const toggleSpeed = (speedId: string) => {
    const newIds = scope.speedIds.includes(speedId)
      ? scope.speedIds.filter((id) => id !== speedId)
      : [...scope.speedIds, speedId];
    onChange({
      ...scope,
      speedIds: newIds,
    });
  };

  return (
    <div className="space-y-4">
      {/* Customers */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="all-customers"
            checked={scope.allCustomers}
            onChange={(e) => handleAllCustomersChange(e.target.checked)}
            className="w-4 h-4 rounded border-border text-brand-cyan focus:ring-brand-cyan"
          />
          <label htmlFor="all-customers" className="text-sm font-medium text-text-primary">
            Apply to all customers
          </label>
        </div>

        {!scope.allCustomers && (
          <div className="ml-6 p-3 bg-white border border-border rounded-lg">
            <p className="text-xs text-text-secondary mb-2">Select customers:</p>
            <div className="flex flex-wrap gap-2">
              {customers.map((customer) => {
                const isSelected = scope.customerIds.includes(customer.id);
                return (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => toggleCustomer(customer.id)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      isSelected
                        ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan font-medium'
                        : 'border-border bg-white text-text-secondary hover:border-gray-300'
                    }`}
                  >
                    {customer.shortName}
                  </button>
                );
              })}
            </div>
            {scope.customerIds.length === 0 && (
              <p className="text-xs text-error mt-2">Please select at least one customer</p>
            )}
          </div>
        )}
      </div>

      {/* Speeds */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="all-speeds"
            checked={scope.allSpeeds}
            onChange={(e) => handleAllSpeedsChange(e.target.checked)}
            className="w-4 h-4 rounded border-border text-brand-cyan focus:ring-brand-cyan"
          />
          <label htmlFor="all-speeds" className="text-sm font-medium text-text-primary">
            Apply to all speeds
          </label>
        </div>

        {!scope.allSpeeds && (
          <div className="ml-6 p-3 bg-white border border-border rounded-lg">
            <p className="text-xs text-text-secondary mb-2">Select speeds:</p>
            <div className="flex flex-wrap gap-2">
              {speeds.map((speed) => {
                const isSelected = scope.speedIds.includes(speed.id);
                return (
                  <button
                    key={speed.id}
                    type="button"
                    onClick={() => toggleSpeed(speed.id)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      isSelected
                        ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan font-medium'
                        : 'border-border bg-white text-text-secondary hover:border-gray-300'
                    }`}
                  >
                    {speed.name}
                  </button>
                );
              })}
            </div>
            {scope.speedIds.length === 0 && (
              <p className="text-xs text-error mt-2">Please select at least one speed</p>
            )}
          </div>
        )}
      </div>

      {/* Scope Summary */}
      <div className="p-2 bg-surface-cream rounded text-xs text-text-secondary">
        <strong>Scope:</strong> This automation applies to{' '}
        {scope.allCustomers ? (
          'all customers'
        ) : scope.customerIds.length > 0 ? (
          <>
            <span className="font-medium text-text-primary">
              {scope.customerIds.length} customer{scope.customerIds.length !== 1 ? 's' : ''}
            </span>
          </>
        ) : (
          <span className="text-error">no customers selected</span>
        )}{' '}
        and{' '}
        {scope.allSpeeds ? (
          'all speeds'
        ) : scope.speedIds.length > 0 ? (
          <>
            <span className="font-medium text-text-primary">
              {scope.speedIds.length} speed{scope.speedIds.length !== 1 ? 's' : ''}
            </span>
          </>
        ) : (
          <span className="text-error">no speeds selected</span>
        )}
        .
      </div>
    </div>
  );
}
