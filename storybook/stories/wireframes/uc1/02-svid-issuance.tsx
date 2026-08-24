/**
 * 02-svid-issuance.tsx
 *
 * UC1 Agentic Identity — Step 2: JWT-SVID issuance.
 * Vault issues a short-lived JWT-SVID to the attested agent. No Vault token.
 * States: JwtSvidIssued | SvidExpired
 */
import type { CSSProperties } from 'react';
import { tok, AGENT_ID, VAULT_ADDR, ENGINE_PATH, UC1_STEPS } from './_uc1-fixtures';

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
      <div style={NAV_ITEM}>Secrets Engines</div>
      <div style={NAV_ITEM_ACTIVE}>SPIFFE (spiffe/)</div>
      <div style={NAV_GROUP}>Access</div>
      <div style={NAV_ITEM}>Auth Methods</div>
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

export function JwtSvidIssued() {
  const jwtSnippet = `{
  "iss": "${VAULT_ADDR}/v1/${ENGINE_PATH}",
  "sub": "${AGENT_ID}",
  "aud": ["https://as.corp.example"],
  "iat": 1724493600,
  "exp": 1724494500,
  "spiffe_id": "${AGENT_ID}"
}`;

  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>JWT-SVID Issued</h1>
          <p style={PAGE_DESC}>Vault issued a short-lived JWT-SVID directly from node attestation. No Vault token in this path.</p>
          <StepperBar active={1} />
          <div style={CARD}>
            <div style={CARD_TITLE}>JWT-SVID details</div>
            <div style={ROW}><span style={KEY}>SPIFFE ID</span><span style={VAL}>{AGENT_ID}</span></div>
            <div style={ROW}><span style={KEY}>Issuer</span><span style={VAL}>{VAULT_ADDR}/v1/{ENGINE_PATH}</span></div>
            <div style={ROW}><span style={KEY}>Audience</span><span style={VAL}>https://as.corp.example</span></div>
            <div style={ROW}><span style={KEY}>TTL</span><span style={VAL}>15m</span></div>
            <div style={ROW}><span style={KEY}>SVID type</span><span style={VAL}>JWT</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_OK}>valid</span></div>
          </div>
          <div style={CARD_TITLE}>JWT payload (decoded)</div>
          <div style={CODE_BLOCK}>{jwtSnippet}</div>
          <p style={NOTE}>The SVID is the only credential the agent holds. It presents this to the Authorization Server — not to Vault directly.</p>
        </div>
      </div>
    </div>
  );
}

export function JwtSvidExpired() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>JWT-SVID Issued</h1>
          <p style={PAGE_DESC}>SVID has expired. Agent must re-attest to get a fresh identity credential.</p>
          <StepperBar active={1} />
          <div style={{ ...CARD, borderColor: tok.borderStrong }}>
            <div style={CARD_TITLE}>JWT-SVID status</div>
            <div style={ROW}><span style={KEY}>SPIFFE ID</span><span style={VAL}>{AGENT_ID}</span></div>
            <div style={ROW}><span style={KEY}>TTL</span><span style={VAL}>15m (elapsed)</span></div>
            <div style={ROW}><span style={KEY}>Expired at</span><span style={VAL}>2026-08-24T09:15:00Z</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_ERR}>expired</span></div>
          </div>
          <p style={NOTE}>Re-attestation is automatic when Vault Agent is running. Short TTLs limit blast radius — an expired SVID cannot be replayed.</p>
        </div>
      </div>
    </div>
  );
}
