'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  FiUser,
  FiMail,
  FiLock,
  FiAlertCircle,
  FiUserPlus,
} from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || 'No se pudo registrar');
      return;
    }

    // Registro OK: iniciar sesión automáticamente
    const login = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);

    if (login?.error) {
      router.push('/signIn');
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="glass-card animate-fade-up w-full max-w-md rounded-3xl p-8 sm:p-10">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 shadow-lg shadow-fuchsia-500/30">
            <FiUserPlus className="text-2xl text-white" />
          </span>
          <h1 className="font-display text-3xl font-bold text-white">
            Crear cuenta
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Solo toma un minuto. Tu contraseña se guarda cifrada.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-glass"
            />
          </div>

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
              placeholder="Contraseña (mín. 8 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="input-glass"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
            className="btn-primary w-full py-3"
          >
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/60">
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/signIn"
            className="font-semibold text-pink-300 underline-offset-4 transition hover:text-white hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}