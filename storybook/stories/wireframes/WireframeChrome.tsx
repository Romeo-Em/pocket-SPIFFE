/**
 * WireframeChrome — Shared browser-window wrapper for grayscale wireframes.
 *
 * Wraps wireframe content in a sketch-style browser window with:
 *   - 3 gray window dots (traffic lights, grayscale)
 *   - A tab shape with optional title
 *   - A pill-shaped URL bar
 *   - Rounded corners, drop shadow, consistent padding
 *
 * Applied automatically via the wireframe Storybook decorator (port 6007).
 * Stories can also import this directly for custom use.
 *
 * To configure per-story, use Storybook parameters:
 *   parameters: { wireframeChrome: { title: 'My Page', height: '90vh', hide: true } }
 */
import type { CSSProperties, ReactNode } from 'react';

export interface WireframeChromeProps {
  /** Story content */
  children: ReactNode;
  /** Title shown in the browser tab. Default: 'Platform' */
  title?: string;
  /** Inner content height. Default: '85vh' */
  height?: string;
  /** Hide the chrome bar entirely. Default: false */
  hideChrome?: boolean;
}

/* ── Grayscale chrome palette ───────────────────────────────── */

const C = {
  canvasBg:     '#f8f8f8',
  barBg:        '#f0f0f0',
  dot:          '#c6c6c6',
  urlBar:       '#e0e0e0',
  tabActive:    '#e8e8e8',
  tabText:      '#525252',
  tabTextMuted: '#8d8d8d',
  border:       '#c6c6c6',
  frameBorder:  '#e0e0e0',
};

/* ── Styles ─────────────────────────────────────────────────── */

const canvas: CSSProperties = {
  background: C.canvasBg,
  padding: 72,
  minHeight: '100vh',
  boxSizing: 'border-box' as const,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
};

const frame: CSSProperties = {
  width: '100%',
  maxWidth: 1440,
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.12)',
  border: `1px solid ${C.frameBorder}`,
  background: '#ffffff',
};

const chromeBar: CSSProperties = {
  height: 36,
  background: C.barBg,
  borderBottom: `1px solid ${C.border}`,
  display: 'flex',
  alignItems: 'center',
  padding: '0 12px',
  gap: 8,
  userSelect: 'none' as const,
};

const dot = (i: number): CSSProperties => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  background: C.dot,
  marginLeft: i === 0 ? 0 : 4,
});

const urlBar: CSSProperties = {
  flex: 1,
  maxWidth: 480,
  height: 20,
  borderRadius: 10,
  background: C.urlBar,
  margin: '0 auto',
};

const content = (h: string): CSSProperties => ({
  position: 'relative' as const,
  height: h,
  overflow: 'hidden',
  background: '#ffffff',
});

/* ── Component ──────────────────────────────────────────────── */

export function WireframeChrome({
  children,
  title = 'Platform',
  height = '85vh',
  hideChrome = false,
}: WireframeChromeProps) {
  return (
    <div style={canvas}>
      <div style={frame}>
        {/* Browser chrome bar */}
        {!hideChrome && (
          <div style={chromeBar}>
            {/* Window dots */}
            {[0, 1, 2].map(i => (
              <div key={i} style={dot(i)} />
            ))}
            <div style={{ width: 12 }} />

            {/* Tab */}
            <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: '6px 6px 0 0',
                fontSize: 11,
                fontFamily: "system-ui, sans-serif",
                background: C.tabActive,
                color: C.tabText,
              }}>
                {title}
              </span>
              <span style={{
                padding: '4px 8px',
                fontSize: 11,
                fontFamily: "system-ui, sans-serif",
                color: C.tabTextMuted,
              }}>
                +
              </span>
            </div>

            {/* URL bar */}
            <div style={urlBar} />
            <div style={{ width: 48 }} />
          </div>
        )}

        {/* Wireframe content */}
        <div style={content(hideChrome ? `calc(${height} + 37px)` : height)}>
          {children}
        </div>
      </div>
    </div>
  );
}
