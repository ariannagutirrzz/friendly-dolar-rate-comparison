import type { DolarRate } from './types'

const API_URL = 'https://ve.dolarapi.com/v1/dolares'

export async function fetchDolarRates(): Promise<DolarRate[]> {
  const res = await fetch(API_URL, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Error al obtener cotizaciones: HTTP ${res.status}`)
  }

  return (await res.json()) as DolarRate[]
}

