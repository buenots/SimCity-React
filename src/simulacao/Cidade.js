import { Edificio } from "./Edificio.js";
import { SistemaFinanceiro } from "./SistemaFinanceiro.js";
import { SistemaPopulacao } from "./SistemaPopulacao.js";
import { SistemaConstrucao } from "./SistemaConstrucao.js";

const NOMES_MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Noivembro", "Dezembro"
];

export function gerarTerrenoPadrao(tamanho = 24, tipoMapa = "planicie") {
  const grid = [];
  for (let y = 0; y < tamanho; y++) {
    const row = [];
    for (let x = 0; x < tamanho; x++) {
      let type = "grass";

      if (tipoMapa === "litoral") {
        if (x > tamanho - 6) type = "water";
        else if (x > tamanho - 8) type = "sand";
      } else if (tipoMapa === "deserto") {
        type = "sand";
        if (x === Math.floor(tamanho / 2) && y === Math.floor(tamanho / 2)) type = "water";
      } else if (tipoMapa === "montanha") {
        if ((x < 4 && y < 4) || (x > tamanho - 5 && y > tamanho - 5)) type = "stone";
        else if (x + y === Math.floor(tamanho * 0.9)) type = "water";
      } else {
        if (Math.abs(x - y) <= 1 && x > 2 && x < tamanho - 3) {
          type = "water";
        }
      }

      const pseudoRand = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const randVal = pseudoRand - Math.floor(pseudoRand);

      let detail = null;
      if (type === "grass" && randVal > 0.82) {
        detail = "tree";
      } else if (type === "stone" && randVal > 0.7) {
        detail = "rock";
      }

      row.push({
        x,
        y,
        type,
        detail,
        building: null,
      });
    }
    grid.push(row);
  }
  return grid;
}

export class Cidade {
  constructor({
    nome = "Nova Esperança",
    prefeito = "Prefeito",
    tipoMapa = "planicie",
    tamanho = 24,
    saldoInicial = 100000,
    dificuldade = "normal",
  } = {}) {
    this.nome = nome;
    this.prefeito = prefeito;
    this.tipoMapa = tipoMapa;
    this.tamanho = Math.max(16, Math.min(48, tamanho));
    this.dificuldade = dificuldade;

    this.dia = 1;
    this.mesIndex = 0;
    this.ano = 2045;
    this.ciclo = 0;
    this.velocidade = 1;

    this.mapa = gerarTerrenoPadrao(this.tamanho, tipoMapa);
    this.edificios = [];

    this.financeiro = new SistemaFinanceiro({ saldoInicial, dificuldade });
    this.populacao = new SistemaPopulacao();
    this.construcao = new SistemaConstrucao();

    this.recursos = {
      energiaProduzida: 0,
      energiaConsumida: 0,
      aguaProduzida: 0,
      aguaConsumida: 0,
      energiaPorcentagem: 100,
      aguaPorcentagem: 100,
      bonusFelicidadeTotal: 0,
      saldoMensalProjetado: 0,
    };

    this.felicidadeGeral = 65;
    this.notificacoes = [];

    this.adicionarNotificacao(`Cidade fundada por ${this.prefeito}! Verba inicial: R$ ${saldoInicial.toLocaleString("pt-BR")}.`, "info");
    this.recalcularRecursos();
  }

  definirVelocidade(vel) {
    this.velocidade = vel;
  }

  definirPoliticaFiscal(politica) {
    this.financeiro.definirPoliticaFiscal(politica);
    this.adicionarNotificacao(`Política fiscal ajustada para: ${politica.toUpperCase()}.`, "info");
  }

  obterTile(x, y) {
    if (x < 0 || x >= this.tamanho || y < 0 || y >= this.tamanho) return null;
    return this.mapa[y]?.[x] || null;
  }

  obterEdificio(x, y) {
    const tile = this.obterTile(x, y);
    return tile ? tile.building : null;
  }

  construir(nomeEdificio, x, y, rotacao = 0) {
    return this.construcao.construir(this, nomeEdificio, x, y, rotacao);
  }

  demolir(x, y) {
    return this.construcao.demolir(this, x, y);
  }

  melhorarEdificio(x, y) {
    return this.construcao.melhorar(this, x, y);
  }

  recalcularRecursos() {
    let energiaProd = 0;
    let energiaCons = 0;
    let aguaProd = 0;
    let aguaCons = 0;
    let bonusFelicidadeTotal = 0;

    for (const bld of this.edificios) {
      energiaProd += bld.producaoEnergia;
      energiaCons += bld.consumoEnergia;
      aguaProd += bld.producaoAgua;
      aguaCons += bld.consumoAgua;
      bonusFelicidadeTotal += bld.bonusFelicidade || 0;
    }

    const energiaPorcentagem =
      energiaCons === 0
        ? (energiaProd > 0 ? 100 : 100)
        : Math.min(100, Math.round((energiaProd / energiaCons) * 100));

    const aguaPorcentagem =
      aguaCons === 0
        ? (aguaProd > 0 ? 100 : 100)
        : Math.min(100, Math.round((aguaProd / aguaCons) * 100));

    const temEnergiaSuficiente = energiaCons === 0 || energiaProd >= energiaCons;
    const temAguaSuficiente = aguaCons === 0 || aguaProd >= aguaCons;

    for (const bld of this.edificios) {
      bld.temEnergia = temEnergiaSuficiente;
      bld.temAgua = temAguaSuficiente;
    }

    const balanco = this.financeiro.obterBalancoMensal(this.edificios, this.populacao.obterLista());

    this.recursos = {
      energiaProduzida: energiaProd,
      energiaConsumida: energiaCons,
      aguaProduzida: aguaProd,
      aguaConsumida: aguaCons,
      energiaPorcentagem,
      aguaPorcentagem,
      bonusFelicidadeTotal,
      saldoMensalProjetado: balanco.balancoLiquido,
      receitaMensalProjetada: balanco.receitaMensal,
      despesaMensalProjetada: balanco.despesaMensal,
    };
  }

  adicionarNotificacao(mensagem, tipo = "info") {
    this.notificacoes.unshift({
      id: `notif_${Date.now()}_${Math.random()}`,
      mensagem,
      tipo,
      hora: this.obterDataFormatada(),
    });

    if (this.notificacoes.length > 20) {
      this.notificacoes.pop();
    }
  }

  atualizar() {
    if (this.velocidade === 0) return;

    this.ciclo += 1;
    this.dia += 1;

    const mudouMes = this.dia > 30;
    if (mudouMes) {
      this.dia = 1;
      this.mesIndex += 1;
      if (this.mesIndex >= 12) {
        this.mesIndex = 0;
        this.ano += 1;
        this.adicionarNotificacao(`Feliz Ano Novo! Bem-vindo a ${this.ano}.`, "info");
      }
    }

    this.recalcularRecursos();

    const temEnergia = this.recursos.energiaConsumida === 0 || this.recursos.energiaProduzida >= this.recursos.energiaConsumida;
    const temAgua = this.recursos.aguaConsumida === 0 || this.recursos.aguaProduzida >= this.recursos.aguaConsumida;

    if (!temEnergia && this.recursos.energiaConsumida > 0 && this.dia === 15) {
      this.adicionarNotificacao("Alerta de Apagão! A demanda por eletricidade supera a capacidade da cidade.", "alerta");
    }
    if (!temAgua && this.recursos.aguaConsumida > 0 && this.dia === 20) {
      this.adicionarNotificacao("Crise Hídrica! A cidade está sem água encanada suficiente.", "alerta");
    }

    if (this.dia % 3 === 0 || mudouMes) {
      this.populacao.processarCiclo({
        edificios: this.edificios,
        temEnergia,
        temAgua,
        bonusFelicidadeCidade: this.recursos.bonusFelicidadeTotal,
        taxaImposto: this.financeiro.taxaImpostoResidencial,
      });

      if (mudouMes) {
        const resultadoFin = this.financeiro.processarCiclo(this.edificios, this.populacao.obterLista());
        if (resultadoFin.balanco < 0) {
          this.adicionarNotificacao(`Fechamento mensal em déficit: -R$ ${Math.abs(resultadoFin.balanco).toLocaleString("pt-BR")}.`, "alerta");
        } else if (resultadoFin.balanco > 0) {
          this.adicionarNotificacao(`Superávit mensal arrecadado: +R$ ${resultadoFin.balanco.toLocaleString("pt-BR")}.`, "sucesso");
        }
      }
    }

    let fel = this.populacao.calcularMediaFelicidade();
    if (!temEnergia && this.recursos.energiaConsumida > 0) fel -= 22;
    if (!temAgua && this.recursos.aguaConsumida > 0) fel -= 28;
    fel += Math.min(18, Math.max(-15, this.recursos.bonusFelicidadeTotal));

    this.felicidadeGeral = Math.max(0, Math.min(100, Math.round(fel)));
  }

  obterDataFormatada() {
    const nomeMes = NOMES_MESES[this.mesIndex] || "Janeiro";
    return `${this.dia} de ${nomeMes}, ${this.ano}`;
  }

  obterEstatisticas() {
    let contagemCasas = 0;
    let contagemComercios = 0;
    let contagemIndustrias = 0;
    let contagemServicos = 0;
    let contagemInfra = 0;

    for (const bld of this.edificios) {
      if (bld.categoria === "residencial") contagemCasas++;
      else if (bld.categoria === "comercial") contagemComercios++;
      else if (bld.categoria === "industrial") contagemIndustrias++;
      else if (bld.categoria === "servicos") contagemServicos++;
      else if (bld.categoria === "infraestrutura") contagemInfra++;
    }

    const statEmprego = this.populacao.calcularEstatisticasEmprego(this.edificios);
    const statMoradia = this.populacao.calcularEstatisticasMoradia(this.edificios);

    return {
      cityName: this.nome,
      prefeito: this.prefeito,
      date: this.obterDataFormatada(),
      money: this.financeiro.saldo,
      population: this.populacao.total,
      happiness: this.felicidadeGeral,
      electricity: this.recursos.energiaPorcentagem,
      electricityProd: this.recursos.energiaProduzida,
      electricityCons: this.recursos.energiaConsumida,
      water: this.recursos.aguaPorcentagem,
      waterProd: this.recursos.aguaProduzida,
      waterCons: this.recursos.aguaConsumida,
      casas: contagemCasas,
      comercios: contagemComercios,
      industrias: contagemIndustrias,
      servicos: contagemServicos,
      infraestrutura: contagemInfra,
      empregos: statEmprego.totalEmpregados,
      vagasEmprego: statEmprego.vagasDisponiveis,
      capacidadeTotalEmpregos: statEmprego.capacidadeTotalEmpregos,
      taxaDesemprego: (statEmprego.taxaDesemprego * 100).toFixed(1) + "%",
      capacidadeMoradia: statMoradia.capacidadeTotalMoradia,
      vagasMoradia: statMoradia.vagasMoradia,
      desabrigados: statMoradia.desabrigados,
      receitaUltimoMes: this.financeiro.receitaUltimoCiclo,
      despesaUltimoMes: this.financeiro.despesaUltimoCiclo,
      saldoMensalProjetado: this.recursos.saldoMensalProjetado,
      politicaFiscal: this.financeiro.politicaFiscal,
    };
  }

  toJSON() {
    return {
      nome: this.nome,
      prefeito: this.prefeito,
      tipoMapa: this.tipoMapa,
      tamanho: this.tamanho,
      dificuldade: this.dificuldade,
      dia: this.dia,
      mesIndex: this.mesIndex,
      ano: this.ano,
      ciclo: this.ciclo,
      financeiro: this.financeiro.toJSON(),
      populacao: this.populacao.toJSON(),
      edificios: this.edificios.map((b) => b.toJSON()),
      mapa: this.mapa.map((row) =>
        row.map((tile) => ({
          x: tile.x,
          y: tile.y,
          type: tile.type,
          detail: tile.detail,
          buildingId: tile.building ? tile.building.id : null,
        }))
      ),
    };
  }

  static fromJSON(data) {
    const cidade = new Cidade({
      nome: data.nome,
      prefeito: data.prefeito,
      tipoMapa: data.tipoMapa,
      tamanho: data.tamanho,
      dificuldade: data.dificuldade || "normal",
      saldoInicial: 0,
    });

    cidade.dia = data.dia ?? 1;
    cidade.mesIndex = data.mesIndex ?? 0;
    cidade.ano = data.ano ?? 2045;
    cidade.ciclo = data.ciclo ?? 0;

    cidade.financeiro = SistemaFinanceiro.fromJSON(data.financeiro);
    cidade.populacao = SistemaPopulacao.fromJSON(data.populacao);

    const edificiosMap = new Map();
    if (Array.isArray(data.edificios)) {
      cidade.edificios = data.edificios.map((bData) => {
        const bld = Edificio.fromJSON(bData);
        edificiosMap.set(bld.id, bld);
        return bld;
      });
    }

    if (Array.isArray(data.mapa)) {
      cidade.mapa = data.mapa.map((row) =>
        row.map((tile) => ({
          x: tile.x,
          y: tile.y,
          type: tile.type,
          detail: tile.detail,
          building: tile.buildingId ? edificiosMap.get(tile.buildingId) || null : null,
        }))
      );
    }

    cidade.recalcularRecursos();
    return cidade;
  }
}
