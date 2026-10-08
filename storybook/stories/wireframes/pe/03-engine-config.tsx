/**
 * 03-engine-config.tsx
 *
 * SPIFFE Secrets Engine — trust domain + PKI configuration.
 * States: Default | FilledValid | TrustDomainError | RefreshHintError | Saving | Saved
 */
import type { CSSProperties } from 'react';
import {
  tok,
  TRUST_DOMAIN,
  VAULT_API_ADDR,
  OIDC_DISCOVERY_URL,
  PE_STEPS,
} from './_pe-fixtures';

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

type EngineConfigMode = 'default' | 'valid' | 'domain-error' | 'refresh-hint-error' | 'disabled';

function EngineConfigFields({ mode }: { mode: EngineConfigMode }) {
  const isDisabled = mode === 'disabled';
  const isCustom = mode === 'valid';
  const issuerUrl = isCustom ? 'https://identity.corp.example' : VAULT_API_ADDR;
  const keyLifetime = isCustom ? '48h' : '24h';
  const algorithm = isCustom ? 'ES256' : 'RS256';
  const compatibilityMode = isCustom;
  const refreshHint = isCustom ? '2h' : mode === 'refresh-hint-error' ? '3h' : '1h';

  return (
    <>
      <div style={FIELD_GROUP}>
        <label style={LABEL}>Trust domain *</label>
        <input
          readOnly
          style={INPUT(mode === 'domain-error' ? 'error' : isDisabled ? 'disabled' : mode === 'valid' ? 'valid' : 'default')}
          value={mode === 'domain-error' ? 'corp example' : TRUST_DOMAIN}
        />
        {mode === 'domain-error' ? (
          <div style={ERROR_MSG}>⚠ Trust domain must be a valid hostname (lowercase, no spaces). Example: corp.example</div>
        ) : (
          <div style={HELPER}>Required. Example value: {TRUST_DOMAIN}. Cannot be changed after the first SVID is issued.</div>
        )}
      </div>
      <div style={FIELD_GROUP}>
        <label style={LABEL}>JWT issuer base URL (optional)</label>
        <input readOnly style={INPUT(isDisabled ? 'disabled' : mode === 'valid' ? 'valid' : 'default')} value={issuerUrl} />
        <div style={HELPER}>Optional. Defaults to Vault API address {VAULT_API_ADDR}. The mount path and issuer endpoint are appended.</div>
      </div>
      <div style={FIELD_GROUP}>
        <label style={LABEL}>Signing key lifetime</label>
        <input readOnly style={INPUT(isDisabled ? 'disabled' : mode === 'valid' ? 'valid' : 'default')} value={keyLifetime} />
        <div style={HELPER}>How often Vault generates a new signing key. Default: 24h.</div>
      </div>
      <div style={FIELD_GROUP}>
        <label style={LABEL}>JWT signing algorithm</label>
        <select style={SELECT(isDisabled)} disabled={isDisabled}>
          {[algorithm, 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512']
            .filter((value, index, values) => values.indexOf(value) === index)
            .map(value => <option key={value} selected={value === algorithm}>{value}{value === 'RS256' ? ' (default)' : ''}</option>)}
        </select>
        <div style={HELPER}>Algorithm used for JWT SVIDs. Default: RS256.</div>
      </div>
      <div style={FIELD_GROUP}>
        <label style={LABEL}>OIDC compatibility mode</label>
        <div style={{ ...HELPER, marginTop: 0, color: tok.textPrimary }}>
          <span aria-hidden="true">{compatibilityMode ? '☑' : '☐'}</span> {compatibilityMode ? 'On' : 'Off (default)'}
        </div>
        <div style={HELPER}>When enabled, minting fails if the SPIFFE ID exceeds the 255-character OIDC subject limit.</div>
      </div>
      <div style={FIELD_GROUP}>
        <label style={LABEL}>Bundle refresh hint</label>
        <input
          readOnly
          style={INPUT(mode === 'refresh-hint-error' ? 'error' : isDisabled ? 'disabled' : mode === 'valid' ? 'valid' : 'default')}
          value={refreshHint}
        />
        {mode === 'refresh-hint-error' ? (
          <div style={ERROR_MSG}>⚠ Refresh hint cannot exceed one tenth of the 24h key lifetime (maximum 2h 24m).</div>
        ) : (
          <div style={HELPER}>Default: 1h. Must not exceed one tenth of the signing key lifetime.</div>
        )}
      </div>
    </>
  );
}

function EngineConfigPage({ mode, saved = false }: { mode: EngineConfigMode; saved?: boolean }) {
  const disabled = mode === 'disabled' || saved;
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Configuration</div>
      <Stepper activeStep={1} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Configure JWT engine</div>
        {saved && (
          <div style={ALERT('success')}>
            ✓ JWT signing configuration saved. OIDC discovery is available at{' '}
            <code style={{ fontFamily: tok.fontMono, fontSize: 11 }}>{OIDC_DISCOVERY_URL}</code>
          </div>
        )}
        {mode === 'valid' && <div style={ALERT('neutral')}>Custom JWT settings are valid. The default values are shown on the initial configuration form.</div>}
        <EngineConfigFields mode={disabled ? 'disabled' : mode} />
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Cancel</button>
          {saved ? (
            <button style={BTN('primary')}>Next: Create a role →</button>
          ) : mode === 'disabled' ? (
            <button style={BTN('loading')} disabled>Saving... ◌</button>
          ) : (
            <button style={BTN(mode === 'domain-error' || mode === 'refresh-hint-error' ? 'disabled' : 'primary')} disabled={mode === 'domain-error' || mode === 'refresh-hint-error'}>
              Save configuration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EngineConfigDefault() {
  return <EngineConfigPage mode="default" />;
}

export function EngineConfigFilledValid() {
  return <EngineConfigPage mode="valid" />;
}

export function EngineConfigTrustDomainError() {
  return <EngineConfigPage mode="domain-error" />;
}

export function EngineConfigRefreshHintError() {
  return <EngineConfigPage mode="refresh-hint-error" />;
}

export function EngineConfigSaving() {
  return <EngineConfigPage mode="disabled" />;
}

export function EngineConfigSaved() {
  return <EngineConfigPage mode="disabled" saved />;
}
