import { Edificio, CATALOGO_EDIFICIOS } from "./Edificio.js";

export class SistemaConstrucao {
  constructor() {
    this.catalogo = CATALOGO_EDIFICIOS;
  }

  obterDefinicao(nome) {
    return this.catalogo[nome] || null;
  }

  validarConstrucao(cidade, nomeEdificio, x, y) {
    const definicao = this.obterDefinicao(nomeEdificio);
    if (!definicao) {
      return { valido: false, motivo: "Tipo de edifício não encontrado no catálogo.", custo: 0 };
    }

    if (x < 0 || x >= cidade.tamanho || y < 0 || y >= cidade.tamanho) {
      return { valido: false, motivo: "Coordenadas fora dos limites do mapa.", custo: definicao.custo };
    }

    const tile = cidade.obterTile(x, y);
    if (!tile) {
      return { valido: false, motivo: "Terreno inválido.", custo: definicao.custo };
    }

    if (tile.building) {
      return { valido: false, motivo: "Já existe uma construção neste local.", custo: definicao.custo };
    }

    if (tile.type === "water") {
      if (nomeEdificio !== "Ponte") {
        return { valido: false, motivo: "Apenas pontes podem ser construídas sobre a água.", custo: definicao.custo };
      }
    } else if (nomeEdificio === "Ponte") {
      return { valido: false, motivo: "Pontes só podem ser construídas sobre a água.", custo: definicao.custo };
    }

    if (!cidade.financeiro.podeGastar(definicao.custo)) {
      return {
        valido: false,
        motivo: `Tesouro insuficiente! Necessário R$ ${definicao.custo.toLocaleString("pt-BR")}.`,
        custo: definicao.custo,
      };
    }

    return { valido: true, custo: definicao.custo };
  }

  construir(cidade, nomeEdificio, x, y, rotacao = 0) {
    const validacao = this.validarConstrucao(cidade, nomeEdificio, x, y);
    if (!validacao.valido) {
      return { sucesso: false, motivo: validacao.motivo };
    }

    const definicao = this.obterDefinicao(nomeEdificio);

    const gastou = cidade.financeiro.gastar(
      definicao.custo,
      `Construção: ${nomeEdificio} em (${x}, ${y})`,
      "construcao"
    );

    if (!gastou) {
      return { sucesso: false, motivo: "Fundos insuficientes para construir." };
    }

    const novoEdificio = new Edificio({ nome: nomeEdificio, x, y, rotacao });

    const tile = cidade.obterTile(x, y);
    tile.building = novoEdificio;

    cidade.edificios.push(novoEdificio);

    cidade.recalcularRecursos();
    cidade.populacao.distribuirMoradias(cidade.edificios);
    cidade.populacao.distribuirEmpregos(cidade.edificios);

    cidade.adicionarNotificacao(
      `Construção concluída: ${nomeEdificio} em (${x}, ${y}).`,
      "sucesso"
    );

    return { sucesso: true, edificio: novoEdificio };
  }

  demolir(cidade, x, y) {
    const tile = cidade.obterTile(x, y);
    if (!tile || !tile.building) {
      return { sucesso: false, motivo: "Não há nenhum edifício para demolir neste local." };
    }

    const edificio = tile.building;

    cidade.populacao.lidarComEdificioDemolido(edificio);

    const index = cidade.edificios.findIndex((b) => b.id === edificio.id);
    if (index !== -1) {
      cidade.edificios.splice(index, 1);
    }

    tile.building = null;

    const reembolso = Math.round(edificio.custoConstrucao * 0.4);
    if (reembolso > 0) {
      cidade.financeiro.adicionarReceita(
        reembolso,
        `Reembolso de demolição: ${edificio.nome}`,
        "reembolso"
      );
    }

    cidade.recalcularRecursos();

    cidade.adicionarNotificacao(
      `Edifício demolido: ${edificio.nome}. Reembolsado R$ ${reembolso.toLocaleString("pt-BR")}.`,
      "alerta"
    );

    return { sucesso: true, reembolso, edificioRemovido: edificio };
  }

  melhorar(cidade, x, y) {
    const tile = cidade.obterTile(x, y);
    if (!tile || !tile.building) {
      return { sucesso: false, motivo: "Nenhum edifício selecionado para melhoria." };
    }

    const edificio = tile.building;
    const custoUpgrade = Math.round(edificio.custoConstrucao * 0.7 * edificio.nivel);

    if (!cidade.financeiro.podeGastar(custoUpgrade)) {
      return {
        sucesso: false,
        motivo: `Fundos insuficientes para upgrade (R$ ${custoUpgrade.toLocaleString("pt-BR")}).`,
      };
    }

    cidade.financeiro.gastar(
      custoUpgrade,
      `Melhoria de ${edificio.nome} para Nível ${edificio.nivel + 1}`,
      "upgrade"
    );

    edificio.fazerUpgrade();
    cidade.recalcularRecursos();

    cidade.adicionarNotificacao(
      `${edificio.nome} evoluiu para o Nível ${edificio.nivel}!`,
      "sucesso"
    );

    return { sucesso: true, novoNivel: edificio.nivel };
  }
}
