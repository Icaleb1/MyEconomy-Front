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
      return erros;
  }
  
  
    toJSON() {
      return {
        nome: this.nome,
        email: this.email,
        dataNascimento: this.dataNascimento,
        senha: this.senha,
      };
    }
  }
  