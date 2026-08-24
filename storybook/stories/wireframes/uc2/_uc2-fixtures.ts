/**
 * _uc2-fixtures.ts
 *
 * Shared tokens, types, and mock data for Use Case 2:
 * Infrastructure-agnostic Workload Attestation (TPM, CSP, on-prem VMs).
 * Workflow: EK enrollment -> TPM attestation -> X.509 SVID -> mTLS / Vault SPIFFE auth.
 * Customer signal: Fidelity (Secret Zero, 1000+ VMs), DBS (TPM preference),
 * Macquarie (cross-cloud), TransferWise/Uber (community case studies).
 */

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

export const TRUST_DOMAIN  = 'corp.example';
export const ENGINE_PATH   = 'spiffe';
export const VAULT_ADDR    = 'https://vault.corp.example';
export const HOST_ID       = 'vmware-esxi-node-07';
export const SPIFFE_ID     = `spiffe://${TRUST_DOMAIN}/infra/vm/${HOST_ID}`;
export const EK_FINGERPRINT = 'SHA256:7c:d1:4e:8a:b2:33:f0:91:cc:55:ab:ee:12:34:56:78';

export const ekRegistryEntry = {
  hostId:       HOST_ID,
  ekFingerprint: EK_FINGERPRINT,
  platform:     'VMware ESXi 8.0',
  location:     'on-prem / DC-APAC-1',
  registeredBy: 'admin:platform-team',
  registeredAt: '2026-08-01T00:00:00Z',
};

export const attestationResult = {
  hostId:      HOST_ID,
  tpmVersion:  'TPM 2.0',
  ekCert:      'issued by ek-ca/issuer/default',
  spiffeId:    SPIFFE_ID,
  issuedAt:    '2026-08-24T09:10:00Z',
  svidType:    'X.509 SVID',
  ttl:         '1h',
  keyAlg:      'EC P-256',
};

export const svidDetails = {
  spiffeId:    SPIFFE_ID,
  serial:      '4d:a1:cc:2b:9f:11:e3:44',
  issuedAt:    '2026-08-24T09:10:00Z',
  expiresAt:   '2026-08-24T10:10:00Z',
  issuer:      'pki-int/issuer/web',
  keyAlg:      'EC P-256',
  uriSAN:      SPIFFE_ID,
  fingerprint: `SHA256:4d:a1:cc:2b:9f:11:e3:44:ab:cd:ef:01:23:45:67:89`,
};

export const mtlsPeers = [
  { service: 'inventory-api',    spiffeId: `spiffe://${TRUST_DOMAIN}/k8s/inventory-api`,    status: 'verified' as const },
  { service: 'config-service',   spiffeId: `spiffe://${TRUST_DOMAIN}/k8s/config-service`,   status: 'verified' as const },
  { service: 'legacy-mainframe', spiffeId: '',                                                status: 'no-svid' as const  },
];

export const vaultSpiffeAuthResult = {
  entity:       HOST_ID,
  policy:       'policy/infra-vm',
  secretPath:   'kv/data/infra/db-creds',
  dynamicCred:  { username: 'vm07_ro', password: '<dynamic>', lease: '1h', revokable: true },
};

export const UC2_STEPS = [
  'EK enrollment',
  'TPM attestation',
  'X.509 SVID issued',
  'mTLS / service mesh',
  'Vault SPIFFE auth',
] as const;
