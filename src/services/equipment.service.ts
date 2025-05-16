import axios from 'axios';
import { refreshSession } from './session.service';

const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => {
    const token = sessionStorage.getItem('access_token');
    return token ? `Bearer ${token}` : '';
};

const headers = () => ({
    headers: {
        Authorization: getToken(),
        'Content-Type': 'application/json',
    },
});

export type EquipmentData = {
    name: string;
    brand: string;
    type: string;
    model: string;
    serial?: string;
    numberInventory?: string;
};

export type EquipmentResponse = EquipmentData & {
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
};

export const getAllEquipment = async (): Promise<EquipmentResponse[]> => {
    try {
        const response = await axios.get(`${API_URL}/equipment`, headers());
        await refreshSession(sessionStorage.getItem('username') || '');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener los equipos.');
    }
};

export const createEquipment = async (equipmentData: EquipmentData): Promise<EquipmentResponse> => {
    try {
        const response = await axios.post(`${API_URL}/equipment`, {
            name: equipmentData.name,
            brand: equipmentData.brand,
            model: equipmentData.model,
            serial: equipmentData.serial,
            numberInventory: equipmentData.numberInventory
        }, headers());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al crear el equipo.');
    }
};

export const updateEquipment = async (name: string, updateData: Partial<EquipmentData>): Promise<EquipmentResponse> => {
    try {
        const response = await axios.put(`${API_URL}/equipment/${name}`, {
            ...updateData
        }, headers());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al actualizar el equipo.');
    }
};

export const deleteEquipment = async (name: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/equipment/${name}`, headers());
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al eliminar el equipo.');
    }
};

export const getEquipmentByName = async (name: string): Promise<EquipmentResponse> => {
    try {
        const response = await axios.get(`${API_URL}/equipment/${name}`, headers());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener el equipo.');
    }
};

export const searchEquipment = async (filters: Partial<EquipmentData>): Promise<EquipmentResponse[]> => {
    try {
        const queryParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });

        const response = await axios.get(
            `${API_URL}/equipment/search?${queryParams.toString()}`,
            headers()
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al buscar equipos.');
    }
};