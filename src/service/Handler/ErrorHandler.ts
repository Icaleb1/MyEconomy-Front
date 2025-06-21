export class ErrorHandler {
    static tratarErroRequisicao(error: any): string {
      if (error.response) {
        return (
          error.response.data?.error ||
          error.response.data?.message ||
          'Erro desconhecido no servidor'
        );
      } else if (error.request) {
        return 'Servidor não respondeu. Verifique sua conexão.';
      } else {
        return 'Erro ao configurar a requisição: ' + error.message;
      }
    }
  }
  