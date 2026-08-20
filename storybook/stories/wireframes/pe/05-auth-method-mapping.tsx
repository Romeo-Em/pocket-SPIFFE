/**
 * 05-auth-method-mapping.tsx
 *
 * Attach auth method + Vault policy to a role.
 * States: Empty | MethodSelected | PolicyPreview | Attached
 */
import type { CSSProperties } from 'react';
import { tok, existingAuthMethods, ROLE_NAME, POLICY_HCL, PE_STEPS } from './_pe-fixtures';

/* ── Layout ──────────────────────────────────────────────────── */

const SHELL: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  background: tok.bg,
  fontFamily: tok.fontSans,
  color: tok.textPrimary,
  fontSize: 13,
  overflow: 'hidden',
};

const TOPBAR: CSSProperties = {
  height: 48,
  borderBottom: `1px solid ${tok.borderSubtle}`,
  background: tok.layer01,
  display: 'flex',
  alignItems: 'center',
  padding: '0 20px',
  gap: 12,
  flexShrink: 0,
};

const BREADCRUMB: CSSProperties = {
  fontSize: 12,
  color: tok.textHelper,
  padding: '10px 28px',
  borderBottom: `1px solid ${tok.borderSubtle}`,
  background: tok.layer01,
  flexShrink: 0,
};

const STEPPER_ROW: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '14px 28px',
  borderBottom: `1px solid ${tok.borderSubtle}`,
  flexShrink: 0,
};

const CONTENT: CSSProperties = {
  flex: 1,
  padding: '28px 28px',
  overflowY: 'auto',
  maxWidth: 700,
};

const PAGE_TITLE: CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 4,
};

const PAGE_DESC: CSSProperties = {
  fontSize: 13,
  color: tok.textSecondary,
  marginBottom: 20,
};

const ALERT_NEUTRAL: CSSProperties = {
  padding: '9px 12px',
  border: `1px solid ${tok.borderSubtle}`,
  borderLeft: `3px solid ${tok.borderSubtle}`,
  borderRadius: 4,
  background: tok.layer01,
  fontSize: 12,
  color: tok.textSecondary,
  marginBottom: 20,
};

const EMPTY_STATE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px',
  border: `1px dashed ${tok.borderSubtle}`,
  borderRadius: 6,
  textAlign: 'center',
  color: tok.textHelper,
  gap: 10,
};

const EMPTY_ICON: CSSProperties = {
  fontSize: 28,
  color: tok.borderSubtle,
};

const EMPTY_LABEL: CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: tok.textSecondary,
};

const EMPTY_SUB: CSSProperties = {
  fontSize: 12,
  color: tok.textHelper,
  maxWidth: 320,
};

const BTN_PRIMARY: CSSProperties = {
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 500,
  borderRadius: 4,
  border: 'none',
  background: tok.textPrimary,
  color: tok.bg,
  cursor: 'pointer',
};

const BTN_SECONDARY: CSSProperties = {
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 500,
  borderRadius: 4,
  border: `1px solid ${tok.borderSubtle}`,
  background: tok.bg,
  color: tok.textPrimary,
  cursor: 'pointer',
};

const FIELD_GROUP: CSSProperties = { marginBottom: 20 };

const LABEL: CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 5,
  color: tok.textPrimary,
};

const HELPER: CSSProperties = {
  fontSize: 11,
  color: tok.textHelper,
  marginTop: 4,
};

const SELECT = (): CSSProperties => ({
  display: 'block',
  width: '100%',
  maxWidth: 400,
  padding: '7px 10px',
  fontSize: 13,
  border: `1px solid ${tok.borderSubtle}`,
  borderRadius: 4,
  background: tok.bg,
  color: tok.textPrimary,
  boxSizing: 'border-box',
  appearance: 'none',
  paddingRight: 28,
});

const CODE_BLOCK: CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '12px 14px',
  fontSize: 12,
  fontFamily: tok.fontMono,
  lineHeight: 1.6,
  border: `1px solid ${tok.borderSubtle}`,
  borderRadius: 4,
  background: tok.layer01,
  color: tok.textPrimary,
  boxSizing: 'border-box',
  whiteSpace: 'pre',
  overflowX: 'auto',
};

const COPY_ROW: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 4,
};

const BTN_COPY: CSSProperties = {
  fontSize: 11,
  fontFamily: tok.fontMono,
  border: `1px solid ${tok.borderSubtle}`,
  borderRadius: 3,
  padding: '2px 8px',
  background: tok.bg,
  color: tok.textHelper,
  cursor: 'pointer',
};

const TABLE: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
};

const TH: CSSProperties = {
  textAlign: 'left',
  padding: '8px 10px',
  borderBottom: `1px solid ${tok.borderSubtle}`,
  color: tok.textHelper,
  fontWeight: 500,
  fontSize: 11,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

const TD: CSSProperties = {
  padding: '10px 10px',
  borderBottom: `1px solid ${tok.borderSubtle}`,
  color: tok.textPrimary,
  verticalAlign: 'middle',
};

const BADGE_ACTIVE: CSSProperties = {
  display: 'inline-block',
  padding: '2px 7px',
  fontSize: 11,
  fontFamily: tok.fontMono,
  border: `1px solid ${tok.borderSubtle}`,
  borderRadius: 3,
  background: tok.layer01,
  color: tok.textSecondary,
};

const BTN_ROW: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  paddingTop: 16,
  borderTop: `1px solid ${tok.borderSubtle}`,
  marginTop: 8,
};

/* ── Sub-components ──────────────────────────────────────────── */

function VaultTopBar() {
  return (
    <div style={TOPBAR}>
      <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em' }}>VAULT</span>
      <span style={{ color: tok.borderSubtle, margin: '0 4px' }}>|</span>
      <span style={{ fontSize: 12, color: tok.textSecondary }}>corp-prod</span>
    </div>
  );
}

function Stepper({ activeStep }: { activeStep: number }) {
  return (
    <div style={STEPPER_ROW}>
      {PE_STEPS.map((step, i) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontWeight: i === activeStep ? 600 : 400,
            color: i === activeStep ? tok.textPrimary : i < activeStep ? tok.textSecondary : tok.textHelper,
            fontSize: 12,
          }}>
            <span style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${i === activeStep ? tok.textPrimary : i < activeStep ? tok.textSecondary : tok.borderSubtle}`,
              background: i < activeStep ? tok.textSecondary : tok.bg,
              color: i < activeStep ? tok.bg : i === activeStep ? tok.textPrimary : tok.textHelper,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 600,
            }}>{i < activeStep ? '✓' : i + 1}</span>
            {step}
          </div>
          {i < PE_STEPS.length - 1 && (
            <span style={{ margin: '0 8px', color: tok.borderSubtle }}>›</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Exported wireframes ─────────────────────────────────────── */

export function AuthMethodMappingEmpty() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Roles ▸ {ROLE_NAME} ▸ Auth Methods</div>
      <Stepper activeStep={3} />
      <div style={CONTENT}>
        <div style={PAGE_TITLE}>Auth Method Mappings</div>
        <div style={PAGE_DESC}>
          Attach an existing auth method to allow workloads to mint SVIDs via this role.
        </div>
        <div style={ALERT_NEUTRAL}>
          ℹ  Vault reuses existing auth method configurations. No new attestation infrastructure is required.
        </div>
        <div style={EMPTY_STATE}>
          <div style={EMPTY_ICON}>⊞</div>
          <div style={EMPTY_LABEL}>No auth method attached</div>
          <div style={EMPTY_SUB}>Attach an auth method to allow workloads to authenticate and mint X.509 SVIDs via this role.</div>
          <button style={BTN_PRIMARY}>Attach auth method</button>
        </div>
      </div>
    </div>
  );
}

export function AuthMethodMappingMethodSelected() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Roles ▸ {ROLE_NAME} ▸ Auth Methods</div>
      <Stepper activeStep={3} />
      <div style={CONTENT}>
        <div style={PAGE_TITLE}>Auth Method Mappings</div>
        <div style={PAGE_DESC}>Attach an auth method to allow workloads to mint SVIDs.</div>
        <div style={ALERT_NEUTRAL}>
          ℹ  Vault reuses existing auth method configurations. No new attestation infrastructure is required.
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Auth method</label>
          <select style={SELECT()}>
            <option value="">Select auth method...</option>
            {existingAuthMethods.map(m => (
              <option key={m.path} selected={m.type === 'kubernetes'}>{m.display}</option>
            ))}
          </select>
          <div style={HELPER}>Select the auth method workloads will use to authenticate before minting SVIDs.</div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Role</label>
          <select style={SELECT()}>
            <option selected>{ROLE_NAME}</option>
          </select>
          <div style={HELPER}>The SPIFFE Secrets Engine role to associate with this auth method.</div>
        </div>
        <div style={BTN_ROW}>
          <button style={BTN_SECONDARY}>Cancel</button>
          <button style={BTN_PRIMARY}>Next: View policy</button>
        </div>
      </div>
    </div>
  );
}

export function AuthMethodMappingPolicyPreview() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Roles ▸ {ROLE_NAME} ▸ Auth Methods</div>
      <Stepper activeStep={3} />
      <div style={CONTENT}>
        <div style={PAGE_TITLE}>Auth Method Mappings</div>
        <div style={PAGE_DESC}>Apply this policy to your auth method role configuration to grant SVID minting access.</div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Generated Vault policy</label>
          <code style={CODE_BLOCK}>{POLICY_HCL}</code>
          <div style={COPY_ROW}>
            <button style={BTN_COPY}>Copy</button>
          </div>
          <div style={HELPER}>
            Apply this policy to the <strong>kubernetes/</strong> role that your workloads authenticate with.
            The policy grants update access to the X.509 SVID mint endpoint for role <strong>{ROLE_NAME}</strong>.
          </div>
        </div>
        <div style={ALERT_NEUTRAL}>
          ℹ  After applying this policy, workloads authenticated via kubernetes/ can call{' '}
          <code style={{ fontFamily: tok.fontMono, fontSize: 11 }}>
            vault write spiffe/role/{ROLE_NAME}/mintx509
          </code>
        </div>
        <div style={BTN_ROW}>
          <button style={BTN_SECONDARY}>Back</button>
          <button style={BTN_PRIMARY}>Confirm mapping</button>
        </div>
      </div>
    </div>
  );
}

export function AuthMethodMappingAttached() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Roles ▸ {ROLE_NAME} ▸ Auth Methods</div>
      <Stepper activeStep={3} />
      <div style={CONTENT}>
        <div style={PAGE_TITLE}>Auth Method Mappings</div>
        <div style={ALERT_NEUTRAL}>
          ✓  Auth method attached. Workloads authenticated via kubernetes/ can now mint X.509 SVIDs using role {ROLE_NAME}.
        </div>
        <table style={TABLE}>
          <thead>
            <tr>
              <th style={TH}>Auth Method</th>
              <th style={TH}>Role</th>
              <th style={TH}>Policy</th>
              <th style={TH}>Status</th>
              <th style={TH}></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...TD, fontFamily: tok.fontMono }}>kubernetes/</td>
              <td style={{ ...TD, fontFamily: tok.fontMono }}>{ROLE_NAME}</td>
              <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 12 }}>workload-identity</td>
              <td style={TD}><span style={BADGE_ACTIVE}>Active</span></td>
              <td style={{ ...TD, textAlign: 'right' }}>
                <button style={{ ...BTN_COPY, fontSize: 12 }}>Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: 12, fontSize: 12, color: tok.textHelper }}>
          <span style={{ cursor: 'pointer' }}>+ Attach another</span>
        </div>
        <div style={BTN_ROW}>
          <button style={BTN_SECONDARY}>Edit</button>
          <button style={BTN_PRIMARY}>Next: Verify trust bundle →</button>
        </div>
      </div>
    </div>
  );
}
