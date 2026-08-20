/**
 * _pe-fixtures.ts
 *
 * Shared types, token aliases, and mock data for the
 * Platform Engineer — SPIFFE X.509 Setup wireframe stories.
 */

/* ── Token alias (mirrors _incident-fixtures pattern) ────────── */

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

/* ── Shared data ─────────────────────────────────────────────── */

export const TRUST_DOMAIN = 'corp.example';
export const ENGINE_PATH  = 'spiffe';
export const BUNDLE_URL   = `https://vault.corp.example/v1/${ENGINE_PATH}/bundle`;
export const ROLE_NAME    = 'k8s-worker';

export const pkiIssuers = [
  { path: 'pki/issuer/default',  label: 'Default Issuer (pki/)' },
  { path: 'pki-int/issuer/web',  label: 'Intermediate CA (pki-int/)' },
];

export const existingEngines = [
  { path: 'kv/',     type: 'KV v2',    description: 'Key/Value Secrets Engine v2' },
  { path: 'pki/',    type: 'PKI',      description: 'Certificate Authority' },
  { path: 'ssh/',    type: 'SSH',      description: 'SSH Certificate Engine' },
  { path: 'transit/', type: 'Transit', description: 'Encryption as a Service' },
];

export const existingEnginesWithSpiffe = [
  ...existingEngines,
  { path: 'spiffe/', type: 'SPIFFE', description: 'SPIFFE Workload Identity' },
];

export const existingAuthMethods = [
  { type: 'kubernetes', path: 'kubernetes/', display: 'Kubernetes (kubernetes/)' },
  { type: 'aws',        path: 'aws/',        display: 'AWS (aws/)' },
  { type: 'cert',       path: 'cert/',       display: 'Cert Auth (cert/)' },
];

export const engineTypes = [
  { id: 'kv',      name: 'KV',       desc: 'Generic key/value store' },
  { id: 'pki',     name: 'PKI',      desc: 'X.509 certificate authority' },
  { id: 'aws',     name: 'AWS',      desc: 'Dynamic AWS credentials' },
  { id: 'ssh',     name: 'SSH',      desc: 'SSH certificate signing' },
  { id: 'spiffe',  name: 'SPIFFE',   desc: 'Workload identity SVIDs' },
  { id: 'transit', name: 'Transit',  desc: 'Encryption / decryption' },
];

export const roleDefaults = {
  ttl:    '1h',
  maxTtl: '24h',
  keyAlgorithm: 'EC (P-256)',
  spiffeIdTemplate: 'spiffe://corp.example/k8s/{{.entity.aliases.kubernetes.metadata.service_account}}',
};

export const bundleVerifyResult = {
  keyCount:      2,
  lastFetched:   '2026-07-25T10:42:00Z',
  replicaStatus: 'Synced',
  caFingerprint: 'SHA256:3a:bc:4d:9e:...',
};

/* ── HCL policy snippet ──────────────────────────────────────── */

export const POLICY_HCL = `path "spiffe/role/k8s-worker/mintx509" {
  capabilities = ["update"]
}`;

/* ── Stepper definition ──────────────────────────────────────── */

export type PEStep = 0 | 1 | 2 | 3 | 4;

export const PE_STEPS = [
  'Enable engine',
  'Configure trust domain',
  'Create role',
  'Attach auth method',
  'Verify trust bundle',
] as const;
