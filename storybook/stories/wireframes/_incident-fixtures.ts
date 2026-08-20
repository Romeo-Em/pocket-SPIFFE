/**
 * _incident-fixtures.ts
 *
 * Shared types, fixture data, tokens, and mock chat messages for the
 * Incident Response wireframe stories. All data models HCP Terraform /
 * cloud-infrastructure domain.
 */

/* ── Grayscale design tokens (self-contained) ──────────────── */

/**
 * Status indicator characters. Grayscale only - differentiated by
 * shape and label, not color.
 */
export const statusGlyph: Record<string, string> = {
  pass: '\u2713',     // checkmark
  fail: '\u2717',     // X
  running: '\u25CF',  // filled circle
  pending: '\u25CB',  // empty circle
  new: '[+]',
  modified: '[~]',
  removed: '[-]',
};

/**
 * Grayscale opacity values for visual hierarchy.
 */
export const grayScale = {
  primary: 'var(--z-text-primary)',
  secondary: 'var(--z-text-secondary)',
  placeholder: 'var(--z-text-placeholder)',
  bg: 'var(--z-bg)',
  layer01: 'var(--z-layer-01)',
  layer02: 'var(--z-layer-02)',
  border: 'var(--z-border-subtle)',
};

/**
 * Standard wireframe token object - uses CSS custom properties so
 * the same stories render in dark or white-bg grayscale automatically.
 */
export const wireframeTok = {
  bg:              'var(--z-bg)',
  layer01:         'var(--z-layer-01)',
  layer02:         'var(--z-layer-02)',
  textPrimary:     'var(--z-text-primary)',
  textSecondary:   'var(--z-text-secondary)',
  textPlaceholder: 'var(--z-text-placeholder)',
  borderSubtle:    'var(--z-border-subtle)',
  navBg:           'var(--z-layer-01)',
  bgHover:         'var(--z-bg-hover)',
};

export const navTabs = ['Dashboard', 'Automation', 'Chat', 'Config', 'Preferences'];

/* ── Incident-specific nav tabs ─────────────────────────────── */

export const incidentNavTabs = ['Workspaces', 'Runbooks', 'Chat', 'Audit', 'Settings'];

/* ── Incident state machine ─────────────────────────────────── */

export type IncidentState =
  | 'detected'
  | 'correlating'
  | 'triaging'
  | 'analyzing'
  | 'remediation_suggested'
  | 'pending_approval'
  | 'approved'
  | 'executing'
  | 'verifying'
  | 'resolved'
  | 'escalated'
  | 'failed';

/* ── Stage 1: Alert Trigger ─────────────────────────────────── */

export interface AlertEvent {
  alertId: string;
  source: 'TFC-RUN-LOG' | 'TFC-AUDIT' | 'TFC-DRIFT' | 'WEBHOOK';
  workspace: string;
  project: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  rawMessage: string;
  correlationKey: string;
}

/* ── Stage 2: Signal Correlation ────────────────────────────── */

export interface CorrelatedSignal {
  signalId: string;
  source: AlertEvent['source'];
  timestamp: string;
  rawMessage: string;
  confidence: number;
  relationship: 'causal' | 'temporal' | 'resource' | 'unknown';
}

export interface CorrelationResult {
  correlationKey: string;
  primaryAlert: AlertEvent;
  correlatedSignals: CorrelatedSignal[];
  signalCount: number;
  correlationScore: number;
  timeWindowMs: number;
  summary: string;
}

/* ── Stage 3: Triage View ───────────────────────────────────── */

export interface TriageItem {
  incidentId: string;
  correlationKey: string;
  title: string;
  severity: AlertEvent['severity'];
  signalCount: number;
  topSignalSources: string[];
  assignedTo?: string;
  status: IncidentState;
  workspace: string;
  projects: string[];
  elapsedSec: number;
  lastUpdate: string;
}

export interface TriageView {
  incidents: TriageItem[];
  activeCount: number;
  criticalCount: number;
  sortOrder: 'severity' | 'recency' | 'signal-count';
}

/* ── Stage 4: Root Cause Analysis ───────────────────────────── */

export interface CauseCandidate {
  candidateId: string;
  description: string;
  component: string;
  evidence: string[];
  confidence: number;
  relatedSignalIds: string[];
}

export interface RootCauseAnalysis {
  incidentId: string;
  correlationKey: string;
  candidates: CauseCandidate[];
  selectedCause?: string;
  analysisMethod: 'correlation' | 'pattern-match' | 'anomaly-detection';
  modelVersion: string;
  processingTimeMs: number;
}

/* ── Stage 5: Remediation Suggestion ────────────────────────── */

export interface RemediationStep {
  stepId: string;
  order: number;
  action: string;
  command: string;
  target: string;
  tool: 'TF-CLI' | 'TFC-API' | 'AWS-CLI' | 'PROVIDER-API';
  rollbackCommand?: string;
  riskLevel: 'low' | 'medium' | 'high';
  estimatedDurationSec: number;
}

export interface RemediationPlan {
  incidentId: string;
  correlationKey: string;
  rootCauseId: string;
  steps: RemediationStep[];
  totalEstimatedSec: number;
  requiresApproval: boolean;
  playbookRef: string;
  rollbackStrategy: 'step-by-step' | 'full-rollback' | 'none';
}

/* ── Stage 6: Approval & Authorization ──────────────────────── */

export interface ApprovalRequest {
  approvalId: string;
  incidentId: string;
  requestedBy: string;
  requestedAt: string;
  approverRole: 'incident-commander' | 'infrastructure-architect';
  remediationPlanId: string;
  highRiskSteps: string[];
  justification: string;
  urgency: 'immediate' | 'scheduled';
  expiresAt: string;
}

export interface ApprovalResponse {
  approvalId: string;
  decision: 'approved' | 'rejected' | 'deferred';
  decidedBy: string;
  decidedAt: string;
  conditions?: string;
  rbacToken: string;
}

/* ── Stage 7: Playbook Execution ────────────────────────────── */

export interface PlaybookStep {
  stepId: string;
  status: 'pending' | 'running' | 'done' | 'failed' | 'skipped' | 'rolled-back';
  command: string;
  target: string;
  startedAt?: string;
  completedAt?: string;
  output?: string;
  returnCode?: number;
  durationMs?: number;
}

export interface PlaybookExecution {
  executionId: string;
  incidentId: string;
  playbookRef: string;
  approvalId: string;
  rbacToken: string;
  steps: PlaybookStep[];
  startedAt: string;
  status: 'running' | 'completed' | 'failed' | 'rolling-back';
  currentStepIndex: number;
}

/* ── Stage 8: Execution Monitoring ──────────────────────────── */

export interface ExecutionEvent {
  executionId: string;
  stepId: string;
  eventType:
    | 'step-start'
    | 'step-complete'
    | 'step-failed'
    | 'rollback-start'
    | 'rollback-complete'
    | 'output-line';
  timestamp: string;
  payload: string;
  returnCode?: number;
}

export interface ExecutionStatus {
  executionId: string;
  incidentId: string;
  steps: PlaybookStep[];
  overallStatus: PlaybookExecution['status'];
  completedCount: number;
  totalCount: number;
  currentStep?: PlaybookStep;
  elapsedMs: number;
  events: ExecutionEvent[];
}

/* ── Stage 9: Verification ──────────────────────────────────── */

export interface VerificationCheck {
  checkId: string;
  label: string;
  target: string;
  command: string;
  expectedResult: string;
  actualResult?: string;
  passed: boolean;
  checkedAt: string;
}

export interface VerificationResult {
  incidentId: string;
  executionId: string;
  checks: VerificationCheck[];
  allPassed: boolean;
  verifiedAt: string;
  verifiedBy: string;
}

/* ── Stage 10: Incident Closure ─────────────────────────────── */

export interface IncidentTimeline {
  stage: string;
  enteredAt: string;
  exitedAt: string;
  durationMs: number;
  actor: string;
}

export interface IncidentClosure {
  incidentId: string;
  correlationKey: string;
  status: 'resolved';
  rootCause: string;
  remediationSummary: string;
  timeline: IncidentTimeline[];
  totalDurationMs: number;
  approvedBy: string;
  closedBy: string;
  closedAt: string;
  auditRef: string;
  postmortemRequired: boolean;
  tags: string[];
}

/* ── Bridging contract ──────────────────────────────────────── */

export interface IncidentBridge {
  incidentId: string;
  correlationKey: string;
  workspace: string;
  project: string;
  operatorId: string;
  approvalToken?: string;
  executionId?: string;
}

/* ── Chat message type ──────────────────────────────────────── */

export interface ChatMessage {
  sender: 'agent' | 'user';
  text: string;
  timestamp: string;
}

/* ── Status glyph helper (domain-neutral) ───────────────────── */

export function statusGlyphFor(status: string): string {
  const map: Record<string, string> = {
    pass: '\u2713',
    done: '\u2713',
    fail: '\u2717',
    failed: '\u2717',
    running: '\u25CF',
    pending: '\u25CB',
    'rolled-back': '\u21A9',
    skipped: '\u2014',
    critical: '\u25B2',
    high: '\u25B2',
    medium: '\u25C6',
    low: '\u25CB',
  };
  return map[status] || '\u25CB';
}

/* ================================================================
 * MOCK DATA
 * ================================================================ */

/* ── Alert ──────────────────────────────────────────────────── */

export const mockAlert: AlertEvent = {
  alertId: 'INC-2026-0847',
  source: 'TFC-RUN-LOG',
  workspace: 'ws-prod-networking',
  project: 'prod-infrastructure',
  severity: 'critical',
  timestamp: '2026-02-20T14:32:07Z',
  rawMessage:
    'Error: Provider produced inconsistent result after apply for aws_security_group.main. Resource was changed outside of Terraform.',
  correlationKey: 'CK-20260220-143207-ws-prod-networking',
};

/* ── Correlated signals ─────────────────────────────────────── */

export const correlatedSignals: CorrelatedSignal[] = [
  {
    signalId: 'SIG-001',
    source: 'TFC-RUN-LOG',
    timestamp: '2026-02-20T14:32:07Z',
    rawMessage:
      'Error: Provider produced inconsistent result after apply',
    confidence: 0.95,
    relationship: 'causal',
  },
  {
    signalId: 'SIG-002',
    source: 'TFC-DRIFT',
    timestamp: '2026-02-20T14:31:45Z',
    rawMessage:
      'Drift detected on aws_security_group.main: ingress rules modified outside Terraform',
    confidence: 0.91,
    relationship: 'causal',
  },
  {
    signalId: 'SIG-003',
    source: 'TFC-AUDIT',
    timestamp: '2026-02-20T14:30:35Z',
    rawMessage:
      'AWS console session by user ops-jpark modified security group sg-0a1b2c3d',
    confidence: 0.88,
    relationship: 'temporal',
  },
];

/* ── Triage items ───────────────────────────────────────────── */

export const triageItems: TriageItem[] = [
  {
    incidentId: 'INC-2026-0847',
    correlationKey: 'CK-20260220-143207-ws-prod-networking',
    title: 'Apply failure on aws_security_group.main',
    severity: 'critical',
    signalCount: 3,
    topSignalSources: ['TFC-RUN-LOG', 'TFC-DRIFT', 'TFC-AUDIT'],
    assignedTo: 'op-mchen',
    status: 'triaging',
    workspace: 'ws-prod-networking',
    projects: ['prod-infrastructure'],
    elapsedSec: 45,
    lastUpdate: '2026-02-20T14:32:52Z',
  },
  {
    incidentId: 'INC-2026-0846',
    correlationKey: 'CK-20260220-121500-ws-staging-compute',
    title: 'Slow plan on aws_instance module',
    severity: 'medium',
    signalCount: 1,
    topSignalSources: ['TFC-RUN-LOG'],
    status: 'detected',
    workspace: 'ws-staging-compute',
    projects: ['staging-compute'],
    elapsedSec: 3932,
    lastUpdate: '2026-02-20T12:15:00Z',
  },
  {
    incidentId: 'INC-2026-0845',
    correlationKey: 'CK-20260219-220000-ws-dev-database',
    title: 'Drift resolved on aws_db_instance.prod',
    severity: 'low',
    signalCount: 2,
    topSignalSources: ['TFC-DRIFT', 'WEBHOOK'],
    status: 'resolved',
    workspace: 'ws-dev-database',
    projects: ['dev-database'],
    elapsedSec: 39720,
    lastUpdate: '2026-02-19T22:00:00Z',
  },
];

/* ── Root cause ranking ─────────────────────────────────────── */

export const rootCauseRanking: CauseCandidate[] = [
  {
    candidateId: 'RC-001',
    description:
      'Manual out-of-band change to aws_security_group.main via AWS console',
    component: 'aws_security_group.main',
    evidence: [
      'Drift detection found modified ingress rules',
      'Audit log shows AWS console session by ops-jpark at 14:30:35',
      'Provider error indicates state/reality divergence',
    ],
    confidence: 0.92,
    relatedSignalIds: ['SIG-001', 'SIG-002', 'SIG-003'],
  },
  {
    candidateId: 'RC-002',
    description:
      'AWS provider version incompatibility with security group resource schema',
    component: 'hashicorp/aws',
    evidence: [
      'No schema change detected in provider changelog for current version',
    ],
    confidence: 0.06,
    relatedSignalIds: ['SIG-001'],
  },
  {
    candidateId: 'RC-003',
    description:
      'State file corruption during concurrent remote operations',
    component: 'terraform-state',
    evidence: [
      'No concurrent runs found in workspace run queue during incident window',
    ],
    confidence: 0.02,
    relatedSignalIds: [],
  },
];

/* ── Remediation plan ───────────────────────────────────────── */

export const remediationPlan: RemediationPlan = {
  incidentId: 'INC-2026-0847',
  correlationKey: 'CK-20260220-143207-ws-prod-networking',
  rootCauseId: 'RC-001',
  steps: [
    {
      stepId: 'REM-001-01',
      order: 1,
      action: 'Refresh state to match current infrastructure',
      command:
        'terraform apply -refresh-only -auto-approve -target=aws_security_group.main',
      target: 'ws-prod-networking',
      tool: 'TF-CLI',
      riskLevel: 'low',
      estimatedDurationSec: 15,
    },
    {
      stepId: 'REM-001-02',
      order: 2,
      action: 'Generate corrected plan',
      command:
        'terraform plan -target=aws_security_group.main -out=remediation.tfplan',
      target: 'ws-prod-networking',
      tool: 'TF-CLI',
      riskLevel: 'low',
      estimatedDurationSec: 10,
    },
    {
      stepId: 'REM-001-03',
      order: 3,
      action: 'Apply corrected plan to production networking',
      command: 'terraform apply remediation.tfplan',
      target: 'ws-prod-networking',
      tool: 'TF-CLI',
      rollbackCommand: 'terraform state push terraform.tfstate.backup',
      riskLevel: 'high',
      estimatedDurationSec: 20,
    },
  ],
  totalEstimatedSec: 45,
  requiresApproval: true,
  playbookRef: 'playbooks/terraform-drift-remediation.yaml',
  rollbackStrategy: 'step-by-step',
};

/* ── Approval request ───────────────────────────────────────── */

export const approvalRequest: ApprovalRequest = {
  approvalId: 'APR-2026-0847-001',
  incidentId: 'INC-2026-0847',
  requestedBy: 'op-mchen',
  requestedAt: '2026-02-20T14:33:45Z',
  approverRole: 'incident-commander',
  remediationPlanId: 'REM-001',
  highRiskSteps: ['REM-001-03'],
  justification:
    'Out-of-band change to production security group blocking networking deploys for 12 workspaces',
  urgency: 'immediate',
  expiresAt: '2026-02-20T14:48:45Z',
};

/* ── Execution steps ────────────────────────────────────────── */

export const executionSteps: PlaybookStep[] = [
  {
    stepId: 'REM-001-01',
    status: 'done',
    command:
      'terraform apply -refresh-only -auto-approve -target=aws_security_group.main',
    target: 'ws-prod-networking',
    startedAt: '2026-02-20T14:35:00Z',
    completedAt: '2026-02-20T14:35:14Z',
    output:
      'Apply complete! Resources: 0 added, 0 destroyed, 1 changed.',
    returnCode: 0,
    durationMs: 14000,
  },
  {
    stepId: 'REM-001-02',
    status: 'done',
    command:
      'terraform plan -target=aws_security_group.main -out=remediation.tfplan',
    target: 'ws-prod-networking',
    startedAt: '2026-02-20T14:35:15Z',
    completedAt: '2026-02-20T14:35:24Z',
    output:
      'Plan: 1 to change. (1 security group rule to revert to intended config)',
    returnCode: 0,
    durationMs: 9000,
  },
  {
    stepId: 'REM-001-03',
    status: 'done',
    command: 'terraform apply remediation.tfplan',
    target: 'ws-prod-networking',
    startedAt: '2026-02-20T14:35:25Z',
    completedAt: '2026-02-20T14:35:42Z',
    output:
      'Apply complete! Resources: 0 added, 0 destroyed, 1 changed.',
    returnCode: 0,
    durationMs: 17000,
  },
];

/* ── Execution events ───────────────────────────────────────── */

export const executionEvents: ExecutionEvent[] = [
  {
    executionId: 'EXEC-2026-0847-001',
    stepId: 'REM-001-01',
    eventType: 'step-start',
    timestamp: '2026-02-20T14:35:00Z',
    payload: 'Starting: terraform apply -refresh-only -auto-approve -target=aws_security_group.main',
  },
  {
    executionId: 'EXEC-2026-0847-001',
    stepId: 'REM-001-01',
    eventType: 'output-line',
    timestamp: '2026-02-20T14:35:08Z',
    payload: 'aws_security_group.main: Refreshing state... [id=sg-0a1b2c3d]',
  },
  {
    executionId: 'EXEC-2026-0847-001',
    stepId: 'REM-001-01',
    eventType: 'step-complete',
    timestamp: '2026-02-20T14:35:14Z',
    payload: 'Apply complete! Resources: 0 added, 0 destroyed, 1 changed.',
    returnCode: 0,
  },
  {
    executionId: 'EXEC-2026-0847-001',
    stepId: 'REM-001-02',
    eventType: 'step-start',
    timestamp: '2026-02-20T14:35:15Z',
    payload: 'Starting: terraform plan -target=aws_security_group.main -out=remediation.tfplan',
  },
  {
    executionId: 'EXEC-2026-0847-001',
    stepId: 'REM-001-02',
    eventType: 'output-line',
    timestamp: '2026-02-20T14:35:20Z',
    payload: 'aws_security_group.main: Drift detected (ingress rules modified)',
  },
  {
    executionId: 'EXEC-2026-0847-001',
    stepId: 'REM-001-02',
    eventType: 'step-complete',
    timestamp: '2026-02-20T14:35:24Z',
    payload: 'Plan: 1 to change. (1 security group rule to revert to intended config)',
    returnCode: 0,
  },
  {
    executionId: 'EXEC-2026-0847-001',
    stepId: 'REM-001-03',
    eventType: 'step-start',
    timestamp: '2026-02-20T14:35:25Z',
    payload: 'Starting: terraform apply remediation.tfplan',
  },
  {
    executionId: 'EXEC-2026-0847-001',
    stepId: 'REM-001-03',
    eventType: 'output-line',
    timestamp: '2026-02-20T14:35:35Z',
    payload: 'aws_security_group.main: Modifying... [id=sg-0a1b2c3d]',
  },
  {
    executionId: 'EXEC-2026-0847-001',
    stepId: 'REM-001-03',
    eventType: 'step-complete',
    timestamp: '2026-02-20T14:35:42Z',
    payload: 'Apply complete! Resources: 0 added, 0 destroyed, 1 changed.',
    returnCode: 0,
  },
];

/* ── Verification checks ────────────────────────────────────── */

export const verificationChecks: VerificationCheck[] = [
  {
    checkId: 'VER-001',
    label: 'Terraform plan shows no changes',
    target: 'ws-prod-networking',
    command: 'terraform plan -detailed-exitcode',
    expectedResult: 'Exit code 0 (no changes)',
    actualResult: 'Exit code 0 (no changes)',
    passed: true,
    checkedAt: '2026-02-20T14:36:00Z',
  },
  {
    checkId: 'VER-002',
    label: 'Workspace run status is Applied',
    target: 'ws-prod-networking',
    command: 'GET /api/v2/workspaces/ws-prod-networking',
    expectedResult: 'current-run.status: applied',
    actualResult: 'current-run.status: applied',
    passed: true,
    checkedAt: '2026-02-20T14:36:05Z',
  },
  {
    checkId: 'VER-003',
    label: 'No drift detected in 120s window',
    target: 'ws-prod-networking',
    command: 'GET /api/v2/workspaces/ws-prod-networking/health',
    expectedResult: 'drift-status: no-drift',
    actualResult: 'drift-status: no-drift',
    passed: true,
    checkedAt: '2026-02-20T14:38:05Z',
  },
  {
    checkId: 'VER-004',
    label: 'Security group rules match intended config',
    target: 'aws-ec2',
    command: 'aws ec2 describe-security-groups --group-ids sg-0a1b2c3d',
    expectedResult: 'Ingress rules match Terraform config',
    actualResult: 'Ingress rules match Terraform config (3 rules, all declared)',
    passed: true,
    checkedAt: '2026-02-20T14:38:10Z',
  },
];

/* ── Incident summary / closure ─────────────────────────────── */

export const incidentSummary: IncidentClosure = {
  incidentId: 'INC-2026-0847',
  correlationKey: 'CK-20260220-143207-ws-prod-networking',
  status: 'resolved',
  rootCause:
    'Manual out-of-band change to aws_security_group.main via AWS console',
  remediationSummary:
    'State refresh + corrected plan + apply',
  timeline: [
    {
      stage: 'Alert Trigger',
      enteredAt: '2026-02-20T14:32:07Z',
      exitedAt: '2026-02-20T14:32:08Z',
      durationMs: 1000,
      actor: 'system',
    },
    {
      stage: 'Signal Correlation',
      enteredAt: '2026-02-20T14:32:08Z',
      exitedAt: '2026-02-20T14:32:16Z',
      durationMs: 8000,
      actor: 'agent',
    },
    {
      stage: 'Triage View',
      enteredAt: '2026-02-20T14:32:16Z',
      exitedAt: '2026-02-20T14:32:52Z',
      durationMs: 36000,
      actor: 'op-mchen',
    },
    {
      stage: 'Root Cause Analysis',
      enteredAt: '2026-02-20T14:32:52Z',
      exitedAt: '2026-02-20T14:33:04Z',
      durationMs: 12000,
      actor: 'agent',
    },
    {
      stage: 'Remediation Suggestion',
      enteredAt: '2026-02-20T14:33:04Z',
      exitedAt: '2026-02-20T14:33:09Z',
      durationMs: 5000,
      actor: 'agent',
    },
    {
      stage: 'Approval & Auth',
      enteredAt: '2026-02-20T14:33:09Z',
      exitedAt: '2026-02-20T14:34:27Z',
      durationMs: 78000,
      actor: 'ic-jpark',
    },
    {
      stage: 'Playbook Execution',
      enteredAt: '2026-02-20T14:35:00Z',
      exitedAt: '2026-02-20T14:35:42Z',
      durationMs: 42000,
      actor: 'playbook-engine',
    },
    {
      stage: 'Verification',
      enteredAt: '2026-02-20T14:35:42Z',
      exitedAt: '2026-02-20T14:38:10Z',
      durationMs: 148000,
      actor: 'agent',
    },
    {
      stage: 'Incident Closure',
      enteredAt: '2026-02-20T14:38:10Z',
      exitedAt: '2026-02-20T14:38:17Z',
      durationMs: 7000,
      actor: 'op-mchen',
    },
  ],
  totalDurationMs: 370000,
  approvedBy: 'ic-jpark',
  closedBy: 'op-mchen',
  closedAt: '2026-02-20T14:38:17Z',
  auditRef: 'datadog://logs?query=incident:INC-2026-0847',
  postmortemRequired: false,
  tags: ['terraform', 'drift', 'aws', 'security-group', 'networking'],
};

/* ================================================================
 * CHAT MESSAGES
 * ================================================================ */

/* ── Alert stage ────────────────────────────────────────────── */

export const alertChat: ChatMessage[] = [
  {
    sender: 'agent',
    text: 'Incoming alert: Terraform run failed on ws-prod-networking. Provider produced inconsistent result for aws_security_group.main. Severity: critical.',
    timestamp: '14:32:07',
  },
  {
    sender: 'agent',
    text: 'Scanning correlated signals across TFC run logs, drift detection, and audit events...',
    timestamp: '14:32:08',
  },
  {
    sender: 'agent',
    text: 'Found 3 correlated signals (score: 0.93). Drift detected on aws_security_group.main - ingress rules modified via AWS console by ops-jpark at 14:30:35.',
    timestamp: '14:32:16',
  },
];

/* ── Triage stage ───────────────────────────────────────────── */

export const triageChat: ChatMessage[] = [
  {
    sender: 'agent',
    text: 'INC-2026-0847 assigned to you. 3 signals correlated. Primary: Terraform apply failure on security group. Secondary: drift detection and audit trail match to AWS console change.',
    timestamp: '14:32:17',
  },
  {
    sender: 'user',
    text: 'Show me the root cause analysis.',
    timestamp: '14:32:52',
  },
];

/* ── Analysis stage ─────────────────────────────────────────── */

export const analysisChat: ChatMessage[] = [
  {
    sender: 'agent',
    text: 'Root cause analysis complete. Top candidate (92% confidence): Manual out-of-band change to aws_security_group.main via AWS console.',
    timestamp: '14:33:04',
  },
  {
    sender: 'agent',
    text: 'Evidence: Drift detection found modified ingress rules. Audit log shows AWS console session by ops-jpark at 14:30:35. Provider error confirms state/reality divergence on sg-0a1b2c3d.',
    timestamp: '14:33:04',
  },
  {
    sender: 'user',
    text: 'That matches what I see in the workspace run history. What do you recommend?',
    timestamp: '14:33:07',
  },
  {
    sender: 'agent',
    text: 'Proposed 3-step remediation: (1) refresh state to match current infrastructure, (2) generate corrected plan, (3) apply corrected plan to production networking. Step 3 is high-risk and requires team lead approval.',
    timestamp: '14:33:09',
  },
];

/* ── Approval stage ─────────────────────────────────────────── */

export const approvalChat: ChatMessage[] = [
  {
    sender: 'agent',
    text: 'Approval request APR-2026-0847-001 sent to team lead (ic-jpark). Step REM-001-03 (apply corrected plan to production networking) requires authorization.',
    timestamp: '14:33:10',
  },
  {
    sender: 'user',
    text: 'How long do we have?',
    timestamp: '14:33:15',
  },
  {
    sender: 'agent',
    text: 'Approval window expires in 15 minutes (14:48:45). If no response, the incident escalates to infrastructure architect.',
    timestamp: '14:33:16',
  },
  {
    sender: 'agent',
    text: 'Approved by ic-jpark. Condition: verify no drift recurrence for 120 seconds after apply.',
    timestamp: '14:34:27',
  },
];

/* ── Execute stage ──────────────────────────────────────────── */

export const executeChat: ChatMessage[] = [
  {
    sender: 'agent',
    text: 'Executing playbook terraform-drift-remediation.yaml. Step 1/3: terraform apply -refresh-only...',
    timestamp: '14:35:00',
  },
  {
    sender: 'agent',
    text: 'Step 1 complete. State refreshed - 1 resource updated in state. Step 2/3: terraform plan...',
    timestamp: '14:35:14',
  },
  {
    sender: 'agent',
    text: 'Step 2 complete. Plan generated: 1 security group rule to revert. Step 3/3: terraform apply...',
    timestamp: '14:35:24',
  },
  {
    sender: 'user',
    text: 'Watching the apply output now.',
    timestamp: '14:35:30',
  },
  {
    sender: 'agent',
    text: 'Step 3 complete. Apply successful - 1 resource changed. Security group sg-0a1b2c3d reverted to intended config.',
    timestamp: '14:35:42',
  },
  {
    sender: 'agent',
    text: 'All 3 steps complete. Playbook execution finished in 42s. Starting verification checks.',
    timestamp: '14:35:42',
  },
];

/* ── Verify stage ───────────────────────────────────────────── */

export const verifyChat: ChatMessage[] = [
  {
    sender: 'agent',
    text: 'Running 4 verification checks...',
    timestamp: '14:35:43',
  },
  {
    sender: 'agent',
    text: 'All 4 checks passed. Terraform plan clean, workspace status Applied, no drift in 120s window, security group rules match intended config.',
    timestamp: '14:38:10',
  },
  {
    sender: 'user',
    text: 'Close the incident.',
    timestamp: '14:38:12',
  },
  {
    sender: 'agent',
    text: 'Incident INC-2026-0847 closed. Total duration: 6m 10s. Audit record written to Datadog. No postmortem required.',
    timestamp: '14:38:17',
  },
];
