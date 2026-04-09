import { MapNode, CATEGORY_COLORS, CATEGORY_LABELS } from '../data/nodes';

interface Props {
  node: MapNode;
  onClose: () => void;
}

export default function SidePanel({ node, onClose }: Props) {
  const color = CATEGORY_COLORS[node.category];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 320,
        height: '100vh',
        background: 'rgba(8, 9, 12, 0.96)',
        borderLeft: `1px solid rgba(${hexToRgb(color)}, 0.25)`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 28px',
        boxShadow: `-8px 0 40px rgba(0,0,0,0.6)`,
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 6,
          color: '#eae6dd',
          width: 32,
          height: 32,
          cursor: 'pointer',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.6,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.6')}
      >
        ×
      </button>

      {/* Category tag */}
      <div
        style={{
          display: 'inline-block',
          fontSize: 9,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color,
          background: `rgba(${hexToRgb(color)}, 0.12)`,
          border: `1px solid rgba(${hexToRgb(color)}, 0.3)`,
          borderRadius: 4,
          padding: '4px 10px',
          marginBottom: 20,
          fontWeight: 500,
          alignSelf: 'flex-start',
        }}
      >
        {CATEGORY_LABELS[node.category]}
      </div>

      {/* Title */}
      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#eae6dd',
          lineHeight: 1.25,
          marginBottom: 20,
        }}
      >
        {node.title}
      </h2>

      {/* Divider */}
      <div
        style={{
          width: 40,
          height: 2,
          background: `rgba(${hexToRgb(color)}, 0.5)`,
          borderRadius: 1,
          marginBottom: 20,
        }}
      />

      {/* Description */}
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.8,
          color: 'rgba(234, 230, 221, 0.75)',
          fontWeight: 300,
        }}
      >
        {node.description}
      </p>

      {/* Modes */}
      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <div
          style={{
            fontSize: 9,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: 'rgba(234,230,221,0.3)',
            marginBottom: 10,
          }}
        >
          Modos
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {node.modes.map(mode => (
            <span
              key={mode}
              style={{
                fontSize: 10,
                letterSpacing: 1,
                color: 'rgba(234,230,221,0.4)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 4,
                padding: '3px 8px',
              }}
            >
              {mode}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
