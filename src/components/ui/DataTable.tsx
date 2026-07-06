import { ReactNode, useMemo, useState } from 'react'
import { ArrowUpDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => ReactNode
  sortable?: boolean
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  searchable = true,
  searchKeys,
  emptyText = 'No records',
  actions,
  compact,
}: {
  columns: Column<T>[]
  rows: T[]
  searchable?: boolean
  searchKeys?: (keyof T)[]
  emptyText?: string
  actions?: ReactNode
  compact?: boolean
}) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filtered = useMemo(() => {
    let list = rows
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((r) => {
        const keys = searchKeys ?? (Object.keys(r) as (keyof T)[])
        return keys.some((k) => String(r[k] ?? '').toLowerCase().includes(q))
      })
    }
    if (sortKey) {
      const dir = sortDir === 'asc' ? 1 : -1
      list = [...list].sort((a, b) => {
        const av = a[sortKey as keyof T]
        const bv = b[sortKey as keyof T]
        if (av == null) return 1
        if (bv == null) return -1
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
        return String(av).localeCompare(String(bv)) * dir
      })
    }
    return list
  }, [rows, query, sortKey, sortDir, searchKeys])

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 p-4">
        {searchable ? (
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="input pl-9"
            />
          </div>
        ) : <div />}
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  className={cn('table-th', c.className, c.sortable && 'cursor-pointer select-none')}
                  onClick={() => {
                    if (!c.sortable) return
                    if (sortKey === String(c.key)) {
                      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
                    } else {
                      setSortKey(String(c.key))
                      setSortDir('asc')
                    }
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    {c.header}
                    {c.sortable && <ArrowUpDown className="h-3 w-3 text-ink-400" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td className="p-8 text-center text-sm text-ink-500" colSpan={columns.length}>{emptyText}</td>
              </tr>
            )}
            {filtered.map((row, i) => (
              <tr key={i} className="hover:bg-ink-50/40">
                {columns.map((c) => (
                  <td key={String(c.key)} className={cn('table-td', compact && 'py-2', c.className)}>
                    {c.render ? c.render(row) : String(row[c.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-ink-100 px-4 py-2 text-xs text-ink-500">
        <div>{filtered.length} of {rows.length} records</div>
        <div>Data category badge shown per row where applicable</div>
      </div>
    </div>
  )
}
