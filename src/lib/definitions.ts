export type Usuario = {
    id: string;
    usuario: string;
    contrasena: string;
    name?: string | null;
    email: string;
    code: string;
    image?: string | null;
    verified: boolean;
};
