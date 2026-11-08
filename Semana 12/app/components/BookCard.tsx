import Link from "next/link";
import type { Book } from "@/lib/types";

// Portadas tipográficas generadas a partir de los datos reales del libro
const TONES = [
  { bg: "#2b1d16", fg: "#e8c9a0" },
  { bg: "#16262b", fg: "#a9d0d6" },
  { bg: "#2a2416", fg: "#e2c872" },
  { bg: "#241a2b", fg: "#cdb4e0" },
  { bg: "#1c2a1d", fg: "#b5d6a8" },
  { bg: "#2b1618", fg: "#e0a8ad" },
  { bg: "#e9e4d6", fg: "#1a1916" },
];

function toneFor(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TONES[h % TONES.length];
}

export default function BookCard({
  book,
  showAuthor = true,
  onEdit,
  onDelete,
}: {
  book: Book;
  showAuthor?: boolean;
  onEdit: (b: Book) => void;
  onDelete: (b: Book) => void;
}) {
  const t = toneFor(book.genre ?? book.title);

  return (
    <article className="group flex flex-col">
      {/* Portada */}
      <div
        className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden p-4 shadow-[6px_6px_0_0_rgba(255,255,255,0.05)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[10px_10px_0_0_rgba(217,164,65,0.35)]"
        style={{ background: t.bg, color: t.fg }}
      >
        <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.16em] opacity-80">
          <span>{book.genre ?? "Sin género"}</span>
          <span>{book.publishedYear ?? "—"}</span>
        </div>
        <div>
          <h3 className="display text-[clamp(1.6rem,3vw,2.3rem)] leading-[0.95] [text-wrap:balance]">
            {book.title}
          </h3>
          {book.author && (
            <p className="mt-3 border-t pt-2 font-mono text-[10px] uppercase tracking-[0.16em] opacity-80" style={{ borderColor: t.fg + "55" }}>
              {book.author.name}
            </p>
          )}
        </div>
        <span
          className="pointer-events-none absolute -right-2 bottom-8 font-serif text-[7rem] italic leading-none opacity-[0.07]"
          aria-hidden
        >
          {book.title.charAt(0)}
        </span>
      </div>

      {/* Ficha */}
      <div className="mt-3 flex flex-1 flex-col gap-2">
        {showAuthor && book.author && (
          <Link href={`/authors/${book.author.id}`} className="text-sm text-mute transition hover:text-accent">
            {book.author.name} →
          </Link>
        )}
        <p className="font-mono text-[10px] uppercase tracking-wider text-mute">
          {book.pages ? `${book.pages} págs` : "— págs"} · ISBN {book.isbn}
        </p>
        <div className="mt-1 flex gap-2">
          <button className="btn btn-sm" onClick={() => onEdit(book)}>
            Editar
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(book)}>
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
