import { Keyboard } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'

export interface Shortcut {
  keys: string
  label: string
}

export function Shortcuts({ items, subtitle }: { items: Shortcut[]; subtitle?: string }) {
  return (
    <Card>
      <CardHeader
        title="Shortcuts"
        subtitle={subtitle ?? 'Speed things up with these keybindings'}
        right={<Keyboard className="h-4 w-4 text-ink-400" />}
      />
      <ul className="space-y-2 text-sm">
        {items.map((s) => (
          <li key={s.keys} className="flex items-center justify-between gap-3">
            <span className="min-w-0 truncate text-ink-700">{s.label}</span>
            <span className="shrink-0 rounded-md border border-ink-200 bg-ink-50 px-2 py-0.5 font-mono text-[11px] text-ink-700">
              {s.keys}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
