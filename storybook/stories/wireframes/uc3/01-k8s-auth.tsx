/**
 * 01-k8s-auth.tsx
 *
 * UC3 Kubernetes Workloads — Step 1: Kubernetes auth.
 * Vault Agent presents the K8s service account token to authenticate and get mint permissions.
 * States: TokenPresented | AuthBound | UnboundSA
 */
import type { CSSProperties } from 'react';
import { tok, K8S_SA, K8S_NAMESPACE, ROLE_NAME, SPIFFE_ID, VAULT_ADDR, ENGINE_PATH, agentConfigHcl, UC3_STEPS } from './_uc3-fixtures';

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
const TWO_COL: CSSProperties    = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };
const NOTE: CSSProperties       = { fontSize: 12, color: tok.textHelper, marginTop: 8 };
const PROGRESS: CSSProperties   = { height: 3, background: tok.borderSubtle, borderRadius: 2, overflow: 'hidden' as const, marginBottom: 16 };
const PROGRESS_FILL: CSSProperties = { height: '100%', width: '40%', background: tok.textSecondary, borderRadius: 2 };

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
      <div style={NAV_ITEM_ACTIVE}>SPIFFE (spiffe/)</div>
      <div style={NAV_GROUP}>Access</div>
      <div style={NAV_ITEM}>Auth Methods</div>
      <div style={NAV_ITEM}>Entities</div>
      <div style={NAV_GROUP}>Docs</div>
      <div style={NAV_ITEM}>Agent Config</div>
    </div>
  );
}

function StepperBar({ active }: { active: number }) {
  return (
    <div style={STEPPER}>
      {UC3_STEPS.map((label, i) => (
        <div key={label} style={i < active ? STEP_DONE : i === active ? STEP_ACTIVE : STEP_PENDING}>
          {i < active ? '✓ ' : `${i + 1}. `}{label}
        </div>
      ))}
    </div>
  );
}

export function K8sAuthTokenPresented() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Kubernetes Auth — Token Presented</h1>
          <p style={PAGE_DESC}>Vault Agent is authenticating using the pod's service account token. Vault validates against the K8s API.</p>
          <StepperBar active={0} />
          <div style={PROGRESS}><div style={PROGRESS_FILL} /></div>
          <div style={TWO_COL}>
            <div style={CARD}>
              <div style={CARD_TITLE}>Service account</div>
              <div style={ROW}><span style={KEY}>Namespace</span><span style={VAL}>{K8S_NAMESPACE}</span></div>
              <div style={ROW}><span style={KEY}>Service account</span><span style={VAL}>{K8S_SA}</span></div>
              <div style={ROW}><span style={KEY}>Auth method</span><span style={VAL}>auth/kubernetes</span></div>
              <div style={ROW}><span style={KEY}>Role</span><span style={VAL}>{ROLE_NAME}</span></div>
              <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_PENDING}>validating...</span></div>
            </div>
            <div style={CARD}>
              <div style={CARD_TITLE}>Vault Agent config</div>
              <div style={{ fontFamily: tok.fontMono, fontSize: 10, color: tok.textSecondary, lineHeight: 1.6 }}>
                {`vault { address = "${VAULT_ADDR}" }\nauto_auth { method "kubernetes" { role = "${ROLE_NAME}" } }`}
              </div>
            </div>
          </div>
          <p style={NOTE}>Vault Agent runs as a sidecar or init container. The K8s service account token is the only credential on the pod — no AppRole secret ID, no bootstrap secret.</p>
        </div>
      </div>
    </div>
  );
}

export function K8sAuthBound() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Kubernetes Auth — Bound</h1>
          <p style={PAGE_DESC}>Auth successful. Service account bound to SPIFFE role. Vault Agent will now mint the X.509 SVID.</p>
          <StepperBar active={0} />
          <div style={CARD}>
            <div style={CARD_TITLE}>Auth result</div>
            <div style={ROW}><span style={KEY}>Service account</span><span style={VAL}>{K8S_NAMESPACE}/{K8S_SA}</span></div>
            <div style={ROW}><span style={KEY}>Vault role</span><span style={VAL}>{ROLE_NAME}</span></div>
            <div style={ROW}><span style={KEY}>SPIFFE ID template</span><span style={VAL}>{`spiffe://corp.example/k8s/{{.namespace}}/{{.service_account}}`}</span></div>
            <div style={ROW}><span style={KEY}>Resolved SPIFFE ID</span><span style={VAL}>{SPIFFE_ID}</span></div>
            <div style={ROW}><span style={KEY}>SVID type</span><span style={VAL}>X.509</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_OK}>bound</span></div>
          </div>
          <div style={CARD_TITLE}>Full Vault Agent config</div>
          <div style={CODE_BLOCK}>{agentConfigHcl}</div>
        </div>
      </div>
    </div>
  );
}

export function K8sAuthUnboundSA() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Kubernetes Auth — Error</h1>
          <p style={PAGE_DESC}>Auth failed. Service account is not bound to any SPIFFE role in this namespace.</p>
          <StepperBar active={0} />
          <div style={{ ...CARD, borderColor: tok.borderStrong }}>
            <div style={CARD_TITLE}>Auth error</div>
            <div style={ROW}><span style={KEY}>Namespace</span><span style={VAL}>staging</span></div>
            <div style={ROW}><span style={KEY}>Service account</span><span style={VAL}>payment-service-v2</span></div>
            <div style={ROW}><span style={KEY}>Role</span><span style={VAL}>{ROLE_NAME}</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_ERR}>unbound</span></div>
            <div style={ROW}><span style={KEY}>Reason</span><span style={{ fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>service account staging/payment-service-v2 not bound to role {ROLE_NAME}</span></div>
          </div>
          <div style={CODE_BLOCK}>{`# Bind the service account to the role:
vault write auth/kubernetes/role/${ROLE_NAME} \\
  bound_service_account_names="${K8S_SA}" \\
  bound_service_account_namespaces="${K8S_NAMESPACE}" \\
  policies="policy/k8s-payment" \\
  ttl="1h"`}</div>
        </div>
      </div>
    </div>
  );
}
