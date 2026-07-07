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

// Administrative Intelligence
import { ExecutiveCockpit } from '@/pages/intelligence/ExecutiveCockpit'
import { IntelligenceIndex } from '@/pages/intelligence/IntelligenceIndex'
import { FileMovement } from '@/pages/intelligence/FileMovement'
import { DecisionIntelligence } from '@/pages/intelligence/DecisionIntelligence'
import { DepartmentPerformance } from '@/pages/intelligence/DepartmentPerformance'
import { OfficerPerformance } from '@/pages/intelligence/OfficerPerformance'
import { WorkflowSLA } from '@/pages/intelligence/WorkflowSLA'
import { CabinetDecisions } from '@/pages/intelligence/CabinetDecisions'
import { MeetingIntelligence } from '@/pages/intelligence/MeetingIntelligence'
import { InspectionIntelligence } from '@/pages/intelligence/InspectionIntelligence'
import { AuditIntelligence } from '@/pages/intelligence/AuditIntelligence'
import { CourtCaseIntelligence } from '@/pages/intelligence/CourtCaseIntelligence'
import { CitizenGrievance } from '@/pages/intelligence/CitizenGrievance'
import { OutcomeIntelligence } from '@/pages/intelligence/OutcomeIntelligence'
import { AIWorkforce } from '@/pages/intelligence/AIWorkforce'
import { OfficerWorkspace } from '@/pages/intelligence/OfficerWorkspace'

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
import { AISecureInfrastructure } from '@/pages/security/AISecureInfrastructure'
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
import { EOfficePage } from '@/pages/integrations/detail/EOfficePage'
import { RTIPage } from '@/pages/integrations/detail/RTIPage'
import { EHRMSPage } from '@/pages/integrations/detail/EHRMSPage'
import { AapleSarkarPage } from '@/pages/integrations/detail/AapleSarkarPage'
import { MahaDBTPage } from '@/pages/integrations/detail/MahaDBTPage'
import { EmailPage } from '@/pages/integrations/detail/EmailPage'
import { SMSPage } from '@/pages/integrations/detail/SMSPage'
import { DMSPage } from '@/pages/integrations/detail/DMSPage'
import { APIGatewayPage } from '@/pages/integrations/detail/APIGatewayPage'

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

        <Route path="/administrative-intelligence/executive-cockpit" element={<ExecutiveCockpit />} />
        <Route path="/administrative-intelligence/index" element={<IntelligenceIndex />} />
        <Route path="/administrative-intelligence/file-movement" element={<FileMovement />} />
        <Route path="/administrative-intelligence/decision-intelligence" element={<DecisionIntelligence />} />
        <Route path="/administrative-intelligence/department-performance" element={<DepartmentPerformance />} />
        <Route path="/administrative-intelligence/officer-performance" element={<OfficerPerformance />} />
        <Route path="/administrative-intelligence/workflow-sla" element={<WorkflowSLA />} />
        <Route path="/administrative-intelligence/cabinet-decisions" element={<CabinetDecisions />} />
        <Route path="/administrative-intelligence/meeting-intelligence" element={<MeetingIntelligence />} />
        <Route path="/administrative-intelligence/inspection-intelligence" element={<InspectionIntelligence />} />
        <Route path="/administrative-intelligence/audit-intelligence" element={<AuditIntelligence />} />
        <Route path="/administrative-intelligence/court-case-intelligence" element={<CourtCaseIntelligence />} />
        <Route path="/administrative-intelligence/citizen-grievance" element={<CitizenGrievance />} />
        <Route path="/administrative-intelligence/outcome-intelligence" element={<OutcomeIntelligence />} />
        <Route path="/administrative-intelligence/ai-workforce" element={<AIWorkforce />} />
        <Route path="/administrative-intelligence/officer-workspace" element={<OfficerWorkspace />} />

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

        <Route path="/security-infrastructure" element={<AISecureInfrastructure />} />
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
        <Route path="/integrations/e-office" element={<EOfficePage />} />
        <Route path="/integrations/rti" element={<RTIPage />} />
        <Route path="/integrations/e-hrms" element={<EHRMSPage />} />
        <Route path="/integrations/aaple-sarkar" element={<AapleSarkarPage />} />
        <Route path="/integrations/mahadbt" element={<MahaDBTPage />} />
        <Route path="/integrations/email" element={<EmailPage />} />
        <Route path="/integrations/sms" element={<SMSPage />} />
        <Route path="/integrations/dms" element={<DMSPage />} />
        <Route path="/integrations/api-gateway" element={<APIGatewayPage />} />
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
