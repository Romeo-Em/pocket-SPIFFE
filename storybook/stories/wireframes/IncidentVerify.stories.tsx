/**
 * IncidentVerify.stories.tsx
 *
 * Journey Stages 9-10: Verification and Incident Closure
 * HCP Terraform Remediation Agent - Incident Response Dashboard
 *
 * 3-column layout: Summary/Closure (30%) | Checks/Timeline (40%) | Chat (30%)
 *
 * Stories:
 *   VerificationRunning  - VER-001 done, VER-002 running, VER-003/004 pending
 *   VerificationPassed   - all 4 checks passed, close button
 *   VerificationFailed   - VER-002 failed, re-analyze button
 *   IncidentClosed       - full closure view with timeline and tags
 */

import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  wireframeTok,
  statusGlyphFor,
  incidentNavTabs,
  statusGlyph,
  verificationChecks,
  incidentSummary,
  verifyChat,
  mockAlert,
} from './_incident-fixtures';
import type {
  VerificationCheck,
  IncidentClosure,
  IncidentTimeline,
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

const BTN: CSSProperties = {
  padding: '8px 16px',
  border: `1px solid ${tok.borderSubtle}`,
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'default',
  background: tok.layer02,
  color: tok.textPrimary,
};

const BTN_PRIMARY: CSSProperties = {
  ...BTN,
  background: tok.textPrimary,
  color: tok.bg,
};

/* ================================================================
 * HELPER FUNCTIONS
 * ================================================================ */

function formatDurationMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}m ${sec}s`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().slice(11, 19);
}

function checkStatusLabel(check: VerificationCheck, runningId?: string, failedId?: string, skippedIds?: string[]): string {
  if (skippedIds?.includes(check.checkId)) return 'skipped';
  if (failedId === check.checkId) return 'failed';
  if (runningId === check.checkId) return 'running';
  if (check.passed) return 'pass';
  return 'pending';
}

/* ── Grouping function ──────────────────────────────────────── */

function groupByCategory(checks: VerificationCheck[]): Record<string, VerificationCheck[]> {
  const map: Record<string, string> = {
    'VER-001': 'Terraform checks',
    'VER-002': 'Platform checks',
    'VER-003': 'Platform checks',
    'VER-004': 'AWS checks',
  };
  const groups: Record<string, VerificationCheck[]> = {};
  for (const check of checks) {
    const cat = map[check.checkId] || 'Other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(check);
  }
  return groups;
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

/* ── IncidentSummaryCard ────────────────────────────────────── */

interface IncidentSummaryCardProps {
  closure: IncidentClosure;
  showStatus?: boolean;
}

function IncidentSummaryCard({ closure, showStatus }: IncidentSummaryCardProps) {
  return (
    <div style={{
      padding: '14px 16px',
      background: tok.layer01,
      borderRadius: 4,
      border: `1px solid ${tok.borderSubtle}`,
      marginBottom: 12,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <span style={{ ...MONO, fontWeight: 700, fontSize: 13 }}>
          {closure.incidentId}
        </span>
        {showStatus && (
          <span style={{
            ...BADGE,
            fontSize: 10,
          }}>
            {statusGlyphFor(closure.status)} {closure.status}
          </span>
        )}
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={LABEL}>Root Cause</div>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: tok.textSecondary }}>
          {closure.rootCause}
        </div>
      </div>

      <div>
        <div style={LABEL}>Remediation</div>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: tok.textSecondary }}>
          {closure.remediationSummary}
        </div>
      </div>
    </div>
  );
}

/* ── VerificationCheckRow ───────────────────────────────────── */

interface VerificationCheckRowProps {
  check: VerificationCheck;
  status: string; // pass | fail | running | pending | skipped
  failureMessage?: string;
}

function VerificationCheckRow({ check, status, failureMessage }: VerificationCheckRowProps) {
  const glyph = statusGlyphFor(status === 'pass' ? 'pass' : status === 'fail' ? 'fail' : status);
  const isInactive = status === 'pending' || status === 'skipped';

  return (
    <div style={{
      padding: '10px 14px',
      borderBottom: `1px solid ${tok.borderSubtle}`,
      opacity: isInactive ? 0.5 : 1,
    }}>
      {/* Row 1: glyph + label + status badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
      }}>
        <span style={{
          ...MONO,
          fontSize: 14,
          width: 18,
          textAlign: 'center',
          flexShrink: 0,
        }}>
          {glyph}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>
          {check.label}
        </span>
        <span style={{ ...BADGE, fontSize: 10 }}>
          {check.checkId}
        </span>
      </div>

      {/* Row 2: expected vs actual */}
      {status !== 'pending' && status !== 'skipped' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          paddingLeft: 26,
          marginBottom: failureMessage ? 6 : 0,
        }}>
          <div>
            <div style={{ ...LABEL, fontSize: 10 }}>Expected</div>
            <div style={{ ...MONO, fontSize: 11, color: tok.textSecondary }}>
              {check.expectedResult}
            </div>
          </div>
          <div>
            <div style={{ ...LABEL, fontSize: 10 }}>Actual</div>
            <div style={{ ...MONO, fontSize: 11, color: tok.textSecondary }}>
              {status === 'running' ? (
                <span>{statusGlyph.running} checking...</span>
              ) : (
                check.actualResult || '-'
              )}
            </div>
          </div>
        </div>
      )}

      {/* Row 3: failure message if present */}
      {failureMessage && (
        <div style={{
          ...MONO,
          fontSize: 11,
          padding: '6px 10px',
          marginLeft: 26,
          background: tok.layer02,
          borderRadius: 3,
          border: `1px solid ${tok.borderSubtle}`,
          color: tok.textSecondary,
          lineHeight: 1.4,
        }}>
          {failureMessage}
        </div>
      )}

      {/* Row 4: target */}
      <div style={{
        paddingLeft: 26,
        marginTop: 4,
        fontSize: 10,
        color: tok.textPlaceholder,
      }}>
        Target: <span style={MONO}>{check.target}</span>
      </div>
    </div>
  );
}

/* ── QuietWindowTimer ───────────────────────────────────────── */

interface QuietWindowTimerProps {
  remainingSec: number;
}

function QuietWindowTimer({ remainingSec }: QuietWindowTimerProps) {
  const barWidth = 24;
  const elapsed = 120 - remainingSec;
  const filled = Math.round((elapsed / 120) * barWidth);
  const empty = barWidth - filled;
  const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(empty);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: tok.layer01,
      borderRadius: 4,
      border: `1px dashed ${tok.borderSubtle}`,
      margin: '12px 14px',
    }}>
      <div style={{
        fontSize: 16,
        marginBottom: 6,
        color: tok.textSecondary,
      }}>
        {statusGlyph.running}
      </div>
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        color: tok.textSecondary,
        marginBottom: 4,
      }}>
        Waiting for new drift... {remainingSec}s remaining
      </div>
      <div style={{
        ...MONO,
        fontSize: 11,
        letterSpacing: '0.05em',
        color: tok.textPlaceholder,
      }}>
        {bar}
      </div>
    </div>
  );
}

/* ── ClosureMetadataCard ────────────────────────────────────── */

interface ClosureMetadataCardProps {
  closure: IncidentClosure;
}

function ClosureMetadataCard({ closure }: ClosureMetadataCardProps) {
  const fields: Array<{ label: string; value: string; mono?: boolean }> = [
    { label: 'Status', value: `${statusGlyphFor('pass')} Resolved` },
    { label: 'Closed By', value: closure.closedBy, mono: true },
    { label: 'Approved By', value: closure.approvedBy, mono: true },
    { label: 'Duration', value: formatDurationMs(closure.totalDurationMs) },
    { label: 'Closed At', value: formatTime(closure.closedAt), mono: true },
    { label: 'Audit Ref', value: closure.auditRef, mono: true },
    { label: 'Postmortem', value: closure.postmortemRequired ? 'Required' : 'Not required' },
  ];

  return (
    <div style={{
      padding: '14px 16px',
      background: tok.layer01,
      borderRadius: 4,
      border: `1px solid ${tok.borderSubtle}`,
      marginBottom: 12,
    }}>
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        marginBottom: 10,
        letterSpacing: '0.02em',
      }}>
        Closure Details
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px 20px',
      }}>
        {fields.map((f) => (
          <div key={f.label}>
            <div style={LABEL}>{f.label}</div>
            <div style={{
              fontSize: 12,
              ...(f.mono ? MONO : {}),
              color: tok.textSecondary,
              wordBreak: 'break-all' as const,
            }}>
              {f.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── TimelineTable ──────────────────────────────────────────── */

interface TimelineTableProps {
  timeline: IncidentTimeline[];
}

function TimelineTable({ timeline }: TimelineTableProps) {
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
  const TD: CSSProperties = {
    padding: '7px 8px',
    fontSize: 12,
    borderBottom: `1px solid ${tok.borderSubtle}`,
    verticalAlign: 'top',
  };

  return (
    <div style={{ margin: '0 14px 12px' }}>
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        marginBottom: 8,
        letterSpacing: '0.02em',
      }}>
        Incident Timeline
      </div>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: `1px solid ${tok.borderSubtle}`,
        borderRadius: 4,
      }}>
        <thead>
          <tr>
            <th style={TH}>Stage</th>
            <th style={TH}>Entered</th>
            <th style={TH}>Exited</th>
            <th style={{ ...TH, textAlign: 'right' }}>Duration</th>
            <th style={TH}>Actor</th>
          </tr>
        </thead>
        <tbody>
          {timeline.map((row, idx) => (
            <tr key={idx}>
              <td style={{ ...TD, fontWeight: 600, fontSize: 11 }}>
                {row.stage}
              </td>
              <td style={{ ...TD, ...MONO, fontSize: 11 }}>
                {formatTime(row.enteredAt)}
              </td>
              <td style={{ ...TD, ...MONO, fontSize: 11 }}>
                {formatTime(row.exitedAt)}
              </td>
              <td style={{ ...TD, ...MONO, fontSize: 11, textAlign: 'right' }}>
                {formatDurationMs(row.durationMs)}
              </td>
              <td style={{ ...TD, ...MONO, fontSize: 11, color: tok.textSecondary }}>
                {row.actor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── TagRow ──────────────────────────────────────────────────── */

interface TagRowProps {
  tags: string[];
}

function TagRow({ tags }: TagRowProps) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      padding: '0 16px 12px',
    }}>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            ...BADGE,
            fontSize: 10,
            padding: '2px 8px',
            borderRadius: 10,
            border: `1px solid ${tok.borderSubtle}`,
            background: tok.layer01,
          }}
        >
          {tag}
        </span>
      ))}
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

/* ── AllPassedBanner ────────────────────────────────────────── */

function AllPassedBanner() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 14px',
      margin: '12px 14px',
      background: tok.layer01,
      borderRadius: 4,
      border: `1px solid ${tok.borderSubtle}`,
    }}>
      <span style={{ ...MONO, fontSize: 16 }}>
        {statusGlyphFor('pass')}
      </span>
      <span style={{ fontSize: 12, fontWeight: 600 }}>
        All checks passed
      </span>
      <span style={{ fontSize: 11, color: tok.textPlaceholder }}>
        - Incident can be closed
      </span>
    </div>
  );
}

/* ── FailedBanner ───────────────────────────────────────────── */

interface FailedBannerProps {
  failedCount: number;
  skippedCount: number;
}

function FailedBanner({ failedCount, skippedCount }: FailedBannerProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 14px',
      margin: '12px 14px',
      background: tok.layer02,
      borderRadius: 4,
      border: `1px solid ${tok.borderSubtle}`,
    }}>
      <span style={{ ...MONO, fontSize: 16 }}>
        {statusGlyphFor('fail')}
      </span>
      <span style={{ fontSize: 12, fontWeight: 600 }}>
        {failedCount} check{failedCount !== 1 ? 's' : ''} failed
      </span>
      {skippedCount > 0 && (
        <span style={{ fontSize: 11, color: tok.textPlaceholder }}>
          - {skippedCount} skipped
        </span>
      )}
    </div>
  );
}

/* ================================================================
 * WIREFRAME COMPOSITIONS
 * ================================================================ */

/**
 * Story 1: VerificationRunning
 * VER-001 done, VER-002 running, VER-003/004 pending.
 * QuietWindowTimer visible.
 */
export function VerificationRunningWireframe() {
  const runningChecks: VerificationCheck[] = verificationChecks.map((c) => {
    if (c.checkId === 'VER-001') return { ...c, passed: true };
    if (c.checkId === 'VER-002') return { ...c, passed: false, actualResult: undefined };
    return { ...c, passed: false, actualResult: undefined };
  });

  const grouped = groupByCategory(runningChecks);
  const runningChat: ChatMessage[] = [verifyChat[0]];

  return (
    <div style={SHELL}>
      <NavBar activeTab="Workspaces" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        {/* Left: Summary */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Incident Summary</span>
          </div>
          <div style={{ ...PANEL_BODY, padding: 16 }}>
            <IncidentSummaryCard closure={incidentSummary} />
          </div>
        </div>

        {/* Center: Checks */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Verification Checks</span>
            <span style={{ ...BADGE, fontSize: 10 }}>
              1 / 4 complete
            </span>
          </div>
          <div style={PANEL_BODY}>
            {Object.entries(grouped).map(([category, checks]) => (
              <div key={category}>
                <div style={{
                  padding: '8px 14px 4px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: tok.textPlaceholder,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  background: tok.layer01,
                  borderBottom: `1px solid ${tok.borderSubtle}`,
                }}>
                  {category}
                </div>
                {checks.map((check) => {
                  const status = checkStatusLabel(check, 'VER-002');
                  return (
                    <VerificationCheckRow
                      key={check.checkId}
                      check={check}
                      status={status}
                    />
                  );
                })}
              </div>
            ))}
            <QuietWindowTimer remainingSec={85} />
          </div>
        </div>

        {/* Right: Chat */}
        <ChatPanel messages={runningChat} />
      </div>
      <StatusBar text="Stage 9: Verification - Running checks (1/4 complete), quiet window 85s remaining" />
    </div>
  );
}

/**
 * Story 2: VerificationPassed
 * All 4 checks passed. "All checks passed" banner. [Close Incident] button.
 */
export function VerificationPassedWireframe() {
  const grouped = groupByCategory(verificationChecks);
  const passedChat: ChatMessage[] = [verifyChat[0], verifyChat[1]];

  return (
    <div style={SHELL}>
      <NavBar activeTab="Workspaces" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        {/* Left: Summary + close button */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Incident Summary</span>
          </div>
          <div style={{ ...PANEL_BODY, padding: 16 }}>
            <IncidentSummaryCard closure={incidentSummary} />
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 8,
            }}>
              <button style={BTN_PRIMARY}>
                Close Incident
              </button>
            </div>
          </div>
        </div>

        {/* Center: Checks */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Verification Checks</span>
            <span style={{ ...BADGE, fontSize: 10 }}>
              4 / 4 complete
            </span>
          </div>
          <div style={PANEL_BODY}>
            <AllPassedBanner />
            {Object.entries(grouped).map(([category, checks]) => (
              <div key={category}>
                <div style={{
                  padding: '8px 14px 4px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: tok.textPlaceholder,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  background: tok.layer01,
                  borderBottom: `1px solid ${tok.borderSubtle}`,
                }}>
                  {category}
                </div>
                {checks.map((check) => (
                  <VerificationCheckRow
                    key={check.checkId}
                    check={check}
                    status="pass"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chat */}
        <ChatPanel messages={passedChat} />
      </div>
      <StatusBar text="Stage 9: Verification - All 4 checks passed, ready to close" />
    </div>
  );
}

/**
 * Story 3: VerificationFailed
 * VER-001 passed, VER-002 failed (provider timeout), VER-003/004 skipped.
 * [Re-analyze] button.
 */
export function VerificationFailedWireframe() {
  const failedChecks: VerificationCheck[] = verificationChecks.map((c) => {
    if (c.checkId === 'VER-001') return { ...c, passed: true };
    if (c.checkId === 'VER-002') return {
      ...c,
      passed: false,
      actualResult: 'current-run.status: errored',
    };
    return { ...c, passed: false, actualResult: undefined };
  });

  const grouped = groupByCategory(failedChecks);
  const skippedIds = ['VER-003', 'VER-004'];

  const failedChat: ChatMessage[] = [
    verifyChat[0],
    {
      sender: 'agent',
      text: 'Verification failed. VER-002 (Workspace run status) returned errored. Provider timeout waiting for security group rule propagation. VER-003 and VER-004 skipped.',
      timestamp: '14:36:08',
    },
    {
      sender: 'user',
      text: 'Re-run the analysis. The security group might need more time to propagate.',
      timestamp: '14:36:15',
    },
  ];

  return (
    <div style={SHELL}>
      <NavBar activeTab="Workspaces" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        {/* Left: Summary + re-analyze */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Incident Summary</span>
          </div>
          <div style={{ ...PANEL_BODY, padding: 16 }}>
            <IncidentSummaryCard closure={incidentSummary} />
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 8,
            }}>
              <button style={BTN}>
                Re-analyze
              </button>
            </div>
          </div>
        </div>

        {/* Center: Checks */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Verification Checks</span>
            <span style={{ ...BADGE, fontSize: 10 }}>
              1 / 4 passed
            </span>
          </div>
          <div style={PANEL_BODY}>
            <FailedBanner failedCount={1} skippedCount={2} />
            {Object.entries(grouped).map(([category, checks]) => (
              <div key={category}>
                <div style={{
                  padding: '8px 14px 4px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: tok.textPlaceholder,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  background: tok.layer01,
                  borderBottom: `1px solid ${tok.borderSubtle}`,
                }}>
                  {category}
                </div>
                {checks.map((check) => {
                  const status = checkStatusLabel(check, undefined, 'VER-002', skippedIds);
                  return (
                    <VerificationCheckRow
                      key={check.checkId}
                      check={check}
                      status={status}
                      failureMessage={
                        check.checkId === 'VER-002'
                          ? 'Error: Provider timeout waiting for security group rule propagation'
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chat */}
        <ChatPanel messages={failedChat} />
      </div>
      <StatusBar text="Stage 9: Verification - Failed: VER-002 provider timeout, 2 checks skipped" />
    </div>
  );
}

/**
 * Story 4: IncidentClosed
 * Full closure view: ClosureMetadataCard + TimelineTable + TagRow.
 */
export function IncidentClosedWireframe() {
  return (
    <div style={SHELL}>
      <NavBar activeTab="Audit" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        {/* Left: Summary + closure metadata */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Incident Summary</span>
            <span style={{ ...BADGE, fontSize: 10 }}>
              {statusGlyphFor('pass')} Closed
            </span>
          </div>
          <div style={{ ...PANEL_BODY, padding: 16 }}>
            <IncidentSummaryCard closure={incidentSummary} showStatus />
            <ClosureMetadataCard closure={incidentSummary} />
            <TagRow tags={incidentSummary.tags} />
          </div>
        </div>

        {/* Center: Timeline */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Incident Timeline</span>
            <span style={{ ...BADGE, fontSize: 10 }}>
              {incidentSummary.timeline.length} stages
            </span>
          </div>
          <div style={PANEL_BODY}>
            <div style={{ padding: '12px 0' }}>
              <TimelineTable timeline={incidentSummary.timeline} />
            </div>

            {/* Duration summary */}
            <div style={{
              margin: '0 14px 12px',
              padding: '12px 14px',
              background: tok.layer01,
              borderRadius: 4,
              border: `1px solid ${tok.borderSubtle}`,
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>
                  Total Duration
                </span>
                <span style={{ ...MONO, fontSize: 13, fontWeight: 700 }}>
                  {formatDurationMs(incidentSummary.totalDurationMs)}
                </span>
              </div>
              <div style={{
                display: 'flex',
                gap: 16,
                marginTop: 8,
                fontSize: 11,
                color: tok.textPlaceholder,
              }}>
                <span>Automated: {formatDurationMs(
                  incidentSummary.timeline
                    .filter((t) => t.actor === 'agent' || t.actor === 'system' || t.actor === 'playbook-engine')
                    .reduce((sum, t) => sum + t.durationMs, 0)
                )}</span>
                <span>Human: {formatDurationMs(
                  incidentSummary.timeline
                    .filter((t) => t.actor !== 'agent' && t.actor !== 'system' && t.actor !== 'playbook-engine')
                    .reduce((sum, t) => sum + t.durationMs, 0)
                )}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chat */}
        <ChatPanel messages={verifyChat} />
      </div>
      <StatusBar text="Stage 10: Incident Closure - INC-2026-0847 resolved in 6m 10s, audit record written" />
    </div>
  );
}

/* ================================================================
 * STORYBOOK META & STORIES (CSF3)
 * ================================================================ */

const meta: Meta = {
  title: 'Wireframes/Incident/VerifyClosure',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const VerificationRunning: Story = {
  render: () => <VerificationRunningWireframe />,
};

export const VerificationPassed: Story = {
  render: () => <VerificationPassedWireframe />,
};

export const VerificationFailed: Story = {
  render: () => <VerificationFailedWireframe />,
};

export const IncidentClosed: Story = {
  render: () => <IncidentClosedWireframe />,
};
