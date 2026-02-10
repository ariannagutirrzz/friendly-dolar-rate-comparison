export function formatAmount(value: number) {
  return value.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatApiDate(isoDate: string) {
  const d = new Date(isoDate)
  if (Number.isNaN(d.getTime())) return isoDate

  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffSecs = Math.floor(diffMs / 1000)

  let relativeTime = ''
  if (diffSecs < 60) {
    relativeTime = `hace ${diffSecs} segundo${diffSecs !== 1 ? 's' : ''}`
  } else if (diffMins < 60) {
    relativeTime = `hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`
  } else {
    const diffHours = Math.floor(diffMins / 60)
    relativeTime = `hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`
  }

  const formattedTime = d.toLocaleString('es-VE', {
    timeZone: 'America/Caracas',
    dateStyle: 'short',
    timeStyle: 'short',
    hour12: true,
  })

  return `${formattedTime} (${relativeTime})`
}

export function formatFetchTime(date: Date) {
  return date.toLocaleString('es-VE', {
    timeZone: 'America/Caracas',
    dateStyle: 'short',
    timeStyle: 'short',
    hour12: true,
  })
}

