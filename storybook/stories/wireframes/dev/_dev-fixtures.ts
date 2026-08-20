/**
 * _dev-fixtures.ts
 *
 * Shared types, token aliases, and mock data for the
 * App Developer — SPIFFE X.509 SVID Minting wireframe stories.
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

export const TRUST_DOMAIN   = 'corp.example';
export const ENGINE_PATH    = 'spiffe';
export const ROLE_NAME      = 'k8s-worker';
export const SPIFFE_ID      = `spiffe://${TRUST_DOMAIN}/k8s/payment-service`;
export const BUNDLE_URL     = `https://vault.corp.example/v1/${ENGINE_PATH}/bundle`;
export const VAULT_ADDR     = 'https://vault.corp.example';
export const K8S_SA         = 'payment-service';
export const K8S_NAMESPACE  = 'production';

/* ── Vault Agent config snippet ──────────────────────────────── */

export const AGENT_CONFIG_HCL = `vault {
  address = "${VAULT_ADDR}"
}

auto_auth {
  method "kubernetes" {
    mount_path = "auth/kubernetes"
    config {
      role = "${ROLE_NAME}"
    }
  }
}

template {
  destination = "/run/spiffe/svid.pem"
  contents    = "{{ with secret \\"${ENGINE_PATH}/mintx509/${ROLE_NAME}\\" }}{{ .Data.certificate }}{{ end }}"
}

template {
  destination = "/run/spiffe/key.pem"
  contents    = "{{ with secret \\"${ENGINE_PATH}/mintx509/${ROLE_NAME}\\" }}{{ .Data.private_key }}{{ end }}"
}`;

/* ── SVID details ────────────────────────────────────────────── */

export const svidDetails = {
  spiffeId:    SPIFFE_ID,
  serial:      '3a:bc:4d:9e:f1:22:ab:cd',
  issuedAt:    '2026-07-25T10:42:00Z',
  expiresAt:   '2026-07-25T11:42:00Z',
  ttl:         '1h',
  keyAlg:      'EC P-256',
  issuer:      'pki-int/issuer/web',
  fingerprint: 'SHA256:3a:bc:4d:9e:f1:22:ab:cd:ef:01:23:45:67:89:ab:cd',
};

/* ── File system view after Vault Agent runs ─────────────────── */

export const agentFiles = [
  { path: '/run/spiffe/svid.pem',   size: '2.1 KB',  updated: '10:42:01' },
  { path: '/run/spiffe/key.pem',    size: '0.3 KB',  updated: '10:42:01' },
  { path: '/run/spiffe/bundle.pem', size: '1.8 KB',  updated: '10:42:01' },
];

/* ── mTLS status ─────────────────────────────────────────────── */

export const mtlsPeers = [
  { service: 'inventory-service',  spiffeId: 'spiffe://corp.example/k8s/inventory-service',  status: 'verified' },
  { service: 'auth-service',       spiffeId: 'spiffe://corp.example/k8s/auth-service',        status: 'verified' },
  { service: 'legacy-svc',         spiffeId: '',                                               status: 'no-svid'  },
];

/* ── Developer steps ─────────────────────────────────────────── */

export type DevStep = 0 | 1 | 2 | 3;

export const DEV_STEPS = [
  'Write Vault Agent config',
  'Run Vault Agent',
  'Verify SVID',
  'Test mTLS',
] as const;
