import { Fragment, ReactNode } from 'react'
import { Square, CheckSquare } from 'lucide-react'

/**
 * Minimal markdown renderer for copilot answers.
 * Supports: **bold**, *italic*, `code`, bullet/ordered lists, - [ ] checklists,
 * pipe tables (| a | b |), blank-line paragraph breaks and → arrows.
 * Deliberately tiny — the demo responses only use this subset.
 */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = []
  // `code` spans first so bold/italic markers inside them are left literal
  const codeParts = text.split(/`([^`]+)`/g)
  codeParts.forEach((chunk, ci) => {
    if (ci % 2 === 1) {
      out.push(
        <code key={`${keyBase}c${ci}`} className="rounded bg-ink-100 px-1 py-0.5 font-mono text-[0.85em] text-ink-800">
          {chunk}
        </code>
      )
      return
    }
    const boldParts = chunk.split(/\*\*([^*]+)\*\*/g)
    boldParts.forEach((part, i) => {
      if (i % 2 === 1) {
        out.push(<strong key={`${keyBase}b${ci}-${i}`} className="font-semibold text-ink-900">{part}</strong>)
        return
      }
      const italicParts = part.split(/\*([^*]+)\*/g)
      italicParts.forEach((seg, j) => {
        if (j % 2 === 1) out.push(<em key={`${keyBase}i${ci}-${i}-${j}`} className="text-ink-500">{seg}</em>)
        else if (seg) out.push(<Fragment key={`${keyBase}t${ci}-${i}-${j}`}>{seg}</Fragment>)
      })
    })
  })
  return out
}

const isTableRow = (l: string) => /^\s*\|.*\|\s*$/.test(l)
const isTableSep = (l: string) => /^\s*\|?[\s:-]*-[\s:|-]*\|?\s*$/.test(l) && l.includes('-')
const cells = (l: string) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())

export function Markdown({ text }: { text: string }) {
  const lines = text.split('\n')
  const blocks: ReactNode[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const key = `l${i}`

    // Pipe table: header row + separator row + body rows
    if (isTableRow(line) && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const header = cells(line)
      const rows: string[][] = []
      let j = i + 2
      while (j < lines.length && isTableRow(lines[j]) && !isTableSep(lines[j])) {
        rows.push(cells(lines[j]))
        j++
      }
      blocks.push(
        <div key={key} className="my-2 max-w-full overflow-x-auto rounded-lg border border-ink-100">
          <table className="w-full min-w-[360px] border-collapse text-xs">
            <thead>
              <tr className="bg-ink-50/70">
                {header.map((h, hi) => (
                  <th key={hi} className={`border-b border-ink-100 px-2.5 py-1.5 font-semibold text-ink-700 ${hi === 0 ? 'text-left' : 'text-right'}`}>
                    {inline(h, `${key}h${hi}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className="odd:bg-white even:bg-ink-50/30">
                  {r.map((c, diff) => (
                    <td key={diff} className={`border-b border-ink-50 px-2.5 py-1.5 text-ink-700 ${diff === 0 ? 'text-left font-medium' : 'text-right tabular-nums'}`}>
                      {inline(c, `${key}r${ri}-${diff}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      i = j - 1
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/)
    if (heading) {
      blocks.push(
        <div key={key} className="pt-1 text-[13px] font-semibold text-ink-900">{inline(heading[2], key)}</div>
      )
      continue
    }

    const checklist = line.match(/^- \[( |x)\] (.*)$/)
    if (checklist) {
      const done = checklist[1] === 'x'
      blocks.push(
        <div key={key} className="flex items-start gap-2 pl-1">
          {done
            ? <CheckSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
            : <Square className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400" />}
          <span className={done ? 'text-ink-500' : undefined}>{inline(checklist[2], key)}</span>
        </div>
      )
      continue
    }
    const bullet = line.match(/^- (.*)$/)
    if (bullet) {
      blocks.push(
        <div key={key} className="flex items-start gap-2 pl-1">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
          <span>{inline(bullet[1], key)}</span>
        </div>
      )
      continue
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
      continue
    }
    if (line.trim() === '') {
      blocks.push(<div key={key} className="h-2" />)
      continue
    }
    blocks.push(<p key={key}>{inline(line, key)}</p>)
  }

  return <div className="space-y-1 leading-relaxed">{blocks}</div>
}
