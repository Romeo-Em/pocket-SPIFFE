/**
 * 03-svid-verify.tsx
 *
 * App Developer — Step 3: Verify the issued SVID — inspect its SPIFFE ID, TTL, key algorithm.
 * States: Default | Verified | ExpiredSvid
 */
import type { CSSProperties } from 'react';
import { tok, svidDetails, SPIFFE_ID, BUNDLE_URL, DEV_STEPS } from './_dev-fixtures';

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
const DETAIL_GRID: CSSProperties = { display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: 10, columnGap: 16, marginBottom: 20, fontSize: 13 };
const DT: CSSProperties = { color: tok.textHelper, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontFamily: tok.fontMono, paddingTop: 1 };
const DD: CSSProperties = { fontFamily: tok.fontMono, color: tok.textPrimary, wordBreak: 'break-all' as const };
const BADGE_OK: CSSProperties = { display: 'inline-block', padding: '2px 7px', fontSize: 11, fontFamily: tok.fontMono, border: `1px solid ${tok.borderStrong}`, borderRadius: 3, background: tok.layer01, color: tok.textPrimary, fontWeight: 600 };
const BADGE_ERR: CSSProperties = { ...BADGE_OK, border: `1px solid ${tok.borderStrong}`, fontWeight: 600 };
const BTN_PRIMARY: CSSProperties = { padding: '8px 14px', fontSize: 13, fontWeight: 500, border: `1.5px solid ${tok.borderStrong}`, borderRadius: 4, background: tok.textPrimary, color: tok.bg, cursor: 'pointer', whiteSpace: 'nowrap' as const };
const NOTICE: CSSProperties = { border: `1px solid ${tok.borderStrong}`, borderRadius: 4, background: tok.layer01, padding: '10px 14px', fontSize: 12, marginBottom: 16 };

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
      <div style={NAV_GROUP}>Access</div>
      <div style={NAV_ITEM}>Auth Methods</div>
    </div>
  );
}

function StepperBar({ active }: { active: number }) {
  return (
    <div style={STEPPER}>
      {DEV_STEPS.map((label, i) => (
        <div key={label} style={i < active ? STEP_DONE : i === active ? STEP_ACTIVE : STEP_PENDING}>
          {i < active ? '✓ ' : `${i + 1}. `}{label}
        </div>
      ))}
    </div>
  );
}

/* ── Exported wireframes ─────────────────────────────────────── */

export function SvidVerifyDefault() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Verify SVID</h1>
          <p style={PAGE_DESC}>Confirm the issued X.509 SVID has the correct SPIFFE ID, TTL, and issuer.</p>
          <StepperBar active={2} />
          <div style={SECTION_TITLE}>SVID details — loading</div>
          <div style={{ fontSize: 12, color: tok.textHelper }}>Fetching latest SVID from Vault Agent...</div>
        </div>
      </div>
    </div>
  );
}

export function SvidVerifyVerified() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Verify SVID</h1>
          <p style={PAGE_DESC}>Confirm the issued X.509 SVID has the correct SPIFFE ID, TTL, and issuer.</p>
          <StepperBar active={2} />
          <div style={SECTION_TITLE}>SVID details</div>
          <div style={DETAIL_GRID}>
            <div style={DT}>Status</div>
            <div style={DD}><span style={BADGE_OK}>Active</span></div>
            <div style={DT}>SPIFFE ID (URI SAN)</div>
            <div style={DD}>{SPIFFE_ID}</div>
            <div style={DT}>Issued at</div>
            <div style={DD}>{svidDetails.issuedAt}</div>
            <div style={DT}>Expires at</div>
            <div style={DD}>{svidDetails.expiresAt} &nbsp;<span style={{ fontFamily: tok.fontSans, fontSize: 11, color: tok.textHelper }}>(auto-renews at 50% TTL)</span></div>
            <div style={DT}>TTL</div>
            <div style={DD}>{svidDetails.ttl}</div>
            <div style={DT}>Key algorithm</div>
            <div style={DD}>{svidDetails.keyAlg}</div>
            <div style={DT}>Issued by</div>
            <div style={DD}>{svidDetails.issuer}</div>
            <div style={DT}>Serial</div>
            <div style={DD}>{svidDetails.serial}</div>
            <div style={DT}>Trust bundle URL</div>
            <div style={DD}>{BUNDLE_URL}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={BTN_PRIMARY}>Next: test mTLS &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SvidVerifyExpired() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Verify SVID</h1>
          <p style={PAGE_DESC}>Confirm the issued X.509 SVID has the correct SPIFFE ID, TTL, and issuer.</p>
          <StepperBar active={2} />
          <div style={NOTICE}>
            <strong>SVID expired</strong><br />
            The SVID at <code style={{ fontFamily: tok.fontMono }}>/run/spiffe/svid.pem</code> expired at {svidDetails.expiresAt}.
            Vault Agent should have renewed it automatically. Check that Vault Agent is still running and has network access to Vault.
          </div>
          <div style={SECTION_TITLE}>SVID details</div>
          <div style={DETAIL_GRID}>
            <div style={DT}>Status</div>
            <div style={DD}><span style={BADGE_ERR}>Expired</span></div>
            <div style={DT}>SPIFFE ID</div>
            <div style={DD}>{SPIFFE_ID}</div>
            <div style={DT}>Expired at</div>
            <div style={DD}>{svidDetails.expiresAt}</div>
            <div style={DT}>TTL</div>
            <div style={DD}>{svidDetails.ttl}</div>
          </div>
          <div style={{ fontSize: 12, color: tok.textHelper }}>Restart Vault Agent and re-check.</div>
        </div>
      </div>
    </div>
  );
}
