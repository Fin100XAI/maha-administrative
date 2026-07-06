import { ReactNode } from 'react'
import { Save, Send, Link2, Printer, Zap } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'

export interface QuickAction {
  label: string
  icon?: ReactNode
  primary?: boolean
}

export function QuickActions({
  actions,
  title = 'Quick actions',
  subtitle = 'One-click operations for this workflow',
}: {
  actions?: QuickAction[]
  title?: string
  subtitle?: string
}) {
  const defaults: QuickAction[] = [
    { label: 'Save draft', icon: <Save className="h-4 w-4" /> },
    { label: 'Send for approval', icon: <Send className="h-4 w-4" />, primary: true },
    { label: 'Copy link', icon: <Link2 className="h-4 w-4" /> },
    { label: 'Print', icon: <Printer className="h-4 w-4" /> },
  ]
  const items = actions ?? defaults
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} right={<Zap className="h-4 w-4 text-brand-500" />} />
      <div className="flex flex-wrap gap-2">
        {items.map((a) => (
          <button key={a.label} className={a.primary ? 'btn-primary' : 'btn-outline'}>
            {a.icon}
            {a.label}
          </button>
        ))}
      </div>
    </Card>
  )
}
