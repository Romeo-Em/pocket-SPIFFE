/**
 * IncidentAlert.stories.tsx
 *
 * Journey Stages 1-2: Alert Trigger and Signal Correlation
 * HCP Terraform Remediation Agent - Incident Response Dashboard
 *
 * 3-column layout: Alert List (25%) | Signal Detail (45%) | Agent Chat (30%)
 *
 * Stories:
 *   AlertIncoming       - single alert, no correlation yet, scanning placeholder
 *   CorrelationComplete - 3 signals correlated, score 0.93, full chat
 *   MultipleAlerts      - all 3 triage items, INC-0847 selected
 */

import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  wireframeTok,
  statusGlyphFor,
  incidentNavTabs,
  statusGlyph,
  mockAlert,
  correlatedSignals,
  triageItems,
  alertChat,
} from './_incident-fixtures';
import type {
  AlertEvent,
  CorrelatedSignal,
  TriageItem,
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

function severityGlyph(sev: string): string {
  return statusGlyphFor(sev);
}

function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function confidenceBar(score: number, width: number = 20): string {
  const filled = Math.round(score * width);
  const empty = width - filled;
  return '\u2588'.repeat(filled) + '\u2591'.repeat(empty);
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + '\u2026' : text;
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

/* ── AlertListPanel ─────────────────────────────────────────── */

interface AlertListPanelProps {
  items: TriageItem[];
  selectedId: string;
}

function AlertListPanel({ items, selectedId }: AlertListPanelProps) {
  return (
    <div style={PANEL}>
      <div style={PANEL_HEADER}>
        <span>Alerts</span>
        <span style={{ ...BADGE, fontSize: 10 }}>{items.length}</span>
      </div>
      <div style={PANEL_BODY}>
        {items.map((item) => {
          const isSelected = item.incidentId === selectedId;
          return (
            <div
              key={item.incidentId}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                padding: '10px 12px',
                borderBottom: `1px solid ${tok.borderSubtle}`,
                background: isSelected ? tok.layer01 : 'transparent',
                borderLeft: isSelected
                  ? `3px solid ${tok.textPrimary}`
                  : '3px solid transparent',
                cursor: 'default',
              }}
            >
              {/* Row 1: severity glyph + incident ID + elapsed */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <span style={{ ...MONO, fontSize: 14, width: 16, textAlign: 'center' }}>
                  {severityGlyph(item.severity)}
                </span>
                <span style={{ ...MONO, fontWeight: 600, fontSize: 12 }}>
                  {item.incidentId}
                </span>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 11, color: tok.textPlaceholder }}>
                  {formatElapsed(item.elapsedSec)}
                </span>
              </div>
              {/* Row 2: title (truncated) */}
              <div style={{
                fontSize: 12,
                color: isSelected ? tok.textPrimary : tok.textSecondary,
                paddingLeft: 22,
              }}>
                {truncate(item.title, 42)}
              </div>
              {/* Row 3: signal count + workspace badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                paddingLeft: 22,
              }}>
                <span style={{ ...BADGE, fontSize: 10 }}>
                  {item.signalCount} signal{item.signalCount !== 1 ? 's' : ''}
                </span>
                <span style={{
                  fontSize: 10,
                  color: tok.textPlaceholder,
                  ...MONO,
                }}>
                  {item.workspace}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── SignalDetailPanel ──────────────────────────────────────── */

interface SignalDetailPanelProps {
  alert: AlertEvent;
  signals: CorrelatedSignal[] | null; // null = still scanning
  correlationScore: number | null;
}

function SignalDetailPanel({ alert, signals, correlationScore }: SignalDetailPanelProps) {
  return (
    <div style={PANEL}>
      <div style={PANEL_HEADER}>
        <span>Signal Detail</span>
        <span style={{ ...BADGE, fontSize: 10 }}>
          {alert.alertId}
        </span>
      </div>
      <div style={{ ...PANEL_BODY, padding: 16 }}>
        {/* Raw message */}
        <div style={{ marginBottom: 16 }}>
          <div style={LABEL}>Raw Message</div>
          <div style={{
            ...MONO,
            padding: '10px 12px',
            background: tok.layer01,
            borderRadius: 4,
            border: `1px solid ${tok.borderSubtle}`,
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap' as const,
            wordBreak: 'break-word' as const,
          }}>
            {alert.rawMessage}
          </div>
        </div>

        {/* Metadata grid: 2 columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px 24px',
          marginBottom: 20,
        }}>
          <MetaField label="Source" value={alert.source} />
          <MetaField label="Severity" value={`${severityGlyph(alert.severity)} ${alert.severity}`} />
          <MetaField label="Workspace" value={alert.workspace} mono />
          <MetaField label="Project" value={alert.project} mono />
          <MetaField label="Run ID" value={alert.correlationKey.slice(0, 24)} mono />
          <MetaField label="Timestamp" value={alert.timestamp} mono />
        </div>

        {/* Correlated signals section */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            ...LABEL,
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>Correlated Signals</span>
            {signals !== null && (
              <span style={BADGE}>
                {signals.length} found
              </span>
            )}
          </div>

          {signals === null ? (
            <ScanningPlaceholder />
          ) : (
            <>
              {/* Correlation card */}
              {correlationScore !== null && (
                <CorrelationCard
                  score={correlationScore}
                  signalCount={signals.length}
                  timeWindowMs={8000}
                  summary="Drift detected on aws_security_group.main - ingress rules modified via AWS console by ops-jpark"
                />
              )}
              {/* Signals table */}
              <SignalTable signals={signals} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── MetaField ──────────────────────────────────────────────── */

interface MetaFieldProps {
  label: string;
  value: string;
  mono?: boolean;
}

function MetaField({ label, value, mono }: MetaFieldProps) {
  return (
    <div>
      <div style={LABEL}>{label}</div>
      <div style={{
        fontSize: 13,
        ...(mono ? MONO : {}),
      }}>
        {value}
      </div>
    </div>
  );
}

/* ── ScanningPlaceholder ────────────────────────────────────── */

function ScanningPlaceholder() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      background: tok.layer01,
      borderRadius: 4,
      border: `1px dashed ${tok.borderSubtle}`,
    }}>
      <div style={{
        fontSize: 20,
        marginBottom: 8,
        color: tok.textSecondary,
      }}>
        {statusGlyph.running}
      </div>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: tok.textSecondary,
        marginBottom: 4,
      }}>
        Scanning...
      </div>
      <div style={{
        fontSize: 11,
        color: tok.textPlaceholder,
        textAlign: 'center',
      }}>
        Correlating signals across TFC run logs, drift detection, and audit events
      </div>
    </div>
  );
}

/* ── CorrelationCard ────────────────────────────────────────── */

interface CorrelationCardProps {
  score: number;
  signalCount: number;
  timeWindowMs: number;
  summary: string;
}

function CorrelationCard({ score, signalCount, timeWindowMs, summary }: CorrelationCardProps) {
  const windowSec = Math.round(timeWindowMs / 1000);
  return (
    <div style={{
      padding: '12px 14px',
      background: tok.layer01,
      borderRadius: 4,
      border: `1px solid ${tok.borderSubtle}`,
      marginBottom: 12,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>
          Correlation Score
        </span>
        <span style={{ ...MONO, fontSize: 12, fontWeight: 700 }}>
          {score.toFixed(2)}
        </span>
      </div>
      {/* Score bar */}
      <div style={{
        ...MONO,
        fontSize: 11,
        letterSpacing: '0.05em',
        marginBottom: 8,
        color: tok.textSecondary,
      }}>
        {confidenceBar(score)}
      </div>
      {/* Metadata row */}
      <div style={{
        display: 'flex',
        gap: 16,
        fontSize: 11,
        color: tok.textPlaceholder,
        marginBottom: 8,
      }}>
        <span>{signalCount} signals</span>
        <span>{windowSec}s window</span>
      </div>
      {/* Summary */}
      <div style={{
        fontSize: 12,
        color: tok.textSecondary,
        lineHeight: 1.4,
      }}>
        {summary}
      </div>
    </div>
  );
}

/* ── SignalTable ─────────────────────────────────────────────── */

interface SignalTableProps {
  signals: CorrelatedSignal[];
}

function SignalTable({ signals }: SignalTableProps) {
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
    padding: '8px 8px',
    fontSize: 12,
    borderBottom: `1px solid ${tok.borderSubtle}`,
    verticalAlign: 'top',
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
          <th style={TH}>ID</th>
          <th style={TH}>Source</th>
          <th style={TH}>Relationship</th>
          <th style={TH}>Confidence</th>
          <th style={TH}>Message</th>
        </tr>
      </thead>
      <tbody>
        {signals.map((sig) => (
          <tr key={sig.signalId}>
            <td style={{ ...TD, ...MONO, fontSize: 11, whiteSpace: 'nowrap' }}>
              {sig.signalId}
            </td>
            <td style={{ ...TD, ...MONO, fontSize: 11 }}>
              {sig.source}
            </td>
            <td style={TD}>
              <span style={{
                ...BADGE,
                fontSize: 10,
                textTransform: 'capitalize',
              }}>
                {sig.relationship}
              </span>
            </td>
            <td style={{ ...TD, ...MONO, fontSize: 11, textAlign: 'right' }}>
              {(sig.confidence * 100).toFixed(0)}%
            </td>
            <td style={{
              ...TD,
              fontSize: 11,
              color: tok.textSecondary,
              maxWidth: 220,
            }}>
              {truncate(sig.rawMessage, 64)}
            </td>
          </tr>
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
 * Story 1: AlertIncoming
 * Single alert (INC-0847), no correlation yet, "Scanning..." placeholder,
 * first chat message only.
 */
export function AlertIncomingWireframe() {
  const singleItem: TriageItem[] = [
    {
      incidentId: mockAlert.alertId,
      correlationKey: mockAlert.correlationKey,
      title: 'Apply failure on aws_security_group.main',
      severity: mockAlert.severity,
      signalCount: 0,
      topSignalSources: [mockAlert.source],
      status: 'detected',
      workspace: mockAlert.workspace,
      projects: [mockAlert.project],
      elapsedSec: 3,
      lastUpdate: mockAlert.timestamp,
    },
  ];

  return (
    <div style={SHELL}>
      <NavBar activeTab="Workspaces" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        <AlertListPanel items={singleItem} selectedId={mockAlert.alertId} />
        <SignalDetailPanel
          alert={mockAlert}
          signals={null}
          correlationScore={null}
        />
        <ChatPanel messages={[alertChat[0]]} />
      </div>
      <StatusBar text="Stage 1: Alert Trigger - Incoming alert detected, scanning for correlated signals..." />
    </div>
  );
}

/**
 * Story 2: CorrelationComplete
 * 3 signals in table, correlation card (score 0.93), full alertChat.
 */
export function CorrelationCompleteWireframe() {
  const correlatedItem: TriageItem[] = [
    {
      incidentId: mockAlert.alertId,
      correlationKey: mockAlert.correlationKey,
      title: 'Apply failure on aws_security_group.main',
      severity: mockAlert.severity,
      signalCount: correlatedSignals.length,
      topSignalSources: correlatedSignals.map((s) => s.source),
      assignedTo: 'op-mchen',
      status: 'correlating',
      workspace: mockAlert.workspace,
      projects: [mockAlert.project],
      elapsedSec: 9,
      lastUpdate: '2026-02-20T14:32:16Z',
    },
  ];

  return (
    <div style={SHELL}>
      <NavBar activeTab="Workspaces" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        <AlertListPanel items={correlatedItem} selectedId={mockAlert.alertId} />
        <SignalDetailPanel
          alert={mockAlert}
          signals={correlatedSignals}
          correlationScore={0.93}
        />
        <ChatPanel messages={alertChat} />
      </div>
      <StatusBar text="Stage 2: Signal Correlation - 3 signals correlated (score 0.93), ready for triage" />
    </div>
  );
}

/**
 * Story 3: MultipleAlerts
 * All 3 triageItems in the alert list, INC-0847 selected.
 */
export function MultipleAlertsWireframe() {
  return (
    <div style={SHELL}>
      <NavBar activeTab="Workspaces" incidentId={mockAlert.alertId} />
      <div style={MAIN}>
        <AlertListPanel items={triageItems} selectedId="INC-2026-0847" />
        <SignalDetailPanel
          alert={mockAlert}
          signals={correlatedSignals}
          correlationScore={0.93}
        />
        <ChatPanel messages={alertChat} />
      </div>
      <StatusBar text="3 incidents tracked - 1 critical, 1 medium, 1 resolved" />
    </div>
  );
}

/* ================================================================
 * STORYBOOK META & STORIES (CSF3)
 * ================================================================ */

const meta: Meta = {
  title: 'Wireframes/Incident/AlertCorrelation',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const AlertIncoming: Story = {
  render: () => <AlertIncomingWireframe />,
};

export const CorrelationComplete: Story = {
  render: () => <CorrelationCompleteWireframe />,
};

export const MultipleAlerts: Story = {
  render: () => <MultipleAlertsWireframe />,
};
