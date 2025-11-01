'use server';

import { fetchMarcas } from './dataMarcas';
import { fetchModelosPorMarca, fetchModelos } from './dataModelos';
import { fetchAniosPorModelo, fetchAnios } from './data';
import { fetchFacturas } from './dataFacturas';

export async function getMarcas() {
    return await fetchMarcas();
}

export async function getModelosPorMarca(marcaId: string) {
    return await fetchModelosPorMarca(marcaId);
}

export async function getAniosPorModelo(modeloId: string) {
    return await fetchAniosPorModelo(modeloId);
}

export async function getFacturas() {
    return await fetchFacturas();
}

export async function getAnios() {
    return await fetchAnios();
}

export async function getModelos() {
    return await fetchModelos();
}