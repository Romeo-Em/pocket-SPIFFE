/**
 * 03-engine-config.tsx
 *
 * SPIFFE Secrets Engine — trust domain + PKI configuration.
 * States: Default | FilledValid | TrustDomainError | IssuerMissing | Saving | Saved
 */
import type { CSSProperties } from 'react';
import { tok, pkiIssuers, TRUST_DOMAIN, PE_STEPS } from './_pe-fixtures';

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
  gap: 0,
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
  color: tok.textPrimary,
};

const FIELD_GROUP: CSSProperties = {
  marginBottom: 20,
};

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
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238d8d8d' stroke-width='1.5'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  backgroundSize: '10px',
  paddingRight: 28,
});

const ERROR_MSG: CSSProperties = {
  fontSize: 11,
  color: tok.textPrimary,
  marginTop: 4,
  display: 'flex',
  alignItems: 'flex-start',
  gap: 4,
};

const RADIO_GROUP: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginTop: 4,
};

const RADIO_ITEM = (selected: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 13,
  color: selected ? tok.textPrimary : tok.textSecondary,
  fontWeight: selected ? 500 : 400,
  cursor: 'pointer',
});

const ALERT = (type: 'success' | 'error' | 'neutral'): CSSProperties => ({
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

export function EngineConfigDefault() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Configuration</div>
      <Stepper activeStep={1} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Configure trust domain</div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Trust domain *</label>
          <input readOnly style={INPUT('default')} value="" placeholder="e.g. corp.example" />
          <div style={HELPER}>The SPIFFE trust domain for all SVIDs issued from this mount. Cannot be changed after the first SVID is issued.</div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SVID type *</label>
          <div style={RADIO_GROUP}>
            <label style={RADIO_ITEM(true)}><span>●</span> X.509 SVIDs</label>
            <label style={RADIO_ITEM(false)}><span>○</span> JWT SVIDs</label>
            <label style={RADIO_ITEM(false)}><span>○</span> Both</label>
          </div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>PKI issuer path *</label>
          <select style={SELECT()} disabled>
            <option>Select a PKI issuer...</option>
          </select>
          <div style={HELPER}>The Vault PKI engine issuer that will sign X.509 SVIDs. Required when issuing X.509 SVIDs.</div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={{ ...LABEL, fontWeight: 400, color: tok.textSecondary }}>Bundle refresh hint (seconds)</label>
          <input readOnly style={INPUT('default')} value="3600" />
          <div style={HELPER}>How often verifiers should re-fetch the trust bundle. Default: 3600.</div>
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Cancel</button>
          <button style={BTN('disabled')} disabled>Save configuration</button>
        </div>
      </div>
    </div>
  );
}

export function EngineConfigFilledValid() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Configuration</div>
      <Stepper activeStep={1} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Configure trust domain</div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Trust domain *</label>
          <input readOnly style={INPUT('valid')} value={TRUST_DOMAIN} />
          <div style={HELPER}>Cannot be changed after the first SVID is issued.</div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SVID type *</label>
          <div style={RADIO_GROUP}>
            <label style={RADIO_ITEM(true)}><span>●</span> X.509 SVIDs</label>
            <label style={RADIO_ITEM(false)}><span>○</span> JWT SVIDs</label>
            <label style={RADIO_ITEM(false)}><span>○</span> Both</label>
          </div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>PKI issuer path *</label>
          <select style={SELECT()}>
            {pkiIssuers.map(p => (
              <option key={p.path} selected={p.path === 'pki/issuer/default'}>{p.label}</option>
            ))}
          </select>
          <div style={HELPER}>Signs all X.509 SVIDs issued from this mount.</div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={{ ...LABEL, fontWeight: 400, color: tok.textSecondary }}>Bundle refresh hint (seconds)</label>
          <input readOnly style={INPUT('valid')} value="3600" />
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Cancel</button>
          <button style={BTN('primary')}>Save configuration</button>
        </div>
      </div>
    </div>
  );
}

export function EngineConfigTrustDomainError() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Configuration</div>
      <Stepper activeStep={1} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Configure trust domain</div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Trust domain *</label>
          <input readOnly style={INPUT('error')} value="corp example" />
          <div style={ERROR_MSG}>⚠ Trust domain must be a valid hostname (lowercase, no spaces). Example: corp.example</div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SVID type *</label>
          <div style={RADIO_GROUP}>
            <label style={RADIO_ITEM(true)}><span>●</span> X.509 SVIDs</label>
            <label style={RADIO_ITEM(false)}><span>○</span> JWT SVIDs</label>
            <label style={RADIO_ITEM(false)}><span>○</span> Both</label>
          </div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>PKI issuer path *</label>
          <select style={SELECT()}>
            {pkiIssuers.map(p => (
              <option key={p.path}>{p.label}</option>
            ))}
          </select>
        </div>
        <div style={FIELD_GROUP}>
          <label style={{ ...LABEL, fontWeight: 400, color: tok.textSecondary }}>Bundle refresh hint (seconds)</label>
          <input readOnly style={INPUT('default')} value="3600" />
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Cancel</button>
          <button style={BTN('disabled')} disabled>Save configuration</button>
        </div>
      </div>
    </div>
  );
}

export function EngineConfigIssuerMissing() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Configuration</div>
      <Stepper activeStep={1} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Configure trust domain</div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Trust domain *</label>
          <input readOnly style={INPUT('valid')} value={TRUST_DOMAIN} />
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SVID type *</label>
          <div style={RADIO_GROUP}>
            <label style={RADIO_ITEM(true)}><span>●</span> X.509 SVIDs</label>
            <label style={RADIO_ITEM(false)}><span>○</span> JWT SVIDs</label>
            <label style={RADIO_ITEM(false)}><span>○</span> Both</label>
          </div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>PKI issuer path *</label>
          <select style={{ ...SELECT(), border: `1px solid ${tok.borderStrong}`, outline: `1px solid ${tok.borderStrong}` }}>
            <option value="">Select a PKI issuer...</option>
          </select>
          <div style={ERROR_MSG}>⚠ A PKI issuer path is required for X.509 SVID issuance.</div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={{ ...LABEL, fontWeight: 400, color: tok.textSecondary }}>Bundle refresh hint (seconds)</label>
          <input readOnly style={INPUT('default')} value="3600" />
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Cancel</button>
          <button style={BTN('disabled')} disabled>Save configuration</button>
        </div>
      </div>
    </div>
  );
}

export function EngineConfigSaving() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Configuration</div>
      <Stepper activeStep={1} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Configure trust domain</div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Trust domain *</label>
          <input readOnly style={INPUT('disabled')} value={TRUST_DOMAIN} />
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SVID type *</label>
          <div style={RADIO_GROUP}>
            <label style={{ ...RADIO_ITEM(true), opacity: 0.5 }}><span>●</span> X.509 SVIDs</label>
          </div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>PKI issuer path *</label>
          <select style={SELECT(true)} disabled>
            <option>Default Issuer (pki/)</option>
          </select>
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Cancel</button>
          <button style={BTN('loading')} disabled>Saving... ◌</button>
        </div>
      </div>
    </div>
  );
}

export function EngineConfigSaved() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Configuration</div>
      <Stepper activeStep={1} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Configure trust domain</div>
        <div style={ALERT('success')}>
          ✓  Trust domain configured. Trust bundle endpoint is now live at{' '}
          <code style={{ fontFamily: tok.fontMono, fontSize: 11 }}>
            https://vault.corp.example/v1/spiffe/bundle
          </code>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>Trust domain</label>
          <input readOnly style={INPUT('disabled')} value={TRUST_DOMAIN} />
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>SVID type</label>
          <input readOnly style={INPUT('disabled')} value="X.509 SVIDs" />
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>PKI issuer path</label>
          <input readOnly style={INPUT('disabled')} value="pki/issuer/default" />
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Edit configuration</button>
          <button style={BTN('primary')}>Next: Create a role →</button>
        </div>
      </div>
    </div>
  );
}
