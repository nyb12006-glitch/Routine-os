import React from 'react'

interface Props {
  pct: number
  done: number
  total: number
}

const styles = `
.ring-wrap {
  position: relative; flex-shrink: 0;
  width: 110px; height: 110px;
}
.ring-center {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}
.ring-pct-num {
  font-family: 'Archivo Black', sans-serif;
  font-size: 30px; line-height: 1;
  background: linear-gradient(135deg, #6ef9ff, #ff6ef7);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.ring-pct-sym {
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: 1px; color: rgba(168,212,255,0.4); margin-top: -2px;
}
.ring-sub {
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: 1.5px; color: rgba(168,212,255,0.4); margin-top: 3px;
}
`

export default function ProgressRing({ pct, done, total }: Props) {
  const r = 42
  const circ = 2 * Math.PI * r
  const offset = circ - (circ * pct / 100)

  return (
    <>
      <style>{styles}</style>
      <div className="ring-wrap">
        <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#6ef9ff" />
              <stop offset="40%"  stopColor="#c06eff" />
              <stop offset="100%" stopColor="#ff6ef7" />
            </linearGradient>
            <filter id="rglow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(168,212,255,0.07)" strokeWidth="7" />
          <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(110,249,255,0.15)" strokeWidth="11"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
          <circle cx="55" cy="55" r={r} fill="none" stroke="url(#rg)" strokeWidth="5"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            filter="url(#rglow)"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }} />
        </svg>
        <div className="ring-center">
          <div className="ring-pct-num">{pct}</div>
          <div className="ring-pct-sym">%</div>
          <div className="ring-sub">{done}/{total}</div>
        </div>
      </div>
    </>
  )
}
