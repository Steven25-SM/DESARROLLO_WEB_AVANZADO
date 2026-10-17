import { NextRequest, NextResponse } from 'next/server'
import { fetchOmdb } from '@/lib/omdb'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const id = params.get('i')?.trim()
  const search = params.get('s')?.trim()
  if (!id && (!search || search.length < 2)) return NextResponse.json({ Response: 'False', Error: 'Escribe al menos 2 caracteres.' }, { status: 400 })
  if (id && !/^tt\d{5,12}$/.test(id)) return NextResponse.json({ Response: 'False', Error: 'Identificador inválido.' }, { status: 400 })
  if (search && search.length > 80) return NextResponse.json({ Response: 'False', Error: 'Búsqueda demasiado larga.' }, { status: 400 })
  const type = params.get('type')
  if (type && type !== 'movie' && type !== 'series') return NextResponse.json({ Response: 'False', Error: 'Tipo inválido.' }, { status: 400 })
  const page = Math.max(1, Math.min(100, Number(params.get('page')) || 1))
  try {
    const query = id ? { i: id, plot: 'full' } : { s: search!, page: String(page), ...(type ? { type } : {}) }
    const data = await fetchOmdb(query)
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('OMDb:', error)
    return NextResponse.json({ Response: 'False', Error: error instanceof Error ? error.message : 'No se pudo consultar OMDb.' }, { status: 502 })
  }
}
