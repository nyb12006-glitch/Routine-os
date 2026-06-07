import React from 'react'
import type { Routine } from '../types'
import { taskStatus, fmtTime, routinesForToday } from '../utils/time'
import ProgressRing from './ProgressRing'
import MoodMessage from './MoodMessage'
import type { NotifPermission } from '../hooks/useNotifications'

interface Props {
  routines: Routine[]
  checked: Record<string, boolean>
  toggle: (id: string) => void
  permission: NotifPermission
  onRequestPermission: () => void
}

const styles = `
.today-shell { display: flex; flex-direction: column; }

/* Progress */
.progress-section {
  padding: 20px 22px;
  display: flex; align-items: center; gap: 20px;
}
.progress-stats { flex: 1; display: flex; flex-direction: column; gap: 10px; }
.stat-row { display: flex; flex-direction: column; gap: 3px; }
.stat-num {
  font-family: 'Archivo Black', sans-serif;
  font-size: 34px; line-height: 1; letter-spacing: 1px; color: var(--c1);
}
.stat-num span { font-size: 18px; color: var(--muted); }
.stat-lbl {
  font-family: 'DM Mono', monospace; font-size: 8px;
  letter-spacing: 2.5px; color: var(--muted);
}
.holo-track {
  height: 4px; background: rgba(168,212,255,0.07);
  border-radius: 2px; overflow: hidden;
}
.holo-fill {
  height: 100%; border-radius: 2px;
  background: linear-gradient(90deg, var(--h1), var(--h3), var(--h2));
  background-size: 200% 100%;
  animation: holoFlow 3s linear infinite;
  transition: width 1s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 0 10px var(--h1);
}
@keyframes holoFlow { from { background-position: 0% 0% } to { background-position: 200% 0% } }

/* Notification banner */
.notif-banner {
  margin: 0 22px 4px;
  padding: 11px 14px;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  background: rgba(255,204,0,0.06);
  border: 1px solid rgba(255,204,0,0.25);
}
.notif-text {
  font-family: 'DM Mono', monospace; font-size: 11px;
  letter-spacing: 0.5px; color: var(--amber); line-height: 1.4;
}
.notif-btn {
  background: rgba(255,204,0,0.1); border: 1px solid rgba(255,204,0,0.4);
  color: var(--amber); padding: 6px 12px;
  font-family: 'Syncopate', sans-serif; font-size: 8px;
  font-weight: 700; letter-spacing: 1.5px; cursor: pointer;
  white-space: nowrap; transition: all 0.15s; flex-shrink: 0;
}
.notif-btn:hover { background: rgba(255,204,0,0.2); }

/* Section header */
.sec-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 22px 10px;
}
.sec-label {
  font-family: 'Syncopate', sans-serif; font-size: 8px;
  font-weight: 700; letter-spacing: 4px; color: var(--muted);
}
.sec-line {
  flex: 1; height: 1px; margin-left: 14px;
  background: linear-gradient(90deg, var(--border2), transparent);
}

/* Task list */
.task-list {
  padding: 0 22px; display: flex; flex-direction: column; gap: 7px;
  padding-bottom: 16px;
}
.task-empty {
  text-align: center; padding: 52px 20px;
  font-family: 'Archivo Black', sans-serif; font-size: 22px;
  letter-spacing: 2px; color: rgba(168,212,255,0.10); line-height: 1.5;
}

/* Task card */
.task-card {
  position: relative;
  display: flex; align-items: center; gap: 13px;
  padding: 13px 15px; cursor: pointer; overflow: hidden; border-radius: 1px;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)) padding-box,
    linear-gradient(135deg, rgba(168,212,255,0.12), rgba(168,212,255,0.05)) border-box;
  border: 1px solid transparent;
  backdrop-filter: blur(2px);
  transition: all 0.18s;
}
.task-card::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%);
  transform: translateX(-100%); transition: transform 0.5s; pointer-events: none;
}
.task-card:hover::after { transform: translateX(100%); }
.task-card:hover {
  background:
    linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)) padding-box,
    linear-gradient(135deg, rgba(168,212,255,0.30), rgba(168,212,255,0.12)) border-box;
  border: 1px solid transparent;
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0,0,10,0.4);
}

.status-bar {
  position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
  transition: all 0.2s;
}
.task-card.s-done    .status-bar { background: var(--green); box-shadow: 0 0 8px var(--green); }
.task-card.s-active  .status-bar { background: var(--h1); box-shadow: 0 0 12px var(--h1); animation: barPulse 2s infinite; }
.task-card.s-overdue .status-bar { background: var(--red); box-shadow: 0 0 8px var(--red); }
.task-card.s-pending .status-bar { background: rgba(168,212,255,0.15); }
@keyframes barPulse {
  0%,100% { box-shadow: 0 0 8px var(--h1) }
  50%      { box-shadow: 0 0 20px var(--h1), 0 0 40px rgba(110,249,255,0.3) }
}

.task-card.s-done { opacity: 0.38; }
.task-card.s-active {
  background:
    linear-gradient(135deg, rgba(110,249,255,0.04), rgba(110,249,255,0.01)) padding-box,
    linear-gradient(135deg, rgba(110,249,255,0.35), rgba(110,249,255,0.08)) border-box;
  border: 1px solid transparent;
}
.task-card.s-overdue {
  background:
    linear-gradient(135deg, rgba(255,34,85,0.04), rgba(255,34,85,0.01)) padding-box,
    linear-gradient(135deg, rgba(255,34,85,0.25), rgba(255,34,85,0.05)) border-box;
  border: 1px solid transparent;
}

.task-check {
  width: 22px; height: 22px; border-radius: 2px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-family: 'Syncopate', sans-serif; font-size: 11px; font-weight: 700;
  background: rgba(168,212,255,0.04);
  border: 1px solid rgba(168,212,255,0.20);
  transition: all 0.2s;
}
.task-card.s-done    .task-check { background: var(--green); border-color: var(--green); color: var(--bg); box-shadow: 0 0 10px rgba(57,255,176,0.5); }
.task-card.s-overdue .task-check { border-color: rgba(255,34,85,0.5); }
.task-card.s-active  .task-check { border-color: var(--h1); box-shadow: 0 0 10px rgba(110,249,255,0.4); }

.task-emoji { font-size: 22px; flex-shrink: 0; filter: drop-shadow(0 0 6px rgba(255,255,255,0.2)); }

.task-body { flex: 1; min-width: 0; }
.task-name {
  font-family: 'Archivo Black', sans-serif; font-size: 17px; letter-spacing: 0.5px;
  color: var(--c1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.task-card.s-done .task-name { text-decoration: line-through; color: var(--muted); }
.task-time {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 1.5px;
  color: var(--muted); margin-top: 3px;
}
.task-card.s-overdue .task-time { color: rgba(255,34,85,0.8); }
.task-card.s-active  .task-time { color: var(--h1); }

.task-pill {
  font-family: 'Syncopate', sans-serif; font-size: 7px; font-weight: 700;
  letter-spacing: 2px; padding: 4px 8px; border-radius: 1px; flex-shrink: 0;
}
.pill-active {
  background: rgba(110,249,255,0.08); color: var(--h1);
  border: 1px solid rgba(110,249,255,0.30);
  animation: pillGlow 2s ease-in-out infinite;
}
.pill-overdue {
  background: rgba(255,34,85,0.08); color: var(--red);
  border: 1px solid rgba(255,34,85,0.30);
}
@keyframes pillGlow {
  0%,100% { box-shadow: 0 0 8px rgba(110,249,255,0.2) }
  50%      { box-shadow: 0 0 16px rgba(110,249,255,0.5) }
}
`

export default function Today({ routines, checked, toggle, permission, onRequestPermission }: Props) {
  const todayRoutines = routinesForToday(routines)
  const sorted = [...todayRoutines].sort((a, b) => {
    const [ah, am] = a.startTime.split(':').map(Number)
    const [bh, bm] = b.startTime.split(':').map(Number)
    return (ah * 60 + am) - (bh * 60 + bm)
  })
  const done  = todayRoutines.filter((r) => checked[r.id]).length
  const total = todayRoutines.length
  const pct   = total ? Math.round((done / total) * 100) : 0

  return (
    <>
      <style>{styles}</style>
      <div className="today-shell">
        <div className="progress-section">
          <ProgressRing pct={pct} done={done} total={total} />
          <div className="progress-stats">
            <div className="stat-row">
              <div className="stat-num">{done}<span>/{total}</span></div>
              <div className="stat-lbl">TAREAS COMPLETADAS</div>
            </div>
            <div className="holo-track">
              <div className="holo-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        <MoodMessage percent={pct} count={total} />

        {/* Banner de notificaciones si no están activadas */}
        {permission === 'default' && (
          <div className="notif-banner">
            <span className="notif-text">Activa las alarmas para recibir avisos</span>
            <button className="notif-btn" onClick={onRequestPermission}>ACTIVAR</button>
          </div>
        )}

        <div className="sec-header">
          <span className="sec-label">AGENDA HOY</span>
          <div className="sec-line" />
        </div>

        <div className="task-list">
          {sorted.length === 0 && (
            <div className="task-empty">SIN RUTINAS<br />PARA HOY</div>
          )}
          {sorted.map((task) => {
            const st = taskStatus(task, !!checked[task.id])
            return (
              <div key={task.id} className={`task-card s-${st}`} onClick={() => toggle(task.id)}>
                <div className="status-bar" />
                <div className="task-check">{checked[task.id] ? '✓' : ''}</div>
                <span className="task-emoji">{task.emoji}</span>
                <div className="task-body">
                  <div className="task-name">{task.name}</div>
                  <div className="task-time">{fmtTime(task.startTime)} → {fmtTime(task.endTime)}</div>
                </div>
                {st === 'overdue' && <span className="task-pill pill-overdue">VENCIDA</span>}
                {st === 'active'  && <span className="task-pill pill-active">AHORA</span>}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
