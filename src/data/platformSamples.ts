// Demo / illustrative data for the Platform Admin and Integrations enrichments.
// Nothing here is live — labelled Demo on the UI.

// ---------- Integrations dashboard ----------

export const CONNECTOR_ROADMAP: {
  slug: string
  name: string
  stage: 'Discovery' | 'MoU' | 'Build' | 'VAPT' | 'Pilot' | 'Live'
  eta: string
}[] = [
  { slug: 'e-office', name: 'e-Office', stage: 'Build', eta: 'Q3 FY26' },
  { slug: 'rti', name: 'RTI Online', stage: 'Pilot', eta: 'Q2 FY26' },
  { slug: 'e-hrms', name: 'e-HRMS 2.0', stage: 'MoU', eta: 'Q4 FY26' },
  { slug: 'aaple-sarkar', name: 'Aaple Sarkar', stage: 'Discovery', eta: 'Q1 FY27' },
  { slug: 'mahadbt', name: 'MahaDBT 2.0', stage: 'MoU', eta: 'Q4 FY26' },
  { slug: 'email', name: 'Email Gateway', stage: 'Live', eta: 'Live' },
  { slug: 'sms', name: 'SMS Gateway', stage: 'Live', eta: 'Live' },
  { slug: 'dms', name: 'Document Management', stage: 'Live', eta: 'Live' },
  { slug: 'api-gateway', name: 'API Gateway', stage: 'Live', eta: 'Live' },
]

export const CONNECTOR_ERRORS: {
  ts: string
  connector: string
  error: string
  action: string
  severity: 'Low' | 'Medium' | 'High'
}[] = [
  { ts: '2026-07-07 09:31', connector: 'e-Office', error: '429 rate-limited by NIC gateway', action: 'Back-off + retry queue', severity: 'Medium' },
  { ts: '2026-07-07 08:47', connector: 'DMS', error: 'DEK unwrap timed out (HSM slot A)', action: 'Failover to slot B', severity: 'High' },
  { ts: '2026-07-07 07:12', connector: 'SMS Gateway', error: 'DLT template mismatch', action: 'Blocked send · alert DIT', severity: 'Medium' },
  { ts: '2026-07-06 22:44', connector: 'RTI Online', error: 'Portal maintenance window (503)', action: 'Circuit-breaker open 6m', severity: 'Low' },
  { ts: '2026-07-06 20:18', connector: 'API Gateway', error: 'JWT clock skew > 90s', action: 'NTP re-sync', severity: 'Low' },
  { ts: '2026-07-06 15:02', connector: 'Email Gateway', error: 'SPF alignment failure (bulk)', action: 'Quarantined 4 messages', severity: 'Medium' },
  { ts: '2026-07-06 11:38', connector: 'e-Office', error: 'Schema drift · new field departmentCode', action: 'Auto-mapped · flagged for review', severity: 'Low' },
  { ts: '2026-07-05 19:04', connector: 'DMS', error: 'Chunk hash mismatch on upload', action: 'Re-uploaded 2 chunks', severity: 'Medium' },
]

export const CONNECTOR_TRAFFIC_7D: { day: string; eOffice: number; rti: number; dms: number; email: number; sms: number; gateway: number }[] = [
  { day: 'Mon', eOffice: 4210, rti: 1240, dms: 6820, email: 9110, sms: 12440, gateway: 24880 },
  { day: 'Tue', eOffice: 4620, rti: 1360, dms: 7010, email: 9420, sms: 12980, gateway: 25640 },
  { day: 'Wed', eOffice: 4790, rti: 1420, dms: 7280, email: 9640, sms: 13100, gateway: 26120 },
  { day: 'Thu', eOffice: 4510, rti: 1350, dms: 6980, email: 9280, sms: 12870, gateway: 25340 },
  { day: 'Fri', eOffice: 4880, rti: 1480, dms: 7440, email: 9760, sms: 13260, gateway: 26580 },
  { day: 'Sat', eOffice: 2210, rti: 620, dms: 3980, email: 5220, sms: 7440, gateway: 14260 },
  { day: 'Sun', eOffice: 1210, rti: 410, dms: 2610, email: 3280, sms: 4890, gateway: 9420 },
]

export const CONNECTOR_SLA: { slug: string; name: string; slaTarget: number; observed: number; incidents30d: number }[] = [
  { slug: 'email', name: 'Email Gateway', slaTarget: 99.9, observed: 99.98, incidents30d: 0 },
  { slug: 'sms', name: 'SMS Gateway', slaTarget: 99.9, observed: 99.95, incidents30d: 1 },
  { slug: 'dms', name: 'Document Management', slaTarget: 99.9, observed: 99.87, incidents30d: 2 },
  { slug: 'api-gateway', name: 'API Gateway', slaTarget: 99.95, observed: 99.99, incidents30d: 0 },
  { slug: 'e-office', name: 'e-Office (pilot)', slaTarget: 99.0, observed: 98.42, incidents30d: 4 },
  { slug: 'rti', name: 'RTI Online (link)', slaTarget: 98.0, observed: 97.6, incidents30d: 3 },
]

// ---------- Integration detail ----------

export interface TestStep {
  name: string
  status: 'Pass' | 'Fail' | 'Skipped'
  detail: string
  ms: number
}

export function testStepsFor(slug: string): TestStep[] {
  const live = ['email', 'sms', 'dms', 'api-gateway'].includes(slug)
  if (live) {
    return [
      { name: 'Ping', status: 'Pass', detail: 'TLS handshake 42ms · cert valid till 2027-03', ms: 42 },
      { name: 'Auth', status: 'Pass', detail: 'mTLS + JWT verified · aud=maii-gateway', ms: 118 },
      { name: 'Fetch sample', status: 'Pass', detail: 'GET /v1/health returned 200', ms: 96 },
      { name: 'Validate schema', status: 'Pass', detail: 'Response matches OpenAPI 3.1 contract', ms: 24 },
      { name: 'Rate-limit test', status: 'Pass', detail: '10 rps sustained · 0 throttling', ms: 1010 },
    ]
  }
  return [
    { name: 'Ping', status: 'Pass', detail: 'TLS handshake 128ms · public endpoint reachable', ms: 128 },
    { name: 'Auth', status: 'Fail', detail: 'Awaiting client-cert issue by NIC', ms: 0 },
    { name: 'Fetch sample', status: 'Skipped', detail: 'Requires auth', ms: 0 },
    { name: 'Validate schema', status: 'Skipped', detail: 'Requires sample payload', ms: 0 },
    { name: 'Rate-limit test', status: 'Skipped', detail: 'Blocked upstream', ms: 0 },
  ]
}

export const SAMPLE_REQUEST = `POST /v1/officer/session
Host: gateway.maii.mah.gov.in
Authorization: Bearer <redacted>
X-Consent-Header: dept=DIT; purpose=note-drafting
Content-Type: application/json

{
  "officerId": "IAS-2011-MH-0182",
  "department": "DIT",
  "role": "Principal Secretary",
  "mfa": { "method": "TOTP", "verified": true }
}`

export const SAMPLE_RESPONSE = `HTTP/1.1 200 OK
Content-Type: application/json
X-Request-Id: 7f1c...9a2b
X-Audit-Hash: sha256:9d4c...c1ee

{
  "sessionId": "sess_01HP6X7Q...",
  "expiresIn": 3600,
  "policies": ["dpdp.v2", "classification.confidential"],
  "audit": { "logged": true, "immutable": true }
}`

export const CHANGE_LOG: { version: string; date: string; note: string }[] = [
  { version: 'v1.6.0', date: '2026-06-24', note: 'Added consent-header propagation for downstream calls.' },
  { version: 'v1.5.2', date: '2026-05-18', note: 'Fix: retry on 429 with jitter.' },
  { version: 'v1.5.0', date: '2026-04-02', note: 'Schema v2 · optional departmentCode.' },
  { version: 'v1.4.0', date: '2026-02-11', note: 'mTLS enforcement · dropped basic-auth fallback.' },
  { version: 'v1.3.1', date: '2025-12-08', note: 'Observability: p95/p99 histograms exported.' },
  { version: 'v1.3.0', date: '2025-10-24', note: 'Initial GA — six read endpoints.' },
]

export const ENDPOINT_METRICS: { endpoint: string; calls24h: number; p95ms: number; errorRate: number }[] = [
  { endpoint: 'GET  /v1/health', calls24h: 43210, p95ms: 24, errorRate: 0.00 },
  { endpoint: 'POST /v1/officer/session', calls24h: 8420, p95ms: 340, errorRate: 0.12 },
  { endpoint: 'GET  /v1/officer/{id}', calls24h: 6180, p95ms: 210, errorRate: 0.08 },
  { endpoint: 'POST /v1/documents/upload', calls24h: 2140, p95ms: 1820, errorRate: 0.42 },
  { endpoint: 'GET  /v1/documents/{id}', calls24h: 12840, p95ms: 260, errorRate: 0.06 },
  { endpoint: 'POST /v1/audit/write', calls24h: 91020, p95ms: 68, errorRate: 0.01 },
]

// ---------- Secure Login ----------

export const LOGIN_ATTEMPTS_7D: { day: string; success: number; failed: number; mfaBlocked: number }[] = [
  { day: 'Mon', success: 8240, failed: 138, mfaBlocked: 42 },
  { day: 'Tue', success: 8720, failed: 156, mfaBlocked: 51 },
  { day: 'Wed', success: 8910, failed: 172, mfaBlocked: 63 },
  { day: 'Thu', success: 8480, failed: 141, mfaBlocked: 44 },
  { day: 'Fri', success: 9020, failed: 188, mfaBlocked: 58 },
  { day: 'Sat', success: 3140, failed: 74, mfaBlocked: 21 },
  { day: 'Sun', success: 1820, failed: 39, mfaBlocked: 12 },
]

export const OFFICER_SESSIONS: {
  officer: string
  role: string
  device: string
  location: string
  since: string
  duration: string
}[] = [
  { officer: 'IAS-2011-MH-0182', role: 'Principal Secretary', device: 'macOS · managed', location: 'Mantralaya, Mumbai', since: '09:12', duration: '00:42' },
  { officer: 'IAS-2019-MH-0410', role: 'Department Officer',  device: 'Windows · managed', location: 'Nagpur Collectorate', since: '08:58', duration: '00:56' },
  { officer: 'MPSC-2020-1281',   role: 'Section Officer',     device: 'Windows · managed', location: 'Mantralaya, Mumbai', since: '09:34', duration: '00:20' },
  { officer: 'IAS-2015-MH-0221', role: 'District Collector',  device: 'iPad · managed',    location: 'Pune Collectorate',  since: '09:04', duration: '00:50' },
  { officer: 'MPSC-2019-2440',   role: 'Department Officer',  device: 'macOS · managed',   location: 'Aurangabad DivCom',  since: '09:18', duration: '00:36' },
  { officer: 'IAS-2013-MH-0198', role: 'Principal Secretary', device: 'Windows · managed', location: 'Mantralaya, Mumbai', since: '08:47', duration: '01:07' },
  { officer: 'MPSC-2018-1102',   role: 'Section Officer',     device: 'Windows · managed', location: 'Mantralaya, Mumbai', since: '09:22', duration: '00:32' },
  { officer: 'IAS-2010-MH-0074', role: 'Chief Secretary',     device: 'macOS · managed',   location: 'Mantralaya, Mumbai', since: '08:32', duration: '01:22' },
  { officer: 'IAS-2017-MH-0331', role: 'Municipal Commissioner', device: 'iPad · managed', location: 'BMC HQ, Mumbai',     since: '09:01', duration: '00:53' },
  { officer: 'MPSC-2021-1874',   role: 'Section Officer',     device: 'Windows · managed', location: 'Nashik DivCom',      since: '09:44', duration: '00:10' },
]

export const AUTH_METHODS: { method: string; rollout: number; status: 'Live' | 'Pilot' | 'Planned'; note: string }[] = [
  { method: 'Password + policy', rollout: 100, status: 'Live', note: 'NIST 800-63B aligned · 90d rotation' },
  { method: 'TOTP (NIC MFA)',    rollout: 96,  status: 'Live', note: '6-digit · time-drift ±30s' },
  { method: 'Hardware key (FIDO2)', rollout: 42, status: 'Pilot', note: 'YubiKey 5 for gazetted officers' },
  { method: 'Passkey (WebAuthn)', rollout: 18, status: 'Pilot', note: 'Platform authenticators on managed devices' },
  { method: 'SSO (NIC IdP)',     rollout: 74,  status: 'Live', note: 'SAML 2.0 · signed assertions' },
]

export const LOGIN_ANOMALIES: { ts: string; officer: string; reason: string; action: string }[] = [
  { ts: '2026-07-07 03:12', officer: 'IAS-2011-MH-0182', reason: 'Impossible travel · Mumbai to Dubai in 22m', action: 'Session terminated · officer notified' },
  { ts: '2026-07-06 22:11', officer: 'MPSC-2019-2440',   reason: 'Login from unmanaged BYOD', action: 'Blocked · escalated to Security Officer' },
  { ts: '2026-07-06 19:44', officer: 'IAS-2015-MH-0221', reason: 'Repeated MFA failures (5)', action: 'Account soft-locked 15m' },
]

// ---------- RBAC ----------

export const RBAC_WORKFLOW: { step: string; owner: string; sla: string }[] = [
  { step: 'Request',   owner: 'Officer / SO', sla: '—' },
  { step: 'Review',    owner: 'Reporting officer', sla: '1 working day' },
  { step: 'Approve',   owner: 'Dept Secretary', sla: '2 working days' },
  { step: 'Provision', owner: 'IT Admin', sla: '4 hours' },
  { step: 'Certify',   owner: 'DPO / Security Officer', sla: 'Quarterly' },
]

export const ROLE_USAGE: { role: string; activeMonthly: number }[] = [
  { role: 'Section Officer',     activeMonthly: 4820 },
  { role: 'Department Officer',  activeMonthly: 3110 },
  { role: 'District Collector',  activeMonthly: 36 },
  { role: 'Municipal Commissioner', activeMonthly: 28 },
  { role: 'Principal Secretary', activeMonthly: 42 },
  { role: 'IT Admin',            activeMonthly: 88 },
  { role: 'AI Governance Officer', activeMonthly: 24 },
  { role: 'Security Officer',    activeMonthly: 31 },
  { role: 'Data Protection Officer', activeMonthly: 19 },
  { role: 'Chief Secretary',     activeMonthly: 6 },
]

export const TOXIC_COMBOS: { pair: string; risk: 'Medium' | 'High' | 'Critical'; detail: string; found: number }[] = [
  { pair: 'RBAC admin + Audit reader', risk: 'High',     detail: 'Can grant self access and clear audit trail signal.', found: 2 },
  { pair: 'Prompt approver + Model publisher', risk: 'Critical', detail: 'Single-person can ship an unreviewed model.', found: 0 },
  { pair: 'Data classifier + DPDP exemption', risk: 'High',     detail: 'Can downgrade classification and bypass DPO.', found: 1 },
  { pair: 'DMS uploader + Retention override', risk: 'Medium',  detail: 'Can defeat retention policy for uploaded docs.', found: 3 },
]

export const ROLE_BY_DEPT: { dept: string; officers: number; distinctRoles: number }[] = [
  { dept: 'GAD',  officers: 1220, distinctRoles: 7 },
  { dept: 'DIT',  officers: 480,  distinctRoles: 9 },
  { dept: 'FIN',  officers: 940,  distinctRoles: 6 },
  { dept: 'REV',  officers: 5250, distinctRoles: 8 },
  { dept: 'HFW',  officers: 6320, distinctRoles: 7 },
  { dept: 'HOME', officers: 3410, distinctRoles: 8 },
  { dept: 'EDU',  officers: 4600, distinctRoles: 6 },
  { dept: 'UDD',  officers: 2810, distinctRoles: 7 },
]

// ---------- Audit Logs ----------

export const HASH_CHAIN: { seq: number; ts: string; hash: string; prev: string }[] = [
  { seq: 91_022, ts: '2026-07-07 09:32:14', hash: '9d4c...c1ee', prev: '8a1b...44f2' },
  { seq: 91_021, ts: '2026-07-07 09:31:58', hash: '8a1b...44f2', prev: '77c9...9812' },
  { seq: 91_020, ts: '2026-07-07 09:30:44', hash: '77c9...9812', prev: '6641...aa03' },
  { seq: 91_019, ts: '2026-07-07 09:29:11', hash: '6641...aa03', prev: '5518...bd77' },
]

export const COMPLIANCE_REPORTS: { name: string; scope: string; lastRun: string; nextDue: string }[] = [
  { name: 'SOC 2 Type II',    scope: 'Trust services criteria', lastRun: '2026-06-20', nextDue: '2026-09-20' },
  { name: 'ISO/IEC 27001',    scope: 'ISMS control set',        lastRun: '2026-05-14', nextDue: '2026-08-14' },
  { name: 'DPDP Act 2023',    scope: 'Data principal rights',   lastRun: '2026-06-30', nextDue: '2026-07-30' },
]

export const HIGH_RISK_ACTIONS: { action: string; count: number }[] = [
  { action: 'Bulk download',        count: 41 },
  { action: 'External PDF upload',  count: 87 },
  { action: 'Session anomaly',      count: 24 },
  { action: 'Prompt override',      count: 12 },
  { action: 'Classification change', count: 18 },
  { action: 'RBAC elevation',       count: 9 },
]

export const SAVED_QUERIES: { name: string; who: string; description: string }[] = [
  { name: 'External PDF uploads > 10MB (7d)',      who: 'DPO',              description: 'Watch for exfil-shaped inbound.' },
  { name: 'Blocked events by department (30d)',    who: 'Security Officer', description: 'Which teams trip WAF most often.' },
  { name: 'After-hours logins from BYOD',          who: 'Security Officer', description: 'Zero-Trust posture check.' },
  { name: 'Break-glass elevations',                who: 'DPO + IT Admin',   description: 'Every dual-approval elevation, ever.' },
  { name: 'Prompt overrides on Governance workflow', who: 'AI Governance', description: 'Officer bypasses of guardrails.' },
  { name: 'Classification downgrades',             who: 'DPO',              description: 'Sensitive → Internal moves.' },
]

// ---------- Encryption ----------

export const KEY_ROTATIONS: { key: string; scope: string; last: string; next: string; owner: string }[] = [
  { key: 'kek/root/maii',   scope: 'Root KEK · dual custody',      last: '2026-04-01', next: '2026-10-01', owner: 'DIT + Sec Officer' },
  { key: 'kek/dpt/gad',     scope: 'GAD envelope key',             last: '2026-05-12', next: '2026-08-12', owner: 'GAD IT' },
  { key: 'kek/dpt/fin',     scope: 'Finance envelope key',         last: '2026-04-22', next: '2026-07-22', owner: 'Fin IT' },
  { key: 'jwt/gateway',     scope: 'API Gateway JWT signing',      last: '2026-06-11', next: '2026-07-11', owner: 'DIT' },
  { key: 'tls/wildcard',    scope: '*.maii.mah.gov.in',            last: '2026-03-14', next: '2027-03-14', owner: 'DIT' },
  { key: 'dek/dms/vol01',   scope: 'DMS volume DEK',               last: '2026-06-01', next: '2026-09-01', owner: 'DIT' },
]

export const ALGO_INVENTORY: { algo: string; usage: string; share: number; approved: boolean }[] = [
  { algo: 'AES-256-GCM',   usage: 'Data at rest · TDE · DEK sealing', share: 62, approved: true },
  { algo: 'RSA-4096',      usage: 'CA · legacy JWT signing',           share: 12, approved: true },
  { algo: 'ECDSA P-384',   usage: 'API Gateway · mTLS certs',          share: 14, approved: true },
  { algo: 'Curve25519',    usage: 'Inter-service session keys',        share: 8,  approved: true },
  { algo: 'TLS 1.3',       usage: 'All in-transit traffic',            share: 100, approved: true },
]

export const HSM_CLUSTER: {
  id: string
  site: string
  status: 'Active' | 'Standby'
  utilPct: number
  tempC: number
  firmware: string
}[] = [
  { id: 'HSM-A', site: 'SDC Mumbai · Row 3', status: 'Active',  utilPct: 42, tempC: 31, firmware: '7.7.2' },
  { id: 'HSM-B', site: 'SDC Nagpur · Row 1', status: 'Standby', utilPct: 8,  tempC: 28, firmware: '7.7.2' },
]

export const CERT_WATCHLIST: { cn: string; issuer: string; expiresIn: string; risk: 'Low' | 'Medium' | 'High' }[] = [
  { cn: '*.maii.mah.gov.in',    issuer: 'NIC CA',   expiresIn: '248 days', risk: 'Low' },
  { cn: 'gateway.maii.mah.gov.in', issuer: 'NIC CA', expiresIn: '61 days', risk: 'Medium' },
  { cn: 'audit.maii.mah.gov.in', issuer: 'NIC CA',  expiresIn: '14 days', risk: 'High' },
  { cn: 'egress.maii.mah.gov.in', issuer: 'DigiCert', expiresIn: '92 days', risk: 'Low' },
  { cn: 'internal-ca.maii',     issuer: 'MAII Root', expiresIn: '3 y',     risk: 'Low' },
]

// ---------- OnPrem ----------

export const CAPACITY: { name: string; used: number; total: number; unit: string }[] = [
  { name: 'Compute (vCPU)', used: 1428, total: 2400, unit: 'vCPU' },
  { name: 'Memory',         used: 6.4,  total: 9.6,  unit: 'TB' },
  { name: 'Storage (hot)',  used: 184,  total: 320,  unit: 'TB' },
  { name: 'Storage (cold)', used: 812,  total: 1500, unit: 'TB' },
  { name: 'GPU',            used: 24,   total: 32,   unit: 'GPU' },
  { name: 'Egress',         used: 1.8,  total: 10,   unit: 'Gbps' },
]

export const TOPOLOGY: { name: string; role: string; nodes: number; gpus: number; site: string }[] = [
  { name: 'edge-gw',    role: 'Ingress · WAF · mTLS',   nodes: 6,  gpus: 0,  site: 'SDC Mumbai + Nagpur' },
  { name: 'llm-serve',  role: 'Model serving',           nodes: 8,  gpus: 24, site: 'SDC Mumbai' },
  { name: 'rag-index',  role: 'Vector + BM25 index',     nodes: 6,  gpus: 0,  site: 'SDC Mumbai' },
  { name: 'workflow',   role: 'Agents · orchestration',  nodes: 10, gpus: 0,  site: 'SDC Mumbai' },
  { name: 'data-plane', role: 'DMS · Postgres · Kafka',  nodes: 12, gpus: 0,  site: 'SDC Mumbai' },
  { name: 'audit-worm', role: 'Immutable audit ledger',  nodes: 4,  gpus: 0,  site: 'SDC Nagpur (DR)' },
  { name: 'observe',    role: 'Metrics · logs · traces', nodes: 5,  gpus: 0,  site: 'SDC Mumbai' },
]

export const AIRGAP_CHECKLIST: { item: string; ok: boolean }[] = [
  { item: 'Physical separation from public network', ok: true },
  { item: 'Internal-only DNS + PKI', ok: true },
  { item: 'No outbound egress rules (default deny)', ok: true },
  { item: 'Local model registry with signed artefacts', ok: true },
  { item: 'Local telemetry aggregation', ok: true },
  { item: 'Local KMS / HSM cluster', ok: true },
  { item: 'Local secret store', ok: true },
  { item: 'Local artefact repository (mirror)', ok: true },
  { item: 'One-way sync via approved data diode', ok: false },
  { item: 'Certified sneakernet transfer SOP', ok: false },
]

export const DC_INCIDENTS_90D: { date: string; kind: string; impact: string; durationMin: number }[] = [
  { date: '2026-06-24', kind: 'UPS failover',          impact: 'No customer impact',   durationMin: 0 },
  { date: '2026-06-11', kind: 'Cooling PM',            impact: 'Scheduled maintenance', durationMin: 45 },
  { date: '2026-05-30', kind: 'Fibre cut · DR link',   impact: 'DR link degraded 3h',   durationMin: 180 },
  { date: '2026-05-14', kind: 'Kubernetes API blip',   impact: 'Retries · 2m degraded', durationMin: 2 },
  { date: '2026-04-27', kind: 'Storage rebuild',       impact: 'No customer impact',    durationMin: 0 },
]

// ---------- System Health ----------

export const SERVICE_BOARD: { name: string; state: 'Green' | 'Amber' | 'Red'; note: string }[] = [
  { name: 'API Gateway',          state: 'Green', note: 'p95 68ms · 0 errors' },
  { name: 'Auth Service',         state: 'Green', note: 'TOTP + SSO healthy' },
  { name: 'LLM Router',           state: 'Green', note: '4 backends healthy' },
  { name: 'Vector Index',         state: 'Green', note: 'Recall stable' },
  { name: 'DMS',                  state: 'Amber', note: 'HSM slot A slow (retries)' },
  { name: 'Prompt Registry',      state: 'Green', note: '—' },
  { name: 'Audit Ledger',         state: 'Green', note: 'WORM append OK' },
  { name: 'Workflow Engine',      state: 'Green', note: 'Queue depth 14' },
  { name: 'Email Gateway',        state: 'Green', note: 'SPF healthy' },
  { name: 'SMS Gateway',          state: 'Amber', note: '1 DLT template mismatch' },
  { name: 'Search',               state: 'Green', note: 'BM25 + rerank OK' },
  { name: 'SIEM Bridge',          state: 'Red',   note: 'Backlog · 4m behind' },
]

export const SLO_TRACK: { name: string; target: number; observed: number; burnPct: number }[] = [
  { name: 'API availability',    target: 99.9,  observed: 99.987, burnPct: 12 },
  { name: 'API latency p95',     target: 99.0,  observed: 98.4,   burnPct: 62 },
  { name: 'Model latency p95',   target: 99.0,  observed: 98.9,   burnPct: 44 },
  { name: 'Audit write success', target: 99.99, observed: 99.997, burnPct: 8 },
]

export const QUEUE_TREND: { t: string; ingest: number; dlp: number; embed: number; audit: number }[] = [
  { t: '00', ingest: 4,  dlp: 2,  embed: 6,  audit: 1 },
  { t: '04', ingest: 6,  dlp: 3,  embed: 5,  audit: 1 },
  { t: '08', ingest: 22, dlp: 14, embed: 18, audit: 2 },
  { t: '12', ingest: 44, dlp: 28, embed: 36, audit: 3 },
  { t: '16', ingest: 38, dlp: 22, embed: 32, audit: 3 },
  { t: '20', ingest: 18, dlp: 12, embed: 16, audit: 2 },
  { t: '24', ingest: 8,  dlp: 4,  embed: 8,  audit: 1 },
]

export const AUTOSCALE_EVENTS: { ts: string; service: string; action: 'Scale-out' | 'Scale-in'; reason: string }[] = [
  { ts: '2026-07-07 09:24', service: 'llm-serve',  action: 'Scale-out', reason: 'p95 latency > 800ms for 3m' },
  { ts: '2026-07-07 09:02', service: 'workflow',   action: 'Scale-out', reason: 'Queue depth > 40' },
  { ts: '2026-07-07 08:11', service: 'rag-index',  action: 'Scale-in',  reason: 'Idle capacity 42%' },
  { ts: '2026-07-06 22:18', service: 'llm-serve',  action: 'Scale-in',  reason: 'Traffic below floor' },
  { ts: '2026-07-06 14:44', service: 'workflow',   action: 'Scale-out', reason: 'Backlog cleared in 90s' },
  { ts: '2026-07-06 11:02', service: 'edge-gw',    action: 'Scale-out', reason: 'Concurrent conns spike' },
  { ts: '2026-07-05 20:37', service: 'llm-serve',  action: 'Scale-out', reason: 'Tokens/s > threshold' },
  { ts: '2026-07-05 16:14', service: 'data-plane', action: 'Scale-out', reason: 'DMS uploads > 40/s' },
]
