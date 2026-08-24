/**
 * 05-vault-spiffe-auth.tsx
 *
 * UC2 TPM/Infra Attestation — Step 5: SVID presented to Vault SPIFFE auth method.
 * Workload re-presents its X.509 SVID to Vault → gets dynamic credentials.
 * States: AuthRequest | AuthGranted | DynamicCredential
 */
import type { CSSProperties } from 'react';
import { tok, vaultSpiffeAuthResult, SPIFFE_ID, UC2_STEPS } from './_uc2-fixtures';

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
const BADGE_PENDING: CSSProperties = { ...BADGE_OK, color: tok.textHelper };
const TWO_COL: CSSProperties    = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };
const NOTE: CSSProperties       = { fontSize: 12, color: tok.textHelper, marginTop: 8 };
const PROGRESS: CSSProperties   = { height: 3, background: tok.borderSubtle, borderRadius: 2, overflow: 'hidden' as const, marginBottom: 16 };
const PROGRESS_FILL: CSSProperties = { height: '100%', width: '88%', background: tok.textSecondary, borderRadius: 2 };

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
      <div style={NAV_ITEM}>Entities</div>
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

export function VaultSpiffeAuthRequest() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Vault SPIFFE Auth — Request</h1>
          <p style={PAGE_DESC}>Workload re-presents its X.509 SVID to the Vault SPIFFE auth method to obtain dynamic credentials.</p>
          <StepperBar active={4} />
          <div style={PROGRESS}><div style={PROGRESS_FILL} /></div>
          <div style={CARD}>
            <div style={CARD_TITLE}>Auth request</div>
            <div style={ROW}><span style={KEY}>Auth method</span><span style={VAL}>auth/spiffe/login</span></div>
            <div style={ROW}><span style={KEY}>SPIFFE ID</span><span style={VAL}>{SPIFFE_ID}</span></div>
            <div style={ROW}><span style={KEY}>SVID format</span><span style={VAL}>X.509 (TLS client cert)</span></div>
            <div style={ROW}><span style={KEY}>Checking</span><span style={VAL}>SVID signature, trust bundle, SPIFFE ID → entity mapping</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_PENDING}>evaluating...</span></div>
          </div>
          <p style={NOTE}>Vault validates the SVID against the trust bundle offline. No callback to Vault at validation time — trust scales by signature.</p>
        </div>
      </div>
    </div>
  );
}

export function VaultSpiffeAuthGranted() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Vault SPIFFE Auth — Granted</h1>
          <p style={PAGE_DESC}>Vault mapped the SPIFFE ID to an entity and applied the associated policy. Vault token issued.</p>
          <StepperBar active={4} />
          <div style={TWO_COL}>
            <div style={CARD}>
              <div style={CARD_TITLE}>Auth result</div>
              <div style={ROW}><span style={KEY}>SPIFFE ID</span><span style={VAL}>{SPIFFE_ID}</span></div>
              <div style={ROW}><span style={KEY}>Entity</span><span style={VAL}>{vaultSpiffeAuthResult.entity}</span></div>
              <div style={ROW}><span style={KEY}>Policy applied</span><span style={VAL}>{vaultSpiffeAuthResult.policy}</span></div>
              <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_OK}>granted</span></div>
            </div>
            <div style={CARD}>
              <div style={CARD_TITLE}>Accessible paths</div>
              <div style={ROW}><span style={KEY}>DB credentials</span><span style={VAL}>kv/data/infra/db-creds [read]</span></div>
              <div style={ROW}><span style={KEY}>PKI certs</span><span style={VAL}>pki/issue/infra-vm [create]</span></div>
              <div style={ROW}><span style={KEY}>SSH certs</span><span style={VAL}>ssh/sign/infra-vm [create]</span></div>
            </div>
          </div>
          <p style={NOTE}>The SPIFFE ID is the identity thread. Vault's HCL policy engine governs what this identity can access across secrets, PKI, SSH, and cloud credentials — all from one control plane.</p>
        </div>
      </div>
    </div>
  );
}

export function VaultSpiffeDynamicCredential() {
  const { dynamicCred } = vaultSpiffeAuthResult;
  const credSnippet = `{
  "data": {
    "username": "${dynamicCred.username}",
    "password": "<redacted>",
    "lease_duration": "${dynamicCred.lease}",
    "renewable": true,
    "revocable": ${dynamicCred.revokable}
  },
  "lease_id": "database/creds/infra-vm/a1b2c3d4",
  "warnings": null
}`;
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Dynamic Credential — Issued</h1>
          <p style={PAGE_DESC}>Vault issued a short-lived database credential scoped to this workload identity. No static password stored anywhere.</p>
          <StepperBar active={4} />
          <div style={CARD}>
            <div style={CARD_TITLE}>Credential details</div>
            <div style={ROW}><span style={KEY}>Identity</span><span style={VAL}>{SPIFFE_ID}</span></div>
            <div style={ROW}><span style={KEY}>Username</span><span style={VAL}>{dynamicCred.username}</span></div>
            <div style={ROW}><span style={KEY}>Lease</span><span style={VAL}>{dynamicCred.lease} (auto-renewed)</span></div>
            <div style={ROW}><span style={KEY}>Revocable</span><span style={VAL}>yes — revoke by SPIFFE ID, lease, or entity</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_OK}>issued</span></div>
          </div>
          <div style={CARD_TITLE}>Response payload</div>
          <div style={CODE_BLOCK}>{credSnippet}</div>
          <p style={NOTE}>SPIRE stops at the SVID. Vault continues: dynamic credentials, auto-rotation, revocation by identity, and a full audit trail — all from the same control plane.</p>
        </div>
      </div>
    </div>
  );
}
