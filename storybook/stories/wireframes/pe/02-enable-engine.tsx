/**
 * 02-enable-engine.tsx
 *
 * Enable Secrets Engine flow — Step 0.
 * States: Default | SpiffeSelected | PathConflict
 */
import type { CSSProperties } from 'react';
import { tok, engineTypes } from './_pe-fixtures';

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

const STEPPER: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 0,
  padding: '14px 28px',
  borderBottom: `1px solid ${tok.borderSubtle}`,
  background: tok.bg,
  flexShrink: 0,
};

const CONTENT: CSSProperties = {
  flex: 1,
  padding: '28px 28px',
  overflowY: 'auto',
};

const SECTION_TITLE: CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 4,
  color: tok.textPrimary,
};

const SECTION_DESC: CSSProperties = {
  fontSize: 13,
  color: tok.textSecondary,
  marginBottom: 20,
};

const ENGINE_GRID: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 12,
  marginBottom: 28,
};

const ENGINE_CARD = (selected: boolean): CSSProperties => ({
  border: selected ? `2px solid ${tok.textPrimary}` : `1px solid ${tok.borderSubtle}`,
  borderRadius: 6,
  padding: '14px 16px',
  cursor: 'pointer',
  background: selected ? tok.layer01 : tok.bg,
});

const ENGINE_NAME: CSSProperties = {
  fontWeight: 600,
  fontSize: 13,
  marginBottom: 3,
};

const ENGINE_DESC: CSSProperties = {
  fontSize: 12,
  color: tok.textSecondary,
};

const FIELD_GROUP: CSSProperties = {
  marginBottom: 18,
  maxWidth: 480,
};

const LABEL: CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 5,
  color: tok.textPrimary,
};

const LABEL_OPTIONAL: CSSProperties = {
  ...LABEL,
  fontWeight: 400,
  color: tok.textSecondary,
};

const INPUT = (error?: boolean): CSSProperties => ({
  display: 'block',
  width: '100%',
  padding: '7px 10px',
  fontSize: 13,
  fontFamily: tok.fontMono,
  border: `1px solid ${error ? tok.borderStrong : tok.borderSubtle}`,
  borderRadius: 4,
  background: tok.bg,
  color: tok.textPrimary,
  boxSizing: 'border-box',
  outline: error ? `2px solid ${tok.borderStrong}` : 'none',
});

const HELPER: CSSProperties = {
  fontSize: 11,
  color: tok.textHelper,
  marginTop: 4,
};

const ERROR_MSG: CSSProperties = {
  fontSize: 11,
  color: tok.textPrimary,
  marginTop: 4,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

const ALERT_INLINE = (type: 'error' | 'neutral'): CSSProperties => ({
  padding: '8px 12px',
  border: `1px solid ${tok.borderSubtle}`,
  borderLeft: `3px solid ${type === 'error' ? tok.borderStrong : tok.borderSubtle}`,
  borderRadius: 4,
  background: tok.layer01,
  fontSize: 12,
  color: tok.textPrimary,
  marginBottom: 16,
  maxWidth: 480,
});

const BTN_ROW: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  paddingTop: 8,
  borderTop: `1px solid ${tok.borderSubtle}`,
  marginTop: 12,
};

const BTN = (variant: 'primary' | 'secondary' | 'disabled'): CSSProperties => ({
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 500,
  borderRadius: 4,
  cursor: variant === 'disabled' ? 'not-allowed' : 'pointer',
  border: variant === 'primary' ? 'none' : `1px solid ${tok.borderSubtle}`,
  background: variant === 'primary' ? tok.textPrimary : variant === 'disabled' ? tok.layer02 : tok.bg,
  color: variant === 'primary' ? tok.bg : variant === 'disabled' ? tok.textHelper : tok.textPrimary,
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

function StepIndicator({ active }: { active: 0 | 1 }) {
  const steps = ['Method', 'Configuration'];
  return (
    <div style={STEPPER}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontWeight: i === active ? 600 : 400,
            color: i === active ? tok.textPrimary : tok.textHelper,
            fontSize: 13,
          }}>
            <span style={{
              width: 20, height: 20, borderRadius: '50%',
              border: `2px solid ${i === active ? tok.textPrimary : tok.borderSubtle}`,
              background: i < active ? tok.textPrimary : tok.bg,
              color: i < active ? tok.bg : i === active ? tok.textPrimary : tok.textHelper,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600, flexShrink: 0,
            }}>{i < active ? '✓' : i + 1}</span>
            {s}
          </div>
          {i < steps.length - 1 && (
            <span style={{ margin: '0 12px', color: tok.borderSubtle, fontSize: 16 }}>›</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Exported wireframes ─────────────────────────────────────── */

export function EnableEngineDefault() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ Enable new engine</div>
      <StepIndicator active={0} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Choose a secrets engine type</div>
        <div style={SECTION_DESC}>Select the type of secrets backend to enable. Each type handles a different category of secrets.</div>
        <div style={ENGINE_GRID}>
          {engineTypes.map(e => (
            <div key={e.id} style={ENGINE_CARD(false)}>
              <div style={ENGINE_NAME}>{e.name}</div>
              <div style={ENGINE_DESC}>{e.desc}</div>
            </div>
          ))}
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>
            Mount path <span style={{ color: tok.textHelper, fontWeight: 400 }}>*</span>
          </label>
          <input readOnly style={INPUT()} value="" placeholder="e.g. spiffe" />
          <div style={HELPER}>The path where this engine will be mounted.</div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL_OPTIONAL}>Description (optional)</label>
          <input readOnly style={INPUT()} value="" placeholder="Short description..." />
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Cancel</button>
          <button style={BTN('disabled')} disabled>Next: Configuration</button>
        </div>
      </div>
    </div>
  );
}

export function EnableEngineSpiffeSelected() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ Enable new engine</div>
      <StepIndicator active={0} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Choose a secrets engine type</div>
        <div style={SECTION_DESC}>Select the type of secrets backend to enable.</div>
        <div style={ENGINE_GRID}>
          {engineTypes.map(e => (
            <div key={e.id} style={ENGINE_CARD(e.id === 'spiffe')}>
              <div style={ENGINE_NAME}>{e.name}</div>
              <div style={ENGINE_DESC}>{e.desc}</div>
              {e.id === 'spiffe' && (
                <div style={{ marginTop: 6, fontSize: 11, fontFamily: tok.fontMono, color: tok.textHelper }}>
                  ✓ selected
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>
            Mount path <span style={{ color: tok.textHelper, fontWeight: 400 }}>*</span>
          </label>
          <input readOnly style={INPUT()} value="spiffe" />
          <div style={HELPER}>The path where this engine will be mounted.</div>
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL_OPTIONAL}>Description (optional)</label>
          <input readOnly style={INPUT()} value="SPIFFE workload identity for corp.example" />
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Cancel</button>
          <button style={BTN('primary')}>Next: Configuration</button>
        </div>
      </div>
    </div>
  );
}

export function EnableEnginePathConflict() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BREADCRUMB}>Secrets Engines ▸ Enable new engine</div>
      <StepIndicator active={0} />
      <div style={CONTENT}>
        <div style={SECTION_TITLE}>Choose a secrets engine type</div>
        <div style={SECTION_DESC}>Select the type of secrets backend to enable.</div>
        <div style={ENGINE_GRID}>
          {engineTypes.map(e => (
            <div key={e.id} style={ENGINE_CARD(e.id === 'spiffe')}>
              <div style={ENGINE_NAME}>{e.name}</div>
              <div style={ENGINE_DESC}>{e.desc}</div>
            </div>
          ))}
        </div>
        <div style={FIELD_GROUP}>
          <label style={LABEL}>
            Mount path <span style={{ color: tok.textHelper, fontWeight: 400 }}>*</span>
          </label>
          <input readOnly style={INPUT(true)} value="pki" />
          <div style={ERROR_MSG}>⚠ A secrets engine is already mounted at this path.</div>
        </div>
        <div style={ALERT_INLINE('error')}>
          ⚠  Choose a different path or disable the existing engine at <code>pki/</code> first.
        </div>
        <div style={BTN_ROW}>
          <button style={BTN('secondary')}>Cancel</button>
          <button style={BTN('disabled')} disabled>Next: Configuration</button>
        </div>
      </div>
    </div>
  );
}
