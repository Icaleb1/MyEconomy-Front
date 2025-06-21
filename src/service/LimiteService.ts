import AsyncStorage from "@react-native-async-storage/async-storage";
import { LimiteDTO } from "../model/DTOs/LimiteDto";
import api from "./Api";
import { ErrorHandler } from "./Handler/ErrorHandler";

export async function criarLimite(limite: LimiteDTO) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado. Faça login novamente.');

    const response = await api.post('/criar-limite', limite, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(ErrorHandler.tratarErroRequisicao(error));
  }
}

export async function buscarLimite(mes: number, ano: number) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado. Faça login novamente.');

    const response = await api.get('/buscar-limite', {
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

export async function editarLimite(idLimite: number, valor: number) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado. Faça login novamente.');

    const response = await api.put(`/editar-limite/${idLimite}`, { valor }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(ErrorHandler.tratarErroRequisicao(error));
  }
}

export async function excluirLimite(idLimite: number) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado. Faça login novamente.');

    const response = await api.delete(`/excluir-limite/${idLimite}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(ErrorHandler.tratarErroRequisicao(error));
  }
}

