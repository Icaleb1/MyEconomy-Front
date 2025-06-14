import { parse } from 'date-fns';

export class UsuarioDTO {
    constructor(nome, email, dataNascimento, senha, confirmarSenha) {
      this.nome = nome;
      this.email = email;
      this.dataNascimento = dataNascimento;
      this.senha = senha;
      this.confirmarSenha = confirmarSenha;
    }
  
    validarCampos() {
      const erros = {};
      if (!this.nome) {
          erros.nome = "Campo obrigatório.";
      }
      if(!this.email){
        erros.email = "Campo obrigatório."
      } else if (!this.email.includes("@")) {
          erros.email = "Email inválido.";
      }
      if (!this.dataNascimento) {
        erros.dataNascimento = "Campo obrigatório."
      }
      if (!this.senha) {
          erros.senha = "Campo obrigatório.";
      }
      if (this.senha !== this.confirmarSenha) {
          erros.confirmarSenha = "As senhas não coincidem.";
      }
      if (!this.confirmarSenha) {
        erros.confirmarSenha = "Campo obrigatório."
      }
      if (this.senha && this.senha.length < 6) {
        erros.senha = "Senha deve ter no minimo 6 caracteres.";
      }
      if (this.confirmarSenha && this.confirmarSenha.length < 6) {
        erros.confirmarSenha = "Senha deve ter no minimo 6 caracteres."
      }
      return erros;
  }

  isValid() {
    const erros = this.validarCampos();
    return Object.keys(erros).length === 0;
  }
  
  

  toJSON() {
    const parsedDate = parse(this.dataNascimento, 'dd/MM/yyyy', new Date());
  
    return {
      nome: this.nome,
      email: this.email,
      dataNascimento: parsedDate,
      senha: this.senha,
      confirmarSenha: this.confirmarSenha,
    };
  } 
}