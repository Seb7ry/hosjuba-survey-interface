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

export type UserData = {
  username: string;
  password: string;
  name: string;
  department: string;
  position: string;
  signature?: string;
};

export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const response = await axios.get(`${API_URL}/user`, headers());
    await refreshSession(sessionStorage.getItem('username') || '')
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener usuarios.');
  }
};

export const getUserByUsername = async (username: string): Promise<UserData> => {
  try {
    const response = await axios.get(`${API_URL}/user/${username}`, headers());
    await refreshSession(sessionStorage.getItem('username') || '')
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener usuario.');
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
    await refreshSession(sessionStorage.getItem('username') || '')
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear el usuario.');
  }
};

export const updateUser = async (userData: UserData): Promise<UserData> => {
  try {
    const response = await axios.put(`${API_URL}/user`, {
      username: userData.username,
      ...(userData.password && { password: userData.password }),
      name: userData.name,
      department: userData.department,
      position: userData.position,
      signature: userData.signature
    }, headers());
    if (userData.username === sessionStorage.getItem('username')) {
      sessionStorage.setItem('name', response.data.name);
      sessionStorage.setItem('department', response.data.department);
      sessionStorage.setItem('position', response.data.position);
    }
    await refreshSession(sessionStorage.getItem('username') || '')
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el usuario.');
  }
};

export const deleteUser = async (username: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/user/${username}`, headers());
    await refreshSession(sessionStorage.getItem('username') || '')
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar el usuario.');
  }
};