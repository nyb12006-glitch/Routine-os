import React, { useState } from 'react'
import { useClock } from './hooks/useClock'
import { useStorage } from './hooks/useStorage'
import { useNotifications } from './hooks/useNotifications'
import Today from './components/Today'
import Routines from './components/Routines'
import HistoryView from './components/History'
import { DAYS_ES, MONTHS_ES } from './utils/time'

type View = 'today' | 'routines' | 'history'

const appStyles = `
.app-shell {
  position: relative; z-index: 10;
  display: flex; flex-direction: column; flex: 1;
  padding-bottom: calc(80px + var(--safe-bot));
  overflow-x: hidden;
}

/* Header */
.header { padding: 22px 22px 0; }
.header-row1 {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 14px;
}
.logo-wrap { display: flex; flex-direction: column; }
.logo-eyebrow {
  font-family: 'Syncopate', sans-serif; font-size: 7px; font-weight: 400;
  letter-spacing: 4px; color: var(--h1);
  text-shadow: 0 0 10px var(--h1); margin-bottom: 4px;
}
.logo-main {
  font-family: 'Archivo Black', sans-serif;
  font-size: 36px; line-height: 1; letter-spacing: 1px;
  background: linear-gradient(135deg, #ffffff 0%, #c8e8ff 25%, #90c8ff 50%, #c8e8ff 75%, #ffffff 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: chromePan 6s linear infinite;
  filter: drop-shadow(0 2px 16px rgba(168,212,255,0.5));
}
@keyframes chromePan { 0% { background-position: 0% 50% } 100% { background-position: 200% 50% } }
.logo-sub {
  font-family: 'DM Mono', monospace; font-size: 8px;
  letter-spacing: 3px; color: var(--muted); margin-top: 3px;
}
.header-right { text-align: right; }
.clock-time {
  font-family: 'Syncopate', sans-serif; font-size: 20px; font-weight: 700;
  letter-spacing: 3px; color: var(--h1);
  text-shadow: 0 0 16px rgba(110,249,255,0.6), 0 0 40px rgba(110,249,255,0.2);
  animation: clockGlow 3s ease-in-out infinite;
}
@keyframes clockGlow {
  0%,100% { text-shadow: 0 0 16px rgba(110,249,255,0.6), 0 0 40px rgba(110,249,255,0.2) }
  50%      { text-shadow: 0 0 24px rgba(110,249,255,0.9), 0 0 60px rgba(110,249,255,0.4) }
}
.clock-date {
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: 2px; color: var(--muted); margin-top: 4px;
}

.h-div {
  height: 1px; margin: 14px 0 0;
  background: linear-gradient(90deg,
    transparent 0%, rgba(110,249,255,0.5) 20%,
    rgba(192,110,255,0.6) 50%, rgba(255,110,247,0.5) 80%, transparent 100%);
  box-shadow: 0 0 8px rgba(110,249,255,0.2);
}

/* Ticker */
.ticker { overflow: hidden; padding: 8px 0; border-bottom: 1px solid var(--border); position: relative; }
.ticker::before, .ticker::after {
  content: ''; position: absolute; top: 0; bottom: 0; width: 40px; z-index: 2;
}
.ticker::before { left: 0; background: linear-gradient(90deg, var(--bg), transparent); }
.ticker::after  { right: 0; background: linear-gradient(-90deg, var(--bg), transparent); }
.ticker-track { display: flex; width: max-content; animation: tickerRun 25s linear infinite; }
@keyframes tickerRun { from { transform: translateX(0) } to { transform: translateX(-50%) } }
.ticker-item {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2px;
  color: var(--muted); white-space: nowrap; padding: 0 28px;
  display: flex; align-items: center; gap: 8px;
}
.ticker-dot {
  width: 4px; height: 4px; border-radius: 50%;
  background: var(--h1); box-shadow: 0 0 6px var(--h1); flex-shrink: 0;
}

/* Nav */
.nav {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 460px;
  display: flex; z-index: 100;
  background: rgba(3,3,10,0.88);
  backdrop-filter: blur(24px) saturate(160%);
  border-top: 1px solid rgba(168,212,255,0.12);
  padding-bottom: var(--safe-bot);
  overflow: hidden;
}
.nav::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--h1) 20%, var(--h3) 50%, var(--h2) 80%, transparent);
  opacity: 0.6;
}
.nav-btn {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 13px 8px 16px; background: none; border: none;
  color: var(--muted);
  font-family: 'Syncopate', sans-serif; font-size: 7px; font-weight: 700; letter-spacing: 2.5px;
  cursor: pointer; position: relative; transition: color 0.15s;
}
.nav-btn.active { color: var(--h1); text-shadow: 0 0 12px var(--h1); }
.nav-btn.active .nav-icon { filter: drop-shadow(0 0 6px var(--h1)); }
.nav-btn:hover:not(.active) { color: var(--c2); }
.nav-btn.active::after {
  content: ''; position: absolute; bottom: var(--safe-bot); left: 25%; right: 25%; height: 2px;
  background: linear-gradient(90deg, var(--h1), var(--h3), var(--h2));
  box-shadow: 0 0 10px var(--h1);
}
.nav-icon { font-size: 19px; }
`

const TICKER_ITEMS = ['SISTEMA ACTIVO', 'SYNC OK', 'v1.0.0', 'RUTINAS CARGADAS', 'HISTORIAL OK', 'ALARMAS ON', 'MODO LIVE']

export default function App() {
  const [view, setView] = useState<View>('today')
  const now = useClock()
  const { routines, checked, history, ready, saveRoutines, toggle } = useStorage()
  const { permission, requestPermission } = useNotifications(routines)

  if (!ready) return null

  const timeStr = now.toTimeString().slice(0, 8)
  const dateStr = `${DAYS_ES[now.getDay()]} ${now.getDate().toString().padStart(2, '0')} ${MONTHS_ES[now.getMonth()]} ${now.getFullYear()}`

  return (
    <>
      <style>{appStyles}</style>

      {/* Backgrounds */}
      <div className="bg-mesh" />
      <div className="bg-grid" />
      <div className="bg-vig" />
      <div className="bg-grain" />
      <div className="bg-scan" />

      {/* Corners */}
      <div className="corners">
        <div className="corner-piece cp-tl" />
        <div className="corner-piece cp-tr" />
        <div className="corner-piece cp-bl" />
        <div className="corner-piece cp-br" />
      </div>

      <div className="app-shell">
        {/* Header */}
        <div className="header">
          <div className="header-row1">
            <div className="logo-wrap">
              <div className="logo-eyebrow">DAILY SYSTEM</div>
              <div className="logo-main">ROUTINE.OS</div>
              <div className="logo-sub">BUILD YOUR DISCIPLINE</div>
            </div>
            <div className="header-right">
              <div className="clock-time">{timeStr}</div>
              <div className="clock-date">{dateStr}</div>
            </div>
          </div>
          <div className="h-div" />
          <div className="ticker">
            <div className="ticker-track">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
                <div className="ticker-item" key={i}>
                  <div className="ticker-dot" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Views */}
        {view === 'today' && (
          <Today
            routines={routines}
            checked={checked}
            toggle={toggle}
            permission={permission}
            onRequestPermission={requestPermission}
          />
        )}
        {view === 'routines' && (
          <Routines routines={routines} onSave={saveRoutines} />
        )}
        {view === 'history' && (
          <HistoryView history={history} />
        )}
      </div>

      {/* Nav */}
      <nav className="nav">
        {([
          { id: 'today',    icon: '◉', lbl: 'HOY' },
          { id: 'routines', icon: '≡', lbl: 'RUTINAS' },
          { id: 'history',  icon: '◷', lbl: 'HISTORIAL' },
        ] as { id: View; icon: string; lbl: string }[]).map((tab) => (
          <button
            key={tab.id}
            className={`nav-btn ${view === tab.id ? 'active' : ''}`}
            onClick={() => setView(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            {tab.lbl}
          </button>
        ))}
      </nav>
    </>
  )
}
