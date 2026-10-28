import { useState, useEffect, useRef } from "react";
import {
  Home,
  Store,
  Factory,
  Route,
  ShieldPlus,
  Pause,
  Play,
  FastForward,
  ChevronRight,
  X,
  Users,
  Smile,
  DollarSign,
  CalendarDays,
  Building2,
  Zap,
  Droplets,
  TreePine,
  GraduationCap,
  Hospital,
  Bus,
  Landmark,
  Church,
  Flame,
  MapPin,
  Menu,
  Trash2,
  ArrowUpCircle,
  Bell,
  Coins,
  TrendingUp,
  TrendingDown,
  Percent,
  UserCheck,
  Search,
  Crosshair,
  Heart,
  RotateCw,
} from "lucide-react";
import IsometricMap from "./IsometricMap";
import { Cidade } from "./simulacao/index.js";

const CATEGORIES = [
  {
    id: "residential",
    label: "Residencial",
    icon: Home,
    color: "#4ade80",
    items: [
      { name: "Casa Simples", cost: 500, icon: Home },
      { name: "Apartamento", cost: 2000, icon: Building2 },
      { name: "Condomínio", cost: 5000, icon: Building2 },
    ],
  },
  {
    id: "commercial",
    label: "Comercial",
    icon: Store,
    color: "#60a5fa",
    items: [
      { name: "Loja", cost: 800, icon: Store },
      { name: "Mercado", cost: 3000, icon: Store },
      { name: "Shopping", cost: 15000, icon: Landmark },
    ],
  },
  {
    id: "industrial",
    label: "Industrial",
    icon: Factory,
    color: "#f59e0b",
    items: [
      { name: "Fábrica Pequena", cost: 2500, icon: Factory },
      { name: "Fábrica Grande", cost: 8000, icon: Factory },
      { name: "Usina", cost: 12000, icon: Zap },
    ],
  },
  {
    id: "infrastructure",
    label: "Infraestrutura",
    icon: Route,
    color: "#a78bfa",
    items: [
      { name: "Estrada", cost: 100, icon: Route },
      { name: "Ponte", cost: 2000, icon: Route },
      { name: "Estação de Ônibus", cost: 3500, icon: Bus },
      { name: "Rede Elétrica", cost: 600, icon: Zap },
      { name: "Rede de Água", cost: 800, icon: Droplets },
    ],
  },
  {
    id: "services",
    label: "Serviços",
    icon: ShieldPlus,
    color: "#f472b6",
    items: [
      { name: "Escola", cost: 4500, icon: GraduationCap },
      { name: "Hospital", cost: 10000, icon: Hospital },
      { name: "Delegacia", cost: 5000, icon: ShieldPlus },
      { name: "Bombeiros", cost: 4800, icon: Flame },
      { name: "Praça", cost: 1500, icon: TreePine },
      { name: "Igreja", cost: 2800, icon: Church },
    ],
  },
];

function formatMoney(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatNumber(value) {
  return value.toLocaleString("pt-BR");
}

export default function GameScreen({ onBack, config }) {
  const [cidade] = useState(
    () =>
      new Cidade({
        nome: config?.cityName || "Nova Esperança",
        prefeito: config?.mayorName || "Prefeito",
        tipoMapa: config?.map || "planicie",
        saldoInicial:
          config?.startingMoney !== undefined ? config.startingMoney : 100000,
        tamanho: config?.mapSize || 24,
        dificuldade: config?.difficulty || "normal",
      }),
  );

  const [, setTick] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildingRotation, setBuildingRotation] = useState(0);
  const [selectedTile, setSelectedTile] = useState(null);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [cameraFocus, setCameraFocus] = useState(null);

  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [citizensPanelOpen, setCitizensPanelOpen] = useState(false);
  const [citizenSearch, setCitizenSearch] = useState("");
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [financePanelOpen, setFinancePanelOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const feedbackTimerRef = useRef(null);

  useEffect(() => {
    cidade.definirVelocidade(speed);
  }, [cidade, speed]);

  useEffect(() => {
    if (speed === 0) return;

    const intervalos = { 1: 1000, 2: 450, 3: 160 };
    const delay = intervalos[speed] || 1000;

    const intervalId = setInterval(() => {
      cidade.atualizar();
      setTick((t) => t + 1);
    }, delay);

    return () => clearInterval(intervalId);
  }, [cidade, speed]);

  const showFeedback = (mensagem, tipo = "info") => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    setFeedback({ mensagem, tipo });
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "r" || e.key === "R") {
        if (selectedTile && selectedTile.building) {
          selectedTile.building.girar();
          setTick((t) => t + 1);
          showFeedback(
            `Estrutura girada! (Orientação: ${selectedTile.building.rotacao})`,
            "info",
          );
        } else if (selectedBuilding && selectedBuilding !== "demolir") {
          setBuildingRotation((prev) => {
            const nova = (prev + 1) % 4;
            showFeedback(`Orientação de construção: ${nova}`, "info");
            return nova;
          });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTile, selectedBuilding]);

  const handleRotateSelected = () => {
    if (selectedTile && selectedTile.building) {
      selectedTile.building.girar();
      setTick((t) => t + 1);
      showFeedback(
        `Estrutura girada! (Orientação: ${selectedTile.building.rotacao})`,
        "info",
      );
    }
  };

  const handleCategoryClick = (catId) => {
    if (activeCategory === catId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(catId);
      if (selectedBuilding === "demolir") setSelectedBuilding(null);
    }
  };

  const handleTileClick = (tile) => {
    if (selectedBuilding === "demolir") {
      const res = cidade.demolir(tile.x, tile.y);
      if (res.sucesso) {
        showFeedback(
          `Edifício demolido! Reembolso de R$ ${res.reembolso.toLocaleString("pt-BR")}.`,
          "alerta",
        );
      } else {
        showFeedback(res.motivo, "alerta");
      }
      setSelectedTile(null);
      setTick((t) => t + 1);
      return;
    }

    if (selectedBuilding) {
      const res = cidade.construir(
        selectedBuilding,
        tile.x,
        tile.y,
        buildingRotation,
      );
      if (res.sucesso) {
        showFeedback(`Construído: ${selectedBuilding}!`, "sucesso");
      } else {
        showFeedback(res.motivo, "alerta");
      }
      setSelectedTile(null);
      setTick((t) => t + 1);
      return;
    }

    const edif = cidade.obterEdificio(tile.x, tile.y);
    if (edif) {
      setSelectedTile({ x: tile.x, y: tile.y, building: edif });
      setCitizensPanelOpen(false);
    } else {
      setSelectedTile(null);
    }
  };

  const handleUpgrade = (x, y) => {
    const res = cidade.melhorarEdificio(x, y);
    if (res.sucesso) {
      showFeedback(
        `Edifício promovido para Nível ${res.novoNivel}!`,
        "sucesso",
      );
      setTick((t) => t + 1);
    } else {
      showFeedback(res.motivo, "alerta");
    }
  };

  const handleDemolishSelected = (x, y) => {
    const res = cidade.demolir(x, y);
    if (res.sucesso) {
      showFeedback(
        `Edifício demolido com reembolso de R$ ${res.reembolso}.`,
        "alerta",
      );
      setSelectedTile(null);
      setTick((t) => t + 1);
    } else {
      showFeedback(res.motivo, "alerta");
    }
  };

  const focarNoEdificio = (bldId) => {
    const bld = cidade.edificios.find((b) => b.id === bldId);
    if (bld) {
      setCameraFocus({ x: bld.x, y: bld.y });
      setSelectedTile({ x: bld.x, y: bld.y, building: bld });
      showFeedback(`Câmera focada em ${bld.nome} (${bld.x}, ${bld.y})`, "info");
    }
  };

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);
  const stats = cidade.obterEstatisticas();
  const todosHabitantes = cidade.populacao.obterLista();

  const habitantesFiltrados = todosHabitantes.filter((h) => {
    if (!citizenSearch.trim()) return true;
    const term = citizenSearch.toLowerCase();
    return (
      h.nome.toLowerCase().includes(term) ||
      h.profissao.toLowerCase().includes(term)
    );
  });

  return (
    <div className="tc-root relative h-screen w-screen overflow-hidden bg-[#070b14] font-['Montserrat',sans-serif] text-slate-200 select-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        .tc-root { --u: min(1vw, 1.78vh); }
        @media (max-width: 820px) { .tc-root { --u: max(min(2.4vw, 1.78vh), 3.2px); } }
        @keyframes tc-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tc-slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tc-slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .tc-fade    { animation: tc-fade 0.5s ease-out forwards; }
        .tc-slideUp { animation: tc-slideUp 0.4s ease-out forwards; }
        .tc-slideRight { animation: tc-slideRight 0.35s ease-out forwards; }
        .hud-panel {
          background: linear-gradient(135deg, rgba(10,20,36,0.88) 0%, rgba(8,15,28,0.92) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(100,160,250,0.15);
        }
        .hud-panel-solid {
          background: linear-gradient(135deg, rgba(10,20,36,0.95) 0%, rgba(8,15,28,0.98) 100%);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(100,160,250,0.2);
        }
        .hud-btn {
          transition: all 0.2s ease-out;
        }
        .hud-btn:hover {
          background: rgba(56,152,255,0.15);
          border-color: rgba(56,152,255,0.4);
        }
        .hud-btn.active {
          background: rgba(56,152,255,0.2);
          border-color: rgba(56,152,255,0.6);
          box-shadow: 0 0 12px rgba(56,152,255,0.2), inset 0 0 8px rgba(56,152,255,0.1);
        }
        .hud-btn-danger.active {
          background: rgba(239,68,68,0.25);
          border-color: rgba(239,68,68,0.7);
          box-shadow: 0 0 12px rgba(239,68,68,0.3);
        }
        .hud-divider {
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(100,160,250,0.3), transparent);
        }
        .minimap-grid {
          background-image:
            linear-gradient(rgba(100,160,250,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,160,250,0.08) 1px, transparent 1px);
          background-size: 20% 20%;
        }
        @media (prefers-reduced-motion: reduce) {
          .tc-fade, .tc-slideUp, .tc-slideRight { animation-duration: 0.01s; }
        }
      `}</style>

      <IsometricMap
        mapSize={cidade.tamanho}
        _mapType={cidade.tipoMapa}
        terrain={cidade.mapa}
        cidade={cidade}
        selectedBuilding={selectedBuilding}
        selectedTile={selectedTile}
        cameraFocus={cameraFocus}
        onTileClick={handleTileClick}
      />

      {feedback && (
        <div className="tc-slideUp pointer-events-none absolute top-[calc(var(--u)*5.2)] left-1/2 -translate-x-1/2 z-30">
          <div
            className={[
              "rounded-lg px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-md border",
              feedback.tipo === "sucesso"
                ? "bg-emerald-950/80 text-emerald-200 border-emerald-500/40"
                : feedback.tipo === "alerta"
                  ? "bg-amber-950/80 text-amber-200 border-amber-500/40"
                  : "bg-sky-950/80 text-sky-200 border-sky-500/40",
            ].join(" ")}
          >
            {feedback.mensagem}
          </div>
        </div>
      )}

      <header className="absolute left-0 right-0 top-0 z-20 flex items-stretch">
        <div className="hud-panel flex flex-1 items-center gap-[calc(var(--u)*0.4)] rounded-b-lg border-t-0 px-[calc(var(--u)*1.5)] py-[calc(var(--u)*0.6)]">
          <div className="flex items-center gap-[calc(var(--u)*0.7)] pr-[calc(var(--u)*1.2)]">
            <Building2
              className="h-[calc(var(--u)*1.6)] w-[calc(var(--u)*1.6)] text-sky-400"
              strokeWidth={1.8}
            />
            <div className="flex flex-col">
              <span className="text-[calc(var(--u)*1.05)] font-semibold tracking-wide text-slate-100 leading-tight">
                {stats.cityName}
              </span>
              <span className="text-[calc(var(--u)*0.6)] text-slate-400">
                {stats.prefeito} • {config?.difficultyLabel || "Normal"}
              </span>
            </div>
          </div>

          <div className="hud-divider h-[calc(var(--u)*2.2)] shrink-0" />

          <div className="flex items-center gap-[calc(var(--u)*0.5)] px-[calc(var(--u)*0.8)]">
            <CalendarDays
              className="h-[calc(var(--u)*1.3)] w-[calc(var(--u)*1.3)] text-slate-400"
              strokeWidth={1.6}
            />
            <span className="text-[calc(var(--u)*0.85)] tracking-wide text-slate-300">
              {stats.date}
            </span>
          </div>

          <div className="hud-divider h-[calc(var(--u)*2.2)] shrink-0" />

          <button
            type="button"
            onClick={() => setFinancePanelOpen(!financePanelOpen)}
            className="hud-btn flex items-center gap-[calc(var(--u)*0.5)] px-[calc(var(--u)*0.8)] py-1 rounded border border-transparent"
            title="Clique para abrir demonstrativo fiscal e ajustar tributos"
          >
            <DollarSign
              className="h-[calc(var(--u)*1.3)] w-[calc(var(--u)*1.3)] text-emerald-400"
              strokeWidth={1.8}
            />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[calc(var(--u)*0.9)] font-semibold tracking-wide text-emerald-300">
                {formatMoney(stats.money)}
              </span>
              <span
                className={[
                  "text-[calc(var(--u)*0.62)] font-medium flex items-center gap-0.5",
                  stats.saldoMensalProjetado >= 0
                    ? "text-emerald-400"
                    : "text-rose-400",
                ].join(" ")}
              >
                {stats.saldoMensalProjetado >= 0 ? (
                  <TrendingUp className="h-3 w-3 inline" />
                ) : (
                  <TrendingDown className="h-3 w-3 inline" />
                )}
                {stats.saldoMensalProjetado >= 0 ? "+" : ""}
                {formatMoney(stats.saldoMensalProjetado)}/mês
              </span>
            </div>
          </button>

          <div className="hud-divider h-[calc(var(--u)*2.2)] shrink-0" />

          <button
            type="button"
            onClick={() => {
              setCitizensPanelOpen(!citizensPanelOpen);
              setSelectedTile(null);
            }}
            className={[
              "hud-btn flex items-center gap-[calc(var(--u)*0.5)] px-[calc(var(--u)*0.8)] py-1 rounded border border-transparent",
              citizensPanelOpen ? "active" : "",
            ].join(" ")}
            title="Clique para ver os cidadãos reais da cidade"
          >
            <Users
              className="h-[calc(var(--u)*1.3)] w-[calc(var(--u)*1.3)] text-sky-400"
              strokeWidth={1.6}
            />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[calc(var(--u)*0.85)] tracking-wide text-slate-200">
                {formatNumber(stats.population)} hab.
              </span>
              <span className="text-[9px] text-sky-400 font-semibold">
                Ver Moradores
              </span>
            </div>
          </button>

          <div className="hud-divider h-[calc(var(--u)*2.2)] shrink-0" />

          <div
            className="flex items-center gap-[calc(var(--u)*0.5)] px-[calc(var(--u)*0.8)]"
            title="Felicidade Geral dos Cidadãos"
          >
            <Smile
              className={[
                "h-[calc(var(--u)*1.3)] w-[calc(var(--u)*1.3)]",
                stats.happiness >= 70
                  ? "text-emerald-400"
                  : stats.happiness >= 40
                    ? "text-yellow-400"
                    : "text-red-400",
              ].join(" ")}
              strokeWidth={1.6}
            />
            <span className="text-[calc(var(--u)*0.85)] tracking-wide text-slate-200">
              {stats.happiness}%
            </span>
          </div>

          <div className="hud-divider h-[calc(var(--u)*2.2)] shrink-0" />

          <div
            className="flex items-center gap-[calc(var(--u)*0.4)] px-[calc(var(--u)*0.7)]"
            title={`Rede Elétrica: ${stats.electricityProd} kW gerados / ${stats.electricityCons} kW demandados`}
          >
            <Zap
              className={[
                "h-[calc(var(--u)*1.2)] w-[calc(var(--u)*1.2)]",
                stats.electricity >= 100
                  ? "text-yellow-400"
                  : stats.electricity >= 50
                    ? "text-amber-500"
                    : "text-red-500 animate-pulse",
              ].join(" ")}
              strokeWidth={1.6}
            />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[calc(var(--u)*0.8)] tracking-wide text-slate-200">
                {stats.electricity}%
              </span>
              <span className="text-[9px] text-slate-400">
                {stats.electricityProd} / {stats.electricityCons} kW
              </span>
            </div>
          </div>

          <div
            className="flex items-center gap-[calc(var(--u)*0.4)] px-[calc(var(--u)*0.7)]"
            title={`Abastecimento de Água: ${stats.waterProd} m³ produzidos / ${stats.waterCons} m³ demandados`}
          >
            <Droplets
              className={[
                "h-[calc(var(--u)*1.2)] w-[calc(var(--u)*1.2)]",
                stats.water >= 100
                  ? "text-blue-400"
                  : stats.water >= 50
                    ? "text-sky-500"
                    : "text-red-500 animate-pulse",
              ].join(" ")}
              strokeWidth={1.6}
            />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[calc(var(--u)*0.8)] tracking-wide text-slate-200">
                {stats.water}%
              </span>
              <span className="text-[9px] text-slate-400">
                {stats.waterProd} / {stats.waterCons} m³
              </span>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-[calc(var(--u)*0.3)]">
            {[
              { s: 0, icon: Pause, label: "Pausar" },
              { s: 1, icon: Play, label: "1x" },
              { s: 2, icon: FastForward, label: "2x" },
              { s: 3, icon: FastForward, label: "3x" },
            ].map(({ s, icon: SIcon, label }) => (
              <button
                key={s}
                type="button"
                title={label}
                onClick={() => setSpeed(s)}
                className={[
                  "hud-btn flex items-center justify-center rounded border border-transparent p-[calc(var(--u)*0.4)]",
                  speed === s ? "active" : "",
                ].join(" ")}
              >
                <SIcon
                  className={[
                    "h-[calc(var(--u)*1.15)] w-[calc(var(--u)*1.15)]",
                    speed === s ? "text-sky-400" : "text-slate-400",
                  ].join(" ")}
                  strokeWidth={s === 3 ? 2.5 : 1.8}
                  fill={speed === s && s > 0 ? "currentColor" : "none"}
                />
                {s === 3 && (
                  <span
                    className={[
                      "ml-[2px] text-[calc(var(--u)*0.6)] font-bold",
                      speed === 3 ? "text-sky-400" : "text-slate-500",
                    ].join(" ")}
                  >
                    ×3
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="hud-divider h-[calc(var(--u)*2.2)] shrink-0 ml-[calc(var(--u)*0.4)]" />

          <button
            type="button"
            onClick={() => setNotifPanelOpen(!notifPanelOpen)}
            className={[
              "hud-btn relative flex items-center justify-center rounded border border-transparent p-[calc(var(--u)*0.4)] ml-[calc(var(--u)*0.3)]",
              notifPanelOpen ? "active" : "",
            ].join(" ")}
            title="Notificações da Cidade"
          >
            <Bell
              className="h-[calc(var(--u)*1.3)] w-[calc(var(--u)*1.3)] text-slate-400"
              strokeWidth={1.6}
            />
            {cidade.notificacoes.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-sky-500 text-[8px] font-bold text-white">
                {cidade.notificacoes.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="hud-btn flex items-center justify-center rounded border border-transparent p-[calc(var(--u)*0.4)] ml-[calc(var(--u)*0.3)]"
            title="Menu"
          >
            <Menu
              className="h-[calc(var(--u)*1.3)] w-[calc(var(--u)*1.3)] text-slate-400"
              strokeWidth={1.6}
            />
          </button>
        </div>
      </header>

      {speed === 0 && (
        <div className="tc-fade pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="rounded-lg bg-black/50 px-[calc(var(--u)*3)] py-[calc(var(--u)*1)] backdrop-blur-md border border-slate-700/40">
            <span className="text-[calc(var(--u)*1.8)] font-light tracking-[0.3em] text-slate-200">
              ⏸ JOGO PAUSADO
            </span>
          </div>
        </div>
      )}

      <nav className="absolute bottom-0 left-0 right-[calc(var(--u)*18)] z-20 pointer-events-auto">
        {activeCat && (
          <div className="tc-slideUp hud-panel-solid mx-[calc(var(--u)*1)] mb-[calc(var(--u)*0.4)] rounded-lg p-[calc(var(--u)*0.8)] max-h-48 overflow-y-auto">
            <div className="mb-[calc(var(--u)*0.5)] flex items-center justify-between">
              <div className="flex items-center gap-[calc(var(--u)*0.6)]">
                <span
                  className="h-[calc(var(--u)*0.4)] w-[calc(var(--u)*0.4)] rounded-full"
                  style={{ background: activeCat.color }}
                />
                <span
                  className="text-[calc(var(--u)*0.85)] font-semibold tracking-wider"
                  style={{ color: activeCat.color }}
                >
                  {activeCat.label.toUpperCase()}
                </span>
              </div>
              <span className="text-[calc(var(--u)*0.65)] text-slate-400">
                Selecione uma estrutura e clique no mapa para construir
              </span>
            </div>

            <div className="flex flex-wrap gap-[calc(var(--u)*0.4)]">
              {activeCat.items.map((item) => {
                const ItemIcon = item.icon;
                const isSelected = selectedBuilding === item.name;
                const podePagar = stats.money >= item.cost;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() =>
                      setSelectedBuilding(isSelected ? null : item.name)
                    }
                    className={[
                      "hud-btn flex items-center gap-[calc(var(--u)*0.5)] rounded-md border px-[calc(var(--u)*0.8)] py-[calc(var(--u)*0.45)]",
                      isSelected
                        ? "active border-sky-400/80 bg-sky-500/20"
                        : podePagar
                          ? "border-slate-600/30"
                          : "border-red-900/30 opacity-60",
                    ].join(" ")}
                  >
                    <ItemIcon
                      className={[
                        "h-[calc(var(--u)*1.1)] w-[calc(var(--u)*1.1)]",
                        isSelected ? "text-sky-400" : "text-slate-400",
                      ].join(" ")}
                      strokeWidth={1.6}
                    />
                    <div className="flex flex-col items-start">
                      <span
                        className={[
                          "text-[calc(var(--u)*0.75)] font-medium tracking-wide",
                          isSelected ? "text-sky-300" : "text-slate-200",
                        ].join(" ")}
                      >
                        {item.name}
                      </span>
                      <span
                        className={[
                          "text-[calc(var(--u)*0.6)] font-semibold",
                          podePagar ? "text-emerald-400/90" : "text-red-400",
                        ].join(" ")}
                      >
                        {formatMoney(item.cost)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="hud-panel flex items-center justify-center gap-[calc(var(--u)*0.4)] rounded-t-lg border-b-0 px-[calc(var(--u)*1)] py-[calc(var(--u)*0.5)]">
          {CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={[
                  "hud-btn group flex flex-col items-center gap-[calc(var(--u)*0.25)] rounded-md border px-[calc(var(--u)*1.2)] py-[calc(var(--u)*0.45)]",
                  isActive ? "active" : "border-transparent",
                ].join(" ")}
              >
                <CatIcon
                  className="h-[calc(var(--u)*1.4)] w-[calc(var(--u)*1.4)] transition-colors duration-200"
                  strokeWidth={1.6}
                  style={{ color: isActive ? cat.color : undefined }}
                />
                <span
                  className={[
                    "text-[calc(var(--u)*0.65)] font-medium tracking-wider transition-colors duration-200",
                    isActive
                      ? "text-slate-100"
                      : "text-slate-400 group-hover:text-slate-200",
                  ].join(" ")}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}

          <div className="hud-divider h-[calc(var(--u)*2.5)] shrink-0 mx-1" />

          <button
            type="button"
            onClick={() => {
              setActiveCategory(null);
              setSelectedBuilding(
                selectedBuilding === "demolir" ? null : "demolir",
              );
            }}
            className={[
              "hud-btn hud-btn-danger group flex flex-col items-center gap-[calc(var(--u)*0.25)] rounded-md border px-[calc(var(--u)*1.2)] py-[calc(var(--u)*0.45)]",
              selectedBuilding === "demolir"
                ? "active border-red-500/70 text-red-400"
                : "border-transparent text-slate-400 hover:text-red-300",
            ].join(" ")}
            title="Ferramenta de Demolição: clique em um edifício construído para removê-lo"
          >
            <Trash2
              className="h-[calc(var(--u)*1.4)] w-[calc(var(--u)*1.4)]"
              strokeWidth={1.6}
            />
            <span className="text-[calc(var(--u)*0.65)] font-medium tracking-wider">
              Demolir
            </span>
          </button>
        </div>
      </nav>

      <div className="absolute bottom-0 right-0 z-20">
        <div className="hud-panel rounded-tl-lg border-b-0 border-r-0 p-[calc(var(--u)*0.5)]">
          <div className="relative h-[calc(var(--u)*14)] w-[calc(var(--u)*17)] overflow-hidden rounded-md bg-[#0a1620]">
            <div className="minimap-grid absolute inset-0" />
            <div className="absolute bottom-[calc(var(--u)*0.4)] left-[calc(var(--u)*0.4)] flex items-center gap-[calc(var(--u)*0.3)]">
              <MapPin
                className="h-[calc(var(--u)*0.8)] w-[calc(var(--u)*0.8)] text-sky-400/70"
                strokeWidth={1.6}
              />
              <span className="text-[calc(var(--u)*0.55)] text-slate-400/80">
                MAPA {cidade.tamanho}×{cidade.tamanho}
              </span>
            </div>
          </div>
        </div>
      </div>

      {citizensPanelOpen && (
        <aside className="tc-slideRight absolute left-[calc(var(--u)*1)] top-[calc(var(--u)*4.5)] z-30 w-80 sm:w-96 max-h-[calc(100vh-14rem)] flex flex-col">
          <div className="hud-panel-solid rounded-lg p-4 shadow-2xl border border-sky-500/40 flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 mb-3">
              <span className="text-sm font-bold tracking-wider text-sky-300 flex items-center gap-1.5">
                <UserCheck className="h-4 w-4" />
                CIDADÃOS REAIS ({todosHabitantes.length})
              </span>
              <button
                type="button"
                onClick={() => setCitizensPanelOpen(false)}
                className="hud-btn rounded p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar habitante por nome ou profissão..."
                value={citizenSearch}
                onChange={(e) => setCitizenSearch(e.target.value)}
                className="w-full rounded-md bg-slate-800/80 border border-slate-700/50 pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-sky-400"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {todosHabitantes.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  <Users className="h-8 w-8 mx-auto mb-2 text-slate-500 opacity-60" />
                  <p>A cidade ainda não possui habitantes.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Construa casas, rede elétrica e água para atrair pessoas!
                  </p>
                </div>
              ) : (
                habitantesFiltrados.map((h) => {
                  const casa = cidade.edificios.find(
                    (b) => b.id === h.moradiaId,
                  );

                  return (
                    <div
                      key={h.id}
                      onClick={() => setSelectedCitizen(h)}
                      className="cursor-pointer rounded-lg bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/40 p-2.5 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-inner"
                            style={{ background: h.corRoupa }}
                          >
                            {h.nome.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-slate-100 flex items-center gap-1.5">
                              {h.nome}
                              <span className="text-[10px] text-slate-400">
                                ({h.idade} anos)
                              </span>
                            </div>
                            <div className="text-[10px] font-medium text-sky-300">
                              {h.profissao}{" "}
                              {h.salario > 0
                                ? `• ${formatMoney(h.salario)}`
                                : ""}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded text-[10px]">
                          <Smile
                            className={`h-3 w-3 ${h.felicidade >= 70 ? "text-emerald-400" : h.felicidade >= 40 ? "text-yellow-400" : "text-rose-400"}`}
                          />
                          <span>{h.felicidade}%</span>
                        </div>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-300/90 italic bg-black/20 p-1.5 rounded border border-white/[0.04]">
                        "{h.obterPensamento(cidade)}"
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-700/40">
                        <span>Casa: {casa ? casa.nome : "Desabrigado(a)"}</span>
                        {casa && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              focarNoEdificio(casa.id);
                            }}
                            className="text-sky-400 hover:text-sky-300 flex items-center gap-0.5 font-medium"
                          >
                            <Crosshair className="h-3 w-3" /> Focar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      )}

      {selectedCitizen && (
        <div className="tc-fade absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="hud-panel-solid w-full max-w-sm rounded-xl p-5 border border-sky-400/40 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-700/60 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-lg"
                  style={{ background: selectedCitizen.corRoupa }}
                >
                  {selectedCitizen.nome.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    {selectedCitizen.nome}
                  </h3>
                  <p className="text-xs text-sky-300 font-medium">
                    {selectedCitizen.profissao} • {selectedCitizen.idade} anos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCitizen(null)}
                className="hud-btn rounded p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-lg bg-sky-950/30 border border-sky-500/20 p-2.5 mb-3 text-xs text-sky-200 italic">
              "{selectedCitizen.obterPensamento(cidade)}"
            </div>

            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between p-2 rounded bg-white/[0.03]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Smile className="h-3.5 w-3.5 text-emerald-400" /> Felicidade:
                </span>
                <span className="font-semibold text-slate-100">
                  {selectedCitizen.felicidade}%
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/[0.03]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-rose-400" /> Saúde:
                </span>
                <span className="font-semibold text-slate-100">
                  {selectedCitizen.saude}%
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/[0.03]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5 text-amber-400" /> Salário
                  Mensal:
                </span>
                <span className="font-semibold text-emerald-400">
                  {selectedCitizen.salario > 0
                    ? formatMoney(selectedCitizen.salario)
                    : "Sem renda"}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/[0.03]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5 text-sky-400" /> Residência:
                </span>
                <span className="font-semibold text-slate-100">
                  {cidade.edificios.find(
                    (b) => b.id === selectedCitizen.moradiaId,
                  )?.nome || "Sem moradia fixa"}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/[0.03]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-purple-400" /> Local de
                  Trabalho:
                </span>
                <span className="font-semibold text-slate-100">
                  {cidade.edificios.find(
                    (b) => b.id === selectedCitizen.trabalhoId,
                  )?.nome || "Desempregado(a)"}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {selectedCitizen.moradiaId && (
                <button
                  type="button"
                  onClick={() => {
                    focarNoEdificio(selectedCitizen.moradiaId);
                    setSelectedCitizen(null);
                  }}
                  className="hud-btn flex-1 flex items-center justify-center gap-1 rounded bg-sky-500/20 border border-sky-400/40 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-500/30"
                >
                  <Home className="h-3.5 w-3.5" /> Focar Casa
                </button>
              )}
              {selectedCitizen.trabalhoId && (
                <button
                  type="button"
                  onClick={() => {
                    focarNoEdificio(selectedCitizen.trabalhoId);
                    setSelectedCitizen(null);
                  }}
                  className="hud-btn flex-1 flex items-center justify-center gap-1 rounded bg-purple-500/20 border border-purple-400/40 py-2 text-xs font-semibold text-purple-200 hover:bg-purple-500/30"
                >
                  <Building2 className="h-3.5 w-3.5" /> Focar Trabalho
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {infoPanelOpen && (
        <aside className="tc-slideRight absolute right-[calc(var(--u)*18.5)] top-[calc(var(--u)*4.5)] z-20 w-[calc(var(--u)*23)]">
          <div className="hud-panel-solid rounded-lg p-[calc(var(--u)*1.2)] shadow-xl">
            <div className="mb-[calc(var(--u)*0.8)] flex items-center justify-between">
              <span className="text-[calc(var(--u)*0.9)] font-semibold tracking-wider text-sky-300">
                CENSO DA CIDADE
              </span>
              <button
                type="button"
                onClick={() => setInfoPanelOpen(false)}
                className="hud-btn rounded border border-transparent p-[calc(var(--u)*0.2)]"
              >
                <X
                  className="h-[calc(var(--u)*1)] w-[calc(var(--u)*1)] text-slate-400"
                  strokeWidth={1.6}
                />
              </button>
            </div>

            <div className="space-y-[calc(var(--u)*0.5)]">
              {[
                { label: "Residências", value: stats.casas, color: "#4ade80" },
                {
                  label: "Comércios",
                  value: stats.comercios,
                  color: "#60a5fa",
                },
                {
                  label: "Indústrias & Usinas",
                  value: stats.industrias,
                  color: "#f59e0b",
                },
                {
                  label: "Serviços Públicos",
                  value: stats.servicos,
                  color: "#f472b6",
                },
                {
                  label: "Infraestrutura",
                  value: stats.infraestrutura,
                  color: "#a78bfa",
                },
                {
                  label: "Capacidade Moradia",
                  value: `${stats.population} / ${stats.capacidadeMoradia}`,
                  color: "#34d399",
                },
                {
                  label: "Empregos Ocupados",
                  value: `${stats.empregos} / ${stats.capacidadeTotalEmpregos}`,
                  color: "#38bdf8",
                },
                {
                  label: "Taxa de Desemprego",
                  value: stats.taxaDesemprego,
                  color: "#f87171",
                },
                {
                  label: "Energia Elétrica",
                  value: `${stats.electricityProd} kW / ${stats.electricityCons} kW`,
                  color: "#facc15",
                },
                {
                  label: "Água Encanada",
                  value: `${stats.waterProd} m³ / ${stats.waterCons} m³`,
                  color: "#60a5fa",
                },
                {
                  label: "Receita Tributária (Mês)",
                  value: formatMoney(stats.receitaUltimoMes),
                  color: "#38bdf8",
                },
                {
                  label: "Custo Manutenção (Mês)",
                  value: formatMoney(stats.despesaUltimoMes),
                  color: "#fb923c",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-md bg-white/[0.03] px-[calc(var(--u)*0.7)] py-[calc(var(--u)*0.4)]"
                >
                  <div className="flex items-center gap-[calc(var(--u)*0.4)]">
                    <span
                      className="h-[calc(var(--u)*0.4)] w-[calc(var(--u)*0.4)] rounded-full"
                      style={{ background: stat.color }}
                    />
                    <span className="text-[calc(var(--u)*0.72)] text-slate-300">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-[calc(var(--u)*0.78)] font-semibold text-slate-100">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      {financePanelOpen && (
        <aside className="tc-slideRight absolute left-[calc(var(--u)*1)] top-[calc(var(--u)*4.5)] z-20 w-[calc(var(--u)*24)]">
          <div className="hud-panel-solid rounded-lg p-4 shadow-2xl border border-emerald-500/30">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 mb-3">
              <span className="text-sm font-bold tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Percent className="h-4 w-4" />
                POLÍTICA FISCAL & TRIBUTOS
              </span>
              <button
                type="button"
                onClick={() => setFinancePanelOpen(false)}
                className="hud-btn rounded p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              Defina a alíquota municipal de arrecadação. Impostos menores
              atraem mais moradores e aumentam a felicidade; impostos maiores
              aceleram o saldo do tesouro.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                {
                  id: "baixa",
                  label: "Baixa",
                  tax: "7%",
                  desc: "+Felicidade / +Imigração",
                },
                {
                  id: "normal",
                  label: "Moderada",
                  tax: "10%",
                  desc: "Balanceado",
                },
                {
                  id: "alta",
                  label: "Alta",
                  tax: "15%",
                  desc: "Máxima Arrecadação",
                },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    cidade.definirPoliticaFiscal(p.id);
                    setTick((t) => t + 1);
                  }}
                  className={[
                    "hud-btn flex flex-col items-center rounded-lg border p-2 text-center transition",
                    stats.politicaFiscal === p.id
                      ? "active border-emerald-400 bg-emerald-500/20 text-emerald-200"
                      : "border-slate-700/50 bg-slate-800/40 text-slate-400 hover:text-slate-200",
                  ].join(" ")}
                >
                  <span className="text-xs font-bold">{p.label}</span>
                  <span className="text-[10px] text-emerald-400">{p.tax}</span>
                  <span className="text-[8px] mt-1 text-slate-400">
                    {p.desc}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-1 text-xs border-t border-slate-700/50 pt-3">
              <div className="flex justify-between text-slate-300">
                <span>Receita Mensal Estimada:</span>
                <span className="text-emerald-400 font-semibold">
                  {formatMoney(cidade.recursos.receitaMensalProjetada || 0)}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Despesa Mensal Estimada:</span>
                <span className="text-rose-400 font-semibold">
                  {formatMoney(cidade.recursos.despesaMensalProjetada || 0)}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-slate-700/30">
                <span>Balanço Líquido:</span>
                <span
                  className={
                    stats.saldoMensalProjetado >= 0
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }
                >
                  {formatMoney(stats.saldoMensalProjetado)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      )}

      {notifPanelOpen && (
        <aside className="tc-slideRight absolute right-[calc(var(--u)*4.5)] top-[calc(var(--u)*4.5)] z-30 w-72 sm:w-80 max-h-[calc(100vh-14rem)] flex flex-col">
          <div className="hud-panel-solid rounded-lg p-[calc(var(--u)*1)] shadow-xl flex flex-col flex-1 overflow-hidden">
            <div className="mb-2 flex items-center justify-between border-b border-slate-700/50 pb-2">
              <span className="text-xs font-semibold tracking-wider text-sky-300 flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5" />
                AVISOS & NOTÍCIAS
              </span>
              <button
                type="button"
                onClick={() => setNotifPanelOpen(false)}
                className="hud-btn rounded p-1 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {cidade.notificacoes.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">
                  Nenhum aviso no momento.
                </p>
              ) : (
                cidade.notificacoes.map((n) => (
                  <div
                    key={n.id}
                    className="rounded bg-slate-800/40 border border-slate-700/30 p-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>{n.hora}</span>
                      <span
                        className={[
                          "uppercase font-semibold text-[9px]",
                          n.tipo === "sucesso"
                            ? "text-emerald-400"
                            : n.tipo === "alerta"
                              ? "text-amber-400"
                              : "text-sky-400",
                        ].join(" ")}
                      >
                        {n.tipo}
                      </span>
                    </div>
                    <p className="text-slate-200">{n.mensagem}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      )}

      {selectedTile && selectedTile.building && (
        <div className="tc-slideUp absolute left-4 top-[calc(var(--u)*4.5)] z-30 w-80 sm:w-88 max-h-[calc(100vh-14rem)] flex flex-col">
          <div className="hud-panel-solid rounded-lg p-3.5 shadow-2xl border border-sky-500/30 flex flex-col flex-1 overflow-hidden">
            <div className="flex items-start justify-between border-b border-slate-700/60 pb-3 mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: selectedTile.building.cor }}
                  />
                  {selectedTile.building.nome}
                </h3>
                <span className="text-xs text-slate-400 uppercase tracking-wider">
                  {selectedTile.building.categoria} • Nível{" "}
                  {selectedTile.building.nivel} • ({selectedTile.x},{" "}
                  {selectedTile.y})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTile(null)}
                className="hud-btn rounded p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2 mb-2">
              <p className="text-xs text-slate-300/90 italic">
                {selectedTile.building.descricao || "Estrutura urbana ativa."}
              </p>

              <div className="space-y-1.5 text-xs">
                {selectedTile.building.categoria === "residencial" && (
                  <div className="rounded bg-white/[0.04] p-2 space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-400">Moradores:</span>
                      <span className="text-emerald-300">
                        {selectedTile.building.moradores.length} /{" "}
                        {selectedTile.building.capacidadeHabitantes}
                      </span>
                    </div>
                    {cidade.populacao.obterMoradoresDe(selectedTile.building.id)
                      .length > 0 ? (
                      <div className="pt-1 border-t border-slate-700/40 space-y-1 max-h-36 overflow-y-auto">
                        {cidade.populacao
                          .obterMoradoresDe(selectedTile.building.id)
                          .map((m) => (
                            <div
                              key={m.id}
                              onClick={() => setSelectedCitizen(m)}
                              className="flex items-center justify-between text-[11px] p-1 rounded bg-black/20 hover:bg-sky-500/20 cursor-pointer"
                            >
                              <span className="text-slate-200">{m.nome}</span>
                              <span className="text-slate-400 text-[10px]">
                                {m.profissao}
                              </span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic">
                        Nenhum morador alocado ainda.
                      </p>
                    )}
                  </div>
                )}

                {selectedTile.building.capacidadeEmpregos > 0 && (
                  <div className="rounded bg-white/[0.04] p-2 space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-400">Trabalhadores:</span>
                      <span className="text-sky-300">
                        {selectedTile.building.trabalhadores.length} /{" "}
                        {selectedTile.building.capacidadeEmpregos}
                      </span>
                    </div>
                    {cidade.populacao.obterTrabalhadoresDe(
                      selectedTile.building.id,
                    ).length > 0 ? (
                      <div className="pt-1 border-t border-slate-700/40 space-y-1 max-h-36 overflow-y-auto">
                        {cidade.populacao
                          .obterTrabalhadoresDe(selectedTile.building.id)
                          .map((t) => (
                            <div
                              key={t.id}
                              onClick={() => setSelectedCitizen(t)}
                              className="flex items-center justify-between text-[11px] p-1 rounded bg-black/20 hover:bg-sky-500/20 cursor-pointer"
                            >
                              <span className="text-slate-200">{t.nome}</span>
                              <span className="text-emerald-400 text-[10px]">
                                {formatMoney(t.salario)}
                              </span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic">
                        Vagas livres aguardando contratações.
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-between rounded bg-white/[0.04] p-2">
                  <span className="text-slate-400">Arrecadação Base:</span>
                  <span className="font-semibold text-emerald-400">
                    {formatMoney(selectedTile.building.calcularReceita())}
                  </span>
                </div>

                <div className="flex justify-between rounded bg-white/[0.04] p-2">
                  <span className="text-slate-400">Custo Manutenção:</span>
                  <span className="font-semibold text-amber-400">
                    {formatMoney(selectedTile.building.calcularManutencao())}
                  </span>
                </div>

                <div className="flex justify-between rounded bg-white/[0.04] p-2">
                  <span className="text-slate-400">Energia / Água:</span>
                  <span className="font-semibold text-slate-200">
                    {selectedTile.building.producaoEnergia > 0
                      ? `+${selectedTile.building.producaoEnergia} kW`
                      : `-${selectedTile.building.consumoEnergia} kW`}{" "}
                    ⚡ •{" "}
                    {selectedTile.building.producaoAgua > 0
                      ? `+${selectedTile.building.producaoAgua} m³`
                      : `-${selectedTile.building.consumoAgua} m³`}{" "}
                    💧
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
              <button
                type="button"
                onClick={() => handleUpgrade(selectedTile.x, selectedTile.y)}
                className="hud-btn flex-1 flex items-center justify-center gap-1.5 rounded-md bg-sky-500/20 border border-sky-400/40 py-1.5 text-xs font-semibold text-sky-200 hover:bg-sky-500/30 transition"
              >
                <ArrowUpCircle className="h-3.5 w-3.5" />
                Melhorar (R${" "}
                {Math.round(
                  selectedTile.building.custoConstrucao *
                    0.7 *
                    selectedTile.building.nivel,
                ).toLocaleString("pt-BR")}
                )
              </button>

              {(selectedTile.building.nome === "Ponte" ||
                selectedTile.building.nome === "Estrada") && (
                <button
                  type="button"
                  onClick={handleRotateSelected}
                  className="hud-btn flex items-center justify-center gap-1 rounded-md bg-amber-500/20 border border-amber-400/40 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition"
                  title="Girar orientação da via (ou pressione R no teclado)"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  Girar (R)
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  handleDemolishSelected(selectedTile.x, selectedTile.y)
                }
                className="hud-btn flex items-center justify-center gap-1 rounded-md bg-red-500/20 border border-red-400/40 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/30 transition"
                title="Demolir este edifício"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!infoPanelOpen && !notifPanelOpen && (
        <button
          type="button"
          onClick={() => {
            setInfoPanelOpen(true);
            setNotifPanelOpen(false);
          }}
          className="hud-btn hud-panel absolute right-[calc(var(--u)*18.5)] top-[calc(var(--u)*4.5)] z-20 flex items-center gap-[calc(var(--u)*0.3)] rounded-md border px-[calc(var(--u)*0.6)] py-[calc(var(--u)*0.5)]"
          title="Abrir painel de informações"
        >
          <ChevronRight
            className="h-[calc(var(--u)*1.1)] w-[calc(var(--u)*1.1)] rotate-180 text-slate-400"
            strokeWidth={1.8}
          />
          <span className="text-[calc(var(--u)*0.7)] tracking-wider text-slate-400">
            INFO
          </span>
        </button>
      )}

      {menuOpen && (
        <div className="tc-fade absolute right-[calc(var(--u)*1)] top-[calc(var(--u)*4)] z-30">
          <div className="hud-panel-solid min-w-[calc(var(--u)*14)] rounded-lg p-[calc(var(--u)*0.5)]">
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem(
                    "cidade_salva",
                    JSON.stringify(cidade.toJSON()),
                  );
                  showFeedback(
                    "Cidade salva com sucesso no armazenamento local!",
                    "sucesso",
                  );
                } catch {
                  showFeedback("Erro ao salvar cidade.", "alerta");
                }
                setMenuOpen(false);
              }}
              className="hud-btn flex w-full items-center gap-[calc(var(--u)*0.6)] rounded-md border border-transparent px-[calc(var(--u)*0.8)] py-[calc(var(--u)*0.45)] text-left"
            >
              <Coins
                className="h-[calc(var(--u)*1)] w-[calc(var(--u)*1)] text-slate-400"
                strokeWidth={1.6}
              />
              <span className="text-[calc(var(--u)*0.8)] tracking-wide text-slate-200">
                Salvar Cidade
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onBack) onBack();
              }}
              className="hud-btn flex w-full items-center gap-[calc(var(--u)*0.6)] rounded-md border border-transparent px-[calc(var(--u)*0.8)] py-[calc(var(--u)*0.45)] text-left"
            >
              <Menu
                className="h-[calc(var(--u)*1)] w-[calc(var(--u)*1)] text-slate-400"
                strokeWidth={1.6}
              />
              <span className="text-[calc(var(--u)*0.8)] tracking-wide text-slate-200">
                Menu Principal
              </span>
            </button>
          </div>
        </div>
      )}

      <span className="absolute bottom-[calc(var(--u)*15.5)] right-[calc(var(--u)*0.8)] z-10 text-[calc(var(--u)*0.6)] tracking-wider text-slate-500/50">
        v1.4.0 • Pessoas Reais & Simulação Viva
      </span>
    </div>
  );
}
