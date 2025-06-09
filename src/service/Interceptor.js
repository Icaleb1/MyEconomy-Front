import api from './Api';

api.interceptors.response.use(
  response => response,
  error => {
    const mensagem = error.response?.data?.message 
    ?? error.response?.data?.error 
    ?? 'Erro desconhecido';
    return Promise.reject(new Error(mensagem));
  }
);
