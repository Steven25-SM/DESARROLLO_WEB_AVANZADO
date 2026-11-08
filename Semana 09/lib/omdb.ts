export type MediaType = 'movie' | 'series'
export type TitleSummary = { Title: string; Year: string; imdbID: string; Type: MediaType | string; Poster: string }
export type TitleDetail = TitleSummary & { Rated?: string; Released?: string; Runtime?: string; Genre?: string; Director?: string; Writer?: string; Actors?: string; Plot?: string; Language?: string; Country?: string; Awards?: string; Ratings?: { Source: string; Value: string }[]; Metascore?: string; imdbRating?: string; imdbVotes?: string; totalSeasons?: string; BoxOffice?: string; Response: string; Error?: string }
export type SearchResponse = { Search?: TitleSummary[]; totalResults?: string; Response: string; Error?: string }
const API_URL = 'https://www.omdbapi.com/'
export const FEATURED_IDS = ['tt0816692', 'tt1375666', 'tt0468569', 'tt0133093', 'tt4154796', 'tt0111161', 'tt0944947', 'tt0903747', 'tt4574334', 'tt1475582']
export async function fetchOmdb(params: Record<string, string>): Promise<TitleDetail | SearchResponse> {
  const key = process.env.OMDB_API_KEY
  if (!key) throw new Error('Falta configurar OMDB_API_KEY en .env.local')
  const url = new URL(API_URL)
  url.searchParams.set('apikey', key)
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value)
  const response = await fetch(url.toString(), { cache: 'no-store', signal: AbortSignal.timeout(12000) })
  if (!response.ok) throw new Error(`OMDb respondió HTTP ${response.status}`)
  return response.json()
}
export const posterUrl = (value?: string) => value && value !== 'N/A' && value.startsWith('https://') ? value : null
