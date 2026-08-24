/**
 * 03-x509-svid-issued.tsx
 *
 * UC2 TPM/Infra Attestation — Step 3: X.509 SVID issued.
 * Vault issues an X.509 SVID (certificate with SPIFFE ID as URI SAN) directly from attestation.
 * States: SvidIssued | SvidDetails
 */
import type { CSSProperties } from 'react';
import { tok, svidDetails, SPIFFE_ID, UC2_STEPS } from './_uc2-fixtures';

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
const TWO_COL: CSSProperties    = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };
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
      <div style={NAV_ITEM}>TPM / Node Registry</div>
      <div style={NAV_ITEM}>Auth Methods</div>
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

export function X509SvidIssued() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>X.509 SVID Issued</h1>
          <p style={PAGE_DESC}>Vault issued an X.509 SVID directly from TPM attestation. The SPIFFE ID is embedded as a URI SAN.</p>
          <StepperBar active={2} />
          <div style={CARD}>
            <div style={CARD_TITLE}>SVID summary</div>
            <div style={ROW}><span style={KEY}>SPIFFE ID (URI SAN)</span><span style={VAL}>{SPIFFE_ID}</span></div>
            <div style={ROW}><span style={KEY}>Issued at</span><span style={VAL}>{svidDetails.issuedAt}</span></div>
            <div style={ROW}><span style={KEY}>Expires at</span><span style={VAL}>{svidDetails.expiresAt}</span></div>
            <div style={ROW}><span style={KEY}>TTL</span><span style={VAL}>1h (auto-renewed by Vault Agent)</span></div>
            <div style={ROW}><span style={KEY}>Key algorithm</span><span style={VAL}>{svidDetails.keyAlg}</span></div>
            <div style={ROW}><span style={KEY}>Issuer</span><span style={VAL}>{svidDetails.issuer}</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_OK}>valid</span></div>
          </div>
          <p style={NOTE}>This X.509 SVID is the workload's durable identity. No Vault token was produced. The SVID can be used for mTLS, Vault SPIFFE auth, or SPIFFE federation.</p>
        </div>
      </div>
    </div>
  );
}

export function X509SvidDetails() {
  const certSnippet = `Subject: (empty — SPIFFE IDs go in SAN)
URI SAN: ${SPIFFE_ID}
Serial: ${svidDetails.serial}
Not Before: ${svidDetails.issuedAt}
Not After:  ${svidDetails.expiresAt}
Key Usage: digitalSignature, keyAgreement
Extended Key Usage: serverAuth, clientAuth
CA: false (leaf certificate — SPIFFE spec)
Issuer: CN=Intermediate CA (${svidDetails.issuer})`;

  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>X.509 SVID — Certificate Detail</h1>
          <p style={PAGE_DESC}>Full certificate fields. SPIFFE spec: one URI SAN, cA=false, digitalSignature + serverAuth + clientAuth.</p>
          <StepperBar active={2} />
          <div style={TWO_COL}>
            <div style={CARD}>
              <div style={CARD_TITLE}>Certificate fields</div>
              <div style={ROW}><span style={KEY}>SPIFFE ID</span><span style={VAL}>{SPIFFE_ID}</span></div>
              <div style={ROW}><span style={KEY}>Serial</span><span style={VAL}>{svidDetails.serial}</span></div>
              <div style={ROW}><span style={KEY}>Key algorithm</span><span style={VAL}>{svidDetails.keyAlg}</span></div>
              <div style={ROW}><span style={KEY}>CA</span><span style={VAL}>false (leaf)</span></div>
              <div style={ROW}><span style={KEY}>Fingerprint</span><span style={VAL}>{svidDetails.fingerprint}</span></div>
            </div>
            <div style={CARD}>
              <div style={CARD_TITLE}>Files written by Vault Agent</div>
              <div style={ROW}><span style={KEY}>Certificate</span><span style={VAL}>/run/spiffe/svid.pem</span></div>
              <div style={ROW}><span style={KEY}>Private key</span><span style={VAL}>/run/spiffe/key.pem</span></div>
              <div style={ROW}><span style={KEY}>Trust bundle</span><span style={VAL}>/run/spiffe/bundle.pem</span></div>
              <div style={ROW}><span style={KEY}>Auto-renewal</span><span style={VAL}>at 70% of TTL</span></div>
            </div>
          </div>
          <div style={CARD_TITLE}>openssl output</div>
          <div style={CODE_BLOCK}>{certSnippet}</div>
        </div>
      </div>
    </div>
  );
}
