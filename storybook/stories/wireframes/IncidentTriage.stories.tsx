/**
 * IncidentTriage.stories.tsx
 *
 * Journey Stage 3: Triage View
 * HCP Terraform Remediation Agent - Incident Response Dashboard
 *
 * Layouts:
 *   TriageList     - 2-column (70% table | 30% chat)
 *   TriageSelected - 3-column (30% compact list | 40% detail | 30% chat)
 *   TriageAssigned - 3-column with assignment badge + [Analyze] + agent confirmation
 *
 * Stories:
 *   TriageList      - full-width incident table, no detail panel
 *   TriageSelected  - INC-0847 selected, detail panel visible
 *   TriageAssigned  - assignment badge, [Analyze] button, agent chat confirmation
 */

import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  wireframeTok,
  statusGlyphFor,
  incidentNavTabs,
  statusGlyph,
  triageItems,
  triageChat,
  correlatedSignals,
  mockAlert,
} from './_incident-fixtures';
import type {
  TriageItem,
  CorrelatedSignal,
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

const MAIN_2COL: CSSProperties = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '70% 30%',
  overflow: 'hidden',
};

const MAIN_3COL: CSSProperties = {
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

function severityGlyph(sev: string): string {
  return statusGlyphFor(sev);
}

function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + '\u2026' : text;
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    detected: 'Detected',
    correlating: 'Correlating',
    triaging: 'Triaging',
    analyzing: 'Analyzing',
    remediation_suggested: 'Suggested',
    pending_approval: 'Pending',
    approved: 'Approved',
    executing: 'Executing',
    verifying: 'Verifying',
    resolved: 'Resolved',
    escalated: 'Escalated',
    failed: 'Failed',
  };
  return map[status] || status;
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

/* ── IncidentTable (full-width for 2-col layout) ────────────── */

interface IncidentTableProps {
  items: TriageItem[];
  selectedId?: string;
}

function IncidentTable({ items, selectedId }: IncidentTableProps) {
  const TH: CSSProperties = {
    textAlign: 'left',
    padding: '8px 10px',
    fontSize: 11,
    fontWeight: 600,
    color: tok.textPlaceholder,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: `1px solid ${tok.borderSubtle}`,
    background: tok.layer01,
    whiteSpace: 'nowrap',
  };
  const TD: CSSProperties = {
    padding: '10px 10px',
    fontSize: 12,
    borderBottom: `1px solid ${tok.borderSubtle}`,
    verticalAlign: 'middle',
  };

  return (
    <div style={PANEL}>
      <div style={PANEL_HEADER}>
        <span>Incidents</span>
        <span style={{ ...BADGE, fontSize: 10 }}>{items.length} total</span>
      </div>
      <div style={PANEL_BODY}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}>
          <thead>
            <tr>
              <th style={{ ...TH, width: 28, textAlign: 'center' }}></th>
              <th style={TH}>ID</th>
              <th style={TH}>Title</th>
              <th style={TH}>Workspace</th>
              <th style={{ ...TH, textAlign: 'center' }}>Signals</th>
              <th style={TH}>Status</th>
              <th style={{ ...TH, textAlign: 'right' }}>Elapsed</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isSelected = item.incidentId === selectedId;
              return (
                <tr
                  key={item.incidentId}
                  style={{
                    background: isSelected ? tok.layer01 : 'transparent',
                    cursor: 'default',
                  }}
                >
                  {/* Severity glyph */}
                  <td style={{
                    ...TD,
                    textAlign: 'center',
                    fontSize: 14,
                    width: 28,
                    ...MONO,
                  }}>
                    {severityGlyph(item.severity)}
                  </td>
                  {/* Incident ID */}
                  <td style={{
                    ...TD,
                    ...MONO,
                    fontSize: 11,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}>
                    {item.incidentId}
                  </td>
                  {/* Title */}
                  <td style={{
                    ...TD,
                    color: isSelected ? tok.textPrimary : tok.textSecondary,
                    maxWidth: 260,
                  }}>
                    {truncate(item.title, 48)}
                  </td>
                  {/* Workspace */}
                  <td style={{
                    ...TD,
                    ...MONO,
                    fontSize: 11,
                    color: tok.textSecondary,
                    whiteSpace: 'nowrap',
                  }}>
                    {item.workspace}
                  </td>
                  {/* Signal count */}
                  <td style={{
                    ...TD,
                    textAlign: 'center',
                    ...MONO,
                    fontSize: 11,
                  }}>
                    {item.signalCount}
                  </td>
                  {/* Status badge */}
                  <td style={TD}>
                    <span style={{
                      ...BADGE,
                      fontSize: 10,
                    }}>
                      {statusGlyphFor(item.status === 'resolved' ? 'pass' : item.status === 'failed' ? 'fail' : 'running')}{' '}
                      {statusLabel(item.status)}
                    </span>
                  </td>
                  {/* Elapsed */}
                  <td style={{
                    ...TD,
                    textAlign: 'right',
                    fontSize: 11,
                    color: tok.textPlaceholder,
                    whiteSpace: 'nowrap',
                  }}>
                    {formatElapsed(item.elapsedSec)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── CompactIncidentList (narrow, for 3-col layout) ─────────── */

interface CompactIncidentListProps {
  items: TriageItem[];
  selectedId: string;
}

function CompactIncidentList({ items, selectedId }: CompactIncidentListProps) {
  return (
    <div style={PANEL}>
      <div style={PANEL_HEADER}>
        <span>Incidents</span>
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
              {/* Row 1: severity glyph + ID + elapsed */}
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
              {/* Row 2: title */}
              <div style={{
                fontSize: 12,
                color: isSelected ? tok.textPrimary : tok.textSecondary,
                paddingLeft: 22,
              }}>
                {truncate(item.title, 36)}
              </div>
              {/* Row 3: workspace + status badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                paddingLeft: 22,
              }}>
                <span style={{
                  ...BADGE,
                  fontSize: 10,
                }}>
                  {statusLabel(item.status)}
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

/* ── IncidentDetailPanel ────────────────────────────────────── */

interface IncidentDetailPanelProps {
  item: TriageItem;
  signals: CorrelatedSignal[];
  showAnalyzeButton?: boolean;
}

function IncidentDetailPanel({ item, signals, showAnalyzeButton }: IncidentDetailPanelProps) {
  return (
    <div style={PANEL}>
      <div style={PANEL_HEADER}>
        <span>Detail</span>
        <span style={{ ...BADGE, fontSize: 10 }}>
          {item.incidentId}
        </span>
      </div>
      <div style={{ ...PANEL_BODY, padding: 16 }}>
        {/* Header: severity badge + status badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
        }}>
          <span style={{
            ...BADGE,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            {severityGlyph(item.severity)} {item.severity}
          </span>
          <span style={{
            ...BADGE,
          }}>
            {statusGlyphFor(item.status === 'resolved' ? 'pass' : 'running')}{' '}
            {statusLabel(item.status)}
          </span>
          {item.assignedTo && (
            <span style={{
              ...BADGE,
              background: tok.layer01,
              border: `1px solid ${tok.borderSubtle}`,
            }}>
              {item.assignedTo}
            </span>
          )}
        </div>

        {/* Title */}
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 16,
          lineHeight: 1.4,
        }}>
          {item.title}
        </div>

        {/* Metadata grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px 24px',
          marginBottom: 20,
          padding: '12px 14px',
          background: tok.layer01,
          borderRadius: 4,
          border: `1px solid ${tok.borderSubtle}`,
        }}>
          <MetaField label="Workspace" value={item.workspace} mono />
          <MetaField label="Projects" value={item.projects.join(', ')} mono />
          <MetaField label="Signal Count" value={String(item.signalCount)} />
          <MetaField
            label="Assigned To"
            value={item.assignedTo || 'Unassigned'}
            mono={!!item.assignedTo}
          />
          <MetaField label="Elapsed" value={formatElapsed(item.elapsedSec)} />
          <MetaField label="Last Update" value={item.lastUpdate.split('T')[1]?.replace('Z', '') || item.lastUpdate} mono />
        </div>

        {/* Correlated signals */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            ...LABEL,
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>Correlated Signals</span>
            <span style={BADGE}>{signals.length} found</span>
          </div>

          {signals.map((sig) => (
            <div
              key={sig.signalId}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: '8px 10px',
                borderBottom: `1px solid ${tok.borderSubtle}`,
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{ ...MONO, fontSize: 11, fontWeight: 600 }}>
                  {sig.signalId}
                </span>
                <span style={{ ...BADGE, fontSize: 10, textTransform: 'capitalize' }}>
                  {sig.relationship}
                </span>
                <span style={{ flex: 1 }} />
                <span style={{ ...MONO, fontSize: 10, color: tok.textPlaceholder }}>
                  {(sig.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div style={{
                fontSize: 11,
                color: tok.textSecondary,
                lineHeight: 1.4,
              }}>
                {truncate(sig.rawMessage, 80)}
              </div>
            </div>
          ))}
        </div>

        {/* Analyze button */}
        {showAnalyzeButton && (
          <button style={{
            width: '100%',
            padding: '10px 16px',
            background: tok.layer02,
            border: `1px solid ${tok.borderSubtle}`,
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 600,
            color: tok.textPrimary,
            cursor: 'default',
            letterSpacing: '0.02em',
          }}>
            Analyze Root Cause
          </button>
        )}
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
            {/* Sender + timestamp */}
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
 * Story 1: TriageList
 * 2-column layout (70% table | 30% chat). Full-width incident table
 * showing all 3 triage items. No detail panel, no selection.
 */
export function TriageListWireframe() {
  return (
    <div style={SHELL}>
      <NavBar activeTab="Workspaces" />
      <div style={MAIN_2COL}>
        <IncidentTable items={triageItems} />
        <ChatPanel messages={triageChat} />
      </div>
      <StatusBar text="3 incidents | 1 critical" />
    </div>
  );
}

/**
 * Story 2: TriageSelected
 * 3-column layout (30% compact list | 40% detail | 30% chat).
 * INC-2026-0847 selected, detail panel shows severity/status badges,
 * metadata grid, correlated signals list.
 */
export function TriageSelectedWireframe() {
  const selected = triageItems[0]; // INC-2026-0847

  return (
    <div style={SHELL}>
      <NavBar activeTab="Workspaces" incidentId={selected.incidentId} />
      <div style={MAIN_3COL}>
        <CompactIncidentList
          items={triageItems}
          selectedId={selected.incidentId}
        />
        <IncidentDetailPanel
          item={selected}
          signals={correlatedSignals}
        />
        <ChatPanel messages={triageChat} />
      </div>
      <StatusBar text="3 incidents | 1 critical - INC-2026-0847 selected" />
    </div>
  );
}

/**
 * Story 3: TriageAssigned
 * 3-column layout. INC-2026-0847 assigned to op-mchen, [Analyze] button
 * visible, agent chat confirms assignment and prompts root cause analysis.
 */
export function TriageAssignedWireframe() {
  const selected: TriageItem = {
    ...triageItems[0],
    assignedTo: 'op-mchen',
    status: 'triaging',
  };

  const assignedChat: ChatMessage[] = [
    ...triageChat,
    {
      sender: 'agent',
      text: 'INC-2026-0847 assigned to op-mchen. Primary signal: Terraform apply failure on aws_security_group.main in ws-prod-networking. 3 correlated signals across TFC run logs, drift detection, and audit trail.',
      timestamp: '14:32:20',
    },
    {
      sender: 'agent',
      text: 'Severity: critical. 12 downstream workspaces depend on ws-prod-networking security group outputs. Recommend root cause analysis.',
      timestamp: '14:32:21',
    },
    {
      sender: 'user',
      text: 'Analyze it.',
      timestamp: '14:32:35',
    },
    {
      sender: 'agent',
      text: 'Starting root cause analysis for INC-2026-0847. Examining provider error, drift signals, and audit log for aws_security_group.main in ws-prod-networking...',
      timestamp: '14:32:36',
    },
  ];

  return (
    <div style={SHELL}>
      <NavBar activeTab="Workspaces" incidentId={selected.incidentId} />
      <div style={MAIN_3COL}>
        <CompactIncidentList
          items={triageItems.map((item) =>
            item.incidentId === selected.incidentId ? selected : item
          )}
          selectedId={selected.incidentId}
        />
        <IncidentDetailPanel
          item={selected}
          signals={correlatedSignals}
          showAnalyzeButton
        />
        <ChatPanel messages={assignedChat} />
      </div>
      <StatusBar text="3 incidents | 1 critical - INC-2026-0847 assigned to op-mchen, analysis in progress" />
    </div>
  );
}

/* ================================================================
 * STORYBOOK META & STORIES (CSF3)
 * ================================================================ */

const meta: Meta = {
  title: 'Wireframes/Incident/Triage',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const TriageList: Story = {
  render: () => <TriageListWireframe />,
};

export const TriageSelected: Story = {
  render: () => <TriageSelectedWireframe />,
};

export const TriageAssigned: Story = {
  render: () => <TriageAssignedWireframe />,
};
