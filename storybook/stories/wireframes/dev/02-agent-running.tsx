/**
 * 02-agent-running.tsx
 *
 * App Developer — Step 2: Run Vault Agent, watch it authenticate and write SVID files.
 * States: Starting | Authenticated | SvidWritten | AuthFailed
 */
import type { CSSProperties } from 'react';
import { tok, SPIFFE_ID, ROLE_NAME, BUNDLE_URL, agentFiles, DEV_STEPS } from './_dev-fixtures';

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
  padding: '16px 0', flexShrink: 0,
};
const BODY: CSSProperties    = { flex: 1, display: 'flex', overflow: 'hidden' };
const MAIN: CSSProperties    = { flex: 1, padding: '24px 28px', overflowY: 'auto' };
const PAGE_TITLE: CSSProperties = { fontSize: 18, fontWeight: 600, margin: 0 };
const PAGE_DESC: CSSProperties = { fontSize: 13, color: tok.textSecondary, marginTop: 4, marginBottom: 20 };
const NAV_ITEM: CSSProperties = { padding: '6px 16px', fontSize: 13, color: tok.textSecondary };
const NAV_ITEM_ACTIVE: CSSProperties = { ...NAV_ITEM, color: tok.textPrimary, fontWeight: 600, background: tok.layer02, borderLeft: `3px solid ${tok.textPrimary}`, paddingLeft: 13 };
const NAV_GROUP: CSSProperties = { padding: '12px 16px 4px', fontSize: 10, fontFamily: tok.fontMono, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: tok.textHelper };
const STEPPER: CSSProperties = { display: 'flex', gap: 0, marginBottom: 28, borderBottom: `1px solid ${tok.borderSubtle}`, paddingBottom: 16 };
const STEP_DONE: CSSProperties = { flex: 1, fontSize: 11, fontFamily: tok.fontMono, color: tok.textHelper, textAlign: 'center' as const };
const STEP_ACTIVE: CSSProperties = { ...STEP_DONE, color: tok.textPrimary, fontWeight: 700 };
const STEP_PENDING: CSSProperties = { ...STEP_DONE, color: tok.textPlaceholder };
const LOG: CSSProperties = { background: '#111', color: '#ddd', fontFamily: tok.fontMono, fontSize: 11, padding: '12px 14px', borderRadius: 4, lineHeight: 1.7, whiteSpace: 'pre' as const, marginBottom: 20, minHeight: 120 };
const LOG_OK: CSSProperties   = { ...LOG, color: '#b8c9b8' };
const LOG_ERR: CSSProperties  = { ...LOG, color: '#c9b8b8' };
const SECTION_TITLE: CSSProperties = { fontSize: 13, fontWeight: 600, margin: '20px 0 10px', borderBottom: `1px solid ${tok.borderSubtle}`, paddingBottom: 6 };
const TABLE: CSSProperties = { width: '100%', borderCollapse: 'collapse' as const, fontSize: 12 };
const TH: CSSProperties = { textAlign: 'left' as const, padding: '7px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textHelper, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.04em' };
const TD: CSSProperties = { padding: '8px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textPrimary, verticalAlign: 'middle' as const };
const STATUS_OK: CSSProperties = { display: 'inline-block', padding: '1px 7px', fontSize: 11, fontFamily: tok.fontMono, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, background: tok.layer01, color: tok.textPrimary, fontWeight: 600 };
const STATUS_PENDING: CSSProperties = { ...STATUS_OK, color: tok.textHelper, fontWeight: 400 };
const INFO_ROW: CSSProperties = { display: 'flex', gap: 40, marginBottom: 16, flexWrap: 'wrap' as const };
const INFO_CELL: CSSProperties = { minWidth: 160 };
const INFO_LABEL: CSSProperties = { fontSize: 11, color: tok.textHelper, marginBottom: 2, textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontFamily: tok.fontMono };
const INFO_VALUE: CSSProperties = { fontSize: 13, color: tok.textPrimary, fontFamily: tok.fontMono };

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

export function AgentRunningStarting() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Vault Agent — Starting</h1>
          <p style={PAGE_DESC}>Vault Agent is authenticating to Vault and preparing to write SVID files.</p>
          <StepperBar active={1} />
          <div style={LOG}>
{`2026-07-25T10:41:58Z [INFO]  agent: Starting vault agent ...
2026-07-25T10:41:58Z [INFO]  agent: auth method selected: kubernetes
2026-07-25T10:41:59Z [INFO]  agent: Attempting authentication to Vault ...`}
          </div>
          <div style={{ fontSize: 12, color: tok.textHelper }}>Waiting for Vault Agent to authenticate...</div>
        </div>
      </div>
    </div>
  );
}

export function AgentRunningAuthenticated() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Vault Agent — Authenticated</h1>
          <p style={PAGE_DESC}>Vault Agent authenticated successfully. Rendering SVID templates.</p>
          <StepperBar active={1} />
          <div style={LOG_OK}>
{`2026-07-25T10:41:58Z [INFO]  agent: Starting vault agent ...
2026-07-25T10:41:58Z [INFO]  agent: auth method selected: kubernetes
2026-07-25T10:41:59Z [INFO]  agent: Attempting authentication to Vault ...
2026-07-25T10:42:00Z [INFO]  auth.handler: Successfully authenticated
2026-07-25T10:42:00Z [INFO]  agent: Lease received. TTL=1h
2026-07-25T10:42:01Z [INFO]  agent.template: Rendering template /run/spiffe/svid.pem ...
2026-07-25T10:42:01Z [INFO]  agent.template: Rendering template /run/spiffe/key.pem ...
2026-07-25T10:42:01Z [INFO]  agent.template: Rendering template /run/spiffe/bundle.pem ...
2026-07-25T10:42:01Z [INFO]  agent.template: All templates rendered successfully.`}
          </div>
          <div style={SECTION_TITLE}>Written files</div>
          <table style={TABLE}>
            <thead>
              <tr>
                <th style={TH}>Path</th>
                <th style={TH}>Size</th>
                <th style={TH}>Written at</th>
                <th style={TH}>Status</th>
              </tr>
            </thead>
            <tbody>
              {agentFiles.map(f => (
                <tr key={f.path}>
                  <td style={{ ...TD, fontFamily: tok.fontMono, fontSize: 12 }}>{f.path}</td>
                  <td style={{ ...TD, color: tok.textSecondary }}>{f.size}</td>
                  <td style={{ ...TD, color: tok.textSecondary }}>{f.updated}</td>
                  <td style={TD}><span style={STATUS_OK}>written</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 20, fontSize: 12, color: tok.textSecondary }}>
            Next step: verify the SVID contents. &rarr;
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentRunningAuthFailed() {
  const errBox: CSSProperties = {
    border: `1px solid ${tok.borderStrong}`, borderRadius: 4, background: tok.layer01,
    padding: '10px 14px', marginBottom: 16, fontSize: 12,
  };
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Vault Agent — Auth Failed</h1>
          <p style={PAGE_DESC}>Vault Agent could not authenticate. No SVID files were written.</p>
          <StepperBar active={1} />
          <div style={LOG_ERR}>
{`2026-07-25T10:41:58Z [INFO]  agent: Starting vault agent ...
2026-07-25T10:41:58Z [INFO]  agent: auth method selected: kubernetes
2026-07-25T10:41:59Z [INFO]  agent: Attempting authentication to Vault ...
2026-07-25T10:42:00Z [ERROR] auth.handler: error authenticating:
    URL: POST ${`https://vault.corp.example/v1/auth/kubernetes/login`}
    Code: 403. Errors: permission denied
    (role "${ROLE_NAME}" is not bound to service account "payment-svc-v2" in namespace "production")`}
          </div>
          <div style={errBox}>
            <strong>Authentication failed</strong><br />
            The Kubernetes service account used by this pod does not match the binding on role{' '}
            <code style={{ fontFamily: tok.fontMono }}>{ROLE_NAME}</code>. Check that:
            <ul style={{ margin: '6px 0 0 16px', lineHeight: 1.7 }}>
              <li>The pod is running with service account <code style={{ fontFamily: tok.fontMono }}>payment-service</code></li>
              <li>The namespace is <code style={{ fontFamily: tok.fontMono }}>production</code></li>
              <li>The role binding was configured by your platform team</li>
            </ul>
          </div>
          <div style={{ fontSize: 12, color: tok.textHelper }}>No files written. Fix the config and restart Vault Agent.</div>
        </div>
      </div>
    </div>
  );
}
