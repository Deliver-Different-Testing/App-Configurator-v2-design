import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'system' | 'customized' | 'default';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const styles: Record<string, string> = {
    customized: 'background:rgba(19,185,100,.15); color:#13b964',
    system: 'background:rgba(13,12,44,.08); color:rgba(13,12,44,.45)',
    default: 'background:rgba(13,12,44,.08); color:rgba(13,12,44,.6)',
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '50px',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.3px',
        textTransform: 'uppercase',
        ...(Object.fromEntries((styles[variant] || styles.default).split(';').filter(Boolean).map(s => {
          const [k, v] = s.split(':').map(x => x.trim());
          // Convert CSS property to camelCase
          const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          return [camel, v];
        }))),
      }}
    >
      {children}
    </span>
  );
}
