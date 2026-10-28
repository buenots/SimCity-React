import { Habitante } from "./Habitante.js";

export class SistemaPopulacao {
  constructor() {
    this.habitantes = new Map();
    this.historicoPopulacao = [];
  }

  get total() {
    return this.habitantes.size;
  }

  obterLista() {
    return Array.from(this.habitantes.values());
  }

  obterPorId(id) {
    return this.habitantes.get(id) || null;
  }

  obterMoradoresDe(edificioId) {
    const res = [];
    for (const h of this.habitantes.values()) {
      if (h.moradiaId === edificioId) {
        res.push(h);
      }
    }
    return res;
  }

  obterTrabalhadoresDe(edificioId) {
    const res = [];
    for (const h of this.habitantes.values()) {
      if (h.trabalhoId === edificioId) {
        res.push(h);
      }
    }
    return res;
  }

  adicionarHabitante(habitante) {
    this.habitantes.set(habitante.id, habitante);
  }

  removerHabitante(habitanteId) {
    const hab = this.habitantes.get(habitanteId);
    if (!hab) return false;
    this.habitantes.delete(habitanteId);
    return true;
  }

  calcularMediaFelicidade() {
    if (this.habitantes.size === 0) return 65;
    let soma = 0;
    for (const h of this.habitantes.values()) {
      soma += h.felicidade;
    }
    return Math.round(soma / this.habitantes.size);
  }

  calcularEstatisticasEmprego(edificios) {
    let empregados = 0;
    for (const h of this.habitantes.values()) {
      if (h.estaEmpregado()) empregados++;
    }

    const total = this.habitantes.size;
    const desempregados = Math.max(0, total - empregados);
    const taxaDesemprego = total > 0 ? desempregados / total : 0;

    let capacidadeTotalEmpregos = 0;
    let vagasDisponiveis = 0;
    for (const bld of edificios) {
      capacidadeTotalEmpregos += bld.capacidadeEmpregos;
      vagasDisponiveis += bld.vagasEmpregoDisponiveis();
    }

    return {
      totalEmpregados: empregados,
      totalDesempregados: desempregados,
      taxaDesemprego,
      vagasDisponiveis,
      capacidadeTotalEmpregos,
    };
  }

  calcularEstatisticasMoradia(edificios) {
    let capacidadeTotalMoradia = 0;
    let vagasMoradia = 0;

    for (const bld of edificios) {
      capacidadeTotalMoradia += bld.capacidadeHabitantes;
      vagasMoradia += bld.vagasMoradiaDisponiveis();
    }

    let comCasa = 0;
    for (const h of this.habitantes.values()) {
      if (h.temMoradia()) comCasa++;
    }

    return {
      capacidadeTotalMoradia,
      vagasMoradia,
      desabrigados: Math.max(0, this.habitantes.size - comCasa),
    };
  }

  distribuirMoradias(edificios) {
    const residenciasLivres = edificios.filter(
      (b) => b.categoria === "residencial" && b.temVagaMoradia()
    );

    let idx = 0;
    for (const h of this.habitantes.values()) {
      if (!h.temMoradia() && residenciasLivres.length > 0) {
        const casa = residenciasLivres[idx % residenciasLivres.length];
        if (casa.adicionarMorador(h.id)) {
          h.definirMoradia(casa.id, { x: casa.x, y: casa.y });
          if (!casa.temVagaMoradia()) {
            residenciasLivres.splice(idx % residenciasLivres.length, 1);
            if (residenciasLivres.length === 0) break;
          }
        }
        idx++;
      }
    }
  }

  distribuirEmpregos(edificios) {
    const postosComVagas = edificios.filter((b) => b.temVagaEmprego());

    let idx = 0;
    for (const h of this.habitantes.values()) {
      if (!h.estaEmpregado() && postosComVagas.length > 0) {
        const local = postosComVagas[idx % postosComVagas.length];
        if (local.adicionarTrabalhador(h.id)) {
          h.definirTrabalho(local.id, local.nome, { x: local.x, y: local.y });
          if (!local.temVagaEmprego()) {
            postosComVagas.splice(idx % postosComVagas.length, 1);
            if (postosComVagas.length === 0) break;
          }
        }
        idx++;
      }
    }
  }

  processarCiclo({ edificios, temEnergia, temAgua, bonusFelicidadeCidade = 0, taxaImposto = 1.0 }) {
    this.distribuirMoradias(edificios);
    this.distribuirEmpregos(edificios);

    const statMoradia = this.calcularEstatisticasMoradia(edificios);
    const statEmprego = this.calcularEstatisticasEmprego(edificios);
    const mediaFelicidade = this.calcularMediaFelicidade();

    if (statMoradia.vagasMoradia > 0 && temEnergia && temAgua && mediaFelicidade >= 40) {
      let atratividade = 1.0;
      if (mediaFelicidade >= 75) atratividade += 0.5;
      if (statEmprego.vagasDisponiveis > 0) atratividade += 0.5;
      if (taxaImposto < 0.8) atratividade += 0.3;
      else if (taxaImposto > 1.3) atratividade -= 0.4;

      const residenciasComVaga = edificios.filter(
        (b) => b.categoria === "residencial" && b.temVagaMoradia()
      );

      const qtdNovos = Math.random() < (0.5 * atratividade) ? 1 : (mediaFelicidade >= 80 && Math.random() < 0.3 ? 2 : 0);

      for (let i = 0; i < qtdNovos; i++) {
        if (residenciasComVaga.length === 0) break;
        const casaEscolhida = residenciasComVaga[Math.floor(Math.random() * residenciasComVaga.length)];
        const novoHabitante = new Habitante();
        novoHabitante.origemX = casaEscolhida.x;
        novoHabitante.origemY = casaEscolhida.y;
        novoHabitante.posX = casaEscolhida.x;
        novoHabitante.posY = casaEscolhida.y;
        novoHabitante.destinoX = casaEscolhida.x;
        novoHabitante.destinoY = casaEscolhida.y;

        this.adicionarHabitante(novoHabitante);

        if (casaEscolhida.adicionarMorador(novoHabitante.id)) {
          novoHabitante.definirMoradia(casaEscolhida.id, { x: casaEscolhida.x, y: casaEscolhida.y });
          if (!casaEscolhida.temVagaMoradia()) {
            const idxCasa = residenciasComVaga.indexOf(casaEscolhida);
            if (idxCasa !== -1) residenciasComVaga.splice(idxCasa, 1);
          }
        }
      }

      this.distribuirEmpregos(edificios);
    }

    if (mediaFelicidade < 30 || !temEnergia || !temAgua) {
      const lista = this.obterLista();
      for (const h of lista) {
        if (h.felicidade < 18 || (!h.temMoradia() && Math.random() < 0.3)) {
          if (h.moradiaId) {
            const casa = edificios.find((b) => b.id === h.moradiaId);
            if (casa) casa.removerMorador(h.id);
          }
          if (h.trabalhoId) {
            const trab = edificios.find((b) => b.id === h.trabalhoId);
            if (trab) trab.removerTrabalhador(h.id);
          }
          this.removerHabitante(h.id);
        }
      }
    }

    for (const h of this.habitantes.values()) {
      h.atualizarNecessidades({
        temEnergia,
        temAgua,
        bonusFelicidadeCidade,
        taxaDesemprego: statEmprego.taxaDesemprego,
        taxaImposto,
      });
      h.envelhecer();
    }

    this.historicoPopulacao.push(this.total);
    if (this.historicoPopulacao.length > 30) {
      this.historicoPopulacao.shift();
    }
  }

  lidarComEdificioDemolido(edificio) {
    const { moradores, trabalhadores } = edificio.desocupar();

    for (const moradorId of moradores) {
      const h = this.habitantes.get(moradorId);
      if (h) {
        h.desalojar();
      }
    }

    for (const trabalhadorId of trabalhadores) {
      const h = this.habitantes.get(trabalhadorId);
      if (h) {
        h.demitir();
      }
    }
  }

  toJSON() {
    return {
      habitantes: Array.from(this.habitantes.values()).map((h) => h.toJSON()),
      historicoPopulacao: this.historicoPopulacao,
    };
  }

  static fromJSON(data) {
    const sys = new SistemaPopulacao();
    if (Array.isArray(data.habitantes)) {
      for (const hData of data.habitantes) {
        const hab = Habitante.fromJSON(hData);
        sys.adicionarHabitante(hab);
      }
    }
    sys.historicoPopulacao = Array.isArray(data.historicoPopulacao)
      ? data.historicoPopulacao
      : [];
    return sys;
  }
}
