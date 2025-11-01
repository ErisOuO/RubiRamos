// Script para crear usuarios en la base de datos PostgreSQL
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

const usuarios = [
  { usuario: 'admin', contraseña: 'admin123' },
  { usuario: 'erick', contraseña: 'erick123' },
  { usuario: 'sofia', contraseña: 'sofia123' },
];

async function insertarUsuarios() {
  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.contraseña, 10);

    await sql`
      INSERT INTO tblusuarios (usuario, contrasena)
      VALUES (${u.usuario}, ${hash})
      ON CONFLICT (usuario) DO NOTHING
    `;

    console.log(`Usuario ${u.usuario} creado`);
  }

  process.exit();
}

insertarUsuarios().catch(err => {
  console.error('Error al insertar usuarios:', err);
  process.exit(1);
});
