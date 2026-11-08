import axios from 'axios'
import Link from 'next/link'

interface Pokemon {
  name: string
  sprites: { front_default: string | null }
  types: Array<{ type: { name: string } }>
}

export const dynamic = 'force-dynamic'

async function getPokemon(): Promise<Pokemon> {
  const randomId = Math.floor(Math.random() * 150) + 1
  const response = await axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${randomId}`, { timeout: 10000 })
  return response.data
}

export default async function PokemonSSR() {
  let pokemon: Pokemon | null = null
  try { pokemon = await getPokemon() } catch { /* Mensaje de error visible en la página */ }
  return <main className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 p-5 md:p-8"><div className="mx-auto max-w-2xl">
    <Link href="/" className="mb-5 inline-block rounded-lg bg-white/90 px-4 py-2 font-semibold text-slate-900">← Inicio</Link>
    <div className="rounded-t-xl border-4 border-black bg-yellow-400 px-6 py-3 text-center text-slate-900"><h1 className="text-3xl font-bold">⚡ Pokémon SSR</h1><p className="mt-1 text-sm">Server-Side Rendering</p></div>
    <div className="rounded-b-xl border-4 border-t-0 border-black bg-white p-8 shadow-2xl">
      {pokemon ? <div className="text-center">{pokemon.sprites.front_default && <img src={pokemon.sprites.front_default} alt={pokemon.name} width={192} height={192} className="mx-auto h-48 w-48"/>}<h2 className="mt-4 text-4xl font-bold capitalize text-gray-700">{pokemon.name}</h2><div className="mt-4 flex justify-center gap-2">{pokemon.types.map(type => <span key={type.type.name} className="rounded-full bg-green-500 px-4 py-2 font-semibold text-white">{type.type.name}</span>)}</div></div> : <p className="py-12 text-center text-red-600">No se pudo consultar PokeAPI desde el servidor. Comprueba tu conexión y recarga.</p>}
      <div className="mt-8 rounded-lg border-2 border-green-200 bg-green-50 p-4"><p className="text-sm text-green-800">💡 <strong>SSR:</strong> Los datos se obtienen en el servidor antes de enviar el HTML. ¡Ve el código fuente de la página para comprobar el contenido renderizado!</p></div>
    </div>
  </div></main>
}
