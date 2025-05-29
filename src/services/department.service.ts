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

export type DepartmentData = {
  name: string;
};

export const getAllDepartments = async (): Promise<DepartmentData[]> => {
  try {
    const response = await axios.get(`${API_URL}/department`, headers());
    await refreshSession(sessionStorage.getItem('username') || '');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener dependencias.');
  }
};

export const createDepartment = async (name: string): Promise<DepartmentData> => {
  try {
    const response = await axios.post(
      `${API_URL}/department`,
      { name },
      headers()
    );
    await refreshSession(sessionStorage.getItem('username') || '');
    return response.data;
  } catch (error: any) {
    console.error('Error creating department:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Error al crear la dependencia.');
  }
};

export const updateDepartment = async (currentName: string, newName: string): Promise<DepartmentData> => {
  try {
    const response = await axios.put(
      `${API_URL}/department`,
      { currentName, newName },
      headers()
    );
    await refreshSession(sessionStorage.getItem('username') || '');
    return response.data;
  } catch (error: any) {
    console.error('Error updating department:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Error al actualizar la dependencia.');
  }
};

export const deleteDepartment = async (name: string): Promise<void> => {
  try {
    await axios.delete(
      `${API_URL}/department`,
      {
        ...headers(),
        data: { name }
      }
    );
    await refreshSession(sessionStorage.getItem('username') || '');
  } catch (error: any) {
    console.error('Error deleting department:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Error al eliminar la dependencia.');
  }
};