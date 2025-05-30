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

export const createCase = async (caseData: any) => {
    const response = await axios.post(`${API_URL}/case`, caseData, headers());
    await refreshSession(sessionStorage.getItem('username') || '');
    return response.data;
};

export const getCaseByNumber = async (caseNumber: any) => {
    const response = await axios.get(`${API_URL}/case/${caseNumber}`, headers());
    await refreshSession(sessionStorage.getItem('username') || '');
    return response.data;
};

export const searchCases = async (filters: any) => {
    try {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '' && v !== null)
        );

        const response = await axios.get(`${API_URL}/case`, {
            ...headers(),
            params: cleanFilters
        });
        await refreshSession(sessionStorage.getItem('username') || '');
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al buscar casos.');
        } else {
            throw new Error('Error de conexión al buscar casos.');
        }
    }
};

export const updateCase = async (id: any, updateData: any) => {
    const response = await axios.put(`${API_URL}/case/${id}`, updateData, headers());
    await refreshSession(sessionStorage.getItem('username') || '');
    return response.data;
};

export const deleteCase = async (id: any) => {
    const response = await axios.delete(`${API_URL}/case/${id}`, headers());
    await refreshSession(sessionStorage.getItem('username') || '');
    return response.data;
};

export const getDeletedCases = async (caseNumber?: string) => {
    const response = await axios.get(`${API_URL}/case/deleted`, {
        ...headers(),
        params: caseNumber ? { caseNumber } : {},
    });
    await refreshSession(sessionStorage.getItem('username') || '');
    return response.data;
};

export const restoreCase = async (caseNumber: string) => {
    const response = await axios.post(`${API_URL}/case/restore/${caseNumber}`, {}, headers());
    await refreshSession(sessionStorage.getItem('username') || '');
    return response.data;
};