import { useState, useRef, useEffect, useCallback } from 'react';
import type { StageName, StagesMap, StageTask, AppliesToScope, TaskConfig } from '../types';
import { TASKS, TASK_MAP } from '../data/tasks';
import { SERVICES } from '../data/services';
import { CLIENTS } from '../data/clients';
import { PRESETS } from '../data/presets';
import { TEMPLATES } from '../data/templates';
import type { ToastFn } from '../App';

const JOB_STAGES: StageName[] = ['Enroute to Pickup', 'Pickup', 'Enroute to Delivery', 'Delivery'];

const CAT_CLASS: Record<string, string> = {
  Verification: 'cat-verification',
  Capture: 'cat-capture',
  Confirmation: 'cat-confirmation',
  Communication: 'cat-communication',
};

function configSummary(t: StageTask): string {
  const c = t.config;
  switch (t.taskId) {
    case 'photo': return `${c.minPhotos ?? 1} photo min`;
    case 'age': return `Age ${c.minAge ?? 18}+`;
    case 'signature': return c.signerNameReq ? 'Name req' : '';
    case 'checkbox': return c.label ?? '';
    case 'geofence': return `${c.radius ?? 100}m`;
    case 'barcode': return c.mustMatch ? 'Must match' : '';
    case 'coldchain': return `${c.minTemp}–${c.maxTemp}°C`;
    case 'timestamp': return c.mode === 'auto' ? 'Auto' : 'Manual';
    case 'instruction-note': return c.label || 'Instruction Note';
    default: return '';
  }
}

interface Props { showToast: ToastFn }

export default function WorkflowsTab({ showToast }: Props) {
  const [currentPreset, setCurrentPreset] = useState('standard');
  const [stages, setStages] = useState<StagesMap>(() => JSON.parse(JSON.stringify(PRESETS.standard.stages)));
  const [appliesTo, setAppliesTo] = useState<AppliesToScope>('default');
  const [libOpen, setLibOpen] = useState(true);
  const [tmplOpen, setTmplOpen] = useState(false);
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
  const [addMenuStage, setAddMenuStage] = useState<StageName | null>(null);
  const [dragOverStage, setDragOverStage] = useState<StageName | null>(null);

  const dragRef = useRef<{ fromStage: StageName; fromIdx: number } | null>(null);
  const dragLibRef = useRef<string | null>(null);

  const updateStages = useCallback((fn: (s: StagesMap) => StagesMap) => {
    setStages(prev => fn(JSON.parse(JSON.stringify(prev))));
  }, []);

  const addTask = useCallback((stage: StageName, taskId: string) => {
    const t = TASK_MAP.get(taskId);
    if (!t) return;
    updateStages(s => {
      if (!s[stage]) s[stage] = [];
      s[stage]!.push({ taskId, required: true, config: { ...t.config } });
      return s;
    });
  }, [updateStages]);

  const removeTask = useCallback((stage: StageName, idx: number) => {
    updateStages(s => {
      s[stage]?.splice(idx, 1);
      if (s[stage]?.length === 0) delete s[stage];
      return s;
    });
  }, [updateStages]);

  const toggleRequired = useCallback((stage: StageName, idx: number) => {
    updateStages(s => {
      const task = s[stage]?.[idx];
      if (task) task.required = !task.required;
      return s;
    });
  }, [updateStages]);

  const updateConfig = useCallback((stage: StageName, idx: number, prop: keyof TaskConfig, val: TaskConfig[keyof TaskConfig]) => {
    updateStages(s => {
      const task = s[stage]?.[idx];
      if (task) (task.config as Record<string, unknown>)[prop] = val;
      return s;
    });
  }, [updateStages]);

  const loadPreset = useCallback((key: string) => {
    setCurrentPreset(key);
    setStages(JSON.parse(JSON.stringify(PRESETS[key].stages)));
    setExpandedBlocks(new Set());
  }, []);

  const toggleBlock = useCallback((key: string) => {
    setExpandedBlocks(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  // Drag handlers
  const onDragStartBlock = useCallback((stage: StageName, idx: number) => {
    dragRef.current = { fromStage: stage, fromIdx: idx };
    dragLibRef.current = null;
  }, []);

  const onDragStartLib = useCallback((taskId: string) => {
    dragLibRef.current = taskId;
    dragRef.current = null;
  }, []);

  const onDrop = useCallback((stage: StageName) => {
    setDragOverStage(null);
    if (dragLibRef.current) {
      addTask(stage, dragLibRef.current);
      dragLibRef.current = null;
    } else if (dragRef.current) {
      const { fromStage, fromIdx } = dragRef.current;
      updateStages(s => {
        const task = s[fromStage]?.splice(fromIdx, 1)?.[0];
        if (!task) return s;
        if (s[fromStage]?.length === 0) delete s[fromStage];
        if (!s[stage]) s[stage] = [];
        s[stage]!.push(task);
        return s;
      });
      dragRef.current = null;
    }
  }, [addTask, updateStages]);

  // Close add menu on outside click
  useEffect(() => {
    if (!addMenuStage) return;
    const handler = () => setAddMenuStage(null);
    setTimeout(() => document.addEventListener('click', handler, { once: true }), 0);
    return () => document.removeEventListener('click', handler);
  }, [addMenuStage]);

  const renderInlineConfig = (task: StageTask, stage: StageName, idx: number) => {
    const c = task.config;
    const upd = (prop: keyof TaskConfig, val: TaskConfig[keyof TaskConfig]) => updateConfig(stage, idx, prop, val);

    switch (task.taskId) {
      case 'photo':
        return (<>
          <CfgField label="Min photos"><input className="cfg-input" type="number" value={c.minPhotos ?? 1} min={1} max={10} onChange={e => upd('minPhotos', +e.target.value)} /></CfgField>
          <CfgField label="Max photos"><input className="cfg-input" type="number" value={c.maxPhotos ?? 5} min={1} max={20} onChange={e => upd('maxPhotos', +e.target.value)} /></CfgField>
        </>);
      case 'signature':
        return <CfgToggle label="Name required" checked={!!c.signerNameReq} onChange={v => upd('signerNameReq', v)} />;
      case 'checkbox':
        return <CfgField label="Label"><input className="cfg-input wide" value={c.label ?? ''} onChange={e => upd('label', e.target.value)} /></CfgField>;
      case 'age':
        return <CfgField label="Min age"><input className="cfg-input" type="number" value={c.minAge ?? 18} min={1} onChange={e => upd('minAge', +e.target.value)} /></CfgField>;
      case 'barcode':
        return <CfgToggle label="Must match job" checked={!!c.mustMatch} onChange={v => upd('mustMatch', v)} />;
      case 'geofence':
        return <CfgField label="Radius (m)"><input className="cfg-input" type="number" value={c.radius ?? 100} min={10} onChange={e => upd('radius', +e.target.value)} /></CfgField>;
      case 'timestamp':
        return <CfgField label="Mode"><select className="cfg-input" value={c.mode ?? 'auto'} onChange={e => upd('mode', e.target.value)}><option value="auto">auto</option><option value="manual">manual</option></select></CfgField>;
      case 'coldchain':
        return (<>
          <CfgField label="Min °C"><input className="cfg-input" type="number" value={c.minTemp ?? 0} onChange={e => upd('minTemp', +e.target.value)} /></CfgField>
          <CfgField label="Max °C"><input className="cfg-input" type="number" value={c.maxTemp ?? 8} onChange={e => upd('maxTemp', +e.target.value)} /></CfgField>
        </>);
      case 'clientnote':
        return (<>
          <div style={{ fontSize: 10, color: 'rgba(13,12,44,.45)', fontStyle: 'italic', marginBottom: 2 }}>Notes populated from booking — "Notes to Courier" field</div>
          <CfgToggle label="Must acknowledge (read button)" checked={c.acknowledge !== false} onChange={v => upd('acknowledge', v)} />
        </>);
      case 'instruction-note':
        return (<>
          <CfgField label="Note name"><input className="cfg-input wide" value={c.label ?? 'Instruction Note'} onChange={e => upd('label', e.target.value)} placeholder="e.g. Don't Speed" /></CfgField>
          <div className="cfg-field" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <span>Instructions</span>
            <textarea
              className="cfg-input wide"
              style={{ minHeight: 60, resize: 'vertical', fontFamily: 'inherit', fontSize: 11, lineHeight: 1.4, padding: '6px 8px', borderRadius: 6 }}
              value={c.note ?? ''}
              onChange={e => upd('note', e.target.value)}
              placeholder="Enter the instructions the courier must read before proceeding..."
            />
          </div>
          <CfgToggle label="Must acknowledge (read button)" checked={c.acknowledge !== false} onChange={v => upd('acknowledge', v)} />
          <div style={{ fontSize: 10, color: 'rgba(13,12,44,.35)', marginTop: 2 }}>✓ Changes auto-saved to workflow</div>
          {c.note && (
            <div style={{ marginTop: 6, padding: '8px 10px', background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#92400e', marginBottom: 4 }}>📱 Courier sees:</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#0d0c2c' }}>{c.label || 'Instruction Note'}</div>
              <div style={{ fontSize: 10, color: '#44403c', marginTop: 2, whiteSpace: 'pre-wrap' }}>{c.note}</div>
              {c.acknowledge !== false && (
                <div style={{ marginTop: 6, padding: '4px 12px', background: '#0d0c2c', color: '#fff', borderRadius: 4, fontSize: 10, fontWeight: 600, textAlign: 'center', display: 'inline-block' }}>
                  I've Read This ✓
                </div>
              )}
            </div>
          )}
        </>);
      default:
        return <span style={{ color: 'rgba(13,12,44,.35)', fontSize: 11 }}>Click to configure</span>;
    }
  };

  return (
    <>
      {/* Filter bar */}
      <div className="filter-bar">
        <label>Workflow scope:</label>
        <select value={appliesTo} onChange={e => setAppliesTo(e.target.value as AppliesToScope)}>
          <option value="default">Default (all jobs)</option>
          <option value="client">Client override</option>
          <option value="service">Service type override</option>
          <option value="both">Client + Service type</option>
          <option value="np">Network Partner</option>
        </select>
        {(appliesTo === 'client' || appliesTo === 'both') && (
          <select>
            <option>Select client...</option>
            {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
          </select>
        )}
        {(appliesTo === 'service' || appliesTo === 'both') && (
          <select>
            <option>Select service type...</option>
            {SERVICES.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
          </select>
        )}
        {appliesTo === 'np' && (
          <select>
            <option>Select network partner...</option>
            <option>CourierPost</option>
            <option>NZ Couriers</option>
            <option>Castle Parcels</option>
            <option>Fastway</option>
          </select>
        )}
        {appliesTo === 'default' && (
          <span style={{ fontSize: 12, color: 'rgba(13,12,44,.4)', marginLeft: 8 }}>
            This workflow applies to all jobs unless a more specific override exists
          </span>
        )}
      </div>

      {/* Preset bar */}
      <div className="preset-bar">
        <label>Template:</label>
        {Object.entries(PRESETS).map(([key, preset]) => (
          <div
            key={key}
            className={`preset-chip${currentPreset === key ? ' active' : ''}`}
            onClick={() => loadPreset(key)}
          >
            {preset.name}
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div className="pipeline">
        {JOB_STAGES.map((stageName, si) => {
          const tasks = stages[stageName] ?? [];
          return (
            <Fragment key={stageName} si={si} stagesLength={JOB_STAGES.length}>
              <div className="stage" data-stage={stageName}>
                <div className="stage-header">
                  <span className="stage-num">{si + 1}</span>
                  <h3>{stageName}</h3>
                </div>
                <div
                  className={`stage-body${dragOverStage === stageName ? ' drag-over' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOverStage(stageName); }}
                  onDragLeave={() => setDragOverStage(null)}
                  onDrop={e => { e.preventDefault(); onDrop(stageName); }}
                >
                  {tasks.map((task, ti) => {
                    const taskDef = TASK_MAP.get(task.taskId);
                    if (!taskDef) return null;
                    const blockKey = `${stageName}-${ti}`;
                    const isExpanded = expandedBlocks.has(blockKey);
                    return (
                      <div
                        key={blockKey}
                        className={`task-block${isExpanded ? ' expanded' : ''}`}
                        draggable
                        onDragStart={() => onDragStartBlock(stageName, ti)}
                        onClick={() => toggleBlock(blockKey)}
                      >
                        <div className="tb-top">
                          <span className="tb-icon">{taskDef.icon}</span>
                          <span className="tb-name">{task.taskId === 'instruction-note' && task.config.label && task.config.label !== 'Instruction Note' ? task.config.label : taskDef.name}</span>
                          <button className="tb-remove" onClick={e => { e.stopPropagation(); removeTask(stageName, ti); }}>×</button>
                        </div>
                        <div className="tb-meta">
                          <span
                            className={`tb-badge ${task.required ? 'required' : 'optional'}`}
                            onClick={e => { e.stopPropagation(); toggleRequired(stageName, ti); }}
                          >
                            {task.required ? 'Required' : 'Optional'}
                          </span>
                          <span style={{ fontSize: 10, color: 'rgba(13,12,44,.4)' }}>{configSummary(task)}</span>
                        </div>
                        <div className="tb-expand" onClick={e => e.stopPropagation()}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
                            {renderInlineConfig(task, stageName, ti)}
                          </div>
                          <div
                            style={{ marginTop: 8, textAlign: 'center', cursor: 'pointer', fontSize: 10, color: 'rgba(13,12,44,.35)', userSelect: 'none' }}
                            onClick={() => toggleBlock(blockKey)}
                          >
                            ▲ Collapse
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  className="add-btn"
                  style={{ position: 'relative' }}
                  onClick={e => { e.stopPropagation(); setAddMenuStage(addMenuStage === stageName ? null : stageName); }}
                >
                  + Add Task
                  {addMenuStage === stageName && (
                    <div className="add-dropdown" style={{ display: 'block' }}>
                      {TASKS.map(t => (
                        <div key={t.id} className="add-item" onClick={e => { e.stopPropagation(); addTask(stageName, t.id); setAddMenuStage(null); }}>
                          {t.icon} {t.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {si < JOB_STAGES.length - 1 && <div className="stage-arrow">→</div>}
            </Fragment>
          );
        })}
      </div>

      {/* Task Library */}
      <div className="task-lib-panel">
        <div className="lib-header" onClick={() => setLibOpen(!libOpen)}>
          <h3>📚 Available Task Library <span style={{ fontWeight: 400, fontSize: 12, color: 'rgba(13,12,44,.4)' }}>({TASKS.length} task types — drag into stages above)</span></h3>
          <span className={`chevron${libOpen ? ' open' : ''}`}>▼</span>
        </div>
        <div className={`task-lib-body${libOpen ? ' open' : ''}`}>
          <div className="lib-grid">
            {TASKS.map(t => (
              <div key={t.id} className="lib-task" draggable onDragStart={() => onDragStartLib(t.id)}>
                <span className="lt-icon">{t.icon}</span>
                <div>
                  <div className="lt-name">{t.name}</div>
                  <div className="lt-desc">{t.desc}</div>
                  <span className={`lt-cat ${CAT_CLASS[t.cat] ?? ''}`}>{t.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Saved Templates */}
      <div className="templates-section">
        <div className="tmpl-header" onClick={() => setTmplOpen(!tmplOpen)}>
          <h3>
            📋 Saved Templates{' '}
            <span style={{ fontWeight: 400, fontSize: 12, color: 'rgba(13,12,44,.4)' }}>({TEMPLATES.length} templates)</span>{' '}
            <span className={`chevron${tmplOpen ? ' open' : ''}`} style={{ fontSize: 12, color: 'rgba(13,12,44,.3)', transition: 'transform .2s' }}>▼</span>
          </h3>
          <button className="btn btn-sm btn-outline" onClick={e => { e.stopPropagation(); showToast('New template created'); }}>+ New Template</button>
        </div>
        {tmplOpen && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="tmpl-table">
              <thead>
                <tr><th>Name</th><th>Status</th><th>Applies To</th><th>Steps</th><th>Modified</th></tr>
              </thead>
              <tbody>
                {TEMPLATES.map(t => (
                  <tr key={t.name} style={{ cursor: 'pointer' }} onClick={() => t.preset && loadPreset(t.preset)}>
                    <td style={{ fontWeight: 500 }}>{t.name}</td>
                    <td><span className="status-badge status-active">{t.status}</span></td>
                    <td style={{ color: 'rgba(13,12,44,.4)' }}>{t.linked}</td>
                    <td>{t.steps}</td>
                    <td style={{ color: 'rgba(13,12,44,.35)', fontSize: 11 }}>{t.modified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// Helper components
function Fragment({ children }: { children: React.ReactNode; si: number; stagesLength: number }) {
  return <>{children}</>;
}

function CfgField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="cfg-field">
      <span>{label}</span>
      {children}
    </div>
  );
}

function CfgToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="cfg-field">
      <span>{label}</span>
      <div className="cfg-toggle-wrap">
        <label className="toggle" onClick={e => e.stopPropagation()}>
          <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
          <span className="slider" />
        </label>
      </div>
    </div>
  );
}
