import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Ingresa tu email y contraseña");
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        }).select("+password");

        if (!user) {
          throw new Error("Email o contraseña incorrectos");
        }

        // 1. ¿La cuenta está bloqueada?
        const now = new Date();
        if (user.lockUntil && user.lockUntil > now) {
          const mins = Math.ceil((user.lockUntil.getTime() - now.getTime()) / 60000);
          throw new Error(`Cuenta bloqueada. Intenta de nuevo en ${mins} minuto(s)`);
        }

        // 2. Comparar contraseña con el hash
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          // si el bloqueo ya venció, el contador arranca de cero
          const lockExpired = user.lockUntil && user.lockUntil <= now;
          const attempts = (lockExpired ? 0 : user.failedAttempts) + 1;

          if (attempts >= MAX_ATTEMPTS) {
            user.failedAttempts = 0;
            user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60000);
            await user.save();
            throw new Error(
              `Demasiados intentos. Cuenta bloqueada por ${LOCK_MINUTES} minutos`
            );
          }

          user.failedAttempts = attempts;
          user.lockUntil = null;
          await user.save();
          throw new Error(
            `Email o contraseña incorrectos. Intentos restantes: ${MAX_ATTEMPTS - attempts}`
          );
        }

        // 3. Login correcto: reiniciar contador
        user.failedAttempts = 0;
        user.lockUntil = null;
        await user.save();

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/signIn" },
};