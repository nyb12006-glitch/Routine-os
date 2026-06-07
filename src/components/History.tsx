import React from 'react'
import type { History } from '../types'

interface Props {
  history: History
}

const styles = `
.history-shell { display: flex; flex-direction: column; }

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

.history-list {
  padding: 0 22px; display: flex; flex-direction: column;
  gap: 10px; padding-bottom: 16px;
}
.hist-empty {
  text-align: center; padding: 52px 20px;
  font-family: 'Archivo Black', sans-serif; font-size: 22px;
  letter-spacing: 2px; color: rgba(168,212,255,0.10); line-height: 1.6;
}
.hist-card {
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01)) padding-box,
    linear-gradient(135deg, rgba(168,212,255,0.14), rgba(168,212,255,0.05)) border-box;
  border: 1px solid transparent;
}
.hist-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 15px;
  border-bottom: 1px solid rgba(168,212,255,0.08);
  background: rgba(255,255,255,0.015);
}
.hist-date {
  font-family: 'Syncopate', sans-serif; font-size: 10px;
  font-weight: 700; letter-spacing: 2.5px;
  background: linear-gradient(90deg, var(--c1), var(--c2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hist-right { display: flex; align-items: center; gap: 10px; }
.hist-bar-wrap { width: 60px; height: 3px; background: rgba(168,212,255,0.07); border-radius: 2px; overflow: hidden; }
.hist-bar-fill {
  height: 100%; border-radius: 2px;
  background: linear-gradient(90deg, var(--h1), var(--h2));
  box-shadow: 0 0 6px var(--h1);
}
.hist-pct {
  font-family: 'Archivo Black', sans-serif; font-size: 26px;
  background: linear-gradient(135deg, var(--h1), var(--h2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  min-width: 52px; text-align: right;
}
.hist-tasks { padding: 11px 15px; display: flex; flex-direction: column; gap: 6px; }
.hist-task {
  display: flex; align-items: center; gap: 9px;
  font-family: 'DM Mono', monospace; font-size: 11px;
  letter-spacing: 0.3px; color: var(--muted);
}
.hist-task.done { color: var(--c2); }
.hist-dot {
  width: 5px; height: 5px; border-radius: 50%;
  flex-shrink: 0; background: rgba(168,212,255,0.15);
}
.hist-task.done .hist-dot { background: var(--green); box-shadow: 0 0 6px var(--green); }
`

export default function HistoryView({ history }: Props) {
  const days = Object.entries(history).sort((a, b) => b[0].localeCompare(a[0]))

  return (
    <>
      <style>{styles}</style>
      <div className="history-shell">
        <div className="sec-header">
          <span className="sec-label">HISTORIAL</span>
          <div className="sec-line" />
        </div>
        <div className="history-list">
          {days.length === 0 && (
            <div className="hist-empty">SIN HISTORIAL<br />COMPLETA TU<br />PRIMER DÍA</div>
          )}
          {days.map(([date, data]) => (
            <div className="hist-card" key={date}>
              <div className="hist-head">
                <span className="hist-date">{date}</span>
                <div className="hist-right">
                  <div className="hist-bar-wrap">
                    <div className="hist-bar-fill" style={{ width: `${data.percent}%` }} />
                  </div>
                  <span className="hist-pct">{data.percent}%</span>
                </div>
              </div>
              <div className="hist-tasks">
                {(data.tasks || []).map((t) => (
                  <div className={`hist-task ${t.completed ? 'done' : ''}`} key={t.id}>
                    <div className="hist-dot" />
                    {t.emoji} {t.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
