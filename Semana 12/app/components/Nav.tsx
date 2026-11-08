"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", n: "I", label: "Archivo" },
  { href: "/books", n: "II", label: "Catálogo" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="display text-3xl">
            Biblio<em className="text-accent">teca</em>
          </span>
          <span className="label hidden sm:inline">/ digital</span>
        </Link>

        <nav className="flex items-center gap-6">
          {LINKS.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/" || pathname.startsWith("/authors")
                : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`group flex items-baseline gap-2 border-b pb-1 transition ${
                  active ? "border-accent text-ink" : "border-transparent text-mute hover:text-ink"
                }`}
              >
                <span className="font-mono text-[10px] text-accent">{l.n}</span>
                <span className="text-sm uppercase tracking-[0.14em]">{l.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
