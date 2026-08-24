/**
 * 01-ek-enrollment.tsx
 *
 * UC2 TPM/Infra Attestation — Step 1: EK enrollment.
 * Platform admin pre-registers the TPM Endorsement Key before the VM can attest.
 * States: EkRegistryEmpty | EkRegistered | EkConflict
 */
import type { CSSProperties } from 'react';
import { tok, ekRegistryEntry, EK_FINGERPRINT, HOST_ID, UC2_STEPS } from './_uc2-fixtures';

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
const CODE_BLOCK: CSSProperties = { background: tok.layer01, border: `1px solid ${tok.borderSubtle}`, borderRadius: 4, padding: '10px 14px', fontFamily: tok.fontMono, fontSize: 11, whiteSpace: 'pre' as const, overflowX: 'auto' as const, color: tok.textSecondary, lineHeight: 1.6 };
const BADGE_OK: CSSProperties   = { display: 'inline-block', padding: '2px 8px', fontSize: 11, fontFamily: tok.fontMono, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, background: tok.layer01, color: tok.textPrimary };
const BADGE_ERR: CSSProperties  = { ...BADGE_OK, fontWeight: 600 };
const BTN: CSSProperties        = { padding: '7px 14px', fontSize: 13, fontWeight: 500, border: `1.5px solid ${tok.borderStrong}`, borderRadius: 4, background: tok.textPrimary, color: tok.bg, cursor: 'pointer' };
const EMPTY_STATE: CSSProperties = { padding: '40px 0', textAlign: 'center' as const, color: tok.textHelper, fontSize: 13 };
const NOTE: CSSProperties       = { fontSize: 12, color: tok.textHelper, marginTop: 8 };
const LABEL: CSSProperties      = { display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4, color: tok.textSecondary };
const INPUT: CSSProperties      = { width: '100%', padding: '7px 10px', fontSize: 13, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, background: tok.bg, color: tok.textPrimary, boxSizing: 'border-box' as const, fontFamily: tok.fontMono };
const FIELD: CSSProperties      = { marginBottom: 14 };
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

export function EkRegistryEmpty() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>TPM Node Registry — EK Enrollment</h1>
          <p style={PAGE_DESC}>Register Endorsement Keys before VMs can attest. Only pre-registered EKs are accepted at attestation time.</p>
          <StepperBar active={0} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button style={BTN}>+ Register EK</button>
          </div>
          <div style={EMPTY_STATE}>
            No EKs registered yet.<br />
            <span style={{ fontSize: 11 }}>Register at least one EK before your VMs can attest. EKs come from the TPM manufacturer certificate chain.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EkRegistered() {
  const hosts = [ekRegistryEntry, { hostId: 'vmware-esxi-node-08', ekFingerprint: 'SHA256:9b:f3:21:aa:...', platform: 'VMware ESXi 8.0', location: 'on-prem / DC-APAC-1', registeredBy: 'admin:platform-team', registeredAt: '2026-08-01T00:00:00Z' }];
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>TPM Node Registry — EK Enrollment</h1>
          <p style={PAGE_DESC}>Registered hosts. Only these nodes can complete TPM attestation and receive an SVID.</p>
          <StepperBar active={0} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button style={BTN}>+ Register EK</button>
          </div>
          <table style={TABLE}>
            <thead>
              <tr>
                <th style={TH}>Host ID</th>
                <th style={TH}>EK fingerprint</th>
                <th style={TH}>Platform</th>
                <th style={TH}>Location</th>
                <th style={TH}>Registered by</th>
                <th style={TH}>Status</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((h, i) => (
                <tr key={i}>
                  <td style={{ ...TD, fontFamily: tok.fontMono }}>{h.hostId}</td>
                  <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11 }}>{h.ekFingerprint}</td>
                  <td style={{ ...TD, fontSize: 12 }}>{h.platform}</td>
                  <td style={{ ...TD, fontSize: 12, color: tok.textSecondary }}>{h.location}</td>
                  <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>{h.registeredBy}</td>
                  <td style={TD}><span style={BADGE_OK}>enrolled</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={NOTE}>EK registration is a one-time admin action per host. After registration, Vault Agent handles all subsequent attestations automatically.</p>
        </div>
      </div>
    </div>
  );
}

export function EkConflict() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>TPM Node Registry — EK Enrollment</h1>
          <p style={PAGE_DESC}>Register a new host EK. Fill in host ID and paste the EK certificate PEM.</p>
          <StepperBar active={0} />
          <div style={TWO_COL}>
            <div style={FIELD}>
              <label style={LABEL}>Host ID</label>
              <input style={{ ...INPUT, borderColor: tok.borderStrong }} value={HOST_ID} readOnly />
              <div style={{ fontSize: 11, color: tok.textHelper, marginTop: 3, fontStyle: 'italic' }}>
                Host ID already registered. Use a unique identifier per node.
              </div>
            </div>
            <div style={FIELD}>
              <label style={LABEL}>EK fingerprint</label>
              <input style={INPUT} value={EK_FINGERPRINT} readOnly />
            </div>
          </div>
          <div style={FIELD}>
            <label style={LABEL}>EK certificate (PEM)</label>
            <textarea style={{ ...INPUT, height: 80, resize: 'vertical' as const }} placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----" readOnly />
          </div>
          <button style={{ ...BTN, opacity: 0.45, cursor: 'default' }}>Register</button>
          <p style={NOTE}>Each host ID must be unique. For TPM replacement or re-imaging, delete the old entry first.</p>
        </div>
      </div>
    </div>
  );
}
