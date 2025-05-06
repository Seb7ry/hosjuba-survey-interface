import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => {
    const token = sessionStorage.getItem('access_token');
    return token ? `Bearer ${token}` : '';
}

const headers = () => ({
    headers: {
        Authorization: getToken(),
        'Content-Type': 'application/json',
    },
});

export const listDocuments = async () => {
    try {
        const response = await axios.get(`${API_URL}/one-drive/listDocument`, headers());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al listar documentos generados.');
    }
}

export const listTemplates = async () => {
    try {
        const response = await axios.get(`${API_URL}/one-drive/listTemplate`, headers());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al listar plantillas.');
    }
}

export const searchFiles = async (query: string) => {
    try {
        const response = await axios.get(`${API_URL}/one-drive/search/${query}`, headers());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al buscar archivos.');
    }
}

export const downloadFile = async (fileId: string): Promise<Blob> => {
    try {
        const response = await axios.get(`${API_URL}/one-drive/download/${fileId}`, {
            ...headers(),
            responseType: 'blob',
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al descargar el archivo.');
    }
}

export const uploadFileDocument = async (file: File, name: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    try {
        const response = await axios.post(`${API_URL}/one-drive/upload`, formData, {
            headers: {
                Authorization: getToken(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al subir el documento.');
    }
};
