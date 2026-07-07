import { Fragment, ReactNode } from 'react'
import { Square, CheckSquare } from 'lucide-react'

/**
 * Minimal markdown renderer for copilot answers.
 * Supports: **bold**, *italic*, bullet/ordered lists, - [ ] checklists,
 * blank-line paragraph breaks and → arrows. Deliberately tiny — the demo
 * responses only use this subset.
 */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = []
  // bold first, then italic inside the remaining plain segments
  const boldParts = text.split(/\*\*([^*]+)\*\*/g)
  boldParts.forEach((part, i) => {
    if (i % 2 === 1) {
      out.push(<strong key={`${keyBase}b${i}`} className="font-semibold text-ink-900">{part}</strong>)
      return
    }
    const italicParts = part.split(/\*([^*]+)\*/g)
    italicParts.forEach((seg, j) => {
      if (j % 2 === 1) out.push(<em key={`${keyBase}i${i}-${j}`} className="text-ink-500">{seg}</em>)
      else if (seg) out.push(<Fragment key={`${keyBase}t${i}-${j}`}>{seg}</Fragment>)
    })
  })
  return out
}

export function Markdown({ text }: { text: string }) {
  const lines = text.split('\n')
  const blocks: ReactNode[] = []
  lines.forEach((line, i) => {
    const key = `l${i}`
    const checklist = line.match(/^- \[( |x)\] (.*)$/)
    if (checklist) {
      const done = checklist[1] === 'x'
      blocks.push(
        <div key={key} className="flex items-start gap-2 pl-1">
          {done
            ? <CheckSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
            : <Square className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400" />}
          <span>{inline(checklist[2], key)}</span>
        </div>
      )
      return
    }
    const bullet = line.match(/^- (.*)$/)
    if (bullet) {
      blocks.push(
        <div key={key} className="flex items-start gap-2 pl-1">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
          <span>{inline(bullet[1], key)}</span>
        </div>
      )
      return
    }
    const ordered = line.match(/^(\d+)\. (.*)$/)
    if (ordered) {
      blocks.push(
        <div key={key} className="flex items-start gap-2 pl-1">
          <span className="mt-0.5 grid h-[18px] min-w-[18px] shrink-0 place-items-center rounded bg-brand-soft px-1 text-[10px] font-semibold text-brand-700">
            {ordered[1]}
          </span>
          <span>{inline(ordered[2], key)}</span>
        </div>
      )
      return
    }
    if (line.trim() === '') {
      blocks.push(<div key={key} className="h-2" />)
      return
    }
    blocks.push(<p key={key}>{inline(line, key)}</p>)
  })
  return <div className="space-y-1 leading-relaxed">{blocks}</div>
}
