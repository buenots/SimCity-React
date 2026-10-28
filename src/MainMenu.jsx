import { useState } from "react";
import { Play, Save, Settings, LogOut, Building2 } from "lucide-react";

const BACKGROUND = "./Background.png";

const SKYLINE = [
  [0, 6, 14, 0],
  [18, 12, 24, 0],
  [32, 14, 18, 0],
  [48, 10, 30, 0],
  [60, 26, 36, 0],
  [88, 12, 22, 0],
  [102, 22, 48, 0],
  [126, 12, 26, 0],
  [140, 8, 20, 0],
  [150, 22, 34, 0],
  [174, 16, 62, 0],
  [192, 10, 24, 0],
  [204, 14, 40, 0],
  [220, 10, 30, 0],
  [232, 14, 26, 0],
  [248, 14, 70, 14],
  [264, 10, 32, 0],
  [276, 12, 46, 0],
  [290, 8, 28, 0],
  [300, 18, 84, 16],
  [320, 12, 34, 0],
  [334, 16, 50, 0],
  [352, 12, 28, 0],
  [366, 14, 24, 0],
  [382, 12, 32, 0],
  [396, 16, 20, 0],
  [414, 14, 16, 0],
];

export default function MainMenu({ onPlay }) {
  const [selected, setSelected] = useState(0);

  const handleNewGame = () => {
    if (onPlay) onPlay();
  };
  const handleContinue = () => {
    if (onPlay) onPlay();
  };
  const handleOptions = () => {};
  const handleExit = () => {};

  const menu = [
    { label: "NOVA CIDADE", icon: Play, onClick: handleNewGame, filled: true },
    { label: "CONTINUAR", icon: Save, onClick: handleContinue },
    { label: "OPÇÕES", icon: Settings, onClick: handleOptions },
    { label: "SAIR", icon: LogOut, onClick: handleExit },
  ];

  return (
    <div className="tc-root relative h-screen w-screen overflow-hidden bg-[#070b14] font-['Montserrat',sans-serif] text-slate-200 select-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@300;400;500;600&display=swap');
        .tc-root { --u: min(1vw, 1.78vh); }
        @media (max-width: 820px) { .tc-root { --u: max(min(2.4vw, 1.78vh), 3.2px); } }
        @keyframes tc-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tc-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tc-slide { from { opacity: 0; transform: translateX(-18px); } to { opacity: 1; transform: translateX(0); } }
        .tc-fade  { opacity: 0; animation: tc-fade 1.6s ease-out forwards; }
        .tc-rise  { opacity: 0; animation: tc-rise 1.2s ease-out forwards; }
        .tc-slide { opacity: 0; animation: tc-slide 0.9s cubic-bezier(.2,.7,.2,1) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .tc-fade, .tc-rise, .tc-slide { animation-duration: 0.01s; animation-delay: 0s !important; }
        }
      `}</style>

      <img
        src={BACKGROUND}
        alt="imagem"
        draggable={false}
        className="tc-fade absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050a14]/90 via-[#050a14]/45 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_14vw_rgba(0,0,0,0.65)]" />

      <header className="absolute left-[calc(var(--u)*5.9)] top-[calc(var(--u)*3.7)] w-[calc(var(--u)*30.2)]">
        <svg
          viewBox="0 0 430 110"
          className="tc-fade block w-full"
          style={{ animationDelay: "0.2s" }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="tc-skyline" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f1efec" />
              <stop offset="100%" stopColor="#a9a7a6" />
            </linearGradient>
            <linearGradient id="tc-title" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f4f2ef" />
              <stop offset="55%" stopColor="#d9d5d1" />
              <stop offset="100%" stopColor="#a8a3a0" />
            </linearGradient>
          </defs>
          <g fill="url(#tc-skyline)">
            {SKYLINE.map(([x, w, h, spire], i) => (
              <g key={i}>
                <rect x={x} y={100 - h} width={w} height={h} />
                {spire > 0 && (
                  <rect
                    x={x + w / 2 - 0.9}
                    y={100 - h - spire}
                    width="1.8"
                    height={spire}
                  />
                )}
              </g>
            ))}
            <rect x="0" y="98" width="430" height="3" />
          </g>

          <g fill="#0b1220" opacity="0.55">
            {SKYLINE.filter(([, , h]) => h >= 40).flatMap(([x, w, h], i) =>
              Array.from({ length: Math.floor(h / 8) }).map((_, r) => (
                <rect
                  key={`${i}-${r}`}
                  x={x + w / 2 - 1}
                  y={100 - h + 5 + r * 8}
                  width="2"
                  height="3"
                />
              )),
            )}
          </g>
        </svg>

        <svg
          viewBox="0 0 505 100"
          className="tc-rise -mt-[calc(var(--u)*0.4)] block w-[calc(var(--u)*30.2)]"
          style={{ animationDelay: "0.45s" }}
          role="img"
          aria-label="Tristeza"
        >
          <g filter="url(#tc-worn)">
            <text
              x="0"
              y="105"
              fill="url(#tc-title)"
              fontFamily="'Anton', Impact, 'Arial Narrow', sans-serif"
              fontSize="122"
              textLength="505"
              lengthAdjust="spacingAndGlyphs"
              stroke="#e9e6e3"
              strokeWidth="1"
              style={{ paintOrder: "stroke" }}
            >
              TRISTEZA
            </text>
          </g>
        </svg>

        <div
          className="tc-rise flex items-center gap-[calc(var(--u)*1.6)]"
          style={{ animationDelay: "0.7s" }}
        >
          <span className="h-px flex-1 bg-slate-200/70" />
          <span className="pl-[0.55em] text-[calc(var(--u)*3.9)] font-light leading-none tracking-[0.55em] text-slate-200/90">
            CITY
          </span>
          <span className="h-px flex-1 bg-slate-200/70" />
        </div>

        <p
          className="tc-rise mt-[calc(var(--u)*3.1)] text-left text-[calc(var(--u)*1)] font-light leading-[1.55] tracking-[0.14em] text-slate-300/85"
          style={{ animationDelay: "0.95s" }}
        >
          Tenta não matar todo mundo
          <br />
          senão tu vai perder
        </p>
      </header>

      <nav className="absolute left-[calc(var(--u)*5.9)] top-[calc(var(--u)*27.5)] flex w-[calc(var(--u)*23.5)] flex-col gap-[calc(var(--u)*0.55)]">
        {menu.map(({ label, icon: Icon, onClick, filled }, i) => {
          const active = selected === i;
          return (
            <button
              key={label}
              type="button"
              onClick={onClick}
              onMouseEnter={() => setSelected(i)}
              onFocus={() => setSelected(i)}
              style={{ animationDelay: `${1.1 + i * 0.14}s` }}
              className={[
                "tc-slide group relative flex h-[calc(var(--u)*3.9)] w-full items-center overflow-hidden rounded-[3px] border pl-[calc(var(--u)*1.5)] text-left",
                "transition-all duration-300 ease-out hover:scale-[1.01] hover:brightness-125",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-300/70",
                active
                  ? "border-sky-400/80 bg-[#0d2545]/75 shadow-[0_0_calc(var(--u)*1.4)_rgba(56,152,255,0.28),inset_0_0_calc(var(--u)*1.2)_rgba(56,152,255,0.12)]"
                  : "border-slate-500/35 bg-[#0a1424]/60 shadow-[0_2px_10px_rgba(0,0,0,0.35)] hover:border-sky-400/50 hover:bg-[#0c2040]/70",
              ].join(" ")}
            >
              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-sky-200/10 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100" />

              <Icon
                className={[
                  "h-[calc(var(--u)*1.75)] w-[calc(var(--u)*1.75)] shrink-0 transition-all duration-300 ease-out",
                  active
                    ? "text-sky-400"
                    : "text-slate-400 group-hover:text-slate-100",
                ].join(" ")}
                fill={filled ? "currentColor" : "none"}
                strokeWidth={1.6}
              />
              <span
                className={[
                  "ml-[calc(var(--u)*2.1)] text-[calc(var(--u)*1.1)] font-semibold tracking-[0.2em] transition-colors duration-300 ease-out",
                  active
                    ? "text-sky-300"
                    : "text-slate-300 group-hover:text-white",
                ].join(" ")}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      <footer
        className="tc-fade absolute bottom-0 left-0 flex items-center bg-gradient-to-r from-black/55 via-black/25 to-transparent py-[calc(var(--u)*1.6)] pl-[calc(var(--u)*4.5)] pr-[calc(var(--u)*14)]"
        style={{ animationDelay: "1.9s" }}
      >
        <Building2
          className="h-[calc(var(--u)*2.4)] w-[calc(var(--u)*2.4)] text-slate-300/80"
          strokeWidth={1.4}
        />
        <span className="mx-[calc(var(--u)*1.5)] h-[calc(var(--u)*2.9)] w-[2px] bg-sky-400/90" />
        <div className="leading-tight">
          <p className="text-[calc(var(--u)*1.05)] font-semibold tracking-wide text-slate-100">
            Cidade Salva
          </p>
          <p className="mt-[calc(var(--u)*0.3)] text-[calc(var(--u)*0.85)] tracking-wide text-slate-300/85">
            População: muitinha &nbsp;|&nbsp; Felicidade: sixseven%
          </p>
        </div>
      </footer>

      <aside
        className="tc-fade absolute right-[calc(var(--u)*2.2)] top-[calc(var(--u)*1.5)] text-right"
        style={{ animationDelay: "1.6s" }}
      >
        <p className="text-[calc(var(--u)*0.85)] font-light uppercase leading-[1.45] tracking-[0.12em] text-slate-300/85">
          Bruninho Dev
          <br />
          Produções
        </p>
        <span className="ml-auto mt-[calc(var(--u)*0.3)] block h-px w-[calc(var(--u)*5.5)] bg-slate-200/70" />
      </aside>

      <span
        className="tc-fade absolute bottom-[calc(var(--u)*1.8)] right-[calc(var(--u)*2.2)] text-[calc(var(--u)*0.85)] tracking-wider text-slate-300/70"
        style={{ animationDelay: "2s" }}
      >
       alguma versão 2
      </span>
    </div>
  );
}
