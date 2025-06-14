import AsyncStorage from "@react-native-async-storage/async-storage";
import { LimiteDTO } from "../model/DTOs/LimiteDto";
import api from "./Api";

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
    if (error.response) {
      const errorMessage = error.response.data.error ||
                            error.response.data.message ||
                            'Erro desconhecido no servidor';

      const statusMessages: Record<number, string> = {
        400: 'Dados inválidos',
        401: 'Não autorizado',
        404: 'Endpoint não encontrado',
        409: 'Conflito de dados',
        500: 'Erro interno no servidor'
      };

      throw new Error(statusMessages[error.response.status] || errorMessage);
    } else if (error.request) {
      throw new Error('Servidor não respondeu. Verifique sua conexão.');
    } else {
      throw new Error('Erro ao configurar a requisição: ' + error.message);
    }
  }
}

export async function buscarLimite(mes: number, ano: number) {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado. Faça login novamente.');
  
      const response = await api.get('/buscar-limite',{
        params: { ano, mes },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.error || 'Erro ao buscar perfil');
      } else if (error.request) {
        throw new Error('Servidor não respondeu. Verifique sua conexão.');
      } else {
        throw new Error('Erro na requisição: ' + error.message);
      }
    }
  }
  