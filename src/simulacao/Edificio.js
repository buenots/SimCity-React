export const CATALOGO_EDIFICIOS = {
  "Casa Simples": {
    nome: "Casa Simples",
    categoria: "residencial",
    custo: 500,
    manutencao: 4,
    capacidadeHabitantes: 4,
    capacidadeEmpregos: 0,
    consumoEnergia: 3,
    consumoAgua: 3,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 28,
    bonusFelicidade: 2,
    cor: "#4ade80",
    altura: 14,
    descricao: "Residência térrea familiar.",
  },
  "Apartamento": {
    nome: "Apartamento",
    categoria: "residencial",
    custo: 2000,
    manutencao: 16,
    capacidadeHabitantes: 16,
    capacidadeEmpregos: 0,
    consumoEnergia: 10,
    consumoAgua: 10,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 110,
    bonusFelicidade: 4,
    cor: "#22c55e",
    altura: 28,
    descricao: "Edifício residencial de densidade média.",
  },
  "Condomínio": {
    nome: "Condomínio",
    categoria: "residencial",
    custo: 5000,
    manutencao: 38,
    capacidadeHabitantes: 40,
    capacidadeEmpregos: 2,
    consumoEnergia: 25,
    consumoAgua: 25,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 280,
    bonusFelicidade: 7,
    cor: "#16a34a",
    altura: 42,
    descricao: "Complexo habitacional moderno de alta densidade.",
  },
  "Loja": {
    nome: "Loja",
    categoria: "comercial",
    custo: 800,
    manutencao: 8,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 6,
    consumoEnergia: 6,
    consumoAgua: 4,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 70,
    bonusFelicidade: 3,
    cor: "#60a5fa",
    altura: 16,
    descricao: "Comércio de bairro que gera empregos e bens.",
  },
  "Mercado": {
    nome: "Mercado",
    categoria: "comercial",
    custo: 3000,
    manutencao: 22,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 20,
    consumoEnergia: 18,
    consumoAgua: 12,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 240,
    bonusFelicidade: 6,
    cor: "#3b82f6",
    altura: 22,
    descricao: "Supermercado central de grande movimentação.",
  },
  "Shopping": {
    nome: "Shopping",
    categoria: "comercial",
    custo: 15000,
    manutencao: 95,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 80,
    consumoEnergia: 50,
    consumoAgua: 35,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 980,
    bonusFelicidade: 12,
    cor: "#1d4ed8",
    altura: 34,
    descricao: "Centro de compras e alta arrecadação municipal.",
  },
  "Fábrica Pequena": {
    nome: "Fábrica Pequena",
    categoria: "industrial",
    custo: 2500,
    manutencao: 20,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 16,
    consumoEnergia: 25,
    consumoAgua: 18,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 210,
    bonusFelicidade: -2,
    cor: "#f59e0b",
    altura: 20,
    descricao: "Manufatura de produtos leves com postos de trabalho.",
  },
  "Fábrica Grande": {
    nome: "Fábrica Grande",
    categoria: "industrial",
    custo: 8000,
    manutencao: 60,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 55,
    consumoEnergia: 55,
    consumoAgua: 40,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 650,
    bonusFelicidade: -5,
    cor: "#d97706",
    altura: 30,
    descricao: "Complexo industrial com alta geração tributária.",
  },
  "Usina": {
    nome: "Usina",
    categoria: "industrial",
    custo: 12000,
    manutencao: 85,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 18,
    consumoEnergia: 0,
    consumoAgua: 12,
    producaoEnergia: 300,
    producaoAgua: 0,
    impostoBase: 60,
    bonusFelicidade: -3,
    cor: "#eab308",
    altura: 36,
    descricao: "Usina que gera 300 kW de energia para a cidade.",
  },
  "Estrada": {
    nome: "Estrada",
    categoria: "infraestrutura",
    custo: 100,
    manutencao: 1,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 0,
    consumoEnergia: 0,
    consumoAgua: 0,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 0,
    bonusFelicidade: 1,
    cor: "#64748b",
    altura: 3,
    descricao: "Conecta zonas urbanas e agiliza transporte.",
  },
  "Ponte": {
    nome: "Ponte",
    categoria: "infraestrutura",
    custo: 2000,
    manutencao: 5,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 0,
    consumoEnergia: 0,
    consumoAgua: 0,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 0,
    bonusFelicidade: 2,
    cor: "#94a3b8",
    altura: 5,
    descricao: "Permite tráfego sobre rios e áreas alagadas.",
  },
  "Estação de Ônibus": {
    nome: "Estação de Ônibus",
    categoria: "infraestrutura",
    custo: 3500,
    manutencao: 25,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 8,
    consumoEnergia: 6,
    consumoAgua: 4,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 40,
    bonusFelicidade: 7,
    cor: "#a855f7",
    altura: 16,
    descricao: "Transporte público eficiente para a população.",
  },
  "Rede Elétrica": {
    nome: "Rede Elétrica",
    categoria: "infraestrutura",
    custo: 600,
    manutencao: 6,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 0,
    consumoEnergia: 0,
    consumoAgua: 0,
    producaoEnergia: 60,
    producaoAgua: 0,
    impostoBase: 0,
    bonusFelicidade: 2,
    cor: "#facc15",
    altura: 12,
    descricao: "Subestação e postes que fornecem +60 kW de energia.",
  },
  "Rede de Água": {
    nome: "Rede de Água",
    categoria: "infraestrutura",
    custo: 800,
    manutencao: 8,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 0,
    consumoEnergia: 3,
    consumoAgua: 0,
    producaoEnergia: 0,
    producaoAgua: 130,
    impostoBase: 0,
    bonusFelicidade: 3,
    cor: "#38bdf8",
    altura: 10,
    descricao: "Estação de bombeamento que fornece +130 m³ de água limpa.",
  },
  "Escola": {
    nome: "Escola",
    categoria: "servicos",
    custo: 4500,
    manutencao: 38,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 16,
    consumoEnergia: 8,
    consumoAgua: 8,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 25,
    bonusFelicidade: 12,
    cor: "#fb7185",
    altura: 22,
    descricao: "Ensino básico e médio que eleva a escolaridade.",
  },
  "Hospital": {
    nome: "Hospital",
    categoria: "servicos",
    custo: 10000,
    manutencao: 85,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 35,
    consumoEnergia: 16,
    consumoAgua: 15,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 50,
    bonusFelicidade: 18,
    cor: "#f43f5e",
    altura: 28,
    descricao: "Atendimento de saúde pública e prevenção de surtos.",
  },
  "Delegacia": {
    nome: "Delegacia",
    categoria: "servicos",
    custo: 5000,
    manutencao: 40,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 16,
    consumoEnergia: 7,
    consumoAgua: 5,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 20,
    bonusFelicidade: 12,
    cor: "#0284c7",
    altura: 22,
    descricao: "Segurança e combate à criminalidade urbana.",
  },
  "Bombeiros": {
    nome: "Bombeiros",
    categoria: "servicos",
    custo: 4800,
    manutencao: 36,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 14,
    consumoEnergia: 6,
    consumoAgua: 12,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 15,
    bonusFelicidade: 10,
    cor: "#ef4444",
    altura: 20,
    descricao: "Prevenção de incêndios e socorro a acidentes.",
  },
  "Praça": {
    nome: "Praça",
    categoria: "servicos",
    custo: 1500,
    manutencao: 10,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 2,
    consumoEnergia: 1,
    consumoAgua: 4,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 0,
    bonusFelicidade: 10,
    cor: "#10b981",
    altura: 6,
    descricao: "Espaço verde de convivência, descanso e lazer.",
  },
  "Igreja": {
    nome: "Igreja",
    categoria: "servicos",
    custo: 2800,
    manutencao: 14,
    capacidadeHabitantes: 0,
    capacidadeEmpregos: 4,
    consumoEnergia: 4,
    consumoAgua: 3,
    producaoEnergia: 0,
    producaoAgua: 0,
    impostoBase: 10,
    bonusFelicidade: 7,
    cor: "#c084fc",
    altura: 24,
    descricao: "Centro religioso e cultural de apoio comunitário.",
  },
};

export class Edificio {
  constructor({ nome, x, y, id = null, rotacao = 0 }) {
    const modelo = CATALOGO_EDIFICIOS[nome] || {
      nome: nome || "Estrutura",
      categoria: "residencial",
      custo: 500,
      manutencao: 4,
      capacidadeHabitantes: 4,
      capacidadeEmpregos: 0,
      consumoEnergia: 2,
      consumoAgua: 2,
      producaoEnergia: 0,
      producaoAgua: 0,
      impostoBase: 20,
      bonusFelicidade: 2,
      cor: "#4ade80",
      altura: 16,
      descricao: "",
    };

    this.id = id || `bld_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    this.nome = modelo.nome;
    this.categoria = modelo.categoria;
    this.custoConstrucao = modelo.custo;
    this.custoManutencao = modelo.manutencao;
    this.capacidadeHabitantes = modelo.capacidadeHabitantes;
    this.capacidadeEmpregos = modelo.capacidadeEmpregos;
    this.consumoEnergia = modelo.consumoEnergia;
    this.consumoAgua = modelo.consumoAgua;
    this.producaoEnergia = modelo.producaoEnergia;
    this.producaoAgua = modelo.producaoAgua;
    this.impostoBase = modelo.impostoBase;
    this.bonusFelicidade = modelo.bonusFelicidade;
    this.cor = modelo.cor;
    this.altura = modelo.altura;
    this.descricao = modelo.descricao;

    this.x = x;
    this.y = y;
    this.nivel = 1;
    this.rotacao = rotacao || 0;
    this.moradores = [];
    this.trabalhadores = [];
    this.temEnergia = true;
    this.temAgua = true;
  }

  girar() {
    this.rotacao = (this.rotacao + 1) % 4;
  }

  temVagaMoradia() {
    return this.moradores.length < this.capacidadeHabitantes;
  }

  vagasMoradiaDisponiveis() {
    return Math.max(0, this.capacidadeHabitantes - this.moradores.length);
  }

  adicionarMorador(habitanteId) {
    if (this.temVagaMoradia() && !this.moradores.includes(habitanteId)) {
      this.moradores.push(habitanteId);
      return true;
    }
    return false;
  }

  removerMorador(habitanteId) {
    const index = this.moradores.indexOf(habitanteId);
    if (index !== -1) {
      this.moradores.splice(index, 1);
      return true;
    }
    return false;
  }

  temVagaEmprego() {
    return this.trabalhadores.length < this.capacidadeEmpregos;
  }

  vagasEmpregoDisponiveis() {
    return Math.max(0, this.capacidadeEmpregos - this.trabalhadores.length);
  }

  adicionarTrabalhador(habitanteId) {
    if (this.temVagaEmprego() && !this.trabalhadores.includes(habitanteId)) {
      this.trabalhadores.push(habitanteId);
      return true;
    }
    return false;
  }

  removerTrabalhador(habitanteId) {
    const index = this.trabalhadores.indexOf(habitanteId);
    if (index !== -1) {
      this.trabalhadores.splice(index, 1);
      return true;
    }
    return false;
  }

  calcularReceita(taxaMultiplicador = 1.0) {
    if (this.impostoBase <= 0) return 0;

    let taxaOcupacao = 1;
    if (this.categoria === "residencial" && this.capacidadeHabitantes > 0) {
      taxaOcupacao = Math.max(0.2, this.moradores.length / this.capacidadeHabitantes);
    } else if (
      (this.categoria === "comercial" || this.categoria === "industrial") &&
      this.capacidadeEmpregos > 0
    ) {
      taxaOcupacao = Math.max(0.3, this.trabalhadores.length / this.capacidadeEmpregos);
    }

    let eficiencia = 1.0;
    if (!this.temEnergia) eficiencia *= 0.5;
    if (!this.temAgua) eficiencia *= 0.6;

    const receitaBase = this.impostoBase * this.nivel * taxaOcupacao * eficiencia;
    return Math.round(receitaBase * taxaMultiplicador);
  }

  calcularManutencao() {
    return Math.round(this.custoManutencao * (1 + (this.nivel - 1) * 0.4));
  }

  fazerUpgrade() {
    const custoUpgrade = Math.round(this.custoConstrucao * 0.7 * this.nivel);
    this.nivel += 1;
    this.capacidadeHabitantes = Math.round(this.capacidadeHabitantes * 1.3);
    this.capacidadeEmpregos = Math.round(this.capacidadeEmpregos * 1.3);
    this.impostoBase = Math.round(this.impostoBase * 1.4);
    this.altura += 4;
    return custoUpgrade;
  }

  desocupar() {
    const desalojados = {
      moradores: [...this.moradores],
      trabalhadores: [...this.trabalhadores],
    };
    this.moradores = [];
    this.trabalhadores = [];
    return desalojados;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      categoria: this.categoria,
      custoConstrucao: this.custoConstrucao,
      custoManutencao: this.custoManutencao,
      capacidadeHabitantes: this.capacidadeHabitantes,
      capacidadeEmpregos: this.capacidadeEmpregos,
      moradores: [...this.moradores],
      trabalhadores: [...this.trabalhadores],
      consumoEnergia: this.consumoEnergia,
      consumoAgua: this.consumoAgua,
      producaoEnergia: this.producaoEnergia,
      producaoAgua: this.producaoAgua,
      impostoBase: this.impostoBase,
      bonusFelicidade: this.bonusFelicidade,
      x: this.x,
      y: this.y,
      nivel: this.nivel,
      rotacao: this.rotacao,
      cor: this.cor,
      altura: this.altura,
      temEnergia: this.temEnergia,
      temAgua: this.temAgua,
    };
  }

  static fromJSON(data) {
    const bld = new Edificio({ nome: data.nome, x: data.x, y: data.y, id: data.id });
    bld.nivel = data.nivel || 1;
    bld.rotacao = data.rotacao || 0;
    bld.moradores = Array.isArray(data.moradores) ? data.moradores : [];
    bld.trabalhadores = Array.isArray(data.trabalhadores) ? data.trabalhadores : [];
    if (data.capacidadeHabitantes !== undefined) bld.capacidadeHabitantes = data.capacidadeHabitantes;
    if (data.capacidadeEmpregos !== undefined) bld.capacidadeEmpregos = data.capacidadeEmpregos;
    bld.temEnergia = data.temEnergia ?? true;
    bld.temAgua = data.temAgua ?? true;
    return bld;
  }
}
