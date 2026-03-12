import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = 'edge';

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  }) as { user?: { verified?: boolean } } | null;

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!token.user?.verified) {
    return NextResponse.redirect(new URL('/login/verificacion', req.url));
  }

  return NextResponse.next();
}