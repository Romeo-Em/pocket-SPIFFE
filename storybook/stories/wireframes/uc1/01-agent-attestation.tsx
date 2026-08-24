/**
 * 01-agent-attestation.tsx
 *
 * UC1 Agentic Identity — Step 1: Node attestation.
 * The agent process presents cloud/TPM metadata; Vault validates and prepares to issue a JWT-SVID.
 * States: Attesting | NodeIdentityIssued | AttestationFailed
 */
import type { CSSProperties } from 'react';
import { tok, attestationResult, VAULT_ADDR, UC1_STEPS } from './_uc1-fixtures';

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
const PROGRESS_FILL: CSSProperties = { height: '100%', width: '60%', background: tok.textSecondary, borderRadius: 2 };

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

export function AgentAttestationAttesting() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Node Attestation</h1>
          <p style={PAGE_DESC}>Vault Agent is presenting cloud instance metadata. Validating identity claim against registered nodes.</p>
          <StepperBar active={0} />
          <div style={PROGRESS}><div style={PROGRESS_FILL} /></div>
          <div style={CARD}>
            <div style={CARD_TITLE}>Attestation request</div>
            <div style={ROW}><span style={KEY}>Node ID</span><span style={VAL}>gcp-instance-a3f7</span></div>
            <div style={ROW}><span style={KEY}>Attestor</span><span style={VAL}>GCP instance metadata</span></div>
            <div style={ROW}><span style={KEY}>Instance resource</span><span style={VAL}>projects/corp-prod/zones/us-central1-a/instances/a3f7</span></div>
            <div style={ROW}><span style={KEY}>Vault address</span><span style={VAL}>{VAULT_ADDR}</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_PENDING}>validating...</span></div>
          </div>
          <div style={{ fontSize: 12, color: tok.textHelper }}>Checking instance metadata signature against GCP root of trust. No standing credential presented.</div>
        </div>
      </div>
    </div>
  );
}

export function AgentAttestationNodeIdentityIssued() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Node Attestation</h1>
          <p style={PAGE_DESC}>Attestation complete. Node identity validated. JWT-SVID ready for issuance.</p>
          <StepperBar active={0} />
          <div style={CARD}>
            <div style={CARD_TITLE}>Attestation result</div>
            <div style={ROW}><span style={KEY}>Node ID</span><span style={VAL}>{attestationResult.nodeId}</span></div>
            <div style={ROW}><span style={KEY}>Attestor</span><span style={VAL}>{attestationResult.attestor}</span></div>
            <div style={ROW}><span style={KEY}>Assigned SPIFFE ID</span><span style={VAL}>{attestationResult.spiffeId}</span></div>
            <div style={ROW}><span style={KEY}>Issued at</span><span style={VAL}>{attestationResult.issuedAt}</span></div>
            <div style={ROW}><span style={KEY}>SVID type</span><span style={VAL}>{attestationResult.svid}</span></div>
            <div style={ROW}><span style={KEY}>TTL</span><span style={VAL}>{attestationResult.ttl}</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_OK}>attested</span></div>
          </div>
          <div style={{ fontSize: 12, color: tok.textHelper, marginTop: 4 }}>
            No Vault token issued. The JWT-SVID is the identity artifact. Next: present SVID to Authorization Server.
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentAttestationFailed() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Node Attestation</h1>
          <p style={PAGE_DESC}>Attestation failed. Node identity could not be validated.</p>
          <StepperBar active={0} />
          <div style={{ ...CARD, borderColor: tok.borderStrong }}>
            <div style={CARD_TITLE}>Attestation error</div>
            <div style={ROW}><span style={KEY}>Node ID</span><span style={VAL}>gcp-instance-unknown</span></div>
            <div style={ROW}><span style={KEY}>Attestor</span><span style={VAL}>GCP instance metadata</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_ERR}>failed</span></div>
            <div style={ROW}><span style={KEY}>Reason</span><span style={{ fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>node not registered in Vault agent registry</span></div>
          </div>
          <div style={CODE_BLOCK}>{`# Resolution: register the node before attesting
vault write spiffe/node/register \\
  node_id="gcp-instance-unknown" \\
  attestor="gcp" \\
  spiffe_id_template="spiffe://corp.example/agent/{{.node_id}}"`}</div>
        </div>
      </div>
    </div>
  );
}
