interface FilterDropdownProps {
  id: string;
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function FilterDropdown({ id, label: _label, options, selectedValues, onChange }: FilterDropdownProps) {
  return (
    <select
      id={id}
      className="input"
      value={selectedValues[0] || options[0] || ''}
      onChange={(e) => onChange([e.target.value])}
      style={{ minWidth: 140 }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}
