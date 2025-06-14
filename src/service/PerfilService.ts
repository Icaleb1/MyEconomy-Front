import api from "./Api";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
