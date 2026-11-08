import type { Metadata } from 'next'
import { fetchOmdb, FEATURED_IDS, type TitleDetail } from '@/lib/omdb'
import CinemaApp from '@/components/CinemaApp'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'NOVAFLIX — Películas y series', description: 'Descubre películas y series con Next.js: catálogo SSR y búsqueda CSR.' }
export default async function Home() {
  let featured: TitleDetail[] = []
  let setupError: string | null = null
  if (!process.env.OMDB_API_KEY) {
    setupError = 'Configura tu API key gratuita en el archivo .env.local para cargar el catálogo.'
  } else {
    const results = await Promise.allSettled(FEATURED_IDS.map((i) => fetchOmdb({ i, plot: 'short' }) as Promise<TitleDetail>))
    featured = results.flatMap((result) => result.status === 'fulfilled' && result.value.Response === 'True' ? [result.value] : [])
    if (!featured.length) setupError = 'No se pudo cargar el catálogo. Comprueba tu conexión y tu API key de OMDb.'
  }
  return <CinemaApp featured={featured} setupError={setupError} />
}
