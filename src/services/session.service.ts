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

export const refreshSession = async (username: string) => {
    try {
        if (!username) throw new Error('Username es requerido.');

        const response = await axios.post(`${API_URL}/session`,
            { username }, headers());

        if (response.data) sessionStorage.setItem('expiredDateAt', response.data.expiredDateAt);

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al refrescar la sesión. Por favor intente nuevamente.');
    }
};