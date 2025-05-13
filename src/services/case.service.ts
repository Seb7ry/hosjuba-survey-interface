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

export const createCase = async (caseData: any) => {
    const response = await axios.post(`${API_URL}/case`, caseData, headers());
    return response.data;
}

export const getCaseByNumber = async (caseNumber: any) => {
    const response = await axios.get(`${API_URL}/case/${caseNumber}`, headers());
    return response.data;
}

export const searchCases = async (filters: any) => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
        }
    });

    const response = await axios.get(`${API_URL}/case?${queryParams.toString()}`, headers());
    return response.data;
};


export const updateCase = async (id: any, updateData: any) => {
    const response = await axios.put(`${API_URL}/case/${id}`, updateData, headers());
    return response.data;
};

export const deleteCase = async (id: any) => {
    const response = await axios.delete(`${API_URL}/case/${id}`, headers());
    return response.data;
};