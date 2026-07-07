import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bot, X, ArrowRight, ClipboardList, FileText, ShieldCheck, UserCheck,
  Fingerprint, Gauge, Lock, ScrollText, Sparkles, CheckCircle2, Clock,
} from 'lucide-react'
import {
  IntelligencePageHeader, AIRecommendationPanel, RiskAlertPanel, SeverityBadge, TierBadge,
} from '@/components/intelligence'
import { MetricCard } from '@/components/ui/MetricCard'
import { AI_WORKFORCE, AIOfficer, RiskLevel } from '@/data/administrativeIntelligence'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Role-specific detail content — capabilities, sources, examples      */
/* ------------------------------------------------------------------ */

interface OfficerDetail {
  capabilities: string[]
  documents: string[]
  example: string
}

const OFFICER_DETAILS: Record<string, OfficerDetail> = {
  'Finance AI Officer': {
    capabilities: [
      'Drafts financial concurrence notes with rule citations',
      'Checks expenditure proposals against BE/RE sanctioned limits',
      'Flags deviations from Maharashtra Treasury Rules and delegation of financial powers',
      'Prepares supplementary demand and re-appropriation summaries',
    ],
    documents: ['Budget publication 2026-27', 'Finance Dept circulars', 'BEAMS reports'],
    example: 'Proposal GAD/2026/0412 seeks ₹1.24 Cr under Object Head 31 (Grants-in-aid). Expenditure is within sanctioned BE for FY 2026-27; concurrence recommended subject to conditions in Finance Dept circular dated 04/03/2026.',
  },
  'Legal AI Officer': {
    capabilities: [
      'Summarises pending cases from Bombay High Court cause lists',
      'Prepares affidavit and para-wise reply outlines for officer review',
      'Retrieves relevant precedents and Law & Judiciary Dept opinions',
      'Runs legal-vetting checklists on draft GRs and contracts',
    ],
    documents: ['Bombay High Court cause lists', 'Law & Judiciary Dept opinions', 'Maharashtra Civil Services Rules'],
    example: 'WP 2841/2026 (transfer challenge): petitioner relies on Maharashtra Government Servants Regulation of Transfers Act, 2005 s.4(4)(ii). Draft para-wise reply prepared; two supporting precedents from 2023-24 attached for AGP briefing.',
  },
  'Procurement AI Officer': {
    capabilities: [
      'Scrutinises tender documents against GFR 2017 and CVC guidelines',
      'Auto-prepares comparative statements from bid submissions',
      'Validates L1 justification and single-bid deviation notes',
      'Flags EMD, turnover and blacklisting compliance gaps',
    ],
    documents: ['GFR 2017', 'Mahatenders portal records', 'Industries Dept procurement manual'],
    example: 'Tender GAD/PROC/2026/18 (office modernisation): 6 bids received, 4 technically qualified. L1 quote ₹86.4 L is 7.2% below estimate. One bidder EMD document mismatch flagged for committee decision.',
  },
  'HR AI Officer': {
    capabilities: [
      'Drafts transfer lists per Maharashtra Transfer Act, 2005 norms',
      'Verifies seniority and eligibility from Sevarth service records',
      'Summarises service records, leave balances and disciplinary status',
      'Prepares vacancy and cadre-strength analysis for review meetings',
    ],
    documents: ['Sevarth service records', 'GAD transfer guidelines', 'Maharashtra Transfer Act 2005'],
    example: 'General transfers 2026: 42 Desk Officers completed normal tenure as on 31/05/2026. Draft list prepared with station preference, spouse posting and medical-ground flags; 3 records need manual seniority verification.',
  },
  'Cabinet AI Officer': {
    capabilities: [
      'Drafts cabinet notes in the prescribed GAD format',
      'Consolidates inter-department comments into a single annexure',
      'Tracks follow-up action on cabinet decisions by department',
      'Prepares implementation status briefs for the Chief Secretary',
    ],
    documents: ['Cabinet note templates (GAD)', 'Cabinet decisions register', 'Department implementation reports'],
    example: 'Cabinet decision dt. 24/06/2026 (agenda item 7, drought relief): 4 of 6 follow-up actions completed. Revenue Dept GR pending — draft reminder to Principal Secretary (Revenue) generated for approval.',
  },
  'Policy AI Officer': {
    capabilities: [
      'Benchmarks draft policies against other-state frameworks',
      'Prepares policy impact notes with fiscal and administrative implications',
      'Synthesises stakeholder and public-consultation comments',
      'Builds clause-wise comparison tables for review committees',
    ],
    documents: ['NITI Aayog reports', 'Other-state GRs and policy documents', 'Economic Survey of Maharashtra'],
    example: 'Draft EV policy comparison: Maharashtra incentive ceiling ₹2.5 L vs Gujarat ₹1.5 L and Karnataka ₹2 L. Fiscal impact estimated at ₹340 Cr over 3 years; clause-wise comparison table attached for committee.',
  },
  'Budget AI Officer': {
    capabilities: [
      'Tracks head-wise utilisation against sanctioned budget in BEAMS',
      'Drafts re-appropriation proposals with rule references',
      'Prepares budget briefs and demand-for-grants summaries',
      'Flags slow-moving heads before quarterly expenditure reviews',
    ],
    documents: ['BEAMS reports', 'Budget publication 2026-27', 'Appropriation Accounts'],
    example: 'Q1 FY 2026-27 utilisation for Demand No. G-1: 18.4% against 22% benchmark. Object Head 13 (office expenses) at 9% — flagged slow-moving; draft note for expenditure review meeting generated.',
  },
  'Audit AI Officer': {
    capabilities: [
      'Drafts replies to AG audit paras with supporting references',
      'Summarises audit exposure by department and para age',
      'Tracks compliance status on outstanding inspection reports',
      'Prepares PAC briefing notes and action-taken summaries',
    ],
    documents: ['AG (Audit) inspection reports', 'PAC recommendations', 'Department compliance registers'],
    example: 'Para 3.2 (IR 2024-25, excess payment ₹4.6 L): recovery of ₹3.1 L effected, balance under process. Draft reply with treasury challan references prepared for Under Secretary approval.',
  },
  'RTI AI Officer': {
    capabilities: [
      'Drafts RTI replies within the 30-day statutory timeline',
      'Checks applicability of Section 8/9 exemptions with reasoning',
      'Looks up the proactive disclosure register before drafting',
      'Prepares first-appeal briefs with case history',
    ],
    documents: ['RTI Act 2005 & SIC rulings', 'Proactive disclosure register', 'Department file noting records'],
    example: 'RTI/GAD/2026/1187 seeks file notings on a transfer order. Notings are disclosable per SIC precedent; personal details of third parties severable under s.10. Draft reply with severed annexure prepared.',
  },
  'Translation AI Officer': {
    capabilities: [
      'Translates GRs, letters and notices between Marathi and English',
      'Maintains formal government register and Rajbhasha terminology',
      'Produces bilingual GR drafts with side-by-side verification',
      'Ensures glossary consistency across department documents',
    ],
    documents: ['Rajbhasha Marathi glossary', 'Directorate of Languages style guide', 'Published bilingual GRs'],
    example: '"शासन निर्णय क्रमांक: संकीर्ण-२०२६/प्र.क्र.११२/का-१४" rendered as "Government Resolution No.: Misc-2026/C.R.112/Desk-14" — terminology matched to the Directorate of Languages standard glossary.',
  },
  'Drafting AI Officer': {
    capabilities: [
      'Drafts letters, memos and office orders in the Sachivalaya format',
      'Prepares file notings with correct reference citations',
      'Applies protocol-correct salutations and endorsement lines',
      'Generates reminder and escalation drafts from file history',
    ],
    documents: ['Maharashtra Sachivalaya manual', 'Standard letter templates (GAD)', 'Prior file correspondence'],
    example: 'Draft D.O. letter from Under Secretary (GAD) to all Divisional Commissioners regarding Seva Pandharwada 2026 preparations — references GR dt. 12/06/2026 and requests district action plans by 20/07/2026.',
  },
  'Compliance AI Officer': {
    capabilities: [
      'Runs DPDP Act 2023 compliance checks on datasets and workflows',
      'Flags records past their retention schedule for disposal review',
      'Verifies consent artefacts for citizen data processing',
      'Reviews data classification labels on outgoing documents',
    ],
    documents: ['DPDP Act 2023 & draft rules', 'IT Dept data policy', 'Department retention schedules'],
    example: 'Grievance dataset (Aaple Sarkar export, 14,208 rows) contains Aadhaar fragments in 32 records — masking applied and flagged. Retention: 61 closed records past the 3-year schedule listed for disposal approval.',
  },
  'Citizen Service AI Officer': {
    capabilities: [
      'Classifies incoming grievances by department, scheme and urgency',
      'Drafts first-response and closure communications',
      'Routes escalations per Right to Public Services Act timelines',
      'Detects duplicate and repeat grievances across channels',
    ],
    documents: ['Aaple Sarkar grievance records', 'CPGRAMS category taxonomy', 'RTS Act 2015 service timelines'],
    example: 'Grievance AS/2026/88214 (pension delay, Sangli) classified: Revenue Dept, priority High — 4 days to RTS timeline. Draft interim reply generated; a similar grievance from the same applicant on CPGRAMS flagged as duplicate.',
  },
  'District AI Officer': {
    capabilities: [
      'Prepares district briefs ahead of Collector review meetings',
      'Tracks scheme rollout and beneficiary saturation by taluka',
      'Summarises collectorate weekly reports for the division',
      'Drafts DM conference agenda notes and follow-up trackers',
    ],
    documents: ['District statistical abstracts', 'Scheme MIS reports', 'Collectorate weekly reports'],
    example: "Nashik district brief: Jal Jeevan saturation 91% (3 talukas below 85%), PMAY-G completion 78%. Two pending land-acquisition awards flagged for the Collector's Monday review with draft direction notes.",
  },
  'Planning AI Officer': {
    capabilities: [
      'Analyses annual plan proposals against outcome frameworks',
      'Maps scheme outputs to district development indicators',
      'Detects convergence opportunities across departments',
      'Summarises DPC proposals with fund-availability checks',
    ],
    documents: ['Annual Plan 2026-27', 'Output-Outcome framework', 'DPC proposal records'],
    example: 'DPC Pune 2026-27: 312 proposals worth ₹1,120 Cr against ceiling ₹987 Cr. 41 road-work proposals overlap with MMGSY sanctions — convergence list prepared, freeing ₹96 Cr for reallocation.',
  },
  'Security AI Officer': {
    capabilities: [
      'Triages AI SOC alerts and assigns severity with reasoning',
      'Reviews flagged prompts for injection and jailbreak patterns',
      'Drafts access-anomaly notes for the security review board',
      'Prepares incident summaries mapped to CERT-In categories',
    ],
    documents: ['AI SOC event logs', 'CERT-In advisories', 'Access control audit trails'],
    example: 'Alert SOC-2026-0713: 14 prompt-injection attempts on the RTI assistant from one session — pattern matches signature PI-07 (system-prompt override). Session blocked; incident note drafted for the review board.',
  },
}

const FALLBACK_DETAIL: OfficerDetail = {
  capabilities: [
    'Drafts documents in the prescribed government format',
    'Retrieves and cites relevant GRs and circulars',
    'Flags compliance and policy deviations for officer review',
    'Prepares summaries for approving authorities',
  ],
  documents: ['Department GRs and circulars', 'Sachivalaya manual', 'Department MIS reports'],
  example: 'Draft prepared with source citations and forwarded for officer review.',
}

const RISK_FILTERS: Array<'All' | RiskLevel> = ['All', 'Low', 'Medium', 'High']

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function AIWorkforce() {
  const [riskFilter, setRiskFilter] = useState<'All' | RiskLevel>('All')
  const [selected, setSelected] = useState<AIOfficer | null>(null)

  const totalTasks = useMemo(() => AI_WORKFORCE.reduce((s, o) => s + o.activeTasks, 0), [])
  const avgConfidence = useMemo(
    () => Math.round(AI_WORKFORCE.reduce((s, o) => s + o.confidence, 0) / AI_WORKFORCE.length),
    [],
  )
  const approvalCount = useMemo(() => AI_WORKFORCE.filter((o) => o.humanApproval).length, [])

  const filtered = riskFilter === 'All' ? AI_WORKFORCE : AI_WORKFORCE.filter((o) => o.risk === riskFilter)

  return (
    <div>
      <IntelligencePageHeader
        title="Government AI Workforce"
        subtitle="Role-based AI officers supporting departments and administrative functions of the Government of Maharashtra."
        icon={<Bot className="h-5 w-5" />}
        confidence={90}
      />

      {/* Governance strip */}
      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-brand-100 bg-brand-soft px-4 py-3 text-sm text-brand-800">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
        <span>
          Every AI Officer operates with human-in-the-loop, explainability, confidence scoring, source references,
          audit logs and scoped permissions.
        </span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="AI Officers Active" value={AI_WORKFORCE.length} icon={<Bot className="h-5 w-5" />} source="Demo" confidence={avgConfidence} hint="Deployed across departments" />
        <MetricCard label="Tasks In Progress" value={totalTasks} icon={<ClipboardList className="h-5 w-5" />} delta={9.2} source="Demo" hint="Across all AI officers" />
        <MetricCard label="Avg Confidence" value={`${avgConfidence}%`} icon={<Gauge className="h-5 w-5" />} delta={2.1} source="Demo" hint="Mean across workforce" />
        <MetricCard label="Human Approval Coverage" value={`${approvalCount}/${AI_WORKFORCE.length}`} icon={<UserCheck className="h-5 w-5" />} source="Demo" hint="Translation AI on supervised auto-approve" />
      </div>

      {/* Risk filter chips */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="label !mb-0">Risk level</span>
        {RISK_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setRiskFilter(f)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition',
              riskFilter === f
                ? 'border-brand-600 bg-brand-gradient text-white shadow-glow'
                : 'border-ink-200 bg-white text-ink-600 hover:border-brand-200 hover:text-brand-700',
            )}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-ink-500">{filtered.length} of {AI_WORKFORCE.length} AI officers</span>
      </div>

      {/* Officer card grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((o) => (
          <motion.div
            key={o.role}
            layout
            role="button"
            tabIndex={0}
            onClick={() => setSelected(o)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelected(o) }}
            className="card card-hover group relative cursor-pointer overflow-hidden p-4 text-left sm:p-5"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-gradient opacity-[0.07] blur-2xl transition-opacity duration-300 group-hover:opacity-20"
            />
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-ink-900">{o.role}</span>
                  <SeverityBadge level={o.risk} />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">{o.desc}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <TierBadge score={o.confidence} />
              {o.humanApproval && (
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                  <UserCheck className="h-2.5 w-2.5" /> Human-in-the-loop
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-ink-50 px-2 py-0.5 text-[10px] font-medium text-ink-600">
                <ClipboardList className="h-2.5 w-2.5" /> {o.activeTasks} active tasks
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
              <span className="inline-flex items-center gap-1 text-[11px] text-ink-500">
                <Clock className="h-3 w-3" /> Last used {o.lastUsed}
              </span>
              <Link
                to="/workspace"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded-md border border-brand-200 bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-700 transition hover:bg-brand-100"
              >
                Open workspace <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommendations + risk alerts */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AIRecommendationPanel
          recommendations={[
            { text: 'RTI AI Officer load rising — add second reviewer.', confidence: 88, action: 'Assign' },
            { text: 'Translation AI Officer eligible for auto-approval (93% confidence, 0 escalations).', confidence: 93, action: 'Review' },
            { text: 'Procurement AI Officer outputs pending human approval for 3 days.', confidence: 90, action: 'Nudge' },
            { text: 'Add District AI Officer coverage for 4 more collectorates.', confidence: 85, action: 'Plan' },
          ]}
        />
        <RiskAlertPanel
          alerts={[
            { title: 'Legal AI Officer confidence dipped on affidavit drafts — sample review scheduled.', severity: 'High', owner: 'Dy. Secretary (Law)', due: 'Due 09 Jul' },
            { title: 'Procurement AI Officer approval queue exceeds 72-hr SLA in 2 departments.', severity: 'Medium', owner: 'US (Procurement)', due: 'Due 08 Jul' },
          ]}
        />
      </div>

      {/* Detail slide-over */}
      <AnimatePresence>
        {selected && <OfficerDetailPanel officer={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Detail slide-over                                                   */
/* ------------------------------------------------------------------ */

function OfficerDetailPanel({ officer, onClose }: { officer: AIOfficer; onClose: () => void }) {
  const detail = OFFICER_DETAILS[officer.role] ?? FALLBACK_DETAIL
  const audit = [
    { at: '07 Jul 2026 · 10:42', text: `Draft generated by ${officer.role} (confidence ${officer.confidence}%, ${detail.documents.length} sources cited)` },
    { at: '07 Jul 2026 · 11:05', text: 'Officer review — edits recorded by Desk Officer, GAD (2 paragraphs revised)' },
    { at: '07 Jul 2026 · 11:38', text: 'Forwarded to approving authority — Under Secretary (GAD); action pending' },
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-[2px]"
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl"
        role="dialog"
        aria-label={`${officer.role} details`}
      >
        {/* Header */}
        <div className="bg-brand-gradient p-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <div className="text-base font-bold">{officer.role}</div>
                <div className="mt-0.5 text-xs text-white/80">{officer.desc}</div>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <TierBadge score={officer.confidence} />
            <SeverityBadge level={officer.risk} />
            {officer.humanApproval && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white">
                <UserCheck className="h-2.5 w-2.5" /> Human approval required
              </span>
            )}
            <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-white/80">
              <Clock className="h-3 w-3" /> Last used {officer.lastUsed}
            </span>
          </div>
        </div>

        <div className="space-y-5 p-5">
          {/* Capabilities */}
          <section>
            <div className="section-title mb-2 flex items-center gap-2 text-ink-800">
              <Sparkles className="h-4 w-4 text-brand-600" /> Capabilities
            </div>
            <ul className="space-y-1.5">
              {detail.capabilities.map((c) => (
                <li key={c} className="flex items-start gap-2 rounded-lg border border-ink-100 bg-ink-50/40 px-3 py-2 text-sm text-ink-700">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" /> {c}
                </li>
              ))}
            </ul>
          </section>

          {/* Documents / source references */}
          <section>
            <div className="section-title mb-2 flex items-center gap-2 text-ink-800">
              <FileText className="h-4 w-4 text-brand-600" /> Documents used — source references
            </div>
            <div className="flex flex-wrap gap-2">
              {detail.documents.map((d) => (
                <span key={d} className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                  <FileText className="h-3 w-3" /> {d}
                </span>
              ))}
            </div>
          </section>

          {/* Approval workflow */}
          <section>
            <div className="section-title mb-2 flex items-center gap-2 text-ink-800">
              <UserCheck className="h-4 w-4 text-brand-600" /> Approval workflow
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {['Draft', 'Officer review', 'Approving authority'].map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium',
                      i === 0
                        ? 'border-brand-200 bg-brand-soft text-brand-700'
                        : 'border-ink-200 bg-white text-ink-600',
                    )}
                  >
                    {i + 1}. {step}
                  </span>
                  {i < 2 && <ArrowRight className="h-3.5 w-3.5 text-ink-400" />}
                </span>
              ))}
            </div>
          </section>

          {/* Example output */}
          <section>
            <div className="section-title mb-2 flex items-center gap-2 text-ink-800">
              <ScrollText className="h-4 w-4 text-brand-600" /> Example output
            </div>
            <div className="rounded-xl border border-ink-100 bg-gradient-to-br from-brand-50/50 to-white p-4">
              <p className="text-sm leading-relaxed text-ink-700">“{detail.example}”</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-3">
                <TierBadge score={officer.confidence} />
                <span className="text-[11px] text-ink-500">Sources: {detail.documents.join(' · ')}</span>
              </div>
            </div>
          </section>

          {/* Audit trail */}
          <section>
            <div className="section-title mb-2 flex items-center gap-2 text-ink-800">
              <Fingerprint className="h-4 w-4 text-brand-600" /> Audit trail
            </div>
            <ol className="space-y-2">
              {audit.map((a) => (
                <li key={a.at} className="flex items-start gap-3 rounded-lg border border-ink-100 bg-white px-3 py-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <div>
                    <div className="text-[11px] font-semibold text-ink-500">{a.at}</div>
                    <div className="text-sm text-ink-700">{a.text}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Risk controls */}
          <section>
            <div className="section-title mb-2 flex items-center gap-2 text-ink-800">
              <Lock className="h-4 w-4 text-brand-600" /> Risk controls
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                'Explainability enabled',
                'Confidence threshold 80%',
                'Permission scope: department-read',
                'Human approval required',
              ].map((c) => (
                <span key={c} className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> {c}
                </span>
              ))}
            </div>
          </section>

          <Link
            to="/workspace"
            className="header-btn-primary inline-flex w-full items-center justify-center gap-2 !py-2.5 text-sm"
          >
            Open workspace <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.aside>
    </>
  )
}
