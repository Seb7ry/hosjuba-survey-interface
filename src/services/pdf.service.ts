import axios from 'axios';
import { refreshSession } from './session.service';

const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => {
    const token = sessionStorage.getItem('access_token');
    return token ? `Bearer ${token}` : '';
};

//const headers = () => ({
//    headers: {
//        Authorization: getToken(),
//'Content-Type': 'application/json',
//    },
//});

const headers = (hasBody = false) => {
    const baseHeaders: any = {
        Authorization: getToken(),
    };

    if (hasBody) {
        baseHeaders['Content-Type'] = 'application/json';
    }

    return { headers: baseHeaders };
};


export const generatePreventivePdf = async (caseNumber: string): Promise<Blob> => {
    const response = await axios.post(
        `${API_URL}/pdf/preventive/${caseNumber}`,
        //{},
        null,
        {
            ...headers(),
            responseType: 'blob',
        }
    );
    await refreshSession(sessionStorage.getItem('username') || '');
    return response.data;
};

export const generateCorrectivePdf = async (caseNumber: string): Promise<Blob> => {
    const response = await axios.post(
        `${API_URL}/pdf/corrective/${caseNumber}`,
        //{},
        null,
        {
            ...headers(),
            responseType: 'blob',
        }
    );
    await refreshSession(sessionStorage.getItem('username') || '');
    return response.data;
};