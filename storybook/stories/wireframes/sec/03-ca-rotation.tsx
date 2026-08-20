/**
 * 03-ca-rotation.tsx
 *
 * Security Engineer — Step 3: Review CA rotation events and trust bundle status.
 * States: Default | PostRotation | RotationWarning
 */
import type { CSSProperties } from 'react';
import { tok, caEvents, CaEvent, SEC_STEPS } from './_sec-fixtures';

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
const SECTION_TITLE: CSSProperties = { fontSize: 13, fontWeight: 600, margin: '20px 0 10px', borderBottom: `1px solid ${tok.borderSubtle}`, paddingBottom: 6 };
const TABLE: CSSProperties = { width: '100%', borderCollapse: 'collapse' as const, fontSize: 12 };
const TH: CSSProperties = { textAlign: 'left' as const, padding: '7px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textHelper, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.04em' };
const TD: CSSProperties = { padding: '8px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textPrimary, verticalAlign: 'top' as const };
const BADGE_OK: CSSProperties = { display: 'inline-block', padding: '1px 7px', fontSize: 11, fontFamily: tok.fontMono, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, background: tok.layer01, color: tok.textPrimary };
const BADGE_WARN: CSSProperties = { ...BADGE_OK, fontWeight: 600 };
const DETAIL_GRID: CSSProperties = { display: 'grid', gridTemplateColumns: '200px 1fr', rowGap: 10, columnGap: 16, marginBottom: 20, fontSize: 13 };
const DT: CSSProperties = { color: tok.textHelper, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontFamily: tok.fontMono, paddingTop: 1 };
const DD: CSSProperties = { fontFamily: tok.fontMono, color: tok.textPrimary, wordBreak: 'break-all' as const };
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
      <div style={NAV_ITEM_ACTIVE}>SPIFFE (spiffe/)</div>
      <div style={NAV_ITEM}>PKI (pki-int/)</div>
      <div style={NAV_GROUP}>System</div>
      <div style={NAV_ITEM}>Audit</div>
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

function EventRow({ ev }: { ev: CaEvent }) {
  return (
    <tr>
      <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11, color: tok.textHelper, whiteSpace: 'nowrap' as const }}>{ev.time}</td>
      <td style={TD}>{ev.event}</td>
      <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>{ev.issuer}</td>
      <td style={TD}>
        {ev.status === 'ok'
          ? <span style={BADGE_OK}>ok</span>
          : <span style={BADGE_WARN}>warning</span>}
      </td>
      <td style={{ ...TD, fontSize: 11, color: tok.textHelper }}>{ev.note || '—'}</td>
    </tr>
  );
}

/* ── Exported wireframes ─────────────────────────────────────── */

export function CaRotationDefault() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>CA Rotation & Trust Bundle</h1>
          <p style={PAGE_DESC}>CA rotation history and current trust bundle status for the SPIFFE engine.</p>
          <StepperBar active={2} />
          <div style={SECTION_TITLE}>Trust bundle status</div>
          <div style={DETAIL_GRID}>
            <div style={DT}>Bundle URL</div>
            <div style={DD}>https://vault.corp.example/v1/spiffe/bundle</div>
            <div style={DT}>Active CA certs</div>
            <div style={DD}>2 (current + previous)</div>
            <div style={DT}>Previous CA valid until</div>
            <div style={DD}>2026-08-01T08:00:00Z</div>
            <div style={DT}>Last bundle refresh</div>
            <div style={DD}>2026-07-25T08:00:00Z</div>
          </div>
          <div style={SECTION_TITLE}>Rotation history</div>
          <table style={TABLE}>
            <thead>
              <tr>
                <th style={TH}>Time (UTC)</th>
                <th style={TH}>Event</th>
                <th style={TH}>Issuer</th>
                <th style={TH}>Status</th>
                <th style={TH}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {caEvents.map((ev, i) => <EventRow key={i} ev={ev} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function CaRotationPostRotation() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>CA Rotation & Trust Bundle</h1>
          <p style={PAGE_DESC}>CA rotation completed successfully. Trust bundle updated.</p>
          <StepperBar active={2} />
          <div style={{ border: `1px solid ${tok.borderStrong}`, borderRadius: 4, background: tok.layer01, padding: '12px 16px', marginBottom: 20, fontSize: 12 }}>
            <strong>CA rotation complete.</strong><br />
            New CA cert is active. Previous cert remains in trust bundle until 2026-08-01.
            Vault Agent will renew all SVIDs automatically during the next renewal cycle.
            No manual action required.
          </div>
          <div style={SECTION_TITLE}>Trust bundle status</div>
          <div style={DETAIL_GRID}>
            <div style={DT}>Bundle URL</div>
            <div style={DD}>https://vault.corp.example/v1/spiffe/bundle</div>
            <div style={DT}>Active CA certs</div>
            <div style={DD}>2 (new + previous)</div>
            <div style={DT}>New CA fingerprint</div>
            <div style={DD}>SHA256:9f:12:ab:cd:ef:78:90:12:34:56:78:90:ab:cd:ef:12</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CaRotationBundleStalenessWarning() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>CA Rotation & Trust Bundle</h1>
          <p style={PAGE_DESC}>Warning: an external consumer may have a stale trust bundle.</p>
          <StepperBar active={2} />
          <div style={WARN_BANNER}>
            <strong>Trust bundle staleness detected</strong><br />
            The bundle endpoint was last fetched by <code style={{ fontFamily: tok.fontMono }}>external-partner-vault</code> 8 days ago.
            If the CA has rotated since then, that cluster will reject SVIDs signed by the new CA.
            Notify the partner to refresh their bundle or configure automatic push.
          </div>
          <div style={SECTION_TITLE}>Trust bundle status</div>
          <div style={DETAIL_GRID}>
            <div style={DT}>Bundle URL</div>
            <div style={DD}>https://vault.corp.example/v1/spiffe/bundle</div>
            <div style={DT}>Last CA rotation</div>
            <div style={DD}>2026-07-25T08:00:00Z</div>
            <div style={DT}>External cluster last fetch</div>
            <div style={DD}>2026-07-17T11:00:00Z <span style={{ fontFamily: tok.fontSans, fontSize: 11, color: tok.textHelper }}>(8 days ago)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
