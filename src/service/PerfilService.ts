import api from "./Api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorHandler } from "./Handler/ErrorHandler";

export async function buscarPerfil() {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado. Faça login novamente.');

    const response = await api.get(`/perfil`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(ErrorHandler.tratarErroRequisicao(error));
  }
}
