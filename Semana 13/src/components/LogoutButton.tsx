'use client';

import { signOut } from 'next-auth/react';
import { FiLogOut } from 'react-icons/fi';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/signIn' })}
      className="btn-social flex items-center gap-2 px-4 py-2 text-sm font-medium hover:!border-rose-400/60 hover:!bg-rose-500/20"
    >
      <FiLogOut />
      <span className="hidden sm:inline">Cerrar sesión</span>
    </button>
  );
}