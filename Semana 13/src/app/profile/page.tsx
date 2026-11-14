import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Image from 'next/image';
import { FiUser, FiMail } from 'react-icons/fi';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="glass-card animate-fade-up overflow-hidden rounded-3xl">
          <div className="h-32 bg-gradient-to-r from-orange-500/70 via-pink-500/70 to-violet-600/70" />

          <div className="px-8 pb-10 sm:px-10">
            <div className="-mt-16 flex justify-center">
              {session?.user?.image ? (
                <Image
                  height={160}
                  width={160}
                  src={session.user.image}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover ring-4 ring-[#1b0b3a]"
                />
              ) : (
                <span className="font-display grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-fuchsia-600 text-5xl font-bold text-white ring-4 ring-[#1b0b3a]">
                  {(session?.user?.name ?? 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <h1 className="font-display mt-5 text-center text-3xl font-bold text-white">
              Profile
            </h1>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-400 to-pink-500">
                  <FiUser className="text-white" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-white/50">
                    Name
                  </p>
                  <p className="truncate font-semibold text-white">
                    {session?.user?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-500">
                  <FiMail className="text-white" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-white/50">
                    Email
                  </p>
                  <p className="truncate font-semibold text-white">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}