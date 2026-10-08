/**
 * _pe-fixtures.ts
 *
 * Shared types, token aliases, and mock data for the
 * Platform Engineer — SPIFFE JWT Setup wireframe stories.
 */

/* ── Token alias ───────────────────────────────────────────── */

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
export const VAULT_API_ADDR = 'https://vault.corp.example';
export const TRUST_BUNDLE_URL = `${VAULT_API_ADDR}/v1/${ENGINE_PATH}/trust_bundle/web`;
export const OIDC_DISCOVERY_URL = `${VAULT_API_ADDR}/v1/${ENGINE_PATH}/.well-known/openid-configuration`;
export const JWKS_URL = `${VAULT_API_ADDR}/v1/${ENGINE_PATH}/.well-known/keys`;
export const ROLE_NAME    = 'k8s-worker';
export const MINT_AUDIENCE = 'https://payments.corp.example';

export const existingEngines = [
  { path: 'kv/',     type: 'KV v2',    description: 'Key/Value Secrets Engine v2' },
  { path: 'pki/',    type: 'PKI',      description: 'Certificate Authority' },
  { path: 'ssh/',    type: 'SSH',      description: 'SSH Certificate Engine' },
  { path: 'transit/', type: 'Transit', description: 'Encryption as a Service' },
];

export const existingEnginesWithSpiffe = [
  ...existingEngines,
  { path: 'spiffe/', type: 'SPIFFE', description: 'SPIFFE JWT Workload Identity' },
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
  { id: 'spiffe',  name: 'SPIFFE',   desc: 'Mint JWT workload identity SVIDs' },
  { id: 'transit', name: 'Transit',  desc: 'Encryption / decryption' },
];

export const roleDefaults = {
  ttl: '5m',
  template: `{
  "sub": "spiffe://${TRUST_DOMAIN}/k8s/{{identity.entity.aliases.$MOUNT_ACCESSOR.metadata.service_account}}"
}`,
  useJtiClaim: false,
};

export const jwtEndpointCheck = {
  status: 'HTTP 200',
  signingKeyCount: 2,
  lastChecked: '2026-07-25T10:42:00Z',
};

/* ── HCL policy snippet ──────────────────────────────────────── */

export const POLICY_HCL = `path "spiffe/role/k8s-worker/mintjwt" {
  capabilities = ["update"]
}`;

/* ── Stepper definition ──────────────────────────────────────── */

export type PEStep = 0 | 1 | 2 | 3 | 4;

export const PE_STEPS = [
  'Enable engine',
  'Configure JWT engine',
  'Create JWT role',
  'Attach auth method',
  'Verify JWT endpoints',
] as const;
