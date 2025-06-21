import AsyncStorage from "@react-native-async-storage/async-storage";
import { DespesaDTO } from "../model/DTOs/DespesaDto";
import api from "./Api";
import { ErrorHandler } from "./Handler/ErrorHandler";

export async function criarDespesa(despesa: DespesaDTO) {
    try {

        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado. Faça login novamente.');

        const response = await api.post('/criar-despesa', despesa, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;

    } catch (error: any) {
        throw new Error(ErrorHandler.tratarErroRequisicao(error));
    }
}

export async function buscarDespesas(mes: number, ano: number) {
    try {

        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado. Faça login novamente.');

        const response = await api.get<DespesaDTO[]>('/buscar-despesas', {
            params: { ano, mes },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(ErrorHandler.tratarErroRequisicao(error));
    }
}

export async function editarDespesa(idDespesa: number, dadosAtualizados: Partial<DespesaDTO>) {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado. Faça login novamente.');

        const response = await api.put(`/editar-despesa/${idDespesa}`, dadosAtualizados, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        throw new Error(ErrorHandler.tratarErroRequisicao(error));
    }
}

export async function excluirDespesa(idDespesa: number) {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado. Faça login novamente.');

        const response = await api.delete(`/excluir-despesa/${idDespesa}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data; 
    } catch (error: any) {
        throw new Error(ErrorHandler.tratarErroRequisicao(error));
    }
}