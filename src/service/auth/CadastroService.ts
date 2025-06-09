import api from "../Api";

export async function cadastrar(nome, email, dataNascimento, senha, confirmarSenha) {
    if (senha !== confirmarSenha) {
      throw new Error('As senhas não coincidem');
    }
  
    try {
      const response = await api.post('/cadastro', { nome, email, dataNascimento, senha, confirmarSenha });
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
  