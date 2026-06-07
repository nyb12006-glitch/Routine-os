export type DayOfWeek = 'L' | 'M' | 'X' | 'J' | 'V' | 'S' | 'D'

export interface Routine {
  id: string
  name: string
  startTime: string   // "HH:MM"
  endTime: string     // "HH:MM"
  emoji: string
  days: DayOfWeek[]   // qué días de la semana aplica
}

export interface DaySnapshot {
  total: number
  done: number
  percent: number
  tasks: (Routine & { completed: boolean })[]
}

export type History = Record<string, DaySnapshot>  // key = "YYYY-MM-DD"

export type TaskStatus = 'done' | 'active' | 'overdue' | 'pending'
