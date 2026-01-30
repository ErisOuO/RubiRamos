import { NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import { query } from '@/lib/db';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export async function POST(req: Request) {
  const { usuario } = await req.json();

  const code = randomInt(100000, 999999).toString();
  const now = new Date();
  const expiracion = new Date(now.getTime() + 3 * 60 * 1000);

  try {
    const res = await query(
      'UPDATE tbladmins SET code = $1, expiracion = $2 WHERE usuario = $3 RETURNING email',
      [code, expiracion, usuario]
    );

    const email = res.rows[0]?.email;

    if (!email) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Código de verificación - Consultorio Nutricional',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', sans-serif; border: 1px solid #dcdcdc; border-radius: 14px; overflow: hidden;">
          
          <!-- ENCABEZADO -->
          <div style="
            background: linear-gradient(180deg, #A8FF6B 0%, #8EEF5A 40%, #64C23A 100%);
            border-bottom: 3px solid #FF7C00;
            text-align: center;
            padding: 1.5rem;
            color: #1e1e1e;
          ">
            <h1 style="margin: 0; font-size: 1.8rem; font-weight: 700;">Consultorio Nutricional</h1>
            <p style="margin: 0; font-size: 1rem; color: #2f4f2f;">Tu salud es nuestra prioridad</p>
          </div>

          <!-- CUERPO -->
          <div style="background-color: #fdfdfd; padding: 2rem 2.5rem;">
            <h2 style="text-align: center; color: #3a7f2f; font-size: 1.5rem; margin-top: 0;">Verificación de acceso</h2>
            <p style="font-size: 1rem; color: #333; text-align: center; line-height: 1.6;">
              Has iniciado sesión correctamente en el sistema del <strong>Consultorio Nutricional</strong>.<br>
              Ingresa el siguiente código en la página de verificación para continuar:
            </p>

            <div style="
              text-align: center;
              font-size: 2.2rem;
              font-weight: bold;
              margin: 1.8rem 0;
              color: #2d6a25;
              background-color: #ecffe4;
              display: inline-block;
              padding: 0.8rem 1.8rem;
              border-radius: 10px;
              border: 2px solid #64C23A;
            ">
              ${code}
            </div>

            <p style="font-size: 0.95rem; color: #444; text-align: center;">
              Este código expirará en <strong>3 minutos</strong> y solo puede usarse una vez.
            </p>
          </div>

          <!-- PIE -->
          <div style="
            background: linear-gradient(180deg, #64C23A 0%, #579B30 70%, #FF7C00 100%);
            color: #ffffff;
            text-align: center;
            font-size: 0.85rem;
            padding: 1rem;
          ">
            Si no solicitaste este código, puedes ignorar este mensaje.<br />
            © ${new Date().getFullYear()} Consultorio Nutricional — Todos los derechos reservados
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, email });
  } catch (err) {
    console.error('Error al enviar código:', err);
    return NextResponse.json({ error: 'No se pudo enviar el código' }, { status: 500 });
  }
}