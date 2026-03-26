import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions, User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { Usuario } from "./definitions";
import { query } from "@/lib/db";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: Usuario;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: Usuario;
  }
}

async function jwtCallback({
  token,
  user,
}: {
  token: JWT;
  user?: Usuario | User;
}): Promise<JWT> {
  if (user && "username" in user) {
    token.user = user as Usuario;
    (token.user as Usuario).verified = (user).verified ?? false;
    (token.user as Usuario).rol_id = (user).rol_id ?? null;
  }
  return token;
}

async function sessionCallback({
  session,
  token,
}: {
  session: Session;
  token: JWT & { user?: Usuario };
}): Promise<Session> {
  if (token.user) {
    session.user = token.user;
    session.user.username = token.user.username;
    session.user.id = token.user.id;
    session.user.rol_id = token.user.rol_id;
    session.user.email = token.user.email;
    session.user.verified = token.user.verified;
    session.user.active = token.user.active;
  }
  return session;
}

export const authConfig: AuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login", // Página de error personalizada
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Faltan credenciales");
        }

        const res = await query(
          "SELECT id, username, email, password_hash, rol_id, verified, active FROM tblusers WHERE username = $1 AND active = true",
          [credentials.username]
        );

        const user = res.rows[0] as Usuario | undefined;

        if (!user) {
          throw new Error("Usuario no encontrado o inactivo");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          password_hash: user.password_hash,
          verified: user.verified,
          active: user.active,
          rol_id: user.rol_id,
        } satisfies Usuario;
      },
    }),
  ],
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", // Agregar para debugging
};