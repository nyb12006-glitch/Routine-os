const MESSAGES: Record<string, string[]> = {
  low: [
    'Perezita en tu pechito',
    'Te pesa el culo, espabila',
    'Borra la app mejor',
  ],
  medium_low: [
    'Mañana hazlo en serio',
    'Mejor que nada es, desde luego',
    'La paciencia es una virtud',
  ],
  medium: [
    'Soy de ver el vaso medio lleno',
    '¡Tú puedes… hacerlo mejor!',
    'Cogiendo ritmo',
  ],
  medium_high: [
    'Te estás dejando los wingels',
    '¡Vamos a tope xeee!',
    'Te está dando vagofobia',
  ],
  high: [
    'Te has ganado la hamburguesa',
    'Nada mal, pequeñx cakiburi',
    'Nunca es suficiente',
  ],
}

function getTier(percent: number): string {
  if (percent < 15)  return 'low'
  if (percent < 40)  return 'medium_low'
  if (percent < 60)  return 'medium'
  if (percent < 85)  return 'medium_high'
  return 'high'
}

// Devuelve un mensaje aleatorio para el % dado
// Evita repetir el último si puede
let lastMsg = ''
export function getMoodMessage(percent: number): string {
  const tier = getTier(percent)
  const pool = MESSAGES[tier]
  const filtered = pool.filter((m) => m !== lastMsg)
  const source = filtered.length > 0 ? filtered : pool
  const msg = source[Math.floor(Math.random() * source.length)]
  lastMsg = msg
  return msg
}

export function getMoodEmoji(percent: number): string {
  if (percent < 15)  return '😤'
  if (percent < 40)  return '😒'
  if (percent < 60)  return '🙂'
  if (percent < 85)  return '💪'
  return '🔥'
}
