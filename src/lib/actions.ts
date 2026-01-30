'use server';

import postgres from 'postgres';
import bycript from 'bcrypt';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function updateContrasena(id: string, formData: FormData) {
  const contrasena = formData.get('contrasena') as string;

  try {
    const hashedContrasena = await bycript.hash(contrasena, 10);

    await sql`
      UPDATE tbladmins
      SET contrasena = ${hashedContrasena}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    throw new Error('No se pudo actualizar la contraseña');
  }
}

function generarContrasena() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let contrasena = '';
  
  // Asegurar al menos un número y una letra mayúscula
  const mayuscula = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';
  
  // Primer carácter: letra mayúscula
  contrasena += mayuscula.charAt(Math.floor(Math.random() * mayuscula.length));
  
  // Segundo carácter: número
  contrasena += numeros.charAt(Math.floor(Math.random() * numeros.length));
  
  // Resto de caracteres: mezcla aleatoria
  for (let i = 0; i < 6; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    contrasena += caracteres.charAt(indice);
  }
  
  // Mezclar los caracteres para mayor aleatoriedad
  return contrasena.split('').sort(() => Math.random() - 0.5).join('');
}

export async function crearPaciente(formData: FormData) {
  // Extraer datos del formulario
  const firstName = formData.get('first_name') as string;
  const secondName = formData.get('second_name') as string | null;
  const lastName = formData.get('last_name') as string;
  const secondLastName = formData.get('second_last_name') as string | null;
  const age = formData.get('age') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  
  // Validaciones básicas
  if (!firstName || !lastName || !age || !phone || !email) {
    throw new Error('Todos los campos obligatorios son requeridos');
  }
  
  if (phone.length !== 10) {
    throw new Error('El teléfono debe tener 10 dígitos');
  }
  
  try {
    // Generar contraseña aleatoria
    const contrasenaPlana = generarContrasena();
    
    // Hashear la contraseña
    const hashedContrasena = await bycript.hash(contrasenaPlana, 10);
    
    // Insertar el paciente en la base de datos
    const [paciente] = await sql`
      INSERT INTO tblpatients (
        first_name,
        second_name,
        last_name,
        second_last_name,
        age,
        phone,
        email,
        password,
        verified,
        active
      ) VALUES (
        ${firstName.trim()},
        ${secondName?.trim() || null},
        ${lastName.trim()},
        ${secondLastName?.trim() || null},
        ${parseInt(age)},
        ${phone.trim()},
        ${email.trim().toLowerCase()},
        ${hashedContrasena},
        false,
        true
      ) RETURNING id, email, first_name, last_name
    `;
    
    return {
      success: true,
      message: 'Paciente creado exitosamente',
      pacienteId: paciente.id,
      nombre: `${paciente.first_name} ${paciente.last_name}`,
      email: paciente.email,
      contrasenaGenerada: contrasenaPlana,
      contrasena: contrasenaPlana
    };
    
  } catch (error) {
    console.error('Error al crear paciente:', error);
    
    // Manejo específico de error de duplicación de email
    if (error instanceof Error && error.message.includes('unique constraint')) {
      throw new Error('El correo electrónico ya está registrado');
    }
    
    throw new Error('No se pudo crear el paciente');
  }
}

export async function obtenerPacientesBasicos() {
  try {
    const pacientes = await sql`
      SELECT 
        id,
        -- Nombre completo formateado
        TRIM(
          CONCAT(
            first_name,
            CASE WHEN second_name IS NOT NULL AND second_name != '' THEN ' ' || second_name ELSE '' END,
            ' ',
            last_name,
            CASE WHEN second_last_name IS NOT NULL AND second_last_name != '' THEN ' ' || second_last_name ELSE '' END
          )
        ) as nombre_completo,
        phone,
        email,
        -- Estado formateado
        CASE 
          WHEN active = true AND verified = true THEN 'Activo y verificado'
          WHEN active = true AND verified = false THEN 'Activo (no verificado)'
          WHEN active = false THEN 'Inactivo'
          ELSE 'Estado desconocido'
        END as estado
      FROM tblpatients
      ORDER BY 
        active DESC,
        verified DESC,
        last_name ASC,
        first_name ASC
    `;
    
    return {
      success: true,
      pacientes: pacientes,
      total: pacientes.length,
      activos: pacientes.filter(p => p.estado.includes('Activo')).length,
      verificados: pacientes.filter(p => p.estado.includes('verificado')).length
    };
    
  } catch (error) {
    console.error('Error al obtener pacientes básicos:', error);
    throw new Error('No se pudieron obtener los pacientes');
  }
}