import { useState, useRef, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

function ehVia(tile) {
  if (!tile || !tile.building) return false;
  const n = tile.building.nome;
  return n === "Estrada" || n === "Ponte";
}

function obterConexoes(terrain, mapSize, gx, gy) {
  const n = gy > 0 && ehVia(terrain[gy - 1]?.[gx]);
  const s = gy < mapSize - 1 && ehVia(terrain[gy + 1]?.[gx]);
  const l = gx < mapSize - 1 && ehVia(terrain[gy]?.[gx + 1]);
  const o = gx > 0 && ehVia(terrain[gy]?.[gx - 1]);
  return { n, s, l, o };
}

export default function IsometricMap({
  mapSize = 24,
  _mapType = "planicie",
  terrain = null,
  selectedBuilding = null,
  cidade = null,
  selectedTile = null,
  cameraFocus = null,
  onTileClick = () => {},
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredTile, setHoveredTile] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setPan({
        x: clientWidth / 2,
        y: clientHeight / 4,
      });
    }
  }, []);

  const isoToScreen = useCallback((gx, gy) => {
    const sx = (gx - gy) * (TILE_WIDTH / 2);
    const sy = (gx + gy) * (TILE_HEIGHT / 2);
    return { sx, sy };
  }, []);

  useEffect(() => {
    if (cameraFocus && containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const { sx, sy } = isoToScreen(cameraFocus.x, cameraFocus.y);
      setPan({
        x: clientWidth / 2 - sx * zoom,
        y: clientHeight / 2 - sy * zoom,
      });
    }
  }, [cameraFocus, isoToScreen, zoom]);

  const screenToIso = useCallback(
    (clientX, clientY) => {
      if (!containerRef.current) return null;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = (clientX - rect.left - pan.x) / zoom;
      const clickY = (clientY - rect.top - pan.y) / zoom;

      const gx = Math.floor(
        (clickX / (TILE_WIDTH / 2) + clickY / (TILE_HEIGHT / 2)) / 2 + 0.5,
      );
      const gy = Math.floor(
        (clickY / (TILE_HEIGHT / 2) - clickX / (TILE_WIDTH / 2)) / 2 + 0.5,
      );

      if (gx >= 0 && gx < mapSize && gy >= 0 && gy < mapSize) {
        return { x: gx, y: gy };
      }
      return null;
    },
    [pan, zoom, mapSize],
  );

  useEffect(() => {
    let animId;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas || !containerRef.current || !terrain) return;
      const ctx = canvas.getContext("2d");

      const { clientWidth, clientHeight } = containerRef.current;
      if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
        canvas.width = clientWidth;
        canvas.height = clientHeight;
      }

      ctx.clearRect(0, 0, clientWidth, clientHeight);

      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      const tempoSegundos = performance.now() / 1000;

      const TILE_COLORS = {
        grass: {
          top: "#2d5a27",
          left: "#1f411b",
          right: "#244c20",
          border: "#356b2e",
        },
        sand: {
          top: "#c2a649",
          left: "#9e8433",
          right: "#af933b",
          border: "#d4b755",
        },
        water: {
          top: "#1e537d",
          left: "#143a59",
          right: "#184568",
          border: "#286ca0",
        },
        stone: {
          top: "#4b5563",
          left: "#374151",
          right: "#3e4857",
          border: "#64748b",
        },
      };

      const depth = 8;

      for (let gy = 0; gy < mapSize; gy++) {
        for (let gx = 0; gx < mapSize; gx++) {
          const tile = terrain[gy]?.[gx];
          if (!tile) continue;

          const { sx, sy } = isoToScreen(gx, gy);
          const palette = TILE_COLORS[tile.type] || TILE_COLORS.grass;

          const isHovered =
            hoveredTile && hoveredTile.x === gx && hoveredTile.y === gy;
          const isSelected =
            selectedTile && selectedTile.x === gx && selectedTile.y === gy;

          ctx.beginPath();
          ctx.moveTo(sx - TILE_WIDTH / 2, sy);
          ctx.lineTo(sx, sy + TILE_HEIGHT / 2);
          ctx.lineTo(sx, sy + TILE_HEIGHT / 2 + depth);
          ctx.lineTo(sx - TILE_WIDTH / 2, sy + depth);
          ctx.closePath();
          ctx.fillStyle = palette.left;
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(sx, sy + TILE_HEIGHT / 2);
          ctx.lineTo(sx + TILE_WIDTH / 2, sy);
          ctx.lineTo(sx + TILE_WIDTH / 2, sy + depth);
          ctx.lineTo(sx, sy + TILE_HEIGHT / 2 + depth);
          ctx.closePath();
          ctx.fillStyle = palette.right;
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(sx, sy - TILE_HEIGHT / 2);
          ctx.lineTo(sx + TILE_WIDTH / 2, sy);
          ctx.lineTo(sx, sy + TILE_HEIGHT / 2);
          ctx.lineTo(sx - TILE_WIDTH / 2, sy);
          ctx.closePath();

          ctx.fillStyle = isSelected
            ? "#f59e0b88"
            : isHovered
              ? "#38bdf866"
              : palette.top;
          ctx.fill();

          ctx.strokeStyle = isSelected
            ? "#f59e0b"
            : isHovered
              ? "#38bdf8"
              : palette.border;
          ctx.lineWidth = isSelected || isHovered ? 1.5 : 0.6;
          ctx.stroke();

          if (!tile.building) {
            if (tile.detail === "tree") {
              ctx.fillStyle = "#5c3a21";
              ctx.fillRect(sx - 2, sy - 14, 4, 8);
              ctx.beginPath();
              ctx.moveTo(sx, sy - 26);
              ctx.lineTo(sx + 8, sy - 10);
              ctx.lineTo(sx - 8, sy - 10);
              ctx.closePath();
              ctx.fillStyle = "#1e4d1e";
              ctx.fill();
            } else if (tile.detail === "rock") {
              ctx.fillStyle = "#94a3b8";
              ctx.beginPath();
              ctx.arc(sx, sy - 2, 4, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          if (tile.building) {
            const conexoes = obterConexoes(terrain, mapSize, gx, gy);
            desenharEdificio(ctx, sx, sy, tile.building, conexoes, tile.type);
          }

          if (isHovered && selectedBuilding) {
            if (selectedBuilding === "demolir") {
              ctx.strokeStyle = "#ef4444";
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.moveTo(sx - 12, sy - 12);
              ctx.lineTo(sx + 12, sy + 12);
              ctx.moveTo(sx + 12, sy - 12);
              ctx.lineTo(sx - 12, sy + 12);
              ctx.stroke();
            } else {
              let podeConstruir = true;
              if (cidade && cidade.construcao) {
                const check = cidade.construcao.validarConstrucao(
                  cidade,
                  selectedBuilding,
                  gx,
                  gy,
                );
                podeConstruir = check.valido;
              } else {
                podeConstruir = !tile.building;
              }

              const previewColor = podeConstruir
                ? "rgba(74, 222, 128, 0.45)"
                : "rgba(239, 68, 68, 0.45)";
              const previewBorder = podeConstruir ? "#4ade80" : "#ef4444";

              ctx.beginPath();
              ctx.moveTo(sx, sy - TILE_HEIGHT / 2);
              ctx.lineTo(sx + TILE_WIDTH / 2, sy);
              ctx.lineTo(sx, sy + TILE_HEIGHT / 2);
              ctx.lineTo(sx - TILE_WIDTH / 2, sy);
              ctx.closePath();
              ctx.fillStyle = previewColor;
              ctx.fill();
              ctx.strokeStyle = previewBorder;
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          }
        }
      }

      if (cidade && cidade.populacao) {
        const listaHabitantes = cidade.populacao.obterLista();
        const limite = Math.min(50, listaHabitantes.length);
        for (let i = 0; i < limite; i++) {
          const h = listaHabitantes[i];
          const pos = h.obterPosicaoAnimada(tempoSegundos);
          if (pos) {
            const { sx, sy } = isoToScreen(pos.x, pos.y);
            desenharPedestre(ctx, sx, sy, h, tempoSegundos);
          }
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    terrain,
    zoom,
    pan,
    hoveredTile,
    selectedTile,
    selectedBuilding,
    cidade,
    mapSize,
    isoToScreen,
  ]);

  const handleMouseDown = (e) => {
    if (e.button === 0 || e.button === 1) {
      setIsMouseDown(true);
      hasMovedRef.current = false;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    }
  };

  const handleMouseMove = (e) => {
    if (isMouseDown) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.hypot(dx, dy) > 4) {
        hasMovedRef.current = true;
        setPan({
          x: dragStartRef.current.panX + dx,
          y: dragStartRef.current.panY + dy,
        });
      }
    } else {
      const tile = screenToIso(e.clientX, e.clientY);
      setHoveredTile(tile);
    }
  };

  const handleMouseUp = (_e) => {
    if (!hasMovedRef.current) {
      const tile = screenToIso(_e.clientX, _e.clientY);
      if (tile) {
        onTileClick(tile);
      }
    }
    setIsMouseDown(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.35), 2.5));
  };

  const resetView = () => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setPan({
        x: clientWidth / 2,
        y: clientHeight / 4,
      });
      setZoom(1);
    }
  };

  const cursorClass =
    selectedBuilding === "demolir"
      ? "cursor-crosshair"
      : selectedBuilding
        ? "cursor-cell"
        : isMouseDown
          ? "cursor-grabbing"
          : "cursor-grab";

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${cursorClass} overflow-hidden`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />

      <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-1.5 rounded-lg bg-slate-900/80 p-1.5 backdrop-blur-md border border-slate-700/50 shadow-lg">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z * 1.2, 2.5))}
          className="rounded p-1.5 text-slate-300 hover:bg-slate-700/60 hover:text-white transition"
          title="Aproximar Zoom"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(z * 0.8, 0.35))}
          className="rounded p-1.5 text-slate-300 hover:bg-slate-700/60 hover:text-white transition"
          title="Afastar Zoom"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={resetView}
          className="rounded p-1.5 text-slate-300 hover:bg-slate-700/60 hover:text-white transition"
          title="Centralizar Câmera"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function desenharPedestre(ctx, sx, sy, h, tempoSegundos) {
  const fase = Math.sin(tempoSegundos * 14 + h.offsetTempo);

  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath();
  ctx.ellipse(sx, sy + 1, 3.2, 1.6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sx - 1.2, sy - 2);
  ctx.lineTo(sx - 1.4 - fase * 0.8, sy + 1);
  ctx.moveTo(sx + 1.2, sy - 2);
  ctx.lineTo(sx + 1.4 + fase * 0.8, sy + 1);
  ctx.stroke();

  ctx.fillStyle = h.corRoupa || "#38bdf8";
  ctx.fillRect(sx - 2, sy - 7, 4, 5);

  ctx.fillStyle = "#fde047";
  ctx.beginPath();
  ctx.arc(sx, sy - 9.5, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#334155";
  ctx.beginPath();
  ctx.arc(sx, sy - 11, 1.6, Math.PI, 0);
  ctx.fill();
}

function tileToScreen(sx, sy, u, v) {
  return {
    x: sx + (u - v) * (TILE_WIDTH / 2),
    y: sy + (u + v) * (TILE_HEIGHT / 2),
  };
}

function desenharEstradaConectada(ctx, sx, sy, conexoes, rotacao = 0) {
  const { n, s, l, o } = conexoes;
  const r = 0.3;

  const temConexao = n || s || l || o;

  if (!temConexao) {
    const eixoX = rotacao % 2 === 0;
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    const pTL = tileToScreen(sx, sy, eixoX ? -0.4 : -r, eixoX ? -r : -0.4);
    const pTR = tileToScreen(sx, sy, eixoX ? 0.4 : r, eixoX ? -r : -0.4);
    const pBR = tileToScreen(sx, sy, eixoX ? 0.4 : r, eixoX ? r : 0.4);
    const pBL = tileToScreen(sx, sy, eixoX ? -0.4 : -r, eixoX ? r : 0.4);
    ctx.moveTo(pTL.x, pTL.y);
    ctx.lineTo(pTR.x, pTR.y);
    ctx.lineTo(pBR.x, pBR.y);
    ctx.lineTo(pBL.x, pBL.y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    if (eixoX) {
      const p1 = tileToScreen(sx, sy, -0.3, 0);
      const p2 = tileToScreen(sx, sy, 0.3, 0);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    } else {
      const p1 = tileToScreen(sx, sy, 0, -0.3);
      const p2 = tileToScreen(sx, sy, 0, 0.3);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    }
    ctx.stroke();
    return;
  }

  ctx.fillStyle = "#334155";

  ctx.beginPath();
  const pC1 = tileToScreen(sx, sy, -r, -r);
  const pC2 = tileToScreen(sx, sy, r, -r);
  const pC3 = tileToScreen(sx, sy, r, r);
  const pC4 = tileToScreen(sx, sy, -r, r);
  ctx.moveTo(pC1.x, pC1.y);
  ctx.lineTo(pC2.x, pC2.y);
  ctx.lineTo(pC3.x, pC3.y);
  ctx.lineTo(pC4.x, pC4.y);
  ctx.closePath();
  ctx.fill();

  if (l) {
    const p1 = tileToScreen(sx, sy, r - 0.02, -r);
    const p2 = tileToScreen(sx, sy, 0.5, -r);
    const p3 = tileToScreen(sx, sy, 0.5, r);
    const p4 = tileToScreen(sx, sy, r - 0.02, r);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fill();
  }

  if (o) {
    const p1 = tileToScreen(sx, sy, -0.5, -r);
    const p2 = tileToScreen(sx, sy, -r + 0.02, -r);
    const p3 = tileToScreen(sx, sy, -r + 0.02, r);
    const p4 = tileToScreen(sx, sy, -0.5, r);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fill();
  }

  if (n) {
    const p1 = tileToScreen(sx, sy, -r, -0.5);
    const p2 = tileToScreen(sx, sy, r, -0.5);
    const p3 = tileToScreen(sx, sy, r, -r + 0.02);
    const p4 = tileToScreen(sx, sy, -r, -r + 0.02);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fill();
  }

  if (s) {
    const p1 = tileToScreen(sx, sy, -r, r - 0.02);
    const p2 = tileToScreen(sx, sy, r, r - 0.02);
    const p3 = tileToScreen(sx, sy, r, 0.5);
    const p4 = tileToScreen(sx, sy, -r, 0.5);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 1;

  if (!n) {
    const startU = o ? -0.5 : -r;
    const endU = l ? 0.5 : r;
    const p1 = tileToScreen(sx, sy, startU, -r);
    const p2 = tileToScreen(sx, sy, endU, -r);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  } else {
    if (o) {
      const p1 = tileToScreen(sx, sy, -0.5, -r);
      const p2 = tileToScreen(sx, sy, -r, -r);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    if (l) {
      const p1 = tileToScreen(sx, sy, r, -r);
      const p2 = tileToScreen(sx, sy, 0.5, -r);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  if (!s) {
    const startU = o ? -0.5 : -r;
    const endU = l ? 0.5 : r;
    const p1 = tileToScreen(sx, sy, startU, r);
    const p2 = tileToScreen(sx, sy, endU, r);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  } else {
    if (o) {
      const p1 = tileToScreen(sx, sy, -0.5, r);
      const p2 = tileToScreen(sx, sy, -r, r);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    if (l) {
      const p1 = tileToScreen(sx, sy, r, r);
      const p2 = tileToScreen(sx, sy, 0.5, r);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  if (!o) {
    const startV = n ? -0.5 : -r;
    const endV = s ? 0.5 : r;
    const p1 = tileToScreen(sx, sy, -r, startV);
    const p2 = tileToScreen(sx, sy, -r, endV);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  } else {
    if (n) {
      const p1 = tileToScreen(sx, sy, -r, -0.5);
      const p2 = tileToScreen(sx, sy, -r, -r);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    if (s) {
      const p1 = tileToScreen(sx, sy, -r, r);
      const p2 = tileToScreen(sx, sy, -r, 0.5);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  if (!l) {
    const startV = n ? -0.5 : -r;
    const endV = s ? 0.5 : r;
    const p1 = tileToScreen(sx, sy, r, startV);
    const p2 = tileToScreen(sx, sy, r, endV);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  } else {
    if (n) {
      const p1 = tileToScreen(sx, sy, r, -0.5);
      const p2 = tileToScreen(sx, sy, r, -r);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    if (s) {
      const p1 = tileToScreen(sx, sy, r, r);
      const p2 = tileToScreen(sx, sy, r, 0.5);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 1.2;

  const soX = l && o && !n && !s;
  const soY = n && s && !l && !o;

  if (soX) {
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const p1 = tileToScreen(sx, sy, -0.5, 0);
    const p2 = tileToScreen(sx, sy, 0.5, 0);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (soY) {
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const p1 = tileToScreen(sx, sy, 0, -0.5);
    const p2 = tileToScreen(sx, sy, 0, 0.5);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (l && s && !n && !o) {
    ctx.setLineDash([3, 3]);
    const pStart = tileToScreen(sx, sy, 0.5, 0);
    const pCtrl = tileToScreen(sx, sy, 0, 0);
    const pEnd = tileToScreen(sx, sy, 0, 0.5);
    ctx.beginPath();
    ctx.moveTo(pStart.x, pStart.y);
    ctx.quadraticCurveTo(pCtrl.x, pCtrl.y, pEnd.x, pEnd.y);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (o && s && !n && !l) {
    ctx.setLineDash([3, 3]);
    const pStart = tileToScreen(sx, sy, -0.5, 0);
    const pCtrl = tileToScreen(sx, sy, 0, 0);
    const pEnd = tileToScreen(sx, sy, 0, 0.5);
    ctx.beginPath();
    ctx.moveTo(pStart.x, pStart.y);
    ctx.quadraticCurveTo(pCtrl.x, pCtrl.y, pEnd.x, pEnd.y);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (o && n && !s && !l) {
    ctx.setLineDash([3, 3]);
    const pStart = tileToScreen(sx, sy, -0.5, 0);
    const pCtrl = tileToScreen(sx, sy, 0, 0);
    const pEnd = tileToScreen(sx, sy, 0, -0.5);
    ctx.beginPath();
    ctx.moveTo(pStart.x, pStart.y);
    ctx.quadraticCurveTo(pCtrl.x, pCtrl.y, pEnd.x, pEnd.y);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (l && n && !s && !o) {
    ctx.setLineDash([3, 3]);
    const pStart = tileToScreen(sx, sy, 0.5, 0);
    const pCtrl = tileToScreen(sx, sy, 0, 0);
    const pEnd = tileToScreen(sx, sy, 0, -0.5);
    ctx.beginPath();
    ctx.moveTo(pStart.x, pStart.y);
    ctx.quadraticCurveTo(pCtrl.x, pCtrl.y, pEnd.x, pEnd.y);
    ctx.stroke();
    ctx.setLineDash([]);
  } else {
    ctx.setLineDash([]);
    if (l) {
      const p1 = tileToScreen(sx, sy, 0.5, 0);
      const p2 = tileToScreen(sx, sy, 0.08, 0);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    if (o) {
      const p1 = tileToScreen(sx, sy, -0.5, 0);
      const p2 = tileToScreen(sx, sy, -0.08, 0);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    if (n) {
      const p1 = tileToScreen(sx, sy, 0, -0.5);
      const p2 = tileToScreen(sx, sy, 0, -0.08);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    if (s) {
      const p1 = tileToScreen(sx, sy, 0, 0.5);
      const p2 = tileToScreen(sx, sy, 0, 0.08);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }
}

function desenharGuardaCorpo(ctx, pA, pB, desenharViga = false) {
  if (desenharViga) {
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.moveTo(pA.x, pA.y);
    ctx.lineTo(pB.x, pB.y);
    ctx.lineTo(pB.x, pB.y + 3.5);
    ctx.lineTo(pA.x, pA.y + 3.5);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(pA.x, pA.y - 3.5);
  ctx.lineTo(pB.x, pB.y - 3.5);
  ctx.stroke();

  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1;
  const dist = Math.hypot(pB.x - pA.x, pB.y - pA.y);
  const numPostes = Math.max(2, Math.round(dist / 10));
  for (let i = 0; i <= numPostes; i++) {
    const t = i / numPostes;
    const px = pA.x + (pB.x - pA.x) * t;
    const py = pA.y + (pB.y - pA.y) * t;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, py - 3.5);
    ctx.stroke();
  }
}

function desenharPonteConectada(ctx, sx, sy, conexoes, rotacao = 0) {
  let { n, s, l, o } = conexoes;
  const temConexao = n || s || l || o;

  if (!temConexao) {
    if (rotacao % 2 === 0) {
      l = true;
      o = true;
    } else {
      n = true;
      s = true;
    }
  }

  const r = 0.3;

  ctx.fillStyle = "#1e293b";
  ctx.fillRect(sx - 3, sy + 2, 6, 9);
  ctx.strokeStyle = "rgba(147, 197, 253, 0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(sx, sy + 11, 4.5, 2, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#334155";
  ctx.beginPath();
  const pC1 = tileToScreen(sx, sy, -r, -r);
  const pC2 = tileToScreen(sx, sy, r, -r);
  const pC3 = tileToScreen(sx, sy, r, r);
  const pC4 = tileToScreen(sx, sy, -r, r);
  ctx.moveTo(pC1.x, pC1.y);
  ctx.lineTo(pC2.x, pC2.y);
  ctx.lineTo(pC3.x, pC3.y);
  ctx.lineTo(pC4.x, pC4.y);
  ctx.closePath();
  ctx.fill();

  if (l) {
    const p1 = tileToScreen(sx, sy, r - 0.02, -r);
    const p2 = tileToScreen(sx, sy, 0.5, -r);
    const p3 = tileToScreen(sx, sy, 0.5, r);
    const p4 = tileToScreen(sx, sy, r - 0.02, r);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fill();
  }

  if (o) {
    const p1 = tileToScreen(sx, sy, -0.5, -r);
    const p2 = tileToScreen(sx, sy, -r + 0.02, -r);
    const p3 = tileToScreen(sx, sy, -r + 0.02, r);
    const p4 = tileToScreen(sx, sy, -0.5, r);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fill();
  }

  if (n) {
    const p1 = tileToScreen(sx, sy, -r, -0.5);
    const p2 = tileToScreen(sx, sy, r, -0.5);
    const p3 = tileToScreen(sx, sy, r, -r + 0.02);
    const p4 = tileToScreen(sx, sy, -r, -r + 0.02);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fill();
  }

  if (s) {
    const p1 = tileToScreen(sx, sy, -r, r - 0.02);
    const p2 = tileToScreen(sx, sy, r, r - 0.02);
    const p3 = tileToScreen(sx, sy, r, 0.5);
    const p4 = tileToScreen(sx, sy, -r, 0.5);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fill();
  }

  if (!n) {
    const startU = o ? -0.5 : -r;
    const endU = l ? 0.5 : r;
    desenharGuardaCorpo(ctx, tileToScreen(sx, sy, startU, -r), tileToScreen(sx, sy, endU, -r), false);
  } else {
    if (o) {
      desenharGuardaCorpo(ctx, tileToScreen(sx, sy, -0.5, -r), tileToScreen(sx, sy, -r, -r), false);
    }
    if (l) {
      desenharGuardaCorpo(ctx, tileToScreen(sx, sy, r, -r), tileToScreen(sx, sy, 0.5, -r), false);
    }
  }

  if (!s) {
    const startU = o ? -0.5 : -r;
    const endU = l ? 0.5 : r;
    desenharGuardaCorpo(ctx, tileToScreen(sx, sy, startU, r), tileToScreen(sx, sy, endU, r), true);
  } else {
    if (o) {
      desenharGuardaCorpo(ctx, tileToScreen(sx, sy, -0.5, r), tileToScreen(sx, sy, -r, r), true);
    }
    if (l) {
      desenharGuardaCorpo(ctx, tileToScreen(sx, sy, r, r), tileToScreen(sx, sy, 0.5, r), true);
    }
  }

  if (!o) {
    const startV = n ? -0.5 : -r;
    const endV = s ? 0.5 : r;
    desenharGuardaCorpo(ctx, tileToScreen(sx, sy, -r, startV), tileToScreen(sx, sy, -r, endV), false);
  } else {
    if (n) {
      desenharGuardaCorpo(ctx, tileToScreen(sx, sy, -r, -0.5), tileToScreen(sx, sy, -r, -r), false);
    }
    if (s) {
      desenharGuardaCorpo(ctx, tileToScreen(sx, sy, -r, r), tileToScreen(sx, sy, -r, 0.5), false);
    }
  }

  if (!l) {
    const startV = n ? -0.5 : -r;
    const endV = s ? 0.5 : r;
    desenharGuardaCorpo(ctx, tileToScreen(sx, sy, r, startV), tileToScreen(sx, sy, r, endV), true);
  } else {
    if (n) {
      desenharGuardaCorpo(ctx, tileToScreen(sx, sy, r, -0.5), tileToScreen(sx, sy, r, -r), true);
    }
    if (s) {
      desenharGuardaCorpo(ctx, tileToScreen(sx, sy, r, r), tileToScreen(sx, sy, r, 0.5), true);
    }
  }

  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 1.2;

  const soX = l && o && !n && !s;
  const soY = n && s && !l && !o;

  if (soX) {
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const p1 = tileToScreen(sx, sy, -0.5, 0);
    const p2 = tileToScreen(sx, sy, 0.5, 0);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (soY) {
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const p1 = tileToScreen(sx, sy, 0, -0.5);
    const p2 = tileToScreen(sx, sy, 0, 0.5);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (l && s && !n && !o) {
    ctx.setLineDash([3, 3]);
    const pStart = tileToScreen(sx, sy, 0.5, 0);
    const pCtrl = tileToScreen(sx, sy, 0, 0);
    const pEnd = tileToScreen(sx, sy, 0, 0.5);
    ctx.beginPath();
    ctx.moveTo(pStart.x, pStart.y);
    ctx.quadraticCurveTo(pCtrl.x, pCtrl.y, pEnd.x, pEnd.y);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (o && s && !n && !l) {
    ctx.setLineDash([3, 3]);
    const pStart = tileToScreen(sx, sy, -0.5, 0);
    const pCtrl = tileToScreen(sx, sy, 0, 0);
    const pEnd = tileToScreen(sx, sy, 0, 0.5);
    ctx.beginPath();
    ctx.moveTo(pStart.x, pStart.y);
    ctx.quadraticCurveTo(pCtrl.x, pCtrl.y, pEnd.x, pEnd.y);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (o && n && !s && !l) {
    ctx.setLineDash([3, 3]);
    const pStart = tileToScreen(sx, sy, -0.5, 0);
    const pCtrl = tileToScreen(sx, sy, 0, 0);
    const pEnd = tileToScreen(sx, sy, 0, -0.5);
    ctx.beginPath();
    ctx.moveTo(pStart.x, pStart.y);
    ctx.quadraticCurveTo(pCtrl.x, pCtrl.y, pEnd.x, pEnd.y);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (l && n && !s && !o) {
    ctx.setLineDash([3, 3]);
    const pStart = tileToScreen(sx, sy, 0.5, 0);
    const pCtrl = tileToScreen(sx, sy, 0, 0);
    const pEnd = tileToScreen(sx, sy, 0, -0.5);
    ctx.beginPath();
    ctx.moveTo(pStart.x, pStart.y);
    ctx.quadraticCurveTo(pCtrl.x, pCtrl.y, pEnd.x, pEnd.y);
    ctx.stroke();
    ctx.setLineDash([]);
  } else {
    ctx.setLineDash([]);
    if (l) {
      const p1 = tileToScreen(sx, sy, 0.5, 0);
      const p2 = tileToScreen(sx, sy, 0.08, 0);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    if (o) {
      const p1 = tileToScreen(sx, sy, -0.5, 0);
      const p2 = tileToScreen(sx, sy, -0.08, 0);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    if (n) {
      const p1 = tileToScreen(sx, sy, 0, -0.5);
      const p2 = tileToScreen(sx, sy, 0, -0.08);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    if (s) {
      const p1 = tileToScreen(sx, sy, 0, 0.5);
      const p2 = tileToScreen(sx, sy, 0, 0.08);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }
}

function desenharEdificio(ctx, sx, sy, bld, conexoes) {
  if (bld.nome === "Estrada") {
    desenharEstradaConectada(ctx, sx, sy, conexoes, bld.rotacao || 0);
    return;
  }

  if (bld.nome === "Ponte") {
    desenharPonteConectada(ctx, sx, sy, conexoes, bld.rotacao || 0);
    return;
  }

  if (bld.nome === "Praça") {
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(sx, sy - 4, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#059669";
    ctx.beginPath();
    ctx.arc(sx + 4, sy - 8, 5, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  const altura = Math.min(48, Math.max(12, bld.altura || 18));
  const largura = 18;
  const meiaLargura = largura / 2;
  const corBase = bld.cor || "#38bdf8";

  ctx.beginPath();
  ctx.moveTo(sx - meiaLargura, sy);
  ctx.lineTo(sx, sy + 6);
  ctx.lineTo(sx, sy + 6 - altura);
  ctx.lineTo(sx - meiaLargura, sy - altura);
  ctx.closePath();
  ctx.fillStyle = escurecerCor(corBase, 0.4);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(sx, sy + 6);
  ctx.lineTo(sx + meiaLargura, sy);
  ctx.lineTo(sx + meiaLargura, sy - altura);
  ctx.lineTo(sx, sy + 6 - altura);
  ctx.closePath();
  ctx.fillStyle = escurecerCor(corBase, 0.2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(sx, sy + 6 - altura);
  ctx.lineTo(sx + meiaLargura, sy - altura);
  ctx.lineTo(sx, sy - 6 - altura);
  ctx.lineTo(sx - meiaLargura, sy - altura);
  ctx.closePath();
  ctx.fillStyle = corBase;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  if (bld.categoria === "residencial" && bld.nome === "Casa Simples") {
    ctx.beginPath();
    ctx.moveTo(sx - meiaLargura, sy - altura);
    ctx.lineTo(sx, sy - altura - 8);
    ctx.lineTo(sx + meiaLargura, sy - altura);
    ctx.closePath();
    ctx.fillStyle = "#b91c1c";
    ctx.fill();
  } else if (bld.categoria === "industrial") {
    ctx.fillStyle = "#78350f";
    ctx.fillRect(sx + 3, sy - altura - 8, 4, 8);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(sx + 5, sy - altura - 12, 3, 0, Math.PI * 2);
    ctx.arc(sx + 7, sy - altura - 16, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (bld.nome === "Hospital") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(sx - 5, sy - altura / 2 - 3, 10, 6);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(sx - 4, sy - altura / 2 - 1, 8, 2);
    ctx.fillRect(sx - 1, sy - altura / 2 - 4, 2, 8);
  } else {
    ctx.fillStyle = "#fef08a";
    if (altura >= 20) {
      ctx.fillRect(sx - 6, sy - altura + 6, 3, 3);
      ctx.fillRect(sx - 6, sy - altura + 12, 3, 3);
      ctx.fillRect(sx + 3, sy - altura + 6, 3, 3);
      ctx.fillRect(sx + 3, sy - altura + 12, 3, 3);
    }
  }

  if (bld.nivel && bld.nivel > 1) {
    ctx.fillStyle = "#eab308";
    ctx.font = "bold 9px sans-serif";
    ctx.fillText(`★${bld.nivel}`, sx - 8, sy - altura - 3);
  }

  if (bld.temEnergia === false) {
    ctx.fillStyle = "rgba(239, 68, 68, 0.85)";
    ctx.beginPath();
    ctx.arc(sx - 8, sy - altura - 5, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px sans-serif";
    ctx.fillText("⚡", sx - 11, sy - altura - 2);
  }

  if (bld.temAgua === false) {
    ctx.fillStyle = "rgba(59, 130, 246, 0.85)";
    ctx.beginPath();
    ctx.arc(sx + 8, sy - altura - 5, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px sans-serif";
    ctx.fillText("💧", sx + 5, sy - altura - 2);
  }
}

function escurecerCor(hex, percentual) {
  if (!hex || hex[0] !== "#") return hex;
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  r = Math.max(0, Math.floor(r * (1 - percentual)));
  g = Math.max(0, Math.floor(g * (1 - percentual)));
  b = Math.max(0, Math.floor(b * (1 - percentual)));

  return `rgb(${r}, ${g}, ${b})`;
}
