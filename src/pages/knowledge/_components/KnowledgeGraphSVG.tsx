import { KNOWLEDGE_GRAPH } from '@/data/knowledgeSamples'

const KIND_STYLE: Record<string, { fill: string; stroke: string }> = {
  GR: { fill: '#EEF3FC', stroke: '#0B57D0' },
  SOP: { fill: '#EBF2FE', stroke: '#4285F4' },
  Circular: { fill: '#E7F4EA', stroke: '#34A853' },
  Policy: { fill: '#FDEBEA', stroke: '#EA4335' },
}

export function KnowledgeGraphSVG() {
  const { nodes, edges } = KNOWLEDGE_GRAPH
  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]))
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 640 300" className="h-[280px] w-full min-w-[560px]" role="img" aria-label="Knowledge graph — 6 related documents">
        <defs>
          <linearGradient id="kg-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0B57D0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#062868" stopOpacity="0.55" />
          </linearGradient>
          <marker id="kg-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" fill="#4285F4" />
          </marker>
        </defs>

        {edges.map((e, i) => {
          const a = nodeById[e.from]
          const b = nodeById[e.to]
          if (!a || !b) return null
          const midX = (a.x + b.x) / 2
          const midY = (a.y + b.y) / 2 - 8
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="url(#kg-edge)" strokeWidth={1.5} markerEnd="url(#kg-arrow)" />
              <text x={midX} y={midY} textAnchor="middle" fontSize="9" fill="#64748b" className="select-none">{e.label}</text>
            </g>
          )
        })}

        {nodes.map((n) => {
          const s = KIND_STYLE[n.kind] || KIND_STYLE.GR
          return (
            <g key={n.id} transform={`translate(${n.x},${n.y})`}>
              <rect x={-70} y={-18} width={140} height={36} rx={10} ry={10} fill={s.fill} stroke={s.stroke} strokeWidth={1.4} />
              <text x={0} y={-3} textAnchor="middle" fontSize="9" fontWeight="600" fill={s.stroke} className="uppercase tracking-wider select-none">{n.kind}</text>
              <text x={0} y={10} textAnchor="middle" fontSize="10" fill="#0f172a" className="select-none">
                {n.label.length > 22 ? n.label.slice(0, 22) + '…' : n.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
