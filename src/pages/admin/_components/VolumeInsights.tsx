import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from 'recharts'
import { ChartCard } from '@/components/ui/ChartCard'
import type { VolumePoint } from '@/data/adminSamples'

export function VolumeInsights({
  data,
  title,
  subtitle = 'Processing volume over the last 7 days · success vs total',
}: {
  data: VolumePoint[]
  title: string
  subtitle?: string
}) {
  return (
    <ChartCard title={title} subtitle={subtitle} source="Demo" height={220}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A148C" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#4A148C" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="successFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D81B60" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#D81B60" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#eef2f7" />
          <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
          <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
          <Area type="monotone" dataKey="volume" stroke="#4A148C" strokeWidth={2} fill="url(#volFill)" name="Total" />
          <Area type="monotone" dataKey="success" stroke="#D81B60" strokeWidth={2} fill="url(#successFill)" name="Success" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
