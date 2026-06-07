import React, { useState, useEffect, useRef } from 'react'
import { getMoodMessage, getMoodEmoji } from '../utils/mood'

interface Props {
  percent: number
  count: number
}

const styles = `
.mood-card {
  margin: 4px 22px 0;
  cursor: pointer; position: relative;
  background:
    linear-gradient(var(--bg), var(--bg)) padding-box,
    linear-gradient(135deg, rgba(110,249,255,0.4), rgba(192,110,255,0.4), rgba(255,110,247,0.4)) border-box;
  border: 1px solid transparent;
  transition: all 0.2s;
}
.mood-card:hover {
  background:
    linear-gradient(var(--bg2), var(--bg2)) padding-box,
    linear-gradient(135deg, rgba(110,249,255,0.7), rgba(192,110,255,0.7), rgba(255,110,247,0.7)) border-box;
  border: 1px solid transparent;
}
.mood-card-inner {
  padding: 14px 16px 12px;
  background: linear-gradient(135deg,
    rgba(110,249,255,0.04) 0%, rgba(192,110,255,0.03) 50%, rgba(255,110,247,0.04) 100%);
}
.mood-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 9px;
}
.mood-tag {
  font-family: 'Syncopate', sans-serif;
  font-size: 8px; font-weight: 700; letter-spacing: 3px;
  color: var(--h1); text-shadow: 0 0 10px var(--h1);
}
.mood-signal { display: flex; gap: 3px; align-items: center; }
.sig-dot {
  width: 5px; height: 5px; border-radius: 50%;
  animation: sigPulse 1.8s ease-in-out infinite;
}
.sig-dot:nth-child(1) { background: var(--h5); box-shadow: 0 0 6px var(--h5); }
.sig-dot:nth-child(2) { background: var(--h1); box-shadow: 0 0 6px var(--h1); animation-delay: 0.3s; }
.sig-dot:nth-child(3) { background: var(--h2); box-shadow: 0 0 6px var(--h2); animation-delay: 0.6s; }
@keyframes sigPulse {
  0%,100% { opacity: 0.3; transform: scale(0.8) }
  50%      { opacity: 1;   transform: scale(1)   }
}
.mood-emoji {
  font-size: 28px; margin-bottom: 6px;
  filter: drop-shadow(0 0 8px rgba(255,255,255,0.3));
}
.mood-text {
  font-family: 'DM Mono', monospace;
  font-size: 13px; font-weight: 300; font-style: italic;
  color: var(--c1); line-height: 1.65; letter-spacing: 0.2px;
}
.mood-footer {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 10px;
}
.mood-pct-badge {
  font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 2px;
  padding: 3px 8px;
  background: rgba(110,249,255,0.08);
  border: 1px solid rgba(110,249,255,0.2);
  color: var(--h1);
}
.mood-refresh {
  font-family: 'DM Mono', monospace; font-size: 8px;
  letter-spacing: 1.5px; color: var(--muted); opacity: 0.6;
  transition: opacity 0.15s;
}
.mood-card:hover .mood-refresh { opacity: 1; color: var(--c2); }
`

export default function MoodMessage({ percent, count }: Props) {
  const [msg, setMsg]    = useState('')
  const [emoji, setEmoji]= useState('')
  const lastPct          = useRef<number | null>(null)

  function refresh() {
    setMsg(getMoodMessage(percent))
    setEmoji(getMoodEmoji(percent))
    lastPct.current = percent
  }

  useEffect(() => {
    if (lastPct.current !== percent) refresh()
  }, [percent])

  if (count === 0) return null

  return (
    <>
      <style>{styles}</style>
      <div className="mood-card" onClick={refresh} title="tap para nuevo mensaje">
        <div className="mood-card-inner">
          <div className="mood-header">
            <span className="mood-tag">COACH.OS</span>
            <span className="mood-signal">
              <span className="sig-dot" /><span className="sig-dot" /><span className="sig-dot" />
            </span>
          </div>
          <div className="mood-emoji">{emoji}</div>
          <p className="mood-text">{msg || '…'}</p>
          <div className="mood-footer">
            <span className="mood-pct-badge">{percent}% HOY</span>
            <span className="mood-refresh">⟳ NUEVO</span>
          </div>
        </div>
      </div>
    </>
  )
}
