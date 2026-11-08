import axios from 'axios'
import Link from 'next/link'
import ClientWeatherWidget from './ClientWeatherWidget'

interface WeatherData { current_weather: { temperature: number; windspeed: number; weathercode: number } }
export const dynamic = 'force-dynamic'

async function getWeatherServer(): Promise<WeatherData> {
  const response = await axios.get<WeatherData>('https://api.open-meteo.com/v1/forecast', {
    params: { latitude: -12.04, longitude: -77.03, current_weather: true }, timeout: 10000,
  })
  return response.data
}

export default async function WeatherDashboard() {
  let serverWeather: WeatherData | null = null
  try { serverWeather = await getWeatherServer() } catch { /* Mensaje de error visible en la tarjeta SSR */ }

  const comparisons = [
    ['SEO', '✅ Excelente', '❌ Limitado'],
    ['Tiempo inicial', '✅ Contenido renderizado', '⚠️ Espera los datos'],
    ['Interactividad', '⚠️ Requiere interacción cliente', '✅ Dinámica'],
    ['Carga del servidor', '⚠️ Consulta desde el servidor', '✅ Consulta desde el navegador'],
  ]

  return <main className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-5 md:p-8"><div className="mx-auto max-w-6xl">
    <Link href="/" className="mb-5 inline-block rounded-lg bg-white/90 px-4 py-2 font-semibold text-slate-900">← Inicio</Link>
    <h1 className="mb-8 text-center text-4xl font-bold text-white drop-shadow-lg md:text-5xl">☁️ Dashboard del Clima</h1>
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-2xl border-4 border-white bg-white/90 p-6 shadow-2xl backdrop-blur">
        <div className="mb-4 flex items-center gap-2"><div className="h-3 w-3 animate-pulse rounded-full bg-green-500"/><h2 className="text-2xl font-bold text-gray-800">Lima - SSR</h2></div>
        {serverWeather ? <><div className="mb-2 text-6xl font-bold text-blue-600">{serverWeather.current_weather.temperature}°C</div><p className="text-gray-600">Viento: {serverWeather.current_weather.windspeed} km/h</p></> : <p className="py-8 text-red-600">No se pudo consultar Open-Meteo desde el servidor. Comprueba tu conexión.</p>}
        <div className="mt-4 rounded-lg border-2 border-green-200 bg-green-50 p-3"><p className="text-xs text-green-800">✅ Datos obtenidos en el servidor - SEO friendly</p></div>
      </section>
      <ClientWeatherWidget />
    </div>
    <section className="mt-8 rounded-2xl border-4 border-white bg-white/90 p-6 shadow-2xl backdrop-blur"><h3 className="mb-4 text-2xl font-bold text-gray-700">📊 Comparación SSR vs CSR</h3><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-gray-100"><tr>{['Característica', 'SSR', 'CSR'].map(x => <th key={x} className="px-4 py-3 text-gray-700">{x}</th>)}</tr></thead><tbody>{comparisons.map(([feature, ssr, csr], index) => <tr key={feature} className={`border-t border-slate-200 ${index % 2 ? 'bg-gray-50' : ''}`}><td className="px-4 py-3 font-semibold text-gray-700">{feature}</td><td className="px-4 py-3 text-gray-700">{ssr}</td><td className="px-4 py-3 text-gray-700">{csr}</td></tr>)}</tbody></table></div></section>
  </div></main>
}
