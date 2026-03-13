import { useState } from 'react';
import type { FeatureFlag } from '../types';
import { INITIAL_FEATURES } from '../data/features';

export default function FeatureFlagsTab() {
  const [features, setFeatures] = useState<FeatureFlag[]>(() => JSON.parse(JSON.stringify(INITIAL_FEATURES)));

  const toggle = (idx: number) => {
    setFeatures(prev => prev.map((f, i) => i === idx ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{features.filter(f => f.enabled).length} enabled</span>
          <span style={{ color: 'rgba(13,12,44,.35)', fontSize: 13, marginLeft: 8 }}>of {features.length} features</span>
        </div>
      </div>
      <div className="ff-grid" style={{ boxShadow: 'var(--shadow)', borderRadius: 'var(--radius)' }}>
        {features.map((f, i) => (
          <div className="ff-row" key={f.id}>
            <div className="ff-icon">{f.icon}</div>
            <div className="ff-info">
              <div className="ff-name">{f.name}</div>
              <div className="ff-desc">{f.desc}</div>
            </div>
            <div className="ff-overrides">
              {f.overrides ? (
                <span>{f.overrides} override{f.overrides > 1 ? 's' : ''}</span>
              ) : (
                <span style={{ color: 'rgba(13,12,44,.2)' }}>—</span>
              )}
            </div>
            <label className="toggle">
              <input type="checkbox" checked={f.enabled} onChange={() => toggle(i)} />
              <span className="slider" />
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
