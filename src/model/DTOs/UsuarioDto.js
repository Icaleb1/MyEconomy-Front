import { parse, isValid, isAfter } from 'date-fns';

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
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.nome) {
      erros.nome = "Campo obrigatório.";
    }

    if (!this.email) {
      erros.email = "Campo obrigatório.";
    } else if (!regexEmail.test(this.email)) {
      erros.email = "Email inválido.";
    }

    if (!this.dataNascimento) {
      erros.dataNascimento = "Campo obrigatório.";
    } else if (this.dataNascimento.length !== 10) {
      erros.dataNascimento = "Data incompleta.";
    } else {
      const partesData = this.dataNascimento.split('/');
      const ano = partesData[2];
      if (!ano || ano.length !== 4) {
        erros.dataNascimento = "Ano deve ter 4 dígitos.";
      } else {
        const data = parse(this.dataNascimento, 'dd/MM/yyyy', new Date());
        const dataMinima = new Date(1900, 0, 1);

        if (!isValid(data)) {
          erros.dataNascimento = "Data inválida.";
        } else if (isAfter(data, new Date())) {
          erros.dataNascimento = "Data não pode ser no futuro.";
        } else if (data < dataMinima) {
          erros.dataNascimento = "Data muito antiga.";
        }
      }
    }

    if (!this.senha) {
      erros.senha = "Campo obrigatório.";
    } else if (this.senha.length < 6) {
      erros.senha = "Senha deve ter no mínimo 6 caracteres.";
    }

    if (!this.confirmarSenha) {
      erros.confirmarSenha = "Campo obrigatório.";
    } else if (this.confirmarSenha.length < 6) {
      erros.confirmarSenha = "Senha deve ter no mínimo 6 caracteres.";
    } else if (this.senha !== this.confirmarSenha) {
      erros.confirmarSenha = "As senhas não coincidem.";
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
