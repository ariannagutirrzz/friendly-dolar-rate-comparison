import { useCallback, useEffect, useState } from 'react'
import { fetchDolarRates } from './api'
import type { DolarRate } from './types'
import { formatAmount, formatApiDate, formatFetchTime } from './format'

const POLL_INTERVAL_MS = 5 * 60_000

type State = {
  oficial: DolarRate | null
  paralelo: DolarRate | null
  fetchTime: Date | null
  loading: boolean
  error: string | null
}

const initialState: State = {
  oficial: null,
  paralelo: null,
  fetchTime: null,
  loading: true,
  error: null,
}

export function App() {
  const [state, setState] = useState<State>(initialState)

  const loadRates = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const fetchTime = new Date()

    try {
      const data = await fetchDolarRates()

      const oficial = data.find((d) => d.fuente === 'oficial') ?? null
      const paralelo = data.find((d) => d.fuente === 'paralelo') ?? null

      if (!oficial || !paralelo) {
        throw new Error('No se encontraron cotizaciones oficial y paralelo')
      }

      setState({
        oficial,
        paralelo,
        fetchTime,
        loading: false,
        error: null,
      })
    } catch (e) {
      console.error(e)
      setState({
        oficial: null,
        paralelo: null,
        fetchTime: null,
        loading: false,
        error: 'Ocurrió un error al cargar las cotizaciones. Intenta de nuevo más tarde.',
      })
    }
  }, [])

  useEffect(() => {
    void loadRates()
    const id = setInterval(() => {
      void loadRates()
    }, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [loadRates])

  const { oficial, paralelo, fetchTime, loading, error } = state
  const combinedAverage =
    oficial && paralelo ? (oficial.promedio + paralelo.promedio) / 2 : null

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Comparador de Dólar en Venezuela</h1>

          <div className="meta-row">
            <span className="pill pill--primary">Datos en vivo</span>
            <span className="pill pill--soft">Actualiza cada 5 minutos</span>
            <span className="pill pill--outline">Fuente: dolarapi.com</span>
          </div>

          {fetchTime && (
            <p className="fetch-time">Última consulta: {formatFetchTime(fetchTime)}</p>
          )}
        </div>
      </header>

      {loading && (
        <div className="status status--loading">Cargando cotizaciones...</div>
      )}

      {error && <div className="status status--error">{error}</div>}

      {!loading && !error && oficial && paralelo && combinedAverage !== null && (
        <section className="cards-grid">
          <article className="rate-card">
            <h2>{oficial.nombre}</h2>
            <p className="label">Referencia del Banco Central (BCV)</p>
            <p className="value">Bs. {formatAmount(oficial.promedio)}</p>
          </article>

          <article className="rate-card">
            <h2>{paralelo.nombre}</h2>
            <p className="label">Referencia del mercado paralelo</p>
            <p className="value value--accent">Bs. {formatAmount(paralelo.promedio)}</p>
          </article>

          <article className="rate-card rate-card--highlight">
            <h2>Promedio entre ambos</h2>
            <p className="label">Promedio de Oficial y Paralelo</p>
            <p className="value">Bs. {formatAmount(combinedAverage)}</p>
          </article>
        </section>
      )}
    </div>
  )
}

