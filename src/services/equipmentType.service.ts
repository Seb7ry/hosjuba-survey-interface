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

export type EquipmentTypeData = {
    _id?: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
};

export const getAllEquipmentTypes = async (): Promise<EquipmentTypeData[]> => {
    try {
        const response = await axios.get(`${API_URL}/equip-type`, headers());
        await refreshSession(sessionStorage.getItem('username') || '');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener los tipos de equipo.');
    }
};

export const createEquipmentType = async (name: string): Promise<EquipmentTypeData> => {
    try {
        const response = await axios.post(
            `${API_URL}/equip-type`,
            { name },
            headers()
        );
        return response.data;
    } catch (error: any) {
        console.error('Error creating equipment type:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Error al crear el tipo de equipo.');
    }
};

export const updateEquipmentType = async (lastName: string, newName: string): Promise<EquipmentTypeData> => {
    try {
        const response = await axios.put(
            `${API_URL}/equip-type/${lastName}`,
            { newName },
            headers()
        );
        return response.data;
    } catch (error: any) {
        console.error('Error updating equipment type:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Error al actualizar el tipo de equipo.');
    }
};

export const deleteEquipmentType = async (lastName: string): Promise<void> => {
    try {
        await axios.delete(
            `${API_URL}/equip-type/${lastName}`,
            headers()
        );
    } catch (error: any) {
        console.error('Error deleting equipment type:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Error al eliminar el tipo de equipo.');
    }
};