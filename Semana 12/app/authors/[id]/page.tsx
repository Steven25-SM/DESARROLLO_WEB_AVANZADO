"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api, errMsg } from "@/lib/api";
import type { Author, AuthorStats, Book } from "@/lib/types";
import Modal from "../../components/Modal";
import AuthorForm, { type AuthorPayload } from "../../components/AuthorForm";
import BookForm, { type BookPayload } from "../../components/BookForm";
import BookCard from "../../components/BookCard";

export default function AuthorProfile() {
  const { id } = useParams<{ id: string }>();

  const [author, setAuthor] = useState<Author | null>(null);
  const [stats, setStats] = useState<AuthorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<null | { book?: Book }>(null);

  const load = useCallback(async () => {
    try {
      const [a, s] = await Promise.all([
        api<Author>(`/api/authors/${id}`),
        api<AuthorStats>(`/api/authors/${id}/stats`),
      ]);
      setAuthor(a);
      setStats(s);
      setError("");
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveAuthor(data: AuthorPayload) {
    await api(`/api/authors/${id}`, { method: "PUT", body: JSON.stringify(data) });
    await load();
  }

  async function saveBook(data: BookPayload) {
    if (modal?.book) {
      await api(`/api/books/${modal.book.id}`, { method: "PUT", body: JSON.stringify(data) });
    } else {
      await api("/api/books", { method: "POST", body: JSON.stringify(data) });
    }
    setModal(null);
    await load();
  }

  async function removeBook(b: Book) {
    if (!confirm(`¿Eliminar "${b.title}"?`)) return;
    try {
      await api(`/api/books/${b.id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 pt-20">
        <div className="skeleton h-40 w-2/3" />
        <div className="skeleton h-48" />
        <div className="skeleton h-64" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="pt-20">
        <p className="border border-danger/50 p-6 text-danger">{error || "Autor no encontrado"}</p>
        <Link href="/" className="btn mt-4">
          ← Volver al archivo
        </Link>
      </div>
    );
  }

  const books = author.books ?? [];
  const [first, ...rest] = author.name.split(" ");

  return (
    <>
      {/* Cabecera */}
      <section className="border-b border-line pb-10 pt-12 sm:pt-16">
        <Link href="/" className="label transition hover:text-accent">
          ← Archivo / Autores
        </Link>
        <h1 className="display mt-8 text-[clamp(4rem,14vw,11rem)]">
          {first}
          {rest.length > 0 && (
            <>
              <br />
              <em className="text-accent">{rest.join(" ")}</em>
            </>
          )}
        </h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <p className="max-w-2xl text-lg leading-relaxed text-mute">
            {author.bio || "Sin biografía registrada."}
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-l border-line pl-6 text-sm">
            <Info label="Nacionalidad" value={author.nationality} />
            <Info label="Nacimiento" value={author.birthYear?.toString()} />
            <Info label="Email" value={author.email} />
            <Info label="Registrado" value={new Date(author.createdAt).toLocaleDateString("es-PE")} />
          </dl>
        </div>
      </section>

      {error && <p className="my-6 border border-danger/50 p-4 text-sm text-danger">{error}</p>}

      {/* Estadísticas integradas: colofón */}
      {stats && (
        <section className="grid border-b border-line lg:grid-cols-[1fr_1.6fr]">
          <div className="border-b border-line py-10 lg:border-b-0 lg:border-r lg:pr-10">
            <p className="label">Obras publicadas</p>
            <p className="display mt-2 text-[clamp(7rem,18vw,13rem)] text-accent">{stats.totalBooks}</p>
            <p className="label mt-2">Promedio · {stats.averagePages || "—"} páginas</p>
          </div>

          <div className="grid sm:grid-cols-2">
            <Fact label="Primer libro" big={stats.firstBook?.year ?? "—"} text={stats.firstBook?.title} />
            <Fact label="Último libro" big={stats.latestBook?.year ?? "—"} text={stats.latestBook?.title} right />
            <Fact label="Más extenso" big={stats.longestBook?.pages ? `${stats.longestBook.pages} p.` : "—"} text={stats.longestBook?.title} top />
            <Fact label="Más breve" big={stats.shortestBook?.pages ? `${stats.shortestBook.pages} p.` : "—"} text={stats.shortestBook?.title} top right />
            <div className="border-t border-line p-6 sm:col-span-2">
              <p className="label mb-3">Géneros</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                {stats.genres.length ? (
                  stats.genres.map((g) => (
                    <span key={g} className="display text-3xl">
                      {g}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-mute">Sin géneros registrados</span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-12 pt-12 lg:grid-cols-[1fr_340px]">
        {/* Libros */}
        <section>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
            <h2 className="display text-6xl">
              Obras <em className="text-accent">({books.length})</em>
            </h2>
            <button className="btn btn-primary" onClick={() => setModal({})}>
              + Agregar libro
            </button>
          </div>
          {books.length === 0 ? (
            <div className="border border-line p-10 text-center">
              <p className="display text-3xl">Este autor aún no tiene obras.</p>
              <button className="btn btn-primary mt-5" onClick={() => setModal({})}>
                Agregar la primera
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
              {books.map((b) => (
                <BookCard
                  key={b.id}
                  book={{ ...b, author }}
                  showAuthor={false}
                  onEdit={(bk) => setModal({ book: bk })}
                  onDelete={removeBook}
                />
              ))}
            </div>
          )}
        </section>

        {/* Editar autor */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <section className="border border-line bg-panel/70 p-6">
            <p className="label mb-5">Editar autor</p>
            <AuthorForm key={author.updatedAt} initial={author} submitLabel="Guardar cambios" onSubmit={saveAuthor} />
          </section>
        </aside>
      </div>

      {modal && (
        <Modal title={modal.book ? "Editar libro" : `Nuevo libro`} onClose={() => setModal(null)}>
          <BookForm
            initial={modal.book}
            authors={[author]}
            genres={stats?.genres ?? []}
            lockedAuthorId={author.id}
            submitLabel={modal.book ? "Guardar cambios" : "Agregar libro"}
            onSubmit={saveBook}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="label mb-1">{label}</dt>
      <dd className="break-words">{value || "—"}</dd>
    </div>
  );
}

function Fact({
  label,
  big,
  text,
  top,
  right,
}: {
  label: string;
  big: string | number;
  text?: string;
  top?: boolean;
  right?: boolean;
}) {
  return (
    <div className={`p-6 ${top ? "border-t border-line" : ""} ${right ? "sm:border-l sm:border-line" : ""}`}>
      <p className="label">{label}</p>
      <p className="display mt-2 text-6xl">{big}</p>
      <p className="mt-2 truncate text-sm text-mute">{text ?? "Sin datos"}</p>
    </div>
  );
}
