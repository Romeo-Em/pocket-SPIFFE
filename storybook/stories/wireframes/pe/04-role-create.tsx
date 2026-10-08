/**
 * 04-role-create.tsx
 *
 * SPIFFE Secrets Engine — create role for JWT SVID minting.
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

type RoleMode = 'default' | 'valid' | 'template-error' | 'ttl-error' | 'disabled';

function RoleFields({ mode }: { mode: RoleMode }) {
  const disabled = mode === 'disabled';
  const templateError = mode === 'template-error';
  const ttlError = mode === 'ttl-error';

  return (
    <>
      <div style={FIELD_GROUP}>
        <label style={LABEL}>Role name *</label>
        <input readOnly style={INPUT(disabled ? 'disabled' : 'valid')} value={ROLE_NAME} />
        <div style={HELPER}>Example role name. Used in the mint endpoint path: spiffe/role/{ROLE_NAME}/mintjwt.</div>
      </div>
      <div style={FIELD_GROUP}>
        <label style={LABEL}>SVID type</label>
        <span style={BADGE_READONLY}>JWT SVID</span>
        <div style={HELPER}>SPIFFE mounts currently issue JWT SVIDs.</div>
      </div>
      <div style={FIELD_GROUP}>
        <label style={LABEL}>JWT claims template *</label>
        <textarea
          readOnly
          style={{
            ...TEXTAREA(templateError ? 'error' : mode === 'valid' ? 'valid' : 'default'),
            ...(disabled ? { background: tok.layer02, color: tok.textHelper } : {}),
          }}
          value={templateError ? '{\n  "aud": "not-set-on-role"\n}' : roleDefaults.template}
          rows={4}
        />
        {templateError ? (
          <div style={ERROR_MSG}>⚠ Template must include a sub claim that expands to a valid SPIFFE ID in the configured trust domain.</div>
        ) : (
          <div style={HELPER}>The required sub claim becomes the SPIFFE ID. This example uses the Kubernetes auth alias service_account metadata.</div>
        )}
        {!templateError && <div style={HELPER}>Vault generates iss, aud, iat, and exp; it also adds the vault.entity.id provenance claim.</div>}
        {mode === 'valid' && <div style={PREVIEW}>Preview: spiffe://{TRUST_DOMAIN}/k8s/payments-processor</div>}
      </div>
      <div style={FIELD_GROUP}>
        <label style={LABEL}>TTL</label>
        <input
          readOnly
          style={INPUT(ttlError ? 'error' : disabled ? 'disabled' : mode === 'valid' ? 'valid' : 'default')}
          value={ttlError ? 'five minutes' : roleDefaults.ttl}
        />
        {ttlError ? (
          <div style={ERROR_MSG}>⚠ Enter a Vault duration format, such as 5m or 300s.</div>
        ) : (
          <div style={HELPER}>Lifetime of minted JWT SVIDs. Default: 5m. Issued TTL is capped by the current signing key's remaining lifetime.</div>
        )}
      </div>
      <div style={FIELD_GROUP}>
        <label style={LABEL}>Include jti claim</label>
        <div style={{ ...HELPER, marginTop: 0, color: tok.textPrimary }}>
          <span aria-hidden="true">☐</span> Off (default)
        </div>
        <div style={HELPER}>When enabled, adds a unique token ID; this may affect JWT reusability.</div>
      </div>
      <div style={ALERT()}>
        Audience is required when minting a JWT and is supplied per request. The mint endpoint accepts one audience value; it is not stored on this role.
      </div>
    </>
  );
}

function RoleCreatePage({ mode, saved = false }: { mode: RoleMode; saved?: boolean }) {
  const disabled = mode === 'disabled' || saved;
  const saving = mode === 'disabled' && !saved;
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Roles ▸ {ROLE_NAME}</div>
      <Stepper activeStep={2} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>{saved ? 'JWT role created' : 'Create JWT role'}</div>
        {saved && (
          <div style={ALERT()}>
            ✓ Role <strong>{ROLE_NAME}</strong> created. It mints JWT SVIDs with a {roleDefaults.ttl} TTL, capped by the current signing key's remaining lifetime.
          </div>
        )}
        <RoleFields mode={disabled ? 'disabled' : mode} />
        <div style={BTN_ROW}>
          {saved && <button style={BTN('secondary')}>Create another role</button>}
          {!saved && <button style={BTN('secondary')}>Cancel</button>}
          <button
            style={BTN(mode === 'template-error' || mode === 'ttl-error' ? 'disabled' : saving ? 'loading' : 'primary')}
            disabled={mode === 'template-error' || mode === 'ttl-error' || saving}
          >
            {saved ? 'Next: Attach auth method →' : saving ? 'Creating... ◌' : 'Create role'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RoleCreateDefault() {
  return <RoleCreatePage mode="default" />;
}

export function RoleCreateFilledValid() {
  return <RoleCreatePage mode="valid" />;
}

export function RoleCreateTemplateError() {
  return <RoleCreatePage mode="template-error" />;
}

export function RoleCreateTtlError() {
  return <RoleCreatePage mode="ttl-error" />;
}

export function RoleCreateSaving() {
  return <RoleCreatePage mode="disabled" />;
}

export function RoleCreateSaved() {
  return <RoleCreatePage mode="disabled" saved />;
}
