import { useRef, useState, useEffect, useCallback } from 'react';
import { nodes, MapNode, CATEGORY_COLORS } from '../data/nodes';
import { connections } from '../data/connections';
import NodeCard from './NodeCard';
import SidePanel from './SidePanel';

const WORLD_W = 4400;
const WORLD_H = 4000;
const CENTER_X = 2000;
const CENTER_Y = 2000;
const MIN_SCALE = 0.15;
const MAX_SCALE = 2.5;

// Node center positions (cards are 200×~70, centered on x,y)
function nodeCenter(node: MapNode) {
  return { x: node.x, y: node.y };
}

export default function Supermapa() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.72);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<MapNode | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Center the map on mount
  useEffect(() => {
    if (!containerRef.current || initialized) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const s = 0.72;
    setPan({
      x: clientWidth / 2 - CENTER_X * s,
      y: clientHeight / 2 - CENTER_Y * s,
    });
    setInitialized(true);
  }, [initialized]);

  // ── PAN ──────────────────────────────────────────────────────────────────
  const isPanning = useRef(false);
  const startPointer = useRef({ x: 0, y: 0 });
  const startPan = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-node]')) return;
    isPanning.current = true;
    startPointer.current = { x: e.clientX, y: e.clientY };
    startPan.current = pan;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [pan]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    setPan({
      x: startPan.current.x + (e.clientX - startPointer.current.x),
      y: startPan.current.y + (e.clientY - startPointer.current.y),
    });
  }, []);

  const onPointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // ── ZOOM ─────────────────────────────────────────────────────────────────
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.92 : 1.09;
    setScale(prev => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * factor));
      setPan(p => ({
        x: e.clientX - (e.clientX - p.x) * (next / prev),
        y: e.clientY - (e.clientY - p.y) * (next / prev),
      }));
      return next;
    });
  }, []);

  // ── TOUCH PINCH ──────────────────────────────────────────────────────────
  const touches = useRef<{ dist: number; scale: number; midX: number; midY: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touches.current = {
        dist: Math.hypot(dx, dy),
        scale,
        midX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        midY: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    }
  }, [scale]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && touches.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, touches.current.scale * (dist / touches.current.dist)));
      const { midX, midY } = touches.current;
      setScale(prev => {
        setPan(p => ({
          x: midX - (midX - p.x) * (next / prev),
          y: midY - (midY - p.y) * (next / prev),
        }));
        return next;
      });
    }
  }, []);

  // ── NODE CONNECTIONS (SVG) ────────────────────────────────────────────────
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  function getLinePoints(fromId: string, toId: string) {
    const from = nodeMap.get(fromId);
    const to = nodeMap.get(toId);
    if (!from || !to) return null;
    return {
      x1: nodeCenter(from).x,
      y1: nodeCenter(from).y,
      x2: nodeCenter(to).x,
      y2: nodeCenter(to).y,
      color: CATEGORY_COLORS[from.category],
    };
  }

  // ── ZOOM CONTROLS ────────────────────────────────────────────────────────
  function zoomBy(factor: number) {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const cx = clientWidth / 2;
    const cy = clientHeight / 2;
    setScale(prev => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * factor));
      setPan(p => ({
        x: cx - (cx - p.x) * (next / prev),
        y: cy - (cy - p.y) * (next / prev),
      }));
      return next;
    });
  }

  function resetView() {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const s = 0.72;
    setScale(s);
    setPan({
      x: clientWidth / 2 - CENTER_X * s,
      y: clientHeight / 2 - CENTER_Y * s,
    });
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#08090c', overflow: 'hidden' }}>
      {/* Canvas container */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', cursor: isPanning.current ? 'grabbing' : 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {/* World */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: WORLD_W,
            height: WORLD_H,
            transformOrigin: '0 0',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            willChange: 'transform',
          }}
        >
          {/* Subtle radial glow at center */}
          <div
            style={{
              position: 'absolute',
              left: CENTER_X - 400,
              top: CENTER_Y - 400,
              width: 800,
              height: 800,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* SVG connections */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: WORLD_W,
              height: WORLD_H,
              overflow: 'visible',
              pointerEvents: 'none',
            }}
          >
            <defs>
              {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                <marker
                  key={cat}
                  id={`arr-${cat}`}
                  markerWidth="6"
                  markerHeight="5"
                  refX="6"
                  refY="2.5"
                  orient="auto"
                >
                  <polygon points="0 0,6 2.5,0 5" fill={color} opacity="0.5" />
                </marker>
              ))}
            </defs>

            {connections.map(conn => {
              const pts = getLinePoints(conn.from, conn.to);
              if (!pts) return null;
              const fromNode = nodeMap.get(conn.from)!;
              const { x1, y1, x2, y2, color } = pts;

              // Midpoint for label
              const mx = (x1 + x2) / 2;
              const my = (y1 + y2) / 2;

              // Slight curve
              const cpx = mx + (y2 - y1) * 0.1;
              const cpy = my - (x2 - x1) * 0.1;

              return (
                <g key={conn.id}>
                  <path
                    d={`M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.5}
                    strokeDasharray="6 4"
                    opacity={0.35}
                    markerEnd={`url(#arr-${fromNode.category})`}
                    style={{ animation: 'dashFlow 20s linear infinite' }}
                  />
                  {conn.label && (
                    <text
                      x={cpx}
                      y={cpy - 6}
                      fill={color}
                      fontSize={9}
                      fontFamily="'Space Grotesk', sans-serif"
                      fontWeight={500}
                      letterSpacing={1.5}
                      textAnchor="middle"
                      opacity={0.5}
                      style={{ textTransform: 'uppercase' }}
                    >
                      {conn.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Personaje — centro */}
          <div
            style={{
              position: 'absolute',
              left: CENTER_X - 24,
              top: CENTER_Y - 60,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <svg width={48} height={80} viewBox="0 0 48 80" fill="none">
              {/* Head */}
              <circle cx={24} cy={12} r={10} stroke="#d4a843" strokeWidth={1.5} fill="rgba(212,168,67,0.06)" />
              {/* Body */}
              <line x1={24} y1={22} x2={24} y2={52} stroke="#d4a843" strokeWidth={1.5} />
              {/* Arms */}
              <line x1={24} y1={30} x2={10} y2={44} stroke="#d4a843" strokeWidth={1.5} />
              <line x1={24} y1={30} x2={38} y2={44} stroke="#d4a843" strokeWidth={1.5} />
              {/* Legs */}
              <line x1={24} y1={52} x2={14} y2={70} stroke="#d4a843" strokeWidth={1.5} />
              <line x1={24} y1={52} x2={34} y2={70} stroke="#d4a843" strokeWidth={1.5} />
              {/* Glow ring */}
              <circle cx={24} cy={12} r={14} stroke="rgba(212,168,67,0.15)" strokeWidth={1} fill="none" />
            </svg>
          </div>

          {/* Nodes */}
          {nodes.map(node => (
            <div key={node.id} data-node="true">
              <NodeCard
                node={node}
                selected={selected?.id === node.id}
                onClick={n => setSelected(prev => prev?.id === n.id ? null : n)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Zoom controls */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          zIndex: 40,
        }}
      >
        {[
          { label: '+', action: () => zoomBy(1.25) },
          { label: '−', action: () => zoomBy(0.75) },
          { label: '⊡', action: resetView },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={btn.action}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(8,9,12,0.88)',
              border: '1px solid rgba(212,168,67,0.15)',
              color: '#d4a843',
              fontSize: btn.label === '⊡' ? 14 : 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(12px)',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,168,67,0.4)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,168,67,0.15)')}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Title */}
      <div
        style={{
          position: 'fixed',
          top: 20,
          left: 24,
          zIndex: 40,
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: 9, letterSpacing: 5, color: '#d4a843', opacity: 0.5, textTransform: 'uppercase' }}>
          Supermapa
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#eae6dd', opacity: 0.35, marginTop: 2 }}>
          NEMAPA
        </div>
      </div>

      {/* Side panel */}
      {selected && (
        <SidePanel node={selected} onClose={() => setSelected(null)} />
      )}

      <style>{`
        @keyframes dashFlow {
          to { stroke-dashoffset: -200; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Inter', 'Space Grotesk', system-ui, sans-serif; }
      `}</style>
    </div>
  );
}
