import type { CSSProperties } from 'react';
import type { ShowcaseSection, PreambleNavItem } from './types';

/* ── Styles (uses var(--z-*) wireframe tokens from index.css) ── */

const navContainer: CSSProperties = {
  position: 'fixed',
  left: 0,
  top: 0,
  width: 220,
  height: '100vh',
  background: 'var(--z-bg)',
  borderRight: '1px solid var(--z-border-subtle)',
  paddingTop: 24,
  paddingLeft: 16,
  paddingRight: 16,
  boxSizing: 'border-box',
  overflowY: 'auto',
  zIndex: 100,
};

const listStyle: CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const groupLabel: CSSProperties = {
  fontFamily: 'var(--z-font-mono)',
  fontSize: 'var(--z-text-xs)',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--z-text-helper)',
  margin: '20px 0 6px',
  padding: 0,
};

function linkStyle(isActive: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontFamily: 'var(--z-font-sans)',
    fontSize: 'var(--z-text-sm)',
    color: isActive ? 'var(--z-text-primary)' : 'var(--z-text-secondary)',
    fontWeight: isActive ? 600 : 400,
    textDecoration: 'none',
    padding: '5px 0',
    transition: 'color var(--z-transition-fast)',
    lineHeight: 1.35,
  };
}

function phaseDotStyle(phase?: string): CSSProperties {
  // All dots are grayscale - differentiated by weight not color
  const shade = phase ? 'var(--z-text-secondary)' : 'var(--z-border-subtle)';
  return {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: shade,
    flexShrink: 0,
  };
}

/* ── Component ──────────────────────────────────────────────── */

export interface ShowcaseNavProps {
  sections: ShowcaseSection[];
  activeId?: string;
  preambleNav?: PreambleNavItem[];
}

export function ShowcaseNav({ sections, activeId, preambleNav }: ShowcaseNavProps) {
  return (
    <nav style={navContainer} aria-label="Showcase navigation">
      <ul style={listStyle}>
        {preambleNav && preambleNav.length > 0 && (
          <>
            <li style={groupLabel}>Product Thinking</li>
            {preambleNav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} style={linkStyle(item.id === activeId)}>
                  <span style={phaseDotStyle()} aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
            <li style={groupLabel}>Wireframes</li>
          </>
        )}
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`} style={linkStyle(section.id === activeId)}>
              <span style={phaseDotStyle(section.phase)} aria-hidden="true" />
              <span>{section.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
