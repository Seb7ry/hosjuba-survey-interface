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

export type UserData = {
  username: string;
  password: string; // Hacer obligatorio para creación
  name: string;
  department: string;
  position: string;
  signature?: string;
};

export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const response = await axios.get(`${API_URL}/user`, headers());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener usuarios.');
  }
};

export const createUser = async (userData: UserData): Promise<UserData> => {
  try {
    const response = await axios.post(`${API_URL}/user`, {
      username: userData.username,
      password: userData.password,
      name: userData.name,
      department: userData.department,
      position: userData.position,
      signature: userData.signature
    }, headers());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear el usuario.');
  }
};

export const updateUser = async (userData: UserData): Promise<UserData> => {
  try {
    const response = await axios.put(`${API_URL}/user`, {
      username: userData.username,
      ...(userData.password && { password: userData.password }), // Solo envía password si existe
      name: userData.name,
      department: userData.department,
      position: userData.position,
      signature: userData.signature
    }, headers());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el usuario.');
  }
};

export const deleteUser = async (username: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/user/${username}`, headers());
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar el usuario.');
  }
};