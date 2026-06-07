import React, { useState } from 'react'
import type { Routine, DayOfWeek } from '../types'
import { fmtTime, DAYS_ORDER, DAY_LABELS } from '../utils/time'

interface Props {
  routines: Routine[]
  onSave: (routines: Routine[]) => void
}

const EMPTY_FORM = { name: '', startTime: '08:00', endTime: '09:00', emoji: '⚡', days: ['L','M','X','J','V'] as DayOfWeek[] }

const styles = `
.routines-shell { display: flex; flex-direction: column; gap: 0; }

.sec-header {
  display: flex; align-items: center;
  padding: 18px 22px 10px;
}
.sec-label {
  font-family: 'Syncopate', sans-serif; font-size: 8px;
  font-weight: 700; letter-spacing: 4px; color: var(--muted);
}
.sec-line { flex: 1; height: 1px; margin-left: 14px;
  background: linear-gradient(90deg, var(--border2), transparent); }

/* Form */
.form-wrap {
  margin: 0 22px 10px;
  padding: 18px;
  background:
    linear-gradient(var(--bg2), var(--bg2)) padding-box,
    linear-gradient(135deg, rgba(110,249,255,0.5), rgba(192,110,255,0.4), rgba(255,110,247,0.5)) border-box;
  border: 1px solid transparent;
  box-shadow: 0 0 30px rgba(110,249,255,0.08), inset 0 0 30px rgba(110,249,255,0.02);
}
.form-title {
  font-family: 'Syncopate', sans-serif; font-size: 9px; font-weight: 700;
  letter-spacing: 3px; color: var(--h1); text-shadow: 0 0 12px var(--h1);
  margin-bottom: 14px;
}
.form-row { display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
.form-field { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 80px; }
.form-lbl { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 2px; color: var(--muted); }
.form-input {
  background: rgba(0,0,0,0.45);
  border: 1px solid rgba(168,212,255,0.18);
  color: var(--c1); padding: 9px 11px;
  font-family: 'Archivo Black', sans-serif; font-size: 15px; letter-spacing: 0.5px;
  outline: none; width: 100%;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.form-input::placeholder { color: var(--muted); font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 300; }
.form-input:focus { border-color: rgba(110,249,255,0.5); box-shadow: 0 0 16px rgba(110,249,255,0.12); }
input[type="time"].form-input { color-scheme: dark; }

/* Day selector */
.days-wrap { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 2px; }
.day-btn {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syncopate', sans-serif; font-size: 7px; font-weight: 700; letter-spacing: 1px;
  background: rgba(168,212,255,0.04);
  border: 1px solid rgba(168,212,255,0.15);
  color: var(--muted); cursor: pointer; border-radius: 2px;
  transition: all 0.15s;
}
.day-btn.active {
  background: rgba(110,249,255,0.12);
  border-color: var(--h1); color: var(--h1);
  box-shadow: 0 0 10px rgba(110,249,255,0.2);
}
.day-btn:hover:not(.active) { border-color: var(--border2); color: var(--c2); }

.form-btns { display: flex; gap: 8px; margin-top: 14px; }
.btn-primary {
  background: linear-gradient(135deg, var(--h1), var(--h3), var(--h2));
  background-size: 200% 200%; animation: btnShift 4s linear infinite;
  color: var(--bg); border: none; padding: 10px 22px;
  font-family: 'Syncopate', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 2.5px;
  cursor: pointer; box-shadow: 0 0 20px rgba(110,249,255,0.35);
  transition: transform 0.1s, box-shadow 0.2s;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 24px rgba(110,249,255,0.5); }
@keyframes btnShift { 0% { background-position: 0% 50% } 100% { background-position: 200% 50% } }
.btn-secondary {
  background: rgba(168,212,255,0.04); border: 1px solid var(--border2);
  color: var(--muted); padding: 10px 16px;
  font-family: 'Syncopate', sans-serif; font-size: 9px; letter-spacing: 2px;
  cursor: pointer; transition: all 0.15s;
}
.btn-secondary:hover { border-color: var(--border3); color: var(--c1); }

/* Add button */
.btn-add {
  margin: 0 22px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px; width: calc(100% - 44px);
  background: rgba(168,212,255,0.02);
  border: 1px dashed rgba(168,212,255,0.18);
  color: var(--muted);
  font-family: 'Syncopate', sans-serif; font-size: 9px; letter-spacing: 2.5px;
  cursor: pointer; transition: all 0.2s;
}
.btn-add:hover {
  border-color: rgba(110,249,255,0.4); color: var(--h1);
  box-shadow: 0 0 20px rgba(110,249,255,0.08);
  background: rgba(110,249,255,0.03);
}

/* Routine cards */
.routines-list { padding: 0 22px; display: flex; flex-direction: column; gap: 7px; margin-top: 4px; padding-bottom: 16px; }
.routine-card {
  display: flex; align-items: center; gap: 13px; padding: 12px 15px;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01)) padding-box,
    linear-gradient(135deg, rgba(168,212,255,0.12), rgba(168,212,255,0.05)) border-box;
  border: 1px solid transparent;
  transition: all 0.15s;
}
.routine-card:hover {
  background:
    linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)) padding-box,
    linear-gradient(135deg, rgba(168,212,255,0.28), rgba(168,212,255,0.10)) border-box;
  border: 1px solid transparent;
}
.routine-info { flex: 1; min-width: 0; }
.routine-name {
  font-family: 'Archivo Black', sans-serif; font-size: 16px;
  letter-spacing: 0.5px; color: var(--c1);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.routine-time {
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: 1.5px; color: var(--muted); margin-top: 3px;
}
.routine-days {
  font-family: 'DM Mono', monospace; font-size: 8px;
  letter-spacing: 1px; color: var(--h1); margin-top: 2px;
}
.routine-actions { display: flex; gap: 6px; flex-shrink: 0; }
.btn-sm {
  background: rgba(168,212,255,0.03); border: 1px solid var(--border);
  color: var(--muted); font-family: 'Syncopate', sans-serif; font-size: 8px;
  letter-spacing: 1.5px; padding: 5px 9px; cursor: pointer; transition: all 0.15s;
}
.btn-sm:hover { border-color: var(--border3); color: var(--c1); }
.btn-sm.del:hover { border-color: rgba(255,34,85,0.5); color: var(--red); box-shadow: 0 0 10px rgba(255,34,85,0.15); }
`

export default function Routines({ routines, onSave }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editId,   setEditId]   = useState<string | null>(null)
  const [form,     setForm]     = useState(EMPTY_FORM)

  const toMin = (t: string) => { const [h,m] = t.split(':').map(Number); return h*60+m }
  const sorted = [...routines].sort((a, b) => toMin(a.startTime) - toMin(b.startTime))

  function openNew() {
    setForm(EMPTY_FORM); setEditId(null); setShowForm(true)
  }
  function openEdit(r: Routine) {
    setForm({ name: r.name, startTime: r.startTime, endTime: r.endTime, emoji: r.emoji, days: r.days })
    setEditId(r.id); setShowForm(true)
  }
  function cancel() { setShowForm(false); setEditId(null) }

  function submit() {
    if (!form.name.trim()) return
    if (editId) {
      onSave(routines.map((r) => r.id === editId ? { ...r, ...form } : r))
    } else {
      onSave([...routines, { ...form, id: Date.now().toString() }])
    }
    cancel()
  }

  function deleteR(id: string) {
    onSave(routines.filter((r) => r.id !== id))
  }

  function toggleDay(d: DayOfWeek) {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(d)
        ? prev.days.filter((x) => x !== d)
        : [...prev.days, d]
    }))
  }

  return (
    <>
      <style>{styles}</style>
      <div className="routines-shell">
        <div className="sec-header">
          <span className="sec-label">MIS RUTINAS</span>
          <div className="sec-line" />
        </div>

        {showForm && (
          <div className="form-wrap">
            <div className="form-title">{editId ? '// EDITAR RUTINA' : '// NUEVA RUTINA'}</div>
            <div className="form-row">
              <div className="form-field" style={{ flex: 2 }}>
                <label className="form-lbl">NOMBRE</label>
                <input className="form-input" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ej: meditar" />
              </div>
              <div className="form-field" style={{ flex: '0 0 64px' }}>
                <label className="form-lbl">EMOJI</label>
                <input className="form-input" value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="form-lbl">INICIO</label>
                <input type="time" className="form-input" value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-lbl">FIN</label>
                <input type="time" className="form-input" value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
              </div>
            </div>
            <div className="form-field">
              <label className="form-lbl" style={{ marginBottom: 6 }}>DÍAS</label>
              <div className="days-wrap">
                {DAYS_ORDER.map((d) => (
                  <button key={d} className={`day-btn ${form.days.includes(d) ? 'active' : ''}`}
                    onClick={() => toggleDay(d)}>
                    {DAY_LABELS[d].slice(0, 2)}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-btns">
              <button className="btn-primary" onClick={submit}>{editId ? 'GUARDAR' : 'AÑADIR'}</button>
              <button className="btn-secondary" onClick={cancel}>CANCELAR</button>
            </div>
          </div>
        )}

        <div className="routines-list">
          {routines.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 20px', fontFamily: "'Archivo Black', sans-serif", fontSize: 22, letterSpacing: 2, color: 'rgba(168,212,255,0.10)', lineHeight: 1.5 }}>
              SIN RUTINAS<br />AÑADE LA PRIMERA
            </div>
          )}
          {sorted.map((r) => (
            <div className="routine-card" key={r.id}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{r.emoji}</span>
              <div className="routine-info">
                <div className="routine-name">{r.name}</div>
                <div className="routine-time">{fmtTime(r.startTime)} → {fmtTime(r.endTime)}</div>
                <div className="routine-days">{r.days.join(' · ')}</div>
              </div>
              <div className="routine-actions">
                <button className="btn-sm" onClick={() => openEdit(r)}>EDT</button>
                <button className="btn-sm del" onClick={() => deleteR(r.id)}>DEL</button>
              </div>
            </div>
          ))}
        </div>

        {!showForm && (
          <button className="btn-add" style={{ marginTop: 10 }} onClick={openNew}>
            + NUEVA RUTINA
          </button>
        )}
      </div>
    </>
  )
}
