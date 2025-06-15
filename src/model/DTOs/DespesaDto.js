export class DespesaDTO {
    mesReferencia;
    valor;
    descricao;
  
    constructor(mesReferencia, valor, descricao) {
      this.mesReferencia = mesReferencia;
      this.valor = valor;
      this.descricao = descricao;
    }
  
    validarCampos() {
      const erros = {};
  
      if (!this.mesReferencia || isNaN(Date.parse(this.mesReferencia))) {
        erros.mesReferencia = "Data inválida ou ausente.";
      }
  
      if (this.valor === undefined || this.valor === null || isNaN(this.valor)) {
        erros.valor = "Valor deve ser um número.";
      }

      if (!this.descricao || this.descricao === '' || this.descricao === null) {
        erros.descricao = "Campo obrigatório";
      }
  
      return erros;
    }
  
    toJSON() {
      return {
        mesReferencia: this.mesReferencia,
        valor: this.valor,
        descricao: this.descricao,
      };
    }
  }
  