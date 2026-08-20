/**
 * 04-role-create.tsx
 *
 * SPIFFE Secrets Engine — create role for X.509 minting.
 * States: Default | FilledValid | TemplateError | TtlError | Saving | Saved
 */
import type { CSSProperties } from 'react';
import { tok, roleDefaults, TRUST_DOMAIN, ROLE_NAME, PE_STEPS } from './_pe-fixtures';

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

const SECTION_TITLE: CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 16,
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
  lineHeight: 1.5,
};

const INPUT = (state: 'default' | 'error' | 'disabled' | 'valid'): CSSProperties => ({
  display: 'block',
  width: '100%',
  padding: '7px 10px',
  fontSize: 13,
  fontFamily: tok.fontMono,
  border: `1px solid ${state === 'error' ? tok.borderStrong : tok.borderSubtle}`,
  borderRadius: 4,
  background: state === 'disabled' ? tok.layer02 : tok.bg,
  color: state === 'disabled' ? tok.textHelper : tok.textPrimary,
  boxSizing: 'border-box',
  outline: state === 'error' ? `1px solid ${tok.borderStrong}` : 'none',
});

const TEXTAREA = (state: 'default' | 'error' | 'valid'): CSSProperties => ({
  display: 'block',
  width: '100%',
  padding: '7px 10px',
  fontSize: 12,
  fontFamily: tok.fontMono,
  lineHeight: 1.55,
  border: `1px solid ${state === 'error' ? tok.borderStrong : tok.borderSubtle}`,
  borderRadius: 4,
  background: tok.bg,
  color: tok.textPrimary,
  boxSizing: 'border-box',
  outline: state === 'error' ? `1px solid ${tok.borderStrong}` : 'none',
  resize: 'vertical',
  minHeight: 64,
});

const SELECT = (disabled?: boolean): CSSProperties => ({
  display: 'block',
  width: '100%',
  padding: '7px 10px',
  fontSize: 13,
  border: `1px solid ${tok.borderSubtle}`,
  borderRadius: 4,
  background: disabled ? tok.layer02 : tok.bg,
  color: disabled ? tok.textHelper : tok.textPrimary,
  boxSizing: 'border-box',
  appearance: 'none',
  paddingRight: 28,
});

const BADGE_READONLY: CSSProperties = {
  display: 'inline-block',
  padding: '3px 8px',
  fontSize: 11,
  fontFamily: tok.fontMono,
  border: `1px solid ${tok.borderSubtle}`,
  borderRadius: 3,
  background: tok.layer02,
  color: tok.textSecondary,
};

const TWO_COL: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
};

const ERROR_MSG: CSSProperties = {
  fontSize: 11,
  color: tok.textPrimary,
  marginTop: 4,
  display: 'flex',
  alignItems: 'flex-start',
  gap: 4,
};

const PREVIEW: CSSProperties = {
  marginTop: 6,
  padding: '5px 8px',
  fontSize: 11,
  fontFamily: tok.fontMono,
  background: tok.layer01,
  border: `1px solid ${tok.borderSubtle}`,
  borderRadius: 3,
  color: tok.textSecondary,
};

const ALERT = (): CSSProperties => ({
  padding: '10px 14px',
  border: `1px solid ${tok.borderSubtle}`,
  borderLeft: `3px solid ${tok.borderStrong}`,
  borderRadius: 4,
  background: tok.layer01,
  fontSize: 12,
  color: tok.textPrimary,
  marginBottom: 16,
  lineHeight: 1.5,
});

const BTN_ROW: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  paddingTop: 16,
  borderTop: `1px solid ${tok.borderSubtle}`,
  marginTop: 8,
};

const BTN = (variant: 'primary' | 'secondary' | 'disabled' | 'loading'): CSSProperties => ({
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 500,
  borderRadius: 4,
  cursor: variant === 'disabled' || variant === 'loading' ? 'not-allowed' : 'pointer',
  border: variant === 'primary' || variant === 'loading' ? 'none' : `1px solid ${tok.borderSubtle}`,
  background: variant === 'primary' || variant === 'loading' ? tok.textPrimary : variant === 'disabled' ? tok.layer02 : tok.bg,
  color: variant === 'primary' || variant === 'loading' ? tok.bg : variant === 'disabled' ? tok.textHelper : tok.textPrimary,
  opacity: variant === 'loading' ? 0.7 : 1,
});

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

export function RoleCreateDefault() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Roles ▸ Create</div>
      <Stepper activeStep={2} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Create role</div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Role name *</label>
          <input readOnly style={INPUT('default')} value="" placeholder="e.g. k8s-worker" />
          <div style={HELPER}>Identifies this role. Used in the mint endpoint path: spiffe/role/&lt;name&gt;/mintx509</div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SVID type</label>
          <span style={BADGE_READONLY}>X.509</span>
          <div style={HELPER}>Inherited from engine configuration.</div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SPIFFE ID template *</label>
          <textarea readOnly style={TEXTAREA('default')} value="" placeholder={'spiffe://' + TRUST_DOMAIN + '/...'} rows={2} />
          <div style={HELPER}>{'Use {{.entity.aliases.<auth_method>.metadata.<key>}} to interpolate workload metadata. Must produce a URI starting with spiffe://' + TRUST_DOMAIN + '/'}</div>
        </div>
        <div style={TWO_COL}>
          <div style={FIELD_GROUP}>
            <label style={LABEL}>TTL</label>
            <input readOnly style={INPUT('default')} value="" placeholder="1h" />
            <div style={HELPER}>Lifetime of issued SVIDs. Short-lived recommended (1h or less).</div>
          </div>
          <div style={FIELD_GROUP}>
            <label style={{ ...LABEL, fontWeight: 400, color: tok.textSecondary }}>Max TTL</label>
            <input readOnly style={INPUT('default')} value="" placeholder="24h" />
            <div style={HELPER}>Maximum TTL a caller may request.</div>
          </div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Key algorithm</label>
          <select style={SELECT()}>
            <option>EC (P-256)</option>
            <option>EC (P-384)</option>
            <option>RSA-2048</option>
            <option>RSA-4096</option>
          </select>
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Cancel</button>
          <button style={BTN('disabled')} disabled>Create role</button>
        </div>
      </div>
    </div>
  );
}

export function RoleCreateFilledValid() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Roles ▸ Create</div>
      <Stepper activeStep={2} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Create role</div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Role name *</label>
          <input readOnly style={INPUT('valid')} value={ROLE_NAME} />
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SVID type</label>
          <span style={BADGE_READONLY}>X.509</span>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SPIFFE ID template *</label>
          <textarea readOnly style={TEXTAREA('valid')} value={roleDefaults.spiffeIdTemplate} rows={2} />
          <div style={PREVIEW}>Preview: spiffe://{TRUST_DOMAIN}/k8s/payments-processor</div>
        </div>
        <div style={TWO_COL}>
          <div style={FIELD_GROUP}>
            <label style={LABEL}>TTL</label>
            <input readOnly style={INPUT('valid')} value={roleDefaults.ttl} />
          </div>
          <div style={FIELD_GROUP}>
            <label style={{ ...LABEL, fontWeight: 400, color: tok.textSecondary }}>Max TTL</label>
            <input readOnly style={INPUT('valid')} value={roleDefaults.maxTtl} />
          </div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Key algorithm</label>
          <select style={SELECT()}>
            <option selected>EC (P-256)</option>
            <option>EC (P-384)</option>
            <option>RSA-2048</option>
          </select>
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Cancel</button>
          <button style={BTN('primary')}>Create role</button>
        </div>
      </div>
    </div>
  );
}

export function RoleCreateTemplateError() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Roles ▸ Create</div>
      <Stepper activeStep={2} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Create role</div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Role name *</label>
          <input readOnly style={INPUT('valid')} value={ROLE_NAME} />
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SVID type</label>
          <span style={BADGE_READONLY}>X.509</span>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SPIFFE ID template *</label>
          <textarea readOnly style={TEXTAREA('error')} value="k8s/payments-processor" rows={2} />
          <div style={ERROR_MSG}>⚠ Template must produce a valid SPIFFE ID starting with spiffe://</div>
        </div>
        <div style={TWO_COL}>
          <div style={FIELD_GROUP}>
            <label style={LABEL}>TTL</label>
            <input readOnly style={INPUT('valid')} value={roleDefaults.ttl} />
          </div>
          <div style={FIELD_GROUP}>
            <label style={{ ...LABEL, fontWeight: 400, color: tok.textSecondary }}>Max TTL</label>
            <input readOnly style={INPUT('valid')} value={roleDefaults.maxTtl} />
          </div>
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Cancel</button>
          <button style={BTN('disabled')} disabled>Create role</button>
        </div>
      </div>
    </div>
  );
}

export function RoleCreateTtlError() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Roles ▸ Create</div>
      <Stepper activeStep={2} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Create role</div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Role name *</label>
          <input readOnly style={INPUT('valid')} value={ROLE_NAME} />
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SVID type</label>
          <span style={BADGE_READONLY}>X.509</span>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SPIFFE ID template *</label>
          <textarea readOnly style={TEXTAREA('valid')} value={roleDefaults.spiffeIdTemplate} rows={2} />
        </div>
        <div style={TWO_COL}>
          <div style={FIELD_GROUP}>
            <label style={LABEL}>TTL</label>
            <input readOnly style={INPUT('valid')} value="48h" />
          </div>
          <div style={FIELD_GROUP}>
            <label style={{ ...LABEL, fontWeight: 400, color: tok.textSecondary }}>Max TTL</label>
            <input readOnly style={INPUT('error')} value="24h" />
            <div style={ERROR_MSG}>⚠ Max TTL must be equal to or greater than TTL.</div>
          </div>
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Cancel</button>
          <button style={BTN('disabled')} disabled>Create role</button>
        </div>
      </div>
    </div>
  );
}

export function RoleCreateSaving() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Roles ▸ Create</div>
      <Stepper activeStep={2} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Create role</div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Role name</label>
          <input readOnly style={INPUT('disabled')} value={ROLE_NAME} />
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SPIFFE ID template</label>
          <textarea readOnly style={{ ...TEXTAREA('valid'), background: tok.layer02, color: tok.textHelper }} value={roleDefaults.spiffeIdTemplate} rows={2} />
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Cancel</button>
          <button style={BTN('loading')} disabled>Creating... ◌</button>
        </div>
      </div>
    </div>
  );
}

export function RoleCreateSaved() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Roles ▸ {ROLE_NAME}</div>
      <Stepper activeStep={2} />
      <div style={CONTENT}>
        <div style={ALERT()}>
          ✓  Role <strong>{ROLE_NAME}</strong> created. Workloads using this role will receive X.509 SVIDs with a {roleDefaults.ttl} TTL.
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Role name</label>
          <input readOnly style={INPUT('disabled')} value={ROLE_NAME} />
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SPIFFE ID template</label>
          <textarea readOnly style={{ ...TEXTAREA('valid'), background: tok.layer02, color: tok.textHelper }} value={roleDefaults.spiffeIdTemplate} rows={2} />
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Create another role</button>
          <button style={BTN('primary')}>Next: Attach auth method →</button>
        </div>
      </div>
    </div>
  );
}
