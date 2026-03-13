import { useState, useRef, useCallback } from 'react';
import type { SupportType, WaitingTimeConfig } from '../types';
import { INITIAL_SUPPORTS } from '../data/supports';
import type { ToastFn } from '../App';

interface Props { showToast: ToastFn }

interface ModalState {
  mode: 'add' | 'edit';
  index?: number;
  icon: string;
  name: string;
  desc: string;
  color: string;
  kind: 'form' | 'link';
  url: string;
  waitingTimeConfig?: WaitingTimeConfig;
}

export default function SupportsTab({ showToast }: Props) {
  const [supports, setSupports] = useState<SupportType[]>(() => JSON.parse(JSON.stringify(INITIAL_SUPPORTS)));
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<ModalState | null>(null);
  const dragIdx = useRef<number | null>(null);

  const reindex = (arr: SupportType[]) => arr.map((s, i) => ({ ...s, order: i + 1 }));

  const filtered = supports.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase())
  );

  const toggleEnabled = useCallback((realIdx: number) => {
    setSupports(prev => prev.map((s, i) => i === realIdx ? { ...s, enabled: !s.enabled } : s));
  }, []);

  const removeSupport = useCallback((realIdx: number) => {
    setSupports(prev => reindex(prev.filter((_, i) => i !== realIdx)));
    showToast('Support type removed');
  }, [showToast]);

  const onDrop = useCallback((toIdx: number) => {
    if (dragIdx.current === null || dragIdx.current === toIdx) return;
    setSupports(prev => {
      const arr = [...prev];
      const [item] = arr.splice(dragIdx.current!, 1);
      arr.splice(toIdx, 0, item);
      return reindex(arr);
    });
    dragIdx.current = null;
  }, []);

  const openAdd = () => setModal({ mode: 'add', icon: '📋', name: '', desc: '', color: '#3bc7f4', kind: 'form', url: '' });
  const openEdit = (i: number) => {
    const s = supports[i];
    setModal({ mode: 'edit', index: i, icon: s.icon, name: s.name, desc: s.desc, color: s.color, kind: s.kind || 'form', url: s.url || '', waitingTimeConfig: s.waitingTimeConfig ? { ...s.waitingTimeConfig } : undefined });
  };

  const saveModal = () => {
    if (!modal) return;
    if (modal.mode === 'add') {
      setSupports(prev => reindex([...prev, {
        id: (modal.name || 'new').toLowerCase().replace(/\s+/g, '-'),
        icon: modal.icon || '📋',
        color: modal.color,
        name: modal.name || 'New Support',
        desc: modal.desc,
        enabled: true,
        order: prev.length + 1,
        kind: modal.kind,
        url: modal.kind === 'link' ? modal.url : undefined,
      }]));
      showToast('Support type added');
    } else if (modal.index !== undefined) {
      setSupports(prev => prev.map((s, i) => i === modal.index ? { ...s, icon: modal.icon, name: modal.name, desc: modal.desc, color: modal.color, kind: modal.kind, url: modal.kind === 'link' ? modal.url : undefined, waitingTimeConfig: modal.waitingTimeConfig } : s));
      showToast('Updated');
    }
    setModal(null);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 16 }}>
        <div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{supports.filter(s => s.enabled).length} active</span>
          <span style={{ color: 'rgba(13,12,44,.35)', fontSize: 13, marginLeft: 8 }}>of {supports.length} support types</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 400 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'rgba(13,12,44,.3)' }}>🔍</span>
            <input className="input" placeholder="Search supports..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', paddingLeft: 36 }} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Support Type</button>
        </div>
      </div>

      {search && filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'rgba(13,12,44,.3)' }}>No support types matching "{search}"</div>
      ) : (
        <div className="supports-list">
          {filtered.map(s => {
            const realIdx = supports.indexOf(s);
            return (
              <div
                key={s.id}
                className="support-card"
                draggable
                onDragStart={() => { dragIdx.current = realIdx; }}
                onDragOver={e => e.preventDefault()}
                onDrop={() => onDrop(realIdx)}
                style={!s.enabled ? { opacity: 0.55 } : undefined}
              >
                <span className="support-drag">⠿</span>
                <div className="support-icon-wrap" style={{ background: `${s.color}15` }}>
                  <span>{s.icon}</span>
                </div>
                <div className="support-info">
                  <div className="s-name">{s.name} {s.kind === 'link' && <span style={{ fontSize: 9, fontWeight: 600, background: '#eff6ff', color: '#2563eb', padding: '1px 6px', borderRadius: 4, marginLeft: 6, verticalAlign: 'middle' }}>🔗 LINK</span>}</div>
                  <div className="s-desc">{s.desc}</div>
                  {s.kind === 'link' && s.url && <div style={{ fontSize: 10, color: '#2563eb', marginTop: 2, wordBreak: 'break-all' }}>{s.url}</div>}
                </div>
                <div className="support-order">#{s.order}</div>
                <div className="support-actions">
                  <label className="toggle">
                    <input type="checkbox" checked={s.enabled} onChange={() => toggleEnabled(realIdx)} />
                    <span className="slider" />
                  </label>
                  <button className="btn-icon" onClick={() => openEdit(realIdx)} title="Edit">✏️</button>
                  <button className="btn-icon" onClick={() => removeSupport(realIdx)} title="Remove">🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <div className={`modal-overlay${modal ? ' show' : ''}`} onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
        {modal && (
          <div className="modal">
            <h2>{modal.mode === 'add' ? 'Add Support Type' : 'Edit Support Type'}</h2>
            <div className="modal-sub">
              {modal.mode === 'add' ? 'Add a new support/task type available to couriers in DF Drive' : `Modify ${modal.name}`}
            </div>
            <div className="field">
              <label>Icon (emoji)</label>
              <input value={modal.icon} onChange={e => setModal({ ...modal, icon: e.target.value })} />
            </div>
            <div className="field">
              <label>Name</label>
              <input placeholder="e.g. Toll Receipt" value={modal.name} onChange={e => setModal({ ...modal, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Description</label>
              <input placeholder="Short description" value={modal.desc} onChange={e => setModal({ ...modal, desc: e.target.value })} />
            </div>
            <div className="field">
              <label>Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className={`btn btn-sm ${modal.kind === 'form' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setModal({ ...modal, kind: 'form' })}
                  style={{ flex: 1 }}
                >📋 In-App Form</button>
                <button
                  className={`btn btn-sm ${modal.kind === 'link' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setModal({ ...modal, kind: 'link', icon: modal.kind !== 'link' ? '🔗' : modal.icon })}
                  style={{ flex: 1 }}
                >🔗 External Link</button>
              </div>
            </div>
            {modal.kind === 'link' && (
              <div className="field">
                <label>URL</label>
                <input placeholder="https://forms.example.com/hazard-report" value={modal.url} onChange={e => setModal({ ...modal, url: e.target.value })} />
                <div style={{ fontSize: 10, color: 'rgba(13,12,44,.35)', marginTop: 3 }}>Opens in the courier's browser when tapped</div>
              </div>
            )}
            <div className="field">
              <label>Colour</label>
              <input type="color" value={modal.color} onChange={e => setModal({ ...modal, color: e.target.value })} style={{ width: 60, height: 36, padding: 2, border: '1px solid rgba(13,12,44,.12)', borderRadius: 6 }} />
            </div>
            {/* Waiting Time config fields */}
            {modal.waitingTimeConfig && (() => {
              const wc = modal.waitingTimeConfig!;
              const updWc = (key: keyof WaitingTimeConfig, val: unknown) => setModal({ ...modal, waitingTimeConfig: { ...wc, [key]: val } });
              return (
                <div style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.15)', borderRadius: 8, padding: 14, marginTop: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0d0c2c', marginBottom: 10 }}>⏳ Waiting Time Settings</div>
                  <div className="field" style={{ marginBottom: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      GPS Radius
                      <span style={{ display: 'inline-flex', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(13,12,44,.12)', fontSize: 10, fontWeight: 600 }}>
                        <button type="button" style={{ padding: '2px 8px', background: (wc.distanceUnit || 'm') === 'm' ? '#0d0c2c' : 'transparent', color: (wc.distanceUnit || 'm') === 'm' ? '#fff' : '#0d0c2c', border: 'none', cursor: 'pointer' }} onClick={() => { if (wc.distanceUnit === 'ft') { setModal({ ...modal, waitingTimeConfig: { ...wc, distanceUnit: 'm', gpsArrivalRadius: Math.round(wc.gpsArrivalRadius / 3.281) } }); } }}>metres</button>
                        <button type="button" style={{ padding: '2px 8px', background: wc.distanceUnit === 'ft' ? '#0d0c2c' : 'transparent', color: wc.distanceUnit === 'ft' ? '#fff' : '#0d0c2c', border: 'none', cursor: 'pointer' }} onClick={() => { if ((wc.distanceUnit || 'm') !== 'ft') { setModal({ ...modal, waitingTimeConfig: { ...wc, distanceUnit: 'ft', gpsArrivalRadius: Math.round(wc.gpsArrivalRadius * 3.281) } }); } }}>feet</button>
                      </span>
                    </label>
                    <input type="number" value={wc.gpsArrivalRadius} min={(wc.distanceUnit || 'm') === 'm' ? 25 : 80} max={(wc.distanceUnit || 'm') === 'm' ? 500 : 1640} step={(wc.distanceUnit || 'm') === 'm' ? 25 : 50} onChange={e => updWc('gpsArrivalRadius', +e.target.value)} />
                    <div style={{ fontSize: 10, color: 'rgba(13,12,44,.35)', marginTop: 2 }}>
                      {(wc.distanceUnit || 'm') === 'm'
                        ? `${wc.gpsArrivalRadius}m (≈${Math.round(wc.gpsArrivalRadius * 3.281)} ft)`
                        : `${wc.gpsArrivalRadius} ft (≈${Math.round(wc.gpsArrivalRadius / 3.281)}m)`
                      }
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                      <input type="checkbox" checked={wc.autoStartOnArrival} onChange={e => updWc('autoStartOnArrival', e.target.checked)} />
                      Auto-start timer on GPS arrival
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                      <input type="checkbox" checked={wc.requireReason} onChange={e => updWc('requireReason', e.target.checked)} />
                      Require wait reason when stopping
                    </label>
                  </div>
                  {wc.requireReason && (
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(13,12,44,.5)' }}>Wait Reasons</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                        {wc.waitReasons.map((r, i) => (
                          <span key={i} style={{ fontSize: 11, padding: '3px 8px', background: 'rgba(245,158,11,.1)', borderRadius: 4, color: '#0d0c2c', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            {r}
                            <span style={{ cursor: 'pointer', fontWeight: 'bold', opacity: 0.4, fontSize: 13 }} onClick={() => updWc('waitReasons', wc.waitReasons.filter((_: string, j: number) => j !== i))}>×</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveModal}>{modal.mode === 'add' ? 'Add' : 'Save'}</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
