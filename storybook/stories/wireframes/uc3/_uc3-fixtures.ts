/**
 * _uc3-fixtures.ts
 *
 * Shared tokens, types, and mock data for Use Case 3: Kubernetes Workloads.
 * Workflow: K8s service account -> Vault Agent auth -> X.509 SVID -> filesystem -> Istio/Envoy mTLS.
 * Customer signal: NAB (Istio + SPIFFE today), Fidelity (1000+ K8s clusters),
 * IBM Research + Frontdoor (Pattern F: SPIRE as Istio identity source).
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
export const K8S_NAMESPACE = 'production';
export const K8S_SA        = 'payment-service';
export const ROLE_NAME     = 'k8s-payment';
export const SPIFFE_ID     = `spiffe://${TRUST_DOMAIN}/k8s/${K8S_NAMESPACE}/${K8S_SA}`;
export const BUNDLE_URL    = `${VAULT_ADDR}/v1/${ENGINE_PATH}/bundle`;

export const svidFiles = [
  { path: '/run/spiffe/svid.pem',   size: '2.1 KB',  updated: '09:12:01', desc: 'X.509 certificate (SVID)' },
  { path: '/run/spiffe/key.pem',    size: '0.3 KB',  updated: '09:12:01', desc: 'Private key (EC P-256)' },
  { path: '/run/spiffe/bundle.pem', size: '1.8 KB',  updated: '09:12:01', desc: 'Trust bundle (CA certs)' },
];

export const meshPeers = [
  { pod: 'inventory-service-7f9b-xkq2d', ns: 'production', spiffeId: `spiffe://${TRUST_DOMAIN}/k8s/production/inventory-service`, status: 'verified' as const },
  { pod: 'auth-service-4d6c-mnp8s',      ns: 'production', spiffeId: `spiffe://${TRUST_DOMAIN}/k8s/production/auth-service`,      status: 'verified' as const },
  { pod: 'legacy-batch-2c8a-qqr1z',      ns: 'legacy',     spiffeId: '',                                                           status: 'no-svid' as const  },
];

export const federationPartners = [
  { trustDomain: 'partner.bank.example', bundleUrl: 'https://vault.partner.bank.example/v1/spiffe/bundle', status: 'synced' as const },
  { trustDomain: 'cloud.corp.example',   bundleUrl: 'https://vault.cloud.corp.example/v1/spiffe/bundle',   status: 'synced' as const },
];

export const agentConfigHcl = `vault {
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
}

template {
  destination = "/run/spiffe/bundle.pem"
  contents    = "{{ with secret \\"${ENGINE_PATH}/bundle\\" }}{{ .Data.certificate }}{{ end }}"
}`;

export const UC3_STEPS = [
  'K8s auth',
  'SVID to filesystem',
  'Istio mTLS',
  'Trust bundle distribution',
] as const;
