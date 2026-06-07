import { useEffect, useRef, useState } from 'react'
import type { Routine } from '../types'
import { toMin, routinesForToday } from '../utils/time'
import { playStartSoon, playFinished, vibrate, unlockAudio } from '../utils/audio'

export type NotifPermission = 'granted' | 'denied' | 'default' | 'unsupported'

function sendNotification(title: string, body: string, tag: string): void {
  // Intenta via SW primero (funciona en segundo plano)
  if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      title,
      body,
      tag,
    })
  } else if (Notification.permission === 'granted') {
    // Fallback directo
    new Notification(title, { body, tag, icon: '/icons/icon-192.png' })
  }
}

export function useNotifications(routines: Routine[]) {
  const [permission, setPermission] = useState<NotifPermission>('default')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Detectar soporte
  useEffect(() => {
    if (!('Notification' in window)) {
      setPermission('unsupported')
    } else {
      setPermission(Notification.permission as NotifPermission)
    }
  }, [])

  // Pedir permiso
  const requestPermission = async (): Promise<void> => {
    unlockAudio() // Desbloquear audio en iOS al mismo tiempo
    if (!('Notification' in window)) return
    const result = await Notification.requestPermission()
    setPermission(result as NotifPermission)
  }

  // Programar alarmas para hoy
  useEffect(() => {
    // Limpiar timers anteriores
    timers.current.forEach(clearTimeout)
    timers.current = []

    const todayRoutines = routinesForToday(routines)
    const now = new Date()
    const nowMs = now.getTime()

    // Hora base de hoy en ms
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)
    const dayMs = startOfDay.getTime()

    todayRoutines.forEach((routine) => {
      const startMin  = toMin(routine.startTime)
      const endMin    = toMin(routine.endTime)
      const warnMin   = startMin - 10  // 10 min antes

      const startMs = dayMs + startMin * 60 * 1000
      const endMs   = dayMs + endMin   * 60 * 1000
      const warnMs  = dayMs + warnMin  * 60 * 1000

      // ── Alarma 10 min antes ──────────────────────────────────
      const warnDelay = warnMs - nowMs
      if (warnDelay > 0) {
        const t = setTimeout(() => {
          playStartSoon()
          vibrate([200, 100, 200])
          sendNotification(
            `⚡ ${routine.emoji} ${routine.name}`,
            `Empieza en 10 minutos — ${routine.startTime}`,
            `warn-${routine.id}`
          )
        }, warnDelay)
        timers.current.push(t)
      }

      // ── Alarma al iniciar ────────────────────────────────────
      const startDelay = startMs - nowMs
      if (startDelay > 0) {
        const t = setTimeout(() => {
          playStartSoon()
          vibrate([300, 100, 300, 100, 300])
          sendNotification(
            `🚀 ${routine.emoji} ${routine.name}`,
            `¡Empieza ahora! — ${routine.startTime}`,
            `start-${routine.id}`
          )
        }, startDelay)
        timers.current.push(t)
      }

      // ── Alarma al terminar ───────────────────────────────────
      const endDelay = endMs - nowMs
      if (endDelay > 0) {
        const t = setTimeout(() => {
          playFinished()
          vibrate([400, 100, 200])
          sendNotification(
            `✅ ${routine.emoji} ${routine.name}`,
            `Tiempo terminado — ¿lo has hecho?`,
            `end-${routine.id}`
          )
        }, endDelay)
        timers.current.push(t)
      }
    })

    return () => { timers.current.forEach(clearTimeout) }
  }, [routines, permission])

  return { permission, requestPermission }
}
