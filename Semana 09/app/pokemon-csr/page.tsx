'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

interface Pokemon {
  name: string
  sprites: { front_default: string | null }
  types: Array<{ type: { name: string } }>
}

export default function PokemonCSR() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    const fetchPokemon = async () => {
      try {
        const randomId = Math.floor(Math.random() * 150) + 1
        const response = await axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
        if (active) setPokemon(response.data)
      } catch {
        if (active) setError(true)
      } finally {
        if (active) setLoading(false)
      }
    }
    void fetchPokemon()
    return () => { active = false }
  }, [])

  return <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-5 md:p-8"><div className="mx-auto max-w-2xl">
    <Link href="/" className="mb-5 inline-block rounded-lg bg-white/90 px-4 py-2 font-semibold text-slate-900">← Inicio</Link>
    <div className="rounded-t-xl border-4 border-black bg-yellow-400 px-6 py-3 text-center text-slate-900"><h1 className="text-3xl font-bold">🎮 Pokémon CSR</h1><p className="mt-1 text-sm">Client-Side Rendering</p></div>
    <div className="rounded-b-xl border-4 border-t-0 border-black bg-white p-8 shadow-2xl">
      {loading ? <div className="py-12 text-center"><div className="mx-auto h-16 w-16 animate-spin rounded-full border-b-4 border-red-500"/><p className="mt-4 text-gray-600">Cargando Pokémon...</p></div>
      : error ? <div className="py-12 text-center text-red-600">No se pudo consultar PokeAPI. Comprueba tu conexión y recarga.</div>
      : pokemon ? <div className="text-center">{pokemon.sprites.front_default && <img src={pokemon.sprites.front_default} alt={pokemon.name} width={192} height={192} className="mx-auto h-48 w-48"/>}<h2 className="mt-4 text-4xl font-bold capitalize text-gray-700">{pokemon.name}</h2><div className="mt-4 flex justify-center gap-2">{pokemon.types.map(type => <span key={type.type.name} className="rounded-full bg-blue-500 px-4 py-2 font-semibold text-white">{type.type.name}</span>)}</div></div> : null}
      <div className="mt-8 rounded-lg border-2 border-blue-200 bg-blue-50 p-4"><p className="text-sm text-blue-800">💡 <strong>CSR:</strong> Los datos se cargan en el navegador después de que la página se renderiza. ¡Mira la pestaña Network para ver la petición a PokeAPI!</p></div>
    </div>
  </div></main>
}
