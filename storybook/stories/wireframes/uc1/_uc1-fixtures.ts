/**
 * _uc1-fixtures.ts
 *
 * Shared tokens, types, and mock data for Use Case 1: Agentic Identity.
 * Workflow: Node attestation -> JWT-SVID -> Token Exchange AS -> OAuth JWT -> Vault resource server.
 * Customer signal: DBS (OBO/MayAct delegation at 10k agents), Macquarie DevOps agentic identities.
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
export const AS_ENDPOINT   = 'https://as.corp.example/token';
export const AGENT_ID      = 'spiffe://corp.example/agent/data-pipeline/instance-a3f7';
export const USER_SUBJECT  = 'user:alice@corp.example';

export const attestationResult = {
  nodeId:      'gcp-instance-a3f7',
  attestor:    'GCP instance metadata',
  ek:          'projects/corp-prod/zones/us-central1-a/instances/a3f7',
  issuedAt:    '2026-08-24T09:00:00Z',
  spiffeId:    AGENT_ID,
  svid:        'JWT-SVID',
  ttl:         '15m',
};

export const tokenExchangePayload = {
  grant_type:           'urn:ietf:params:oauth:grant-type:token-exchange',
  subject_token:        '<jwt-svid>',
  subject_token_type:   'urn:ietf:params:oauth:token-type:jwt',
  actor_token:          '<user-jwt>',
  actor_token_type:     'urn:ietf:params:oauth:token-type:jwt',
  authorization_details: JSON.stringify([
    { type: 'vault_secret', path: 'kv/data/pipeline/db-creds', actions: ['read'] }
  ]),
};

export const oauthJwt = {
  iss:    AS_ENDPOINT,
  sub:    AGENT_ID,
  act:    { sub: USER_SUBJECT },
  aud:    VAULT_ADDR,
  exp:    'now + 5m',
  authorization_details: [
    { type: 'vault_secret', path: 'kv/data/pipeline/db-creds', actions: ['read'] }
  ],
};

export const agentRegistryEntry = {
  agentId:     AGENT_ID,
  status:      'active' as const,
  registeredAt: '2026-08-01T00:00:00Z',
  owner:       'platform-team',
  ceiling:     'policy/agent-data-pipeline',
};

export const vaultResourceResponse = {
  path:      'kv/data/pipeline/db-creds',
  secret:    { username: 'pipeline_ro', password: '<dynamic>', lease: '1h' },
  auditLine: `agent=${AGENT_ID} user=${USER_SUBJECT} path=kv/data/pipeline/db-creds action=read status=allow`,
};

export const UC1_STEPS = [
  'Node attestation',
  'JWT-SVID issued',
  'Token exchange',
  'Vault resource request',
  'Agent registry',
] as const;
