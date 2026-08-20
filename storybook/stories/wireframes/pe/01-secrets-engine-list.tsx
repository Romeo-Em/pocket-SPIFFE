/**
 * 01-secrets-engine-list.tsx
 *
 * Secrets Engines index page.
 * States: Default (no SPIFFE mount) | WithSpiffe (SPIFFE mount present)
 */
import type { CSSProperties } from 'react';
import { tok, existingEngines, existingEnginesWithSpiffe } from './_pe-fixtures';

/* ── Shared layout ───────────────────────────────────────────── */

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

const SIDEBAR: CSSProperties = {
  width: 200,
  borderRight: `1px solid ${tok.borderSubtle}`,
  background: tok.layer01,
  padding: '16px 0',
  flexShrink: 0,
  overflowY: 'auto',
};

const BODY: CSSProperties = {
  flex: 1,
  display: 'flex',
  overflow: 'hidden',
};

const MAIN: CSSProperties = {
  flex: 1,
  padding: '24px 28px',
  overflowY: 'auto',
};

const PAGE_HEADER: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 20,
};

const PAGE_TITLE: CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  color: tok.textPrimary,
  margin: 0,
};

const PAGE_DESC: CSSProperties = {
  fontSize: 13,
  color: tok.textSecondary,
  marginTop: 4,
};

const BTN_PRIMARY: CSSProperties = {
  padding: '8px 14px',
  fontSize: 13,
  fontWeight: 500,
  border: `1.5px solid ${tok.borderStrong}`,
  borderRadius: 4,
  background: tok.textPrimary,
  color: tok.bg,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const TABLE: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
};

const TH: CSSProperties = {
  textAlign: 'left',
  padding: '8px 12px',
  borderBottom: `1px solid ${tok.borderSubtle}`,
  color: tok.textHelper,
  fontWeight: 500,
  fontSize: 11,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

const TD: CSSProperties = {
  padding: '10px 12px',
  borderBottom: `1px solid ${tok.borderSubtle}`,
  color: tok.textPrimary,
  verticalAlign: 'middle',
};

const BADGE: CSSProperties = {
  display: 'inline-block',
  padding: '2px 7px',
  fontSize: 11,
  fontFamily: tok.fontMono,
  border: `1px solid ${tok.borderSubtle}`,
  borderRadius: 3,
  background: tok.layer02,
  color: tok.textSecondary,
};

const BADGE_SPIFFE: CSSProperties = {
  ...BADGE,
  border: `1px solid ${tok.borderStrong}`,
  color: tok.textPrimary,
  fontWeight: 600,
};

const NAV_ITEM: CSSProperties = {
  padding: '6px 16px',
  fontSize: 13,
  color: tok.textSecondary,
  cursor: 'pointer',
};

const NAV_ITEM_ACTIVE: CSSProperties = {
  ...NAV_ITEM,
  color: tok.textPrimary,
  fontWeight: 600,
  background: tok.layer02,
  borderLeft: `3px solid ${tok.textPrimary}`,
  paddingLeft: 13,
};

const NAV_GROUP: CSSProperties = {
  padding: '12px 16px 4px',
  fontSize: 10,
  fontFamily: tok.fontMono,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: tok.textHelper,
};

/* ── Sub-components ──────────────────────────────────────────── */

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

function VaultSidebar({ active }: { active: string }) {
  const sections = [
    { group: 'Secrets',   items: ['Secrets Engines', 'KV'] },
    { group: 'Access',    items: ['Auth Methods', 'Policies', 'Entities'] },
    { group: 'System',    items: ['Audit', 'Replication', 'Settings'] },
  ];
  return (
    <div style={SIDEBAR}>
      {sections.map(({ group, items }) => (
        <div key={group}>
          <div style={NAV_GROUP}>{group}</div>
          {items.map(item => (
            <div key={item} style={item === active ? NAV_ITEM_ACTIVE : NAV_ITEM}>{item}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function EngineRow({ path, type, description, highlight }: {
  path: string; type: string; description: string; highlight?: boolean;
}) {
  return (
    <tr style={highlight ? { background: tok.layer01 } : {}}>
      <td style={{ ...TD, fontFamily: tok.fontMono, fontWeight: highlight ? 600 : 400 }}>
        {path}
      </td>
      <td style={TD}>
        <span style={highlight ? BADGE_SPIFFE : BADGE}>{type}</span>
      </td>
      <td style={{ ...TD, color: tok.textSecondary }}>{description}</td>
      <td style={{ ...TD, color: tok.textHelper, fontSize: 12 }}>
        {highlight ? (
          <span style={{ fontFamily: tok.fontMono, fontSize: 11 }}>Configure →</span>
        ) : (
          <span>View →</span>
        )}
      </td>
    </tr>
  );
}

/* ── Exported wireframes ─────────────────────────────────────── */

export function SecretsEngineListDefault() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar active="Secrets Engines" />
        <div style={MAIN}>
          <div style={PAGE_HEADER}>
            <div>
              <h1 style={PAGE_TITLE}>Secrets Engines</h1>
              <p style={PAGE_DESC}>Manage secrets engine mounts. Each mount is an independent instance of a secrets backend.</p>
            </div>
            <button style={BTN_PRIMARY}>+ Enable new engine</button>
          </div>
          <table style={TABLE}>
            <thead>
              <tr>
                <th style={TH}>Path</th>
                <th style={TH}>Type</th>
                <th style={TH}>Description</th>
                <th style={TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {existingEngines.map(e => (
                <EngineRow key={e.path} {...e} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function SecretsEngineListWithSpiffe() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar active="Secrets Engines" />
        <div style={MAIN}>
          <div style={PAGE_HEADER}>
            <div>
              <h1 style={PAGE_TITLE}>Secrets Engines</h1>
              <p style={PAGE_DESC}>Manage secrets engine mounts. Each mount is an independent instance of a secrets backend.</p>
            </div>
            <button style={BTN_PRIMARY}>+ Enable new engine</button>
          </div>
          <table style={TABLE}>
            <thead>
              <tr>
                <th style={TH}>Path</th>
                <th style={TH}>Type</th>
                <th style={TH}>Description</th>
                <th style={TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {existingEnginesWithSpiffe.map(e => (
                <EngineRow key={e.path} {...e} highlight={e.type === 'SPIFFE'} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
