/**
 * 03-token-exchange.tsx
 *
 * UC1 Agentic Identity — Step 3: Token Exchange at Authorization Server.
 * Agent presents JWT-SVID + user context. AS validates, mints scoped OAuth JWT (RAR).
 * States: ExchangeRequest | OAuthJwtMinted | ExchangeDenied
 */
import type { CSSProperties } from 'react';
import { tok, AGENT_ID, USER_SUBJECT, AS_ENDPOINT, VAULT_ADDR, oauthJwt, UC1_STEPS } from './_uc1-fixtures';

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
const BADGE_PENDING: CSSProperties = { ...BADGE_OK, color: tok.textHelper };
const NOTE: CSSProperties       = { fontSize: 12, color: tok.textHelper, marginTop: 8 };
const TWO_COL: CSSProperties    = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };

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

export function TokenExchangeRequest() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Token Exchange — AS</h1>
          <p style={PAGE_DESC}>Agent presents JWT-SVID + user context to the Authorization Server. AS validates against Vault trust bundle before minting an OAuth JWT.</p>
          <StepperBar active={2} />
          <div style={TWO_COL}>
            <div style={CARD}>
              <div style={CARD_TITLE}>Subject token (agent)</div>
              <div style={ROW}><span style={KEY}>Type</span><span style={VAL}>JWT-SVID</span></div>
              <div style={ROW}><span style={KEY}>SPIFFE ID</span><span style={VAL}>{AGENT_ID}</span></div>
              <div style={ROW}><span style={KEY}>Issuer</span><span style={VAL}>{VAULT_ADDR}/v1/spiffe</span></div>
              <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_PENDING}>validating...</span></div>
            </div>
            <div style={CARD}>
              <div style={CARD_TITLE}>Actor token (user)</div>
              <div style={ROW}><span style={KEY}>Type</span><span style={VAL}>OIDC JWT</span></div>
              <div style={ROW}><span style={KEY}>Subject</span><span style={VAL}>{USER_SUBJECT}</span></div>
              <div style={ROW}><span style={KEY}>Issuer</span><span style={VAL}>https://idp.corp.example</span></div>
              <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_PENDING}>validating...</span></div>
            </div>
          </div>
          <div style={CARD}>
            <div style={CARD_TITLE}>Authorization Server</div>
            <div style={ROW}><span style={KEY}>Endpoint</span><span style={VAL}>{AS_ENDPOINT}</span></div>
            <div style={ROW}><span style={KEY}>Checking</span><span style={VAL}>agent registry status, ceiling policy, RAR claims</span></div>
          </div>
          <p style={NOTE}>The AS validates the JWT-SVID against the Vault JWKS endpoint before proceeding. No Vault token involved.</p>
        </div>
      </div>
    </div>
  );
}

export function TokenExchangeOAuthJwtMinted() {
  const jwtSnippet = `{
  "iss": "${AS_ENDPOINT}",
  "sub": "${AGENT_ID}",
  "act": { "sub": "${USER_SUBJECT}" },
  "aud": "${VAULT_ADDR}",
  "exp": ${Math.floor(Date.now() / 1000) + 300},
  "authorization_details": [{
    "type": "vault_secret",
    "path": "kv/data/pipeline/db-creds",
    "actions": ["read"]
  }]
}`;

  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Token Exchange — AS</h1>
          <p style={PAGE_DESC}>Authorization Server minted a scoped, short-lived OAuth JWT. Agent holds this per-task credential. No standing access.</p>
          <StepperBar active={2} />
          <div style={CARD}>
            <div style={CARD_TITLE}>Minted OAuth JWT</div>
            <div style={ROW}><span style={KEY}>Subject (agent)</span><span style={VAL}>{AGENT_ID}</span></div>
            <div style={ROW}><span style={KEY}>Actor (user)</span><span style={VAL}>{USER_SUBJECT}</span></div>
            <div style={ROW}><span style={KEY}>Audience</span><span style={VAL}>{VAULT_ADDR}</span></div>
            <div style={ROW}><span style={KEY}>TTL</span><span style={VAL}>5m (per-task)</span></div>
            <div style={ROW}><span style={KEY}>Scoped to</span><span style={VAL}>kv/data/pipeline/db-creds [read]</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_OK}>issued</span></div>
          </div>
          <div style={CARD_TITLE}>JWT payload (decoded)</div>
          <div style={CODE_BLOCK}>{jwtSnippet}</div>
          <p style={NOTE}>The agent presents this JWT directly to Vault per request. It expires in 5 minutes. No reuse across tasks.</p>
        </div>
      </div>
    </div>
  );
}

export function TokenExchangeDenied() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Token Exchange — AS</h1>
          <p style={PAGE_DESC}>Token exchange denied. The AS rejected the request based on registry or policy check.</p>
          <StepperBar active={2} />
          <div style={{ ...CARD, borderColor: tok.borderStrong }}>
            <div style={CARD_TITLE}>Exchange error</div>
            <div style={ROW}><span style={KEY}>Agent SPIFFE ID</span><span style={VAL}>{AGENT_ID}</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_ERR}>denied</span></div>
            <div style={ROW}><span style={KEY}>Reason</span><span style={{ fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>agent not active in registry — status: suspended</span></div>
          </div>
          <p style={NOTE}>The AS checks the Vault Agent Registry before minting. A suspended agent cannot exchange even a valid JWT-SVID. Check the Agent Registry to restore access.</p>
        </div>
      </div>
    </div>
  );
}
