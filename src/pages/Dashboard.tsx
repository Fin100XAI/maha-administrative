import {
  Users, Building2, MessageSquare, FileText, PenTool, ClipboardCheck, AlertTriangle, ShieldCheck, Network, Radar,
  Database, Timer, Sparkles, ArrowRight, LayoutDashboard, Activity, Gauge, Siren, Radio, TrendingUp,
  CalendarClock, Bell, ShieldAlert, Cpu, CheckCircle2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Area, AreaChart,
  BarChart, Bar, PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar,
} from 'recharts'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge, SeverityBadge, RiskBadge } from '@/components/ui/Badges'
import { formatNumber } from '@/lib/utils'
import {
  DASHBOARD_METRICS, AI_USAGE_BY_DEPT, DOCUMENT_INTELLIGENCE_VOLUME, RISK_TREND, APPROVAL_STATUS,
  SECURITY_ALERTS_BY_SEVERITY, DPDP_HEATMAP, INTEGRATION_HEALTH, RECENT_GR, RECENT_INCIDENTS,
} from '@/data/mockData'
import { PUBLIC_SOURCES } from '@/data/publicSources'

const BRAND = ['#0B57D0', '#4285F4', '#EA4335', '#FBBC05', '#34A853', '#062868']

// Synthetic 12-slot sparkline for "AI Requests Today"
const AI_REQ_SPARK = [
  { t: 0, v: 68 }, { t: 1, v: 74 }, { t: 2, v: 71 }, { t: 3, v: 82 },
  { t: 4, v: 88 }, { t: 5, v: 92 }, { t: 6, v: 86 }, { t: 7, v: 96 },
  { t: 8, v: 102 }, { t: 9, v: 110 }, { t: 10, v: 118 }, { t: 11, v: 128 },
]

interface HeroTileProps {
  eyebrow: string
  label: string
  value: string
  sublabel: string
  icon: React.ReactNode
  accent: string // tailwind bg for left bar
  children?: React.ReactNode
  pulse?: boolean
}

function HeroTile({ eyebrow, label, value, sublabel, icon, accent, children, pulse }: HeroTileProps) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
      className="group relative overflow-hidden rounded-2xl border border-brand-100/70 bg-gradient-to-br from-white via-brand-50/50 to-brand-100/40 p-5 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      {/* Colored left accent bar */}
      <div className={`pointer-events-none absolute inset-y-0 left-0 w-1.5 ${accent}`} />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-gradient opacity-[0.10] blur-3xl transition-opacity duration-500 group-hover:opacity-25" />
      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #062868 1px, transparent 0)',
        backgroundSize: '16px 16px',
      }} />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700/80">
              {eyebrow}
            </span>
            {pulse && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
            )}
          </div>
          <div className="mt-1 text-sm font-medium text-ink-700">{label}</div>
          <div className="mt-1 text-[34px] font-semibold leading-none tracking-tight text-ink-900 md:text-[38px]">
            {value}
          </div>
          <div className="mt-2 text-xs text-ink-500">{sublabel}</div>
        </div>

        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/80 text-brand-700 shadow-sm ring-1 ring-brand-100 backdrop-blur">
          {icon}
        </div>
      </div>

      {children && <div className="relative mt-3">{children}</div>}
    </motion.div>
  )
}

// Compact DPDP-style horizontal gauge
function CompactGauge({ score }: { score: number }) {
  return (
    <div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-ink-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.25 }}
          className="h-full rounded-full bg-gradient-to-r from-[#0B57D0] via-[#34A853] to-[#062868]"
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-ink-500">
        <span>0</span>
        <span className="font-medium text-brand-700">DPDP-aligned</span>
        <span>100</span>
      </div>
    </div>
  )
}

// Small radial ring for "State Readiness"
function RingProgress({ value }: { value: number }) {
  return (
    <div className="h-16 w-16 shrink-0">
      <ResponsiveContainer>
        <RadialBarChart innerRadius="72%" outerRadius="100%" data={[{ v: value, fill: 'url(#heroRing)' }]} startAngle={90} endAngle={-270}>
          <defs>
            <linearGradient id="heroRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0B57D0" />
              <stop offset="100%" stopColor="#062868" />
            </linearGradient>
          </defs>
          <RadialBar background dataKey="v" cornerRadius={30} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}

const briefIcon = (pri: string) =>
  pri === 'High' ? <ShieldAlert className="h-3.5 w-3.5 text-red-500" /> :
  pri === 'Medium' ? <Bell className="h-3.5 w-3.5 text-amber-500" /> :
  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />

const severityDot = (sev: string) =>
  sev === 'Critical' ? 'bg-red-500' :
  sev === 'High' ? 'bg-orange-500' :
  sev === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'

const timeAgo = (iso: string) => {
  const t = new Date(iso).getTime()
  const diff = Date.now() - t
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const sourceStatusStyle = (s: string) => {
  switch (s) {
    case 'Live': return 'bg-emerald-500'
    case 'Linked': return 'bg-sky-500'
    case 'Pending API': return 'bg-amber-500'
    case 'Requires Government Access': return 'bg-google-blue-500'
    default: return 'bg-ink-400'
  }
}

export function Dashboard() {
  const m = DASHBOARD_METRICS
  const topSources = PUBLIC_SOURCES.slice(0, 5)

  return (
    <div>
      <PageHeader
        title="Administrative Command Dashboard"
        description="Executive view of AI usage, risk, compliance and security across Government of Maharashtra. Data below is a mix of public-source references and demo operational data."
        breadcrumb={['MAII', 'Command Dashboard']}
        eyebrow="India's Sovereign AI · Command Center"
        icon={<LayoutDashboard className="h-5 w-5" />}
        actions={
          <>
            <button className="btn-outline">Public source status</button>
            <Link to="/workspace" className="btn-primary"><Sparkles className="h-4 w-4"/>Open AI Workspace <ArrowRight className="h-4 w-4" /></Link>
          </>
        }
      />

      {/* Hero Strip — Command Bar */}
      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
        className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <HeroTile
          eyebrow="Composite Index"
          label="State AI Readiness"
          value="82/100"
          sublabel="Ready for tier-2 department roll-out"
          icon={<Gauge className="h-5 w-5" />}
          accent="bg-gradient-to-b from-[#0B57D0] to-[#34A853]"
        >
          <div className="flex items-center gap-3">
            <RingProgress value={82} />
            <div className="grid flex-1 grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
              <div className="flex items-center justify-between text-ink-500"><span>Governance</span><span className="font-semibold text-ink-800">86</span></div>
              <div className="flex items-center justify-between text-ink-500"><span>Security</span><span className="font-semibold text-ink-800">84</span></div>
              <div className="flex items-center justify-between text-ink-500"><span>DPDP</span><span className="font-semibold text-ink-800">87</span></div>
              <div className="flex items-center justify-between text-ink-500"><span>Ops</span><span className="font-semibold text-ink-800">72</span></div>
            </div>
          </div>
        </HeroTile>

        <HeroTile
          eyebrow="Live Traffic"
          label="AI Requests Today"
          value="1.28M"
          sublabel="+12.1% vs. yesterday · peak at 14:00"
          icon={<Activity className="h-5 w-5" />}
          accent="bg-gradient-to-b from-[#EA4335] to-[#4285F4]"
          pulse
        >
          <div className="h-12">
            <ResponsiveContainer>
              <AreaChart data={AI_REQ_SPARK} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gSpark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0B57D0" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#0B57D0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#0B57D0" strokeWidth={2} fill="url(#gSpark)" isAnimationActive />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </HeroTile>

        <HeroTile
          eyebrow="Compliance"
          label="DPDP Compliance Score"
          value="87/100"
          sublabel="+2.1 pts vs. last quarter · 41 depts audited"
          icon={<ShieldCheck className="h-5 w-5" />}
          accent="bg-gradient-to-b from-[#34A853] to-[#062868]"
        >
          <CompactGauge score={87} />
        </HeroTile>

        <HeroTile
          eyebrow="AI SOC"
          label="Active AI Incidents"
          value="12"
          sublabel="2 critical · 4 high · SOC on watch"
          icon={<Siren className="h-5 w-5" />}
          accent="bg-gradient-to-b from-[#0B57D0] to-[#062868]"
          pulse
        >
          <div className="flex items-center gap-1.5">
            {[3, 4, 5].map((n, i) => {
              const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500']
              return (
                <div key={i} className="flex flex-1 items-center gap-1.5 rounded-md bg-white/60 px-2 py-1 ring-1 ring-brand-100">
                  <span className={`h-1.5 w-1.5 rounded-full ${colors[i]}`} />
                  <span className="text-[10px] font-medium text-ink-600">{['Critical','High','Med'][i]}</span>
                  <span className="ml-auto text-[11px] font-semibold text-ink-900">{n}</span>
                </div>
              )
            })}
          </div>
        </HeroTile>
      </motion.div>

      {/* KPI cards */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-brand-600" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-600">Key Performance Indicators</h2>
        </div>
        <span className="text-[11px] text-ink-500">12 metrics · rolling 30-day window</span>
      </div>

      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {([
          { label: 'Total Officers Onboarded', value: formatNumber(m.officersOnboarded), delta: 4.2, source: 'Department API required', confidence: 82, icon: <Users className="h-5 w-5" />, hint: 'Across 41 departments' },
          { label: 'Departments Connected', value: m.departmentsConnected, delta: 6.8, source: 'Public-source linked', confidence: 90, icon: <Building2 className="h-5 w-5" />, hint: 'Live handshakes with GAD, DIT' },
          { label: 'AI Requests Processed', value: formatNumber(m.aiRequests), delta: 12.1, source: 'Demo', confidence: 88, icon: <MessageSquare className="h-5 w-5" />, hint: 'Rolling 30-day window' },
          { label: 'Documents Analysed', value: formatNumber(m.documentsAnalysed), delta: 9.4, source: 'Demo', confidence: 84, icon: <FileText className="h-5 w-5" />, hint: 'PDF · Excel · Image · OCR' },
          { label: 'Drafts Generated', value: formatNumber(m.draftsGenerated), delta: 7.2, source: 'Demo', confidence: 86, icon: <PenTool className="h-5 w-5" />, hint: 'Letters, notes, RTI replies' },
          { label: 'Pending Human Approvals', value: m.pendingApprovals, delta: -3.4, source: 'Demo', confidence: 92, icon: <ClipboardCheck className="h-5 w-5" />, hint: 'SLA breach: 4 items' },
          { label: 'AI Risk Alerts', value: m.aiRiskAlerts, delta: -18, source: 'Demo', confidence: 80, icon: <AlertTriangle className="h-5 w-5" />, hint: '2 critical · 4 high' },
          { label: 'DPDP Compliance Score', value: `${m.dpdpComplianceScore}/100`, delta: 2.1, source: 'Public-source linked', confidence: 88, icon: <ShieldCheck className="h-5 w-5" />, hint: 'DPDP Act 2023 benchmark' },
          { label: 'Active Integrations', value: `${m.activeIntegrations} of 22`, delta: 0, source: 'Public-source linked', confidence: 76, icon: <Network className="h-5 w-5" />, hint: '8 pending API access' },
          { label: 'Security Events (24h)', value: m.securityEvents, delta: -22.5, source: 'Demo', confidence: 90, icon: <Radar className="h-5 w-5" />, hint: '3 critical, blocked' },
          { label: 'Knowledge Documents Indexed', value: formatNumber(m.knowledgeDocs), delta: 5.6, source: 'Demo', confidence: 86, icon: <Database className="h-5 w-5" />, hint: 'GR · Circular · SOP · FAQ' },
          { label: 'Avg. Time Saved / Officer', value: `${m.avgTimeSavedHours} hrs / day`, delta: 8.3, source: 'Demo', confidence: 72, icon: <Timer className="h-5 w-5" />, hint: 'Estimate — pilot cohort' },
        ] as any[]).map((c) => (
          <motion.div
            key={c.label}
            variants={{
              hidden: { opacity: 0, y: 12, scale: 0.985 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
            }}
          >
            <MetricCard {...c} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row 1 */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartCard title="AI Usage by Department" subtitle="Rolling 30-day request volume" source="Demo">
          <ResponsiveContainer>
            <BarChart data={AI_USAGE_BY_DEPT} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B57D0" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#062868" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="dept" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="value" fill="url(#g1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Document Intelligence Volume" subtitle="Monthly document counts by type" source="Demo">
          <ResponsiveContainer>
            <AreaChart data={DOCUMENT_INTELLIGENCE_VOLUME} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="gGR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0B57D0" stopOpacity={0.5}/><stop offset="100%" stopColor="#0B57D0" stopOpacity={0.02}/></linearGradient>
                <linearGradient id="gCR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4285F4" stopOpacity={0.45}/><stop offset="100%" stopColor="#4285F4" stopOpacity={0.02}/></linearGradient>
                <linearGradient id="gFI" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EA4335" stopOpacity={0.4}/><stop offset="100%" stopColor="#EA4335" stopOpacity={0.02}/></linearGradient>
                <linearGradient id="gRT" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#062868" stopOpacity={0.4}/><stop offset="100%" stopColor="#062868" stopOpacity={0.02}/></linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="GR" stroke="#0B57D0" fill="url(#gGR)" />
              <Area type="monotone" dataKey="Circular" stroke="#4285F4" fill="url(#gCR)" />
              <Area type="monotone" dataKey="File" stroke="#EA4335" fill="url(#gFI)" />
              <Area type="monotone" dataKey="RTI" stroke="#062868" fill="url(#gRT)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Approval Workflow Status" subtitle="Cumulative last 90 days" source="Demo">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={APPROVAL_STATUS}
                dataKey="value"
                nameKey="name"
                innerRadius={54}
                outerRadius={90}
                paddingAngle={2}
              >
                {APPROVAL_STATUS.map((_, i) => <Cell key={i} fill={BRAND[i % BRAND.length]} />)}
              </Pie>
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartCard title="AI Risk Trend" subtitle="Composite risk index — last 7 days" source="Demo">
          <ResponsiveContainer>
            <LineChart data={RISK_TREND}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="risk" stroke="#0B57D0" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="incidents" stroke="#062868" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Security Alerts by Severity" subtitle="Grouped last 24h" source="Demo">
          <ResponsiveContainer>
            <BarChart data={SECURITY_ALERTS_BY_SEVERITY} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid horizontal={false} stroke="#eef2f7" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="severity" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {SECURITY_ALERTS_BY_SEVERITY.map((r, i) => (
                  <Cell key={i} fill={r.severity === 'Critical' ? '#DC2626' : r.severity === 'High' ? '#EA580C' : r.severity === 'Medium' ? '#D97706' : '#059669'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="DPDP Compliance Heatmap" subtitle="Dimension-wise score, department-wise" source="Public-source linked">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-xs">
              <thead>
                <tr className="text-ink-500">
                  <th className="p-1 text-left font-medium">Dept</th>
                  {['Consent', 'Retention', 'Purpose', 'Lineage', 'Class'].map((k) => (
                    <th key={k} className="p-1 text-left font-medium">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DPDP_HEATMAP.map((row) => (
                  <tr key={row.dept}>
                    <td className="p-1 font-medium text-ink-800">{row.dept}</td>
                    {(['consent','retention','purpose','lineage','class'] as const).map((k) => {
                      const v = row[k]
                      const hue = v >= 90 ? 'bg-emerald-500' : v >= 80 ? 'bg-emerald-400' : v >= 70 ? 'bg-amber-400' : 'bg-red-400'
                      return (
                        <td key={k} className="p-1">
                          <div className="flex items-center gap-2">
                            <div className={`h-4 w-8 rounded ${hue}`} />
                            <span className="text-ink-700">{v}</span>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      {/* Panels — enriched */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-gradient opacity-[0.06] blur-3xl" />
          <CardHeader
            title={
              <span className="inline-flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-brand-600" />
                Today's Administrative Brief
              </span>
            }
            subtitle="AI-summarised for the desk of the Chief Secretary"
            right={<SourceBadge source="Demo" />}
          />
          <ul className="relative space-y-2.5 text-sm">
            {[
              { pri: 'High', text: 'PMAY-U 2.0 verification workflow rolls out today — Urban Development requires district roll-up by EOD.' },
              { pri: 'Medium', text: 'Kharif crop-loss appeals SOP takes effect; district collectors to nominate standing committees.' },
              { pri: 'Medium', text: 'CERT-In advisory on prompt-injection patterns received — pushed to AI SOC.' },
              { pri: 'Low', text: 'e-HRMS quarterly reconciliation window opens tomorrow.' },
            ].map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="group flex items-start gap-3 rounded-lg border border-ink-100/70 bg-white p-3 transition-colors hover:border-brand-200 hover:bg-brand-soft/40"
              >
                <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-ink-50 ring-1 ring-ink-100">
                  {briefIcon(b.pri)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <SeverityBadge level={b.pri as any} />
                    <span className="text-[10px] uppercase tracking-widest text-ink-400">Priority</span>
                  </div>
                  <div className="mt-1 text-ink-700">{b.text}</div>
                </div>
              </motion.li>
            ))}
          </ul>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />
          <CardHeader
            title={
              <span className="inline-flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                Critical AI Governance Alerts
                <span className="relative ml-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                </span>
              </span>
            }
            subtitle="Requires review by AI Governance Officer"
            right={<Link to="/governance" className="text-xs font-medium text-brand-600 hover:underline">Open governance →</Link>}
          />
          <ul className="relative space-y-2.5 text-sm">
            {RECENT_INCIDENTS.map((i, idx) => (
              <motion.li
                key={i.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="group flex items-start justify-between gap-3 rounded-lg border border-ink-100/70 bg-white p-3 transition-all hover:border-rose-200 hover:shadow-sm"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center">
                    <span className={`h-2 w-2 rounded-full ${severityDot(i.severity)} animate-pulse`} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink-800">{i.title}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-500">
                      <span className="font-mono">{i.id}</span>
                      <span>·</span>
                      <span>AI SOC</span>
                      <span>·</span>
                      <span>{timeAgo(i.at)}</span>
                    </div>
                  </div>
                </div>
                <SeverityBadge level={i.severity as any} />
              </motion.li>
            ))}
          </ul>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-52 w-52 rounded-full bg-brand-gradient opacity-[0.08] blur-3xl" />
          <CardHeader
            title={
              <span className="inline-flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-600" />
                MAII Readiness Score
              </span>
            }
            subtitle="Composite across Governance, Security, DPDP, Ops"
            right={<SourceBadge source="Demo" />}
          />
          <div className="relative flex items-center gap-5">
            <div className="relative h-40 w-40 shrink-0">
              <ResponsiveContainer>
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ v: 82, fill: 'url(#gRad)' }]} startAngle={90} endAngle={-270}>
                  <defs>
                    <linearGradient id="gRad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0B57D0" />
                      <stop offset="100%" stopColor="#062868" />
                    </linearGradient>
                  </defs>
                  <RadialBar background dataKey="v" cornerRadius={30} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-semibold text-ink-900">82</div>
                <div className="-mt-1 text-[10px] font-medium uppercase tracking-widest text-ink-400">/ 100</div>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-emerald-700">Ready for tier-2 roll-out</div>
              <ul className="mt-3 space-y-2 text-xs">
                {[
                  { k: 'Governance', v: 86, color: 'from-[#0B57D0] to-[#34A853]' },
                  { k: 'Security', v: 84, color: 'from-[#EA4335] to-[#4285F4]' },
                  { k: 'DPDP', v: 87, color: 'from-[#34A853] to-[#062868]' },
                  { k: 'Operations', v: 72, color: 'from-[#FBBC05] to-[#062868]' },
                ].map((r) => (
                  <li key={r.k}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-ink-600">{r.k}</span>
                      <span className="font-semibold text-ink-800">{r.v}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${r.v}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        className={`h-full rounded-full bg-gradient-to-r ${r.color}`}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Latest GR / Circular Intelligence"
            subtitle="Auto-parsed by MAII from Maharashtra GR portal"
            right={<Link to="/gr-repo" className="text-xs text-brand-600 hover:underline">Open repository →</Link>}
          />
          <div className="space-y-3">
            {RECENT_GR.map((g) => (
              <div key={g.id} className="rounded-xl border border-ink-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-ink-500">{g.id} · {g.dept} · {g.date}</div>
                    <div className="text-sm font-semibold text-ink-900">{g.title}</div>
                    <p className="mt-1 text-sm text-ink-600">{g.summary}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <RiskBadge level={g.impact as any} />
                    <SourceBadge source="Public-source linked" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Integration Health"
            subtitle="Live status of GoM system connectors"
            right={<Link to="/integrations" className="text-xs text-brand-600 hover:underline">Manage →</Link>}
          />
          <ul className="space-y-2 text-sm">
            {INTEGRATION_HEALTH.map((i) => (
              <li key={i.name} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink-800">{i.name}</div>
                  <div className="text-[11px] text-ink-500">Uptime {i.uptime}% · Latency {i.latency}ms</div>
                </div>
                <StatusBadge status={i.status as any} />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Public Source Data Status ticker */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6 overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50/70 via-white to-brand-100/50 p-4 shadow-sm"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <Radio className="h-4 w-4 text-brand-600" />
            <h3 className="text-sm font-semibold text-ink-900">Public Source Data Status</h3>
            <span className="text-[11px] text-ink-500">· Top 5 GoM references · Live health</span>
          </div>
          <Link to="/public-sources" className="text-[11px] font-medium text-brand-600 hover:underline">View all sources →</Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {topSources.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="group flex min-w-[240px] shrink-0 items-center gap-3 rounded-xl border border-ink-100/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur transition-all hover:border-brand-200 hover:shadow-md"
            >
              <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${sourceStatusStyle(s.status)}`} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-ink-900">{s.name}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-ink-500">
                  <span className="truncate">{s.status}</span>
                  <span>·</span>
                  <span className="whitespace-nowrap">Checked {s.lastChecked}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
