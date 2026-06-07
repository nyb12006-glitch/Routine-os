import { useState, useEffect, useCallback } from 'react'
import type { Routine, History } from '../types'
import { todayKey, routinesForToday } from '../utils/time'

const SK = {
  routines: 'ros-routines-v1',
  history:  'ros-history-v1',
  today:    'ros-today-v1',
  lastDate: 'ros-lastdate-v1',
}

const DEFAULT_ROUTINES: Routine[] = [
  { id: '1', name: 'MEDITAR',        startTime: '07:00', endTime: '07:20', emoji: '🧘', days: ['L','M','X','J','V','S','D'] },
  { id: '2', name: 'EJERCICIO',      startTime: '07:30', endTime: '08:30', emoji: '💪', days: ['L','M','X','J','V'] },
  { id: '3', name: 'REVISAR EMAILS', startTime: '09:00', endTime: '09:30', emoji: '📧', days: ['L','M','X','J','V'] },
]

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function save(key: string, value: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function useStorage() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [checked,  setChecked]  = useState<Record<string, boolean>>({})
  const [history,  setHistory]  = useState<History>({})
  const [ready,    setReady]    = useState(false)

  useEffect(() => {
    const r = load<Routine[]>(SK.routines, DEFAULT_ROUTINES)
    const h = load<History>(SK.history, {})
    const tk = todayKey()
    const lastDate = localStorage.getItem(SK.lastDate)

    if (lastDate && lastDate !== tk) {
      // Día nuevo — guarda snapshot de ayer en historial
      const yc = load<Record<string, boolean>>(SK.today, {})
      const todayR = routinesForToday(r)
      const done = todayR.filter((x) => yc[x.id]).length
      h[lastDate] = {
        total: todayR.length,
        done,
        percent: todayR.length ? Math.round((done / todayR.length) * 100) : 0,
        tasks: todayR.map((x) => ({ ...x, completed: !!yc[x.id] })),
      }
      save(SK.history, h)
      save(SK.today, {})
      localStorage.setItem(SK.lastDate, tk)
      setChecked({})
    } else {
      const c = load<Record<string, boolean>>(SK.today, {})
      setChecked(c)
      if (!lastDate) localStorage.setItem(SK.lastDate, tk)
    }

    setRoutines(r)
    setHistory(h)
    setReady(true)
  }, [])

  const saveRoutines = useCallback((r: Routine[]) => {
    setRoutines(r)
    save(SK.routines, r)
  }, [])

  const saveChecked = useCallback((c: Record<string, boolean>) => {
    setChecked(c)
    save(SK.today, c)
  }, [])

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      save(SK.today, next)
      return next
    })
  }, [])

  return { routines, checked, history, ready, saveRoutines, saveChecked, toggle }
}
