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

async function jwtCallback({
  token,
  user,
}: {
  token: JWT;
  user?: Usuario | User;
}): Promise<JWT & { user?: Usuario }> {
  if (user && "usuario" in user) {
    token.user = user as Usuario;
    (token.user as Usuario).verified = (user).verified ?? false;
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
    session.user.usuario = token.user.usuario;
    session.user.id = token.user.id;
  }
  return session;
}


export const authConfig: AuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usuario: { label: "Usuario", type: "text" },
        contrasena: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.usuario || !credentials?.contrasena) {
          throw new Error("Faltan credenciales");
        }

        const res = await query(
          "SELECT id, usuario, contrasena, email, code, verified FROM tblusuarios WHERE usuario = $1",
          [credentials.usuario]
        );

        const user = res.rows[0] as Usuario | undefined;

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        const isValid = await bcrypt.compare(
          credentials.contrasena,
          user.contrasena
        );

        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          id: user.id.toString(),
          usuario: user.usuario,
          email: user.email ?? "",
          name: user.usuario,
          contrasena: user.contrasena,
          code: user.code ?? null,
          verified: user.verified
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
};