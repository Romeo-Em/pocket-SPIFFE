/**
 * IncidentExecute.stories.tsx
 *
 * Journey Stages 7-8: Runbook Execution and Monitoring
 * HCP Terraform Remediation Agent - Incident Response Dashboard
 *
 * 3-column layout: Execution Summary (30%) | Step Detail (40%) | Chat (30%)
 *
 * Stories:
 *   ExecutionRunning    - step 1 done, step 2 running (expanded), step 3 pending
 *   ExecutionComplete   - all 3 steps done, 40s total, [Run Verification] button
 *   ExecutionFailed     - step 1 done, step 2 failed, step 3 skipped, rollback banner
 *   ExecutionWithEvents - compact step list + monospace scrollable event log
 */

import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  wireframeTok,
  statusGlyphFor,
  incidentNavTabs,
  statusGlyph,
  executionSteps,
  executionEvents,
  executeChat,
  remediationPlan,
  mockAlert,
} from './_incident-fixtures';
import type {
  PlaybookStep,
  ExecutionEvent,
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

/* ================================================================
 * HELPER FUNCTIONS
 * ================================================================ */

function progressBar(completed: number, total: number, width: number = 16): string {
  const filled = Math.round((completed / total) * width);
  const empty = width - filled;
  return '\u2588'.repeat(filled) + '\u2591'.repeat(empty);
}

function formatDuration(ms: number): string {
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  return `${min}m ${rem}s`;
}

function stepStatusLabel(status: PlaybookStep['status']): string {
  const map: Record<string, string> = {
    done: 'Done',
    running: 'Running',
    pending: 'Pending',
    failed: 'Failed',
    skipped: 'Skipped',
    'rolled-back': 'Rolled Back',
  };
  return map[status] || status;
}

/**
 * Override specific step statuses by stepId.
 * Returns a new array - does not mutate the original.
 */
function overrideStatuses(
  steps: PlaybookStep[],
  overrides: Record<string, PlaybookStep['status']>,
): PlaybookStep[] {
  return steps.map((step) => {
    const newStatus = overrides[step.stepId];
    if (!newStatus) return step;
    const patched = { ...step, status: newStatus };
    if (newStatus === 'pending') {
      delete patched.startedAt;
      delete patched.completedAt;
      delete patched.output;
      delete patched.returnCode;
      delete patched.durationMs;
    }
    if (newStatus === 'running') {
      delete patched.completedAt;
      delete patched.returnCode;
      delete patched.durationMs;
      patched.output = 'aws_security_group.main: Planning... [id=sg-0a1b2c3d]';
    }
    if (newStatus === 'failed') {
      patched.returnCode = 1;
      patched.output = 'Error: Provider error: InvalidGroup.NotFound\n\n  The security group sg-0a1b2c3d does not exist in the specified VPC.';
      patched.durationMs = 6000;
      patched.completedAt = '2026-02-20T14:35:21Z';
    }
    if (newStatus === 'skipped') {
      delete patched.startedAt;
      delete patched.completedAt;
      delete patched.output;
      delete patched.returnCode;
      delete patched.durationMs;
    }
    return patched;
  });
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

/* ── ExecutionSummaryCard ────────────────────────────────────── */

interface ExecutionSummaryCardProps {
  playbookRef: string;
  startedAt: string;
  completedCount: number;
  totalCount: number;
  elapsedMs: number;
  overallStatus: 'running' | 'completed' | 'failed' | 'rolling-back';
}

function ExecutionSummaryCard({
  playbookRef,
  startedAt,
  completedCount,
  totalCount,
  elapsedMs,
  overallStatus,
}: ExecutionSummaryCardProps) {
  const statusColors: Record<string, string> = {
    running: tok.textPrimary,
    completed: tok.textPrimary,
    failed: tok.textPrimary,
    'rolling-back': tok.textPrimary,
  };

  return (
    <div style={{
      padding: '14px 16px',
      background: tok.layer01,
      borderRadius: 4,
      border: `1px solid ${tok.borderSubtle}`,
      marginBottom: 16,
    }}>
      {/* Header row: Execution status + glyph */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>
          Playbook Execution
        </span>
        <span style={{
          ...BADGE,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: statusColors[overallStatus],
        }}>
          <span style={{ fontSize: 12 }}>
            {overallStatus === 'running' ? statusGlyph.running :
             overallStatus === 'completed' ? statusGlyph.pass :
             overallStatus === 'failed' ? statusGlyph.fail :
             '\u21A9'}
          </span>
          {overallStatus === 'rolling-back' ? 'Rolling Back' :
           overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
        </span>
      </div>

      {/* Metadata grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px 16px',
        marginBottom: 12,
      }}>
        <div>
          <div style={LABEL}>Playbook</div>
          <div style={{ ...MONO, fontSize: 11, wordBreak: 'break-all' as const }}>
            {playbookRef}
          </div>
        </div>
        <div>
          <div style={LABEL}>Started</div>
          <div style={{ ...MONO, fontSize: 11 }}>
            {startedAt.replace('T', ' ').replace('Z', '')}
          </div>
        </div>
        <div>
          <div style={LABEL}>Progress</div>
          <div style={{ ...MONO, fontSize: 11 }}>
            {completedCount}/{totalCount}
          </div>
        </div>
        <div>
          <div style={LABEL}>Elapsed</div>
          <div style={{ ...MONO, fontSize: 11 }}>
            {formatDuration(elapsedMs)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        ...MONO,
        fontSize: 11,
        letterSpacing: '0.05em',
        color: tok.textSecondary,
      }}>
        {progressBar(completedCount, totalCount)}
        {'  '}
        {completedCount}/{totalCount} steps
      </div>
    </div>
  );
}

/* ── PlaybookStepRow ────────────────────────────────────────── */

interface PlaybookStepRowProps {
  step: PlaybookStep;
  index: number;
  expanded?: boolean;
}

function PlaybookStepRow({ step, index, expanded = false }: PlaybookStepRowProps) {
  const isRunning = step.status === 'running';
  const isFailed = step.status === 'failed';
  const isExpanded = expanded || isRunning || isFailed;

  return (
    <div style={{
      padding: '10px 12px',
      borderBottom: `1px solid ${tok.borderSubtle}`,
      background: isExpanded ? tok.layer01 : 'transparent',
      borderLeft: isRunning
        ? `3px solid ${tok.textPrimary}`
        : isFailed
        ? `3px solid ${tok.textSecondary}`
        : '3px solid transparent',
    }}>
      {/* Main row: glyph + label + duration + rc */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{
          ...MONO,
          fontSize: 14,
          width: 18,
          textAlign: 'center',
          flexShrink: 0,
        }}>
          {statusGlyphFor(step.status)}
        </span>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          flex: 1,
          color: step.status === 'pending' || step.status === 'skipped'
            ? tok.textPlaceholder
            : tok.textPrimary,
        }}>
          Step {index + 1}: {stepStatusLabel(step.status)}
        </span>
        {step.durationMs != null && (
          <span style={{
            ...MONO,
            fontSize: 11,
            color: tok.textPlaceholder,
          }}>
            {formatDuration(step.durationMs)}
          </span>
        )}
        {step.returnCode != null && (
          <span style={{
            ...BADGE,
            fontSize: 10,
            background: step.returnCode === 0 ? tok.layer02 : tok.layer02,
            border: `1px solid ${tok.borderSubtle}`,
          }}>
            RC={step.returnCode}
          </span>
        )}
      </div>

      {/* Command line */}
      <div style={{
        ...MONO,
        fontSize: 11,
        color: tok.textSecondary,
        marginTop: 4,
        paddingLeft: 26,
        wordBreak: 'break-all' as const,
      }}>
        $ {step.command}
      </div>

      {/* Target workspace */}
      <div style={{
        fontSize: 11,
        color: tok.textPlaceholder,
        marginTop: 2,
        paddingLeft: 26,
      }}>
        Target: {step.target}
      </div>

      {/* Expanded output block (running or failed steps) */}
      {isExpanded && step.output && (
        <div style={{
          ...MONO,
          fontSize: 11,
          marginTop: 8,
          marginLeft: 26,
          padding: '8px 10px',
          background: tok.bg,
          borderRadius: 3,
          border: `1px solid ${tok.borderSubtle}`,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap' as const,
          wordBreak: 'break-word' as const,
          color: isFailed ? tok.textPrimary : tok.textSecondary,
        }}>
          {step.output}
        </div>
      )}

      {/* Running indicator */}
      {isRunning && (
        <div style={{
          marginTop: 6,
          paddingLeft: 26,
          fontSize: 11,
          color: tok.textPlaceholder,
        }}>
          {statusGlyph.running} Executing...
        </div>
      )}
    </div>
  );
}

/* ── ProgressBar (standalone) ───────────────────────────────── */

interface ProgressBarProps {
  completed: number;
  total: number;
}

function ProgressBarInline({ completed, total }: ProgressBarProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      background: tok.layer01,
      borderBottom: `1px solid ${tok.borderSubtle}`,
    }}>
      <span style={{ ...MONO, fontSize: 11, fontWeight: 600 }}>
        {completed}/{total}
      </span>
      <span style={{
        ...MONO,
        fontSize: 10,
        letterSpacing: '0.05em',
        color: tok.textSecondary,
        flex: 1,
      }}>
        {progressBar(completed, total, 24)}
      </span>
      <span style={{ fontSize: 11, color: tok.textPlaceholder }}>
        {completed === total ? 'All steps complete' : `Step ${completed + 1} of ${total}`}
      </span>
    </div>
  );
}

/* ── RollbackBanner ─────────────────────────────────────────── */

interface RollbackBannerProps {
  failedStep: string;
  rollbackCommand?: string;
}

function RollbackBanner({ failedStep, rollbackCommand }: RollbackBannerProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '10px 14px',
      background: tok.layer02,
      border: `1px solid ${tok.borderSubtle}`,
      borderRadius: 4,
      margin: '0 12px 12px',
    }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
        {'\u26A0'}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
          Execution Failed - Rollback Available
        </div>
        <div style={{ fontSize: 11, color: tok.textSecondary, marginBottom: 6, lineHeight: 1.4 }}>
          Step "{failedStep}" returned a non-zero exit code. Downstream steps have been
          skipped. Review the error output before deciding to rollback or escalate.
        </div>
        {rollbackCommand && (
          <div style={{
            ...MONO,
            fontSize: 11,
            padding: '6px 8px',
            background: tok.bg,
            borderRadius: 3,
            border: `1px solid ${tok.borderSubtle}`,
            marginBottom: 8,
          }}>
            Rollback: $ {rollbackCommand}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            padding: '5px 12px',
            fontSize: 11,
            fontWeight: 600,
            background: tok.layer01,
            border: `1px solid ${tok.borderSubtle}`,
            borderRadius: 4,
            color: tok.textPrimary,
            cursor: 'default',
          }}>
            Initiate Rollback
          </button>
          <button style={{
            padding: '5px 12px',
            fontSize: 11,
            fontWeight: 600,
            background: 'transparent',
            border: `1px solid ${tok.borderSubtle}`,
            borderRadius: 4,
            color: tok.textSecondary,
            cursor: 'default',
          }}>
            Escalate
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── EventLog ───────────────────────────────────────────────── */

interface EventLogProps {
  events: ExecutionEvent[];
}

function EventLog({ events }: EventLogProps) {
  function eventTypeTag(eventType: ExecutionEvent['eventType']): string {
    const tags: Record<string, string> = {
      'step-start': 'START',
      'step-complete': ' DONE',
      'step-failed': ' FAIL',
      'rollback-start': 'RBACK',
      'rollback-complete': 'RBACK',
      'output-line': '  OUT',
    };
    return tags[eventType] || '  ???';
  }

  function formatTimestamp(ts: string): string {
    return ts.replace(/.*T/, '').replace('Z', '');
  }

  return (
    <div style={{
      ...MONO,
      fontSize: 11,
      lineHeight: 1.7,
      padding: '10px 12px',
      background: tok.bg,
      border: `1px solid ${tok.borderSubtle}`,
      borderRadius: 4,
      margin: '0 12px 12px',
      overflowY: 'auto',
      maxHeight: 320,
      whiteSpace: 'pre' as const,
    }}>
      {events.map((evt, idx) => {
        const ts = formatTimestamp(evt.timestamp);
        const tag = eventTypeTag(evt.eventType);
        const rc = evt.returnCode != null ? ` [RC=${evt.returnCode}]` : '';
        return (
          <div key={idx} style={{
            color: evt.eventType === 'step-failed'
              ? tok.textPrimary
              : evt.eventType === 'output-line'
              ? tok.textPlaceholder
              : tok.textSecondary,
          }}>
            {ts} [{tag}] {evt.stepId} {evt.payload}{rc}
          </div>
        );
      })}
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
          Ask the agent about this execution...
        </div>
      </div>
    </div>
  );
}

/* ── StatusBar ──────────────────────────────────────────────── */

function StatusBar({ text }: { text: string }) {
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
 * Story 1: ExecutionRunning
 * Step 1 done, step 2 running (expanded with live output), step 3 pending.
 * Progress bar shows "1/3".
 */
export function ExecutionRunningWireframe() {
  const runningSteps = overrideStatuses(executionSteps, {
    'REM-001-02': 'running',
    'REM-001-03': 'pending',
  });

  const completedCount = runningSteps.filter((s) => s.status === 'done').length;

  const runningChat: ChatMessage[] = [
    executeChat[0],
    executeChat[1],
  ];

  return (
    <div style={SHELL}>
      <NavBar activeTab="Runbooks" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        {/* Left: Execution Summary */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Execution Summary</span>
            <span style={{ ...BADGE, fontSize: 10 }}>
              {statusGlyph.running} Running
            </span>
          </div>
          <div style={{ ...PANEL_BODY, padding: 12 }}>
            <ExecutionSummaryCard
              playbookRef={remediationPlan.playbookRef}
              startedAt="2026-02-20T14:35:00Z"
              completedCount={completedCount}
              totalCount={runningSteps.length}
              elapsedMs={20000}
              overallStatus="running"
            />

            {/* Incident context */}
            <div style={{
              padding: '12px 14px',
              background: tok.layer01,
              borderRadius: 4,
              border: `1px solid ${tok.borderSubtle}`,
              marginBottom: 16,
            }}>
              <div style={{ ...LABEL, marginBottom: 6 }}>Incident Context</div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px 16px',
              }}>
                <div>
                  <div style={{ ...LABEL, fontSize: 10 }}>Incident</div>
                  <div style={{ ...MONO, fontSize: 11 }}>{mockAlert.alertId}</div>
                </div>
                <div>
                  <div style={{ ...LABEL, fontSize: 10 }}>Workspace</div>
                  <div style={{ ...MONO, fontSize: 11 }}>{mockAlert.workspace}</div>
                </div>
                <div>
                  <div style={{ ...LABEL, fontSize: 10 }}>Root Cause</div>
                  <div style={{ fontSize: 11, color: tok.textSecondary }}>
                    Out-of-band change to security group
                  </div>
                </div>
                <div>
                  <div style={{ ...LABEL, fontSize: 10 }}>Approved By</div>
                  <div style={{ ...MONO, fontSize: 11 }}>ic-jpark</div>
                </div>
              </div>
            </div>

            {/* Rollback strategy note */}
            <div style={{
              padding: '8px 12px',
              background: tok.layer01,
              borderRadius: 4,
              border: `1px solid ${tok.borderSubtle}`,
              fontSize: 11,
              color: tok.textSecondary,
              lineHeight: 1.4,
            }}>
              <span style={{ fontWeight: 600 }}>Rollback strategy:</span>{' '}
              {remediationPlan.rollbackStrategy}. Each step can be independently reverted.
            </div>
          </div>
        </div>

        {/* Center: Step Detail */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Step Detail</span>
          </div>
          <ProgressBarInline completed={completedCount} total={runningSteps.length} />
          <div style={PANEL_BODY}>
            {runningSteps.map((step, idx) => (
              <PlaybookStepRow
                key={step.stepId}
                step={step}
                index={idx}
              />
            ))}
          </div>
        </div>

        {/* Right: Chat */}
        <ChatPanel messages={runningChat} />
      </div>
      <StatusBar text="Stage 7: Playbook Execution - Step 2 of 3 running: terraform plan -target=aws_security_group.main" />
    </div>
  );
}

/**
 * Story 2: ExecutionComplete
 * All 3 steps done. Total elapsed: 40s. [Run Verification] button visible.
 */
export function ExecutionCompleteWireframe() {
  const allDoneSteps = executionSteps; // already all "done" in fixture

  const totalMs = allDoneSteps.reduce((sum, s) => sum + (s.durationMs || 0), 0);

  return (
    <div style={SHELL}>
      <NavBar activeTab="Runbooks" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        {/* Left: Execution Summary */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Execution Summary</span>
            <span style={{ ...BADGE, fontSize: 10 }}>
              {statusGlyph.pass} Complete
            </span>
          </div>
          <div style={{ ...PANEL_BODY, padding: 12 }}>
            <ExecutionSummaryCard
              playbookRef={remediationPlan.playbookRef}
              startedAt="2026-02-20T14:35:00Z"
              completedCount={allDoneSteps.length}
              totalCount={allDoneSteps.length}
              elapsedMs={totalMs}
              overallStatus="completed"
            />

            {/* Results summary */}
            <div style={{
              padding: '14px 16px',
              background: tok.layer01,
              borderRadius: 4,
              border: `1px solid ${tok.borderSubtle}`,
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
                Execution Results
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px 16px',
              }}>
                <div>
                  <div style={LABEL}>Steps</div>
                  <div style={{ ...MONO, fontSize: 11 }}>
                    {allDoneSteps.length}/{allDoneSteps.length} passed
                  </div>
                </div>
                <div>
                  <div style={LABEL}>Total Duration</div>
                  <div style={{ ...MONO, fontSize: 11 }}>
                    {formatDuration(totalMs)}
                  </div>
                </div>
                <div>
                  <div style={LABEL}>Failures</div>
                  <div style={{ ...MONO, fontSize: 11 }}>0</div>
                </div>
                <div>
                  <div style={LABEL}>Rollbacks</div>
                  <div style={{ ...MONO, fontSize: 11 }}>0</div>
                </div>
              </div>
            </div>

            {/* Run Verification button */}
            <button style={{
              width: '100%',
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              background: tok.layer02,
              border: `1px solid ${tok.borderSubtle}`,
              borderRadius: 4,
              color: tok.textPrimary,
              cursor: 'default',
              textAlign: 'center',
            }}>
              Run Verification
            </button>
          </div>
        </div>

        {/* Center: Step Detail */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Step Detail</span>
          </div>
          <ProgressBarInline
            completed={allDoneSteps.length}
            total={allDoneSteps.length}
          />
          <div style={PANEL_BODY}>
            {allDoneSteps.map((step, idx) => (
              <PlaybookStepRow
                key={step.stepId}
                step={step}
                index={idx}
              />
            ))}

            {/* Completion summary row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '16px 12px',
              background: tok.layer01,
              borderBottom: `1px solid ${tok.borderSubtle}`,
            }}>
              <span style={{ fontSize: 16 }}>{statusGlyph.pass}</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>
                Playbook execution complete
              </span>
              <span style={{ ...MONO, fontSize: 11, color: tok.textPlaceholder }}>
                {formatDuration(totalMs)} total
              </span>
            </div>
          </div>
        </div>

        {/* Right: Chat */}
        <ChatPanel messages={executeChat} />
      </div>
      <StatusBar text="Stage 7: Playbook Execution - All 3 steps complete. Ready for verification." />
    </div>
  );
}

/**
 * Story 3: ExecutionFailed
 * Step 1 done, step 2 failed (InvalidGroup.NotFound), step 3 skipped.
 * RollbackBanner visible in the step detail panel.
 */
export function ExecutionFailedWireframe() {
  const failedSteps = overrideStatuses(executionSteps, {
    'REM-001-02': 'failed',
    'REM-001-03': 'skipped',
  });

  const completedCount = failedSteps.filter((s) => s.status === 'done').length;

  const failedChat: ChatMessage[] = [
    executeChat[0],
    executeChat[1],
    {
      sender: 'agent',
      text: 'Step 2 failed: terraform plan returned RC=1. Error: Provider error: InvalidGroup.NotFound. The security group sg-0a1b2c3d does not exist in the specified VPC. Step 3 has been skipped.',
      timestamp: '14:35:21',
    },
    {
      sender: 'agent',
      text: 'Rollback is available for step 1 (state refresh). Recommend verifying the security group still exists before retrying. This may indicate a concurrent deletion.',
      timestamp: '14:35:22',
    },
    {
      sender: 'user',
      text: 'Check if the security group was deleted by another process.',
      timestamp: '14:35:30',
    },
    {
      sender: 'agent',
      text: 'Querying AWS API for sg-0a1b2c3d... Security group not found in VPC vpc-0x1y2z3w. Likely deleted by a concurrent Terraform run or manual AWS action. Recommend escalating to infrastructure architect.',
      timestamp: '14:35:35',
    },
  ];

  return (
    <div style={SHELL}>
      <NavBar activeTab="Runbooks" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        {/* Left: Execution Summary */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Execution Summary</span>
            <span style={{ ...BADGE, fontSize: 10 }}>
              {statusGlyph.fail} Failed
            </span>
          </div>
          <div style={{ ...PANEL_BODY, padding: 12 }}>
            <ExecutionSummaryCard
              playbookRef={remediationPlan.playbookRef}
              startedAt="2026-02-20T14:35:00Z"
              completedCount={completedCount}
              totalCount={failedSteps.length}
              elapsedMs={21000}
              overallStatus="failed"
            />

            {/* Failure details */}
            <div style={{
              padding: '14px 16px',
              background: tok.layer01,
              borderRadius: 4,
              border: `1px solid ${tok.borderSubtle}`,
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
                Failure Summary
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px 16px',
              }}>
                <div>
                  <div style={LABEL}>Failed At</div>
                  <div style={{ ...MONO, fontSize: 11 }}>Step 2 of 3</div>
                </div>
                <div>
                  <div style={LABEL}>Return Code</div>
                  <div style={{ ...MONO, fontSize: 11 }}>1</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={LABEL}>Error</div>
                  <div style={{ fontSize: 11, color: tok.textSecondary, lineHeight: 1.4 }}>
                    Provider error: InvalidGroup.NotFound
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 600,
                background: tok.layer02,
                border: `1px solid ${tok.borderSubtle}`,
                borderRadius: 4,
                color: tok.textPrimary,
                cursor: 'default',
                textAlign: 'center',
              }}>
                Retry Step 2
              </button>
              <button style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 600,
                background: 'transparent',
                border: `1px solid ${tok.borderSubtle}`,
                borderRadius: 4,
                color: tok.textSecondary,
                cursor: 'default',
                textAlign: 'center',
              }}>
                Escalate
              </button>
            </div>
          </div>
        </div>

        {/* Center: Step Detail */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Step Detail</span>
          </div>
          <ProgressBarInline completed={completedCount} total={failedSteps.length} />

          {/* Rollback banner */}
          <div style={{ paddingTop: 12 }}>
            <RollbackBanner
              failedStep="terraform plan -target=aws_security_group.main"
              rollbackCommand="terraform state push terraform.tfstate.backup"
            />
          </div>

          <div style={PANEL_BODY}>
            {failedSteps.map((step, idx) => (
              <PlaybookStepRow
                key={step.stepId}
                step={step}
                index={idx}
              />
            ))}
          </div>
        </div>

        {/* Right: Chat */}
        <ChatPanel messages={failedChat} />
      </div>
      <StatusBar text="Stage 7: Playbook Execution - FAILED at step 2. Rollback available. Awaiting operator decision." />
    </div>
  );
}

/**
 * Story 4: ExecutionWithEvents
 * Compact step list at top + monospace scrollable event log below.
 * Shows the full execution event stream for monitoring.
 */
export function ExecutionWithEventsWireframe() {
  const allDoneSteps = executionSteps;
  const totalMs = allDoneSteps.reduce((sum, s) => sum + (s.durationMs || 0), 0);

  return (
    <div style={SHELL}>
      <NavBar activeTab="Runbooks" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        {/* Left: Execution Summary */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Execution Summary</span>
            <span style={{ ...BADGE, fontSize: 10 }}>
              {statusGlyph.pass} Complete
            </span>
          </div>
          <div style={{ ...PANEL_BODY, padding: 12 }}>
            <ExecutionSummaryCard
              playbookRef={remediationPlan.playbookRef}
              startedAt="2026-02-20T14:35:00Z"
              completedCount={allDoneSteps.length}
              totalCount={allDoneSteps.length}
              elapsedMs={totalMs}
              overallStatus="completed"
            />

            {/* Compact step list */}
            <div style={{
              padding: '12px 14px',
              background: tok.layer01,
              borderRadius: 4,
              border: `1px solid ${tok.borderSubtle}`,
            }}>
              <div style={{ ...LABEL, marginBottom: 8 }}>Steps</div>
              {allDoneSteps.map((step, idx) => (
                <div
                  key={step.stepId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '4px 0',
                    borderBottom: idx < allDoneSteps.length - 1
                      ? `1px solid ${tok.borderSubtle}`
                      : 'none',
                  }}
                >
                  <span style={{ ...MONO, fontSize: 12 }}>
                    {statusGlyphFor(step.status)}
                  </span>
                  <span style={{ fontSize: 11, flex: 1, color: tok.textSecondary }}>
                    Step {idx + 1}
                  </span>
                  <span style={{ ...MONO, fontSize: 10, color: tok.textPlaceholder }}>
                    {step.durationMs != null ? formatDuration(step.durationMs) : '-'}
                  </span>
                  <span style={{
                    ...BADGE,
                    fontSize: 9,
                    padding: '0px 4px',
                  }}>
                    RC={step.returnCode ?? '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Event Log */}
        <div style={PANEL}>
          <div style={PANEL_HEADER}>
            <span>Execution Events</span>
            <span style={{ ...BADGE, fontSize: 10 }}>
              {executionEvents.length} events
            </span>
          </div>
          <div style={{
            ...PANEL_BODY,
            padding: '12px 0',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Legend */}
            <div style={{
              display: 'flex',
              gap: 12,
              padding: '0 12px 10px',
              fontSize: 10,
              color: tok.textPlaceholder,
              borderBottom: `1px solid ${tok.borderSubtle}`,
              marginBottom: 0,
            }}>
              <span>[START] Step began</span>
              <span>[ DONE] Step completed</span>
              <span>[ FAIL] Step failed</span>
              <span>[  OUT] Command output</span>
            </div>

            {/* Scrollable event log */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <EventLog events={executionEvents} />
            </div>

            {/* Summary footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderTop: `1px solid ${tok.borderSubtle}`,
              fontSize: 11,
              color: tok.textPlaceholder,
              flexShrink: 0,
            }}>
              <span>
                {executionEvents.filter((e) => e.eventType === 'step-complete').length} steps completed
              </span>
              <span style={MONO}>
                {formatDuration(totalMs)} total
              </span>
            </div>
          </div>
        </div>

        {/* Right: Chat */}
        <ChatPanel messages={executeChat} />
      </div>
      <StatusBar text="Stage 8: Execution Monitoring - 9 events captured across 3 steps. Execution complete." />
    </div>
  );
}

/* ================================================================
 * STORYBOOK META & STORIES (CSF3)
 * ================================================================ */

const meta: Meta = {
  title: 'Wireframes/Incident/ExecuteMonitor',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const ExecutionRunning: Story = {
  render: () => <ExecutionRunningWireframe />,
};

export const ExecutionComplete: Story = {
  render: () => <ExecutionCompleteWireframe />,
};

export const ExecutionFailed: Story = {
  render: () => <ExecutionFailedWireframe />,
};

export const ExecutionWithEvents: Story = {
  render: () => <ExecutionWithEventsWireframe />,
};
