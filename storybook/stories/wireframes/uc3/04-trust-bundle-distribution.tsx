/**
 * 04-trust-bundle-distribution.tsx
 *
 * UC3 Kubernetes Workloads — Step 4: Trust bundle distribution and federation.
 * Vault hosts the trust bundle endpoint. Other clusters or federation partners can fetch and cache it.
 * States: BundleLive | FederationPartner | BundleStale
 */
import type { CSSProperties } from 'react';
import { tok, BUNDLE_URL, federationPartners, TRUST_DOMAIN, UC3_STEPS } from './_uc3-fixtures';

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
const CODE_BLOCK: CSSProperties = { background: tok.layer01, border: `1px solid ${tok.borderSubtle}`, borderRadius: 4, padding: '10px 14px', fontFamily: tok.fontMono, fontSize: 11, whiteSpace: 'pre' as const, overflowX: 'auto' as const, color: tok.textSecondary, lineHeight: 1.6 };
const BADGE_OK: CSSProperties   = { display: 'inline-block', padding: '2px 8px', fontSize: 11, fontFamily: tok.fontMono, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, background: tok.layer01, color: tok.textPrimary };
const BADGE_ERR: CSSProperties  = { ...BADGE_OK, fontWeight: 600 };
const TABLE: CSSProperties      = { width: '100%', borderCollapse: 'collapse' as const, fontSize: 12 };
const TH: CSSProperties         = { textAlign: 'left' as const, padding: '7px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textHelper, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.04em' };
const TD: CSSProperties         = { padding: '8px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textPrimary, verticalAlign: 'top' as const };
const NOTE: CSSProperties       = { fontSize: 12, color: tok.textHelper, marginTop: 8 };

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
      <div style={NAV_ITEM}>Auth Methods</div>
      <div style={NAV_GROUP}>System</div>
      <div style={NAV_ITEM}>Audit</div>
    </div>
  );
}

function StepperBar({ active }: { active: number }) {
  return (
    <div style={STEPPER}>
      {UC3_STEPS.map((label, i) => (
        <div key={label} style={i < active ? STEP_DONE : i === active ? STEP_ACTIVE : STEP_PENDING}>
          {i < active ? '✓ ' : `${i + 1}. `}{label}
        </div>
      ))}
    </div>
  );
}

export function TrustBundleLive() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Trust Bundle — Live</h1>
          <p style={PAGE_DESC}>Vault hosts the X.509 trust bundle at a queryable endpoint. Any verifier fetches it once and validates SVIDs locally — no runtime Vault dependency.</p>
          <StepperBar active={3} />
          <div style={CARD}>
            <div style={CARD_TITLE}>Trust bundle endpoint</div>
            <div style={ROW}><span style={KEY}>Trust domain</span><span style={VAL}>{TRUST_DOMAIN}</span></div>
            <div style={ROW}><span style={KEY}>Bundle URL</span><span style={VAL}>{BUNDLE_URL}</span></div>
            <div style={ROW}><span style={KEY}>CA key count</span><span style={VAL}>2 (current + prior, during rotation window)</span></div>
            <div style={ROW}><span style={KEY}>Last updated</span><span style={VAL}>2026-08-24T08:00:00Z (CA rotation)</span></div>
            <div style={ROW}><span style={KEY}>Format</span><span style={VAL}>SPIFFE trust bundle (JWKS + X.509 PEM)</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_OK}>live</span></div>
          </div>
          <div style={CODE_BLOCK}>{`# Fetch and inspect the trust bundle
curl ${BUNDLE_URL} | python3 -c "
import json, sys
bundle = json.load(sys.stdin)
print(f'Keys: {len(bundle[\\\"keys\\\"])}')
for k in bundle['keys']:
    print(f'  {k[\\\"use\\\"]} / {k[\\\"kty\\\"]} / {k.get(\\\"kid\\\", \\\"no-kid\\\")}')
"`}</div>
          <p style={NOTE}>During CA rotation, both old and new keys are present in the bundle. SVIDs signed by the prior CA continue to validate until they expire — zero validation gap.</p>
        </div>
      </div>
    </div>
  );
}

export function TrustBundleFederationPartner() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Trust Bundle — Federation</h1>
          <p style={PAGE_DESC}>Cross-cluster and cross-organization federation. Each partner's trust bundle is synced automatically.</p>
          <StepperBar active={3} />
          <table style={TABLE}>
            <thead>
              <tr>
                <th style={TH}>Trust domain</th>
                <th style={TH}>Bundle URL</th>
                <th style={TH}>Status</th>
              </tr>
            </thead>
            <tbody>
              {federationPartners.map((p, i) => (
                <tr key={i}>
                  <td style={{ ...TD, fontFamily: tok.fontMono }}>{p.trustDomain}</td>
                  <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>{p.bundleUrl}</td>
                  <td style={TD}><span style={BADGE_OK}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={NOTE}>
            Federation is what enables Macquarie's GCP-to-multicloud pattern: a workload attested on GCP holds a Vault-issued SVID that is accepted by on-prem services because both clusters exchange trust bundles.
          </p>
        </div>
      </div>
    </div>
  );
}

export function TrustBundleStale() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Trust Bundle — Stale</h1>
          <p style={PAGE_DESC}>A federation partner's bundle has not refreshed within the expected window. Existing SVIDs still validate but new cross-trust issuance may fail.</p>
          <StepperBar active={3} />
          <div style={{ ...CARD, borderColor: tok.borderStrong }}>
            <div style={CARD_TITLE}>Stale bundle</div>
            <div style={ROW}><span style={KEY}>Trust domain</span><span style={VAL}>partner.bank.example</span></div>
            <div style={ROW}><span style={KEY}>Last synced</span><span style={VAL}>2026-08-22T14:00:00Z (48h ago)</span></div>
            <div style={ROW}><span style={KEY}>Refresh interval</span><span style={VAL}>24h</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_ERR}>stale</span></div>
            <div style={ROW}><span style={KEY}>Reason</span><span style={{ fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>partner bundle endpoint returned 503</span></div>
          </div>
          <p style={NOTE}>Stale does not immediately break verification — cached bundle still validates existing SVIDs. If the partner rotated their CA while the bundle was stale, new SVIDs from that domain will fail until the bundle is refreshed.</p>
        </div>
      </div>
    </div>
  );
}
