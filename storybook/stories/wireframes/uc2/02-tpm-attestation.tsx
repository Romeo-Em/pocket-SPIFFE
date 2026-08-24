/**
 * 02-tpm-attestation.tsx
 *
 * UC2 TPM/Infra Attestation — Step 2: TPM attestation.
 * Vault Agent on the VM presents the TPM EK cert + quote. Vault validates and proceeds to SVID issuance.
 * States: AttestationInProgress | AttestationComplete | AttestationFailed
 */
import type { CSSProperties } from 'react';
import { tok, attestationResult, HOST_ID, EK_FINGERPRINT, UC2_STEPS } from './_uc2-fixtures';

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
const PROGRESS_FILL: CSSProperties = { height: '100%', width: '50%', background: tok.textSecondary, borderRadius: 2 };
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
      <div style={NAV_ITEM}>SPIFFE (spiffe/)</div>
      <div style={NAV_GROUP}>Access</div>
      <div style={NAV_ITEM_ACTIVE}>TPM / Node Registry</div>
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

export function TpmAttestationInProgress() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>TPM Attestation</h1>
          <p style={PAGE_DESC}>Vault Agent presented TPM EK certificate and quote. Vault is validating hardware identity.</p>
          <StepperBar active={1} />
          <div style={PROGRESS}><div style={PROGRESS_FILL} /></div>
          <div style={CARD}>
            <div style={CARD_TITLE}>Attestation in progress</div>
            <div style={ROW}><span style={KEY}>Host ID</span><span style={VAL}>{HOST_ID}</span></div>
            <div style={ROW}><span style={KEY}>TPM version</span><span style={VAL}>TPM 2.0</span></div>
            <div style={ROW}><span style={KEY}>EK fingerprint</span><span style={VAL}>{EK_FINGERPRINT}</span></div>
            <div style={ROW}><span style={KEY}>Checking</span><span style={VAL}>EK cert chain, quote signature, PCR state</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_PENDING}>validating...</span></div>
          </div>
          <p style={NOTE}>No secret pre-placed on this VM. The TPM hardware chip is the only credential. If the EK is in the registry and the quote verifies, Vault will proceed to SVID issuance.</p>
        </div>
      </div>
    </div>
  );
}

export function TpmAttestationComplete() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>TPM Attestation</h1>
          <p style={PAGE_DESC}>Attestation complete. Hardware identity validated. Vault will now issue an X.509 SVID.</p>
          <StepperBar active={1} />
          <div style={CARD}>
            <div style={CARD_TITLE}>Attestation result</div>
            <div style={ROW}><span style={KEY}>Host ID</span><span style={VAL}>{attestationResult.hostId}</span></div>
            <div style={ROW}><span style={KEY}>TPM version</span><span style={VAL}>{attestationResult.tpmVersion}</span></div>
            <div style={ROW}><span style={KEY}>EK cert</span><span style={VAL}>{attestationResult.ekCert}</span></div>
            <div style={ROW}><span style={KEY}>Assigned SPIFFE ID</span><span style={VAL}>{attestationResult.spiffeId}</span></div>
            <div style={ROW}><span style={KEY}>SVID type</span><span style={VAL}>{attestationResult.svidType}</span></div>
            <div style={ROW}><span style={KEY}>TTL</span><span style={VAL}>{attestationResult.ttl}</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_OK}>attested</span></div>
          </div>
          <p style={NOTE}>Secret Zero eliminated. The VM proved identity through hardware alone. Next: Vault issues the X.509 SVID.</p>
        </div>
      </div>
    </div>
  );
}

export function TpmAttestationFailed() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>TPM Attestation</h1>
          <p style={PAGE_DESC}>Attestation failed. Hardware identity could not be verified.</p>
          <StepperBar active={1} />
          <div style={{ ...CARD, borderColor: tok.borderStrong }}>
            <div style={CARD_TITLE}>Attestation error</div>
            <div style={ROW}><span style={KEY}>Host ID</span><span style={VAL}>vmware-esxi-node-99</span></div>
            <div style={ROW}><span style={KEY}>EK fingerprint</span><span style={VAL}>SHA256:xx:xx:xx:...</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_ERR}>failed</span></div>
            <div style={ROW}><span style={KEY}>Reason</span><span style={{ fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>EK not in registry — enroll this host before attestation</span></div>
          </div>
          <div style={CODE_BLOCK}>{`# Register the EK first:
vault write auth/tpm/ek \\
  host_id="vmware-esxi-node-99" \\
  ek_certificate=@/path/to/ek.pem`}</div>
        </div>
      </div>
    </div>
  );
}
