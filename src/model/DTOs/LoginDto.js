export class LoginDTO {
  constructor(email = '', senha = '') {
    this.email = email;
    this.senha = senha;
  }

  isValid() {
    return this.email.trim() !== '' && this.senha.trim() !== '';
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
      email: this.email,
      senha: this.senha,
    };
  }
}
