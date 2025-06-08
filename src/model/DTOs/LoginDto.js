export class LoginDTO {
    constructor(email, senha) {
      this.nome = nome;
      this.email = email;
      this.dataNascimento = dataNascimento;
      this.senha = senha;
      this.confirmarSenha = confirmarSenha;
    }
  
    validarCampos() {
      const erros = {};
      if (!this.email.includes("@")) {
          erros.email = "Email inválido.";
      }
      if (!this.senha) {
          erros.senha = "Campo obrigatório.";
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
  