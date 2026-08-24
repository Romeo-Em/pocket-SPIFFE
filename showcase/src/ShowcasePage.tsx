import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { ShowcaseConfig } from './types';
import { ShowcaseNav } from './ShowcaseNav';
import { ShowcaseSection } from './ShowcaseSection';

/* ── Styles (uses var(--z-*) wireframe tokens from index.css) ── */

const pageStyle: CSSProperties = {
  background: 'var(--z-bg)',
  minHeight: '100vh',
  fontFamily: 'var(--z-font-sans)',
  margin: 0,
};

const mainContent: CSSProperties = {
  marginLeft: 220,
  padding: '48px 64px',
  maxWidth: 1200,
  boxSizing: 'border-box',
};

const metaLine: CSSProperties = {
  fontFamily: 'var(--z-font-mono)',
  fontSize: 'var(--z-text-sm)',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--z-text-helper)',
  marginBottom: 12,
};

const titleStyle: CSSProperties = {
  fontFamily: 'var(--z-font-sans)',
  fontSize: 'clamp(2rem, 4vw, 2.5rem)',
  color: 'var(--z-text-primary)',
  margin: 0,
  lineHeight: 1.15,
  fontWeight: 600,
};

const subtitleStyle: CSSProperties = {
  fontFamily: 'var(--z-font-sans)',
  fontSize: 'var(--z-text-lg)',
  color: 'var(--z-text-secondary)',
  fontWeight: 400,
  marginTop: 12,
  marginBottom: 0,
  lineHeight: 'var(--z-leading-relaxed)',
};

const separator: CSSProperties = {
  height: 1,
  background: 'var(--z-border-subtle)',
  margin: '40px 0',
  border: 'none',
};

const sectionWrapper: CSSProperties = {
  marginBottom: 80,
};

const footerStyle: CSSProperties = {
  fontFamily: 'var(--z-font-mono)',
  fontSize: 'var(--z-text-sm)',
  color: 'var(--z-text-helper)',
  marginTop: 48,
  paddingTop: 24,
  borderTop: '1px solid var(--z-border-subtle)',
};

/* ── Component ──────────────────────────────────────────────── */

export interface ShowcasePageProps {
  config: ShowcaseConfig;
}

export function ShowcasePage({ config }: ShowcasePageProps) {
  const [activeId, setActiveId] = useState<string | undefined>(
    config.sections[0]?.id,
  );
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const preambleRef = useRef<HTMLDivElement | null>(null);

  /* ── Intersection observer for active nav tracking ──────── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    );

    for (const el of sectionRefs.current.values()) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [config.sections]);

  /* ── Preamble fade-in + interactive functions ───────────── */
  useEffect(() => {
    if (!config.preamble) return;

    // Fade observer — makes .fade-target elements visible on scroll
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 },
    );

    const root = preambleRef.current;
    if (root) {
      root.querySelectorAll<HTMLElement>('.fade-target').forEach((el) => {
        fadeObserver.observe(el);
      });
    }

    // Expose interactive helpers that preamble onclick= attributes call
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;

    w.toggleCard = (headerEl: HTMLElement) => {
      headerEl.parentElement?.classList.toggle('open');
    };

    w.scrollToMilestone = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (!el.classList.contains('open')) el.classList.add('open');
    };

    w.switchPersona = (key: string) => {
      ['pe', 'dev', 'sec'].forEach((k) => {
        const panel = document.getElementById('panel-' + k);
        if (panel) panel.classList.toggle('active', k === key);
      });
      document.querySelectorAll<HTMLElement>('#persona-tabs .persona-tab').forEach((tab, i) => {
        const keys = ['pe', 'dev', 'sec'];
        tab.classList.toggle('active', keys[i] === key);
      });
      document.querySelectorAll<HTMLElement>('#panel-' + key + ' .fade-target').forEach((el) => {
        fadeObserver.observe(el);
      });
    };

    const makeUcSwitcher = (tabsId: string, panelIds: string[]) => (id: string) => {
      document.querySelectorAll<HTMLElement>('#' + tabsId + ' .persona-tab').forEach((tab, i) => {
        tab.classList.toggle('active', panelIds[i] === id);
      });
      panelIds.forEach((pid) => {
        const panel = document.getElementById(pid);
        if (panel) panel.classList.toggle('active', pid === id);
      });
      document.querySelectorAll<HTMLElement>('#' + id + ' .fade-target').forEach((el) => {
        fadeObserver.observe(el);
      });
    };

    w.switchUc1Step = makeUcSwitcher('uc1-steps-tabs', [
      'uc1-step-attest', 'uc1-step-svid', 'uc1-step-exchange', 'uc1-step-resource', 'uc1-step-registry',
    ]);
    w.switchUc2Step = makeUcSwitcher('uc2-steps-tabs', [
      'uc2-step-ek', 'uc2-step-tpm', 'uc2-step-svid', 'uc2-step-mtls', 'uc2-step-auth',
    ]);
    w.switchUc3Step = makeUcSwitcher('uc3-steps-tabs', [
      'uc3-step-k8s', 'uc3-step-fs', 'uc3-step-istio', 'uc3-step-bundle',
    ]);

    return () => {
      fadeObserver.disconnect();
      delete w.toggleCard;
      delete w.scrollToMilestone;
      delete w.switchPersona;
      delete w.switchUc1Step;
      delete w.switchUc2Step;
      delete w.switchUc3Step;
    };
  }, [config.preamble]);

  function registerRef(id: string, el: HTMLElement | null) {
    if (el) {
      sectionRefs.current.set(id, el);
    } else {
      sectionRefs.current.delete(id);
    }
  }

  return (
    <div style={pageStyle}>
      <ShowcaseNav sections={config.sections} activeId={activeId} preambleNav={config.preambleNav} />

      <main style={mainContent}>
        {/* Hero header */}
        <header>
          <div style={metaLine}>
            {config.meta.pdr} &middot; {config.meta.date}
          </div>
          <h1 style={titleStyle}>{config.title}</h1>
          <p style={subtitleStyle}>{config.subtitle}</p>
        </header>

        <hr style={separator} />

        {/* Preamble (e.g., PDR journey context) */}
        {config.preamble && (
          <div
            id="preamble"
            ref={(el) => {
              preambleRef.current = el;
              registerRef('preamble', el);
            }}
            style={{ marginBottom: 80 }}
            dangerouslySetInnerHTML={{ __html: config.preamble }}
          />
        )}

        {/* Wireframes heading — only shown when there are wireframe sections */}
        {config.preamble && config.sections.length > 0 && (
          <>
            <hr style={separator} />
            <h2 style={{
              fontFamily: 'var(--z-font-sans)',
              fontSize: 'var(--z-text-2xl)',
              fontWeight: 600,
              color: 'var(--z-text-primary)',
              marginBottom: 40,
            }}>Wireframes</h2>
          </>
        )}

        {/* Sections */}
        {config.sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            ref={(el) => registerRef(section.id, el)}
            style={sectionWrapper}
          >
            <ShowcaseSection section={section} />
          </div>
        ))}

        {/* Footer */}
        <footer style={footerStyle}>
          Generated {config.meta.date} from {config.meta.pdr}
        </footer>
      </main>
    </div>
  );
}
