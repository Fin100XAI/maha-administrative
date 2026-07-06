import { FileText, Download, Eye } from 'lucide-react'
import { DataTable, Column } from '@/components/ui/DataTable'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'
import type { UploadRow } from '@/data/adminSamples'
import { Card, CardHeader } from '@/components/ui/Card'

export function UploadsTable({
  rows,
  title = 'Recent uploads',
  subtitle,
}: {
  rows: UploadRow[]
  title?: string
  subtitle?: string
}) {
  const columns: Column<UploadRow>[] = [
    {
      key: 'file',
      header: 'File',
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 shrink-0 text-brand-500" />
          <span className="truncate">{r.file}</span>
        </div>
      ),
    },
    { key: 'uploader', header: 'Uploader', sortable: true },
    { key: 'dept', header: 'Dept', sortable: true },
    { key: 'size', header: 'Size' },
    { key: 'time', header: 'Uploaded' },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex items-center gap-1">
          <button className="rounded-md border border-ink-200 bg-white p-1 text-ink-500 hover:bg-ink-50" title="Preview">
            <Eye className="h-4 w-4" />
          </button>
          <button className="rounded-md border border-ink-200 bg-white p-1 text-ink-500 hover:bg-ink-50" title="Download">
            <Download className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]
  return (
    <Card className="!p-0">
      <div className="p-5 pb-0">
        <CardHeader
          title={title}
          subtitle={subtitle ?? 'Sample dataset — replace with department API'}
          right={<SourceBadge source="Demo" />}
        />
      </div>
      <div className="px-2 pb-2">
        <DataTable columns={columns} rows={rows} searchable searchKeys={['file', 'uploader', 'dept']} compact />
      </div>
    </Card>
  )
}
