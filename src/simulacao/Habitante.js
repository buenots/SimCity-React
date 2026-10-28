const PRIMEIROS_NOMES_M = [
  "Lucas", "Gabriel", "Pedro", "Matheus", "Rodrigo", "Rafael", "Felipe", "Gustavo",
  "Bruno", "Thiago", "Diego", "Leonardo", "André", "Carlos", "Marcos", "Eduardo",
  "Vitor", "João", "Enzo", "Arthur", "Samuel", "Guilherme", "Bernardo", "Caio"
];

const PRIMEIROS_NOMES_F = [
  "Walleysson", "Mariana", "Beatriz", "Juliana", "Camila", "Larissa", "Amanda", "Fernanda",
  "Carla", "Letícia", "Bruna", "Patrícia", "Vanessa", "Aline", "Renata", "Helena",
  "Daniela", "Sofia", "Valentina", "Alice", "Laura", "Isabela", "Salete", "Bruno"
];

const SOBRENOMES = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira",
  "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes",
  "Soares", "Fernandes", "Vieira", "Barbosa", "Rocha", "Dias", "Nascimento", "Andrade",
  "Moreira", "Nunes", "Marques", "Machado", "Mendes", "Freitas", "Cardoso", "Gustavo"
];

const CORES_ROUPA = [
  "#38bdf8", "#f43f5e", "#10b981", "#f59e0b", "#a855f7",
  "#06b6d4", "#ec4899", "#84cc16", "#eab308", "#6366f1"
];

const PROFISSOES_MAPA = {
  "Loja": ["Vendedor(a)", "Caixa", "Gerente Comercial"],
  "Mercado": ["Atendente", "Repositor(a)", "Operador(a) de Caixa"],
  "Shopping": ["Lojista", "Supervisor(a) de Vendas", "Atendente de Praça"],
  "Fábrica Pequena": ["Operário(a)", "Montador(a)", "Auxiliar de Produção"],
  "Fábrica Grande": ["Operador(a) Industrial", "Técnico(a) de Manutenção", "Engenheiro(a)"],
  "Usina": ["Técnico(a) em Eletricidade", "Operador(a) de Usina", "Engenheiro(a) Eletricista"],
  "Escola": ["Professor(a)", "Pedagogo(a)", "Coordenador(a)"],
  "Hospital": ["Médico(a)", "Enfermeiro(a)", "Socorrista"],
  "Delegacia": ["Policial Civil", "Investigador(a)", "Agente de Segurança"],
  "Bombeiros": ["Bombeiro(a)", "Resgatista", "Socorrista"],
  "Estação de Ônibus": ["Motorista de Transporte", "Fiscal de Frota"],
  "Praça": ["Jardineiro(a)", "Guarda de Parque"],
  "Igreja": ["Assistente Social", "Coordenador(a) Comunitário"],
};

export class Habitante {
  constructor({ nome, idade, genero, moradiaId = null, trabalhoId = null, id = null } = {}) {
    this.id = id || `cit_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

    this.genero = genero || (Math.random() > 0.5 ? "m" : "f");

    if (nome) {
      this.nome = nome;
    } else {
      const listaP = this.genero === "m" ? PRIMEIROS_NOMES_M : PRIMEIROS_NOMES_F;
      const p = listaP[Math.floor(Math.random() * listaP.length)];
      const s = SOBRENOMES[Math.floor(Math.random() * SOBRENOMES.length)];
      this.nome = `${p} ${s}`;
    }

    this.idade = idade !== undefined ? idade : Math.floor(Math.random() * 42) + 18;
    this.corRoupa = CORES_ROUPA[Math.floor(Math.random() * CORES_ROUPA.length)];

    this.felicidade = 68;
    this.saude = 85;
    this.educacao = 50;

    this.moradiaId = moradiaId;
    this.trabalhoId = trabalhoId;
    this.profissao = "Desempregado(a)";
    this.salario = 0;

    this.origemX = 0;
    this.origemY = 0;
    this.destinoX = 0;
    this.destinoY = 0;

    let hash = 0;
    for (let i = 0; i < this.id.length; i++) {
      hash = (hash << 5) - hash + this.id.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    this.offsetTempo = (seed % 1000) / 75;
    this.velocidade = 0.08 + (seed % 7) * 0.015;
    this.offsetLateralX = ((seed % 5) - 2) * 0.06;
    this.offsetLateralY = (((seed >> 3) % 5) - 2) * 0.06;

    this.diasVividos = 0;
  }

  temMoradia() {
    return Boolean(this.moradiaId);
  }

  estaEmpregado() {
    return Boolean(this.trabalhoId);
  }

  definirMoradia(moradiaId, coords = null) {
    this.moradiaId = moradiaId;
    this.felicidade = Math.min(100, this.felicidade + 12);
    if (coords) {
      this.origemX = coords.x;
      this.origemY = coords.y;
      if (!this.trabalhoId) {
        this.destinoX = coords.x;
        this.destinoY = coords.y;
      }
    }
  }

  desalojar() {
    this.moradiaId = null;
    this.felicidade = Math.max(5, this.felicidade - 30);
  }

  definirTrabalho(trabalhoId, nomeEdificio = "", coords = null, salario = null) {
    this.trabalhoId = trabalhoId;
    this.salario = salario || Math.floor(Math.random() * 2200) + 1500;
    this.felicidade = Math.min(100, this.felicidade + 15);

    const listaProf = PROFISSOES_MAPA[nomeEdificio] || ["Trabalhador(a) Urbano"];
    this.profissao = listaProf[Math.floor(Math.random() * listaProf.length)];

    if (coords) {
      this.destinoX = coords.x;
      this.destinoY = coords.y;
    }
  }

  demitir() {
    this.trabalhoId = null;
    this.salario = 0;
    if (this.idade >= 65) {
      this.profissao = "Aposentado(a)";
    } else if (this.idade < 21) {
      this.profissao = "Estudante";
    } else {
      this.profissao = "Desempregado(a)";
    }
    this.destinoX = this.origemX;
    this.destinoY = this.origemY;
    this.felicidade = Math.max(10, this.felicidade - 25);
  }

  atualizarNecessidades({ temEnergia, temAgua, bonusFelicidadeCidade = 0, taxaDesemprego = 0, taxaImposto = 1.0 }) {
    let metaFelicidade = 60;

    if (this.temMoradia()) {
      metaFelicidade += 15;
    } else {
      metaFelicidade -= 35;
    }

    if (this.estaEmpregado()) {
      metaFelicidade += 15;
    } else {
      metaFelicidade -= 25;
    }

    if (temEnergia) {
      metaFelicidade += 10;
    } else {
      metaFelicidade -= 30;
    }

    if (temAgua) {
      metaFelicidade += 10;
    } else {
      metaFelicidade -= 35;
    }

    metaFelicidade += Math.max(-15, Math.min(20, bonusFelicidadeCidade));

    if (taxaDesemprego > 0.25) {
      metaFelicidade -= 15;
    } else if (taxaDesemprego < 0.08) {
      metaFelicidade += 8;
    }

    if (taxaImposto > 1.3) {
      metaFelicidade -= 12;
    } else if (taxaImposto < 0.8) {
      metaFelicidade += 8;
    }

    metaFelicidade = Math.max(0, Math.min(100, metaFelicidade));
    this.felicidade = Math.round(this.felicidade * 0.7 + metaFelicidade * 0.3);

    if (!temAgua || !temEnergia) {
      this.saude = Math.max(15, this.saude - 4);
    } else {
      this.saude = Math.min(100, this.saude + 1);
    }
  }

  obterPosicaoAnimada(tempoSegundos) {
    const temOrigem = this.origemX !== undefined && this.origemY !== undefined;
    const temDestino = this.destinoX !== undefined && this.destinoY !== undefined;

    if (!temOrigem && !temDestino) {
      return null;
    }

    const ox = temOrigem ? this.origemX : this.destinoX;
    const oy = temOrigem ? this.origemY : this.destinoY;
    const dx = temDestino ? this.destinoX : this.origemX;
    const dy = temDestino ? this.destinoY : this.origemY;

    const ehMesmoLocal = ox === dx && oy === dy;

    if (ehMesmoLocal) {
      const angulo = tempoSegundos * this.velocidade * 3 + this.offsetTempo;
      const raio = 0.22;
      return {
        x: ox + Math.cos(angulo) * raio + this.offsetLateralX,
        y: oy + Math.sin(angulo) * raio + this.offsetLateralY,
      };
    }

    const ciclo = (tempoSegundos * this.velocidade + this.offsetTempo) % 2;
    const pLinear = ciclo <= 1 ? ciclo : 2 - ciclo;
    const pSmooth = pLinear * pLinear * (3 - 2 * pLinear);

    return {
      x: ox + (dx - ox) * pSmooth + this.offsetLateralX,
      y: oy + (dy - oy) * pSmooth + this.offsetLateralY,
    };
  }

  obterPensamento(cidade) {
    if (!this.temMoradia()) {
      return "Estou sem casa e dormindo na rua... A cidade precisa de novas moradias urgentemente!";
    }
    if (cidade && cidade.recursos && cidade.recursos.energiaPorcentagem < 80) {
      return "Estamos em pleno apagão! Como vou carregar meus aparelhos e manter a geladeira ligada?";
    }
    if (cidade && cidade.recursos && cidade.recursos.aguaPorcentagem < 80) {
      return "A torneira está seca! Uma cidade moderna não pode ficar sem água encanada.";
    }
    if (!this.estaEmpregado()) {
      return "Estou distribuindo currículos pelo centro. Tomara que abram novas lojas ou indústrias.";
    }
    if (this.felicidade >= 80) {
      return `Adoro morar aqui em ${cidade?.nome || "nossa cidade"}! Serviços funcionando e vizinhança tranquila.`;
    }
    if (this.felicidade >= 55) {
      return `Dia normal de trabalho como ${this.profissao}. A cidade tem potencial para crescer.`;
    }
    return "O custo de vida está puxado e a cidade anda meio descuidada ultimamente.";
  }

  pagarImposto(taxa = 0.05) {
    if (!this.estaEmpregado()) return 6;
    return Math.max(6, Math.round(this.salario * taxa));
  }

  envelhecer() {
    this.diasVividos += 1;
    if (this.diasVividos % 30 === 0) {
      this.idade += 1;
      if (this.idade >= 65 && this.estaEmpregado() && Math.random() < 0.2) {
        this.demitir();
      }
    }
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      genero: this.genero,
      idade: this.idade,
      felicidade: this.felicidade,
      saude: this.saude,
      educacao: this.educacao,
      moradiaId: this.moradiaId,
      trabalhoId: this.trabalhoId,
      profissao: this.profissao,
      salario: this.salario,
      corRoupa: this.corRoupa,
      origemX: this.origemX,
      origemY: this.origemY,
      destinoX: this.destinoX,
      destinoY: this.destinoY,
      diasVividos: this.diasVividos,
    };
  }

  static fromJSON(data) {
    const cit = new Habitante({
      nome: data.nome,
      idade: data.idade,
      genero: data.genero,
      moradiaId: data.moradiaId,
      trabalhoId: data.trabalhoId,
      id: data.id,
    });
    cit.felicidade = data.felicidade ?? 68;
    cit.saude = data.saude ?? 85;
    cit.educacao = data.educacao ?? 50;
    cit.profissao = data.profissao || "Cidadão(ã)";
    cit.salario = data.salario ?? 0;
    cit.corRoupa = data.corRoupa || "#38bdf8";
    cit.origemX = data.origemX ?? 0;
    cit.origemY = data.origemY ?? 0;
    cit.destinoX = data.destinoX ?? 0;
    cit.destinoY = data.destinoY ?? 0;
    cit.diasVividos = data.diasVividos ?? 0;
    return cit;
  }
}
