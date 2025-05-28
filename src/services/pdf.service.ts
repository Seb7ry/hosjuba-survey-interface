import axios from 'axios';

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

export const generatePreventivePdf = async (caseNumber: string): Promise<Blob> => {
    const response = await axios.post(
        `${API_URL}/pdf/preventive/${caseNumber}`,
        {},
        {
            ...headers(),
            responseType: 'blob',
        }
    );
    return response.data;
};

export const generateCorrectivePdf = async (caseNumber: string): Promise<Blob> => {
    const response = await axios.post(
        `${API_URL}/pdf/corrective/${caseNumber}`,
        {},
        {
            ...headers(),
            responseType: 'blob',
        }
    );
    return response.data; 
};