"use client";

import { useState, type FormEvent } from "react";
import type { Author, Book } from "@/lib/types";
import { errMsg } from "@/lib/api";

export type BookPayload = {
  title: string;
  isbn: string;
  authorId: string;
  genre: string | null;
  publishedYear: number | null;
  pages: number | null;
  description: string | null;
};

export default function BookForm({
  initial,
  authors,
  genres,
  lockedAuthorId,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Book | null;
  authors: Author[];
  genres: string[];
  lockedAuthorId?: string;
  submitLabel: string;
  onSubmit: (data: BookPayload) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [isbn, setIsbn] = useState(initial?.isbn ?? "");
  const [authorId, setAuthorId] = useState(initial?.authorId ?? lockedAuthorId ?? "");
  const [genre, setGenre] = useState(initial?.genre ?? "");
  const [year, setYear] = useState(initial?.publishedYear?.toString() ?? "");
  const [pages, setPages] = useState(initial?.pages?.toString() ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handle(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSubmit({
        title: title.trim(),
        isbn: isbn.trim(),
        authorId,
        genre: genre.trim() || null,
        publishedYear: year ? Number(year) : null,
        pages: pages ? Number(pages) : null,
        description: description.trim() || null,
      });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <label className="label mb-1.5 block">Título *</label>
        <input className="input" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Cien años de soledad" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label mb-1.5 block">Autor *</label>
          <select className="input" required value={authorId} onChange={(e) => setAuthorId(e.target.value)} disabled={!!lockedAuthorId}>
            <option value="">Selecciona un autor</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label mb-1.5 block">ISBN *</label>
          <input className="input" required value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="978-0307474728" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label mb-1.5 block">Género</label>
          <input className="input" list="genre-options" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Novela" />
          <datalist id="genre-options">
            {genres.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="label mb-1.5 block">Año</label>
          <input className="input" type="number" min={0} max={2100} value={year} onChange={(e) => setYear(e.target.value)} placeholder="1967" />
        </div>
        <div>
          <label className="label mb-1.5 block">Páginas</label>
          <input className="input" type="number" min={1} value={pages} onChange={(e) => setPages(e.target.value)} placeholder="417" />
        </div>
      </div>
      <div>
        <label className="label mb-1.5 block">Descripción</label>
        <textarea className="input min-h-24 resize-y" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Sinopsis breve" />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={busy} className="btn btn-primary">
          {busy ? "Guardando…" : submitLabel}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
