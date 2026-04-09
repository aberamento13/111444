import { MapNode, CATEGORY_COLORS, CATEGORY_LABELS } from '../data/nodes';

interface Props {
  node: MapNode;
  selected: boolean;
  onClick: (node: MapNode) => void;
}

export default function NodeCard({ node, selected, onClick }: Props) {
  const color = CATEGORY_COLORS[node.category];

  return (
    <div
      onClick={() => onClick(node)}
      style={{
        position: 'absolute',
        left: node.x - 100,
        top: node.y - 50,
        width: 200,
        cursor: 'pointer',
        background: selected
          ? `rgba(${hexToRgb(color)}, 0.22)`
          : `rgba(${hexToRgb(color)}, 0.08)`,
        border: `1px solid rgba(${hexToRgb(color)}, ${selected ? 0.7 : 0.3})`,
        borderRadius: 10,
        padding: '10px 14px',
        transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
        boxShadow: selected
          ? `0 0 24px rgba(${hexToRgb(color)}, 0.35)`
          : 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      onMouseEnter={e => {
        if (!selected) {
          (e.currentTarget as HTMLDivElement).style.background = `rgba(${hexToRgb(color)}, 0.15)`;
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 16px rgba(${hexToRgb(color)}, 0.2)`;
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          (e.currentTarget as HTMLDivElement).style.background = `rgba(${hexToRgb(color)}, 0.08)`;
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        }
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color,
          opacity: 0.7,
          marginBottom: 5,
          fontWeight: 500,
        }}
      >
        {CATEGORY_LABELS[node.category]}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#eae6dd',
          lineHeight: 1.3,
        }}
      >
        {node.title}
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
