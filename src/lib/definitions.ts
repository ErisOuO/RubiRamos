export type Marca = {
    id: string;
    nombre: string;
};

export type Modelo = {
    id: string;
    nombre: string;
    marca_id: string;
};

export type Anio = {
    id: string;
    anio: string;
};

export type Factura = {
    id: string;
    nombre: string;
    porcentaje: number;
};

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

export type Kilometraje = {
    id: string;
    kilometraje: string;
    factor_ajuste: number;
    anio_id: string;
}

export type Auditoria = {
    id: string;
    usuario: string;
    accion: string;
    tabla: string;
    detalles: string;
}

export type ModeloConMarca = {
    id: string;
    nombre: string;
    marca_id: string;
    marca_nombre: string;
};

export type Version = {
    id: string;
    nombre: string;
    precio_base: number;
    marca_id: string;
    modelo_id: string;
    anio_id: string;
}

export type VersionConNombres = {
    id: string;
    nombre: string;
    precio_base: number;
    marca_id: string;
    marca_nombre: string;
    modelo_id: string;
    modelo_nombre: string;
    anio_id: string;
    anio: string;
};

export type KmRange = {
    id: string;
    kilometraje: string;
    factor_ajuste: number;
};

export type KmRangeConAnio = {
    id: string;
    kilometraje: string;
    factor_ajuste: number;
    anio_id: string;
    anio_anio: string;
};

export type Accion = {
    id: string;
    usuario: string;
    fecha_hora: string;
    accion: string;
    tabla_afectada: string;
    detalles: string;
}