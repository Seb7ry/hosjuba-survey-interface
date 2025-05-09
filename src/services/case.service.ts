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

export type FirmaData = {
    nombre: string;
    cargo: string;
    firma: string;
};

export type CalificacionData = {
    efectividad: number;
    satisfaccion: number;
};

export type CaseData = {
    numeroCaso: string;
    dependencia: string;
    funcionario: string;
    cargoFuncionario: string;
    firmaTecnico: FirmaData;
    firmaUsuario?: FirmaData;
    calificacion?: CalificacionData;
    estado?: string;
    addData?: Record<string, any>;
};

export const getAllCases = async (): Promise<CaseData[]> => {
    try {
        const response = await axios.get(`${API_URL}/case`, headers());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener los casos.');
    }
};

export const getCaseByNumber = async (numeroCaso: string): Promise<CaseData> => {
    try {
        const response = await axios.get(`${API_URL}/case/${numeroCaso}`, headers());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener el caso.');
    }
};

export const getCasesByDepartment = async (dependencia: string, numeroCaso?: string): Promise<CaseData[]> => {
    try {
        const params = numeroCaso ? { dependencia, numeroCaso } : { dependencia };
        const response = await axios.get(`${API_URL}/case/department`, {
            ...headers(),
            params
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al filtrar casos por dependencia.');
    }
};

export const createCase = async (caseData: CaseData): Promise<CaseData> => {
    try {
        const response = await axios.post(`${API_URL}/case`, {
            numeroCaso: caseData.numeroCaso,
            dependencia: caseData.dependencia,
            funcionario: caseData.funcionario,
            cargoFuncionario: caseData.cargoFuncionario,
            firmaTecnico: caseData.firmaTecnico,
            ...(caseData.firmaUsuario && { firmaUsuario: caseData.firmaUsuario }),
            ...(caseData.calificacion && { calificacion: caseData.calificacion }),
            ...(caseData.estado && { estado: caseData.estado }),
            ...(caseData.addData && { addData: caseData.addData })
        }, headers());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al crear el caso.');
    }
};

export const updateCase = async (id: string, caseData: Partial<CaseData>): Promise<CaseData> => {
    try {
        const response = await axios.put(`${API_URL}/case/${id}`, caseData, headers());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al actualizar el caso.');
    }
};

export const deleteCase = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/case/${id}`, headers());
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al eliminar el caso.');
    }
};