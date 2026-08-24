/**
 * 04-mtls-service-mesh.tsx
 *
 * UC2 TPM/Infra Attestation — Step 4: mTLS with service mesh.
 * The VM workload uses its X.509 SVID for mutual TLS with peers. Trust bundle validates offline.
 * States: MtlsHandshake | MtlsVerified | MtlsFailed
 */
import type { CSSProperties } from 'react';
import { tok, mtlsPeers, SPIFFE_ID, UC2_STEPS } from './_uc2-fixtures';

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
const BADGE_WARN: CSSProperties = { ...BADGE_OK, color: tok.textSecondary };
const BADGE_ERR: CSSProperties  = { ...BADGE_OK, fontWeight: 600 };
const BADGE_PENDING: CSSProperties = { ...BADGE_OK, color: tok.textHelper };
const SUCCESS_BANNER: CSSProperties = { border: `1px solid ${tok.borderSubtle}`, borderRadius: 4, padding: '12px 16px', background: tok.layer01, fontSize: 13, marginBottom: 16 };
const NOTE: CSSProperties       = { fontSize: 12, color: tok.textHelper, marginTop: 8 };
const PROGRESS: CSSProperties   = { height: 3, background: tok.borderSubtle, borderRadius: 2, overflow: 'hidden' as const, marginBottom: 16 };
const PROGRESS_FILL: CSSProperties = { height: '100%', width: '75%', background: tok.textSecondary, borderRadius: 2 };

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
      <div style={NAV_GROUP}>Access</div>
      <div style={NAV_ITEM}>TPM / Node Registry</div>
      <div style={NAV_GROUP}>System</div>
      <div style={NAV_ITEM}>Audit</div>
    </div>
  );
}

function StepperBar({ active }: { active: number }) {
  return (
    <div style={STEPPER}>
      {UC2_STEPS.map((label, i) => (
        <div key={label} style={i < active ? STEP_DONE : i === active ? STEP_ACTIVE : STEP_PENDING}>
          {i < active ? '✓ ' : `${i + 1}. `}{label}
        </div>
      ))}
    </div>
  );
}

export function MtlsHandshake() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>mTLS — Service Mesh</h1>
          <p style={PAGE_DESC}>VM workload initiating mTLS connections to peers. Validating SVIDs against the Vault trust bundle.</p>
          <StepperBar active={3} />
          <div style={PROGRESS}><div style={PROGRESS_FILL} /></div>
          <div style={CARD}>
            <div style={CARD_TITLE}>Local identity</div>
            <div style={ROW}><span style={KEY}>SPIFFE ID</span><span style={VAL}>{SPIFFE_ID}</span></div>
            <div style={ROW}><span style={KEY}>SVID status</span><span style={BADGE_OK}>valid</span></div>
            <div style={ROW}><span style={KEY}>Trust bundle</span><span style={VAL}>loaded (offline validation)</span></div>
          </div>
          <table style={TABLE}>
            <thead>
              <tr>
                <th style={TH}>Peer service</th>
                <th style={TH}>SPIFFE ID</th>
                <th style={TH}>Handshake</th>
              </tr>
            </thead>
            <tbody>
              {mtlsPeers.map((p, i) => (
                <tr key={i}>
                  <td style={{ ...TD, fontFamily: tok.fontMono }}>{p.service}</td>
                  <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>
                    {p.spiffeId || <span style={{ color: tok.textPlaceholder }}>—</span>}
                  </td>
                  <td style={TD}><span style={BADGE_PENDING}>connecting...</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function MtlsVerified() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>mTLS — Service Mesh</h1>
          <p style={PAGE_DESC}>mTLS handshakes complete. All SPIFFE-equipped peers verified offline against the trust bundle.</p>
          <StepperBar active={3} />
          <div style={SUCCESS_BANNER}>
            <strong>mTLS verified.</strong> All connections use hardware-rooted SPIFFE identities. No static credential exchanged between any peer.
          </div>
          <table style={TABLE}>
            <thead>
              <tr>
                <th style={TH}>Peer service</th>
                <th style={TH}>SPIFFE ID</th>
                <th style={TH}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mtlsPeers.map((p, i) => (
                <tr key={i}>
                  <td style={{ ...TD, fontFamily: tok.fontMono }}>{p.service}</td>
                  <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>
                    {p.spiffeId || <span style={{ color: tok.textPlaceholder }}>—</span>}
                  </td>
                  <td style={TD}>
                    {p.status === 'verified'
                      ? <span style={BADGE_OK}>verified</span>
                      : <span style={BADGE_WARN}>no SVID (token fallback)</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={NOTE}>Services without SVIDs fall back to token auth — not broken, not yet migrated. They do not block verified peers.</p>
        </div>
      </div>
    </div>
  );
}

export function MtlsFailed() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>mTLS — Service Mesh</h1>
          <p style={PAGE_DESC}>mTLS handshake failed. Peer SVID was rejected — certificate not signed by a CA in the trust bundle.</p>
          <StepperBar active={3} />
          <div style={{ ...CARD, borderColor: tok.borderStrong }}>
            <div style={CARD_TITLE}>Handshake failure</div>
            <div style={ROW}><span style={KEY}>Peer service</span><span style={VAL}>config-service</span></div>
            <div style={ROW}><span style={KEY}>Reason</span><span style={{ fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>peer certificate not signed by a CA in the trust bundle</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_ERR}>rejected</span></div>
          </div>
          <p style={NOTE}>This fails closed — an SVID from an unknown CA is always rejected. Either the peer is using a different trust domain, or the trust bundle needs to include the peer's CA (federation). Check the bundle endpoint and peer trust domain configuration.</p>
        </div>
      </div>
    </div>
  );
}
