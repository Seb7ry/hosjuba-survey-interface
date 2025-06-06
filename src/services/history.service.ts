// src/services/history.service.ts
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

export type HistoryRecord = {
    _id?: string;
    username: string;
    message: string;
    timestamp: string;
    expirationDate?: string;
};

export const getAllHistory = async (): Promise<HistoryRecord[]> => {
    try {
        const response = await axios.get(`${API_URL}/history`, headers());
        await refreshSession(sessionStorage.getItem('username') || '');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener historial.');
    }
};

export const getHistoryByFilters = async (
    username?: string,
    startDate?: string,
    endDate?: string
): Promise<HistoryRecord[]> => {
    try {
        const params = new URLSearchParams();
        if (username) params.append('username', username);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await axios.get(`${API_URL}/history/filter?${params.toString()}`, {
            ...headers(),
            data: { username: sessionStorage.getItem('username') },
        });

        await refreshSession(sessionStorage.getItem('username') || '');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al filtrar historial.');
    }
};
