"use client";

import { useEffect, useRef, useState } from "react";
import { api, errMsg } from "@/lib/api";
import type { Author, Book, Pagination } from "@/lib/types";
import Modal from "../components/Modal";
import BookForm, { type BookPayload } from "../components/BookForm";
import BookCard from "../components/BookCard";

const LIMIT = 8;

const SORTS = [
  { value: "createdAt:desc", label: "Más recientes" },
  { value: "createdAt:asc", label: "Más antiguos" },
  { value: "title:asc", label: "Título A–Z" },
  { value: "title:desc", label: "Título Z–A" },
  { value: "publishedYear:desc", label: "Año ↓" },
  { value: "publishedYear:asc", label: "Año ↑" },
];

export default function BooksPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [genre, setGenre] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [sort, setSort] = useState("createdAt:desc");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [modal, setModal] = useState<null | { book?: Book }>(null);

  const reqId = useRef(0);

  // Búsqueda en tiempo real (debounce 300ms)
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(q);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  // Autores y géneros disponibles para los dropdowns
  useEffect(() => {
    (async () => {
      try {
        const [a, all] = await Promise.all([
          api<Author[]>("/api/authors"),
          api<Book[]>("/api/books"),
        ]);
        setAuthors(a);
        setGenres([...new Set(all.map((b) => b.genre).filter((g): g is string => !!g))].sort());
      } catch (e) {
        setError(errMsg(e));
      }
    })();
  }, [reload]);

  // Resultados desde /api/books/search
  useEffect(() => {
    const id = ++reqId.current;
    (async () => {
      setLoading(true);
      try {
        const [sortBy, order] = sort.split(":");
        const params = new URLSearchParams({
          page: String(page),
          limit: String(LIMIT),
          sortBy,
          order,
        });
        if (debouncedQ.trim()) params.set("search", debouncedQ.trim());
        if (genre) params.set("genre", genre);
        if (authorName) params.set("authorName", authorName);

        const res = await api<{ data: Book[]; pagination: Pagination }>(
          `/api/books/search?${params.toString()}`
        );
        if (id !== reqId.current) return;
        if (res.data.length === 0 && page > 1) {
          setPage((p) => p - 1);
          return;
        }
        setBooks(res.data);
        setPagination(res.pagination);
        setError("");
      } catch (e) {
        if (id === reqId.current) setError(errMsg(e));
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    })();
  }, [debouncedQ, genre, authorName, sort, page, reload]);

  async function save(data: BookPayload) {
    if (modal?.book) {
      await api(`/api/books/${modal.book.id}`, { method: "PUT", body: JSON.stringify(data) });
    } else {
      await api("/api/books", { method: "POST", body: JSON.stringify(data) });
    }
    setModal(null);
    setReload((n) => n + 1);
  }

  async function remove(b: Book) {
    if (!confirm(`¿Eliminar "${b.title}"?`)) return;
    try {
      await api(`/api/books/${b.id}`, { method: "DELETE" });
      setReload((n) => n + 1);
    } catch (e) {
      setError(errMsg(e));
    }
  }

  function clearFilters() {
    setQ("");
    setDebouncedQ("");
    setGenre("");
    setAuthorName("");
    setSort("createdAt:desc");
    setPage(1);
  }

  const totalPages = pagination?.totalPages ?? 0;
  const pageNumbers = (() => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);
  })();
  const hasFilters = !!(q || genre || authorName || sort !== "createdAt:desc");

  return (
    <>
      <section className="border-b border-line pb-8 pt-14 sm:pt-20">
        <p className="label mb-5">Archivo N.º 02 — Todos los títulos</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="display text-[clamp(4rem,14vw,11rem)]">
            El <em className="text-accent">catálogo</em>
          </h1>
          <button className="btn btn-primary" onClick={() => setModal({})}>
            + Nuevo libro
          </button>
        </div>
      </section>

      {/* Controles */}
      <section className="mb-6 grid gap-x-8 gap-y-5 border-b border-line py-6 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <label className="label mb-1.5 block">Buscar por título</label>
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Escribe para buscar…" />
        </div>
        <div>
          <label className="label mb-1.5 block">Género</label>
          <select className="input" value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }}>
            <option value="">Todos</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label mb-1.5 block">Autor</label>
          <select className="input" value={authorName} onChange={(e) => { setAuthorName(e.target.value); setPage(1); }}>
            <option value="">Todos</option>
            {authors.map((a) => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label mb-1.5 block">Ordenar por</label>
          <select className="input" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="mb-6 flex items-center justify-between">
        <p className="label">
          {loading && !pagination ? "Cargando…" : `${pagination?.total ?? 0} resultados`}
          {loading && pagination ? " · actualizando…" : ""}
        </p>
        {hasFilters && (
          <button className="btn btn-sm" onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}
      </div>

      {error && <p className="mb-6 border border-danger/50 p-4 text-sm text-danger">{error}</p>}

      {/* Resultados */}
      {loading && books.length === 0 ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton aspect-[3/4]" />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="border border-line p-10 text-center">
          <p className="display text-3xl">Sin resultados para esa búsqueda.</p>
        </div>
      ) : (
        <div className={`grid grid-cols-2 gap-x-6 gap-y-10 transition-opacity md:grid-cols-3 lg:grid-cols-4 ${loading ? "opacity-50" : ""}`}>
          {books.map((b) => (
            <BookCard key={b.id} book={b} onEdit={(bk) => setModal({ book: bk })} onDelete={remove} />
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button className="btn btn-sm" disabled={!pagination?.hasPrev || loading} onClick={() => setPage((p) => p - 1)}>
            ← Anterior
          </button>
          {pageNumbers.map((n) => (
            <button
              key={n}
              disabled={loading}
              onClick={() => setPage(n)}
              className={`btn btn-sm font-mono ${n === page ? "btn-primary" : ""}`}
            >
              {n}
            </button>
          ))}
          <button className="btn btn-sm" disabled={!pagination?.hasNext || loading} onClick={() => setPage((p) => p + 1)}>
            Siguiente →
          </button>
        </nav>
      )}

      {modal && (
        <Modal title={modal.book ? "Editar libro" : "Nuevo libro"} onClose={() => setModal(null)}>
          <BookForm
            initial={modal.book}
            authors={authors}
            genres={genres}
            submitLabel={modal.book ? "Guardar cambios" : "Crear libro"}
            onSubmit={save}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </>
  );
}
