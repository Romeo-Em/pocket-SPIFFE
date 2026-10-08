/**
 * 06-trust-bundle-verify.tsx
 *
 * Trust bundle verification — final step of PE setup.
 * States: Checking | Success | Unreachable | EmptySigningKeys
 */
import type { CSSProperties } from 'react';
import {
  tok,
  TRUST_BUNDLE_URL,
  OIDC_DISCOVERY_URL,
  JWKS_URL,
  VAULT_API_ADDR,
  TRUST_DOMAIN,
  ROLE_NAME,
  MINT_AUDIENCE,
  jwtEndpointCheck,
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
  marginBottom: 24,
  lineHeight: 1.6,
  maxWidth: 560,
};

const CHECKING_STATE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '20px 0',
  color: tok.textSecondary,
  fontSize: 13,
};

const SPINNER: CSSProperties = {
  width: 18,
  height: 18,
  borderRadius: '50%',
  border: `2px solid ${tok.borderSubtle}`,
  borderTopColor: tok.textPrimary,
  flexShrink: 0,
};

const RESULT_CARD: CSSProperties = {
  border: `1px solid ${tok.borderSubtle}`,
  borderRadius: 6,
  overflow: 'hidden',
  marginBottom: 20,
};

const RESULT_HEADER: CSSProperties = {
  padding: '10px 14px',
  background: tok.layer01,
  borderBottom: `1px solid ${tok.borderSubtle}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: 12,
  fontWeight: 600,
};

const RESULT_ROW: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '180px 1fr',
  borderBottom: `1px solid ${tok.borderSubtle}`,
};

const RESULT_LABEL: CSSProperties = {
  padding: '9px 14px',
  fontSize: 11,
  fontFamily: tok.fontMono,
  color: tok.textHelper,
  background: tok.layer01,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  borderRight: `1px solid ${tok.borderSubtle}`,
};

const RESULT_VALUE: CSSProperties = {
  padding: '9px 14px',
  fontSize: 12,
  fontFamily: tok.fontMono,
  color: tok.textPrimary,
  overflowWrap: 'anywhere',
};

const BADGE_SYNCED: CSSProperties = {
  display: 'inline-block',
  padding: '2px 7px',
  fontSize: 11,
  fontFamily: tok.fontMono,
  border: `1px solid ${tok.borderSubtle}`,
  borderRadius: 3,
  background: tok.layer01,
  color: tok.textSecondary,
};

const HANDOFF_BLOCK: CSSProperties = {
  border: `1px solid ${tok.borderSubtle}`,
  borderRadius: 6,
  overflow: 'hidden',
  marginBottom: 20,
};

const HANDOFF_HEADER: CSSProperties = {
  padding: '8px 14px',
  background: tok.layer01,
  borderBottom: `1px solid ${tok.borderSubtle}`,
  fontSize: 11,
  fontFamily: tok.fontMono,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: tok.textHelper,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const HANDOFF_CODE: CSSProperties = {
  padding: '12px 14px',
  fontSize: 12,
  fontFamily: tok.fontMono,
  lineHeight: 1.7,
  color: tok.textPrimary,
  background: tok.bg,
  whiteSpace: 'pre',
  overflowX: 'auto',
};

const ALERT = (type: 'error' | 'warning' | 'neutral'): CSSProperties => ({
  padding: '10px 14px',
  border: `1px solid ${tok.borderSubtle}`,
  borderLeft: `3px solid ${type === 'error' || type === 'warning' ? tok.borderStrong : tok.borderSubtle}`,
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

const BTN = (variant: 'primary' | 'secondary'): CSSProperties => ({
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 500,
  borderRadius: 4,
  border: variant === 'primary' ? 'none' : `1px solid ${tok.borderSubtle}`,
  background: variant === 'primary' ? tok.textPrimary : tok.bg,
  color: variant === 'primary' ? tok.bg : tok.textPrimary,
  cursor: 'pointer',
});

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

const HANDOFF_TEXT = `Trust domain:       ${TRUST_DOMAIN}
Role name:          ${ROLE_NAME}
Issuer base URL:    ${VAULT_API_ADDR}
Trust bundle:       ${TRUST_BUNDLE_URL}
OIDC discovery:     ${OIDC_DISCOVERY_URL}
Public keys (JWKS): ${JWKS_URL}

Mint JWT SVID:
vault write spiffe/role/${ROLE_NAME}/mintjwt audience="${MINT_AUDIENCE}"`;

/* ── Exported wireframes ─────────────────────────────────────── */

export function TrustBundleVerifyChecking() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ JWT Endpoints</div>
      <Stepper activeStep={4} />
      <div style={CONTENT}>
        <div style={PAGE_TITLE}>JWT Endpoint Verification</div>
        <div style={PAGE_DESC}>
          Check the unauthenticated SPIFFE trust bundle and OIDC discovery endpoints used by JWT SVID verifiers.
          No Vault token is required.
        </div>
        <div style={CHECKING_STATE}>
          <div style={SPINNER} />
          Checking trust bundle, OIDC discovery, and public signing keys...
        </div>
      </div>
    </div>
  );
}

export function TrustBundleVerifySuccess() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ JWT Endpoints</div>
      <Stepper activeStep={4} />
      <div style={CONTENT}>
        <div style={PAGE_TITLE}>JWT Endpoint Verification</div>
        <div style={PAGE_DESC}>
          The JWT verification endpoints are live and reachable. Share the issuer and mint details with your application teams.
        </div>

        <div style={RESULT_CARD}>
          <div style={RESULT_HEADER}>
            <span>JWT endpoint status</span>
            <span style={BADGE_SYNCED}>✓ Verified</span>
          </div>
          <div style={RESULT_ROW}>
            <div style={RESULT_LABEL}>Trust bundle</div>
            <div style={RESULT_VALUE}>{TRUST_BUNDLE_URL} · {jwtEndpointCheck.status}</div>
          </div>
          <div style={RESULT_ROW}>
            <div style={RESULT_LABEL}>OIDC discovery</div>
            <div style={RESULT_VALUE}>{OIDC_DISCOVERY_URL} · {jwtEndpointCheck.status}</div>
          </div>
          <div style={RESULT_ROW}>
            <div style={RESULT_LABEL}>Public keys (JWKS)</div>
            <div style={RESULT_VALUE}>{JWKS_URL} · {jwtEndpointCheck.status}</div>
          </div>
          <div style={RESULT_ROW}>
            <div style={RESULT_LABEL}>Signing keys</div>
            <div style={RESULT_VALUE}>{jwtEndpointCheck.signingKeyCount}</div>
          </div>
          <div style={{ ...RESULT_ROW, borderBottom: 'none' }}>
            <div style={RESULT_LABEL}>Last checked</div>
            <div style={RESULT_VALUE}>{jwtEndpointCheck.lastChecked}</div>
          </div>
        </div>

        <div style={HANDOFF_BLOCK}>
          <div style={HANDOFF_HEADER}>
            <span>Share with your application team</span>
            <button style={BTN_COPY}>Copy</button>
          </div>
          <pre style={HANDOFF_CODE}>{HANDOFF_TEXT}</pre>
        </div>

        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Back to engine</button>
          <button style={BTN('primary')}>Done — setup complete</button>
        </div>
      </div>
    </div>
  );
}

export function TrustBundleVerifyUnreachable() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ JWT Endpoints</div>
      <Stepper activeStep={4} />
      <div style={CONTENT}>
        <div style={PAGE_TITLE}>JWT Endpoint Verification</div>
        <div style={PAGE_DESC}>
          JWT verifiers use the SPIFFE trust bundle and OIDC discovery endpoints. No Vault token is required.
        </div>
        <div style={ALERT('error')}>
          ⚠  JWT verification endpoints are not reachable from this browser. Verify your Vault listener is accessible at{' '}
          <code style={{ fontFamily: tok.fontMono, fontSize: 11 }}>{TRUST_BUNDLE_URL}</code>
        </div>
        <div style={{ fontSize: 12, color: tok.textSecondary, marginBottom: 20, lineHeight: 1.6 }}>
          The engine is configured correctly. This check verifies reachability from the browser only.
          Verifiers running inside your network may still be able to reach the endpoint.
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Back</button>
          <button style={BTN('primary')}>Retry check</button>
        </div>
      </div>
    </div>
  );
}

export function TrustBundleVerifyEmptySigningKeys() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ JWT Endpoints</div>
      <Stepper activeStep={4} />
      <div style={CONTENT}>
        <div style={PAGE_TITLE}>JWT Endpoint Verification</div>
        <div style={PAGE_DESC}>
          The public signing keys endpoint must return the keys used to verify JWT SVIDs.
        </div>
        <div style={ALERT('warning')}>
          ⚠  The public keys endpoint returned no signing keys. Verify the SPIFFE engine configuration and retry.
        </div>
        <div style={{ fontSize: 12, color: tok.textHelper, marginBottom: 20 }}>
          Signing keys are published as a JSON Web Key Set. The trust bundle endpoint is separate and uses the https_web profile.
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Go to configuration</button>
          <button style={BTN('primary')}>Retry check</button>
        </div>
      </div>
    </div>
  );
}
