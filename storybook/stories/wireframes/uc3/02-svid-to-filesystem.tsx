/**
 * 02-svid-to-filesystem.tsx
 *
 * UC3 Kubernetes Workloads — Step 2: Vault Agent writes SVID files to pod filesystem.
 * States: MountEmpty | SvidWritten | PermissionDenied
 */
import type { CSSProperties } from 'react';
import { tok, svidFiles, SPIFFE_ID, UC3_STEPS } from './_uc3-fixtures';

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
const TABLE: CSSProperties      = { width: '100%', borderCollapse: 'collapse' as const, fontSize: 12 };
const TH: CSSProperties         = { textAlign: 'left' as const, padding: '7px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textHelper, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.04em' };
const TD: CSSProperties         = { padding: '8px 10px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textPrimary, verticalAlign: 'top' as const };
const EMPTY_STATE: CSSProperties = { padding: '32px 0', textAlign: 'center' as const, color: tok.textHelper, fontSize: 12 };
const NOTE: CSSProperties       = { fontSize: 12, color: tok.textHelper, marginTop: 8 };

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

export function SvidMountEmpty() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>SVID Delivery — Filesystem</h1>
          <p style={PAGE_DESC}>Vault Agent has authenticated. Writing X.509 SVID files to the pod's shared volume mount.</p>
          <StepperBar active={1} />
          <div style={CARD}>
            <div style={CARD_TITLE}>Target mount</div>
            <div style={ROW}><span style={KEY}>Mount path</span><span style={VAL}>/run/spiffe/</span></div>
            <div style={ROW}><span style={KEY}>Volume type</span><span style={VAL}>emptyDir (shared with app container)</span></div>
            <div style={ROW}><span style={KEY}>Files</span><span style={VAL}>waiting for Vault Agent...</span></div>
          </div>
          <div style={EMPTY_STATE}>
            /run/spiffe/ is empty.<br />
            <span style={{ fontSize: 11 }}>Vault Agent is minting the SVID. Files will appear once the first issuance completes.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SvidWritten() {
  const logLines = `[INFO] vault.agent: authenticated to Vault (role=${`k8s-payment`})
[INFO] vault.agent: rendered template → /run/spiffe/svid.pem (2134 bytes)
[INFO] vault.agent: rendered template → /run/spiffe/key.pem (302 bytes)
[INFO] vault.agent: rendered template → /run/spiffe/bundle.pem (1843 bytes)
[INFO] vault.agent: renewal scheduled at 2026-08-24T09:54:01Z (70% of TTL)`;

  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>SVID Delivery — Filesystem</h1>
          <p style={PAGE_DESC}>X.509 SVID written to pod filesystem. Vault Agent will renew automatically at 70% of TTL.</p>
          <StepperBar active={1} />
          <div style={CARD}>
            <div style={CARD_TITLE}>SVID identity</div>
            <div style={ROW}><span style={KEY}>SPIFFE ID</span><span style={VAL}>{SPIFFE_ID}</span></div>
            <div style={ROW}><span style={KEY}>Expires at</span><span style={VAL}>2026-08-24T10:12:01Z</span></div>
            <div style={ROW}><span style={KEY}>Auto-renewal</span><span style={VAL}>2026-08-24T09:54:01Z (70% of TTL)</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_OK}>valid</span></div>
          </div>
          <table style={TABLE}>
            <thead>
              <tr>
                <th style={TH}>File path</th>
                <th style={TH}>Size</th>
                <th style={TH}>Updated</th>
                <th style={TH}>Contents</th>
              </tr>
            </thead>
            <tbody>
              {svidFiles.map((f, i) => (
                <tr key={i}>
                  <td style={{ ...TD, fontFamily: tok.fontMono }}>{f.path}</td>
                  <td style={{ ...TD, fontFamily: tok.fontMono, color: tok.textHelper }}>{f.size}</td>
                  <td style={{ ...TD, fontFamily: tok.fontMono, color: tok.textHelper }}>{f.updated}</td>
                  <td style={{ ...TD, color: tok.textSecondary }}>{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ ...CARD_TITLE, marginTop: 16 }}>Vault Agent log</div>
          <div style={CODE_BLOCK}>{logLines}</div>
        </div>
      </div>
    </div>
  );
}

export function SvidPermissionDenied() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>SVID Delivery — Filesystem</h1>
          <p style={PAGE_DESC}>Vault Agent cannot write SVID files. Volume mount permission error.</p>
          <StepperBar active={1} />
          <div style={{ ...CARD, borderColor: tok.borderStrong }}>
            <div style={CARD_TITLE}>Write error</div>
            <div style={ROW}><span style={KEY}>Target path</span><span style={VAL}>/run/spiffe/svid.pem</span></div>
            <div style={ROW}><span style={KEY}>Status</span><span style={BADGE_ERR}>permission denied</span></div>
            <div style={ROW}><span style={KEY}>Reason</span><span style={{ fontFamily: tok.fontMono, fontSize: 11, color: tok.textSecondary }}>open /run/spiffe/svid.pem: permission denied (uid 1000, mode 750)</span></div>
          </div>
          <div style={CODE_BLOCK}>{`# Fix: ensure emptyDir mount is shared and writable
volumes:
  - name: spiffe-svid
    emptyDir: {}
containers:
  - name: vault-agent
    volumeMounts:
      - name: spiffe-svid
        mountPath: /run/spiffe
  - name: app
    volumeMounts:
      - name: spiffe-svid
        mountPath: /run/spiffe
        readOnly: true`}</div>
        </div>
      </div>
    </div>
  );
}
