/**
 * 01-audit-log.tsx
 *
 * Security Engineer — Step 1: Review the SVID issuance audit log.
 * States: Default | FilteredByError | Empty
 */
import type { CSSProperties } from 'react';
import { tok, auditLog, AuditEntry, SEC_STEPS } from './_sec-fixtures';

const SHELL: CSSProperties = {
  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
  background: tok.bg, fontFamily: tok.fontSans, color: tok.textPrimary, fontSize: 13, overflow: 'hidden',
};
const TOPBAR: CSSProperties = {
  height: 48, borderBottom: `1px solid ${tok.borderSubtle}`, background: tok.layer01,
  display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0,
};
const SIDEBAR: CSSProperties = {
  width: 200, borderRight: `1px solid ${tok.borderSubtle}`, background: tok.layer01,
  padding: '16px 0', flexShrink: 0,
};
const BODY: CSSProperties    = { flex: 1, display: 'flex', overflow: 'hidden' };
const MAIN: CSSProperties    = { flex: 1, padding: '24px 28px', overflowY: 'auto' };
const PAGE_TITLE: CSSProperties = { fontSize: 18, fontWeight: 600, margin: 0 };
const PAGE_DESC: CSSProperties = { fontSize: 13, color: tok.textSecondary, marginTop: 4, marginBottom: 20 };
const NAV_ITEM: CSSProperties = { padding: '6px 16px', fontSize: 13, color: tok.textSecondary };
const NAV_ITEM_ACTIVE: CSSProperties = { ...NAV_ITEM, color: tok.textPrimary, fontWeight: 600, background: tok.layer02, borderLeft: `3px solid ${tok.textPrimary}`, paddingLeft: 13 };
const NAV_GROUP: CSSProperties = { padding: '12px 16px 4px', fontSize: 10, fontFamily: tok.fontMono, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: tok.textHelper };
const STEPPER: CSSProperties = { display: 'flex', gap: 0, marginBottom: 28, borderBottom: `1px solid ${tok.borderSubtle}`, paddingBottom: 16 };
const STEP_DONE: CSSProperties = { flex: 1, fontSize: 11, fontFamily: tok.fontMono, color: tok.textHelper, textAlign: 'center' as const };
const STEP_ACTIVE: CSSProperties = { ...STEP_DONE, color: tok.textPrimary, fontWeight: 700 };
const STEP_PENDING: CSSProperties = { ...STEP_DONE, color: tok.textPlaceholder };
const TOOLBAR: CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 };
const INPUT: CSSProperties = { padding: '6px 10px', fontSize: 12, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, background: tok.bg, color: tok.textPrimary, fontFamily: tok.fontMono, width: 240 };
const BTN: CSSProperties = { padding: '6px 12px', fontSize: 12, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, background: tok.layer01, color: tok.textSecondary, cursor: 'pointer' };
const BTN_ACTIVE: CSSProperties = { ...BTN, background: tok.textPrimary, color: tok.bg, border: `1px solid ${tok.borderStrong}`, fontWeight: 600 };
const TABLE: CSSProperties = { width: '100%', borderCollapse: 'collapse' as const, fontSize: 12 };
const TH: CSSProperties = { textAlign: 'left' as const, padding: '7px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textHelper, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.04em' };
const TD: CSSProperties = { padding: '8px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textPrimary, verticalAlign: 'top' as const };
const BADGE_OK: CSSProperties = { display: 'inline-block', padding: '1px 7px', fontSize: 11, fontFamily: tok.fontMono, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, background: tok.layer01, color: tok.textPrimary };
const BADGE_ERR: CSSProperties = { ...BADGE_OK, fontWeight: 600 };
const EMPTY_STATE: CSSProperties = { padding: '40px 0', textAlign: 'center' as const, color: tok.textHelper, fontSize: 13 };

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
      <div style={NAV_ITEM}>Secrets Engines</div>
      <div style={NAV_ITEM}>SPIFFE (spiffe/)</div>
      <div style={NAV_GROUP}>System</div>
      <div style={NAV_ITEM_ACTIVE}>Audit</div>
      <div style={NAV_ITEM}>Policies</div>
      <div style={NAV_ITEM}>Entities</div>
    </div>
  );
}

function StepperBar({ active }: { active: number }) {
  return (
    <div style={STEPPER}>
      {SEC_STEPS.map((label, i) => (
        <div key={label} style={i < active ? STEP_DONE : i === active ? STEP_ACTIVE : STEP_PENDING}>
          {i < active ? '✓ ' : `${i + 1}. `}{label}
        </div>
      ))}
    </div>
  );
}

function LogRow({ entry }: { entry: AuditEntry }) {
  return (
    <tr style={entry.status === 'error' ? { background: tok.layer01 } : {}}>
      <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11, color: tok.textHelper, whiteSpace: 'nowrap' as const }}>{entry.time}</td>
      <td style={{ ...TD, fontFamily: tok.fontMono }}>{entry.op}</td>
      <td style={{ ...TD, fontFamily: tok.fontMono, color: tok.textSecondary, fontSize: 11 }}>{entry.path}</td>
      <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>
        {entry.spiffeId || <span style={{ color: tok.textPlaceholder }}>—</span>}
      </td>
      <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11 }}>{entry.entity}</td>
      <td style={TD}>
        {entry.status === 'success'
          ? <span style={BADGE_OK}>ok</span>
          : <span style={BADGE_ERR}>error</span>}
        {entry.reason && <div style={{ fontSize: 10, color: tok.textHelper, marginTop: 3, maxWidth: 220 }}>{entry.reason}</div>}
      </td>
    </tr>
  );
}

/* ── Exported wireframes ─────────────────────────────────────── */

export function AuditLogDefault() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Audit Log — SVID Issuance</h1>
          <p style={PAGE_DESC}>All mint, configure, and rotate operations on the SPIFFE secrets engine.</p>
          <StepperBar active={0} />
          <div style={TOOLBAR}>
            <input style={INPUT} placeholder="Filter by SPIFFE ID or entity..." readOnly />
            <button style={BTN}>All events</button>
            <button style={BTN}>Errors only</button>
            <div style={{ flex: 1 }} />
            <button style={BTN}>Export CSV</button>
          </div>
          <table style={TABLE}>
            <thead>
              <tr>
                <th style={TH}>Time (UTC)</th>
                <th style={TH}>Operation</th>
                <th style={TH}>Path</th>
                <th style={TH}>SPIFFE ID</th>
                <th style={TH}>Entity</th>
                <th style={TH}>Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((entry, i) => <LogRow key={i} entry={entry} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AuditLogFilteredErrors() {
  const errors = auditLog.filter(e => e.status === 'error');
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Audit Log — SVID Issuance</h1>
          <p style={PAGE_DESC}>Filtered: failed mint attempts only.</p>
          <StepperBar active={0} />
          <div style={TOOLBAR}>
            <input style={INPUT} placeholder="Filter by SPIFFE ID or entity..." readOnly />
            <button style={BTN}>All events</button>
            <button style={BTN_ACTIVE}>Errors only</button>
            <div style={{ flex: 1 }} />
            <button style={BTN}>Export CSV</button>
          </div>
          <table style={TABLE}>
            <thead>
              <tr>
                <th style={TH}>Time (UTC)</th>
                <th style={TH}>Operation</th>
                <th style={TH}>Path</th>
                <th style={TH}>SPIFFE ID</th>
                <th style={TH}>Entity</th>
                <th style={TH}>Status</th>
              </tr>
            </thead>
            <tbody>
              {errors.map((entry, i) => <LogRow key={i} entry={entry} />)}
            </tbody>
          </table>
          <div style={{ marginTop: 12, fontSize: 12, color: tok.textHelper }}>Showing {errors.length} error event(s).</div>
        </div>
      </div>
    </div>
  );
}

export function AuditLogEmpty() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Audit Log — SVID Issuance</h1>
          <p style={PAGE_DESC}>All mint, configure, and rotate operations on the SPIFFE secrets engine.</p>
          <StepperBar active={0} />
          <div style={TOOLBAR}>
            <input style={INPUT} placeholder="Filter by SPIFFE ID or entity..." readOnly />
            <button style={BTN}>All events</button>
            <button style={BTN}>Errors only</button>
          </div>
          <div style={EMPTY_STATE}>
            No audit events found for this engine mount.<br />
            <span style={{ fontSize: 11 }}>Enable audit logging via <code style={{ fontFamily: tok.fontMono }}>vault audit enable file</code> before issuing SVIDs.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
