/**
 * pe-spiffe-prototype.stories.tsx
 *
 * Clickable prototype — Platform Engineer SPIFFE X.509 Setup
 *
 * All 21 wireframe states stitched into a single navigable flow.
 * Buttons, engine cards, table rows, and breadcrumbs fire real
 * state transitions. The sidebar nav and back links are also wired.
 *
 * Scene map (linear happy path + error branches):
 *
 *   engine-list
 *     → enable-default          (click "+ Enable new engine")
 *       → enable-spiffe          (click SPIFFE card)
 *         → enable-conflict       (type existing path — toggle)
 *         → engine-config-default (click "Next: Configuration")
 *           → engine-config-error-domain  (toggle)
 *           → engine-config-error-issuer  (toggle)
 *           → engine-config-saving        (click "Save")
 *             → engine-config-saved
 *               → role-create-default
 *                 → role-create-filled
 *                   → role-create-error-template (toggle)
 *                   → role-create-error-ttl      (toggle)
 *                   → role-create-saving
 *                     → role-create-saved
 *                       → auth-empty
 *                         → auth-method-selected
 *                           → auth-policy-preview
 *                             → auth-attached
 *                               → bundle-checking
 *                                 → bundle-success
 *                                   → engine-list-done
 *                                 → bundle-unreachable (toggle)
 *                                 → bundle-empty       (toggle)
 */

import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  tok,
  existingEngines,
  existingEnginesWithSpiffe,
  engineTypes,
  pkiIssuers,
  existingAuthMethods,
  roleDefaults,
  TRUST_DOMAIN,
  ENGINE_PATH,
  BUNDLE_URL,
  ROLE_NAME,
  POLICY_HCL,
  bundleVerifyResult,
  PE_STEPS,
} from './pe/_pe-fixtures';

/* ================================================================
 * SCENE TYPE
 * ================================================================ */

type Scene =
  | 'engine-list'
  | 'enable-default'
  | 'enable-spiffe'
  | 'enable-conflict'
  | 'config-default'
  | 'config-error-domain'
  | 'config-error-issuer'
  | 'config-saving'
  | 'config-saved'
  | 'role-default'
  | 'role-filled'
  | 'role-error-template'
  | 'role-error-ttl'
  | 'role-saving'
  | 'role-saved'
  | 'auth-empty'
  | 'auth-selected'
  | 'auth-policy'
  | 'auth-attached'
  | 'bundle-checking'
  | 'bundle-success'
  | 'bundle-unreachable'
  | 'bundle-empty'
  | 'engine-list-done';

/* ================================================================
 * SHARED PRIMITIVES (inline — no import needed)
 * ================================================================ */

const S: Record<string, CSSProperties> = {
  shell: {
    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
    background: tok.bg, fontFamily: tok.fontSans, color: tok.textPrimary,
    fontSize: 13, overflow: 'hidden',
  },
  topbar: {
    height: 48, borderBottom: `1px solid ${tok.borderSubtle}`,
    background: tok.layer01, display: 'flex', alignItems: 'center',
    padding: '0 20px', gap: 12, flexShrink: 0,
  },
  breadcrumb: {
    fontSize: 12, color: tok.textHelper, padding: '10px 28px',
    borderBottom: `1px solid ${tok.borderSubtle}`, background: tok.layer01,
    flexShrink: 0,
  },
  stepperRow: {
    display: 'flex', alignItems: 'center', padding: '14px 28px',
    borderBottom: `1px solid ${tok.borderSubtle}`, flexShrink: 0, gap: 0,
  },
  body: { flex: 1, display: 'flex', overflow: 'hidden' },
  sidebar: {
    width: 200, borderRight: `1px solid ${tok.borderSubtle}`,
    background: tok.layer01, padding: '16px 0', flexShrink: 0, overflowY: 'auto',
  },
  main: { flex: 1, padding: '24px 28px', overflowY: 'auto' },
  content: { flex: 1, padding: '28px 28px', overflowY: 'auto', maxWidth: 700 },
  pageHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 20,
  },
  pageTitle: { fontSize: 18, fontWeight: 600, color: tok.textPrimary, margin: 0 },
  pageDesc: { fontSize: 13, color: tok.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 600, marginBottom: 16, color: tok.textPrimary },
  sectionDesc: { fontSize: 13, color: tok.textSecondary, marginBottom: 20 },
  fieldGroup: { marginBottom: 20 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5, color: tok.textPrimary },
  helper: { fontSize: 11, color: tok.textHelper, marginTop: 4, lineHeight: 1.5 },
  errorMsg: { fontSize: 11, color: tok.textPrimary, marginTop: 4, display: 'flex', alignItems: 'flex-start', gap: 4 },
  btnRow: {
    display: 'flex', justifyContent: 'flex-end', gap: 10,
    paddingTop: 16, borderTop: `1px solid ${tok.borderSubtle}`, marginTop: 8,
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: {
    textAlign: 'left', padding: '8px 12px', borderBottom: `1px solid ${tok.borderSubtle}`,
    color: tok.textHelper, fontWeight: 500, fontSize: 11, letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  td: { padding: '10px 12px', borderBottom: `1px solid ${tok.borderSubtle}`, color: tok.textPrimary, verticalAlign: 'middle' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  engineGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 },
  navGroup: {
    padding: '12px 16px 4px', fontSize: 10, fontFamily: tok.fontMono,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: tok.textHelper,
  },
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '40px 20px',
    border: `1px dashed ${tok.borderSubtle}`, borderRadius: 6,
    textAlign: 'center', color: tok.textHelper, gap: 10,
  },
  codeBlock: {
    display: 'block', width: '100%', padding: '12px 14px', fontSize: 12,
    fontFamily: tok.fontMono, lineHeight: 1.6, border: `1px solid ${tok.borderSubtle}`,
    borderRadius: 4, background: tok.layer01, color: tok.textPrimary,
    boxSizing: 'border-box', whiteSpace: 'pre', overflowX: 'auto',
  },
  resultCard: {
    border: `1px solid ${tok.borderSubtle}`, borderRadius: 6,
    overflow: 'hidden', marginBottom: 20,
  },
  resultHeader: {
    padding: '10px 14px', background: tok.layer01,
    borderBottom: `1px solid ${tok.borderSubtle}`,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontSize: 12, fontWeight: 600,
  },
  resultRow: { display: 'grid', gridTemplateColumns: '180px 1fr', borderBottom: `1px solid ${tok.borderSubtle}` },
  resultLabel: {
    padding: '9px 14px', fontSize: 11, fontFamily: tok.fontMono, color: tok.textHelper,
    background: tok.layer01, textTransform: 'uppercase', letterSpacing: '0.06em',
    borderRight: `1px solid ${tok.borderSubtle}`,
  },
  resultValue: { padding: '9px 14px', fontSize: 12, fontFamily: tok.fontMono, color: tok.textPrimary },
  handoffBlock: { border: `1px solid ${tok.borderSubtle}`, borderRadius: 6, overflow: 'hidden', marginBottom: 20 },
  handoffHeader: {
    padding: '8px 14px', background: tok.layer01,
    borderBottom: `1px solid ${tok.borderSubtle}`, fontSize: 11,
    fontFamily: tok.fontMono, letterSpacing: '0.1em', textTransform: 'uppercase',
    color: tok.textHelper, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
};

/* ── Inline helpers ──────────────────────────────────────────── */

const btn = (variant: 'primary' | 'secondary' | 'disabled' | 'loading', onClick?: () => void): CSSProperties => ({
  padding: '8px 16px', fontSize: 13, fontWeight: 500, borderRadius: 4,
  cursor: variant === 'disabled' || variant === 'loading' ? 'not-allowed' : 'pointer',
  border: variant === 'primary' || variant === 'loading' ? 'none' : `1px solid ${tok.borderSubtle}`,
  background: variant === 'primary' || variant === 'loading' ? tok.textPrimary : variant === 'disabled' ? tok.layer02 : tok.bg,
  color: variant === 'primary' || variant === 'loading' ? tok.bg : variant === 'disabled' ? tok.textHelper : tok.textPrimary,
  opacity: variant === 'loading' ? 0.7 : 1,
});

const input = (state: 'default' | 'error' | 'disabled' | 'valid' = 'default'): CSSProperties => ({
  display: 'block', width: '100%', padding: '7px 10px', fontSize: 13,
  fontFamily: tok.fontMono, border: `1px solid ${state === 'error' ? tok.borderStrong : tok.borderSubtle}`,
  borderRadius: 4, background: state === 'disabled' ? tok.layer02 : tok.bg,
  color: state === 'disabled' ? tok.textHelper : tok.textPrimary,
  boxSizing: 'border-box', outline: state === 'error' ? `1px solid ${tok.borderStrong}` : 'none',
});

const select = (disabled?: boolean): CSSProperties => ({
  display: 'block', width: '100%', padding: '7px 10px', fontSize: 13,
  border: `1px solid ${tok.borderSubtle}`, borderRadius: 4,
  background: disabled ? tok.layer02 : tok.bg,
  color: disabled ? tok.textHelper : tok.textPrimary,
  boxSizing: 'border-box', appearance: 'none', paddingRight: 28,
});

const alert = (type: 'neutral' | 'error' | 'warning' | 'success'): CSSProperties => ({
  padding: '10px 14px', border: `1px solid ${tok.borderSubtle}`,
  borderLeft: `3px solid ${type === 'neutral' ? tok.borderSubtle : tok.borderStrong}`,
  borderRadius: 4, background: tok.layer01, fontSize: 12,
  color: tok.textPrimary, marginBottom: 16, lineHeight: 1.5,
});

const badge = (strong?: boolean): CSSProperties => ({
  display: 'inline-block', padding: '2px 7px', fontSize: 11, fontFamily: tok.fontMono,
  border: `1px solid ${strong ? tok.borderStrong : tok.borderSubtle}`, borderRadius: 3,
  background: tok.layer02, color: strong ? tok.textPrimary : tok.textSecondary,
  fontWeight: strong ? 600 : 400,
});

/* ================================================================
 * SHARED LAYOUT COMPONENTS
 * ================================================================ */

function TopBar({ go }: { go: (s: Scene) => void }) {
  return (
    <div style={S.topbar}>
      <span
        style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', cursor: 'pointer' }}
        onClick={() => go('engine-list')}
      >VAULT</span>
      <span style={{ color: tok.borderSubtle, margin: '0 4px' }}>|</span>
      <span style={{ fontSize: 12, color: tok.textSecondary }}>corp-prod</span>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 12, color: tok.textHelper }}>⚙  👤  ?</span>
    </div>
  );
}

function Sidebar({ active, go }: { active: string; go: (s: Scene) => void }) {
  const sections = [
    { group: 'Secrets',   items: ['Secrets Engines', 'KV'] },
    { group: 'Access',    items: ['Auth Methods', 'Policies', 'Entities'] },
    { group: 'System',    items: ['Audit', 'Replication', 'Settings'] },
  ];
  return (
    <div style={S.sidebar}>
      {sections.map(({ group, items }) => (
        <div key={group}>
          <div style={S.navGroup as CSSProperties}>{group}</div>
          {items.map(item => (
            <div
              key={item}
              onClick={() => item === 'Secrets Engines' ? go('engine-list') : undefined}
              style={{
                padding: '6px 16px', fontSize: 13, cursor: 'pointer',
                color: item === active ? tok.textPrimary : tok.textSecondary,
                fontWeight: item === active ? 600 : 400,
                background: item === active ? tok.layer02 : 'transparent',
                borderLeft: item === active ? `3px solid ${tok.textPrimary}` : '3px solid transparent',
                paddingLeft: item === active ? 13 : 16,
              }}
            >{item}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Stepper({ activeStep }: { activeStep: number }) {
  return (
    <div style={S.stepperRow}>
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

function Breadcrumb({ parts, go, targets }: {
  parts: string[];
  go: (s: Scene) => void;
  targets?: (Scene | null)[];
}) {
  return (
    <div style={S.breadcrumb}>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <span style={{ margin: '0 6px' }}>▸</span>}
          {targets?.[i] ? (
            <span
              style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationColor: tok.borderSubtle }}
              onClick={() => go(targets[i]!)}
            >{p}</span>
          ) : (
            <span style={{ color: i === parts.length - 1 ? tok.textPrimary : tok.textHelper }}>{p}</span>
          )}
        </span>
      ))}
    </div>
  );
}

/* ── Scene indicator overlay ─────────────────────────────────── */
function SceneHint({ scene }: { scene: Scene }) {
  return (
    <div style={{
      position: 'fixed', bottom: 12, right: 16, zIndex: 9999,
      fontFamily: tok.fontMono, fontSize: 10, color: tok.textHelper,
      background: tok.layer02, border: `1px solid ${tok.borderSubtle}`,
      borderRadius: 4, padding: '3px 8px', pointerEvents: 'none',
    }}>
      scene: {scene}
    </div>
  );
}

/* ================================================================
 * PROTOTYPE COMPONENT
 * ================================================================ */

export function PEPrototype() {
  const [scene, setScene] = useState<Scene>('engine-list');
  const go = (s: Scene) => setScene(s);

  /* ── 1. Engine List ─────────────────────────────────────────── */
  if (scene === 'engine-list') {
    const engines = existingEngines;
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <div style={S.body}>
          <Sidebar active="Secrets Engines" go={go} />
          <div style={S.main}>
            <div style={S.pageHeader}>
              <div>
                <h1 style={S.pageTitle}>Secrets Engines</h1>
                <p style={S.pageDesc}>Manage secrets engine mounts. Each mount is an independent instance of a secrets backend.</p>
              </div>
              <button style={btn('primary')} onClick={() => go('enable-default')}>+ Enable new engine</button>
            </div>
            <table style={S.table}>
              <thead><tr>
                <th style={S.th as CSSProperties}>Path</th>
                <th style={S.th as CSSProperties}>Type</th>
                <th style={S.th as CSSProperties}>Description</th>
                <th style={S.th as CSSProperties}>Actions</th>
              </tr></thead>
              <tbody>
                {engines.map(e => (
                  <tr key={e.path}>
                    <td style={{ ...S.td as CSSProperties, fontFamily: tok.fontMono }}>{e.path}</td>
                    <td style={S.td as CSSProperties}><span style={badge()}>{e.type}</span></td>
                    <td style={{ ...S.td as CSSProperties, color: tok.textSecondary }}>{e.description}</td>
                    <td style={{ ...S.td as CSSProperties, color: tok.textHelper, fontSize: 12 }}>View →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ── 1b. Engine List — done (SPIFFE row present) ────────────── */
  if (scene === 'engine-list-done') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <div style={S.body}>
          <Sidebar active="Secrets Engines" go={go} />
          <div style={S.main}>
            <div style={S.pageHeader}>
              <div>
                <h1 style={S.pageTitle}>Secrets Engines</h1>
                <p style={S.pageDesc}>Manage secrets engine mounts. Each mount is an independent instance of a secrets backend.</p>
              </div>
              <button style={btn('primary')} onClick={() => go('enable-default')}>+ Enable new engine</button>
            </div>
            <div style={{ ...alert('neutral'), marginBottom: 16 }}>
              ✓  SPIFFE Secrets Engine enabled at <code style={{ fontFamily: tok.fontMono, fontSize: 11 }}>spiffe/</code>. Trust bundle is live.
            </div>
            <table style={S.table}>
              <thead><tr>
                <th style={S.th as CSSProperties}>Path</th>
                <th style={S.th as CSSProperties}>Type</th>
                <th style={S.th as CSSProperties}>Description</th>
                <th style={S.th as CSSProperties}>Actions</th>
              </tr></thead>
              <tbody>
                {existingEnginesWithSpiffe.map(e => (
                  <tr key={e.path} style={e.type === 'SPIFFE' ? { background: tok.layer01 } : {}}>
                    <td style={{ ...S.td as CSSProperties, fontFamily: tok.fontMono, fontWeight: e.type === 'SPIFFE' ? 600 : 400 }}>{e.path}</td>
                    <td style={S.td as CSSProperties}><span style={badge(e.type === 'SPIFFE')}>{e.type}</span></td>
                    <td style={{ ...S.td as CSSProperties, color: tok.textSecondary }}>{e.description}</td>
                    <td style={{ ...S.td as CSSProperties, fontSize: 12 }}>
                      {e.type === 'SPIFFE'
                        ? <span style={{ fontFamily: tok.fontMono, fontSize: 11, cursor: 'pointer' }} onClick={() => go('config-saved')}>Configure →</span>
                        : <span style={{ color: tok.textHelper }}>View →</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ── 2. Enable Engine — default ─────────────────────────────── */
  if (scene === 'enable-default') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'Enable new engine']} go={go} targets={['engine-list', null]} />
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 28px', borderBottom: `1px solid ${tok.borderSubtle}`, flexShrink: 0 }}>
          {['Method', 'Configuration'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? tok.textPrimary : tok.textHelper, fontSize: 13 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${i === 0 ? tok.textPrimary : tok.borderSubtle}`, background: tok.bg, color: tok.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{i + 1}</span>
                {s}
              </div>
              {i === 0 && <span style={{ margin: '0 12px', color: tok.borderSubtle, fontSize: 16 }}>›</span>}
            </div>
          ))}
        </div>
        <div style={S.content}>
          <div style={S.sectionTitle}>Choose a secrets engine type</div>
          <div style={S.sectionDesc}>Select the type of secrets backend to enable. Each type handles a different category of secrets.</div>
          <div style={S.engineGrid}>
            {engineTypes.map(e => (
              <div key={e.id}
                style={{ border: `1px solid ${tok.borderSubtle}`, borderRadius: 6, padding: '14px 16px', cursor: 'pointer', background: tok.bg }}
                onClick={() => e.id === 'spiffe' ? go('enable-spiffe') : undefined}
              >
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{e.name}</div>
                <div style={{ fontSize: 12, color: tok.textSecondary }}>{e.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ ...S.fieldGroup, maxWidth: 480 }}>
            <label style={S.label as CSSProperties}>Mount path *</label>
            <input readOnly style={input()} value="" placeholder="e.g. spiffe" />
            <div style={S.helper as CSSProperties}>Click the SPIFFE card above to continue.</div>
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')} onClick={() => go('engine-list')}>Cancel</button>
            <button style={btn('disabled')} disabled>Next: Configuration</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 3. Enable Engine — SPIFFE selected ─────────────────────── */
  if (scene === 'enable-spiffe') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'Enable new engine']} go={go} targets={['engine-list', null]} />
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 28px', borderBottom: `1px solid ${tok.borderSubtle}`, flexShrink: 0 }}>
          {['Method', 'Configuration'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? tok.textPrimary : tok.textHelper, fontSize: 13 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${i === 0 ? tok.textPrimary : tok.borderSubtle}`, background: tok.bg, color: tok.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{i + 1}</span>
                {s}
              </div>
              {i === 0 && <span style={{ margin: '0 12px', color: tok.borderSubtle, fontSize: 16 }}>›</span>}
            </div>
          ))}
        </div>
        <div style={S.content}>
          <div style={S.sectionTitle}>Choose a secrets engine type</div>
          <div style={S.sectionDesc}>Select the type of secrets backend to enable.</div>
          <div style={S.engineGrid}>
            {engineTypes.map(e => (
              <div key={e.id}
                style={{ border: e.id === 'spiffe' ? `2px solid ${tok.textPrimary}` : `1px solid ${tok.borderSubtle}`, borderRadius: 6, padding: '14px 16px', cursor: 'pointer', background: e.id === 'spiffe' ? tok.layer01 : tok.bg }}
                onClick={() => e.id !== 'spiffe' ? go('enable-default') : undefined}
              >
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{e.name}</div>
                <div style={{ fontSize: 12, color: tok.textSecondary }}>{e.desc}</div>
                {e.id === 'spiffe' && <div style={{ marginTop: 6, fontSize: 11, fontFamily: tok.fontMono, color: tok.textHelper }}>✓ selected</div>}
              </div>
            ))}
          </div>
          <div style={{ ...S.fieldGroup, maxWidth: 480 }}>
            <label style={S.label as CSSProperties}>Mount path *</label>
            <input readOnly style={input('valid')} value="spiffe" />
            <div style={S.helper as CSSProperties}>The path where this engine will be mounted.</div>
          </div>
          <div style={{ ...S.fieldGroup, maxWidth: 480 }}>
            <label style={{ ...S.label as CSSProperties, fontWeight: 400, color: tok.textSecondary }}>Description (optional)</label>
            <input readOnly style={input('valid')} value="SPIFFE workload identity for corp.example" />
          </div>
          <div style={{ fontSize: 11, color: tok.textHelper, marginBottom: 12 }}>
            ↳ Try the path conflict: <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => go('enable-conflict')}>type an existing path</span>
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')} onClick={() => go('engine-list')}>Cancel</button>
            <button style={btn('primary')} onClick={() => go('config-default')}>Next: Configuration</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 4. Enable Engine — path conflict ───────────────────────── */
  if (scene === 'enable-conflict') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'Enable new engine']} go={go} targets={['engine-list', null]} />
        <div style={{ display: 'flex', padding: '14px 28px', borderBottom: `1px solid ${tok.borderSubtle}`, flexShrink: 0 }} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Choose a secrets engine type</div>
          <div style={{ ...S.fieldGroup, maxWidth: 480 }}>
            <label style={S.label as CSSProperties}>Mount path *</label>
            <input readOnly style={input('error')} value="pki" />
            <div style={S.errorMsg as CSSProperties}>⚠ A secrets engine is already mounted at this path.</div>
          </div>
          <div style={{ padding: '8px 12px', border: `1px solid ${tok.borderSubtle}`, borderLeft: `3px solid ${tok.borderStrong}`, borderRadius: 4, background: tok.layer01, fontSize: 12, color: tok.textPrimary, marginBottom: 16, maxWidth: 480 }}>
            ⚠  Choose a different path or disable the existing engine at <code style={{ fontFamily: tok.fontMono }}>pki/</code> first.
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')} onClick={() => go('enable-spiffe')}>← Back</button>
            <button style={btn('disabled')} disabled>Next: Configuration</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 5. Engine Config — default ─────────────────────────────── */
  if (scene === 'config-default') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Configuration']} go={go} targets={['engine-list', null, null]} />
        <Stepper activeStep={1} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Configure trust domain</div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>Trust domain *</label>
            <input readOnly style={input()} value="" placeholder="e.g. corp.example" />
            <div style={S.helper as CSSProperties}>Cannot be changed after the first SVID is issued. Click a filled state below.</div>
          </div>
          <div style={{ fontSize: 11, color: tok.textHelper, marginBottom: 20, display: 'flex', gap: 16 }}>
            <span>Jump to: </span>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => go('config-error-domain')}>domain error</span>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => go('config-error-issuer')}>issuer error</span>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => go('config-saving')}>filled → saving</span>
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')} onClick={() => go('enable-spiffe')}>← Back</button>
            <button style={btn('disabled')} disabled>Save configuration</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 6. Engine Config — trust domain error ──────────────────── */
  if (scene === 'config-error-domain') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Configuration']} go={go} targets={['engine-list', null, null]} />
        <Stepper activeStep={1} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Configure trust domain</div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>Trust domain *</label>
            <input readOnly style={input('error')} value="corp example" />
            <div style={S.errorMsg as CSSProperties}>⚠ Trust domain must be a valid hostname (lowercase, no spaces). Example: corp.example</div>
          </div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>PKI issuer path *</label>
            <select style={select()}><option>{pkiIssuers[0].label}</option></select>
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')} onClick={() => go('config-default')}>← Back</button>
            <button style={btn('disabled')} disabled>Save configuration</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 7. Engine Config — issuer missing ──────────────────────── */
  if (scene === 'config-error-issuer') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Configuration']} go={go} targets={['engine-list', null, null]} />
        <Stepper activeStep={1} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Configure trust domain</div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>Trust domain *</label>
            <input readOnly style={input('valid')} value={TRUST_DOMAIN} />
          </div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>PKI issuer path *</label>
            <select style={{ ...select(), border: `1px solid ${tok.borderStrong}` }}>
              <option value="">Select a PKI issuer...</option>
            </select>
            <div style={S.errorMsg as CSSProperties}>⚠ A PKI issuer path is required for X.509 SVID issuance.</div>
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')} onClick={() => go('config-default')}>← Back</button>
            <button style={btn('disabled')} disabled>Save configuration</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 8. Engine Config — saving ──────────────────────────────── */
  if (scene === 'config-saving') {
    // Auto-advance after 1.2s
    setTimeout(() => go('config-saved'), 1200);
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Configuration']} go={go} targets={['engine-list', null, null]} />
        <Stepper activeStep={1} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Configure trust domain</div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>Trust domain</label>
            <input readOnly style={input('disabled')} value={TRUST_DOMAIN} />
          </div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>PKI issuer path</label>
            <select style={select(true)} disabled><option>Default Issuer (pki/)</option></select>
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('loading')} disabled>Saving... ◌</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 9. Engine Config — saved ───────────────────────────────── */
  if (scene === 'config-saved') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Configuration']} go={go} targets={['engine-list', null, null]} />
        <Stepper activeStep={1} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Configure trust domain</div>
          <div style={alert('success')}>✓  Trust domain configured. Trust bundle endpoint is now live at <code style={{ fontFamily: tok.fontMono, fontSize: 11 }}>https://vault.corp.example/v1/spiffe/bundle</code></div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>Trust domain</label>
            <input readOnly style={input('disabled')} value={TRUST_DOMAIN} />
          </div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>PKI issuer path</label>
            <input readOnly style={input('disabled')} value="pki/issuer/default" />
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')}>Edit configuration</button>
            <button style={btn('primary')} onClick={() => go('role-default')}>Next: Create a role →</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 10. Role Create — default ──────────────────────────────── */
  if (scene === 'role-default') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Roles', 'Create']} go={go} targets={['engine-list', null, null, null]} />
        <Stepper activeStep={2} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Create role</div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>Role name *</label>
            <input readOnly style={input()} value="" placeholder="e.g. k8s-worker" />
            <div style={S.helper as CSSProperties}>Click a state below to continue.</div>
          </div>
          <div style={{ fontSize: 11, color: tok.textHelper, marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span>Jump to: </span>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => go('role-error-template')}>template error</span>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => go('role-error-ttl')}>TTL error</span>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => go('role-saving')}>filled → saving</span>
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')} onClick={() => go('config-saved')}>← Back</button>
            <button style={btn('disabled')} disabled>Create role</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 11. Role Create — template error ───────────────────────── */
  if (scene === 'role-error-template') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Roles', 'Create']} go={go} targets={['engine-list', null, null, null]} />
        <Stepper activeStep={2} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Create role</div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>Role name *</label>
            <input readOnly style={input('valid')} value={ROLE_NAME} />
          </div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>SPIFFE ID template *</label>
            <textarea readOnly style={{ display: 'block', width: '100%', padding: '7px 10px', fontSize: 12, fontFamily: tok.fontMono, border: `1px solid ${tok.borderStrong}`, borderRadius: 4, background: tok.bg, color: tok.textPrimary, boxSizing: 'border-box', minHeight: 56, resize: 'vertical' }} value="k8s/payments-processor" rows={2} />
            <div style={S.errorMsg as CSSProperties}>⚠ Template must produce a valid SPIFFE ID starting with spiffe://</div>
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')} onClick={() => go('role-default')}>← Back</button>
            <button style={btn('disabled')} disabled>Create role</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 12. Role Create — TTL error ────────────────────────────── */
  if (scene === 'role-error-ttl') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Roles', 'Create']} go={go} targets={['engine-list', null, null, null]} />
        <Stepper activeStep={2} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Create role</div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>Role name *</label>
            <input readOnly style={input('valid')} value={ROLE_NAME} />
          </div>
          <div style={S.twoCol as CSSProperties}>
            <div style={S.fieldGroup as CSSProperties}>
              <label style={S.label as CSSProperties}>TTL</label>
              <input readOnly style={input('valid')} value="48h" />
            </div>
            <div style={S.fieldGroup as CSSProperties}>
              <label style={{ ...S.label as CSSProperties, fontWeight: 400, color: tok.textSecondary }}>Max TTL</label>
              <input readOnly style={input('error')} value="24h" />
              <div style={S.errorMsg as CSSProperties}>⚠ Max TTL must be ≥ TTL.</div>
            </div>
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')} onClick={() => go('role-default')}>← Back</button>
            <button style={btn('disabled')} disabled>Create role</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 13. Role Create — saving ───────────────────────────────── */
  if (scene === 'role-saving') {
    setTimeout(() => go('role-saved'), 1200);
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Roles', 'Create']} go={go} targets={['engine-list', null, null, null]} />
        <Stepper activeStep={2} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Create role</div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>Role name</label>
            <input readOnly style={input('disabled')} value={ROLE_NAME} />
          </div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>SPIFFE ID template</label>
            <textarea readOnly style={{ display: 'block', width: '100%', padding: '7px 10px', fontSize: 12, fontFamily: tok.fontMono, border: `1px solid ${tok.borderSubtle}`, borderRadius: 4, background: tok.layer02, color: tok.textHelper, boxSizing: 'border-box', minHeight: 56 }} value={roleDefaults.spiffeIdTemplate} rows={2} />
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('loading')} disabled>Creating... ◌</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 14. Role Create — saved ────────────────────────────────── */
  if (scene === 'role-saved') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Roles', ROLE_NAME]} go={go} targets={['engine-list', null, null, null]} />
        <Stepper activeStep={2} />
        <div style={S.content}>
          <div style={alert('success')}>✓  Role <strong>{ROLE_NAME}</strong> created. Workloads using this role will receive X.509 SVIDs with a {roleDefaults.ttl} TTL.</div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>Role name</label>
            <input readOnly style={input('disabled')} value={ROLE_NAME} />
          </div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>SPIFFE ID template</label>
            <textarea readOnly style={{ display: 'block', width: '100%', padding: '7px 10px', fontSize: 12, fontFamily: tok.fontMono, border: `1px solid ${tok.borderSubtle}`, borderRadius: 4, background: tok.layer02, color: tok.textHelper, boxSizing: 'border-box', minHeight: 56 }} value={roleDefaults.spiffeIdTemplate} rows={2} />
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')}>Create another role</button>
            <button style={btn('primary')} onClick={() => go('auth-empty')}>Next: Attach auth method →</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 15. Auth — empty ───────────────────────────────────────── */
  if (scene === 'auth-empty') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Roles', ROLE_NAME, 'Auth Methods']} go={go} targets={['engine-list', null, null, 'role-saved', null]} />
        <Stepper activeStep={3} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Auth Method Mappings</div>
          <div style={alert('neutral')}>ℹ  Vault reuses existing auth method configurations. No new attestation infrastructure is required.</div>
          <div style={S.emptyState as CSSProperties}>
            <div style={{ fontSize: 28, color: tok.borderSubtle }}>⊞</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: tok.textSecondary }}>No auth method attached</div>
            <div style={{ fontSize: 12, color: tok.textHelper, maxWidth: 320 }}>Attach an auth method to allow workloads to authenticate and mint X.509 SVIDs via this role.</div>
            <button style={btn('primary')} onClick={() => go('auth-selected')}>Attach auth method</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 16. Auth — method selected ─────────────────────────────── */
  if (scene === 'auth-selected') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Roles', ROLE_NAME, 'Auth Methods']} go={go} targets={['engine-list', null, null, 'role-saved', null]} />
        <Stepper activeStep={3} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Auth Method Mappings</div>
          <div style={alert('neutral')}>ℹ  Vault reuses existing auth method configurations. No new attestation infrastructure is required.</div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>Auth method</label>
            <select style={{ ...select(), maxWidth: 400 }}>
              {existingAuthMethods.map(m => (
                <option key={m.path} selected={m.type === 'kubernetes'}>{m.display}</option>
              ))}
            </select>
            <div style={S.helper as CSSProperties}>Select the auth method workloads will use to authenticate before minting SVIDs.</div>
          </div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>Role</label>
            <select style={{ ...select(), maxWidth: 400 }}><option selected>{ROLE_NAME}</option></select>
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')} onClick={() => go('auth-empty')}>← Back</button>
            <button style={btn('primary')} onClick={() => go('auth-policy')}>Next: View policy</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 17. Auth — policy preview ──────────────────────────────── */
  if (scene === 'auth-policy') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Roles', ROLE_NAME, 'Auth Methods']} go={go} targets={['engine-list', null, null, 'role-saved', null]} />
        <Stepper activeStep={3} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Auth Method Mappings</div>
          <div style={S.fieldGroup as CSSProperties}>
            <label style={S.label as CSSProperties}>Generated Vault policy</label>
            <code style={S.codeBlock as CSSProperties}>{POLICY_HCL}</code>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <button style={{ fontSize: 11, fontFamily: tok.fontMono, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, padding: '2px 8px', background: tok.bg, color: tok.textHelper, cursor: 'pointer' }}>Copy</button>
            </div>
            <div style={S.helper as CSSProperties}>Apply this policy to the <strong>kubernetes/</strong> role that your workloads authenticate with.</div>
          </div>
          <div style={alert('neutral')}>ℹ  After applying this policy, workloads authenticated via kubernetes/ can call <code style={{ fontFamily: tok.fontMono, fontSize: 11 }}>vault write spiffe/role/{ROLE_NAME}/mintx509</code></div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')} onClick={() => go('auth-selected')}>← Back</button>
            <button style={btn('primary')} onClick={() => go('auth-attached')}>Confirm mapping</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 18. Auth — attached ─────────────────────────────────────── */
  if (scene === 'auth-attached') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Roles', ROLE_NAME, 'Auth Methods']} go={go} targets={['engine-list', null, null, 'role-saved', null]} />
        <Stepper activeStep={3} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Auth Method Mappings</div>
          <div style={alert('neutral')}>✓  Auth method attached. Workloads authenticated via kubernetes/ can now mint X.509 SVIDs using role {ROLE_NAME}.</div>
          <table style={S.table}>
            <thead><tr>
              <th style={S.th as CSSProperties}>Auth Method</th>
              <th style={S.th as CSSProperties}>Role</th>
              <th style={S.th as CSSProperties}>Policy</th>
              <th style={S.th as CSSProperties}>Status</th>
              <th style={S.th as CSSProperties}></th>
            </tr></thead>
            <tbody>
              <tr>
                <td style={{ ...S.td as CSSProperties, fontFamily: tok.fontMono }}>kubernetes/</td>
                <td style={{ ...S.td as CSSProperties, fontFamily: tok.fontMono }}>{ROLE_NAME}</td>
                <td style={{ ...S.td as CSSProperties, fontFamily: tok.fontMono, fontSize: 12 }}>workload-identity</td>
                <td style={S.td as CSSProperties}><span style={badge()}>Active</span></td>
                <td style={{ ...S.td as CSSProperties, textAlign: 'right', fontSize: 12, color: tok.textHelper }}>Remove</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: 12, fontSize: 12, color: tok.textHelper, cursor: 'pointer' }}>+ Attach another</div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')}>Edit</button>
            <button style={btn('primary')} onClick={() => go('bundle-checking')}>Next: Verify trust bundle →</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 19. Bundle — checking ───────────────────────────────────── */
  if (scene === 'bundle-checking') {
    setTimeout(() => go('bundle-success'), 1400);
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Trust Bundle']} go={go} targets={['engine-list', null, null]} />
        <Stepper activeStep={4} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Trust Bundle Verification</div>
          <div style={{ ...S.pageDesc, maxWidth: 560 }}>Verifiers (Envoy, cloud IAM, other Vault clusters) will fetch this endpoint to validate SVIDs offline. No Vault token is required.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 0', color: tok.textSecondary, fontSize: 13 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${tok.borderSubtle}`, borderTopColor: tok.textPrimary, flexShrink: 0, animation: 'spin 1s linear infinite' }} />
            Checking trust bundle endpoint...
          </div>
          <div style={{ fontSize: 11, color: tok.textHelper, display: 'flex', gap: 16 }}>
            <span>Or jump to: </span>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => go('bundle-unreachable')}>unreachable</span>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => go('bundle-empty')}>empty bundle</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── 20. Bundle — success ────────────────────────────────────── */
  if (scene === 'bundle-success') {
    const handoffText = `Trust domain:   ${TRUST_DOMAIN}\nRole name:      ${ROLE_NAME}\nBundle URL:     ${BUNDLE_URL}\nSVID type:      X.509\n\nMint endpoint:  vault write spiffe/role/${ROLE_NAME}/mintx509`;
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Trust Bundle']} go={go} targets={['engine-list', null, null]} />
        <Stepper activeStep={4} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Trust Bundle Verification</div>
          <div style={{ ...S.pageDesc, maxWidth: 560 }}>The trust bundle is live and reachable. Share the details below with your application teams.</div>
          <div style={S.resultCard as CSSProperties}>
            <div style={S.resultHeader as CSSProperties}><span>Trust bundle status</span><span style={badge()}>✓ Verified</span></div>
            {([
              ['Bundle URL', BUNDLE_URL],
              ['Keys in bundle', String(bundleVerifyResult.keyCount)],
              ['CA fingerprint', bundleVerifyResult.caFingerprint],
              ['Replica sync', bundleVerifyResult.replicaStatus],
              ['Last fetched', bundleVerifyResult.lastFetched],
            ] as [string, string][]).map(([label, value], i) => (
              <div key={label} style={{ ...S.resultRow as CSSProperties, borderBottom: i === 4 ? 'none' : `1px solid ${tok.borderSubtle}` }}>
                <div style={S.resultLabel as CSSProperties}>{label}</div>
                <div style={S.resultValue as CSSProperties}>{value}</div>
              </div>
            ))}
          </div>
          <div style={S.handoffBlock as CSSProperties}>
            <div style={S.handoffHeader as CSSProperties}>
              <span>Share with your application team</span>
              <button style={{ fontSize: 11, fontFamily: tok.fontMono, border: `1px solid ${tok.borderSubtle}`, borderRadius: 3, padding: '2px 8px', background: tok.bg, color: tok.textHelper, cursor: 'pointer' }}>Copy</button>
            </div>
            <pre style={{ padding: '12px 14px', fontSize: 12, fontFamily: tok.fontMono, lineHeight: 1.7, color: tok.textPrimary, background: tok.bg, whiteSpace: 'pre', overflowX: 'auto', margin: 0 }}>{handoffText}</pre>
          </div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')} onClick={() => go('auth-attached')}>← Back</button>
            <button style={btn('primary')} onClick={() => go('engine-list-done')}>Done — setup complete</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 21. Bundle — unreachable ────────────────────────────────── */
  if (scene === 'bundle-unreachable') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Trust Bundle']} go={go} targets={['engine-list', null, null]} />
        <Stepper activeStep={4} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Trust Bundle Verification</div>
          <div style={alert('error')}>⚠  Trust bundle endpoint is not reachable from this browser. Verify your Vault listener is accessible at <code style={{ fontFamily: tok.fontMono, fontSize: 11 }}>{BUNDLE_URL}</code></div>
          <div style={{ fontSize: 12, color: tok.textSecondary, marginBottom: 20, lineHeight: 1.6 }}>The engine is configured correctly. This check verifies reachability from the browser only. Verifiers running inside your network may still be able to reach the endpoint.</div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')} onClick={() => go('bundle-checking')}>← Back</button>
            <button style={btn('primary')} onClick={() => go('bundle-checking')}>Retry check</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 22. Bundle — empty ──────────────────────────────────────── */
  if (scene === 'bundle-empty') {
    return (
      <div style={S.shell}>
        <SceneHint scene={scene} />
        <TopBar go={go} />
        <Breadcrumb parts={['Secrets Engines', 'spiffe', 'Trust Bundle']} go={go} targets={['engine-list', null, null]} />
        <Stepper activeStep={4} />
        <div style={S.content}>
          <div style={S.sectionTitle}>Trust Bundle Verification</div>
          <div style={alert('warning')}>⚠  Trust bundle returned 0 keys. Verify the PKI issuer path in engine configuration. The bundle must contain at least one CA certificate before SVIDs can be validated.</div>
          <div style={{ fontSize: 12, color: tok.textHelper, marginBottom: 20 }}>Common cause: the PKI issuer path configured in the engine does not have a CA certificate yet, or the issuer was deleted after the engine was configured.</div>
          <div style={S.btnRow as CSSProperties}>
            <button style={btn('secondary')} onClick={() => go('config-saved')}>Go to configuration</button>
            <button style={btn('primary')} onClick={() => go('bundle-checking')}>Retry check</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ================================================================
 * STORYBOOK META
 * ================================================================ */

const meta: Meta = {
  title: 'Wireframes/SPIFFE/PlatformEngineer',
  parameters: {
    layout: 'fullscreen',
    wireframeChrome: { title: 'Vault — SPIFFE Setup (Prototype)', height: '90vh' },
  },
};
export default meta;

type Story = StoryObj;

export const Prototype: Story = {
  name: '⬡ Prototype — Full Flow',
  render: () => <PEPrototype />,
};
