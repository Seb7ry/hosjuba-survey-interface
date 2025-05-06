import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });

    sessionStorage.setItem('username', response.data.username);
    sessionStorage.setItem('name', response.data.name);
    sessionStorage.setItem('position', response.data.position);
    sessionStorage.setItem('department', response.data.department);
    sessionStorage.setItem('access_token', response.data.access_token);
    sessionStorage.setItem('expiredDateAt', response.data.expiredDateAt);

    return response.data; 
  } catch (error: any) {
    if (error.response) {
      return error.response.data.message || 'Error en el login';
    } else {
      return 'Error al conectarse al servidor';
    }
  }
};

export const logout = async () => {
  try {
    const token = sessionStorage.getItem('access_token');
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      { username: sessionStorage.getItem('username') },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    sessionStorage.clear();
    return response.data;
  } catch (error) {
    return 'Error al cerrar sesión';
  }
};