export class PerfilDTO {
    constructor(nome, email, dataNascimento) {
        this.nome = nome;
        this.email = email;
        this.dataNascimento = dataNascimento;
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
