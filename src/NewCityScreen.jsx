import { useState } from "react";
import {
  MapPin,
  User,
  Building2,
  ChevronRight,
  Sparkles,
  Mountain,
  TreePine,
  Waves,
  BarChart3,
  Coins,
  ArrowLeft,
} from "lucide-react";

const MAPS = [
  {
    id: "planicie",
    name: "Planície Verde",
    icon: TreePine,
    desc: "Terreno plano com rios — ideal para iniciantes.",
    color: "#4ade80",
  },
  {
    id: "litoral",
    name: "Litoral",
    icon: Waves,
    desc: "Costa oceânica com praia — turismo e pesca.",
    color: "#38bdf8",
  },
  {
    id: "montanha",
    name: "Vale da Serra",
    icon: Mountain,
    desc: "Montanhas e vales — desafiador mas rico em recursos.",
    color: "#a78bfa",
  },
  {
    id: "deserto",
    name: "Deserto Árido",
    icon: Sparkles,
    desc: "Seco e quente — água é escassa, mas o espaço é vasto.",
    color: "#fbbf24",
  },
];

const DIFFICULTIES = [
  {
    id: "facil",
    label: "Fácil",
    desc: "Mais dinheiro inicial, cidadãos pacientes.",
    money: 150000,
    color: "#4ade80",
  },
  {
    id: "normal",
    label: "Normal",
    desc: "Experiência balanceada para todos.",
    money: 100000,
    color: "#60a5fa",
  },
  {
    id: "dificil",
    label: "Difícil",
    desc: "Orçamento apertado, cidadãos exigentes.",
    money: 50000,
    color: "#f59e0b",
  },
  {
    id: "extremo",
    label: "Extremo",
    desc: "Quase nada. Boa sorte, prefeito.",
    money: 20000,
    color: "#ef4444",
  },
];

const CITY_SIZES = [
  { id: "small", label: "Pequena", tiles: "20×20", pop: "até 5.000" },
  { id: "medium", label: "Média", tiles: "26×26", pop: "até 25.000" },
  { id: "large", label: "Grande", tiles: "32×32", pop: "até 100.000" },
];

export default function NewCityScreen({ onStart, onBack }) {
  const [cityName, setCityName] = useState("");
  const [mayorName, setMayorName] = useState("");
  const [selectedMap, setSelectedMap] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(1);

  const canStart = cityName.trim().length >= 2;

  const handleStart = () => {
    if (!canStart) return;
    if (onStart) {
      onStart({
        cityName: cityName.trim(),
        mayorName: mayorName.trim() || "Prefeito(a)",
        map: MAPS[selectedMap].id,
        difficulty: DIFFICULTIES[selectedDifficulty].id,
        size: CITY_SIZES[selectedSize].id,
        mapSize: [20, 26, 32][selectedSize],
        difficultyLabel: DIFFICULTIES[selectedDifficulty].label,
        startingMoney: DIFFICULTIES[selectedDifficulty].money,
      });
    }
  };

  return (
    <div className="tc-root relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#070b14] font-['Montserrat',sans-serif] text-slate-200 select-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@300;400;500;600;700&display=swap');
        .tc-root { --u: min(1vw, 1.78vh); }
        @media (max-width: 820px) { .tc-root { --u: max(min(2.4vw, 1.78vh), 3.2px); } }
        @keyframes nc-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes nc-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .nc-fade { opacity: 0; animation: nc-fade 0.8s ease-out forwards; }
        .nc-rise { opacity: 0; animation: nc-rise 0.7s ease-out forwards; }
        .nc-panel {
          background: linear-gradient(145deg, rgba(10,20,36,0.92) 0%, rgba(6,12,22,0.96) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(100,160,250,0.12);
        }
        .nc-input {
          background: rgba(8,16,30,0.8);
          border: 1px solid rgba(100,160,250,0.18);
          transition: all 0.25s ease-out;
        }
        .nc-input:focus {
          border-color: rgba(56,152,255,0.5);
          box-shadow: 0 0 12px rgba(56,152,255,0.15), inset 0 0 6px rgba(56,152,255,0.06);
          outline: none;
        }
        .nc-input::placeholder { color: rgba(148,163,184,0.4); }
        .nc-option {
          background: rgba(8,16,30,0.6);
          border: 1px solid rgba(100,160,250,0.1);
          transition: all 0.2s ease-out;
          cursor: pointer;
        }
        .nc-option:hover {
          border-color: rgba(100,160,250,0.25);
          background: rgba(12,24,50,0.7);
        }
        .nc-option.selected {
          border-color: rgba(56,152,255,0.55);
          background: rgba(13,37,69,0.7);
          box-shadow: 0 0 14px rgba(56,152,255,0.15), inset 0 0 10px rgba(56,152,255,0.08);
        }
        .nc-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(100,160,250,0.2), transparent);
        }
        @media (prefers-reduced-motion: reduce) {
          .nc-fade, .nc-rise { animation-duration: 0.01s; animation-delay: 0s !important; }
        }
      `}</style>

      <div className="absolute inset-0 bg-gradient-to-br from-[#060d1a] via-[#0a1628] to-[#081020]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 20%, rgba(56,152,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(56,152,255,0.05) 0%, transparent 50%)",
        }}
      />

      <div className="nc-fade relative z-10 flex h-[calc(var(--u)*52)] max-h-[92vh] w-[calc(var(--u)*72)] max-w-[96vw] flex-col">

        <div className="nc-rise mb-[calc(var(--u)*1.5)] flex items-center gap-[calc(var(--u)*1.2)]" style={{ animationDelay: "0.1s" }}>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-[calc(var(--u)*0.4)] rounded-md border border-slate-600/30 bg-slate-800/30 px-[calc(var(--u)*0.8)] py-[calc(var(--u)*0.35)] transition-all duration-200 hover:border-sky-400/40 hover:bg-[#0d2545]/50"
          >
            <ArrowLeft className="h-[calc(var(--u)*1.1)] w-[calc(var(--u)*1.1)] text-slate-400" strokeWidth={1.8} />
            <span className="text-[calc(var(--u)*0.75)] tracking-wider text-slate-400">VOLTAR</span>
          </button>
          <div className="flex-1" />
          <Building2 className="h-[calc(var(--u)*1.8)] w-[calc(var(--u)*1.8)] text-sky-400/70" strokeWidth={1.6} />
          <h1 className="text-[calc(var(--u)*1.6)] font-semibold tracking-[0.2em] text-slate-100">
            NOVA CIDADE
          </h1>
          <div className="flex-1" />
          <div className="w-[calc(var(--u)*7)]" />
        </div>

        <div className="nc-panel nc-rise flex flex-1 flex-col overflow-hidden rounded-xl" style={{ animationDelay: "0.2s" }}>
          <div className="flex flex-1 overflow-y-auto">
            
            <div className="flex flex-1 flex-col gap-[calc(var(--u)*1.8)] overflow-y-auto p-[calc(var(--u)*2.5)] pr-[calc(var(--u)*1.5)]">

              <div>
                <label className="mb-[calc(var(--u)*0.5)] flex items-center gap-[calc(var(--u)*0.5)] text-[calc(var(--u)*0.8)] font-semibold tracking-[0.15em] text-sky-300/90">
                  <Building2 className="h-[calc(var(--u)*1)] w-[calc(var(--u)*1)]" strokeWidth={1.8} />
                  NOME DA CIDADE
                </label>
                <input
                  type="text"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="Ex: Nova Tristeza"
                  maxLength={30}
                  className="nc-input w-full rounded-lg px-[calc(var(--u)*1.2)] py-[calc(var(--u)*0.7)] text-[calc(var(--u)*1)] tracking-wide text-slate-100"
                />
                {cityName.length > 0 && cityName.trim().length < 2 && (
                  <p className="mt-[calc(var(--u)*0.3)] text-[calc(var(--u)*0.65)] text-red-400/80">
                    Mínimo 2 caracteres
                  </p>
                )}
              </div>

              <div>
                <label className="mb-[calc(var(--u)*0.5)] flex items-center gap-[calc(var(--u)*0.5)] text-[calc(var(--u)*0.8)] font-semibold tracking-[0.15em] text-sky-300/90">
                  <User className="h-[calc(var(--u)*1)] w-[calc(var(--u)*1)]" strokeWidth={1.8} />
                  NOME DO PREFEITO(A)
                </label>
                <input
                  type="text"
                  value={mayorName}
                  onChange={(e) => setMayorName(e.target.value)}
                  placeholder="Opcional — padrão: Prefeito(a)"
                  maxLength={25}
                  className="nc-input w-full rounded-lg px-[calc(var(--u)*1.2)] py-[calc(var(--u)*0.7)] text-[calc(var(--u)*1)] tracking-wide text-slate-100"
                />
              </div>

              <div className="nc-divider" />

              <div>
                <label className="mb-[calc(var(--u)*0.6)] flex items-center gap-[calc(var(--u)*0.5)] text-[calc(var(--u)*0.8)] font-semibold tracking-[0.15em] text-sky-300/90">
                  <BarChart3 className="h-[calc(var(--u)*1)] w-[calc(var(--u)*1)]" strokeWidth={1.8} />
                  DIFICULDADE
                </label>
                <div className="grid grid-cols-2 gap-[calc(var(--u)*0.5)]">
                  {DIFFICULTIES.map((d, i) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDifficulty(i)}
                      className={[
                        "nc-option flex flex-col items-start rounded-lg px-[calc(var(--u)*1)] py-[calc(var(--u)*0.6)] text-left",
                        selectedDifficulty === i ? "selected" : "",
                      ].join(" ")}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span
                          className="text-[calc(var(--u)*0.85)] font-semibold tracking-wide"
                          style={{ color: d.color }}
                        >
                          {d.label}
                        </span>
                        <span className="flex items-center gap-[calc(var(--u)*0.2)] text-[calc(var(--u)*0.7)] text-emerald-400/70">
                          <Coins className="h-[calc(var(--u)*0.75)] w-[calc(var(--u)*0.75)]" strokeWidth={1.6} />
                          {d.money.toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <span className="mt-[calc(var(--u)*0.2)] text-[calc(var(--u)*0.65)] leading-snug text-slate-400">
                        {d.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="nc-divider" />

              <div>
                <label className="mb-[calc(var(--u)*0.6)] flex items-center gap-[calc(var(--u)*0.5)] text-[calc(var(--u)*0.8)] font-semibold tracking-[0.15em] text-sky-300/90">
                  <Sparkles className="h-[calc(var(--u)*1)] w-[calc(var(--u)*1)]" strokeWidth={1.8} />
                  TAMANHO DO MAPA
                </label>
                <div className="flex gap-[calc(var(--u)*0.5)]">
                  {CITY_SIZES.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSize(i)}
                      className={[
                        "nc-option flex flex-1 flex-col items-center rounded-lg px-[calc(var(--u)*0.6)] py-[calc(var(--u)*0.55)] text-center",
                        selectedSize === i ? "selected" : "",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "text-[calc(var(--u)*0.85)] font-semibold tracking-wide",
                          selectedSize === i ? "text-sky-300" : "text-slate-200",
                        ].join(" ")}
                      >
                        {s.label}
                      </span>
                      <span className="text-[calc(var(--u)*0.6)] text-slate-500">
                        {s.tiles}
                      </span>
                      <span className="text-[calc(var(--u)*0.6)] text-slate-400">
                        {s.pop}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex w-[40%] shrink-0 flex-col border-l border-sky-400/10 p-[calc(var(--u)*2.5)] pl-[calc(var(--u)*2)]">
              <label className="mb-[calc(var(--u)*0.8)] flex items-center gap-[calc(var(--u)*0.5)] text-[calc(var(--u)*0.8)] font-semibold tracking-[0.15em] text-sky-300/90">
                <MapPin className="h-[calc(var(--u)*1)] w-[calc(var(--u)*1)]" strokeWidth={1.8} />
                TIPO DE TERRENO
              </label>

              <div className="flex flex-1 flex-col gap-[calc(var(--u)*0.7)] overflow-y-auto">
                {MAPS.map((m, i) => {
                  const MIcon = m.icon;
                  const active = selectedMap === i;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMap(i)}
                      className={[
                        "nc-option flex items-start gap-[calc(var(--u)*0.9)] rounded-xl p-[calc(var(--u)*1)] text-left",
                        active ? "selected" : "",
                      ].join(" ")}
                    >
                      <div
                        className="mt-[calc(var(--u)*0.2)] flex h-[calc(var(--u)*2.4)] w-[calc(var(--u)*2.4)] shrink-0 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: `${m.color}15`,
                          border: `1px solid ${active ? m.color : `${m.color}30`}`,
                        }}
                      >
                        <MIcon
                          className="h-[calc(var(--u)*1.3)] w-[calc(var(--u)*1.3)]"
                          strokeWidth={1.8}
                          style={{ color: m.color }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={[
                            "text-[calc(var(--u)*0.9)] font-semibold tracking-wide",
                            active ? "text-slate-100" : "text-slate-300",
                          ].join(" ")}
                        >
                          {m.name}
                        </span>
                        <span className="mt-[calc(var(--u)*0.2)] text-[calc(var(--u)*0.7)] leading-relaxed text-slate-400">
                          {m.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-sky-400/10 px-[calc(var(--u)*2.5)] py-[calc(var(--u)*1.2)]">
            <div className="flex items-center gap-[calc(var(--u)*2)]">
              <div className="flex items-center gap-[calc(var(--u)*0.4)]">
                <Coins
                  className="h-[calc(var(--u)*1)] w-[calc(var(--u)*1)] text-emerald-400/70"
                  strokeWidth={1.6}
                />
                <span className="text-[calc(var(--u)*0.75)] text-slate-400">
                  Orçamento inicial:
                </span>
                <span className="text-[calc(var(--u)*0.85)] font-semibold text-emerald-300">
                  {DIFFICULTIES[selectedDifficulty].money.toLocaleString(
                    "pt-BR",
                    { style: "currency", currency: "BRL" },
                  )}
                </span>
              </div>
              <div className="flex items-center gap-[calc(var(--u)*0.4)]">
                <MapPin
                  className="h-[calc(var(--u)*1)] w-[calc(var(--u)*1)] text-sky-400/70"
                  strokeWidth={1.6}
                />
                <span className="text-[calc(var(--u)*0.75)] text-slate-400">
                  Mapa:
                </span>
                <span className="text-[calc(var(--u)*0.85)] font-semibold text-slate-200">
                  {MAPS[selectedMap].name}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
              className={[
                "group flex items-center gap-[calc(var(--u)*0.7)] rounded-lg border px-[calc(var(--u)*2.5)] py-[calc(var(--u)*0.7)] transition-all duration-300",
                canStart
                  ? "border-sky-400/60 bg-sky-500/15 text-sky-300 shadow-[0_0_16px_rgba(56,152,255,0.2)] hover:bg-sky-500/25 hover:shadow-[0_0_24px_rgba(56,152,255,0.3)]"
                  : "cursor-not-allowed border-slate-600/30 bg-slate-800/20 text-slate-500",
              ].join(" ")}
            >
              <span className="text-[calc(var(--u)*0.95)] font-semibold tracking-[0.2em]">
                FUNDAR CIDADE
              </span>
              <ChevronRight
                className={[
                  "h-[calc(var(--u)*1.3)] w-[calc(var(--u)*1.3)] transition-transform duration-300",
                  canStart ? "group-hover:translate-x-[4px]" : "",
                ].join(" ")}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
