import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Login } from '@/pages/Login'

// Administrative AI
import { AIWorkspace } from '@/pages/admin/AIWorkspace'
import { LetterDrafting } from '@/pages/admin/LetterDrafting'
import { NoteDrafting } from '@/pages/admin/NoteDrafting'
import { GRAnalysis } from '@/pages/admin/GRAnalysis'
import { CircularAnalysis } from '@/pages/admin/CircularAnalysis'
import { FileSummarization } from '@/pages/admin/FileSummarization'
import { Translation } from '@/pages/admin/Translation'
import { OCRIntelligence } from '@/pages/admin/OCRIntelligence'
import { PDFIntelligence } from '@/pages/admin/PDFIntelligence'
import { ImageUnderstanding } from '@/pages/admin/ImageUnderstanding'
import { PPTGeneration } from '@/pages/admin/PPTGeneration'
import { ExcelAnalysis } from '@/pages/admin/ExcelAnalysis'
import { ResearchAssistant } from '@/pages/admin/ResearchAssistant'
import { PromptLibrary } from '@/pages/admin/PromptLibrary'

// Governance
import { AIGovernance } from '@/pages/governance/AIGovernance'
import { ModelRegistry } from '@/pages/governance/ModelRegistry'
import { ModelVersioning } from '@/pages/governance/ModelVersioning'
import { PromptRegistry } from '@/pages/governance/PromptRegistry'
import { PromptApproval } from '@/pages/governance/PromptApproval'
import { AIPolicy } from '@/pages/governance/AIPolicy'
import { RiskRegister } from '@/pages/governance/RiskRegister'
import { BiasDetection } from '@/pages/governance/BiasDetection'
import { HallucinationMonitoring } from '@/pages/governance/HallucinationMonitoring'
import { Explainability } from '@/pages/governance/Explainability'
import { HumanApproval } from '@/pages/governance/HumanApproval'
import { AIIncidents } from '@/pages/governance/AIIncidents'

// Security
import { SecurityOps } from '@/pages/security/SecurityOps'
import { AISOC } from '@/pages/security/AISOC'
import { PromptInjection } from '@/pages/security/PromptInjection'
import { DataLeakage } from '@/pages/security/DataLeakage'
import { ZeroTrust } from '@/pages/security/ZeroTrust'
import { APISecurity } from '@/pages/security/APISecurity'
import { UBA } from '@/pages/security/UBA'
import { ThreatIntel } from '@/pages/security/ThreatIntel'

// DPDP
import { DPDPIntelligence } from '@/pages/dpdp/DPDPIntelligence'
import { ConsentDashboard } from '@/pages/dpdp/ConsentDashboard'
import { SensitiveDataDetection } from '@/pages/dpdp/SensitiveDataDetection'
import { DataClassification } from '@/pages/dpdp/DataClassification'
import { DataLineage } from '@/pages/dpdp/DataLineage'
import { DataRetention } from '@/pages/dpdp/DataRetention'
import { PurposeLimitation } from '@/pages/dpdp/PurposeLimitation'
import { PrivacyRisk } from '@/pages/dpdp/PrivacyRisk'

// Knowledge
import { DepartmentKnowledge } from '@/pages/knowledge/DepartmentKnowledge'
import { GRRepository } from '@/pages/knowledge/GRRepository'
import { CircularRepository } from '@/pages/knowledge/CircularRepository'
import { SOPRepository } from '@/pages/knowledge/SOPRepository'
import { FAQ } from '@/pages/knowledge/FAQ'
import { OfficerSearch } from '@/pages/knowledge/OfficerSearch'

// Integrations
import { IntegrationsDashboard } from '@/pages/integrations/IntegrationsDashboard'
import { IntegrationDetail } from '@/pages/integrations/IntegrationDetail'

// Platform Admin
import { SecureLoginInfo } from '@/pages/platform/SecureLoginInfo'
import { RBAC } from '@/pages/platform/RBAC'
import { AuditLogs } from '@/pages/platform/AuditLogs'
import { Encryption } from '@/pages/platform/Encryption'
import { OnPrem } from '@/pages/platform/OnPrem'
import { SystemHealth } from '@/pages/platform/SystemHealth'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/workspace" element={<AIWorkspace />} />
        <Route path="/letter-drafting" element={<LetterDrafting />} />
        <Route path="/note-drafting" element={<NoteDrafting />} />
        <Route path="/gr-analysis" element={<GRAnalysis />} />
        <Route path="/circular-analysis" element={<CircularAnalysis />} />
        <Route path="/file-summarization" element={<FileSummarization />} />
        <Route path="/translation" element={<Translation />} />
        <Route path="/ocr" element={<OCRIntelligence />} />
        <Route path="/pdf" element={<PDFIntelligence />} />
        <Route path="/image" element={<ImageUnderstanding />} />
        <Route path="/ppt" element={<PPTGeneration />} />
        <Route path="/excel" element={<ExcelAnalysis />} />
        <Route path="/research" element={<ResearchAssistant />} />
        <Route path="/prompt-library" element={<PromptLibrary />} />

        <Route path="/governance" element={<AIGovernance />} />
        <Route path="/model-registry" element={<ModelRegistry />} />
        <Route path="/model-versioning" element={<ModelVersioning />} />
        <Route path="/prompt-registry" element={<PromptRegistry />} />
        <Route path="/prompt-approval" element={<PromptApproval />} />
        <Route path="/ai-policy" element={<AIPolicy />} />
        <Route path="/risk-register" element={<RiskRegister />} />
        <Route path="/bias" element={<BiasDetection />} />
        <Route path="/hallucination" element={<HallucinationMonitoring />} />
        <Route path="/explainability" element={<Explainability />} />
        <Route path="/human-approval" element={<HumanApproval />} />
        <Route path="/ai-incidents" element={<AIIncidents />} />

        <Route path="/security" element={<SecurityOps />} />
        <Route path="/ai-soc" element={<AISOC />} />
        <Route path="/prompt-injection" element={<PromptInjection />} />
        <Route path="/data-leakage" element={<DataLeakage />} />
        <Route path="/zero-trust" element={<ZeroTrust />} />
        <Route path="/api-security" element={<APISecurity />} />
        <Route path="/uba" element={<UBA />} />
        <Route path="/threat-intel" element={<ThreatIntel />} />

        <Route path="/dpdp" element={<DPDPIntelligence />} />
        <Route path="/consent" element={<ConsentDashboard />} />
        <Route path="/sensitive-data" element={<SensitiveDataDetection />} />
        <Route path="/classification" element={<DataClassification />} />
        <Route path="/lineage" element={<DataLineage />} />
        <Route path="/retention" element={<DataRetention />} />
        <Route path="/purpose" element={<PurposeLimitation />} />
        <Route path="/privacy-risk" element={<PrivacyRisk />} />

        <Route path="/knowledge" element={<DepartmentKnowledge />} />
        <Route path="/gr-repo" element={<GRRepository />} />
        <Route path="/circular-repo" element={<CircularRepository />} />
        <Route path="/sop-repo" element={<SOPRepository />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/officer-search" element={<OfficerSearch />} />

        <Route path="/integrations" element={<IntegrationsDashboard />} />
        <Route path="/integrations/:slug" element={<IntegrationDetail />} />

        <Route path="/login-info" element={<SecureLoginInfo />} />
        <Route path="/rbac" element={<RBAC />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/encryption" element={<Encryption />} />
        <Route path="/on-prem" element={<OnPrem />} />
        <Route path="/system-health" element={<SystemHealth />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
