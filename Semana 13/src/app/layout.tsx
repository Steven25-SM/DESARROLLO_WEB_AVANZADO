import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import Provider from "@/components/SessionProvider";
import Background from "@/components/Background";
import { FiShield } from "react-icons/fi";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Auth App",
  description: "My Next Auth App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased`}
      >
        <Background />

        <div className="relative z-10">
          <nav className="glass-nav sticky top-0 z-50 text-white">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
              <Link
                href="/"
                className="font-display flex items-center gap-2 text-lg font-semibold tracking-tight"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-400 via-pink-500 to-violet-500 shadow-lg shadow-pink-500/30">
                  <FiShield className="text-white" />
                </span>
                <span className="text-gradient">MyAuthApp</span>
              </Link>

              <ul className="flex items-center gap-3 text-sm sm:gap-6">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-white/70 transition hover:text-white"
                  >
                    Dashboard
                  </Link>
                </li>
                {!session?.user && (
                  <li>
                    <Link
                      href="/signIn"
                      className="text-white/70 transition hover:text-white"
                    >
                      Iniciar sesión
                    </Link>
                  </li>
                )}
                {session?.user && (
                  <li>
                    <Link
                      href="/profile"
                      className="text-white/70 transition hover:text-white"
                    >
                      Profile
                    </Link>
                  </li>
                )}
                {session?.user && (
                  <li>
                    <LogoutButton />
                  </li>
                )}
                {session?.user?.image && (
                  <li>
                    <Image
                      height={100}
                      width={100}
                      src={session?.user?.image}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-pink-400/70"
                    />
                  </li>
                )}
                {session?.user && !session.user.image && (
                  <li>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-fuchsia-600 font-semibold ring-2 ring-pink-400/70">
                      {(session.user.name ?? "U").charAt(0).toUpperCase()}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </nav>

          <Provider>
            <main>{children}</main>
          </Provider>
        </div>
      </body>
    </html>
  );
}