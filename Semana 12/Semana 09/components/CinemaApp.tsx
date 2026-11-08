'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { SearchResponse, TitleDetail, TitleSummary } from '@/lib/omdb'

type Category = 'all' | 'movie' | 'series'
const GOLD = '#ff587f'
const noPoster = (poster?: string) => !poster || poster === 'N/A'
function Icon({ name, size = 20 }: { name: 'search' | 'arrow' | 'play' | 'close' | 'star' | 'clock' | 'film' | 'chevron' | 'spark' | 'menu'; size?: number }) {
  const paths: Record<typeof name, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>, arrow: <><path d="M4 12h16m-7-7 7 7-7 7"/></>, play: <path d="m8 5 11 7-11 7V5Z"/>,
    close: <path d="M5 5 19 19M19 5 5 19"/>, star: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2Z"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>, film: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4m-4 8h4m10-8h4m-4 8h4"/></>, chevron: <path d="m9 18 6-6-6-6"/>,
    spark: <><path d="m12 2 2.1 7.9L22 12l-7.9 2.1L12 22l-2.1-7.9L2 12l7.9-2.1L12 2Z"/></>, menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
function Poster({ item, className = '' }: { item: TitleSummary; className?: string }) {
  return noPoster(item.Poster) ? <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-[#38313b] via-[#161a29] to-[#373028] text-[#d3a0ff] ${className}`}><Icon name="film" size={48}/></div> : <img src={item.Poster} alt={`Póster de ${item.Title}`} loading="lazy" className={`h-full w-full object-cover ${className}`} />
}
function PosterCard({ item, onOpen, index }: { item: TitleSummary & Partial<TitleDetail>; onOpen: (item: TitleSummary) => void; index: number }) {
  return <button type="button" onClick={() => onOpen(item)} className="group min-w-0 cursor-pointer text-left" aria-label={`Ver detalles de ${item.Title}`}>
    <div className="relative aspect-[2/3] overflow-hidden rounded-[14px] border border-white/10 bg-[#16102b] shadow-[0_14px_34px_rgba(0,0,0,.22)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-[#ff587f]/60 group-hover:shadow-[0_18px_45px_rgba(246,80,156,.22)]">
      <Poster item={item} className="transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
      <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-bold tracking-widest text-white backdrop-blur-lg">{item.Type === 'series' ? 'SERIE' : 'PELÍCULA'}</span>
      {'imdbRating' in item && item.imdbRating && item.imdbRating !== 'N/A' && <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/55 px-2.5 py-1.5 text-xs font-bold text-[#ffcd79] backdrop-blur-md"><Icon name="star" size={13}/> {item.imdbRating}</span>}
      <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#ff587f] text-[#181510] opacity-0 transition-all group-hover:opacity-100"><Icon name="arrow" size={18}/></span>
    </div>
    <div className="mt-3.5 flex items-start gap-2"><span className="mt-0.5 text-xs font-bold tabular-nums text-[#8a8790]">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0"><h3 className="truncate text-[14px] font-bold text-[#f8f6f1] transition-colors group-hover:text-[#ff587f]">{item.Title}</h3><p className="mt-1 text-xs text-[#888892]">{item.Year} <span className="mx-1">·</span> {item.Type === 'series' ? 'Serie' : 'Película'}</p></div></div>
  </button>
}
function DetailModal({ item, onClose }: { item: TitleDetail | null; onClose: () => void }) {
  useEffect(() => { if (!item) return; const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'; const listener = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }; window.addEventListener('keydown', listener); return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', listener) } }, [item, onClose])
  if (!item) return null
  const detailFields = [['Director', item.Director], ['Reparto', item.Actors], ['Guion', item.Writer], ['País', item.Country], ['Idioma', item.Language], ['Premios', item.Awards]]
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#06030e]/90 p-2 backdrop-blur-2xl sm:p-5" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
    <div role="dialog" aria-modal="true" aria-label={`Detalles de ${item.Title}`} className="fadein relative my-auto w-full max-w-6xl overflow-hidden rounded-[26px] border border-fuchsia-300/25 bg-[#130c26] shadow-[0_40px_130px_rgba(0,0,0,.85),0_0_90px_rgba(188,52,178,.18)]">
      <button onClick={onClose} aria-label="Cerrar detalle" className="absolute right-5 top-5 z-20 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/75 text-white shadow-xl backdrop-blur-lg transition hover:scale-105 hover:bg-[#ff587f]"><Icon name="close"/></button>
      <div className="grid md:grid-cols-[minmax(300px,40%)_1fr]"><div className="relative aspect-[16/11] min-h-[250px] overflow-hidden md:aspect-auto md:min-h-[630px]"><Poster item={item}/><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#130c26]/75 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#130c26]/50"/></div>
      <div className="max-h-[58vh] overflow-y-auto p-6 sm:p-9 md:max-h-[86vh] md:px-11 md:py-12"><p className="mb-3 text-[11px] font-bold uppercase tracking-[.25em] text-[#ff587f]">{item.Type === 'series' ? 'Serie de televisión' : 'Largometraje'} · {item.Year}</p><h2 className="max-w-[620px] text-4xl font-black leading-[1.08] tracking-[-.045em] sm:text-5xl xl:text-6xl">{item.Title}</h2><div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#c6c5c9]">{item.imdbRating && item.imdbRating !== 'N/A' && <span className="flex items-center gap-1 font-bold text-[#ff587f]"><Icon name="star" size={16}/> {item.imdbRating}/10 IMDb</span>}<span>{item.Rated && item.Rated !== 'N/A' ? item.Rated : 'Sin clasificación'}</span><span className="flex items-center gap-1"><Icon name="clock" size={15}/> {item.Runtime || 'N/D'}</span></div>
      <p className="mt-4 text-xs font-medium tracking-wide text-[#e8a9ff]">{item.Genre && item.Genre !== 'N/A' ? item.Genre : 'Género no disponible'}</p><h3 className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-[#85838e]">Sinopsis</h3><p className="mt-3 max-w-[620px] text-[15px] leading-8 text-[#e2dfe0] sm:text-[16px]">{item.Plot && item.Plot !== 'N/A' ? item.Plot : 'Sin sinopsis disponible.'}</p>
      <div className="mt-7 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">{detailFields.filter(([, v]) => v && v !== 'N/A').map(([key, value]) => <div key={key}><p className="text-[11px] uppercase tracking-wider text-[#777680]">{key}</p><p className="mt-1 text-sm text-[#e8e6e4]">{value}</p></div>)}{item.totalSeasons && item.totalSeasons !== 'N/A' && <div><p className="text-[11px] uppercase tracking-wider text-[#777680]">Temporadas</p><p className="mt-1 text-sm">{item.totalSeasons}</p></div>}{item.BoxOffice && item.BoxOffice !== 'N/A' && <div><p className="text-[11px] uppercase tracking-wider text-[#777680]">Taquilla</p><p className="mt-1 text-sm">{item.BoxOffice}</p></div>}</div>
      {item.Ratings && item.Ratings.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{item.Ratings.map((r) => <span key={r.Source} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#dbd1ed]">{r.Source}: <strong className="text-white">{r.Value}</strong></span>)}</div>}
      </div></div>
    </div>
  </div>
}
export default function CinemaApp({ featured, setupError }: { featured: TitleDetail[]; setupError: string | null }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('all')
  const [results, setResults] = useState<TitleSummary[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState<TitleDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const searchRef = useRef<HTMLElement>(null)
  const hasQuery = query.trim().length >= 2
  useEffect(() => {
    const search = query.trim()
    if (search.length < 2) { setResults([]); setTotal(0); setPage(1); setLoading(false); setMessage(''); return }
    const controller = new AbortController()
    setLoading(true)
    setMessage('')
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ s: search, page: String(page) })
        if (category !== 'all') params.set('type', category)
        const response = await fetch(`/api/omdb?${params}`, { signal: controller.signal })
        const data: SearchResponse = await response.json()
        if (!response.ok) throw new Error(data.Error || 'No se pudo realizar la búsqueda.')
        if (data.Response === 'False') { setResults([]); setTotal(0); setMessage(data.Error === 'Movie not found!' ? 'No encontramos títulos con esos filtros. Prueba otra búsqueda.' : (data.Error || 'No se encontraron resultados.')) }
        else { setResults(data.Search || []); setTotal(Number(data.totalResults || 0)) }
      } catch (error) { if (!controller.signal.aborted) { setResults([]); setTotal(0); setMessage(error instanceof Error ? error.message : 'Error consultando OMDb.') } }
      finally { if (!controller.signal.aborted) setLoading(false) }
    }, 400)
    return () => { clearTimeout(timer); controller.abort() }
  }, [query, category, page])
  async function openDetail(item: TitleSummary) {
    setDetailLoading(true)
    try {
      const response = await fetch(`/api/omdb?i=${encodeURIComponent(item.imdbID)}`)
      const detail: TitleDetail = await response.json()
      if (!response.ok || detail.Response === 'False') throw new Error(detail.Error || 'No se pudieron cargar los detalles.')
      setSelected(detail)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudieron cargar los detalles.'); searchRef.current?.scrollIntoView({ behavior: 'smooth' }) }
    finally { setDetailLoading(false) }
  }
  const hero = featured.find(f => f.imdbID === 'tt0816692') || featured[0]
  const countLabel = useMemo(() => `${total.toLocaleString('es-PE')} resultados`, [total])
  return <div className="min-h-screen overflow-x-hidden bg-[#080619]">
    <header className="sticky top-0 z-30 border-b border-[#ef354e]/35 bg-gradient-to-r from-[#590512] via-[#9f0d20] to-[#470516] shadow-[0_7px_26px_rgba(79,2,17,.43)] backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-12">
      <a href="#inicio" className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ff587f]/30 bg-[#ff587f]/10 text-[#ff587f]"><Icon name="film" size={23}/></div><div className="text-[22px] font-black tracking-[.18em]">NOVAFLIX<span className="text-[#ff587f]">.</span></div></a>
      <nav className="hidden items-center gap-9 text-[13px] font-semibold text-[#f7dce1] sm:flex"><a href="#explorar" className="hover:text-[#ff587f]">Explorar</a><a href="#coleccion" className="hover:text-[#ff587f]">Colección</a><a href="#acerca" className="hover:text-[#ff587f]">El proyecto</a></nav>
      <button onClick={() => searchRef.current?.scrollIntoView({ behavior: 'smooth' })} className="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[.055] px-4 py-2.5 text-xs font-bold text-[#eeecea] transition hover:border-[#ff587f]/60"><Icon name="search" size={15}/> <span className="hidden sm:inline">Buscar títulos</span></button>
    </div></header>
    <main id="inicio">
      <section className="relative isolate overflow-hidden border-b border-fuchsia-400/10 bg-[#0b0620]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_35%,rgba(206,47,137,.23),transparent_54%),radial-gradient(ellipse_at_32%_85%,rgba(99,42,207,.20),transparent_58%)]" />
        <div className="pointer-events-none absolute right-[-11%] top-[-22%] h-[540px] w-[540px] rounded-full bg-fuchsia-600/20 blur-[120px]" />
        <div className="relative mx-auto grid min-h-[530px] max-w-[1380px] items-center gap-8 px-5 pb-8 pt-8 sm:px-8 lg:grid-cols-[.94fr_1.06fr] lg:px-12 lg:py-7">
          <div className="relative z-10 fadein max-w-[640px]">
            <p className="text-[12px] font-extrabold tracking-[.22em] text-[#c9a5fa]">CINE · SERIES · EMOCIONES</p>
            <h1 className="mt-4 text-[48px] font-black leading-[1.04] tracking-[-.06em] sm:text-[67px] xl:text-[80px]">TU PRÓXIMA<br/><span className="bg-gradient-to-r from-[#ffb27b] via-[#ff5c95] to-[#b07aff] bg-clip-text text-transparent">GRAN HISTORIA</span><br/>COMIENZA AQUÍ.</h1>
            <p className="mt-7 max-w-[495px] text-[15px] leading-8 text-[#c6b8d6]">Explora mundos increíbles, encuentra clásicos inolvidables y descubre qué película o serie te atrapará hoy.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3"><button onClick={() => searchRef.current?.scrollIntoView({ behavior: 'smooth' })} className="flex cursor-pointer items-center gap-3 rounded-xl bg-gradient-to-r from-[#ff527b] to-[#f07a60] px-7 py-4 text-[13px] font-black text-white shadow-[0_12px_36px_rgba(255,72,136,.24)] transition hover:brightness-110">Explorar títulos <Icon name="arrow" size={19}/></button><a href="#coleccion" className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/[.07] px-6 py-4 text-[13px] font-bold transition hover:bg-white/15"><Icon name="play" size={17}/> Ver destacados</a></div>
            <div className="mt-10 flex flex-wrap items-center gap-3 text-xs text-[#9f94b3]"><span className="rounded-full border border-white/10 bg-white/[.05] px-3 py-2">✦ Catálogo cinematográfico</span><span className="rounded-full border border-white/10 bg-white/[.05] px-3 py-2">✦ Datos reales de OMDb</span></div>
          </div>
          <div aria-hidden="true" className="relative hidden h-[530px] lg:block">
            <div className="pointer-events-none absolute -inset-12 rounded-full bg-[radial-gradient(ellipse,rgba(255,81,156,.34),rgba(114,50,215,.17)_42%,transparent_72%)] blur-3xl"/>
            {featured.slice(0, 5).map((item, i) => <div key={item.imdbID} className="absolute top-[51%] h-[470px] w-[275px] overflow-hidden rounded-[22px] border-2 border-white/30 bg-[#21113d] shadow-[0_35px_90px_rgba(0,0,0,.85),0_0_38px_rgba(255,82,158,.17)] transition-[filter,box-shadow] duration-500 hover:brightness-110 hover:shadow-[0_40px_100px_rgba(0,0,0,.9),0_0_45px_rgba(255,82,158,.4)]" style={{left: `${12 + i * 19}%`, zIndex: i === 2 ? 10 : 8 - Math.abs(i - 2), transform: `translate(-50%, -50%) rotate(${(i - 2) * 10}deg) translateY(${Math.abs(i-2)*38}px) scale(${i === 2 ? 1.09 : 1})`}}><Poster item={item}/><div className="absolute inset-0 bg-gradient-to-t from-[#120723]/70 via-transparent to-transparent"/></div>)}
            <div className="absolute bottom-1 right-[2%] z-20 rounded-2xl border border-fuchsia-300/30 bg-[#1d103c]/85 px-5 py-3 text-xs font-bold tracking-wide text-[#ffd3ef] shadow-2xl backdrop-blur-xl">✦ Historias para todos los gustos</div>
          </div>
          <div className="relative mx-auto grid w-full max-w-md grid-cols-4 gap-2 lg:hidden">{featured.slice(0, 4).map(item => <div key={item.imdbID} className="aspect-[2/3] overflow-hidden rounded-xl border border-white/15 bg-[#21113d]"><Poster item={item}/></div>)}</div>
        </div>
      </section>
      <section id="coleccion" className="border-y border-white/[.07] bg-[#0d0920]"><div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:px-12"><div className="mb-8 flex items-end justify-between gap-5"><div><p className="text-[11px] font-bold uppercase tracking-[.25em] text-[#dba0ff]">Lo mejor para descubrir</p><h2 className="mt-3 text-[29px] font-black tracking-tight sm:text-[38px]"><span className="text-[#ffac78]">✦</span> Populares en NOVAFLIX</h2></div><span className="hidden text-xs text-[#95929c] sm:block">Selección editorial · SSR</span></div>
        {featured.length > 0 ? <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{featured.map((item, i) => <PosterCard item={item} onOpen={openDetail} key={item.imdbID} index={i}/>)}</div> : <div className="rounded-xl border border-white/10 bg-white/[.035] p-12 text-center text-sm text-[#aba7b0]">El catálogo destacado aparecerá aquí cuando OMDb esté configurado y disponible.</div>}
        <p className="mt-8 text-xs leading-6 text-[#777681]">Selección de títulos conocidos. OMDb proporciona fichas y valoraciones de IMDb; no es un ranking de popularidad en tiempo real.</p>
      </div></section>
      <section ref={searchRef} id="explorar" className="scroll-mt-24 mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:px-12"><div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[.25em] text-[#dba0ff]">Encuentra lo que te inspira</p><h2 className="mt-3 text-[30px] font-black tracking-tight sm:text-[39px]">Encuentra tu <span className="text-[#ff587f]">próxima obsesión</span></h2></div><p className="text-sm text-[#888690]">Miles de historias, una sola búsqueda.</p></div>
        <div className="flex flex-col gap-4 rounded-[20px] border border-white/10 bg-[#18102f] p-4 sm:p-5 lg:flex-row"><div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#110b26] px-4 focus-within:border-[#ff587f]/70"><span className="text-[#fa7caa]"><Icon name="search" size={21}/></span><input aria-label="Buscar películas o series" value={query} onChange={e => { setQuery(e.target.value); setPage(1) }} placeholder="Busca una película o serie... Ej. Batman" className="h-14 w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-[#73717d]"/>{query && <button aria-label="Limpiar búsqueda" onClick={() => { setQuery(''); setPage(1) }} className="cursor-pointer text-[#aaa7ad] hover:text-white"><Icon name="close" size={17}/></button>}</div><div className="flex shrink-0 items-center rounded-xl border border-white/10 bg-[#110b26] p-1">{([['all', 'Todo'], ['movie', 'Películas'], ['series', 'Series']] as const).map(([value, label]) => <button key={value} onClick={() => { setCategory(value); setPage(1) }} className={`flex-1 cursor-pointer rounded-lg px-4 py-3 text-xs font-bold transition-all sm:px-5 ${category === value ? 'bg-[#ff587f] text-[#260b2d]' : 'text-[#aaa8ad] hover:text-white'}`}>{label}</button>)}</div></div>
        {setupError && <div className="mt-5 rounded-xl border border-amber-500/35 bg-amber-500/10 p-4 text-sm leading-7 text-amber-100">{setupError} <span className="block text-xs text-amber-200/70">Obtén una clave en omdbapi.com/apikey.aspx y reinicia el servidor.</span></div>}
        {hasQuery && <div className="mt-10"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h3 className="text-xl font-extrabold">Resultados de búsqueda</h3><span className="text-xs text-[#9996a0]">{loading ? 'Buscando…' : countLabel}</span></div>{loading ? <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{Array.from({length:5},(_,i)=><div key={i} className="aspect-[2/3] animate-pulse rounded-2xl bg-[#25143f]"/>)}</div> : message ? <div role="status" className="rounded-xl border border-white/10 bg-[#18102f] px-6 py-12 text-center text-[#bab7bf]">{message}</div> : <><div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{results.map((item, i) => <PosterCard key={item.imdbID} item={item} onOpen={openDetail} index={(page-1)*10+i}/>)}</div>{total > 10 && <div className="mt-10 flex justify-center gap-4"><button disabled={page === 1 || loading} onClick={() => setPage(p => p - 1)} className="cursor-pointer rounded-xl border border-white/20 px-5 py-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-30">Anterior</button><span className="flex items-center text-xs text-[#b9b5bd]">Página {page} de {Math.min(100,Math.ceil(total/10))}</span><button disabled={page >= Math.min(100,Math.ceil(total/10)) || loading} onClick={() => setPage(p => p + 1)} className="cursor-pointer rounded-xl border border-white/20 px-5 py-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-30">Siguiente</button></div>}</>}</div>}
      </section>
      <section id="acerca" className="mx-auto grid max-w-[1280px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-12"><div><p className="text-[11px] font-bold uppercase tracking-[.25em] text-[#dba0ff]">Tecnología detrás de la experiencia</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Dos formas de renderizar.<br/><span className="text-[#ff587f]">Una experiencia fluida.</span></h2></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-[#ff587f]/20 bg-[#ff587f]/[.07] p-5"><div className="text-xs font-black tracking-widest text-[#ff587f]">SSR</div><h3 className="mt-3 font-bold">Catálogo inicial</h3><p className="mt-2 text-xs leading-6 text-[#aaa7b0]">Los destacados llegan renderizados desde Next.js, antes de mostrarse en el navegador.</p></div><div className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><div className="text-xs font-black tracking-widest text-[#a9a0f4]">CSR</div><h3 className="mt-3 font-bold">Búsqueda y detalles</h3><p className="mt-2 text-xs leading-6 text-[#aaa7b0]">Los resultados se actualizan al escribir y las fichas se abren sin recargar la página.</p></div></div></section>
    </main><footer className="border-t border-white/10 px-5 py-7"><div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-3 text-xs text-[#85838e] sm:flex-row"><span><strong className="tracking-widest text-[#ff668f]">NOVAFLIX.</strong> · Galería académica de películas y series</span><span>Next.js · Tailwind CSS · OMDb API · TECSUP LAB 09</span></div></footer>
    {detailLoading && <div role="status" className="fixed bottom-6 right-6 z-40 rounded-xl border border-[#ff587f]/30 bg-[#21113d] px-5 py-4 text-sm text-[#ffd1ed] shadow-xl">Cargando ficha completa…</div>}
    <DetailModal item={selected} onClose={() => setSelected(null)}/>
  </div>
}
