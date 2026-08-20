/**
 * 02-identity-inventory.tsx
 *
 * Security Engineer — Step 2: Identity inventory — view all active SVIDs, TTL status, root of trust.
 * States: Default | ExpiringSoon | Empty
 */
import type { CSSProperties } from 'react';
import { tok, svidInventory, SvidRecord, SEC_STEPS } from './_sec-fixtures';

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
const STAT_ROW: CSSProperties = { display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' as const };
const STAT: CSSProperties = { border: `1px solid ${tok.borderSubtle}`, borderRadius: 4, padding: '12px 18px', minWidth: 120, background: tok.layer01 };
const STAT_VAL: CSSProperties = { fontSize: 22, fontWeight: 700, fontFamily: tok.fontMono, color: tok.textPrimary };
const STAT_LBL: CSSProperties = { fontSize: 11, color: tok.textHelper, marginTop: 2 };
const TABLE: CSSProperties = { width: '100%', borderCollapse: 'collapse' as const, fontSize: 12 };
const TH: CSSProperties = { textAlign: 'left' as const, padding: '7px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textHelper, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.04em' };
const TD: CSSProperties = { padding: '8px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textPrimary, verticalAlign: 'middle' as const };
const BADGE_OK: CSSProperties = { display: 'inline-block', padding: '1px 7px', fontSize: 11, fontFamily: tok.fontMono, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, background: tok.layer01, color: tok.textPrimary };
const BADGE_WARN: CSSProperties = { ...BADGE_OK, fontWeight: 600 };
const BADGE_ERR: CSSProperties  = { ...BADGE_OK, fontWeight: 600 };
const EMPTY_STATE: CSSProperties = { padding: '40px 0', textAlign: 'center' as const, color: tok.textHelper, fontSize: 13 };
const WARN_BANNER: CSSProperties = { border: `1px solid ${tok.borderStrong}`, borderRadius: 4, background: tok.layer01, padding: '10px 14px', marginBottom: 16, fontSize: 12 };

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
      <div style={NAV_ITEM_ACTIVE}>SPIFFE (spiffe/)</div>
      <div style={NAV_GROUP}>System</div>
      <div style={NAV_ITEM}>Audit</div>
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

function statusBadge(status: SvidRecord['status']) {
  if (status === 'active')         return <span style={BADGE_OK}>Active</span>;
  if (status === 'expiring-soon')  return <span style={BADGE_WARN}>Expiring soon</span>;
  return                                  <span style={BADGE_ERR}>Expired</span>;
}

function InventoryTable({ records }: { records: SvidRecord[] }) {
  return (
    <table style={TABLE}>
      <thead>
        <tr>
          <th style={TH}>SPIFFE ID</th>
          <th style={TH}>Entity</th>
          <th style={TH}>Root of trust</th>
          <th style={TH}>TTL</th>
          <th style={TH}>Expires at</th>
          <th style={TH}>Status</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r, i) => (
          <tr key={i} style={r.status !== 'active' ? { background: tok.layer01 } : {}}>
            <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11 }}>{r.spiffeId}</td>
            <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>{r.entity}</td>
            <td style={{ ...TD, color: tok.textSecondary }}>{r.rootOfTrust}</td>
            <td style={{ ...TD, fontFamily: tok.fontMono }}>{r.ttl}</td>
            <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>{r.expiresAt}</td>
            <td style={TD}>{statusBadge(r.status)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── Exported wireframes ─────────────────────────────────────── */

export function IdentityInventoryDefault() {
  const active   = svidInventory.filter(r => r.status === 'active').length;
  const expiring = svidInventory.filter(r => r.status === 'expiring-soon').length;
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Identity Inventory</h1>
          <p style={PAGE_DESC}>All active X.509 SVIDs issued by this engine. Refreshes every 30s.</p>
          <StepperBar active={1} />
          <div style={STAT_ROW}>
            <div style={STAT}><div style={STAT_VAL}>{svidInventory.length}</div><div style={STAT_LBL}>Total issued</div></div>
            <div style={STAT}><div style={STAT_VAL}>{active}</div><div style={STAT_LBL}>Active</div></div>
            <div style={STAT}><div style={STAT_VAL}>{expiring}</div><div style={STAT_LBL}>Expiring soon</div></div>
            <div style={STAT}><div style={STAT_VAL}>0</div><div style={STAT_LBL}>Policy violations</div></div>
          </div>
          <InventoryTable records={svidInventory} />
        </div>
      </div>
    </div>
  );
}

export function IdentityInventoryExpiringSoon() {
  const expiring = svidInventory.filter(r => r.status === 'expiring-soon');
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Identity Inventory</h1>
          <p style={PAGE_DESC}>Filtered: SVIDs expiring within the next 15 minutes.</p>
          <StepperBar active={1} />
          <div style={WARN_BANNER}>
            <strong>{expiring.length} SVID(s) expiring soon.</strong> Vault Agent should auto-renew at 50% TTL.
            If renewal fails, the workload will lose its identity and mTLS connections will drop.
            Check that Vault Agent is running and can reach Vault.
          </div>
          <InventoryTable records={expiring} />
        </div>
      </div>
    </div>
  );
}

export function IdentityInventoryEmpty() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Identity Inventory</h1>
          <p style={PAGE_DESC}>All active X.509 SVIDs issued by this engine.</p>
          <StepperBar active={1} />
          <div style={EMPTY_STATE}>
            No SVIDs have been issued yet.<br />
            <span style={{ fontSize: 11 }}>App developers must configure Vault Agent and request their first SVID.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
