/**
 * IncidentApproval.stories.tsx
 *
 * Journey Stage 6: Approval & Authorization
 * HCP Terraform Remediation Agent - Incident Response Dashboard
 *
 * 3-column layout: Approval Details (30%) | Plan Review (40%) | Chat (30%)
 *
 * Stories:
 *   PendingApproval     - timer "14:05", step 3 highlighted, pending status
 *   ApprovalGranted     - checkmark, approved by ic-jpark, conditions block, [Execute] button
 *   ApprovalRejected    - X glyph, rejection reason, [Revise Plan] button
 *   ApprovalEscalated   - expired timer, escalation to infrastructure architect
 */

import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  wireframeTok,
  statusGlyphFor,
  incidentNavTabs,
  statusGlyph,
  approvalRequest,
  remediationPlan,
  approvalChat,
  mockAlert,
} from './_incident-fixtures';
import type {
  ApprovalRequest,
  RemediationStep,
  ChatMessage,
} from './_incident-fixtures';

/* ================================================================
 * TOKENS & LAYOUT CONSTANTS
 * ================================================================ */

const tok = wireframeTok;

const SHELL: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  background: tok.bg,
  fontFamily: 'system-ui, sans-serif',
  color: tok.textPrimary,
  fontSize: 13,
};

const NAV: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 24,
  padding: '0 16px',
  height: 48,
  borderBottom: `1px solid ${tok.borderSubtle}`,
  background: tok.navBg,
  flexShrink: 0,
};

const MAIN: CSSProperties = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '30% 40% 30%',
  overflow: 'hidden',
};

const FOOTER: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '6px 16px',
  borderTop: `1px solid ${tok.borderSubtle}`,
  background: tok.navBg,
  fontSize: 12,
  color: tok.textPlaceholder,
  flexShrink: 0,
};

/* ── Panel base styles ──────────────────────────────────────── */

const PANEL: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRight: `1px solid ${tok.borderSubtle}`,
};

const PANEL_HEADER: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  borderBottom: `1px solid ${tok.borderSubtle}`,
  background: tok.layer01,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.02em',
  flexShrink: 0,
};

const PANEL_BODY: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: 0,
};

/* ── Shared small styles ────────────────────────────────────── */

const BADGE: CSSProperties = {
  display: 'inline-block',
  padding: '1px 6px',
  borderRadius: 3,
  fontSize: 11,
  fontWeight: 600,
  background: tok.layer02,
  color: tok.textSecondary,
};

const MONO: CSSProperties = {
  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
  fontSize: 12,
};

const LABEL: CSSProperties = {
  fontSize: 11,
  color: tok.textPlaceholder,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  marginBottom: 2,
};

/* ── Button styles ──────────────────────────────────────────── */

const BTN_PRIMARY: CSSProperties = {
  padding: '8px 20px',
  background: tok.textPrimary,
  color: tok.bg,
  border: 'none',
  borderRadius: 4,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'default',
  letterSpacing: '0.01em',
};

const BTN_SECONDARY: CSSProperties = {
  padding: '8px 20px',
  background: 'transparent',
  color: tok.textPrimary,
  border: `1px solid ${tok.borderSubtle}`,
  borderRadius: 4,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'default',
  letterSpacing: '0.01em',
};

/* ================================================================
 * TYPES
 * ================================================================ */

type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated';

interface ApprovalDecisionDetail {
  status: ApprovalStatus;
  decidedBy?: string;
  decidedAt?: string;
  reason?: string;
  conditions?: string;
}

/* ================================================================
 * HELPER FUNCTIONS
 * ================================================================ */

function approvalGlyph(status: ApprovalStatus): string {
  switch (status) {
    case 'pending':   return '\u25CB'; // empty circle
    case 'approved':  return '\u2713'; // checkmark
    case 'rejected':  return '\u2717'; // X
    case 'escalated': return '\u25B2'; // triangle up
  }
}

function approvalLabel(status: ApprovalStatus): string {
  switch (status) {
    case 'pending':   return 'Pending Approval';
    case 'approved':  return 'Approved';
    case 'rejected':  return 'Rejected';
    case 'escalated': return 'Escalated';
  }
}

function riskGlyph(level: RemediationStep['riskLevel']): string {
  switch (level) {
    case 'low':    return '\u25CB'; // empty circle
    case 'medium': return '\u25C6'; // diamond
    case 'high':   return '\u25B2'; // triangle
  }
}

function formatDecisionTime(ts: string): string {
  return ts.split('T')[1]?.replace('Z', '') || ts;
}

function riskLabel(level: RemediationStep['riskLevel']): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

/* ================================================================
 * INLINE COMPONENTS
 * ================================================================ */

/* ── NavBar ─────────────────────────────────────────────────── */

interface NavBarProps {
  activeTab: string;
  incidentId?: string;
}

function NavBar({ activeTab, incidentId }: NavBarProps) {
  return (
    <div style={NAV}>
      <span style={{ fontWeight: 700, fontSize: 14 }}>
        Incident Response
      </span>
      <div style={{ display: 'flex', gap: 2 }}>
        {incidentNavTabs.map((tab) => (
          <button
            key={tab}
            style={{
              padding: '6px 12px',
              background: tab === activeTab ? tok.layer02 : 'transparent',
              border: 'none',
              borderRadius: 4,
              color: tab === activeTab ? tok.textPrimary : tok.textSecondary,
              fontSize: 13,
              fontWeight: tab === activeTab ? 600 : 400,
              cursor: 'default',
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      {incidentId && (
        <span style={{
          ...BADGE,
          background: tok.layer02,
          border: `1px solid ${tok.borderSubtle}`,
        }}>
          {incidentId}
        </span>
      )}
    </div>
  );
}

/* ── ApprovalStatusBadge ────────────────────────────────────── */

interface ApprovalStatusBadgeProps {
  status: ApprovalStatus;
  large?: boolean;
}

function ApprovalStatusBadge({ status, large }: ApprovalStatusBadgeProps) {
  const isLarge = large ?? false;
  const bgMap: Record<ApprovalStatus, string> = {
    pending:   tok.layer02,
    approved:  tok.layer02,
    rejected:  tok.layer02,
    escalated: tok.layer02,
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: isLarge ? 8 : 5,
      padding: isLarge ? '4px 12px' : '2px 8px',
      borderRadius: 4,
      fontSize: isLarge ? 13 : 11,
      fontWeight: 600,
      background: bgMap[status],
      color: tok.textPrimary,
      border: `1px solid ${tok.borderSubtle}`,
      letterSpacing: '0.01em',
    }}>
      <span style={{ fontSize: isLarge ? 15 : 12 }}>
        {approvalGlyph(status)}
      </span>
      {approvalLabel(status)}
    </span>
  );
}

/* ── ApprovalDetailCard ─────────────────────────────────────── */

interface ApprovalDetailCardProps {
  request: ApprovalRequest;
  decision: ApprovalDecisionDetail;
  timerDisplay: string;
}

function ApprovalDetailCard({ request, decision, timerDisplay }: ApprovalDetailCardProps) {
  return (
    <div style={{
      ...PANEL,
      borderRight: `1px solid ${tok.borderSubtle}`,
    }}>
      <div style={PANEL_HEADER}>
        <span>Approval Details</span>
        <ApprovalStatusBadge status={decision.status} />
      </div>
      <div style={{ ...PANEL_BODY, padding: 16 }}>
        {/* Approval ID */}
        <div style={{ marginBottom: 16 }}>
          <div style={LABEL}>Approval ID</div>
          <div style={{ ...MONO, fontSize: 13, fontWeight: 600 }}>
            {request.approvalId}
          </div>
        </div>

        {/* Metadata grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '14px 20px',
          marginBottom: 20,
        }}>
          <div>
            <div style={LABEL}>Requested By</div>
            <div style={{ ...MONO, fontSize: 13 }}>{request.requestedBy}</div>
          </div>
          <div>
            <div style={LABEL}>Approver Role</div>
            <div style={{ fontSize: 13 }}>{request.approverRole}</div>
          </div>
          <div>
            <div style={LABEL}>Urgency</div>
            <div style={{
              fontSize: 13,
              fontWeight: request.urgency === 'immediate' ? 600 : 400,
            }}>
              {request.urgency === 'immediate' ? '\u25B2 ' : ''}{request.urgency}
            </div>
          </div>
          <div>
            <div style={LABEL}>Incident</div>
            <div style={{ ...MONO, fontSize: 13 }}>{request.incidentId}</div>
          </div>
          <div>
            <div style={LABEL}>Requested At</div>
            <div style={{ ...MONO, fontSize: 12, color: tok.textSecondary }}>
              {request.requestedAt}
            </div>
          </div>
          <div>
            <div style={LABEL}>Plan Ref</div>
            <div style={{ ...MONO, fontSize: 12, color: tok.textSecondary }}>
              {request.remediationPlanId}
            </div>
          </div>
        </div>

        {/* Timer block */}
        <div style={{
          padding: '12px 14px',
          background: tok.layer01,
          borderRadius: 4,
          border: `1px solid ${tok.borderSubtle}`,
          marginBottom: 16,
          textAlign: 'center',
        }}>
          <div style={{
            ...LABEL,
            marginBottom: 6,
            textAlign: 'center',
          }}>
            {decision.status === 'escalated' ? 'Status' : 'Expires in'}
          </div>
          <div style={{
            ...MONO,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: decision.status === 'escalated' ? tok.textSecondary : tok.textPrimary,
          }}>
            {timerDisplay}
          </div>
        </div>

        {/* Justification */}
        <div style={{ marginBottom: 16 }}>
          <div style={LABEL}>Justification</div>
          <div style={{
            padding: '10px 12px',
            background: tok.layer01,
            borderRadius: 4,
            border: `1px solid ${tok.borderSubtle}`,
            fontSize: 12,
            lineHeight: 1.5,
            color: tok.textSecondary,
          }}>
            {request.justification}
          </div>
        </div>

        {/* High-risk steps callout */}
        {request.highRiskSteps.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={LABEL}>High-Risk Steps</div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              {request.highRiskSteps.map((stepId) => (
                <div key={stepId} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 10px',
                  background: tok.layer01,
                  borderRadius: 3,
                  border: `1px solid ${tok.borderSubtle}`,
                }}>
                  <span style={{ fontSize: 12 }}>{riskGlyph('high')}</span>
                  <span style={{ ...MONO, fontSize: 12 }}>{stepId}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decision detail - shown only for non-pending */}
        {decision.status !== 'pending' && (
          <div style={{
            padding: '12px 14px',
            background: tok.layer01,
            borderRadius: 4,
            border: `1px solid ${tok.borderSubtle}`,
            marginBottom: 16,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
            }}>
              <span style={{ fontSize: 16 }}>{approvalGlyph(decision.status)}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                {decision.status === 'approved' && `Approved by: ${decision.decidedBy}`}
                {decision.status === 'rejected' && `Rejected by: ${decision.decidedBy}`}
                {decision.status === 'escalated' && 'Escalated - approval window expired'}
              </span>
            </div>
            {decision.decidedAt && (
              <div style={{
                ...MONO,
                fontSize: 11,
                color: tok.textPlaceholder,
                marginBottom: decision.reason ? 8 : 0,
              }}>
                {formatDecisionTime(decision.decidedAt)}
              </div>
            )}
            {decision.reason && (
              <div style={{
                fontSize: 12,
                lineHeight: 1.5,
                color: tok.textSecondary,
              }}>
                {decision.reason}
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginTop: 'auto',
          paddingTop: 8,
        }}>
          {decision.status === 'pending' && (
            <>
              <button style={BTN_PRIMARY}>Approve</button>
              <button style={BTN_SECONDARY}>Reject</button>
            </>
          )}
          {decision.status === 'approved' && (
            <button style={BTN_PRIMARY}>Execute</button>
          )}
          {decision.status === 'rejected' && (
            <button style={BTN_SECONDARY}>Revise Plan</button>
          )}
          {decision.status === 'escalated' && (
            <button style={BTN_SECONDARY}>View Escalation</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── PlanReviewPanel ────────────────────────────────────────── */

interface PlanReviewPanelProps {
  steps: RemediationStep[];
  highlightStepId?: string;
  summary: string;
  conditions?: string;
}

function PlanReviewPanel({ steps, highlightStepId, summary, conditions }: PlanReviewPanelProps) {
  return (
    <div style={PANEL}>
      <div style={PANEL_HEADER}>
        <span>Plan Review</span>
        <span style={{ ...BADGE, fontSize: 10 }}>
          {steps.length} steps
        </span>
      </div>
      <div style={{ ...PANEL_BODY, padding: 16 }}>
        {/* Summary block */}
        <div style={{
          padding: '12px 14px',
          background: tok.layer01,
          borderRadius: 4,
          border: `1px solid ${tok.borderSubtle}`,
          marginBottom: 16,
        }}>
          <div style={{ ...LABEL, marginBottom: 6 }}>Summary</div>
          <div style={{
            fontSize: 12,
            lineHeight: 1.5,
            color: tok.textSecondary,
          }}>
            {summary}
          </div>
        </div>

        {/* Plan metadata row */}
        <div style={{
          display: 'flex',
          gap: 16,
          marginBottom: 16,
          fontSize: 12,
        }}>
          <div>
            <span style={{ color: tok.textPlaceholder }}>Playbook: </span>
            <span style={{ ...MONO, fontSize: 11, color: tok.textSecondary }}>
              {remediationPlan.playbookRef}
            </span>
          </div>
          <div>
            <span style={{ color: tok.textPlaceholder }}>Rollback: </span>
            <span style={{ color: tok.textSecondary }}>
              {remediationPlan.rollbackStrategy}
            </span>
          </div>
          <div>
            <span style={{ color: tok.textPlaceholder }}>Est: </span>
            <span style={{ ...MONO, color: tok.textSecondary }}>
              {formatDuration(remediationPlan.totalEstimatedSec)}
            </span>
          </div>
        </div>

        {/* Steps list */}
        <div style={{ ...LABEL, marginBottom: 8 }}>Remediation Steps</div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          border: `1px solid ${tok.borderSubtle}`,
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          {steps.map((step) => {
            const isHighlighted = step.stepId === highlightStepId;
            return (
              <div
                key={step.stepId}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  padding: '12px 14px',
                  background: isHighlighted ? tok.layer01 : 'transparent',
                  borderBottom: `1px solid ${tok.borderSubtle}`,
                  borderLeft: isHighlighted
                    ? `3px solid ${tok.textPrimary}`
                    : '3px solid transparent',
                }}
              >
                {/* Step header row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{
                    ...MONO,
                    fontSize: 11,
                    fontWeight: 600,
                    color: tok.textPlaceholder,
                    width: 20,
                  }}>
                    {step.order}.
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {step.action}
                  </span>
                  <span style={{ flex: 1 }} />
                  {/* Risk badge */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '1px 8px',
                    borderRadius: 3,
                    fontSize: 10,
                    fontWeight: 600,
                    background: step.riskLevel === 'high' ? tok.layer02 : tok.layer02,
                    border: `1px solid ${tok.borderSubtle}`,
                    color: tok.textSecondary,
                  }}>
                    <span>{riskGlyph(step.riskLevel)}</span>
                    {riskLabel(step.riskLevel)}
                  </span>
                </div>

                {/* Command */}
                <div style={{
                  ...MONO,
                  fontSize: 11,
                  padding: '6px 10px',
                  background: tok.bg,
                  borderRadius: 3,
                  color: tok.textSecondary,
                  marginLeft: 28,
                  whiteSpace: 'pre-wrap' as const,
                  wordBreak: 'break-all' as const,
                }}>
                  $ {step.command}
                </div>

                {/* Meta row: tool, target, duration */}
                <div style={{
                  display: 'flex',
                  gap: 12,
                  marginLeft: 28,
                  fontSize: 11,
                  color: tok.textPlaceholder,
                }}>
                  <span>Tool: <span style={{ color: tok.textSecondary }}>{step.tool}</span></span>
                  <span>Target: <span style={{ ...MONO, color: tok.textSecondary }}>{step.target}</span></span>
                  <span>Est: <span style={{ color: tok.textSecondary }}>{step.estimatedDurationSec}s</span></span>
                </div>

                {/* Rollback command if present */}
                {step.rollbackCommand && (
                  <div style={{
                    marginLeft: 28,
                    marginTop: 2,
                    fontSize: 11,
                    color: tok.textPlaceholder,
                  }}>
                    Rollback: <span style={{ ...MONO, color: tok.textSecondary }}>{step.rollbackCommand}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Conditions block (post-approval) */}
        {conditions && (
          <ConditionsBlock conditions={conditions} />
        )}
      </div>
    </div>
  );
}

/* ── ConditionsBlock ─────────────────────────────────────────── */

interface ConditionsBlockProps {
  conditions: string;
}

function ConditionsBlock({ conditions }: ConditionsBlockProps) {
  return (
    <div style={{
      padding: '12px 14px',
      background: tok.layer01,
      borderRadius: 4,
      border: `1px solid ${tok.borderSubtle}`,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>
          {statusGlyph.pass} Approval Conditions
        </span>
      </div>
      <div style={{
        fontSize: 12,
        lineHeight: 1.5,
        color: tok.textSecondary,
        padding: '8px 10px',
        background: tok.bg,
        borderRadius: 3,
      }}>
        {conditions}
      </div>
    </div>
  );
}

/* ── ChatPanel ──────────────────────────────────────────────── */

interface ChatPanelProps {
  messages: ChatMessage[];
}

function ChatPanel({ messages }: ChatPanelProps) {
  return (
    <div style={{
      ...PANEL,
      borderRight: 'none',
    }}>
      <div style={PANEL_HEADER}>
        <span>Agent Chat</span>
        <span style={{ ...BADGE, fontSize: 10 }}>
          {messages.length} msg{messages.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div style={{
        ...PANEL_BODY,
        padding: '8px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              padding: '8px 12px',
              background: msg.sender === 'user' ? tok.layer01 : 'transparent',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: msg.sender === 'agent'
                  ? tok.textPrimary
                  : tok.textSecondary,
              }}>
                {msg.sender === 'agent' ? 'Remediation Agent' : 'Operator'}
              </span>
              <span style={{
                fontSize: 10,
                color: tok.textPlaceholder,
                ...MONO,
              }}>
                {msg.timestamp}
              </span>
            </div>
            <div style={{
              fontSize: 12,
              lineHeight: 1.5,
              color: tok.textSecondary,
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      {/* Chat input placeholder */}
      <div style={{
        padding: '8px 12px',
        borderTop: `1px solid ${tok.borderSubtle}`,
        flexShrink: 0,
      }}>
        <div style={{
          padding: '8px 10px',
          border: `1px solid ${tok.borderSubtle}`,
          borderRadius: 4,
          fontSize: 12,
          color: tok.textPlaceholder,
          background: tok.layer01,
        }}>
          Ask the agent about this approval...
        </div>
      </div>
    </div>
  );
}

/* ── StatusBar ──────────────────────────────────────────────── */

interface StatusBarProps {
  text: string;
}

function StatusBar({ text }: StatusBarProps) {
  return (
    <div style={FOOTER}>
      <span>{text}</span>
    </div>
  );
}

/* ================================================================
 * WIREFRAME COMPOSITIONS
 * ================================================================ */

/**
 * Story 1: PendingApproval
 * Timer at 14:05, step 3 (REM-001-03) highlighted as high-risk,
 * pending status badge, approve/reject buttons visible.
 */
export function PendingApprovalWireframe() {
  const pendingChat: ChatMessage[] = [
    approvalChat[0],
    approvalChat[1],
    approvalChat[2],
  ];

  return (
    <div style={SHELL}>
      <NavBar activeTab="Runbooks" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        <ApprovalDetailCard
          request={approvalRequest}
          decision={{ status: 'pending' }}
          timerDisplay="14:05"
        />
        <PlanReviewPanel
          steps={remediationPlan.steps}
          highlightStepId="REM-001-03"
          summary="Out-of-band change to aws_security_group.main blocking production networking deploys"
        />
        <ChatPanel messages={pendingChat} />
      </div>
      <StatusBar text="Stage 6: Approval & Authorization - Awaiting incident commander approval for high-risk step REM-001-03" />
    </div>
  );
}

/**
 * Story 2: ApprovalGranted
 * Checkmark status, decided by ic-jpark, conditions block shown
 * in plan review, [Execute] button in approval panel.
 */
export function ApprovalGrantedWireframe() {
  const grantedDecision: ApprovalDecisionDetail = {
    status: 'approved',
    decidedBy: 'ic-jpark',
    decidedAt: '2026-02-20T14:34:27Z',
  };

  return (
    <div style={SHELL}>
      <NavBar activeTab="Runbooks" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        <ApprovalDetailCard
          request={approvalRequest}
          decision={grantedDecision}
          timerDisplay="--:--"
        />
        <PlanReviewPanel
          steps={remediationPlan.steps}
          highlightStepId="REM-001-03"
          summary="Out-of-band change to aws_security_group.main blocking production networking deploys"
          conditions="Monitor security group rule propagation across dependent workspaces for 5 min after apply"
        />
        <ChatPanel messages={approvalChat} />
      </div>
      <StatusBar text="Stage 6: Approved by ic-jpark - Execute when ready. Condition: monitor propagation for 5 min after apply." />
    </div>
  );
}

/**
 * Story 3: ApprovalRejected
 * X glyph status, rejection reason displayed, [Revise Plan] button.
 */
export function ApprovalRejectedWireframe() {
  const rejectedDecision: ApprovalDecisionDetail = {
    status: 'rejected',
    decidedBy: 'ic-jpark',
    decidedAt: '2026-02-20T14:37:12Z',
    reason: 'Prefer full workspace refresh over targeted resource apply',
  };

  const rejectedChat: ChatMessage[] = [
    approvalChat[0],
    approvalChat[1],
    approvalChat[2],
    {
      sender: 'agent',
      text: 'Approval rejected by ic-jpark. Reason: Prefer full workspace refresh over targeted resource apply. Awaiting revised plan.',
      timestamp: '14:37:12',
    },
    {
      sender: 'user',
      text: 'Can you regenerate the plan using a full workspace refresh instead of targeted apply?',
      timestamp: '14:37:30',
    },
    {
      sender: 'agent',
      text: 'Generating revised remediation plan with full workspace refresh strategy. Step 3 will use terraform apply without -target flag. This changes risk assessment for the production workspace.',
      timestamp: '14:37:32',
    },
  ];

  return (
    <div style={SHELL}>
      <NavBar activeTab="Runbooks" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        <ApprovalDetailCard
          request={approvalRequest}
          decision={rejectedDecision}
          timerDisplay="--:--"
        />
        <PlanReviewPanel
          steps={remediationPlan.steps}
          highlightStepId="REM-001-03"
          summary="Out-of-band change to aws_security_group.main blocking production networking deploys"
        />
        <ChatPanel messages={rejectedChat} />
      </div>
      <StatusBar text="Stage 6: Rejected - Revise remediation plan per ic-jpark feedback before resubmitting" />
    </div>
  );
}

/**
 * Story 4: ApprovalEscalated
 * Timer shows "EXPIRED", status escalated to infrastructure architect,
 * escalation notice in decision detail.
 */
export function ApprovalEscalatedWireframe() {
  const escalatedDecision: ApprovalDecisionDetail = {
    status: 'escalated',
    reason: 'Approval window expired (15 min). Incident commander did not respond. Escalating to infrastructure architect per escalation policy.',
  };

  const escalatedRequest: ApprovalRequest = {
    ...approvalRequest,
    approverRole: 'infrastructure-architect',
  };

  const escalatedChat: ChatMessage[] = [
    approvalChat[0],
    approvalChat[1],
    approvalChat[2],
    {
      sender: 'agent',
      text: 'Approval window expired at 14:48:45. No response from incident commander. Escalating to infrastructure architect per incident escalation policy.',
      timestamp: '14:48:45',
    },
    {
      sender: 'agent',
      text: 'Escalation notice sent to infrastructure architect on-call. New approval window: 15 minutes. Incident severity remains critical.',
      timestamp: '14:48:47',
    },
    {
      sender: 'user',
      text: 'Should I page the architect directly?',
      timestamp: '14:49:10',
    },
    {
      sender: 'agent',
      text: 'The escalation policy already triggered a page via PagerDuty. The infrastructure architect on-call has been notified. No manual page required.',
      timestamp: '14:49:12',
    },
  ];

  return (
    <div style={SHELL}>
      <NavBar activeTab="Runbooks" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        <ApprovalDetailCard
          request={escalatedRequest}
          decision={escalatedDecision}
          timerDisplay="EXPIRED"
        />
        <PlanReviewPanel
          steps={remediationPlan.steps}
          highlightStepId="REM-001-03"
          summary="Out-of-band change to aws_security_group.main blocking production networking deploys"
        />
        <ChatPanel messages={escalatedChat} />
      </div>
      <StatusBar text="Stage 6: Escalated - Approval window expired. Awaiting infrastructure architect authorization." />
    </div>
  );
}

/* ================================================================
 * STORYBOOK META & STORIES (CSF3)
 * ================================================================ */

const meta: Meta = {
  title: 'Wireframes/Incident/ApprovalAuthorization',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const PendingApproval: Story = {
  render: () => <PendingApprovalWireframe />,
};

export const ApprovalGranted: Story = {
  render: () => <ApprovalGrantedWireframe />,
};

export const ApprovalRejected: Story = {
  render: () => <ApprovalRejectedWireframe />,
};

export const ApprovalEscalated: Story = {
  render: () => <ApprovalEscalatedWireframe />,
};
