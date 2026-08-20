import type { CSSProperties } from 'react';

/* ── Styles (uses var(--z-*) wireframe tokens from index.css) ── */

const containerStyle: CSSProperties = {
  display: 'flex',
  gap: 6,
  flexWrap: 'wrap',
};

function pillStyle(isActive: boolean): CSSProperties {
  return {
    padding: '6px 14px',
    borderRadius: 'var(--z-radius-md)',
    border: isActive ? '1px solid var(--z-border-strong)' : '1px solid transparent',
    background: isActive ? 'var(--z-text-primary)' : 'var(--z-layer-01)',
    color: isActive ? 'var(--z-bg)' : 'var(--z-text-secondary)',
    fontFamily: 'var(--z-font-mono)',
    fontSize: 'var(--z-text-sm)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'background var(--z-transition-fast), color var(--z-transition-fast)',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
  };
}

export interface StateToggleProps {
  states: string[];
  active: string;
  onSelect: (s: string) => void;
}

export function StateToggle({ states, active, onSelect }: StateToggleProps) {
  return (
    <div style={containerStyle} role="tablist" aria-label="Wireframe state">
      {states.map((name) => (
        <button
          key={name}
          type="button"
          role="tab"
          aria-selected={name === active}
          style={pillStyle(name === active)}
          onClick={() => onSelect(name)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
