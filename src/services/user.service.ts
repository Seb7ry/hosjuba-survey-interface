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

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`, headers());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener usuarios.');
  }
};

export const getUser = async (username: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/${username}`, headers());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener el usuario.');
  }
};

export const createUser = async (data: {
  username: string;
  password: string;
  name: string;
  department: string;
  position: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/user`, data, headers());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear el usuario.');
  }
};

export const updateUser = async (data: {
  username: string;
  password: string;
  name: string;
  department: string;
  position: string;
}) => {
  try {
    const response = await axios.put(`${API_URL}/user`, data, headers());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el usuario.');
  }
};

export const deleteUser = async (username: string) => {
  try {
    const response = await axios.delete(`${API_URL}/user/${username}`, headers());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar el usuario.');
  }
};
