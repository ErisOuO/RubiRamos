export type Usuario = {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    verified: boolean;
    active: boolean;
};

export type Paciente = {
    id: number;
    first_name: string;
    second_name: string | null;
    last_name: string;
    second_last_name: string | null;
    age: number;
    phone: string;
    email: string;
    password: string;
    code: string;
    expiracion: Date | null;
    recovery_token: string | null;
    recovery_exp: Date | null;
    verified: boolean;
    created_at: Date;
    updated_at: Date;
    active: Date | null; // Solo pacientes con null en active
};

// Tipo para crear un nuevo paciente (sin campos auto-generados)
export type PacienteInsert = Omit<Paciente, 'id' | 'created_at' | 'updated_at' | 'expiracion' | 'recovery_token' | 'recovery_exp' | 'verified'> & {
    verified?: boolean;
};

// Tipo para actualizar paciente (todos los campos opcionales excepto id)
export type PacienteUpdate = Partial<Omit<Paciente, 'id'>> & {
    id: number;
};

export type Categoria = {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    active: Date | null;
};

export type Producto = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    created_at: Date;
    updated_at: Date;
    active: Date | null;
};

export type Producto_Categoria = {
    producto_id: number;
    categoria_id: number;
    created_at: Date;
}