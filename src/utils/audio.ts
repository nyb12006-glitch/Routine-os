// Genera sonidos de alarma con Web Audio API — sin archivos externos

let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  return ctx
}

// Desbloquea el contexto de audio en iOS (requiere interacción del usuario)
export function unlockAudio(): void {
  const c = getCtx()
  if (c.state === 'suspended') c.resume()
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.3,
  delay = 0
): void {
  const c = getCtx()
  if (c.state === 'suspended') c.resume()

  const osc = c.createOscillator()
  const gainNode = c.createGain()

  osc.connect(gainNode)
  gainNode.connect(c.destination)

  osc.type = type
  osc.frequency.setValueAtTime(frequency, c.currentTime + delay)

  gainNode.gain.setValueAtTime(0, c.currentTime + delay)
  gainNode.gain.linearRampToValueAtTime(gain, c.currentTime + delay + 0.05)
  gainNode.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration)

  osc.start(c.currentTime + delay)
  osc.stop(c.currentTime + delay + duration)
}

// Alarma de "empieza pronto" — 3 pitidos ascendentes
export function playStartSoon(): void {
  playTone(440, 0.15, 'square', 0.25, 0)
  playTone(554, 0.15, 'square', 0.25, 0.2)
  playTone(659, 0.3,  'square', 0.3,  0.4)
}

// Alarma de "ha terminado" — 2 pitidos descendentes
export function playFinished(): void {
  playTone(659, 0.15, 'sine', 0.3, 0)
  playTone(440, 0.4,  'sine', 0.2, 0.2)
}

// Vibración del móvil
export function vibrate(pattern: number[]): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}
