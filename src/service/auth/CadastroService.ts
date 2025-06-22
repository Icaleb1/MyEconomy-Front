import { UsuarioDTO } from "../../model/DTOs/UsuarioDto";
import api from "../Api";

export async function cadastrar(usuario: UsuarioDTO) {
  console.log('Cadastrando usuário:', usuario);
    try {
      const response = await api.post('/cadastro',  usuario );
      return response.data;

    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error ||
                              error.response.data.message ||
                              'Erro desconhecido no servidor';
  
        const statusMessages = {
          400: 'Dados inválidos',
          401: 'Não autorizado',
          404: 'Endpoint não encontrado',
          409: 'Usuário já cadastrado',
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
  