/**
 * 05-agent-registry.tsx
 *
 * UC1 Agentic Identity — Step 5: Agent Registry governance view.
 * Security operator views registered agents, their status, ceiling policy, and owner.
 * States: AgentActive | AgentSuspended
 */
import type { CSSProperties } from 'react';
import { tok, AGENT_ID, UC1_STEPS, agentRegistryEntry } from './_uc1-fixtures';

const SHELL: CSSProperties = { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: tok.bg, fontFamily: tok.fontSans, color: tok.textPrimary, fontSize: 13, overflow: 'hidden' };
const TOPBAR: CSSProperties = { height: 48, borderBottom: `1px solid ${tok.borderSubtle}`, background: tok.layer01, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0 };
const SIDEBAR: CSSProperties = { width: 200, borderRight: `1px solid ${tok.borderSubtle}`, background: tok.layer01, padding: '16px 0', flexShrink: 0 };
const BODY: CSSProperties    = { flex: 1, display: 'flex', overflow: 'hidden' };
const MAIN: CSSProperties    = { flex: 1, padding: '24px 28px', overflowY: 'auto' };
const PAGE_TITLE: CSSProperties = { fontSize: 18, fontWeight: 600, margin: 0 };
const PAGE_DESC: CSSProperties  = { fontSize: 13, color: tok.textSecondary, marginTop: 4, marginBottom: 20 };
const NAV_ITEM: CSSProperties   = { padding: '6px 16px', fontSize: 13, color: tok.textSecondary };
const NAV_ITEM_ACTIVE: CSSProperties = { ...NAV_ITEM, color: tok.textPrimary, fontWeight: 600, background: tok.layer02, borderLeft: `3px solid ${tok.textPrimary}`, paddingLeft: 13 };
const NAV_GROUP: CSSProperties  = { padding: '12px 16px 4px', fontSize: 10, fontFamily: tok.fontMono, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: tok.textHelper };
const STEPPER: CSSProperties    = { display: 'flex', gap: 0, marginBottom: 28, borderBottom: `1px solid ${tok.borderSubtle}`, paddingBottom: 16 };
const STEP_DONE: CSSProperties  = { flex: 1, fontSize: 11, fontFamily: tok.fontMono, color: tok.textHelper, textAlign: 'center' as const };
const STEP_ACTIVE: CSSProperties = { ...STEP_DONE, color: tok.textPrimary, fontWeight: 700 };
const STEP_PENDING: CSSProperties = { ...STEP_DONE, color: tok.textPlaceholder };
const CARD: CSSProperties       = { border: `1px solid ${tok.borderSubtle}`, borderRadius: 4, padding: '16px 18px', marginBottom: 16, background: tok.layer01 };
const CARD_TITLE: CSSProperties = { fontSize: 12, fontWeight: 600, color: tok.textSecondary, marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontFamily: tok.fontMono };
const ROW: CSSProperties        = { display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 12 };
const KEY: CSSProperties        = { color: tok.textHelper };
const VAL: CSSProperties        = { fontFamily: tok.fontMono, color: tok.textPrimary, fontSize: 11 };
const TABLE: CSSProperties      = { width: '100%', borderCollapse: 'collapse' as const, fontSize: 12 };
const TH: CSSProperties         = { textAlign: 'left' as const, padding: '7px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textHelper, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.04em' };
const TD: CSSProperties         = { padding: '8px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textPrimary, verticalAlign: 'top' as const };
const BADGE_OK: CSSProperties   = { display: 'inline-block', padding: '2px 8px', fontSize: 11, fontFamily: tok.fontMono, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, background: tok.layer01, color: tok.textPrimary };
const BADGE_ERR: CSSProperties  = { ...BADGE_OK, fontWeight: 600 };
const BTN: CSSProperties        = { padding: '6px 12px', fontSize: 12, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, background: tok.layer01, color: tok.textSecondary, cursor: 'pointer' };
const BTN_DANGER: CSSProperties = { ...BTN, borderColor: tok.borderStrong, color: tok.textPrimary, fontWeight: 600 };
const NOTE: CSSProperties       = { fontSize: 12, color: tok.textHelper, marginTop: 8 };

const agents = [
  { id: AGENT_ID, owner: agentRegistryEntry.owner, ceiling: agentRegistryEntry.ceiling, registered: agentRegistryEntry.registeredAt, status: 'active' as const },
  { id: 'spiffe://corp.example/agent/risk-scorer/instance-b1e2', owner: 'ml-team', ceiling: 'policy/agent-risk-scorer', registered: '2026-08-10T00:00:00Z', status: 'active' as const },
  { id: 'spiffe://corp.example/agent/report-exporter/instance-c9d4', owner: 'finance-team', ceiling: 'policy/agent-report-exporter', registered: '2026-08-15T00:00:00Z', status: 'active' as const },
];

function VaultTopBar() {
  return (
    <div style={TOPBAR}>
      <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em' }}>VAULT</span>
      <span style={{ color: tok.borderSubtle, margin: '0 4px' }}>|</span>
      <span style={{ fontSize: 12, color: tok.textSecondary }}>corp-prod</span>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 12, color: tok.textHelper }}>⚙  👤  ?</span>
    </div>
  );
}

function VaultSidebar() {
  return (
    <div style={SIDEBAR}>
      <div style={NAV_GROUP}>Secrets</div>
      <div style={NAV_ITEM}>SPIFFE (spiffe/)</div>
      <div style={NAV_GROUP}>Access</div>
      <div style={NAV_ITEM_ACTIVE}>Agent Registry</div>
      <div style={NAV_ITEM}>Entities</div>
      <div style={NAV_GROUP}>System</div>
      <div style={NAV_ITEM}>Audit</div>
    </div>
  );
}

function StepperBar({ active }: { active: number }) {
  return (
    <div style={STEPPER}>
      {UC1_STEPS.map((label, i) => (
        <div key={label} style={i < active ? STEP_DONE : i === active ? STEP_ACTIVE : STEP_PENDING}>
          {i < active ? '✓ ' : `${i + 1}. `}{label}
        </div>
      ))}
    </div>
  );
}

export function AgentRegistryActive() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Agent Registry</h1>
          <p style={PAGE_DESC}>All registered agents, their ceiling policies, and current status. Only active agents can exchange JWT-SVIDs at the AS.</p>
          <StepperBar active={4} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: tok.textHelper }}>{agents.length} agents registered</div>
            <button style={BTN}>+ Register agent</button>
          </div>
          <table style={TABLE}>
            <thead>
              <tr>
                <th style={TH}>SPIFFE ID</th>
                <th style={TH}>Owner</th>
                <th style={TH}>Ceiling policy</th>
                <th style={TH}>Registered</th>
                <th style={TH}>Status</th>
                <th style={TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a, i) => (
                <tr key={i}>
                  <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11 }}>{a.id}</td>
                  <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11 }}>{a.owner}</td>
                  <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11 }}>{a.ceiling}</td>
                  <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11, color: tok.textHelper }}>{a.registered.split('T')[0]}</td>
                  <td style={TD}><span style={BADGE_OK}>active</span></td>
                  <td style={TD}><button style={BTN_DANGER}>Suspend</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={NOTE}>Suspending an agent blocks all token exchanges immediately. Existing OAuth JWTs expire at their natural TTL (max 5m).</p>
        </div>
      </div>
    </div>
  );
}

export function AgentRegistrySuspended() {
  const suspendedAgent = { ...agents[0], status: 'suspended' as const };
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Agent Registry</h1>
          <p style={PAGE_DESC}>Agent suspended. Token exchange requests from this SPIFFE ID will be denied by the AS.</p>
          <StepperBar active={4} />
          <div style={{ ...CARD, borderColor: tok.borderStrong }}>
            <div style={CARD_TITLE}>Suspended agent</div>
            <div style={ROW}><span style={KEY}>SPIFFE ID</span><span style={VAL}>{suspendedAgent.id}</span></div>
            <div style={ROW}><span style={KEY}>Owner</span><span style={VAL}>{suspendedAgent.owner}</span></div>
            <div style={ROW}><span style={KEY}>Ceiling policy</span><span style={VAL}>{suspendedAgent.ceiling}</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_ERR}>suspended</span></div>
            <div style={ROW}><span style={KEY}>Suspended at</span><span style={VAL}>2026-08-24T10:05:00Z</span></div>
            <div style={ROW}><span style={KEY}>Suspended by</span><span style={VAL}>admin:security-oncall</span></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={BTN}>Restore agent</button>
            <button style={BTN}>View audit trail</button>
          </div>
          <p style={NOTE}>Restoration requires explicit action. A suspended agent that re-attests will still receive a JWT-SVID, but the AS will deny exchange until the registry is updated.</p>
        </div>
      </div>
    </div>
  );
}
