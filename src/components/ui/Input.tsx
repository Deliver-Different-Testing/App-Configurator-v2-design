import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div>
      {label && (
        <label htmlFor={inputId} style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: 4 }}>
          {label}
        </label>
      )}
      <input id={inputId} className={`input ${className}`} style={{ width: '100%' }} {...props} />
    </div>
  );
}
