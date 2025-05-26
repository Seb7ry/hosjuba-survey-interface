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

export type TimeInterval =
    | 'anual'
    | 'semestral'
    | 'trimestral'
    | 'mensual'
    | 'personalizado';

export type ReportType = 'Mantenimiento' | 'Preventivo';

export interface GenerateReportParams {
    type: ReportType;
    interval: TimeInterval;
    year?: number;
    month?: number;
    startDate?: Date;
    endDate?: Date;
}

export const generateReport = async (params: GenerateReportParams) => {
    try {
        const queryParams = {
            type: params.type,
            interval: params.interval,
            year: params.year?.toString(),
            month: params.month?.toString(),
            startDate: params.startDate?.toISOString(),
            endDate: params.endDate?.toISOString()
        };

        const response = await axios.get(`${API_URL}/report/generate`, {
            ...headers(),
            params: queryParams,
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Reporte_${params.type}.xlsx`);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        await refreshSession(sessionStorage.getItem('username') || '')
        return true;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al generar el reporte.');
        } else {
            throw new Error('Error de conexión al generar el reporte.');
        }
    }
};