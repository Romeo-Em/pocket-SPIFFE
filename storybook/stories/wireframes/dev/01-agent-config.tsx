/**
 * 01-agent-config.tsx
 *
 * App Developer — Step 1: Write Vault Agent config for SVID minting.
 * States: Default (empty) | FilledValid | MissingRole | MissingTemplate
 */
import type { CSSProperties } from 'react';
import {
  tok, ROLE_NAME, ENGINE_PATH, VAULT_ADDR, K8S_SA, K8S_NAMESPACE,
  AGENT_CONFIG_HCL, DEV_STEPS,
} from './_dev-fixtures';

/* ── Layout constants ────────────────────────────────────────── */

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
  padding: '16px 0', flexShrink: 0, overflowY: 'auto',
};
const BODY: CSSProperties    = { flex: 1, display: 'flex', overflow: 'hidden' };
const MAIN: CSSProperties    = { flex: 1, padding: '24px 28px', overflowY: 'auto' };
const PAGE_TITLE: CSSProperties = { fontSize: 18, fontWeight: 600, margin: 0 };
const PAGE_DESC: CSSProperties = { fontSize: 13, color: tok.textSecondary, marginTop: 4, marginBottom: 20 };
const NAV_ITEM: CSSProperties = { padding: '6px 16px', fontSize: 13, color: tok.textSecondary, cursor: 'pointer' };
const NAV_ITEM_ACTIVE: CSSProperties = { ...NAV_ITEM, color: tok.textPrimary, fontWeight: 600, background: tok.layer02, borderLeft: `3px solid ${tok.textPrimary}`, paddingLeft: 13 };
const NAV_GROUP: CSSProperties = { padding: '12px 16px 4px', fontSize: 10, fontFamily: tok.fontMono, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: tok.textHelper };
const LABEL: CSSProperties = { display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4, color: tok.textSecondary };
const INPUT: CSSProperties = { width: '100%', padding: '7px 10px', fontSize: 13, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, background: tok.bg, color: tok.textPrimary, boxSizing: 'border-box' as const, fontFamily: tok.fontSans };
const INPUT_ERROR: CSSProperties = { ...INPUT, borderColor: tok.borderStrong };
const ERR: CSSProperties = { fontSize: 11, color: tok.textHelper, marginTop: 3, fontStyle: 'italic' };
const FIELD: CSSProperties = { marginBottom: 16 };
const SECTION_TITLE: CSSProperties = { fontSize: 13, fontWeight: 600, margin: '20px 0 12px', borderBottom: `1px solid ${tok.borderSubtle}`, paddingBottom: 6 };
const CODE_BLOCK: CSSProperties = { background: tok.layer01, border: `1px solid ${tok.borderSubtle}`, borderRadius: 4, padding: '12px 14px', fontFamily: tok.fontMono, fontSize: 11, whiteSpace: 'pre' as const, overflowX: 'auto' as const, color: tok.textSecondary, lineHeight: 1.6 };
const BTN_PRIMARY: CSSProperties = { padding: '8px 14px', fontSize: 13, fontWeight: 500, border: `1.5px solid ${tok.borderStrong}`, borderRadius: 4, background: tok.textPrimary, color: tok.bg, cursor: 'pointer', whiteSpace: 'nowrap' as const };
const BTN_SECONDARY: CSSProperties = { ...BTN_PRIMARY, background: tok.bg, color: tok.textPrimary };
const STEPPER: CSSProperties = { display: 'flex', gap: 0, marginBottom: 28, borderBottom: `1px solid ${tok.borderSubtle}`, paddingBottom: 16 };
const STEP_DONE: CSSProperties = { flex: 1, fontSize: 11, fontFamily: tok.fontMono, color: tok.textHelper, textAlign: 'center' as const, letterSpacing: '0.03em' };
const STEP_ACTIVE: CSSProperties = { ...STEP_DONE, color: tok.textPrimary, fontWeight: 700 };
const STEP_PENDING: CSSProperties = { ...STEP_DONE, color: tok.textPlaceholder };
const TWO_COL: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };

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
      <div style={NAV_ITEM}>Policies</div>
      <div style={NAV_GROUP}>Docs</div>
      <div style={NAV_ITEM}>Agent Config</div>
    </div>
  );
}

function StepperBar({ active }: { active: number }) {
  return (
    <div style={STEPPER}>
      {DEV_STEPS.map((label, i) => (
        <div key={label} style={i < active ? STEP_DONE : i === active ? STEP_ACTIVE : STEP_PENDING}>
          {i < active ? '✓ ' : `${i + 1}. `}{label}
        </div>
      ))}
    </div>
  );
}

/* ── Exported wireframes ─────────────────────────────────────── */

export function AgentConfigDefault() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Vault Agent — SVID Config</h1>
          <p style={PAGE_DESC}>Generate a Vault Agent config to automatically mint and renew your X.509 SVID.</p>
          <StepperBar active={0} />
          <div style={SECTION_TITLE}>Workload identity</div>
          <div style={TWO_COL}>
            <div style={FIELD}>
              <label style={LABEL}>Vault address</label>
              <input style={INPUT} placeholder={VAULT_ADDR} readOnly />
            </div>
            <div style={FIELD}>
              <label style={LABEL}>SPIFFE secrets engine path</label>
              <input style={INPUT} placeholder="spiffe" readOnly />
            </div>
          </div>
          <div style={TWO_COL}>
            <div style={FIELD}>
              <label style={LABEL}>Role name</label>
              <input style={INPUT} placeholder="Enter role name (given by platform team)" />
            </div>
            <div style={FIELD}>
              <label style={LABEL}>Auth method</label>
              <input style={INPUT} placeholder="kubernetes" />
            </div>
          </div>
          <div style={SECTION_TITLE}>Output paths</div>
          <div style={TWO_COL}>
            <div style={FIELD}>
              <label style={LABEL}>SVID certificate path</label>
              <input style={INPUT} placeholder="/run/spiffe/svid.pem" />
            </div>
            <div style={FIELD}>
              <label style={LABEL}>Private key path</label>
              <input style={INPUT} placeholder="/run/spiffe/key.pem" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button style={BTN_PRIMARY} disabled>Generate config</button>
            <span style={{ fontSize: 11, color: tok.textHelper, alignSelf: 'center' }}>Fill in all fields to enable</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentConfigFilledValid() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Vault Agent — SVID Config</h1>
          <p style={PAGE_DESC}>Generate a Vault Agent config to automatically mint and renew your X.509 SVID.</p>
          <StepperBar active={0} />
          <div style={SECTION_TITLE}>Workload identity</div>
          <div style={TWO_COL}>
            <div style={FIELD}>
              <label style={LABEL}>Vault address</label>
              <input style={INPUT} value={VAULT_ADDR} readOnly />
            </div>
            <div style={FIELD}>
              <label style={LABEL}>SPIFFE secrets engine path</label>
              <input style={INPUT} value={ENGINE_PATH} readOnly />
            </div>
          </div>
          <div style={TWO_COL}>
            <div style={FIELD}>
              <label style={LABEL}>Role name</label>
              <input style={INPUT} value={ROLE_NAME} readOnly />
            </div>
            <div style={FIELD}>
              <label style={LABEL}>Auth method</label>
              <input style={INPUT} value="kubernetes" readOnly />
            </div>
          </div>
          <div style={SECTION_TITLE}>Generated config</div>
          <div style={CODE_BLOCK}>{AGENT_CONFIG_HCL}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button style={BTN_PRIMARY}>Copy config</button>
            <button style={BTN_SECONDARY}>Download .hcl</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentConfigMissingRole() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Vault Agent — SVID Config</h1>
          <p style={PAGE_DESC}>Generate a Vault Agent config to automatically mint and renew your X.509 SVID.</p>
          <StepperBar active={0} />
          <div style={SECTION_TITLE}>Workload identity</div>
          <div style={TWO_COL}>
            <div style={FIELD}>
              <label style={LABEL}>Vault address</label>
              <input style={INPUT} value={VAULT_ADDR} readOnly />
            </div>
            <div style={FIELD}>
              <label style={LABEL}>SPIFFE secrets engine path</label>
              <input style={INPUT} value={ENGINE_PATH} readOnly />
            </div>
          </div>
          <div style={TWO_COL}>
            <div style={FIELD}>
              <label style={LABEL}>Role name</label>
              <input style={INPUT_ERROR} value="" placeholder="Enter role name (given by platform team)" readOnly />
              <div style={ERR}>Role name is required. Ask your platform team for the role assigned to this workload.</div>
            </div>
            <div style={FIELD}>
              <label style={LABEL}>Auth method</label>
              <input style={INPUT} value="kubernetes" readOnly />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button style={{ ...BTN_PRIMARY, opacity: 0.45, cursor: 'default' }}>Generate config</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentConfigServiceAccountMismatch() {
  const warningBox: CSSProperties = {
    border: `1px solid ${tok.borderStrong}`,
    borderRadius: 4, background: tok.layer01,
    padding: '10px 14px', marginBottom: 16, fontSize: 12,
  };
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Vault Agent — SVID Config</h1>
          <p style={PAGE_DESC}>Generate a Vault Agent config to automatically mint and renew your X.509 SVID.</p>
          <StepperBar active={0} />
          <div style={SECTION_TITLE}>Workload identity</div>
          <div style={TWO_COL}>
            <div style={FIELD}>
              <label style={LABEL}>Vault address</label>
              <input style={INPUT} value={VAULT_ADDR} readOnly />
            </div>
            <div style={FIELD}>
              <label style={LABEL}>SPIFFE secrets engine path</label>
              <input style={INPUT} value={ENGINE_PATH} readOnly />
            </div>
          </div>
          <div style={TWO_COL}>
            <div style={FIELD}>
              <label style={LABEL}>Role name</label>
              <input style={INPUT} value={ROLE_NAME} readOnly />
            </div>
            <div style={FIELD}>
              <label style={LABEL}>Kubernetes service account</label>
              <input style={INPUT_ERROR} value="payment-svc-v2" readOnly />
            </div>
          </div>
          <div style={warningBox}>
            <strong>Service account mismatch</strong><br />
            Role <code style={{ fontFamily: tok.fontMono }}>{ROLE_NAME}</code> is bound to service account{' '}
            <code style={{ fontFamily: tok.fontMono }}>{K8S_SA}</code> in namespace{' '}
            <code style={{ fontFamily: tok.fontMono }}>{K8S_NAMESPACE}</code>.
            The service account you entered (<code style={{ fontFamily: tok.fontMono }}>payment-svc-v2</code>) will not match.
            Check with your platform team.
          </div>
          <div style={CODE_BLOCK}>{AGENT_CONFIG_HCL}</div>
        </div>
      </div>
    </div>
  );
}
