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

export type PositionData = {
  name: string;
};

export const getAllPosition = async (): Promise<PositionData[]> => {
  try {
    const response = await axios.get(`${API_URL}/position`, headers());
    await refreshSession(sessionStorage.getItem('username') || '')
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener el cargo.');
  }
};

export const createPosition = async (name: string): Promise<PositionData> => {
  try {
    const response = await axios.post(
      `${API_URL}/position`,
      { name },
      headers()
    );
    await refreshSession(sessionStorage.getItem('username') || '')
    return response.data;
  } catch (error: any) {
    console.error('Error creating position:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Error al crear el cargo.');
  }
};

export const updatePosition = async (currentName: string, newName: string): Promise<PositionData> => {
  try {
    const response = await axios.put(
      `${API_URL}/position`,
      { currentName, newName },
      headers()
    );
    await refreshSession(sessionStorage.getItem('username') || '')
    return response.data;
  } catch (error: any) {
    console.error('Error updating position:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Error al actualizar el cargo.');
  }
};

export const deletePosition = async (name: string): Promise<void> => {
  try {
    await axios.delete(
      `${API_URL}/position`,
      {
        ...headers(),
        data: { name }
      }
    );
    await refreshSession(sessionStorage.getItem('username') || '')
  } catch (error: any) {
    console.error('Error deleting position:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Error al eliminar el cargo.');
  }
};