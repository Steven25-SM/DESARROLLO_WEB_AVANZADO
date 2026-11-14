import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FiUser, FiShield, FiKey, FiArrowUpRight } from 'react-icons/fi';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="glass-card animate-fade-up relative overflow-hidden rounded-3xl p-8 sm:p-12">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Sesión activa
            </span>
            <h1 className="font-display mt-5 text-4xl font-bold text-white sm:text-5xl">
              Dashboard
            </h1>
            <p className="mt-4 text-lg text-white/70">
              Bienvenido,{' '}
              <span className="text-gradient font-semibold">
                {session?.user?.name}
              </span>
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/profile"
            className="glass-card animate-fade-up anim-delay-1 group rounded-2xl p-6 transition hover:-translate-y-1 hover:border-pink-300/40"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-orange-400 to-pink-500">
                <FiUser className="text-xl text-white" />
              </span>
              <FiArrowUpRight className="text-white/40 transition group-hover:text-white" />
            </div>
            <h2 className="font-display mt-5 text-lg font-semibold text-white">
              Mi perfil
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Revisa tus datos de cuenta.
            </p>
          </Link>

          <div className="glass-card animate-fade-up anim-delay-2 rounded-2xl p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-500">
              <FiShield className="text-xl text-white" />
            </span>
            <h2 className="font-display mt-5 text-lg font-semibold text-white">
              Ruta protegida
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Solo accedes porque tienes una sesión válida.
            </p>
          </div>

          <div className="glass-card animate-fade-up anim-delay-3 rounded-2xl p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-400">
              <FiKey className="text-xl text-white" />
            </span>
            <h2 className="font-display mt-5 text-lg font-semibold text-white">
              Autenticación
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Google, GitHub y credenciales con NextAuth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}