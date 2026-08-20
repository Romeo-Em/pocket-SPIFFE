/**
 * 06-trust-bundle-verify.tsx
 *
 * Trust bundle verification — final step of PE setup.
 * States: Checking | Success | Unreachable | EmptyBundle
 */
import type { CSSProperties } from 'react';
import { tok, BUNDLE_URL, TRUST_DOMAIN, ROLE_NAME, bundleVerifyResult, PE_STEPS } from './_pe-fixtures';

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

const HANDOFF_TEXT = `Trust domain:   ${TRUST_DOMAIN}
Role name:      ${ROLE_NAME}
Bundle URL:     ${BUNDLE_URL}
SVID type:      X.509

Mint endpoint:  vault write spiffe/role/${ROLE_NAME}/mintx509`;

/* ── Exported wireframes ─────────────────────────────────────── */

export function TrustBundleVerifyChecking() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Trust Bundle</div>
      <Stepper activeStep={4} />
      <div style={CONTENT}>
        <div style={PAGE_TITLE}>Trust Bundle Verification</div>
        <div style={PAGE_DESC}>
          Verifiers (Envoy, cloud IAM, other Vault clusters) will fetch this endpoint to validate SVIDs offline.
          No Vault token is required.
        </div>
        <div style={CHECKING_STATE}>
          <div style={SPINNER} />
          Checking trust bundle endpoint...
        </div>
      </div>
    </div>
  );
}

export function TrustBundleVerifySuccess() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Trust Bundle</div>
      <Stepper activeStep={4} />
      <div style={CONTENT}>
        <div style={PAGE_TITLE}>Trust Bundle Verification</div>
        <div style={PAGE_DESC}>
          The trust bundle is live and reachable. Share the details below with your application teams.
        </div>

        <div style={RESULT_CARD}>
          <div style={RESULT_HEADER}>
            <span>Trust bundle status</span>
            <span style={BADGE_SYNCED}>✓ Verified</span>
          </div>
          <div style={RESULT_ROW}>
            <div style={RESULT_LABEL}>Bundle URL</div>
            <div style={RESULT_VALUE}>{BUNDLE_URL}</div>
          </div>
          <div style={RESULT_ROW}>
            <div style={RESULT_LABEL}>Keys in bundle</div>
            <div style={RESULT_VALUE}>{bundleVerifyResult.keyCount}</div>
          </div>
          <div style={RESULT_ROW}>
            <div style={RESULT_LABEL}>CA fingerprint</div>
            <div style={RESULT_VALUE}>{bundleVerifyResult.caFingerprint}</div>
          </div>
          <div style={RESULT_ROW}>
            <div style={RESULT_LABEL}>Replica sync</div>
            <div style={RESULT_VALUE}><span style={BADGE_SYNCED}>{bundleVerifyResult.replicaStatus}</span></div>
          </div>
          <div style={{ ...RESULT_ROW, borderBottom: 'none' }}>
            <div style={RESULT_LABEL}>Last fetched</div>
            <div style={RESULT_VALUE}>{bundleVerifyResult.lastFetched}</div>
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
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Trust Bundle</div>
      <Stepper activeStep={4} />
      <div style={CONTENT}>
        <div style={PAGE_TITLE}>Trust Bundle Verification</div>
        <div style={PAGE_DESC}>
          Verifiers will fetch this endpoint to validate SVIDs offline. No Vault token is required.
        </div>
        <div style={ALERT('error')}>
          ⚠  Trust bundle endpoint is not reachable from this browser. Verify your Vault listener is accessible at{' '}
          <code style={{ fontFamily: tok.fontMono, fontSize: 11 }}>{BUNDLE_URL}</code>
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

export function TrustBundleVerifyEmptyBundle() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ spiffe ▸ Trust Bundle</div>
      <Stepper activeStep={4} />
      <div style={CONTENT}>
        <div style={PAGE_TITLE}>Trust Bundle Verification</div>
        <div style={PAGE_DESC}>
          Verifiers will fetch this endpoint to validate SVIDs offline.
        </div>
        <div style={ALERT('warning')}>
          ⚠  Trust bundle returned 0 keys. Verify the PKI issuer path in engine configuration.
          The bundle must contain at least one CA certificate before SVIDs can be validated.
        </div>
        <div style={{ fontSize: 12, color: tok.textHelper, marginBottom: 20 }}>
          Common cause: the PKI issuer path configured in the engine does not have a CA certificate yet,
          or the issuer was deleted after the engine was configured.
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Go to configuration</button>
          <button style={BTN('primary')}>Retry check</button>
        </div>
      </div>
    </div>
  );
}
