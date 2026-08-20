/**
 * _sec-fixtures.ts
 *
 * Shared types, token aliases, and mock data for the
 * Security Engineer — SPIFFE X.509 Audit & Governance wireframe stories.
 */

/* ── Token alias ─────────────────────────────────────────────── */

export const tok = {
  bg:              'var(--z-bg)',
  layer01:         'var(--z-layer-01)',
  layer02:         'var(--z-layer-02)',
  textPrimary:     'var(--z-text-primary)',
  textSecondary:   'var(--z-text-secondary)',
  textHelper:      'var(--z-text-helper)',
  textPlaceholder: 'var(--z-text-placeholder)',
  borderSubtle:    'var(--z-border-subtle)',
  borderStrong:    'var(--z-border-strong)',
  fontMono:        'var(--z-font-mono)',
  fontSans:        'var(--z-font-sans)',
};

/* ── Shared constants ────────────────────────────────────────── */

export const TRUST_DOMAIN  = 'corp.example';
export const ENGINE_PATH   = 'spiffe';

/* ── Audit log entries ───────────────────────────────────────── */

export interface AuditEntry {
  time:     string;
  op:       string;
  path:     string;
  spiffeId: string;
  entity:   string;
  status:   'success' | 'error';
  reason?:  string;
}

export const auditLog: AuditEntry[] = [
  {
    time:     '2026-07-25T10:42:01Z',
    op:       'mintx509',
    path:     'spiffe/mintx509/k8s-worker',
    spiffeId: 'spiffe://corp.example/k8s/payment-service',
    entity:   'k8s-sa:production/payment-service',
    status:   'success',
  },
  {
    time:     '2026-07-25T10:41:00Z',
    op:       'mintx509',
    path:     'spiffe/mintx509/k8s-worker',
    spiffeId: 'spiffe://corp.example/k8s/inventory-service',
    entity:   'k8s-sa:production/inventory-service',
    status:   'success',
  },
  {
    time:     '2026-07-25T10:38:12Z',
    op:       'mintx509',
    path:     'spiffe/mintx509/k8s-worker',
    spiffeId: '',
    entity:   'k8s-sa:staging/payment-svc-v2',
    status:   'error',
    reason:   'permission denied: service account not bound to role k8s-worker',
  },
  {
    time:     '2026-07-25T09:55:00Z',
    op:       'mintx509',
    path:     'spiffe/mintx509/k8s-worker',
    spiffeId: 'spiffe://corp.example/k8s/auth-service',
    entity:   'k8s-sa:production/auth-service',
    status:   'success',
  },
  {
    time:     '2026-07-25T09:42:00Z',
    op:       'configure',
    path:     'spiffe/config',
    spiffeId: '',
    entity:   'admin:romeo.martinez',
    status:   'success',
  },
];

/* ── Active SVIDs (inventory) ────────────────────────────────── */

export interface SvidRecord {
  spiffeId:  string;
  entity:    string;
  issuedAt:  string;
  expiresAt: string;
  ttl:       string;
  rootOfTrust: string;
  status:    'active' | 'expiring-soon' | 'expired';
}

export const svidInventory: SvidRecord[] = [
  {
    spiffeId:    'spiffe://corp.example/k8s/payment-service',
    entity:      'k8s-sa:production/payment-service',
    issuedAt:    '2026-07-25T10:42:01Z',
    expiresAt:   '2026-07-25T11:42:01Z',
    ttl:         '1h',
    rootOfTrust: 'kubernetes/SA',
    status:      'active',
  },
  {
    spiffeId:    'spiffe://corp.example/k8s/inventory-service',
    entity:      'k8s-sa:production/inventory-service',
    issuedAt:    '2026-07-25T10:41:00Z',
    expiresAt:   '2026-07-25T11:41:00Z',
    ttl:         '1h',
    rootOfTrust: 'kubernetes/SA',
    status:      'active',
  },
  {
    spiffeId:    'spiffe://corp.example/k8s/auth-service',
    entity:      'k8s-sa:production/auth-service',
    issuedAt:    '2026-07-25T09:55:00Z',
    expiresAt:   '2026-07-25T10:25:00Z',
    ttl:         '30m',
    rootOfTrust: 'kubernetes/SA',
    status:      'expiring-soon',
  },
];

/* ── CA rotation events ──────────────────────────────────────── */

export interface CaEvent {
  time:   string;
  event:  string;
  issuer: string;
  status: 'ok' | 'warning';
  note?:  string;
}

export const caEvents: CaEvent[] = [
  {
    time:   '2026-07-25T08:00:00Z',
    event:  'CA rotation completed',
    issuer: 'pki-int/issuer/web',
    status: 'ok',
  },
  {
    time:   '2026-07-25T07:58:00Z',
    event:  'Trust bundle refreshed',
    issuer: 'spiffe/bundle',
    status: 'ok',
    note:   'New CA cert appended; old cert valid until 2026-08-01',
  },
  {
    time:   '2026-07-20T08:00:00Z',
    event:  'CA rotation started',
    issuer: 'pki-int/issuer/web',
    status: 'ok',
  },
];

/* ── Compliance summary ──────────────────────────────────────── */

export const complianceSummary = {
  totalIssued:        3,
  activeSvids:        2,
  expiringSoon:       1,
  failedAttempts:     1,
  caRotationsLast30d: 1,
  policyViolations:   0,
  trustDomain:        TRUST_DOMAIN,
  enginePath:         ENGINE_PATH,
  reportDate:         '2026-07-25',
};

/* ── Security Engineer steps ─────────────────────────────────── */

export type SecStep = 0 | 1 | 2 | 3;

export const SEC_STEPS = [
  'Review audit log',
  'Check identity inventory',
  'CA rotation status',
  'Export compliance report',
] as const;
