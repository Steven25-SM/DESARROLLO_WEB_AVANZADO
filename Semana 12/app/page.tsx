"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api, errMsg } from "@/lib/api";
import type { Author } from "@/lib/types";
import Modal from "./components/Modal";
import AuthorForm, { type AuthorPayload } from "./components/AuthorForm";

const AUTHOR_PORTRAITS: Record<string, string> = {
  "Gabriel García Márquez": "https://commons.wikimedia.org/wiki/Special:FilePath/Gabriel_Garcia_Marquez.jpg",
  "Isabel Allende": "https://commons.wikimedia.org/wiki/Special:FilePath/Isabel_Allende_-_001.jpg",
  "Julio Verne": "https://commons.wikimedia.org/wiki/Special:FilePath/Jules_Verne_in_1892.jpg",
};

export default function Dashboard() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<null | { author?: Author }>(null);

  const load = useCallback(async () => {
    try {
      setAuthors(await api<Author[]>("/api/authors"));
      setError("");
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => {
    const books = authors.flatMap((a) => a.books ?? []);
    const genreCount = new Map<string, number>();
    books.forEach((b) => b.genre && genreCount.set(b.genre, (genreCount.get(b.genre) ?? 0) + 1));
    const genres = [...genreCount.entries()].sort((a, b) => b[1] - a[1]);
    const withPages = books.filter((b) => b.pages);
    const avgPages = withPages.length ? Math.round(withPages.reduce((s, b) => s + (b.pages ?? 0), 0) / withPages.length) : 0;
    const years = books.map((b) => b.publishedYear).filter((y): y is number => !!y);
    return { totalBooks: books.length, genres, avgPages, oldest: years.length ? Math.min(...years) : null, newest: years.length ? Math.max(...years) : null };
  }, [authors]);

  async function save(data: AuthorPayload) {
    if (modal?.author) await api(`/api/authors/${modal.author.id}`, { method: "PUT", body: JSON.stringify(data) });
    else await api("/api/authors", { method: "POST", body: JSON.stringify(data) });
    setModal(null);
    await load();
  }

  async function remove(a: Author) {
    const n = a._count?.books ?? 0;
    if (!confirm(`¿Eliminar a ${a.name}? Se borrarán también sus ${n} libros.`)) return;
    try { await api(`/api/authors/${a.id}`, { method: "DELETE" }); await load(); }
    catch (e) { setError(errMsg(e)); }
  }

  const maxGenre = stats.genres[0]?.[1] ?? 1;
  const num = (n: number) => loading ? "—" : String(n).padStart(2, "0");

  return (
    <>
      {/* Hero editorial de pantalla completa: conserva las acciones y datos del dashboard. */}
      <section className="home-hero">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-topline">
            <span>ARCHIVO CULTURAL · VOL. 001</span>
            <span className="hidden sm:inline">LIMA · DESDE 2026</span>
          </div>
          <div className="hero-main">
            <p className="hero-kicker"><span className="hero-dot" /> UN LUGAR PARA LAS HISTORIAS QUE PERMANECEN</p>
            <h1 className="hero-title">Las ideas<br />también <em>habitan</em><br />en los libros.</h1>
            <div className="hero-bottom">
              <p className="hero-description">Un archivo vivo de autores, obras y mundos por descubrir. Explora nuestra colección y encuentra tu próxima historia.</p>
              <div className="hero-actions">
                <Link href="/books" className="hero-primary">EXPLORAR COLECCIÓN <span>↗</span></Link>
                <button className="hero-secondary" onClick={() => setModal({})}>REGISTRAR AUTOR <span>＋</span></button>
              </div>
            </div>
          </div>
          <div className="hero-index"><span>01 / 03</span><span className="hero-index-line"/><span>DESLIZA PARA EXPLORAR</span><span className="hero-scroll">↓</span></div>
        </div>
        <div className="hero-side-note">LECTURA · CULTURA · MEMORIA</div>
      </section>

      {error && <p className="my-6 border border-danger/50 p-4 text-sm text-danger">{error}</p>}

      <section className="stats-ribbon" aria-label="Estadísticas de la biblioteca">
        <div className="stats-intro"><span className="label">EL ARCHIVO EN CIFRAS</span><span className="stats-mark">↘</span></div>
        {[["OBRAS REGISTRADAS", num(stats.totalBooks)], ["AUTORES", num(authors.length)], ["GÉNEROS", num(stats.genres.length)], ["PÁGINAS / PROMEDIO", loading ? "—" : String(stats.avgPages)]].map(([label, value]) => (
          <div className="stat-cell" key={label}><span className="label">{label}</span><strong>{value}</strong></div>
        ))}
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <div><p className="label">VOCES QUE CONSTRUYEN MUNDOS · 001—003</p><h2 className="section-title">Autores <em>destacados</em></h2></div>
          <p className="section-aside">Tres miradas, tres universos.<br/>Conoce a quienes dan vida al archivo.</p>
        </div>
        {loading ? <div className="grid gap-5 md:grid-cols-3">{[0,1,2].map(i=><div key={i} className="skeleton aspect-[4/5]" />)}</div> : authors.length === 0 ? (
          <div className="empty-authors"><p className="display text-3xl">El archivo está esperando su primera voz.</p><button className="btn btn-primary mt-5" onClick={() => setModal({})}>Registrar primer autor</button></div>
        ) : (
          <div className="author-feature-grid">
            {authors.slice(0, 3).map((a, i) => (
              <article className="author-feature" key={a.id}>
                <Link href={`/authors/${a.id}`} className="author-photo-wrap" aria-label={`Ver perfil de ${a.name}`}>
                  {AUTHOR_PORTRAITS[a.name] ? <img className="author-photo" src={AUTHOR_PORTRAITS[a.name]} alt={`Retrato de ${a.name}`} loading="lazy" /> : <div className="author-photo-fallback"><span>{a.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</span></div>}
                  <span className="photo-number">0{i + 1}</span><span className="photo-arrow">↗</span>
                </Link>
                <div className="author-feature-meta"><span className="label">{a.nationality || "AUTOR"} · {a.birthYear || "—"}</span><span className="label">{a._count?.books ?? a.books?.length ?? 0} OBRAS</span></div>
                <div className="author-feature-name"><Link href={`/authors/${a.id}`}>{a.name}</Link><span>↗</span></div>
                <p className="author-feature-bio">{a.bio || "Una voz que forma parte de nuestra colección."}</p>
                <div className="author-feature-actions"><Link href={`/authors/${a.id}`}>EXPLORAR AUTOR <span>→</span></Link><button onClick={() => setModal({ author: a })}>EDITAR</button><button onClick={() => remove(a)}>ELIMINAR</button></div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="collection-overview">
        <div className="overview-heading"><div><p className="label">MAPA DE LECTURA</p><h2 className="section-title">La colección <em>por dentro.</em></h2></div><Link href="/books" className="text-link">VER TODO EL CATÁLOGO ↗</Link></div>
        <div className="overview-grid">
          <div className="chronology-panel"><span className="label">RANGO CRONOLÓGICO</span><p className="chronology-years">{stats.oldest ?? "—"}<i>—</i>{stats.newest ?? "—"}</p><p className="muted-copy">Del primer año de publicación al más reciente dentro de nuestro archivo.</p><div className="chronology-rule"><span/></div></div>
          <div className="genre-panel"><div className="flex items-center justify-between"><span className="label">DISTRIBUCIÓN POR GÉNERO</span><span className="label">{stats.genres.length.toString().padStart(2,"0")} CATEGORÍAS</span></div>
            {loading ? <div className="skeleton mt-5 h-28"/> : stats.genres.length === 0 ? <p className="muted-copy mt-5">Aún no hay libros con género.</p> : <ul className="genre-list">{stats.genres.slice(0,7).map(([g,n],i)=><li key={g}><span className="genre-index">0{i+1}</span><span className="genre-name">{g}</span><span className="genre-track"><i style={{width:`${(n/maxGenre)*100}%`}}/></span><span className="genre-count">{n}</span></li>)}</ul>}
          </div>
        </div>
      </section>

      <section className="author-index-section">
        <div className="section-heading"><div><p className="label">DIRECTORIO COMPLETO</p><h2 className="section-title">Índice de <em>autores</em></h2></div><span className="section-aside">{authors.length.toString().padStart(2,"0")} REGISTROS</span></div>
        {loading ? <div className="mt-6 space-y-2">{Array.from({length:3}).map((_,i)=><div key={i} className="skeleton h-20"/>)}</div> : authors.length === 0 ? <div className="empty-authors"><p className="display text-3xl">Todavía no hay autores registrados.</p></div> : (
          <ul className="author-index-list">{authors.map((a,i)=><li key={a.id}><span className="index-number">{String(i+1).padStart(2,"0")}</span><Link href={`/authors/${a.id}`} className="index-author-name">{a.name}</Link><span className="index-author-country">{a.nationality || "—"}</span><span className="index-author-books">{a._count?.books ?? a.books?.length ?? 0} OBRAS</span><div className="index-actions"><Link href={`/authors/${a.id}`}>VER PERFIL ↗</Link><button onClick={() => setModal({author:a})}>EDITAR</button><button onClick={() => remove(a)}>ELIMINAR</button></div></li>)}</ul>
        )}
      </section>

      {modal && <Modal title={modal.author ? "Editar autor" : "Nuevo autor"} onClose={() => setModal(null)}><AuthorForm initial={modal.author} submitLabel={modal.author ? "Guardar cambios" : "Crear autor"} onSubmit={save} onCancel={() => setModal(null)} /></Modal>}
    </>
  );
}
