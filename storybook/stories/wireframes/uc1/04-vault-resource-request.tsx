/**
 * 04-vault-resource-request.tsx
 *
 * UC1 Agentic Identity — Step 4: Agent presents OAuth JWT to Vault resource server.
 * No Vault token. JWT evaluated per-request: RAR claims, agent registry, policy intersection.
 * States: RequestPending | SecretDelivered | PolicyDenied
 */
import type { CSSProperties } from 'react';
import { tok, AGENT_ID, USER_SUBJECT, VAULT_ADDR, vaultResourceResponse, UC1_STEPS } from './_uc1-fixtures';

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
const PROGRESS: CSSProperties  = { height: 3, background: tok.borderSubtle, borderRadius: 2, overflow: 'hidden' as const, marginBottom: 16 };
const PROGRESS_FILL: CSSProperties = { height: '100%', width: '80%', background: tok.textSecondary, borderRadius: 2 };
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

export function VaultResourceRequestPending() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Vault Resource Server — Request</h1>
          <p style={PAGE_DESC}>Agent presents OAuth JWT directly to Vault. No Vault token exchanged. Vault evaluates per-request.</p>
          <StepperBar active={3} />
          <div style={PROGRESS}><div style={PROGRESS_FILL} /></div>
          <div style={CARD}>
            <div style={CARD_TITLE}>Evaluation in progress</div>
            <div style={ROW}><span style={KEY}>Agent identity</span><span style={VAL}>{AGENT_ID}</span></div>
            <div style={ROW}><span style={KEY}>Acting for</span><span style={VAL}>{USER_SUBJECT}</span></div>
            <div style={ROW}><span style={KEY}>Requested path</span><span style={VAL}>kv/data/pipeline/db-creds</span></div>
            <div style={ROW}><span style={KEY}>Checking</span><span style={VAL}>JWT signature, expiry, RAR claims, agent registry, policy</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_PENDING}>evaluating...</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VaultResourceSecretDelivered() {
  const { secret, auditLine } = vaultResourceResponse;
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Vault Resource Server — Response</h1>
          <p style={PAGE_DESC}>Secret delivered. Scoped to the RAR claim. Lease enforced. Audit trail complete.</p>
          <StepperBar active={3} />
          <div style={CARD}>
            <div style={CARD_TITLE}>Secret delivered</div>
            <div style={ROW}><span style={KEY}>Agent identity</span><span style={VAL}>{AGENT_ID}</span></div>
            <div style={ROW}><span style={KEY}>Acting for</span><span style={VAL}>{USER_SUBJECT}</span></div>
            <div style={ROW}><span style={KEY}>Path</span><span style={VAL}>{vaultResourceResponse.path}</span></div>
            <div style={ROW}><span style={KEY}>Username</span><span style={VAL}>{secret.username}</span></div>
            <div style={ROW}><span style={KEY}>Password</span><span style={VAL}>{'<redacted — delivered to agent>'}</span></div>
            <div style={ROW}><span style={KEY}>Lease</span><span style={VAL}>{secret.lease}</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_OK}>allowed</span></div>
          </div>
          <div style={CARD_TITLE}>Audit entry</div>
          <div style={CODE_BLOCK}>{auditLine}</div>
          <p style={NOTE}>The agent held no standing credential. The OAuth JWT expired after 5 minutes. The audit log records agent, user, path, action, and decision in a single entry.</p>
        </div>
      </div>
    </div>
  );
}

export function VaultResourcePolicyDenied() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Vault Resource Server — Response</h1>
          <p style={PAGE_DESC}>Request denied. Agent ceiling policy does not permit the requested path.</p>
          <StepperBar active={3} />
          <div style={{ ...CARD, borderColor: tok.borderStrong }}>
            <div style={CARD_TITLE}>Policy denial</div>
            <div style={ROW}><span style={KEY}>Agent identity</span><span style={VAL}>{AGENT_ID}</span></div>
            <div style={ROW}><span style={KEY}>Acting for</span><span style={VAL}>{USER_SUBJECT}</span></div>
            <div style={ROW}><span style={KEY}>Requested path</span><span style={VAL}>kv/data/pipeline/admin-creds</span></div>
            <div style={ROW}><span style={KEY}>Ceiling policy</span><span style={VAL}>policy/agent-data-pipeline</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_ERR}>denied</span></div>
            <div style={ROW}><span style={KEY}>Reason</span><span style={{ fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>path not permitted by agent ceiling policy</span></div>
          </div>
          <p style={NOTE}>
            Policy intersection: the effective permission is the subject baseline intersected with the agent ceiling.
            The user may be allowed to read admin-creds, but the agent ceiling does not include that path.
            The confused deputy attack is blocked here.
          </p>
        </div>
      </div>
    </div>
  );
}
