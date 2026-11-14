'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { FiMail, FiLock, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="glass-card animate-fade-up w-full max-w-md rounded-3xl p-8 sm:p-10">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-violet-500 shadow-lg shadow-pink-500/30">
            <FiLock className="text-2xl text-white" />
          </span>
          <h1 className="font-display text-3xl font-bold text-white">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Bienvenido de vuelta. Elige cómo quieres entrar.
          </p>
        </div>

        <form onSubmit={handleCredentials} className="space-y-4">
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-glass"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-glass"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/15 px-3 py-2.5 text-sm text-rose-100">
              <FiAlertCircle className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 py-3"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
            {!loading && <FiArrowRight />}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <hr className="flex-1 border-white/15" />
          <span className="text-xs uppercase tracking-wider text-white/50">
            o continúa con
          </span>
          <hr className="flex-1 border-white/15" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="btn-social flex items-center justify-center gap-2 py-3"
          >
            <FaGoogle /> Google
          </button>
          <button
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            className="btn-social flex items-center justify-center gap-2 py-3"
          >
            <FaGithub /> GitHub
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-white/60">
          ¿No tienes cuenta?{' '}
          <Link
            href="/register"
            className="font-semibold text-pink-300 underline-offset-4 transition hover:text-white hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}