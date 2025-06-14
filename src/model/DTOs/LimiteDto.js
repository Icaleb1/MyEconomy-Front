export class LimiteDTO {
    mesReferencia;
    valor;
  
    constructor(mesReferencia, valor) {
      this.mesReferencia = mesReferencia;
      this.valor = valor;
    }
  
    validarCampos() {
      const erros = {};
  
      if (!this.mesReferencia || isNaN(Date.parse(this.mesReferencia))) {
        erros.mesReferencia = "Data inválida ou ausente.";
      }
  
      if (this.valor === undefined || this.valor === null || isNaN(this.valor)) {
        erros.valor = "Valor deve ser um número.";
      }
  
      return erros;
    }
  
    toJSON() {
      return {
        mesReferencia: this.mesReferencia,
        valor: this.valor,
      };
    }
  }
  