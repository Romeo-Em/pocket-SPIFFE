/**
 * 04-mtls-test.tsx
 *
 * App Developer — Step 4: Confirm the SVID works for mTLS with peer services.
 * States: PeerList | PeerVerified | NoSvid
 */
import type { CSSProperties } from 'react';
import { tok, mtlsPeers, SPIFFE_ID, DEV_STEPS } from './_dev-fixtures';

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
const SECTION_TITLE: CSSProperties = { fontSize: 13, fontWeight: 600, margin: '20px 0 10px', borderBottom: `1px solid ${tok.borderSubtle}`, paddingBottom: 6 };
const TABLE: CSSProperties = { width: '100%', borderCollapse: 'collapse' as const, fontSize: 12 };
const TH: CSSProperties = { textAlign: 'left' as const, padding: '7px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textHelper, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.04em' };
const TD: CSSProperties = { padding: '8px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textPrimary, verticalAlign: 'middle' as const };
const BADGE_OK: CSSProperties = { display: 'inline-block', padding: '2px 7px', fontSize: 11, fontFamily: tok.fontMono, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, background: tok.layer01, color: tok.textPrimary, fontWeight: 600 };
const BADGE_WARN: CSSProperties = { ...BADGE_OK, border: `1px solid ${tok.borderStrong}`, color: tok.textSecondary, fontWeight: 400 };
const DETAIL_GRID: CSSProperties = { display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: 10, columnGap: 16, marginBottom: 20, fontSize: 13 };
const DT: CSSProperties = { color: tok.textHelper, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontFamily: tok.fontMono, paddingTop: 1 };
const DD: CSSProperties = { fontFamily: tok.fontMono, color: tok.textPrimary, wordBreak: 'break-all' as const };
const BTN_PRIMARY: CSSProperties = { padding: '8px 14px', fontSize: 13, fontWeight: 500, border: `1.5px solid ${tok.borderStrong}`, borderRadius: 4, background: tok.textPrimary, color: tok.bg, cursor: 'pointer', whiteSpace: 'nowrap' as const };
const SUCCESS_BANNER: CSSProperties = { border: `1px solid ${tok.borderStrong}`, borderRadius: 4, background: tok.layer01, padding: '12px 16px', marginBottom: 20, fontSize: 13 };

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
        <div key={label} style={i < active ? STEP_DONE : i === active ? STEP_ACTIVE : STEP_DONE}>
          {i < active ? '✓ ' : `${i + 1}. `}{label}
        </div>
      ))}
    </div>
  );
}

/* ── Exported wireframes ─────────────────────────────────────── */

export function MtlsTestPeerList() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>mTLS Peer Verification</h1>
          <p style={PAGE_DESC}>Confirm that peer services accept your SVID for mutual TLS.</p>
          <StepperBar active={3} />
          <div style={SECTION_TITLE}>Local identity</div>
          <div style={DETAIL_GRID}>
            <div style={DT}>SPIFFE ID</div>
            <div style={DD}>{SPIFFE_ID}</div>
            <div style={DT}>Status</div>
            <div style={DD}><span style={BADGE_OK}>Active</span></div>
          </div>
          <div style={SECTION_TITLE}>Peer services</div>
          <table style={TABLE}>
            <thead>
              <tr>
                <th style={TH}>Service</th>
                <th style={TH}>SPIFFE ID</th>
                <th style={TH}>mTLS status</th>
              </tr>
            </thead>
            <tbody>
              {mtlsPeers.map(p => (
                <tr key={p.service}>
                  <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 12 }}>{p.service}</td>
                  <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>
                    {p.spiffeId || <span style={{ color: tok.textPlaceholder }}>No SVID</span>}
                  </td>
                  <td style={TD}>
                    {p.status === 'verified'
                      ? <span style={BADGE_OK}>Verified</span>
                      : <span style={BADGE_WARN}>No SVID</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 20, fontSize: 12, color: tok.textHelper }}>
            Services without an SVID fall back to token-based auth. Migrate them to SPIFFE to close the gap.
          </div>
        </div>
      </div>
    </div>
  );
}

export function MtlsTestAllVerified() {
  const allPeers = mtlsPeers.map(p => ({ ...p, status: 'verified', spiffeId: p.spiffeId || `spiffe://corp.example/k8s/${p.service}` }));
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>mTLS Peer Verification</h1>
          <p style={PAGE_DESC}>Confirm that peer services accept your SVID for mutual TLS.</p>
          <StepperBar active={3} />
          <div style={SUCCESS_BANNER}>
            <strong>All peers verified.</strong> Your workload identity is active and all SPIFFE-enabled peers
            have completed mutual TLS handshake. No static credential was exchanged.
          </div>
          <div style={SECTION_TITLE}>Local identity</div>
          <div style={DETAIL_GRID}>
            <div style={DT}>SPIFFE ID</div>
            <div style={DD}>{SPIFFE_ID}</div>
            <div style={DT}>Status</div>
            <div style={DD}><span style={BADGE_OK}>Active</span></div>
          </div>
          <div style={SECTION_TITLE}>Peer services</div>
          <table style={TABLE}>
            <thead>
              <tr>
                <th style={TH}>Service</th>
                <th style={TH}>SPIFFE ID</th>
                <th style={TH}>mTLS status</th>
              </tr>
            </thead>
            <tbody>
              {allPeers.map(p => (
                <tr key={p.service}>
                  <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 12 }}>{p.service}</td>
                  <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>{p.spiffeId}</td>
                  <td style={TD}><span style={BADGE_OK}>Verified</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button style={BTN_PRIMARY}>Done</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MtlsTestNoSvid() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>mTLS Peer Verification</h1>
          <p style={PAGE_DESC}>Confirm that peer services accept your SVID for mutual TLS.</p>
          <StepperBar active={3} />
          <div style={{ border: `1px solid ${tok.borderStrong}`, borderRadius: 4, background: tok.layer01, padding: '12px 16px', marginBottom: 20, fontSize: 12 }}>
            <strong>Local SVID not found</strong><br />
            No SVID file at <code style={{ fontFamily: tok.fontMono }}>/run/spiffe/svid.pem</code>.
            Complete steps 1-3 before testing mTLS.
          </div>
        </div>
      </div>
    </div>
  );
}
