import { LoginDTO } from "../../model/DTOs/LoginDto";
import api from "../Api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function login(login: LoginDTO) {
  try {
    const response = await api.post('/login', login);
    const data = response.data;

    if (data.token) {
      await AsyncStorage.setItem('token', data.token);
    } else {
      throw new Error('Token não encontrado na resposta do servidor');
    }

    return data;
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.error ||
                            error.response.data.message ||
                            'Erro desconhecido no servidor';

      const statusMessages = {
        400: 'Dados inválidos',
        401: 'Não autorizado',
        404: 'Usuário não encontrado',
        409: 'Conflito de dados',
        500: 'Erro interno do servidor'
      };

      throw new Error(statusMessages[error.response.status] || errorMessage);

    } else if (error.request) {
      throw new Error('Servidor não respondeu. Verifique sua conexão.');
    } else {
      throw new Error('Erro ao configurar a requisição: ' + error.message);
    }
  }
}

export async function sair() {
  try {
    await AsyncStorage.removeItem('token');
    return true;
  } catch (error) {
    throw new Error('Erro ao fazer logout: ' + error.message);
  }
}
