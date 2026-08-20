/**
 * IncidentAnalysis.stories.tsx
 *
 * Journey Stages 4-5: Root Cause Analysis and Remediation Suggestion
 * HCP Terraform Remediation Agent - Incident Response Dashboard
 *
 * 3-column layout: Context (25%) | Analysis/Remediation (45%) | Chat (30%)
 *
 * Stories:
 *   RootCauseRanking       - 3 candidates ranked, RC-001 emphasized (92%)
 *   CauseSelected          - RC-001 selected (checkmark), others dimmed
 *   RemediationProposed    - 3-step table, REM-001-03 high-risk, approval banner
 *   RemediationWithRollback - Same with rollback column visible
 */

import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  wireframeTok,
  statusGlyphFor,
  incidentNavTabs,
  statusGlyph,
  rootCauseRanking,
  remediationPlan,
  analysisChat,
  mockAlert,
} from './_incident-fixtures';
import type {
  CauseCandidate,
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
  gridTemplateColumns: '25% 45% 30%',
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

/* ================================================================
 * HELPER FUNCTIONS
 * ================================================================ */

function confidenceBar(score: number, width: number = 20): string {
  const filled = Math.round(score * width);
  const empty = width - filled;
  return '\u2588'.repeat(filled) + '\u2591'.repeat(empty);
}

function confidencePercent(score: number): string {
  return `${(score * 100).toFixed(0)}%`;
}

function riskGlyph(level: 'low' | 'medium' | 'high'): string {
  const map: Record<string, string> = {
    low: '\u25CB',     // empty circle
    medium: '\u25C6',  // diamond
    high: '\u25B2',    // filled triangle
  };
  return map[level] || '\u25CB';
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
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

/* ── IncidentContextCard ────────────────────────────────────── */

interface IncidentContextCardProps {
  incidentId: string;
  severity: string;
  workspace: string;
  signalCount: number;
  projects: string[];
  selectedCauseId?: string;
  state: string;
}

function IncidentContextCard({
  incidentId,
  severity,
  workspace,
  signalCount,
  projects,
  selectedCauseId,
  state,
}: IncidentContextCardProps) {
  return (
    <div style={PANEL}>
      <div style={PANEL_HEADER}>
        <span>Incident Context</span>
        <span style={{ ...BADGE, fontSize: 10 }}>
          {statusGlyphFor(severity)} {severity}
        </span>
      </div>
      <div style={{ ...PANEL_BODY, padding: 12 }}>
        {/* Incident ID + state */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <span style={{ ...MONO, fontWeight: 700, fontSize: 14 }}>
            {incidentId}
          </span>
          <span style={{
            ...BADGE,
            fontSize: 10,
            textTransform: 'capitalize' as const,
          }}>
            {state.replace('_', ' ')}
          </span>
        </div>

        {/* Workspace */}
        <div style={{ marginBottom: 12 }}>
          <div style={LABEL}>Workspace</div>
          <div style={{ ...MONO, fontSize: 13 }}>{workspace}</div>
        </div>

        {/* Signal count */}
        <div style={{ marginBottom: 12 }}>
          <div style={LABEL}>Correlated Signals</div>
          <div style={{ fontSize: 13 }}>
            {signalCount} signal{signalCount !== 1 ? 's' : ''} correlated
          </div>
        </div>

        {/* Project badges */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ ...LABEL, marginBottom: 6 }}>Projects / Sources</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {projects.map((p) => (
              <span key={p} style={{
                ...BADGE,
                ...MONO,
                fontSize: 10,
                padding: '2px 8px',
              }}>
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Selected cause (if any) */}
        {selectedCauseId && (
          <div style={{
            marginTop: 8,
            padding: '10px 12px',
            background: tok.layer01,
            borderRadius: 4,
            border: `1px solid ${tok.borderSubtle}`,
          }}>
            <div style={{ ...LABEL, marginBottom: 4 }}>Selected Root Cause</div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
            }}>
              <span style={{ ...MONO, fontSize: 14 }}>
                {statusGlyph.pass}
              </span>
              <span style={{ ...MONO, fontWeight: 600, fontSize: 11 }}>
                {selectedCauseId}
              </span>
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{
          borderTop: `1px solid ${tok.borderSubtle}`,
          margin: '16px 0 12px',
        }} />

        {/* Operator assignment */}
        <div style={{ marginBottom: 12 }}>
          <div style={LABEL}>Assigned To</div>
          <div style={{ fontSize: 13 }}>op-mchen</div>
        </div>

        {/* Timeline summary */}
        <div>
          <div style={LABEL}>Elapsed</div>
          <div style={{ fontSize: 13, ...MONO }}>
            {state === 'analyzing' ? '57s' : '1m 02s'}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── CauseCandidateRow ──────────────────────────────────────── */

interface CauseCandidateRowProps {
  candidate: CauseCandidate;
  rank: number;
  isSelected?: boolean;
  isDimmed?: boolean;
}

function CauseCandidateRow({
  candidate,
  rank,
  isSelected = false,
  isDimmed = false,
}: CauseCandidateRowProps) {
  const opacity = isDimmed ? 0.4 : 1;

  return (
    <div style={{
      padding: '12px 14px',
      borderBottom: `1px solid ${tok.borderSubtle}`,
      background: isSelected ? tok.layer01 : 'transparent',
      borderLeft: isSelected
        ? `3px solid ${tok.textPrimary}`
        : '3px solid transparent',
      opacity,
      transition: 'opacity 0.15s',
    }}>
      {/* Header: rank + ID + confidence + selection glyph */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
      }}>
        <span style={{
          ...MONO,
          fontSize: 11,
          color: tok.textPlaceholder,
          width: 20,
          textAlign: 'center',
        }}>
          #{rank}
        </span>
        <span style={{ ...MONO, fontWeight: 600, fontSize: 12 }}>
          {candidate.candidateId}
        </span>
        <span style={{ flex: 1 }} />
        {isSelected && (
          <span style={{
            ...MONO,
            fontSize: 14,
            fontWeight: 700,
          }}>
            {statusGlyph.pass}
          </span>
        )}
        <span style={{ ...MONO, fontWeight: 700, fontSize: 13 }}>
          {confidencePercent(candidate.confidence)}
        </span>
      </div>

      {/* Description */}
      <div style={{
        fontSize: 12,
        lineHeight: 1.5,
        marginBottom: 8,
        paddingLeft: 28,
        color: isSelected ? tok.textPrimary : tok.textSecondary,
      }}>
        {candidate.description}
      </div>

      {/* Confidence bar */}
      <div style={{
        ...MONO,
        fontSize: 11,
        letterSpacing: '0.05em',
        marginBottom: 8,
        paddingLeft: 28,
        color: tok.textSecondary,
      }}>
        {confidenceBar(candidate.confidence)}
      </div>

      {/* Evidence bullets */}
      <div style={{ paddingLeft: 28, marginBottom: 8 }}>
        {candidate.evidence.map((ev, idx) => (
          <div key={idx} style={{
            display: 'flex',
            gap: 6,
            fontSize: 11,
            lineHeight: 1.5,
            color: tok.textSecondary,
            marginBottom: 2,
          }}>
            <span style={{ color: tok.textPlaceholder, flexShrink: 0 }}>-</span>
            <span>{ev}</span>
          </div>
        ))}
      </div>

      {/* Signal badges */}
      {candidate.relatedSignalIds.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          paddingLeft: 28,
        }}>
          {candidate.relatedSignalIds.map((sigId) => (
            <span key={sigId} style={{
              ...BADGE,
              ...MONO,
              fontSize: 10,
              padding: '1px 6px',
            }}>
              {sigId}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── RemediationStepRow ─────────────────────────────────────── */

interface RemediationStepRowProps {
  step: RemediationStep;
  showRollback?: boolean;
}

function RemediationStepRow({ step, showRollback = false }: RemediationStepRowProps) {
  const isHighRisk = step.riskLevel === 'high';

  return (
    <tr style={{
      background: isHighRisk ? tok.layer01 : 'transparent',
    }}>
      {/* Order */}
      <td style={{
        padding: '10px 8px',
        fontSize: 12,
        borderBottom: `1px solid ${tok.borderSubtle}`,
        verticalAlign: 'top',
        textAlign: 'center',
        ...MONO,
        fontWeight: 600,
      }}>
        {step.order}
      </td>

      {/* Step ID */}
      <td style={{
        padding: '10px 8px',
        fontSize: 11,
        borderBottom: `1px solid ${tok.borderSubtle}`,
        verticalAlign: 'top',
        ...MONO,
      }}>
        {step.stepId}
      </td>

      {/* Action */}
      <td style={{
        padding: '10px 8px',
        fontSize: 12,
        borderBottom: `1px solid ${tok.borderSubtle}`,
        verticalAlign: 'top',
        lineHeight: 1.4,
      }}>
        {step.action}
      </td>

      {/* Command (monospace) */}
      <td style={{
        padding: '10px 8px',
        borderBottom: `1px solid ${tok.borderSubtle}`,
        verticalAlign: 'top',
      }}>
        <code style={{
          ...MONO,
          fontSize: 11,
          padding: '2px 6px',
          background: tok.layer02,
          borderRadius: 3,
          display: 'inline-block',
          lineHeight: 1.4,
          wordBreak: 'break-all' as const,
        }}>
          {step.command}
        </code>
      </td>

      {/* Target */}
      <td style={{
        padding: '10px 8px',
        fontSize: 11,
        borderBottom: `1px solid ${tok.borderSubtle}`,
        verticalAlign: 'top',
        ...MONO,
      }}>
        {step.target}
      </td>

      {/* Tool */}
      <td style={{
        padding: '10px 8px',
        borderBottom: `1px solid ${tok.borderSubtle}`,
        verticalAlign: 'top',
      }}>
        <span style={{
          ...BADGE,
          ...MONO,
          fontSize: 10,
        }}>
          {step.tool}
        </span>
      </td>

      {/* Risk */}
      <td style={{
        padding: '10px 8px',
        fontSize: 12,
        borderBottom: `1px solid ${tok.borderSubtle}`,
        verticalAlign: 'top',
        textAlign: 'center',
        fontWeight: isHighRisk ? 700 : 400,
      }}>
        {riskGlyph(step.riskLevel)} {step.riskLevel}
      </td>

      {/* Duration */}
      <td style={{
        padding: '10px 8px',
        fontSize: 11,
        borderBottom: `1px solid ${tok.borderSubtle}`,
        verticalAlign: 'top',
        textAlign: 'right',
        ...MONO,
      }}>
        ~{formatDuration(step.estimatedDurationSec)}
      </td>

      {/* Rollback (conditional) */}
      {showRollback && (
        <td style={{
          padding: '10px 8px',
          borderBottom: `1px solid ${tok.borderSubtle}`,
          verticalAlign: 'top',
        }}>
          {step.rollbackCommand ? (
            <code style={{
              ...MONO,
              fontSize: 10,
              padding: '2px 6px',
              background: tok.layer02,
              borderRadius: 3,
              display: 'inline-block',
              lineHeight: 1.3,
              wordBreak: 'break-all' as const,
            }}>
              {step.rollbackCommand}
            </code>
          ) : (
            <span style={{
              fontSize: 11,
              color: tok.textPlaceholder,
            }}>
              -
            </span>
          )}
        </td>
      )}
    </tr>
  );
}

/* ── ApprovalBanner ─────────────────────────────────────────── */

function ApprovalBanner() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      background: tok.layer01,
      border: `1px solid ${tok.borderSubtle}`,
      borderRadius: 4,
      marginTop: 12,
    }}>
      <span style={{ fontSize: 16 }}>{statusGlyphFor('high')}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 2,
        }}>
          Requires Team Lead approval
        </div>
        <div style={{
          fontSize: 11,
          color: tok.textSecondary,
          lineHeight: 1.4,
        }}>
          Step REM-001-03 (apply corrected plan to production networking) is
          high-risk. Approval request will be sent to incident commander.
        </div>
      </div>
      <button style={{
        padding: '6px 14px',
        border: `1px solid ${tok.borderSubtle}`,
        borderRadius: 4,
        background: tok.layer02,
        fontSize: 12,
        fontWeight: 600,
        color: tok.textPrimary,
        cursor: 'default',
      }}>
        Request Approval
      </button>
    </div>
  );
}

/* ── RemediationTable ───────────────────────────────────────── */

interface RemediationTableProps {
  steps: RemediationStep[];
  showRollback?: boolean;
}

function RemediationTable({ steps, showRollback = false }: RemediationTableProps) {
  const TH: CSSProperties = {
    textAlign: 'left',
    padding: '6px 8px',
    fontSize: 11,
    fontWeight: 600,
    color: tok.textPlaceholder,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: `1px solid ${tok.borderSubtle}`,
    background: tok.layer01,
  };

  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      border: `1px solid ${tok.borderSubtle}`,
      borderRadius: 4,
    }}>
      <thead>
        <tr>
          <th style={{ ...TH, width: 32, textAlign: 'center' }}>#</th>
          <th style={{ ...TH, width: 80 }}>Step ID</th>
          <th style={TH}>Action</th>
          <th style={TH}>Command</th>
          <th style={{ ...TH, width: 110 }}>Target</th>
          <th style={{ ...TH, width: 70 }}>Tool</th>
          <th style={{ ...TH, width: 80, textAlign: 'center' }}>Risk</th>
          <th style={{ ...TH, width: 60, textAlign: 'right' }}>Est.</th>
          {showRollback && (
            <th style={TH}>Rollback</th>
          )}
        </tr>
      </thead>
      <tbody>
        {steps.map((step) => (
          <RemediationStepRow
            key={step.stepId}
            step={step}
            showRollback={showRollback}
          />
        ))}
      </tbody>
    </table>
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
            {/* Sender + timestamp header */}
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
            {/* Message text */}
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
          Ask the agent about this incident...
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
 * Story 1: RootCauseRanking
 * 3 candidates ranked by confidence. RC-001 at 92% is visually emphasized
 * with a left border accent. All candidates show evidence bullets, confidence
 * bars, and signal badges.
 */
export function RootCauseRankingWireframe() {
  return (
    <div style={SHELL}>
      <NavBar activeTab="Runbooks" incidentId="INC-0847" />
      <div style={MAIN}>
        <IncidentContextCard
          incidentId="INC-0847"
          severity="critical"
          workspace="ws-prod-networking"
          signalCount={3}
          projects={['prod-infra', 'ws-prod-networking', 'TFC-RUN-LOG']}
          state="analyzing"
        />
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Root Cause Analysis</span>
            <span style={{ ...BADGE, fontSize: 10 }}>
              {rootCauseRanking.length} candidates
            </span>
          </div>
          <div style={{ ...PANEL_BODY, padding: 0 }}>
            {/* Analysis method badge */}
            <div style={{
              padding: '10px 14px',
              borderBottom: `1px solid ${tok.borderSubtle}`,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={LABEL}>Method</span>
              <span style={{ ...BADGE, fontSize: 10 }}>correlation</span>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: tok.textPlaceholder }}>
                Processed in 12ms
              </span>
            </div>
            {/* Candidate rows */}
            {rootCauseRanking.map((c, idx) => (
              <CauseCandidateRow
                key={c.candidateId}
                candidate={c}
                rank={idx + 1}
                isSelected={false}
                isDimmed={false}
              />
            ))}
          </div>
        </div>
        <ChatPanel messages={analysisChat.slice(0, 2)} />
      </div>
      <StatusBar text="Stage 4: Root Cause Analysis - 3 candidates identified, RC-001 highest confidence (92%)" />
    </div>
  );
}

/**
 * Story 2: CauseSelected
 * RC-001 is selected (checkmark glyph, left border accent). RC-002 and RC-003
 * are dimmed to 40% opacity. The context panel shows the selected cause.
 */
export function CauseSelectedWireframe() {
  return (
    <div style={SHELL}>
      <NavBar activeTab="Runbooks" incidentId="INC-0847" />
      <div style={MAIN}>
        <IncidentContextCard
          incidentId="INC-0847"
          severity="critical"
          workspace="ws-prod-networking"
          signalCount={3}
          projects={['prod-infra', 'ws-prod-networking', 'TFC-RUN-LOG']}
          selectedCauseId="RC-001"
          state="remediation_suggested"
        />
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Root Cause Analysis</span>
            <span style={{ ...BADGE, fontSize: 10 }}>
              {statusGlyph.pass} cause selected
            </span>
          </div>
          <div style={{ ...PANEL_BODY, padding: 0 }}>
            {/* Analysis method badge */}
            <div style={{
              padding: '10px 14px',
              borderBottom: `1px solid ${tok.borderSubtle}`,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={LABEL}>Method</span>
              <span style={{ ...BADGE, fontSize: 10 }}>correlation</span>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: tok.textPlaceholder }}>
                Processed in 12ms
              </span>
            </div>
            {/* RC-001 selected, others dimmed */}
            {rootCauseRanking.map((c, idx) => (
              <CauseCandidateRow
                key={c.candidateId}
                candidate={c}
                rank={idx + 1}
                isSelected={c.candidateId === 'RC-001'}
                isDimmed={c.candidateId !== 'RC-001'}
              />
            ))}
          </div>
        </div>
        <ChatPanel messages={analysisChat.slice(0, 3)} />
      </div>
      <StatusBar text="Stage 4: Root Cause Selected - RC-001 confirmed (manual out-of-band change, 92% confidence)" />
    </div>
  );
}

/**
 * Story 3: RemediationProposed
 * 3-step remediation table. REM-001-03 is high-risk (filled triangle).
 * ApprovalBanner displayed below table. Plan summary header shows total
 * estimated time and playbook reference.
 */
export function RemediationProposedWireframe() {
  const { steps } = remediationPlan;

  return (
    <div style={SHELL}>
      <NavBar activeTab="Runbooks" incidentId="INC-0847" />
      <div style={MAIN}>
        <IncidentContextCard
          incidentId="INC-0847"
          severity="critical"
          workspace="ws-prod-networking"
          signalCount={3}
          projects={['prod-infra', 'ws-prod-networking', 'TFC-RUN-LOG']}
          selectedCauseId="RC-001"
          state="remediation_suggested"
        />
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Remediation Plan</span>
            <span style={{ ...BADGE, fontSize: 10 }}>
              {steps.length} steps
            </span>
          </div>
          <div style={{ ...PANEL_BODY, padding: 14 }}>
            {/* Plan summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 12,
              marginBottom: 14,
            }}>
              <div>
                <div style={LABEL}>Root Cause</div>
                <div style={{ ...MONO, fontSize: 12, fontWeight: 600 }}>
                  RC-001
                </div>
              </div>
              <div>
                <div style={LABEL}>Est. Duration</div>
                <div style={{ ...MONO, fontSize: 12 }}>
                  ~{formatDuration(remediationPlan.totalEstimatedSec)}
                </div>
              </div>
              <div>
                <div style={LABEL}>Playbook</div>
                <div style={{
                  ...MONO,
                  fontSize: 10,
                  wordBreak: 'break-all' as const,
                }}>
                  {remediationPlan.playbookRef}
                </div>
              </div>
            </div>

            {/* Rollback strategy badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 14,
            }}>
              <span style={LABEL}>Rollback Strategy</span>
              <span style={{ ...BADGE, fontSize: 10 }}>
                {remediationPlan.rollbackStrategy}
              </span>
              <span style={{ flex: 1 }} />
              <span style={{
                ...BADGE,
                fontSize: 10,
                fontWeight: 700,
              }}>
                {riskGlyph('high')} 1 high-risk step
              </span>
            </div>

            {/* Steps table */}
            <RemediationTable steps={steps} showRollback={false} />

            {/* Approval banner */}
            <ApprovalBanner />
          </div>
        </div>
        <ChatPanel messages={analysisChat} />
      </div>
      <StatusBar text="Stage 5: Remediation Suggested - 3 steps proposed, step 3 requires team lead approval" />
    </div>
  );
}

/**
 * Story 4: RemediationWithRollback
 * Same remediation table with an additional rollback column visible. Step 3
 * (REM-001-03) shows its rollback command. Steps 1-2 show "-" for rollback.
 */
export function RemediationWithRollbackWireframe() {
  const { steps } = remediationPlan;

  return (
    <div style={SHELL}>
      <NavBar activeTab="Runbooks" incidentId="INC-0847" />
      <div style={MAIN}>
        <IncidentContextCard
          incidentId="INC-0847"
          severity="critical"
          workspace="ws-prod-networking"
          signalCount={3}
          projects={['prod-infra', 'ws-prod-networking', 'TFC-RUN-LOG']}
          selectedCauseId="RC-001"
          state="pending_approval"
        />
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Remediation Plan - Rollback View</span>
            <span style={{ ...BADGE, fontSize: 10 }}>
              {steps.length} steps
            </span>
          </div>
          <div style={{ ...PANEL_BODY, padding: 14 }}>
            {/* Plan summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 12,
              marginBottom: 14,
            }}>
              <div>
                <div style={LABEL}>Root Cause</div>
                <div style={{ ...MONO, fontSize: 12, fontWeight: 600 }}>
                  RC-001
                </div>
              </div>
              <div>
                <div style={LABEL}>Est. Duration</div>
                <div style={{ ...MONO, fontSize: 12 }}>
                  ~{formatDuration(remediationPlan.totalEstimatedSec)}
                </div>
              </div>
              <div>
                <div style={LABEL}>Rollback Strategy</div>
                <div style={{ ...MONO, fontSize: 12 }}>
                  {remediationPlan.rollbackStrategy}
                </div>
              </div>
            </div>

            {/* Rollback detail */}
            <div style={{
              padding: '8px 12px',
              background: tok.layer01,
              borderRadius: 4,
              border: `1px solid ${tok.borderSubtle}`,
              marginBottom: 14,
              fontSize: 11,
              lineHeight: 1.5,
              color: tok.textSecondary,
            }}>
              Rollback strategy: <strong>step-by-step</strong>. Each step
              with a rollback command will be reverted in reverse order if a
              subsequent step fails. Step REM-001-03 has an explicit rollback
              via <code style={{
                ...MONO,
                fontSize: 10,
                padding: '1px 4px',
                background: tok.layer02,
                borderRadius: 2,
              }}>terraform state push</code>.
            </div>

            {/* Steps table with rollback column */}
            <RemediationTable steps={steps} showRollback={true} />

            {/* Approval banner */}
            <ApprovalBanner />
          </div>
        </div>
        <ChatPanel messages={analysisChat} />
      </div>
      <StatusBar text="Stage 5: Remediation Plan (rollback view) - pending team lead approval for high-risk step REM-001-03" />
    </div>
  );
}

/* ================================================================
 * STORYBOOK META & STORIES (CSF3)
 * ================================================================ */

const meta: Meta = {
  title: 'Wireframes/Incident/AnalysisRemediation',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const RootCauseRanking: Story = {
  render: () => <RootCauseRankingWireframe />,
};

export const CauseSelected: Story = {
  render: () => <CauseSelectedWireframe />,
};

export const RemediationProposed: Story = {
  render: () => <RemediationProposedWireframe />,
};

export const RemediationWithRollback: Story = {
  render: () => <RemediationWithRollbackWireframe />,
};
