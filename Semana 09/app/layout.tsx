import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'NOVAFLIX — Películas y series', description: 'Galería de películas y series desarrollada en Next.js para LAB 09.' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>
}
