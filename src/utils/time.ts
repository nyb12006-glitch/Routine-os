import type { DayOfWeek, Routine, TaskStatus } from '../types'

export function todayKey(): string {
  return new Date().toISOString().split('T')[0]
}

export function toMin(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function nowMin(): number {
  const n = new Date()
  return n.getHours() * 60 + n.getMinutes()
}

export function fmtTime(t: string): string {
  const [h, m] = t.split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m}${hr >= 12 ? 'PM' : 'AM'}`
}

export function taskStatus(task: Routine, done: boolean): TaskStatus {
  if (done) return 'done'
  const n = nowMin(), e = toMin(task.endTime), s = toMin(task.startTime)
  if (n > e) return 'overdue'
  if (n >= s) return 'active'
  return 'pending'
}

// Devuelve el índice del día actual como DayOfWeek
const DAY_MAP: DayOfWeek[] = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
export function todayDow(): DayOfWeek {
  return DAY_MAP[new Date().getDay()]
}

// Filtra las rutinas que aplican hoy
export function routinesForToday(routines: Routine[]): Routine[] {
  const dow = todayDow()
  return routines.filter((r) => r.days.includes(dow))
}

export const DAYS_ORDER: DayOfWeek[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
export const DAY_LABELS: Record<DayOfWeek, string> = {
  L: 'LUN', M: 'MAR', X: 'MIÉ', J: 'JUE', V: 'VIE', S: 'SÁB', D: 'DOM'
}

export const DAYS_ES = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
export const MONTHS_ES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']
