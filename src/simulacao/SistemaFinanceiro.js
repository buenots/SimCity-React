export class SistemaFinanceiro {
  constructor({
    saldoInicial = 100000,
    dificuldade = "normal",
  } = {}) {
    this.saldo = saldoInicial;
    this.dificuldade = dificuldade;

    this.multiplicadorDificuldadeReceita = 1.0;
    this.multiplicadorDificuldadeDespesa = 1.0;

    if (dificuldade === "facil") {
      this.multiplicadorDificuldadeReceita = 1.25;
      this.multiplicadorDificuldadeDespesa = 0.8;
    } else if (dificuldade === "dificil") {
      this.multiplicadorDificuldadeReceita = 0.85;
      this.multiplicadorDificuldadeDespesa = 1.15;
    } else if (dificuldade === "extremo") {
      this.multiplicadorDificuldadeReceita = 0.7;
      this.multiplicadorDificuldadeDespesa = 1.25;
    }

    this.politicaFiscal = "normal";
    this.taxaImpostoResidencial = 1.0;
    this.taxaImpostoComercial = 1.0;
    this.taxaImpostoIndustrial = 1.0;

    this.receitaUltimoCiclo = 0;
    this.despesaUltimoCiclo = 0;
    this.totalArrecadado = 0;
    this.totalGasto = 0;

    this.historicoTransacoes = [];
  }

  definirPoliticaFiscal(politica) {
    this.politicaFiscal = politica;
    if (politica === "baixa") {
      this.taxaImpostoResidencial = 0.7;
      this.taxaImpostoComercial = 0.7;
      this.taxaImpostoIndustrial = 0.7;
    } else if (politica === "alta") {
      this.taxaImpostoResidencial = 1.5;
      this.taxaImpostoComercial = 1.5;
      this.taxaImpostoIndustrial = 1.5;
    } else {
      this.taxaImpostoResidencial = 1.0;
      this.taxaImpostoComercial = 1.0;
      this.taxaImpostoIndustrial = 1.0;
    }
  }

  podeGastar(valor) {
    return this.saldo >= valor;
  }

  gastar(valor, descricao, categoria = "geral") {
    if (valor <= 0) return true;
    if (!this.podeGastar(valor)) {
      return false;
    }

    this.saldo -= valor;
    this.totalGasto += valor;
    this._registrarTransacao({
      tipo: "despesa",
      valor,
      descricao,
      categoria,
    });
    return true;
  }

  adicionarReceita(valor, descricao, categoria = "impostos") {
    if (valor <= 0) return;
    this.saldo += valor;
    this.totalArrecadado += valor;
    this._registrarTransacao({
      tipo: "receita",
      valor,
      descricao,
      categoria,
    });
  }

  calcularReceitaPrevista(edificios, habitantes) {
    let residencial = 0;
    let comercial = 0;
    let industrial = 0;
    let outros = 0;

    const multReceita = this.multiplicadorDificuldadeReceita;

    for (const bld of edificios) {
      if (bld.categoria === "residencial") {
        residencial += bld.calcularReceita(this.taxaImpostoResidencial * multReceita);
      } else if (bld.categoria === "comercial") {
        comercial += bld.calcularReceita(this.taxaImpostoComercial * multReceita);
      } else if (bld.categoria === "industrial") {
        industrial += bld.calcularReceita(this.taxaImpostoIndustrial * multReceita);
      } else {
        outros += bld.calcularReceita(1.0 * multReceita);
      }
    }

    let cidadaos = 0;
    const taxaCidadao = (this.politicaFiscal === "baixa" ? 0.03 : this.politicaFiscal === "alta" ? 0.07 : 0.05) * multReceita;
    for (const hab of habitantes) {
      cidadaos += hab.pagarImposto(taxaCidadao);
    }

    const total = residencial + comercial + industrial + outros + cidadaos;
    return {
      total,
      residencial,
      comercial,
      industrial,
      outros,
      cidadaos,
    };
  }

  calcularDespesaPrevista(edificios) {
    let total = 0;
    const multDespesa = this.multiplicadorDificuldadeDespesa;
    for (const bld of edificios) {
      total += Math.round(bld.calcularManutencao() * multDespesa);
    }
    return total;
  }

  obterBalancoMensal(edificios, habitantes) {
    const projReceita = this.calcularReceitaPrevista(edificios, habitantes);
    const projDespesa = this.calcularDespesaPrevista(edificios);
    return {
      receitaMensal: projReceita.total,
      despesaMensal: projDespesa,
      balancoLiquido: projReceita.total - projDespesa,
    };
  }

  processarCiclo(edificios, habitantes) {
    const projReceita = this.calcularReceitaPrevista(edificios, habitantes);
    const receita = projReceita.total;
    const despesa = this.calcularDespesaPrevista(edificios);

    this.receitaUltimoCiclo = receita;
    this.despesaUltimoCiclo = despesa;

    if (receita > 0) {
      this.saldo += receita;
      this.totalArrecadado += receita;
      this._registrarTransacao({
        tipo: "receita",
        valor: receita,
        descricao: `Arrecadação mensal tributária (Residencial: R$${projReceita.residencial}, Comercial: R$${projReceita.comercial}, Industrial: R$${projReceita.industrial})`,
        categoria: "impostos",
      });
    }

    if (despesa > 0) {
      this.saldo -= despesa;
      this.totalGasto += despesa;
      this._registrarTransacao({
        tipo: "despesa",
        valor: despesa,
        descricao: "Manutenção de serviços e estruturas municipais",
        categoria: "manutencao",
      });
    }

    return {
      receita,
      despesa,
      balanco: receita - despesa,
      saldoFinal: this.saldo,
    };
  }

  _registrarTransacao(transacao) {
    this.historicoTransacoes.unshift({
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ...transacao,
      data: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    });

    if (this.historicoTransacoes.length > 50) {
      this.historicoTransacoes.pop();
    }
  }

  toJSON() {
    return {
      saldo: this.saldo,
      dificuldade: this.dificuldade,
      politicaFiscal: this.politicaFiscal,
      taxaImpostoResidencial: this.taxaImpostoResidencial,
      taxaImpostoComercial: this.taxaImpostoComercial,
      taxaImpostoIndustrial: this.taxaImpostoIndustrial,
      receitaUltimoCiclo: this.receitaUltimoCiclo,
      despesaUltimoCiclo: this.despesaUltimoCiclo,
      totalArrecadado: this.totalArrecadado,
      totalGasto: this.totalGasto,
      historicoTransacoes: this.historicoTransacoes.slice(0, 20),
    };
  }

  static fromJSON(data) {
    const fin = new SistemaFinanceiro({
      saldoInicial: data.saldo ?? 100000,
      dificuldade: data.dificuldade || "normal",
    });
    fin.politicaFiscal = data.politicaFiscal || "normal";
    fin.taxaImpostoResidencial = data.taxaImpostoResidencial ?? 1.0;
    fin.taxaImpostoComercial = data.taxaImpostoComercial ?? 1.0;
    fin.taxaImpostoIndustrial = data.taxaImpostoIndustrial ?? 1.0;
    fin.receitaUltimoCiclo = data.receitaUltimoCiclo ?? 0;
    fin.despesaUltimoCiclo = data.despesaUltimoCiclo ?? 0;
    fin.totalArrecadado = data.totalArrecadado ?? 0;
    fin.totalGasto = data.totalGasto ?? 0;
    fin.historicoTransacoes = Array.isArray(data.historicoTransacoes)
      ? data.historicoTransacoes
      : [];
    return fin;
  }
}
