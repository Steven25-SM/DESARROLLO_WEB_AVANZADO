import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { Instrument_Serif, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const body = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const code = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Biblioteca Digital — Archivo",
  description: "Archivo digital de autores y libros",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} ${code.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <Suspense fallback={<div className="h-[65px] border-b border-line" />}>
          <Nav />
        </Suspense>
        <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-24 sm:px-8">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-6 sm:px-8">
            <span className="display text-2xl">Biblioteca <em className="text-accent">digital</em></span>
            <span className="label">Archivo · Next.js · Prisma · Supabase</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
