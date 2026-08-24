import type { ShowcaseConfig } from '../../src/types';

/* ── UC1: Agentic Identity wireframes ────────────────────────── */
import {
  AgentAttestationAttesting,
  AgentAttestationNodeIdentityIssued,
  AgentAttestationFailed,
} from '@z/wireframes/uc1/01-agent-attestation';
import {
  JwtSvidIssued,
  JwtSvidExpired,
} from '@z/wireframes/uc1/02-svid-issuance';
import {
  TokenExchangeRequest,
  TokenExchangeOAuthJwtMinted,
  TokenExchangeDenied,
} from '@z/wireframes/uc1/03-token-exchange';
import {
  VaultResourceRequestPending,
  VaultResourceSecretDelivered,
  VaultResourcePolicyDenied,
} from '@z/wireframes/uc1/04-vault-resource-request';
import {
  AgentRegistryActive,
  AgentRegistrySuspended,
} from '@z/wireframes/uc1/05-agent-registry';

/* ── UC2: Infra Attestation wireframes ───────────────────────── */
import {
  EkRegistryEmpty,
  EkRegistered,
  EkConflict,
} from '@z/wireframes/uc2/01-ek-enrollment';
import {
  TpmAttestationInProgress,
  TpmAttestationComplete,
  TpmAttestationFailed,
} from '@z/wireframes/uc2/02-tpm-attestation';
import {
  X509SvidIssued,
  X509SvidDetails,
} from '@z/wireframes/uc2/03-x509-svid-issued';
import {
  MtlsHandshake,
  MtlsVerified,
  MtlsFailed,
} from '@z/wireframes/uc2/04-mtls-service-mesh';
import {
  VaultSpiffeAuthRequest,
  VaultSpiffeAuthGranted,
  VaultSpiffeDynamicCredential,
} from '@z/wireframes/uc2/05-vault-spiffe-auth';

/* ── UC3: Kubernetes Workloads wireframes ────────────────────── */
import {
  K8sAuthTokenPresented,
  K8sAuthBound,
  K8sAuthUnboundSA,
} from '@z/wireframes/uc3/01-k8s-auth';
import {
  SvidMountEmpty,
  SvidWritten,
  SvidPermissionDenied,
} from '@z/wireframes/uc3/02-svid-to-filesystem';
import {
  IstioMtlsMeshPeers,
  IstioMtlsAllVerified,
  IstioMtlsTrustMismatch,
} from '@z/wireframes/uc3/03-istio-mtls';
import {
  TrustBundleLive,
  TrustBundleFederationPartner,
  TrustBundleStale,
} from '@z/wireframes/uc3/04-trust-bundle-distribution';

/* ── Platform Engineer wireframes ────────────────────────────── */
import {
  SecretsEngineListDefault,
  SecretsEngineListWithSpiffe,
} from '@z/wireframes/pe/01-secrets-engine-list';
import {
  EnableEngineDefault,
  EnableEngineSpiffeSelected,
  EnableEnginePathConflict,
} from '@z/wireframes/pe/02-enable-engine';
import {
  EngineConfigDefault,
  EngineConfigFilledValid,
  EngineConfigSaving,
  EngineConfigSaved,
} from '@z/wireframes/pe/03-engine-config';
import {
  RoleCreateDefault,
  RoleCreateFilledValid,
  RoleCreateSaving,
  RoleCreateSaved,
} from '@z/wireframes/pe/04-role-create';
import {
  AuthMethodMappingEmpty,
  AuthMethodMappingMethodSelected,
  AuthMethodMappingPolicyPreview,
  AuthMethodMappingAttached,
} from '@z/wireframes/pe/05-auth-method-mapping';
import {
  TrustBundleVerifyChecking,
  TrustBundleVerifySuccess,
  TrustBundleVerifyUnreachable,
} from '@z/wireframes/pe/06-trust-bundle-verify';

/* ── App Developer wireframes ────────────────────────────────── */
import {
  AgentConfigDefault,
  AgentConfigFilledValid,
  AgentConfigMissingRole,
} from '@z/wireframes/dev/01-agent-config';
import {
  AgentRunningStarting,
  AgentRunningAuthenticated,
  AgentRunningAuthFailed,
} from '@z/wireframes/dev/02-agent-running';
import {
  SvidVerifyDefault,
  SvidVerifyVerified,
  SvidVerifyExpired,
} from '@z/wireframes/dev/03-svid-verify';
import {
  MtlsTestPeerList,
  MtlsTestAllVerified,
} from '@z/wireframes/dev/04-mtls-test';

/* ── Security Engineer wireframes ────────────────────────────── */
import {
  AuditLogDefault,
  AuditLogFilteredErrors,
} from '@z/wireframes/sec/01-audit-log';
import {
  IdentityInventoryDefault,
  IdentityInventoryExpiringSoon,
} from '@z/wireframes/sec/02-identity-inventory';
import {
  CaRotationDefault,
  CaRotationPostRotation,
} from '@z/wireframes/sec/03-ca-rotation';
import {
  ComplianceReportDefault,
  ComplianceReportExported,
} from '@z/wireframes/sec/04-compliance-report';

/* ── Prototype ───────────────────────────────────────────────── */
import { PEPrototype } from '@z/wireframes/pe-spiffe-prototype.stories';

/* ─── Preamble: PRD journey section ────────────────────────────
   Covers:
   - The Job (JTBD narrative)
   - The Solution
   - Design principles
   - Key numbers
   - Milestone arc (M0–M3 timeline)
   - Stage cards: 3 PRD requirements
   ────────────────────────────────────────────────────────────── */

const preamble = /* html */ `

<!-- =========== THE JOB =========== -->
<section class="story fade-target" id="the-job">
  <div class="story-label">The Job</div>
  <div class="story-body">
    <p>
      When managing workloads across cloud, on-prem, and hybrid infrastructure,
      platform engineers need a single, standard credential format for workload
      identity — so they can stop maintaining a separate identity store per infrastructure
      type, and stop distributing static secrets to bootstrap the first authentication.
    </p>
    <p>
      Today, the Vault SPIFFE Secrets Engine mints JWT-SVIDs, but not X.509 SVIDs.
      That single gap blocks every use case that depends on mutual TLS: Envoy, Istio,
      gRPC services, and any service mesh that expects the SPIFFE standard certificate
      format. It also blocks SPIFFE federation — which requires X.509 trust bundle exchange.
      Customers like Epic Systems already use Vault's PKI engine to generate CSRs but have
      to write custom code for trust bundle validation because there is no purpose-built path.
    </p>
  </div>
</section>

<!-- =========== THE SOLUTION =========== -->
<section class="story fade-target" id="the-solution">
  <div class="story-label">The Solution</div>
  <div class="story-body">
    <p>
      Extend the SPIFFE Secrets Engine to mint X.509 SVIDs natively — certificates
      that carry the SPIFFE ID as a URI SAN, signed by Vault PKI, with a hosted trust
      bundle endpoint so any verifier can validate offline. No separate SPIRE deployment.
      No custom trust bundle code. One engine, both SVID types.
    </p>
    <p>
      The trust bundle is the key mechanism: once Vault hosts it at a queryable endpoint,
      trust scales by signature rather than by runtime callback. A service mesh, a cloud
      IAM, or another Vault cluster fetches the bundle once, caches it, and validates
      every X.509 SVID locally. Vault's CA rotation updates the bundle automatically —
      both old and new keys are present until all SVIDs signed by the prior key have expired.
    </p>
  </div>
</section>

<!-- =========== PRODUCT PRINCIPLES =========== -->
<section class="principles fade-target" id="principles">
  <h2 class="principles-heading">Design Principles</h2>
  <p class="principles-desc">What governs every decision in this PRD — from configuration surface to acceptance criteria.</p>
  <div class="principles-grid">
    <div class="principle-card">
      <div class="principle-num">01</div>
      <div class="principle-title">Identity earned, not distributed</div>
      <div class="principle-body">
        A workload should prove its identity from the infrastructure it runs on —
        TPM attestation, cloud metadata, or a Kubernetes service account. No
        pre-placed secret. No AppRole secret ID. The SVID is the first credential,
        not a credential traded for another credential.
      </div>
    </div>
    <div class="principle-card">
      <div class="principle-num">02</div>
      <div class="principle-title">Trust scales by signature, not by lookup</div>
      <div class="principle-body">
        The hosted trust bundle enables offline validation. Any verifier — Envoy,
        AWS IAM Roles Anywhere, another Vault cluster — fetches the bundle once
        and validates locally. Vault does not need to be reachable at the moment
        of verification. This is how SPIFFE is designed to work at scale.
      </div>
    </div>
    <div class="principle-card">
      <div class="principle-num">03</div>
      <div class="principle-title">One engine, clear configuration surface</div>
      <div class="principle-body">
        X.509 and JWT minting live in the same SPIFFE Secrets Engine. Setup,
        documentation, and onboarding flows distinguish the two paths clearly —
        only the fields required by each SVID type are exposed. Platform engineers
        should not need to cross-reference multiple engines or custom workarounds.
      </div>
    </div>
  </div>
</section>

<!-- =========== KEY NUMBERS =========== -->
<div class="key-numbers fade-target" id="key-numbers">
  <div class="key-number">
    <div class="num">3</div>
    <div class="label">PRD requirements</div>
  </div>
  <div class="key-number">
    <div class="num">3</div>
    <div class="label">Personas in scope</div>
  </div>
  <div class="key-number">
    <div class="num">8</div>
    <div class="label">Target early preview customers</div>
  </div>
  <div class="key-number">
    <div class="num">M2</div>
    <div class="label">Milestone — January target</div>
  </div>
</div>

<!-- =========== MILESTONE ARC =========== -->
<section class="story fade-target" id="milestone-arc" style="padding-top:3.5rem;">
  <div class="story-label">Milestone Arc</div>
  <div class="story-body">
    <p>
      X.509 minting is Milestone 2 in a four-step progression toward Vault as a
      complete SPIFFE provider. Each milestone is a usable thing on its own — not
      a fragment waiting for the next step.
    </p>
  </div>
</section>

<div class="timeline-container fade-target">
  <div class="timeline">
    <div class="tl-node" onclick="scrollToMilestone('m0')">
      <div class="tl-dot"></div>
      <div class="tl-num">M0 · Now</div>
      <div class="tl-name">JWT-SVIDs + OAuth resource server</div>
    </div>
    <div class="tl-node" onclick="scrollToMilestone('m1')">
      <div class="tl-dot"></div>
      <div class="tl-num">M1 · Oct</div>
      <div class="tl-name">TPM attestation for on-prem VMs</div>
    </div>
    <div class="tl-node active" onclick="scrollToMilestone('m2')">
      <div class="tl-dot"></div>
      <div class="tl-num">M2 · Jan</div>
      <div class="tl-name">X.509 SVIDs + trust bundle (this PRD)</div>
    </div>
    <div class="tl-node" onclick="scrollToMilestone('m3')">
      <div class="tl-dot"></div>
      <div class="tl-num">M3 · Apr</div>
      <div class="tl-name">Workload API socket — drop-in SPIRE replacement</div>
    </div>
  </div>
</div>

<!-- =========== MILESTONE DETAIL CARDS =========== -->
<section class="stages" id="milestones">
  <div class="stages-heading">Milestone detail — click to expand</div>

  <div class="stage-card fade-target" id="m0">
    <div class="stage-card-header" onclick="toggleCard(this)">
      <div class="stage-badge">M0</div>
      <div class="stage-title-area">
        <div class="stage-title">Today — JWT-SVIDs + OAuth resource server</div>
        <div class="stage-one-liner">Vault is already the SPIFFE authority for JWT-based workload identity.</div>
      </div>
      <div class="stage-toggle"><span class="stage-toggle-arrow">&#9654;</span></div>
    </div>
    <div class="stage-detail">
      <div class="stage-detail-inner">
        <div class="detail-block">
          <h4>What ships today</h4>
          <p>
            JWT-SVID minting via the SPIFFE Secrets Engine. OIDC well-known
            and JWKS endpoints for offline JWT validation. SPIFFE auth method
            for consuming JWT and X.509 SVIDs from external providers.
            Tokenless OAuth resource server and Agent Registry in private preview.
          </p>
        </div>
        <div class="detail-block">
          <h4>Honest gap</h4>
          <p>
            X.509 SVIDs, the Workload API socket, and on-prem hardware attestation
            are not yet available. The JWT-SVID story is complete; the mTLS and
            service-mesh story requires X.509 — which ships in M2.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="stage-card fade-target" id="m1">
    <div class="stage-card-header" onclick="toggleCard(this)">
      <div class="stage-badge">M1</div>
      <div class="stage-title-area">
        <div class="stage-title">October — TPM attestation for on-prem VMs</div>
        <div class="stage-one-liner">Hardware-rooted identity for Linux workloads on VMware and Nutanix — no Secret Zero.</div>
      </div>
      <div class="stage-toggle"><span class="stage-toggle-arrow">&#9654;</span></div>
    </div>
    <div class="stage-detail">
      <div class="stage-detail-inner">
        <div class="detail-block">
          <h4>What ships</h4>
          <p>
            TPM 2.0 node attestation in Vault Agent. Vault issues a leaf certificate
            bound to the TPM endorsement key. Cert auth login with TPM binding.
            EK enrollment and host registry so only pre-registered nodes can attest.
          </p>
        </div>
        <div class="detail-block">
          <h4>Honest gap</h4>
          <p>
            Attestation output is a Vault token and certificate, not a SVID yet.
            Single workload per host. Linux and vTPM only. The SVID-direct path
            closes in M2.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="stage-card fade-target open" id="m2">
    <div class="stage-card-header" onclick="toggleCard(this)">
      <div class="stage-badge" style="color:var(--accent-blue)">M2</div>
      <div class="stage-title-area">
        <div class="stage-title">January — X.509 SVIDs + trust bundle <span style="font-size:0.8rem;font-weight:400;color:var(--accent-blue);margin-left:8px;font-family:var(--mono)">THIS PRD</span></div>
        <div class="stage-one-liner">From "can mint SPIFFE IDs" to a complete SPIFFE identity provider for the certificate path.</div>
      </div>
      <div class="stage-toggle"><span class="stage-toggle-arrow">&#9654;</span></div>
    </div>
    <div class="stage-detail">
      <div class="stage-detail-inner">
        <div class="detail-block">
          <h4>What ships</h4>
          <p>
            X.509 SVID issuance (cert + SPIFFE ID as URI SAN) via the SPIFFE Secrets Engine.
            X.509 trust bundle endpoint conforming to the SPIFFE Federation Bundle Endpoint spec.
            Trust bundle available without a Vault token. Performance replication serves an
            identical bundle on secondary clusters.
          </p>
        </div>
        <div class="detail-block">
          <h4>What this enables</h4>
          <p>
            mTLS with Envoy, Istio, and gRPC services using a Vault-issued X.509 SVID.
            On-prem workloads present their SVID to AWS IAM Roles Anywhere or GCP
            Workload Identity Federation — no static cloud credential on the host.
            SPIFFE federation with other Vault clusters and SPIRE deployments.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="stage-card fade-target" id="m3">
    <div class="stage-card-header" onclick="toggleCard(this)">
      <div class="stage-badge">M3</div>
      <div class="stage-title-area">
        <div class="stage-title">April — Workload API socket + workload attestation</div>
        <div class="stage-one-liner">Drop-in SPIRE alternative: transparent SVID delivery, per-process identity, no SPIRE infrastructure.</div>
      </div>
      <div class="stage-toggle"><span class="stage-toggle-arrow">&#9654;</span></div>
    </div>
    <div class="stage-detail">
      <div class="stage-detail-inner">
        <div class="detail-block">
          <h4>What ships</h4>
          <p>
            Vault Agent exposes a Unix Domain Socket implementing the SPIFFE Workload API.
            Workloads call the socket with no credentials to receive their SVID.
            Per-process workload attestation (UID, GID, binary path) so multiple services
            on a single host each get a distinct identity and a distinct Vault policy scope.
          </p>
        </div>
        <div class="detail-block">
          <h4>What becomes possible</h4>
          <p>
            Any SPIFFE-native workload — Envoy, an AI agent sidecar, a gRPC service —
            gets its SVID transparently without code changes, just as it would from SPIRE.
            The three-layer agentic architecture closes: TPM attestation → SVID →
            authorization server → Vault resource server, with no static credential anywhere.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- =========== PRD REQUIREMENTS =========== -->
<section class="story fade-target" id="requirements-intro" style="padding-top:1rem;">
  <div class="story-label">PRD Requirements</div>
  <div class="story-body">
    <p>
      VLT-515 has three requirements, sequenced by dependency. Requirement 1 (X.509 SVID
      minting) is the prerequisite for Requirements 2 and 3. None are in scope for
      SPIFFE federation with SPIRE in this milestone — that follows once customer
      demand is confirmed.
    </p>
  </div>
</section>

<section class="stages" id="requirements">
  <div class="stages-heading">Requirements — click to expand</div>

  <div class="stage-card fade-target" id="r1">
    <div class="stage-card-header" onclick="toggleCard(this)">
      <div class="stage-badge">R1</div>
      <div class="stage-title-area">
        <div class="stage-title">Generate X.509 SVIDs</div>
        <div class="stage-one-liner">Mint SPIFFE-compliant X.509 certificates from any configured auth method.</div>
      </div>
      <div class="stage-toggle"><span class="stage-toggle-arrow">&#9654;</span></div>
    </div>
    <div class="stage-detail">
      <div class="stage-detail-inner">
        <div class="detail-block">
          <h4>What the system does</h4>
          <p>
            Generates an X.509 SVID when presented with a valid authentication.
            The certificate embeds exactly one URI SAN carrying the SPIFFE ID
            (spiffe://trust-domain/path), sets the correct key usage (digitalSignature,
            id-kp-serverAuth, id-kp-clientAuth), and sets cA to false on leaf certs.
            Setup and docs distinguish X.509 configuration from JWT configuration —
            only the fields required by each type are exposed.
          </p>
        </div>
        <div class="detail-block">
          <h4>Key acceptance criteria</h4>
          <p>
            A Vault-issued X.509 SVID presented to a SPIFFE-compliant destination during
            an mTLS handshake validates against the published trust bundle endpoint.
            If metadata required for X.509 minting is missing, the system returns a
            clear error identifying the missing fields — not a generic failure.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="stage-card fade-target" id="r2">
    <div class="stage-card-header" onclick="toggleCard(this)">
      <div class="stage-badge">R2</div>
      <div class="stage-title-area">
        <div class="stage-title">X.509 Trust Bundle Hosting</div>
        <div class="stage-one-liner">A hosted, queryable trust bundle per mount — accessible without a Vault token.</div>
      </div>
      <div class="stage-toggle"><span class="stage-toggle-arrow">&#9654;</span></div>
    </div>
    <div class="stage-detail">
      <div class="stage-detail-inner">
        <div class="detail-block">
          <h4>What the system does</h4>
          <p>
            Generates and hosts a trust bundle for each SPIFFE Secrets Engine mount.
            The bundle contains the X.509 CA public keys required to verify X.509 SVIDs.
            When Vault rotates its signing CA, the bundle contains both old and new keys
            until all SVIDs signed by the prior key have expired. Performance replication
            serves an identical bundle on secondary clusters for availability.
          </p>
        </div>
        <div class="detail-block">
          <h4>Key acceptance criteria</h4>
          <p>
            A verifier that cannot reach the trust bundle endpoint fails closed —
            not open. A request for the trust bundle of a non-existent mount returns
            a 404 without exposing bundle material from other mounts. A misconfigured
            trust domain fails at engine creation or modification, not at minting time.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="stage-card fade-target" id="r3">
    <div class="stage-card-header" onclick="toggleCard(this)">
      <div class="stage-badge">R3</div>
      <div class="stage-title-area">
        <div class="stage-title">Trust Bundle Endpoint Conformance</div>
        <div class="stage-one-liner">SPIFFE Federation Bundle Endpoint spec — so any SPIFFE-aware system can validate SVIDs offline.</div>
      </div>
      <div class="stage-toggle"><span class="stage-toggle-arrow">&#9654;</span></div>
    </div>
    <div class="stage-detail">
      <div class="stage-detail-inner">
        <div class="detail-block">
          <h4>What the system does</h4>
          <p>
            Serves the trust bundle at a spec-conformant endpoint. A client that calls
            the endpoint receives a document containing the X.509 CA public keys for the
            trust domain. Tokenless access — no Vault token or auth required to fetch
            the bundle, because verifiers must be able to validate SVIDs without
            authenticating to Vault.
          </p>
        </div>
        <div class="detail-block">
          <h4>Out of scope for M2</h4>
          <p>
            SPIFFE federation with SPIRE is explicitly deferred. Federation requires
            X.509 trust bundle exchange and will be scoped in a follow-on milestone
            once customer demand from the preview program is confirmed.
            BYO-certificate and BYO-key scenarios are also deferred pending demand.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* ── Preamble-local styles (supplement the showcase template tokens) ── */
  .story {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3.5rem 2rem;
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 3rem;
  }
  .story-label {
    font-family: var(--z-font-mono, 'DM Mono', monospace);
    font-size: 0.75rem;
    color: var(--z-text-helper);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding-top: 0.35rem;
  }
  .story-body {
    max-width: 640px;
  }
  .story-body p {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--z-text-secondary);
    margin-bottom: 1rem;
    font-weight: 400;
  }
  .story-body p:first-child {
    font-size: 1.05rem;
    color: var(--z-text-primary);
    font-weight: 500;
  }

  /* Principles */
  .principles {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem 3.5rem;
  }
  .principles-heading {
    font-family: var(--z-font-sans);
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--z-text-primary);
    margin-bottom: 0.4rem;
  }
  .principles-desc {
    font-size: 0.95rem;
    color: var(--z-text-secondary);
    margin-bottom: 1.75rem;
    font-weight: 400;
    max-width: 560px;
  }
  .principles-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
  .principle-card {
    background: var(--z-layer-01);
    border: 1px solid var(--z-border-subtle);
    border-radius: 6px;
    padding: 1.5rem;
    position: relative;
  }
  .principle-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 6px 6px 0 0;
  }
  .principle-card:nth-child(1)::before { background: var(--z-text-secondary); }
  .principle-card:nth-child(2)::before { background: var(--z-text-helper); }
  .principle-card:nth-child(3)::before { background: var(--z-border-subtle); }
  .principle-num {
    font-family: var(--z-font-mono);
    font-size: 0.72rem;
    color: var(--z-text-helper);
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }
  .principle-title {
    font-family: var(--z-font-sans);
    font-size: 1rem;
    font-weight: 600;
    color: var(--z-text-primary);
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }
  .principle-body {
    font-size: 0.9rem;
    color: var(--z-text-secondary);
    line-height: 1.65;
    font-weight: 400;
  }

  /* Key numbers */
  .key-numbers {
    max-width: 1200px;
    margin: 0 auto 2rem;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--z-border-subtle);
    border: 1px solid var(--z-border-subtle);
    border-radius: 8px;
    overflow: hidden;
  }
  .key-number {
    background: var(--z-layer-01);
    padding: 1.5rem;
    text-align: center;
  }
  .key-number .num {
    font-family: var(--z-font-sans);
    font-size: 2rem;
    font-weight: 700;
    color: var(--z-text-primary);
    line-height: 1.1;
  }
  .key-number .label {
    font-family: var(--z-font-mono);
    font-size: 0.72rem;
    color: var(--z-text-helper);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-top: 0.5rem;
  }

  /* Timeline */
  .timeline-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem 1rem;
    overflow-x: auto;
  }
  .timeline {
    display: flex;
    align-items: flex-start;
    min-width: max-content;
    padding: 2rem 0;
    position: relative;
  }
  .timeline::before {
    content: '';
    position: absolute;
    top: 26px;
    left: 24px;
    right: 24px;
    height: 2px;
    background: var(--z-border-subtle);
    z-index: 0;
  }
  .tl-node {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 160px;
    flex: 1;
    cursor: pointer;
    z-index: 1;
  }
  .tl-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid var(--z-border-subtle);
    background: var(--z-bg);
    transition: transform 0.2s ease;
  }
  .tl-node:hover .tl-dot { transform: scale(1.4); }
  .tl-node.active .tl-dot {
    border-color: var(--z-text-primary);
    background: var(--z-text-secondary);
  }
  .tl-num {
    font-family: var(--z-font-mono);
    font-size: 0.72rem;
    color: var(--z-text-helper);
    margin-top: 0.75rem;
    letter-spacing: 0.06em;
  }
  .tl-name {
    font-family: var(--z-font-sans);
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--z-text-secondary);
    margin-top: 0.25rem;
    text-align: center;
    max-width: 140px;
    line-height: 1.35;
  }
  .tl-node.active .tl-name {
    font-weight: 600;
    color: var(--z-text-primary);
  }

  /* Stage cards */
  .stages {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem 3rem;
  }
  .stages-heading {
    font-family: var(--z-font-mono);
    font-size: 0.72rem;
    color: var(--z-text-helper);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--z-border-subtle);
  }
  .stage-card {
    border: 1px solid var(--z-border-subtle);
    border-radius: 6px;
    margin-bottom: 0.75rem;
    background: var(--z-layer-01);
    overflow: hidden;
    transition: border-color 0.2s ease;
  }
  .stage-card:hover { border-color: var(--z-text-helper); }
  .stage-card-header {
    display: grid;
    grid-template-columns: 56px 1fr auto;
    align-items: center;
    padding: 1rem 1.25rem;
    cursor: pointer;
    user-select: none;
    gap: 1rem;
  }
  .stage-card-header:hover { background: var(--z-layer-02); }
  .stage-badge {
    font-family: var(--z-font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    text-align: center;
    font-weight: 500;
    color: var(--z-text-helper);
  }
  .stage-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--z-text-primary);
  }
  .stage-one-liner {
    font-size: 0.875rem;
    color: var(--z-text-secondary);
    font-weight: 400;
    margin-top: 2px;
  }
  .stage-toggle {
    font-family: var(--z-font-mono);
    font-size: 0.72rem;
    color: var(--z-text-helper);
  }
  .stage-toggle-arrow {
    display: inline-block;
    transition: transform 0.3s ease;
    font-size: 0.75rem;
  }
  .stage-card.open .stage-toggle-arrow { transform: rotate(90deg); }
  .stage-detail { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
  .stage-card.open .stage-detail { max-height: 1200px; }
  .stage-detail-inner {
    padding: 0 1.25rem 1.25rem;
    padding-left: calc(56px + 1.25rem + 1rem);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .detail-block h4 {
    font-family: var(--z-font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--z-text-helper);
    margin-bottom: 0.5rem;
  }
  .detail-block p {
    font-size: 0.875rem;
    color: var(--z-text-secondary);
    line-height: 1.65;
    font-weight: 400;
  }

  /* Fade animation */
  .fade-target {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .fade-target.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .story { grid-template-columns: 1fr; gap: 1rem; }
    .principles-grid { grid-template-columns: 1fr; }
    .key-numbers { grid-template-columns: repeat(2, 1fr); }
    .stage-detail-inner { grid-template-columns: 1fr; padding-left: 1.25rem; }
  }

  /* ── User Journey styles ── */
  .journey-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3.5rem 2rem 1rem;
    border-top: 1px solid var(--z-border-subtle);
  }
  .journey-section-header {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 3rem;
    margin-bottom: 2.5rem;
  }
  .journey-section-label {
    font-family: var(--z-font-mono);
    font-size: 0.75rem;
    color: var(--z-text-helper);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding-top: 0.35rem;
  }
  .journey-section-intro p {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--z-text-secondary);
    margin-bottom: 0.75rem;
    font-weight: 400;
    max-width: 640px;
  }
  .journey-section-intro p:first-child {
    font-size: 1.05rem;
    color: var(--z-text-primary);
    font-weight: 500;
  }

  /* Persona tabs */
  .persona-tabs {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--z-border-subtle);
  }
  .persona-tab {
    font-family: var(--z-font-sans);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--z-text-helper);
    padding: 0.7rem 1.5rem;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    user-select: none;
    transition: color 0.15s ease, border-color 0.15s ease;
  }
  .persona-tab:hover { color: var(--z-text-secondary); }
  .persona-tab.active {
    color: var(--z-text-primary);
    font-weight: 600;
    border-bottom-color: var(--z-text-primary);
  }

  /* Persona panels */
  .persona-panel {
    display: none;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2.5rem 2rem 0;
  }
  .persona-panel.active { display: block; }

  /* Persona context row */
  .persona-context {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--z-border-subtle);
    border: 1px solid var(--z-border-subtle);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 2.5rem;
  }
  .persona-context-cell {
    background: var(--z-layer-01);
    padding: 1.25rem 1.5rem;
  }
  .persona-context-cell .ctx-label {
    font-family: var(--z-font-mono);
    font-size: 0.68rem;
    color: var(--z-text-helper);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
  }
  .persona-context-cell .ctx-value {
    font-size: 0.9rem;
    color: var(--z-text-primary);
    font-weight: 500;
    line-height: 1.4;
  }
  .persona-context-cell .ctx-sub {
    font-size: 0.82rem;
    color: var(--z-text-secondary);
    margin-top: 0.2rem;
    line-height: 1.45;
  }

  /* Journey steps */
  .journey-steps {
    position: relative;
    padding-left: 2rem;
  }
  .journey-steps::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 8px;
    bottom: 8px;
    width: 1px;
    background: var(--z-border-subtle);
  }
  .journey-step {
    position: relative;
    margin-bottom: 2rem;
    padding-left: 1.75rem;
  }
  .journey-step::before {
    content: '';
    position: absolute;
    left: -2rem;
    top: 6px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid var(--z-border-subtle);
    background: var(--z-bg);
  }
  .journey-step.decision::before {
    border-radius: 2px;
    transform: rotate(45deg);
    top: 4px;
  }
  .journey-step-num {
    font-family: var(--z-font-mono);
    font-size: 0.68rem;
    color: var(--z-text-helper);
    letter-spacing: 0.1em;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
  }
  .journey-step-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--z-text-primary);
    margin-bottom: 0.4rem;
    line-height: 1.35;
  }
  .journey-step-body {
    font-size: 0.875rem;
    color: var(--z-text-secondary);
    line-height: 1.7;
    max-width: 600px;
  }
  .journey-step-body strong {
    color: var(--z-text-primary);
    font-weight: 600;
  }
  .journey-step-meta {
    margin-top: 0.6rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .step-tag {
    font-family: var(--z-font-mono);
    font-size: 0.68rem;
    color: var(--z-text-helper);
    background: var(--z-layer-02);
    border: 1px solid var(--z-border-subtle);
    border-radius: 3px;
    padding: 2px 7px;
    letter-spacing: 0.06em;
  }
  .step-code {
    font-family: var(--z-font-mono);
    font-size: 0.78rem;
    color: var(--z-text-secondary);
    background: var(--z-layer-02);
    border: 1px solid var(--z-border-subtle);
    border-radius: 4px;
    padding: 0.6rem 0.9rem;
    margin-top: 0.6rem;
    display: block;
    white-space: pre;
    overflow-x: auto;
    max-width: 560px;
    line-height: 1.55;
  }

  /* Branch/decision callout */
  .step-branch {
    margin-top: 0.75rem;
    border-left: 2px solid var(--z-border-subtle);
    padding-left: 0.9rem;
  }
  .step-branch-label {
    font-family: var(--z-font-mono);
    font-size: 0.68rem;
    color: var(--z-text-helper);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.3rem;
  }
  .step-branch p {
    font-size: 0.82rem;
    color: var(--z-text-secondary);
    margin: 0 0 0.4rem;
    line-height: 1.6;
  }

  /* Outcome card */
  .journey-outcome {
    margin-top: 2rem;
    margin-bottom: 3rem;
    background: var(--z-layer-01);
    border: 1px solid var(--z-border-subtle);
    border-radius: 8px;
    padding: 1.5rem 1.75rem;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    align-items: start;
  }
  .outcome-marker {
    font-family: var(--z-font-mono);
    font-size: 0.72rem;
    color: var(--z-text-helper);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    white-space: nowrap;
    padding-top: 0.2rem;
  }
  .outcome-body p {
    font-size: 0.9rem;
    color: var(--z-text-secondary);
    margin: 0 0 0.5rem;
    line-height: 1.65;
  }
  .outcome-body p:first-child {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--z-text-primary);
    margin-bottom: 0.4rem;
  }

  /* Cross-persona connection */
  .journey-handoff {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem 3.5rem;
  }
  .handoff-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--z-border-subtle);
    border: 1px solid var(--z-border-subtle);
    border-radius: 8px;
    overflow: hidden;
    margin-top: 1.5rem;
  }
  .handoff-cell {
    background: var(--z-layer-01);
    padding: 1.4rem 1.5rem;
  }
  .handoff-cell .hc-persona {
    font-family: var(--z-font-mono);
    font-size: 0.68rem;
    color: var(--z-text-helper);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }
  .handoff-cell .hc-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--z-text-primary);
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }
  .handoff-cell .hc-body {
    font-size: 0.83rem;
    color: var(--z-text-secondary);
    line-height: 1.6;
  }
  .handoff-arrow {
    text-align: center;
    padding: 1.4rem 0;
    font-size: 1.1rem;
    color: var(--z-text-helper);
    background: var(--z-layer-01);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    .journey-section-header { grid-template-columns: 1fr; gap: 1rem; }
    .persona-context { grid-template-columns: 1fr; }
    .handoff-grid { grid-template-columns: 1fr; }
    .step-code { white-space: pre-wrap; }
  }
</style>

<script>
  function switchUc1Step(id) {
    document.querySelectorAll('#uc1-steps-tabs .persona-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#uc1-step-attest, #uc1-step-svid, #uc1-step-exchange, #uc1-step-resource, #uc1-step-registry').forEach(p => p.classList.remove('active'));
    var tabs = document.querySelectorAll('#uc1-steps-tabs .persona-tab');
    var ids = ['uc1-step-attest','uc1-step-svid','uc1-step-exchange','uc1-step-resource','uc1-step-registry'];
    var idx = ids.indexOf(id);
    if (idx >= 0) tabs[idx].classList.add('active');
    var el = document.getElementById(id);
    if (el) el.classList.add('active');
  }
  function switchUc2Step(id) {
    document.querySelectorAll('#uc2-steps-tabs .persona-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#uc2-step-ek, #uc2-step-tpm, #uc2-step-svid, #uc2-step-mtls, #uc2-step-auth').forEach(p => p.classList.remove('active'));
    var tabs = document.querySelectorAll('#uc2-steps-tabs .persona-tab');
    var ids = ['uc2-step-ek','uc2-step-tpm','uc2-step-svid','uc2-step-mtls','uc2-step-auth'];
    var idx = ids.indexOf(id);
    if (idx >= 0) tabs[idx].classList.add('active');
    var el = document.getElementById(id);
    if (el) el.classList.add('active');
  }
  function switchUc3Step(id) {
    document.querySelectorAll('#uc3-steps-tabs .persona-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#uc3-step-k8s, #uc3-step-fs, #uc3-step-istio, #uc3-step-bundle').forEach(p => p.classList.remove('active'));
    var tabs = document.querySelectorAll('#uc3-steps-tabs .persona-tab');
    var ids = ['uc3-step-k8s','uc3-step-fs','uc3-step-istio','uc3-step-bundle'];
    var idx = ids.indexOf(id);
    if (idx >= 0) tabs[idx].classList.add('active');
    var el = document.getElementById(id);
    if (el) el.classList.add('active');
  }
</script>

<!-- =========== USE CASE JOURNEYS =========== -->

<!-- UC1 -->
<div class="journey-section fade-target" id="uc1-agentic-identity">
  <div class="journey-section-header">
    <div class="journey-section-label">Use Case 1</div>
    <div class="journey-section-intro">
      <p>Agentic Identity — JWT-SVID to OAuth JWT to Vault resource server.</p>
      <p>A software agent running on cloud infrastructure must prove its identity without a pre-placed secret.
         Node attestation via cloud metadata produces a JWT-SVID. That SVID is exchanged at an Authorization
         Server for an OAuth JWT scoped to the agent's policy. The agent presents the OAuth JWT to the Vault
         resource server and receives only the secrets its policy permits. No Vault token bootstrap required.</p>
    </div>
  </div>
</div>

<div class="persona-tabs" id="uc1-steps-tabs">
  <div class="persona-tab active" onclick="switchUc1Step('uc1-step-attest')">1. Attestation</div>
  <div class="persona-tab" onclick="switchUc1Step('uc1-step-svid')">2. SVID Issuance</div>
  <div class="persona-tab" onclick="switchUc1Step('uc1-step-exchange')">3. Token Exchange</div>
  <div class="persona-tab" onclick="switchUc1Step('uc1-step-resource')">4. Resource Request</div>
  <div class="persona-tab" onclick="switchUc1Step('uc1-step-registry')">5. Agent Registry</div>
</div>

<div class="persona-panel active fade-target" id="uc1-step-attest">
  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Step</div>
      <div class="ctx-value">Node Attestation</div>
      <div class="ctx-sub">Agent presents cloud metadata. Vault validates identity claim against registered nodes.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Input</div>
      <div class="ctx-value">Cloud instance metadata (GCP/AWS)</div>
      <div class="ctx-sub">No pre-placed Vault token. No AppRole secret ID. Identity derived from infrastructure.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Output</div>
      <div class="ctx-value">Assigned SPIFFE ID — ready to mint JWT-SVID</div>
      <div class="ctx-sub">Node record created in agent registry. Attestation logged with method and result.</div>
    </div>
  </div>
  <div class="journey-steps">
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Attesting</div>
      <div class="journey-step-title">Vault validates the cloud metadata signature</div>
      <div class="journey-step-body">
        Agent sends instance identity document. Vault checks signature against the cloud provider's root of trust.
        No credential is placed on the host before this call.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">GCP instance metadata</span>
        <span class="step-tag">AWS EC2 identity doc</span>
        <span class="step-tag">No pre-placed secret</span>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: NodeIdentityIssued</div>
      <div class="journey-step-title">Attestation succeeds — SPIFFE ID assigned</div>
      <div class="journey-step-body">
        Node receives a SPIFFE ID bound to its instance path. JWT-SVID is ready. Next step: present to Authorization Server.
        <code class="step-code">spiffe://corp.example/agent/gcp-instance-a3f7</code>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: AttestationFailed</div>
      <div class="journey-step-title">Node not in registry — specific error returned</div>
      <div class="journey-step-body">
        If the node is not pre-registered, Vault returns the node ID and reason. Error is actionable — not a generic 403.
        The resolution command is surfaced inline.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Error identifies missing registration</span>
        <span class="step-tag">Resolution command shown</span>
      </div>
    </div>
  </div>
</div>

<div class="persona-panel fade-target" id="uc1-step-svid">
  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Step</div>
      <div class="ctx-value">JWT-SVID Issuance</div>
      <div class="ctx-sub">Vault mints a short-lived JWT carrying the agent's SPIFFE ID as subject.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Input</div>
      <div class="ctx-value">Attested SPIFFE ID + role config</div>
      <div class="ctx-sub">TTL from role. Audience from role. No manual cert management.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Output</div>
      <div class="ctx-value">Signed JWT-SVID — portable to Authorization Server</div>
      <div class="ctx-sub">Expiry set. Auto-renewal via Vault Agent. Agent never holds an expired credential.</div>
    </div>
  </div>
  <div class="journey-steps">
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: JwtSvidIssued</div>
      <div class="journey-step-title">JWT-SVID minted and ready</div>
      <div class="journey-step-body">
        The SVID carries the SPIFFE ID as <code>sub</code> claim. Signed by Vault's JWKS key.
        Verifiable offline against Vault's OIDC well-known endpoint.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Short-lived — TTL from role</span>
        <span class="step-tag">SPIFFE ID as sub claim</span>
        <span class="step-tag">Vault JWKS signed</span>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: JwtSvidExpired</div>
      <div class="journey-step-title">SVID expired — Vault Agent renews automatically</div>
      <div class="journey-step-body">
        If renewal fails (Vault connectivity lost), the expired state is surfaced with the last-known expiry time.
        Agent retries on reconnect. The workload is blocked, not silently using a stale credential.
      </div>
    </div>
  </div>
</div>

<div class="persona-panel fade-target" id="uc1-step-exchange">
  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Step</div>
      <div class="ctx-value">Token Exchange</div>
      <div class="ctx-sub">JWT-SVID exchanged at Authorization Server for a scoped OAuth JWT.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Input</div>
      <div class="ctx-value">JWT-SVID (RFC 8693 token exchange)</div>
      <div class="ctx-sub">Authorization Server validates SVID against Vault OIDC endpoint, checks policy, issues OAuth JWT.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Output</div>
      <div class="ctx-value">OAuth JWT scoped to agent's policy</div>
      <div class="ctx-sub">Audience is the Vault resource server. Scope is limited to what the agent's SPIFFE ID permits.</div>
    </div>
  </div>
  <div class="journey-steps">
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: TokenExchangeRequest</div>
      <div class="journey-step-title">Agent presents JWT-SVID to Authorization Server</div>
      <div class="journey-step-body">
        RFC 8693 token exchange in progress. Authorization Server validates SVID signature and checks
        the agent's SPIFFE ID against registered agent policy.
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: OAuthJwtMinted</div>
      <div class="journey-step-title">OAuth JWT issued — agent holds a scoped credential</div>
      <div class="journey-step-body">
        Token carries audience, scope, and expiry. Agent uses this JWT to authenticate to the Vault resource server.
        The SVID is consumed — it is not forwarded. Only the OAuth JWT crosses service boundaries.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Audience: Vault resource server</span>
        <span class="step-tag">Scope from SPIFFE ID policy</span>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: TokenExchangeDenied</div>
      <div class="journey-step-title">Exchange denied — SPIFFE ID not authorized</div>
      <div class="journey-step-body">
        If the agent's SPIFFE ID is not registered at the Authorization Server, exchange is denied with the
        specific SPIFFE ID and reason. No fallback credential is issued.
      </div>
    </div>
  </div>
</div>

<div class="persona-panel fade-target" id="uc1-step-resource">
  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Step</div>
      <div class="ctx-value">Vault Resource Request</div>
      <div class="ctx-sub">Agent presents OAuth JWT to Vault resource server and receives secrets within policy scope.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Input</div>
      <div class="ctx-value">Scoped OAuth JWT</div>
      <div class="ctx-sub">Vault validates JWT against its OIDC configuration, maps to entity, enforces policy.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Output</div>
      <div class="ctx-value">Secret delivered — or policy denial with reason</div>
      <div class="ctx-sub">Audit log records entity, OAuth JWT subject, path requested, and outcome.</div>
    </div>
  </div>
  <div class="journey-steps">
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Pending</div>
      <div class="journey-step-title">OAuth JWT being validated against resource server policy</div>
      <div class="journey-step-body">Vault verifies audience, expiry, and maps the token subject to an entity alias. Policy evaluation in progress.</div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: SecretDelivered</div>
      <div class="journey-step-title">Secret delivered — no Vault token, no static credential</div>
      <div class="journey-step-body">
        The agent receives the secret directly. The chain is: cloud metadata → SVID → OAuth JWT → secret.
        No standing Vault token held by the agent process at any point.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Tokenless Vault resource server</span>
        <span class="step-tag">Secret scoped to JWT audience + policy</span>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: PolicyDenied</div>
      <div class="journey-step-title">Policy denial — exact path and reason surfaced</div>
      <div class="journey-step-body">
        Vault returns the denied path and the policy rule that blocked it. Operator does not need to
        reverse-engineer the policy from a generic 403.
      </div>
    </div>
  </div>
</div>

<div class="persona-panel fade-target" id="uc1-step-registry">
  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Step</div>
      <div class="ctx-value">Agent Registry</div>
      <div class="ctx-sub">Platform view of registered agents — SPIFFE IDs, attestation methods, last-seen timestamps.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Job to be done</div>
      <div class="ctx-value">Know which agents are active and which are no longer expected</div>
      <div class="ctx-sub">Deregister agents that have been decommissioned. Flag agents that have not attested recently.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Output</div>
      <div class="ctx-value">Registry record per agent — or suspension action</div>
      <div class="ctx-sub">Suspension revokes the SPIFFE ID. New attestation attempts from the node are denied.</div>
    </div>
  </div>
  <div class="journey-steps">
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Active</div>
      <div class="journey-step-title">Registry shows active agents with last attestation time</div>
      <div class="journey-step-body">
        Each row: node ID, SPIFFE ID, attestation method, last seen, status. Platform engineer can identify
        stale entries without checking individual audit logs.
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Suspended</div>
      <div class="journey-step-title">Agent suspended — future attestation attempts denied</div>
      <div class="journey-step-body">
        Suspension is immediate. The SPIFFE ID is revoked in the registry. Any new attestation from that
        node ID is rejected at the attestation step, before a SVID is issued.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Immediate effect</span>
        <span class="step-tag">Existing SVIDs expire at TTL</span>
        <span class="step-tag">Audit log records suspension</span>
      </div>
    </div>
  </div>
</div>

<!-- UC2 -->
<div class="journey-section fade-target" id="uc2-infra-attestation" style="margin-top: 2rem;">
  <div class="journey-section-header">
    <div class="journey-section-label">Use Case 2</div>
    <div class="journey-section-intro">
      <p>Infrastructure-agnostic Attestation — TPM enrollment to X.509 SVID to Vault SPIFFE auth.</p>
      <p>On-prem VMs without cloud metadata need hardware-rooted identity. An Endorsement Key (EK)
         is enrolled in Vault before the host is provisioned. At runtime, Vault Agent presents a TPM 2.0
         attestation quote. Vault verifies it against the registered EK, mints an X.509 SVID, and the
         workload uses that SVID for mTLS and for authenticating back to Vault via the SPIFFE auth method.</p>
    </div>
  </div>
</div>

<div class="persona-tabs" id="uc2-steps-tabs">
  <div class="persona-tab active" onclick="switchUc2Step('uc2-step-ek')">1. EK Enrollment</div>
  <div class="persona-tab" onclick="switchUc2Step('uc2-step-tpm')">2. TPM Attestation</div>
  <div class="persona-tab" onclick="switchUc2Step('uc2-step-svid')">3. X.509 SVID</div>
  <div class="persona-tab" onclick="switchUc2Step('uc2-step-mtls')">4. mTLS</div>
  <div class="persona-tab" onclick="switchUc2Step('uc2-step-auth')">5. SPIFFE Auth</div>
</div>

<div class="persona-panel active fade-target" id="uc2-step-ek">
  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Step</div>
      <div class="ctx-value">EK Enrollment</div>
      <div class="ctx-sub">Platform engineer registers a host's TPM Endorsement Key before provisioning.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Input</div>
      <div class="ctx-value">EK certificate from TPM manufacturer</div>
      <div class="ctx-sub">Enrollment is out-of-band — happens before the host is deployed. Only registered EKs can attest.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Output</div>
      <div class="ctx-value">EK record in Vault registry</div>
      <div class="ctx-sub">Host identity anchored to hardware. Any attestation from an unregistered EK is rejected.</div>
    </div>
  </div>
  <div class="journey-steps">
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Empty</div>
      <div class="journey-step-title">No EKs registered — registry is empty</div>
      <div class="journey-step-body">Before any on-prem host can attest, its EK must be enrolled. The empty state surfaces the enrollment command inline.</div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Registered</div>
      <div class="journey-step-title">EK enrolled — host cleared for attestation</div>
      <div class="journey-step-body">
        Registry row shows: EK fingerprint, host label, enrollment date, attestation status.
        The host can now attest on first boot.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">EK fingerprint</span>
        <span class="step-tag">Enrollment timestamp</span>
        <span class="step-tag">Status: cleared</span>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Conflict</div>
      <div class="journey-step-title">EK already registered — duplicate rejected</div>
      <div class="journey-step-body">
        Attempting to register an EK that already exists returns the existing record with its original
        enrollment date. Prevents silent overwrite of a host record.
      </div>
    </div>
  </div>
</div>

<div class="persona-panel fade-target" id="uc2-step-tpm">
  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Step</div>
      <div class="ctx-value">TPM Attestation</div>
      <div class="ctx-sub">Vault Agent presents a TPM 2.0 quote. Vault verifies it against the enrolled EK.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Input</div>
      <div class="ctx-value">TPM quote + AK certificate</div>
      <div class="ctx-sub">Vault generates a nonce challenge, agent signs with TPM Attestation Key, Vault verifies the quote against the enrolled EK cert chain.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Output</div>
      <div class="ctx-value">Vault token + certificate bound to EK — or attestation failure</div>
      <div class="ctx-sub">Token is scoped to cert auth policy. Certificate carries EK binding. X.509 SVID issued next.</div>
    </div>
  </div>
  <div class="journey-steps">
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: InProgress</div>
      <div class="journey-step-title">Nonce challenge issued — waiting for TPM quote</div>
      <div class="journey-step-body">Vault issued a nonce. Agent is computing the TPM quote. Challenge is time-bound — stale quotes are rejected.</div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Complete</div>
      <div class="journey-step-title">TPM attestation verified — identity bound to hardware</div>
      <div class="journey-step-body">
        Vault verified the quote, matched the EK to the registry, issued a token and leaf cert.
        The cert carries the host's SPIFFE ID. Next: mint X.509 SVID.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">TPM 2.0</span>
        <span class="step-tag">EK-bound cert</span>
        <span class="step-tag">Hardware-rooted identity</span>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Failed</div>
      <div class="journey-step-title">Quote verification failed — specific reason returned</div>
      <div class="journey-step-body">
        Common causes: stale nonce, EK not enrolled, quote mismatch. Vault returns which check failed.
        Platform engineer receives the specific EK fingerprint and mismatch type.
      </div>
    </div>
  </div>
</div>

<div class="persona-panel fade-target" id="uc2-step-svid">
  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Step</div>
      <div class="ctx-value">X.509 SVID Issued</div>
      <div class="ctx-sub">Vault mints an X.509 SVID for the attested host. Certificate carries SPIFFE ID as URI SAN.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Input</div>
      <div class="ctx-value">TPM-bound Vault token + SPIFFE role</div>
      <div class="ctx-sub">Role defines the SPIFFE ID template, TTL, and key algorithm. Token proves the host was TPM-attested.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Output</div>
      <div class="ctx-value">X.509 SVID — cert + private key + CA chain</div>
      <div class="ctx-sub">Short-lived. Auto-renewed by Vault Agent. URI SAN carries the SPIFFE ID. CA chain validates against the hosted trust bundle.</div>
    </div>
  </div>
  <div class="journey-steps">
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Issued</div>
      <div class="journey-step-title">X.509 SVID minted — SPIFFE ID in URI SAN</div>
      <div class="journey-step-body">
        Certificate summary: subject, URI SAN (SPIFFE ID), issuer, key algorithm, expiry, and serial.
        Private key written to agent's configured path. CA chain included for chain-of-trust verification.
        <code class="step-code">Subject: CN=gcp-instance-a3f7
URI SAN: spiffe://corp.example/on-prem/gcp-instance-a3f7
Issuer:  CN=Vault SPIFFE CA, O=corp.example
Key:     EC P-256
Expiry:  +1h</code>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Details</div>
      <div class="journey-step-title">Full certificate inspection view</div>
      <div class="journey-step-body">
        Extended view: key usage flags, cA=false confirmation, full issuer chain, trust bundle URL.
        Security engineers use this view to confirm spec compliance without parsing PEM manually.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">cA=false on leaf cert</span>
        <span class="step-tag">Key usage: digitalSignature + serverAuth + clientAuth</span>
        <span class="step-tag">Exactly one URI SAN</span>
      </div>
    </div>
  </div>
</div>

<div class="persona-panel fade-target" id="uc2-step-mtls">
  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Step</div>
      <div class="ctx-value">mTLS Service Mesh</div>
      <div class="ctx-sub">On-prem workload presents X.509 SVID in mTLS handshake. Peer validates against Vault trust bundle.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Input</div>
      <div class="ctx-value">X.509 SVID (client certificate)</div>
      <div class="ctx-sub">Peer fetches Vault trust bundle once, caches locally. Validation is offline — Vault not called at handshake time.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Output</div>
      <div class="ctx-value">Mutual TLS session established — or handshake rejected</div>
      <div class="ctx-sub">Peer identity confirmed by SPIFFE ID in URI SAN. No shared secret. No runtime Vault call.</div>
    </div>
  </div>
  <div class="journey-steps">
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Handshake</div>
      <div class="journey-step-title">mTLS handshake in progress</div>
      <div class="journey-step-body">Both sides present X.509 SVIDs. Each validates the other's certificate against its locally cached trust bundle.</div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Verified</div>
      <div class="journey-step-title">mTLS established — both SPIFFE IDs confirmed</div>
      <div class="journey-step-body">
        Connection summary: local SPIFFE ID, peer SPIFFE ID, cipher suite, trust bundle version used.
        No static credential exchanged at any point.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Envoy</span>
        <span class="step-tag">Istio</span>
        <span class="step-tag">gRPC mTLS</span>
        <span class="step-tag">Offline validation</span>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Failed</div>
      <div class="journey-step-title">Handshake rejected — trust bundle mismatch or expired SVID</div>
      <div class="journey-step-body">
        Failure reason is specific: expired cert, CA not in trust bundle, or SPIFFE ID format invalid.
        Fails closed — no session established on any validation error.
      </div>
    </div>
  </div>
</div>

<div class="persona-panel fade-target" id="uc2-step-auth">
  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Step</div>
      <div class="ctx-value">Vault SPIFFE Auth</div>
      <div class="ctx-sub">Workload presents X.509 SVID to Vault SPIFFE auth method on another cluster.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Input</div>
      <div class="ctx-value">X.509 SVID (issued by this or a federated cluster)</div>
      <div class="ctx-sub">Vault SPIFFE auth validates the SVID against the trust bundle, maps SPIFFE ID to entity alias, enforces policy.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Output</div>
      <div class="ctx-value">Vault token scoped to entity policy — or dynamic cloud credential</div>
      <div class="ctx-sub">Identity portable: the SVID issued by one Vault is accepted as auth on another Vault.</div>
    </div>
  </div>
  <div class="journey-steps">
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Request</div>
      <div class="journey-step-title">SVID presented to SPIFFE auth method</div>
      <div class="journey-step-body">Vault validates SVID signature, checks SPIFFE ID against allowed patterns, maps to entity alias.</div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Granted</div>
      <div class="journey-step-title">SPIFFE auth succeeded — Vault token issued</div>
      <div class="journey-step-body">
        Token is scoped to the entity's policy. The SPIFFE ID is the only credential presented.
        No AppRole, no userpass, no static token bootstrap.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Cross-cluster identity</span>
        <span class="step-tag">SPIFFE ID → entity alias → policy</span>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: DynamicCredential</div>
      <div class="journey-step-title">SVID exchanged for dynamic cloud credential</div>
      <div class="journey-step-body">
        Workload presents SVID, receives short-lived AWS/GCP/Azure credential from Vault's cloud secrets engine.
        The SPIFFE ID is the only identity thread. No static cloud key on the host.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">AWS STS</span>
        <span class="step-tag">GCP service account key</span>
        <span class="step-tag">Azure managed identity token</span>
      </div>
    </div>
  </div>
</div>

<!-- UC3 -->
<div class="journey-section fade-target" id="uc3-kubernetes-workloads" style="margin-top: 2rem;">
  <div class="journey-section-header">
    <div class="journey-section-label">Use Case 3</div>
    <div class="journey-section-intro">
      <p>Kubernetes Workloads — K8s service account to X.509 SVID to Istio mTLS mesh.</p>
      <p>Kubernetes workloads authenticate to Vault using their service account token. Vault Agent
         writes the X.509 SVID to a filesystem path. The Istio sidecar reads the SVID and presents
         it in every mTLS connection within the mesh. The trust bundle is distributed from Vault's
         hosted endpoint — no separate Istio CA, no SPIRE server required.</p>
    </div>
  </div>
</div>

<div class="persona-tabs" id="uc3-steps-tabs">
  <div class="persona-tab active" onclick="switchUc3Step('uc3-step-k8s')">1. K8s Auth</div>
  <div class="persona-tab" onclick="switchUc3Step('uc3-step-fs')">2. SVID to Filesystem</div>
  <div class="persona-tab" onclick="switchUc3Step('uc3-step-istio')">3. Istio mTLS</div>
  <div class="persona-tab" onclick="switchUc3Step('uc3-step-bundle')">4. Trust Bundle</div>
</div>

<div class="persona-panel active fade-target" id="uc3-step-k8s">
  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Step</div>
      <div class="ctx-value">Kubernetes Auth</div>
      <div class="ctx-sub">Pod presents its projected service account token. Vault validates against the cluster's OIDC endpoint.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Input</div>
      <div class="ctx-value">K8s projected service account JWT</div>
      <div class="ctx-sub">Token is audience-scoped to Vault. Vault validates signature and service account binding. No static secret on the pod.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Output</div>
      <div class="ctx-value">Vault token mapped to K8s service account entity</div>
      <div class="ctx-sub">Entity alias carries namespace, service account name, and pod labels. SPIFFE ID template resolves from these.</div>
    </div>
  </div>
  <div class="journey-steps">
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: TokenPresented</div>
      <div class="journey-step-title">Service account token validated against K8s OIDC</div>
      <div class="journey-step-body">
        Vault calls the K8s TokenReview API to validate the projected token. Binds to namespace and service account.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Projected SA token</span>
        <span class="step-tag">Audience: Vault</span>
        <span class="step-tag">No static secret in pod spec</span>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Bound</div>
      <div class="journey-step-title">Auth bound — entity alias created from service account metadata</div>
      <div class="journey-step-body">
        Entity alias carries: namespace, service account name. SPIFFE ID template resolves to
        <code>spiffe://corp.example/k8s/payments/payments-processor</code>.
        Ready to mint X.509 SVID.
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: UnboundSA</div>
      <div class="journey-step-title">Service account not bound to a Vault role — specific error</div>
      <div class="journey-step-body">
        Vault returns the namespace and service account name that failed binding. Platform engineer sees exactly
        which service account needs a role created or updated.
      </div>
    </div>
  </div>
</div>

<div class="persona-panel fade-target" id="uc3-step-fs">
  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Step</div>
      <div class="ctx-value">SVID to Filesystem</div>
      <div class="ctx-sub">Vault Agent mounts X.509 SVID files into the pod at the configured path.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Input</div>
      <div class="ctx-value">Vault Agent template config pointing to SPIFFE role</div>
      <div class="ctx-sub">Agent handles auth, minting, renewal, and file write. Workload reads files — no Vault SDK in the application.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Output</div>
      <div class="ctx-value">tls.crt + tls.key at configured path</div>
      <div class="ctx-sub">Istio sidecar reads from this path. File is replaced atomically on renewal. No restart required.</div>
    </div>
  </div>
  <div class="journey-steps">
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Empty</div>
      <div class="journey-step-title">Mount path exists — no SVID files yet</div>
      <div class="journey-step-body">
        Vault Agent has not yet completed its first mint cycle. The path is present but empty.
        Istio sidecar is waiting for files before accepting connections.
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Written</div>
      <div class="journey-step-title">SVID files written — Istio sidecar picks up immediately</div>
      <div class="journey-step-body">
        <code>tls.crt</code> and <code>tls.key</code> present at the configured path.
        File sizes and modification times confirm freshness. Auto-renewal is active — next renewal at TTL - 10%.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Atomic file write</span>
        <span class="step-tag">Auto-renewal active</span>
        <span class="step-tag">No pod restart on renewal</span>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: PermissionDenied</div>
      <div class="journey-step-title">Write failed — filesystem permission error</div>
      <div class="journey-step-body">
        Vault Agent received the SVID but could not write to the configured path.
        Error surfaces the path, the UID/GID of the agent process, and the required permissions.
      </div>
    </div>
  </div>
</div>

<div class="persona-panel fade-target" id="uc3-step-istio">
  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Step</div>
      <div class="ctx-value">Istio mTLS</div>
      <div class="ctx-sub">Istio sidecar uses Vault-issued X.509 SVIDs for all mesh traffic. No Istio CA required.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Input</div>
      <div class="ctx-value">X.509 SVID at configured filesystem path</div>
      <div class="ctx-sub">Istio reads cert and key files. Replaces its self-signed identity with the Vault-issued SVID. Validates peers against Vault trust bundle.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Output</div>
      <div class="ctx-value">All mesh connections mTLS with SPIFFE-certified identities</div>
      <div class="ctx-sub">Peer SPIFFE IDs visible in Istio telemetry. Trust boundary is the Vault trust domain, not the Istio mesh boundary.</div>
    </div>
  </div>
  <div class="journey-steps">
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: MeshPeers</div>
      <div class="journey-step-title">Mesh peers — SVID status per service</div>
      <div class="journey-step-body">
        Table shows each mesh peer with its SPIFFE ID, SVID expiry, and last handshake result.
        Services without a SVID are flagged but not broken — they fall back to token auth.
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: AllVerified</div>
      <div class="journey-step-title">All peers verified — mesh is fully SPIFFE-certified</div>
      <div class="journey-step-body">
        Every service in the mesh presents a valid Vault-issued SVID. All mTLS handshakes verified
        against the same trust bundle. Banner confirms no static credential in any connection.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Full mesh mTLS</span>
        <span class="step-tag">Single trust domain</span>
        <span class="step-tag">No Istio CA</span>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: TrustMismatch</div>
      <div class="journey-step-title">Trust bundle mismatch — connection blocked</div>
      <div class="journey-step-body">
        One or more peers hold an SVID signed by a CA no longer in the trust bundle (post-rotation, stale).
        Blocked connections are named specifically. Vault Agent auto-renews — resolution is waiting for renewal cycle.
      </div>
    </div>
  </div>
</div>

<div class="persona-panel fade-target" id="uc3-step-bundle">
  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Step</div>
      <div class="ctx-value">Trust Bundle Distribution</div>
      <div class="ctx-sub">Vault hosts the trust bundle. All mesh participants fetch it once and cache locally.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Input</div>
      <div class="ctx-value">Bundle endpoint URL (no Vault token required)</div>
      <div class="ctx-sub">Tokenless fetch. Any SPIFFE-aware consumer can retrieve and cache the bundle without Vault credentials.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Output</div>
      <div class="ctx-value">JSON bundle with X.509 CA public keys — or federation partner bundle</div>
      <div class="ctx-sub">Single endpoint per mount. Federation partners fetch each other's bundles to enable cross-trust-domain mTLS.</div>
    </div>
  </div>
  <div class="journey-steps">
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Live</div>
      <div class="journey-step-title">Trust bundle live — CA keys served, tokenless</div>
      <div class="journey-step-body">
        Bundle endpoint returns JSON with X.509 CA public keys. Key count, last updated timestamp,
        and cache-control header confirm freshness. Any SPIFFE-aware service fetches and caches.
        <code class="step-code">curl https://vault.corp.example/v1/spiffe/bundle
# Returns: { "keys": [...], "spiffe_refresh_hint": 3600 }</code>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: FederationPartner</div>
      <div class="journey-step-title">Cross-trust-domain federation — two Vault clusters</div>
      <div class="journey-step-body">
        Platform engineer registers a federation partner by pointing to the partner Vault's bundle endpoint.
        Vault fetches the partner's bundle, caches it, and adds it to its trust set.
        SVIDs from the partner cluster are now valid in mTLS connections within this trust domain.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">SPIFFE federation bundle endpoint spec</span>
        <span class="step-tag">Cross-cluster mTLS</span>
        <span class="step-tag">Bundle auto-refresh</span>
      </div>
    </div>
    <div class="journey-step fade-target">
      <div class="journey-step-num">State: Stale</div>
      <div class="journey-step-title">Bundle stale — refresh hint exceeded</div>
      <div class="journey-step-body">
        Consumers that have not refreshed past the hint window are flagged. The bundle endpoint
        is still live — the warning is surfaced in the UI for platform engineers monitoring bundle health.
        Stale consumers will fail mTLS after CA rotation if they do not refresh.
      </div>
    </div>
  </div>
</div>


<div class="journey-section fade-target" id="user-journey">
  <div class="journey-section-header">
    <div class="journey-section-label">User Journey</div>
    <div class="journey-section-intro">
      <p>Three personas interact with X.509 SVID minting at different points.
         Their jobs do not overlap, but each depends on the previous one completing correctly.</p>
      <p>The Platform Engineer provisions the engine once. The App Developer mints SVIDs
         on demand. The Security Engineer audits the result. Select a persona below to walk
         through their full journey.</p>
    </div>
  </div>
</div>

<!-- Persona tab bar -->
<div class="persona-tabs" id="persona-tabs">
  <div class="persona-tab active" onclick="switchPersona('pe')">Platform Engineer</div>
  <div class="persona-tab" onclick="switchPersona('dev')">App Developer</div>
  <div class="persona-tab" onclick="switchPersona('sec')">Security Engineer</div>
</div>

<!-- ── PLATFORM ENGINEER ── -->
<div class="persona-panel active fade-target" id="panel-pe">

  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Persona</div>
      <div class="ctx-value">Platform Engineer</div>
      <div class="ctx-sub">Administers Vault. Owns the SPIFFE Secrets Engine and trust domain configuration.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Job to be done</div>
      <div class="ctx-value">One workload identity solution — not one per infra type</div>
      <div class="ctx-sub">Provide a common path for app teams to establish workload identity without rebuilding it for each cloud or platform.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Starting state</div>
      <div class="ctx-value">Vault cluster running. Auth methods configured (k8s, AWS, cert). No SPIFFE Secrets Engine yet.</div>
      <div class="ctx-sub">May already have a PKI engine. No SPIRE server in the org.</div>
    </div>
  </div>

  <div class="journey-steps">

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 1</div>
      <div class="journey-step-title">Enable the SPIFFE Secrets Engine</div>
      <div class="journey-step-body">
        The platform engineer mounts a new SPIFFE Secrets Engine instance. Each mount is
        one trust domain — a logical boundary for SVID issuance and trust bundle hosting.
        Multiple app teams can share one mount or each have their own, depending on isolation requirements.
        <code class="step-code">vault secrets enable -path=spiffe spiffe</code>
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">UI path: Secrets &rsaquo; Enable engine &rsaquo; SPIFFE</span>
        <span class="step-tag">CLI</span>
        <span class="step-tag">API</span>
      </div>
    </div>

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 2</div>
      <div class="journey-step-title">Configure the trust domain and PKI backing</div>
      <div class="journey-step-body">
        The trust domain name (<code>spiffe://corp.example</code>) is the namespace for all SVIDs issued from
        this mount. The platform engineer sets it once — it cannot be changed without
        re-issuing all SVIDs. The engine is backed by an existing Vault PKI secrets engine,
        which provides the signing CA. X.509 minting configuration is separate from JWT
        minting: the UI and docs surface only the fields each type requires.
        <code class="step-code">vault write spiffe/config \
  trust_domain=corp.example \
  x509_issuer_path=pki/issuer/default \
  bundle_refresh_hint=3600</code>
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Trust domain is immutable after first SVID issuance</span>
        <span class="step-tag">Backed by Vault PKI engine</span>
      </div>
      <div class="step-branch">
        <div class="step-branch-label">If metadata is invalid</div>
        <p>The engine creation fails with a specific error identifying which fields are missing or
        incorrect. The trust bundle is not created or updated. Failure is at configuration time, not at minting time.</p>
      </div>
    </div>

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 3</div>
      <div class="journey-step-title">Create a role for X.509 minting</div>
      <div class="journey-step-body">
        Roles define the SPIFFE ID path template, TTL, and key algorithm for a class of workloads.
        A platform engineer creates one or more roles — one per workload family, team, or environment.
        The role enforces the SPIFFE spec constraints: exactly one URI SAN, correct key usage, leaf-cert
        CA field set to false. Operators only see the fields the spec requires for X.509 issuance.
        <code class="step-code">vault write spiffe/role/k8s-worker \
  spiffe_id_template="spiffe://corp.example/k8s/{{.entity.aliases.kubernetes.metadata.service_account}}" \
  ttl=1h \
  key_algorithm=EC \
  key_bits=256</code>
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Template interpolates Vault entity metadata</span>
        <span class="step-tag">TTL enforced — no long-lived SVIDs</span>
      </div>
    </div>

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 4</div>
      <div class="journey-step-title">Attach an auth method and set policy</div>
      <div class="journey-step-body">
        Existing Vault auth methods (Kubernetes, AWS, cert auth) provide the attestation.
        The platform engineer maps the auth method to a Vault policy that grants
        <strong>spiffe/role/&lt;name&gt;/mint</strong> for the relevant roles.
        No new attestation infrastructure. The auth methods already configured for secrets access
        are reused for SVID minting.
        <code class="step-code">vault policy write workload-identity - &lt;&lt;EOF
path "spiffe/role/k8s-worker/mintx509" {
  capabilities = ["update"]
}
EOF</code>
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Reuses existing auth methods</span>
        <span class="step-tag">Standard Vault HCL policy</span>
      </div>
    </div>

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 5</div>
      <div class="journey-step-title">Verify trust bundle is live and replicated</div>
      <div class="journey-step-body">
        Once the engine is configured and the first role exists, the trust bundle endpoint is
        available at a tokenless URL. The platform engineer verifies it returns the correct CA
        certificate and JWKS keys, confirms the endpoint is reachable from the environments
        that will validate SVIDs (Envoy sidecars, cloud IAM, other Vault clusters), and confirms
        that the secondary cluster's performance replica also serves the same bundle.
        <code class="step-code">curl https://vault.corp.example/v1/spiffe/bundle \
  | jq '.keys | length'   # should be ≥ 1</code>
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">No Vault token required to fetch bundle</span>
        <span class="step-tag">Returns 404 for non-existent mounts</span>
        <span class="step-tag">Perf replication</span>
      </div>
    </div>

  </div>

  <div class="journey-outcome fade-target">
    <div class="outcome-marker">Outcome</div>
    <div class="outcome-body">
      <p>Engine is ready to issue X.509 SVIDs to any workload that can authenticate to Vault.</p>
      <p>App teams receive a role name, a trust domain, and the trust bundle URL.
         They do not need to understand SPIFFE internals or operate a SPIRE server.
         The platform engineer's job is done until a role change or CA rotation is needed.</p>
      <p>CA rotation is handled automatically: the trust bundle will contain both old and new
         CA keys until all SVIDs signed by the prior key have expired.</p>
    </div>
  </div>

</div>

<!-- ── APP DEVELOPER / WORKLOAD OWNER ── -->
<div class="persona-panel fade-target" id="panel-dev">

  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Persona</div>
      <div class="ctx-value">App Developer / Workload Owner</div>
      <div class="ctx-sub">Builds services that need cryptographic identity. Does not manage Vault, but calls it.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Job to be done</div>
      <div class="ctx-value">Prove workload identity across infrastructure without managing it per service</div>
      <div class="ctx-sub">Use X.509 SVIDs for mTLS without owning a CA, without writing custom trust bundle code, and without a SPIRE deployment.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Starting state</div>
      <div class="ctx-value">A role exists. Auth method configured. Trust bundle URL known. Workload can authenticate to Vault.</div>
      <div class="ctx-sub">May use Vault Agent, the CLI, or an SDK. Services run on Kubernetes or VMs.</div>
    </div>
  </div>

  <div class="journey-steps">

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 1</div>
      <div class="journey-step-title">Workload authenticates to Vault</div>
      <div class="journey-step-body">
        The workload logs in using its existing auth method — Kubernetes service account token,
        AWS instance identity, or a TPM-bound certificate (M1+). This is the attestation step.
        Vault verifies the credential against the configured auth method and maps the caller
        to a Vault Identity entity. No human in the loop. No static secret pre-placed on the host.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Kubernetes SA</span>
        <span class="step-tag">AWS IAM</span>
        <span class="step-tag">TPM cert (M1+)</span>
        <span class="step-tag">Cert auth</span>
      </div>
    </div>

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 2</div>
      <div class="journey-step-title">Request an X.509 SVID for the role</div>
      <div class="journey-step-body">
        With a valid Vault token, the workload calls the SPIFFE Secrets Engine mint endpoint.
        The role template resolves the SPIFFE ID from the entity's metadata — for a Kubernetes
        workload, that becomes <strong>spiffe://corp.example/k8s/payments-processor</strong>.
        The engine returns a certificate (PEM), its private key, and the signing CA chain.
        <code class="step-code">vault write spiffe/role/k8s-worker/mintx509
# returns:
# certificate    -----BEGIN CERTIFICATE-----...
# private_key    -----BEGIN EC PRIVATE KEY-----...
# ca_chain       [signing CA PEM]
# spiffe_id      spiffe://corp.example/k8s/payments-processor
# expiration     1753209600</code>
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Short-lived — TTL from role config</span>
        <span class="step-tag">URI SAN = SPIFFE ID</span>
        <span class="step-tag">ECDSA P-256 or RSA-2048</span>
      </div>
      <div class="step-branch">
        <div class="step-branch-label">If auth metadata is insufficient for template</div>
        <p>The mint call returns a specific error identifying which metadata is missing.
        The platform engineer receives the field name so they can update the auth method mapping.
        No generic failure — the error is actionable.</p>
      </div>
    </div>

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 3 — Vault Agent path</div>
      <div class="journey-step-title">Use Vault Agent to fetch and rotate the SVID automatically</div>
      <div class="journey-step-body">
        Most workloads use Vault Agent rather than calling the API directly. The agent handles
        login, minting, local caching, and renewal before expiry. The workload reads the SVID
        from a local file or memory sink — it never calls Vault itself.
        <code class="step-code"># vault-agent.hcl (relevant block)
template {
  contents = "{{ with secret \"spiffe/role/k8s-worker/mintx509\" }}{{ .Data.certificate }}{{ end }}"
  destination = "/run/spiffe/tls.crt"
}
template {
  contents = "{{ with secret \"spiffe/role/k8s-worker/mintx509\" }}{{ .Data.private_key }}{{ end }}"
  destination = "/run/spiffe/tls.key"
}</code>
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Vault Agent</span>
        <span class="step-tag">Auto-renewal before TTL expires</span>
        <span class="step-tag">Workload reads local file — no Vault calls</span>
      </div>
    </div>

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 4</div>
      <div class="journey-step-title">Present SVID in an mTLS handshake</div>
      <div class="journey-step-body">
        The workload presents its X.509 SVID as its TLS client certificate. The receiving service
        validates it against Vault's trust bundle — which it fetched once and cached locally.
        Vault is not called at validation time. The verification is purely cryptographic:
        the SVID's signature chains to a CA in the trust bundle, and the URI SAN carries
        a recognizable SPIFFE ID. No shared secret. No runtime lookup.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Envoy</span>
        <span class="step-tag">Istio</span>
        <span class="step-tag">gRPC mTLS</span>
        <span class="step-tag">Any TLS stack that reads a URI SAN</span>
      </div>
    </div>

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 5 — Cloud IAM path</div>
      <div class="journey-step-title">Exchange SVID for cloud credentials (on-prem workload accessing AWS/GCP/Azure)</div>
      <div class="journey-step-body">
        An on-prem workload with a Vault-issued JWT-SVID can exchange it with a cloud IAM
        system configured to trust Vault's OIDC endpoint. The cloud IAM validates the SVID
        against Vault's published trust bundle, and issues short-lived cloud-native credentials.
        <strong>No static cloud credential on the host.</strong>
        <code class="step-code"># AWS IAM Roles Anywhere validates x509-SVID against Vault trust anchor
# GCP Workload Identity Federation validates JWT-SVID against Vault OIDC endpoint
# Azure Workload Identity validates JWT-SVID against Vault JWKS</code>
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">AWS IAM Roles Anywhere</span>
        <span class="step-tag">GCP Workload Identity Federation</span>
        <span class="step-tag">Azure Workload Identity</span>
      </div>
    </div>

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 6</div>
      <div class="journey-step-title">Use SVID to authenticate back to Vault for secrets</div>
      <div class="journey-step-body">
        The workload can also present its X.509 or JWT SVID to the Vault SPIFFE Auth Method on
        another Vault cluster — exchanging it for a Vault token scoped to that cluster's secrets.
        This closes the loop: the identity Vault issued is accepted as auth credential back
        into Vault. One portable identity, both for service-to-service mTLS and for secrets access.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">SPIFFE Auth Method (consumer side)</span>
        <span class="step-tag">Cross-cluster federation</span>
      </div>
    </div>

  </div>

  <div class="journey-outcome fade-target">
    <div class="outcome-marker">Outcome</div>
    <div class="outcome-body">
      <p>The workload has a short-lived, auto-rotating X.509 SVID. It never holds a static credential.</p>
      <p>mTLS with other services works without custom CA management. Cloud access works without
         static cloud credentials. Vault secrets access works without a separate bootstrap secret.
         The SPIFFE ID is the single portable identity thread through all three.</p>
    </div>
  </div>

</div>

<!-- ── SECURITY ENGINEER ── -->
<div class="persona-panel fade-target" id="panel-sec">

  <div class="persona-context">
    <div class="persona-context-cell">
      <div class="ctx-label">Persona</div>
      <div class="ctx-value">Security Engineer</div>
      <div class="ctx-sub">Responsible for compliance and NHI security posture. Does not mint SVIDs, but audits and governs them.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Job to be done</div>
      <div class="ctx-value">Verify that only authorized workloads hold SVIDs — and that none hold them too long</div>
      <div class="ctx-sub">Audit issuance events, enforce TTL policy, and investigate failures or anomalies without needing access to private key material.</div>
    </div>
    <div class="persona-context-cell">
      <div class="ctx-label">Starting state</div>
      <div class="ctx-value">SPIFFE engine running. SVIDs being minted. Vault audit log enabled.</div>
      <div class="ctx-sub">Needs visibility into: who minted what, with which auth method, for how long, and whether it succeeded or failed.</div>
    </div>
  </div>

  <div class="journey-steps">

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 1</div>
      <div class="journey-step-title">Audit the SVID issuance log</div>
      <div class="journey-step-body">
        Every SVID minting attempt — successful or failed — produces an auditable event in Vault's
        audit log. The event records: requesting entity, trust domain, SVID type (X.509 or JWT),
        auth method used, TTL granted, and the outcome. Private key material is never present in
        the audit log. The security engineer queries these events to verify that only expected
        workloads are receiving SVIDs.
        <code class="step-code"># Audit log entry (abbreviated)
{
  "type": "response",
  "auth": { "entity_id": "...", "display_name": "k8s/payments-processor" },
  "request": { "path": "spiffe/role/k8s-worker/mintx509", "operation": "update" },
  "response": {
    "data": {
      "spiffe_id": "spiffe://corp.example/k8s/payments-processor",
      "svid_type": "x509",
      "auth_method": "kubernetes",
      "ttl": 3600,
      "expiration": 1753209600
    }
  }
}</code>
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">No private key in audit log</span>
        <span class="step-tag">Entity + auth method + SVID type + TTL per event</span>
      </div>
    </div>

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 2</div>
      <div class="journey-step-title">Enforce TTL through role review</div>
      <div class="journey-step-body">
        The security engineer reviews role configurations to confirm TTLs are within policy.
        Any workload holding an X.509 SVID beyond the approved maximum TTL is a compliance finding.
        Because all SVIDs are short-lived by construction — the role cannot be configured to issue
        a certificate without a TTL — there is no path to a long-lived credential without changing
        the role definition, which is itself an audited event.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">TTL enforced at role level</span>
        <span class="step-tag">Role changes are audited</span>
        <span class="step-tag">No TTL = no issuance</span>
      </div>
    </div>

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 3</div>
      <div class="journey-step-title">Investigate a failed SVID issuance</div>
      <div class="journey-step-body">
        When a mint call fails, the audit log records the entity, the trust domain, the auth method,
        and the failure reason — not just a generic rejection. Common failure reasons: insufficient
        metadata for the SPIFFE ID template, unauthorized role, or a workload using an auth method
        not mapped to the relevant policy. The security engineer can distinguish an unauthorized access
        attempt from a configuration problem.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Failure reason in audit log</span>
        <span class="step-tag">Distinguishes unauthorized vs. misconfigured</span>
      </div>
    </div>

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 4 — Ongoing</div>
      <div class="journey-step-title">Verify no untrusted SVIDs in production</div>
      <div class="journey-step-body">
        An SVID not issued by a CA in the trust bundle will fail validation at the receiving service —
        the mTLS handshake rejects it. The security engineer can confirm this property holds by
        checking that the trust bundle endpoint returns only the expected CA keys. If an SVID from an
        unknown CA appears in traffic, it fails closed. There is no configuration that makes Vault
        accept SVIDs from an unknown issuer.
        <code class="step-code"># Negative: SVID from unknown CA fails validation
# Trust bundle only contains CAs registered to this mount
# A request for another mount's bundle returns 404 — no cross-mount leakage</code>
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Fails closed on unknown CA</span>
        <span class="step-tag">Mount isolation: 404 for non-existent mounts</span>
        <span class="step-tag">No cross-mount bundle leakage</span>
      </div>
    </div>

    <div class="journey-step fade-target">
      <div class="journey-step-num">Step 5</div>
      <div class="journey-step-title">CA rotation — no manual re-issuance required</div>
      <div class="journey-step-body">
        When Vault rotates the signing CA, the trust bundle is automatically updated to contain
        both the old and new CA public keys. Existing SVIDs continue to validate against the old key
        until they expire. New SVIDs are signed by the new key and validate against it.
        There is no window where SVIDs fail validation. The security engineer does not need to
        coordinate a re-issuance campaign.
      </div>
      <div class="journey-step-meta">
        <span class="step-tag">Old and new CA keys coexist in bundle during rotation</span>
        <span class="step-tag">No validation window gap</span>
        <span class="step-tag">Automatic — no manual steps</span>
      </div>
    </div>

  </div>

  <div class="journey-outcome fade-target">
    <div class="outcome-marker">Outcome</div>
    <div class="outcome-body">
      <p>Every SVID is accounted for: who, what type, which auth method, how long.</p>
      <p>The security engineer can answer "show me every X.509 SVID minted in the last 24 hours
         and which workload identity holds each one" from the Vault audit log alone.
         No private key material is exposed. CA rotation is operationally free.</p>
    </div>
  </div>

</div>

<!-- =========== CROSS-PERSONA HANDOFF =========== -->
<div class="journey-handoff fade-target" id="journey-handoff">
  <div class="story" style="padding-bottom:1rem;">
    <div class="story-label">How it connects</div>
    <div class="story-body">
      <p>The three journeys are sequential. Each persona hands something to the next.</p>
    </div>
  </div>
  <div style="padding: 0 2rem; max-width:1200px; margin: 0 auto;">
    <div class="handoff-grid">
      <div class="handoff-cell">
        <div class="hc-persona">Platform Engineer</div>
        <div class="hc-title">Hands off: a ready engine</div>
        <div class="hc-body">Trust domain configured. Role created with correct SPIFFE ID template and TTL.
        Auth method mapped to policy. Trust bundle live and verified. App teams get a role name and bundle URL — nothing else.</div>
      </div>
      <div class="handoff-arrow">&rarr;</div>
      <div class="handoff-cell">
        <div class="hc-persona">App Developer</div>
        <div class="hc-title">Hands off: a live workload with an SVID</div>
        <div class="hc-body">Vault Agent minting and renewing the X.509 SVID automatically.
        Service participating in mTLS. Identity portable to cloud IAM and other Vault clusters.
        No static credential anywhere in the chain.</div>
      </div>
      <div class="handoff-arrow">&rarr;</div>
      <div class="handoff-cell">
        <div class="hc-persona">Security Engineer</div>
        <div class="hc-title">Gets: a complete audit trail</div>
        <div class="hc-body">Every issuance event recorded. TTL enforced. Failed attempts logged with reason.
        CA rotation handled automatically. Trust bundle mount isolation holds.
        Compliance report is the audit log.</div>
      </div>
    </div>
  </div>
</div>
`;

export const config: ShowcaseConfig = {
  title: 'X.509 SVID Minting in the SPIFFE Secrets Engine',
  subtitle:
    'VLT-515 — Extending Vault\'s SPIFFE Secrets Engine to issue X.509 SVIDs and host a conformant trust bundle, completing Vault\'s identity provider story for the certificate path.',
  meta: {
    pdr: 'VLT-515',
    date: 'July 2026',
  },
  outputName: '002.SpiffeX509Minting-Draft02',
  theme: 'grayscale',
  preamble,
  preambleNav: [
    { id: 'the-job',                label: 'The Job' },
    { id: 'the-solution',           label: 'The Solution' },
    { id: 'principles',             label: 'Design Principles' },
    { id: 'milestone-arc',          label: 'Milestone Arc' },
    { id: 'requirements-intro',     label: 'PRD Requirements' },
    { id: 'user-journey',           label: 'User Journey' },
    { id: 'journey-handoff',        label: 'How it Connects' },
    { id: 'uc1-agentic-identity',   label: 'UC1 — Agentic Identity' },
    { id: 'uc2-infra-attestation',  label: 'UC2 — Infra Attestation' },
    { id: 'uc3-kubernetes-workloads', label: 'UC3 — Kubernetes Workloads' },
    { id: 'pe-prototype',           label: 'PE Prototype' },
  ],
  sections: [
    /* ── UC1: Agentic Identity ─────────────────────────────────── */
    {
      id: 'uc1-attestation',
      title: 'UC1 — Node Attestation',
      subtitle: 'Agent presents cloud metadata. Vault validates identity claim against registered nodes.',
      stageNumber: 'UC1 — Step 1',
      states: {
        'Attesting':           AgentAttestationAttesting,
        'Node identity issued': AgentAttestationNodeIdentityIssued,
        'Attestation failed':  AgentAttestationFailed,
      },
      annotation: `
        <div class="ann-block">
          <h3>No pre-placed credential</h3>
          <p>The agent presents cloud instance metadata — not a Vault token, not an AppRole secret. Identity is derived from the infrastructure the agent runs on.</p>
        </div>
        <div class="ann-block">
          <h3>Failed state</h3>
          <p>If the node is not in the agent registry, the error names the node ID and the resolution command. Not a generic 403.</p>
        </div>
      `,
    },
    {
      id: 'uc1-svid-issuance',
      title: 'UC1 — JWT-SVID Issuance',
      subtitle: 'Vault mints a short-lived JWT carrying the agent\'s SPIFFE ID.',
      stageNumber: 'UC1 — Step 2',
      states: {
        'SVID issued':  JwtSvidIssued,
        'SVID expired': JwtSvidExpired,
      },
      annotation: `
        <div class="ann-block">
          <h3>Short-lived by design</h3>
          <p>TTL is set at the role level. Vault Agent renews before expiry. The agent never holds a static credential.</p>
        </div>
        <div class="ann-block">
          <h3>Expired state</h3>
          <p>Surfaces the last-known expiry time and Vault connectivity as the likely cause. Workload is blocked — not silently using a stale SVID.</p>
        </div>
      `,
    },
    {
      id: 'uc1-token-exchange',
      title: 'UC1 — Token Exchange',
      subtitle: 'JWT-SVID exchanged at the Authorization Server for a scoped OAuth JWT.',
      stageNumber: 'UC1 — Step 3',
      states: {
        'Request':          TokenExchangeRequest,
        'OAuth JWT minted': TokenExchangeOAuthJwtMinted,
        'Denied':           TokenExchangeDenied,
      },
      annotation: `
        <div class="ann-block">
          <h3>RFC 8693 token exchange</h3>
          <p>The SVID is consumed at the Authorization Server. Only the scoped OAuth JWT crosses further service boundaries. The SVID is not forwarded.</p>
        </div>
        <div class="ann-block">
          <h3>Denied state</h3>
          <p>Returns the specific SPIFFE ID that failed. No fallback credential is issued. The agent is blocked until the SPIFFE ID is registered.</p>
        </div>
      `,
    },
    {
      id: 'uc1-vault-resource',
      title: 'UC1 — Vault Resource Request',
      subtitle: 'Agent presents OAuth JWT to Vault resource server. Receives only the secrets its policy permits.',
      stageNumber: 'UC1 — Step 4',
      states: {
        'Pending':          VaultResourceRequestPending,
        'Secret delivered': VaultResourceSecretDelivered,
        'Policy denied':    VaultResourcePolicyDenied,
      },
      annotation: `
        <div class="ann-block">
          <h3>Tokenless Vault resource server</h3>
          <p>No Vault token is held by the agent at any point. The chain is: cloud metadata → SVID → OAuth JWT → secret. The OAuth JWT is the only credential presented to Vault.</p>
        </div>
        <div class="ann-block">
          <h3>Policy denied</h3>
          <p>Vault returns the denied path and the policy rule that blocked it. Operator does not need to reverse-engineer the policy from a generic 403.</p>
        </div>
      `,
    },
    {
      id: 'uc1-agent-registry',
      title: 'UC1 — Agent Registry',
      subtitle: 'Platform view of registered agents — SPIFFE IDs, attestation methods, last-seen timestamps.',
      stageNumber: 'UC1 — Step 5',
      states: {
        'Active':    AgentRegistryActive,
        'Suspended': AgentRegistrySuspended,
      },
      annotation: `
        <div class="ann-block">
          <h3>Fleet visibility</h3>
          <p>Platform engineer sees every registered agent: node ID, SPIFFE ID, attestation method, last seen. Stale entries are identifiable without hunting audit logs.</p>
        </div>
        <div class="ann-block">
          <h3>Suspension</h3>
          <p>Immediate effect. Future attestation from the node is rejected before a SVID is issued. Existing SVIDs expire at their TTL — no forced revocation gap.</p>
        </div>
      `,
    },

    /* ── UC2: Infra Attestation ─────────────────────────────────── */
    {
      id: 'uc2-ek-enrollment',
      title: 'UC2 — EK Enrollment',
      subtitle: 'Platform engineer registers a host\'s TPM Endorsement Key before provisioning.',
      stageNumber: 'UC2 — Step 1',
      states: {
        'Empty':      EkRegistryEmpty,
        'Registered': EkRegistered,
        'Conflict':   EkConflict,
      },
      annotation: `
        <div class="ann-block">
          <h3>Out-of-band enrollment</h3>
          <p>EK registration happens before the host is deployed. Only registered EKs can attest. Unregistered hosts are rejected at the attestation step — not at SVID issuance.</p>
        </div>
        <div class="ann-block">
          <h3>Conflict state</h3>
          <p>Attempting to register an existing EK returns the original enrollment record. Prevents silent overwrite of an existing host identity.</p>
        </div>
      `,
    },
    {
      id: 'uc2-tpm-attestation',
      title: 'UC2 — TPM Attestation',
      subtitle: 'Vault Agent presents a TPM 2.0 quote. Vault verifies against enrolled EK.',
      stageNumber: 'UC2 — Step 2',
      states: {
        'In progress': TpmAttestationInProgress,
        'Complete':    TpmAttestationComplete,
        'Failed':      TpmAttestationFailed,
      },
      annotation: `
        <div class="ann-block">
          <h3>Nonce challenge</h3>
          <p>Vault issues a time-bound nonce. The agent signs with the TPM Attestation Key. Stale quotes are rejected — replay attacks are blocked at the challenge layer.</p>
        </div>
        <div class="ann-block">
          <h3>Failed state</h3>
          <p>Returns which check failed: stale nonce, EK not enrolled, or quote mismatch. Platform engineer receives the specific EK fingerprint and failure type.</p>
        </div>
      `,
    },
    {
      id: 'uc2-x509-svid',
      title: 'UC2 — X.509 SVID Issued',
      subtitle: 'Vault mints an X.509 SVID for the TPM-attested host. SPIFFE ID in URI SAN.',
      stageNumber: 'UC2 — Step 3',
      states: {
        'Issued':  X509SvidIssued,
        'Details': X509SvidDetails,
      },
      annotation: `
        <div class="ann-block">
          <h3>Spec compliance visible</h3>
          <p>The details view confirms cA=false, exactly one URI SAN, correct key usage flags. Security engineers can verify spec compliance without parsing PEM manually.</p>
        </div>
        <div class="ann-block">
          <h3>Auto-renewal</h3>
          <p>Vault Agent replaces the SVID before TTL expires. The host never holds an expired certificate. CA rotation is handled automatically via trust bundle update.</p>
        </div>
      `,
    },
    {
      id: 'uc2-mtls',
      title: 'UC2 — mTLS Service Mesh',
      subtitle: 'On-prem workload presents X.509 SVID in mTLS handshake. Peer validates offline.',
      stageNumber: 'UC2 — Step 4',
      states: {
        'Handshake': MtlsHandshake,
        'Verified':  MtlsVerified,
        'Failed':    MtlsFailed,
      },
      annotation: `
        <div class="ann-block">
          <h3>Offline validation</h3>
          <p>Peers fetch the trust bundle once and cache locally. Vault is not called at handshake time. The verification is purely cryptographic — no runtime Vault dependency.</p>
        </div>
        <div class="ann-block">
          <h3>Fails closed</h3>
          <p>Any validation error — expired cert, CA not in bundle, invalid SPIFFE ID format — blocks the connection. No fallback to unverified TLS.</p>
        </div>
      `,
    },
    {
      id: 'uc2-spiffe-auth',
      title: 'UC2 — Vault SPIFFE Auth',
      subtitle: 'Workload presents X.509 SVID to Vault SPIFFE auth method. Receives token or dynamic cloud credential.',
      stageNumber: 'UC2 — Step 5',
      states: {
        'Request':            VaultSpiffeAuthRequest,
        'Granted':            VaultSpiffeAuthGranted,
        'Dynamic credential': VaultSpiffeDynamicCredential,
      },
      annotation: `
        <div class="ann-block">
          <h3>Cross-cluster identity</h3>
          <p>The SVID issued by one Vault is accepted as auth on another Vault. SPIFFE ID maps to entity alias, entity alias maps to policy. One portable identity thread.</p>
        </div>
        <div class="ann-block">
          <h3>Dynamic credential</h3>
          <p>SVID exchanged directly for a short-lived AWS/GCP/Azure credential. No static cloud key on the host. The chain is: TPM → SVID → cloud credential.</p>
        </div>
      `,
    },

    /* ── UC3: Kubernetes Workloads ─────────────────────────────── */
    {
      id: 'uc3-k8s-auth',
      title: 'UC3 — Kubernetes Auth',
      subtitle: 'Pod presents projected service account token. Vault validates against K8s OIDC.',
      stageNumber: 'UC3 — Step 1',
      states: {
        'Token presented': K8sAuthTokenPresented,
        'Bound':           K8sAuthBound,
        'Unbound SA':      K8sAuthUnboundSA,
      },
      annotation: `
        <div class="ann-block">
          <h3>No static secret in pod spec</h3>
          <p>The projected service account token is issued by Kubernetes, scoped to Vault's audience. No secret is placed in the pod spec or environment variables.</p>
        </div>
        <div class="ann-block">
          <h3>Unbound SA state</h3>
          <p>Returns the namespace and service account name that failed binding. Platform engineer sees exactly which service account needs a role.</p>
        </div>
      `,
    },
    {
      id: 'uc3-svid-filesystem',
      title: 'UC3 — SVID to Filesystem',
      subtitle: 'Vault Agent writes X.509 SVID files to the pod\'s configured mount path.',
      stageNumber: 'UC3 — Step 2',
      states: {
        'Empty':              SvidMountEmpty,
        'Written':            SvidWritten,
        'Permission denied':  SvidPermissionDenied,
      },
      annotation: `
        <div class="ann-block">
          <h3>No Vault SDK in application</h3>
          <p>Vault Agent handles auth, minting, renewal, and file write. The workload reads a file — it never calls Vault. The SVID lifecycle is invisible to the application.</p>
        </div>
        <div class="ann-block">
          <h3>Atomic write</h3>
          <p>Files are replaced atomically. No pod restart required on renewal. Istio sidecar picks up the new certificate on the next inotify event.</p>
        </div>
      `,
    },
    {
      id: 'uc3-istio-mtls',
      title: 'UC3 — Istio mTLS',
      subtitle: 'Istio sidecars use Vault-issued X.509 SVIDs for all mesh traffic. No Istio CA required.',
      stageNumber: 'UC3 — Step 3',
      states: {
        'Mesh peers':    IstioMtlsMeshPeers,
        'All verified':  IstioMtlsAllVerified,
        'Trust mismatch': IstioMtlsTrustMismatch,
      },
      annotation: `
        <div class="ann-block">
          <h3>No Istio CA</h3>
          <p>Istio reads the cert and key files written by Vault Agent. Its self-signed identity is replaced by the Vault-issued SVID. The trust boundary is the Vault trust domain — not the Istio mesh boundary.</p>
        </div>
        <div class="ann-block">
          <h3>Trust mismatch</h3>
          <p>Post-rotation, peers holding SVIDs signed by the old CA are flagged. Resolution is waiting for Vault Agent's renewal cycle — no manual re-issuance needed.</p>
        </div>
      `,
    },
    {
      id: 'uc3-trust-bundle',
      title: 'UC3 — Trust Bundle Distribution',
      subtitle: 'Vault hosts the trust bundle. All mesh participants fetch once and cache locally.',
      stageNumber: 'UC3 — Step 4',
      states: {
        'Live':               TrustBundleLive,
        'Federation partner': TrustBundleFederationPartner,
        'Stale':              TrustBundleStale,
      },
      annotation: `
        <div class="ann-block">
          <h3>Tokenless fetch</h3>
          <p>Any SPIFFE-aware consumer retrieves the bundle without Vault credentials. Verifiers, Istio sidecars, and external federation partners all use the same endpoint.</p>
        </div>
        <div class="ann-block">
          <h3>Federation partner</h3>
          <p>Platform engineer registers a partner Vault cluster's bundle endpoint. SVIDs from the partner are accepted in mTLS connections within this trust domain. SPIFFE federation without SPIRE.</p>
        </div>
      `,
    },

    /* ── Prototype ─────────────────────────────────────────────── */
    {
      id: 'pe-prototype',
      title: 'Platform Engineer — Clickable Prototype',
      subtitle: 'Full happy path and error branches wired end-to-end. Click through the flow: enable engine, configure trust domain, create role, attach auth method, verify trust bundle.',
      stageNumber: 'Interactive',
      states: {
        'Full flow': PEPrototype,
      },
      annotation: `
        <div class="ann-block">
          <h3>Scene coverage</h3>
          <ul>
            <li><strong>Happy path</strong>: engine list → enable → configure → role → auth → bundle → done (7 screens)</li>
            <li><strong>Error branches</strong>: path conflict, domain error, issuer missing, template error, TTL error, bundle unreachable, bundle empty</li>
            <li><strong>Auto-advance</strong>: saving and checking states progress automatically after ~1.3 s</li>
          </ul>
        </div>
        <div class="ann-block">
          <h3>Navigation</h3>
          <p>Breadcrumb links and the VAULT logo navigate back. The scene hint (bottom-right, monospace) shows the current scene name for orientation during reviews.</p>
        </div>
      `,
    },

    /* ── Platform Engineer ─────────────────────────────────────── */
    {
      id: 'pe-engine-list',
      title: 'Secrets Engines list',
      subtitle: 'Platform Engineer discovers the SPIFFE engine mount or enables it for the first time.',
      stageNumber: 'PE — Step 1',
      states: {
        'No SPIFFE mount':  SecretsEngineListDefault,
        'SPIFFE mounted':   SecretsEngineListWithSpiffe,
      },
      annotation: `
        <div class="ann-block">
          <h3>Entry point</h3>
          <p>Platform engineers land here from the Vault sidebar. The "Enable new engine" CTA is always visible; SPIFFE appears in the engine type list.</p>
        </div>
        <div class="ann-block">
          <h3>State: SPIFFE mounted</h3>
          <p>After enabling, the SPIFFE row is highlighted with a stronger badge and a "Configure" action — distinguishes it from engines that only need a "View" action.</p>
        </div>
      `,
    },
    {
      id: 'pe-enable-engine',
      title: 'Enable SPIFFE Secrets Engine',
      subtitle: 'Select the SPIFFE engine type, set the mount path, handle path conflicts.',
      stageNumber: 'PE — Step 2',
      states: {
        'Engine type list':    EnableEngineDefault,
        'SPIFFE selected':     EnableEngineSpiffeSelected,
        'Path conflict':       EnableEnginePathConflict,
      },
      annotation: `
        <div class="ann-block">
          <h3>Progressive disclosure</h3>
          <p>The path field and description only appear after SPIFFE is selected. Prevents cognitive overload for engineers exploring other engine types.</p>
        </div>
        <div class="ann-block">
          <h3>Path conflict</h3>
          <p>If the entered path is already mounted, an inline error appears below the field immediately on blur. The "Enable" button stays disabled until resolved.</p>
        </div>
      `,
    },
    {
      id: 'pe-engine-config',
      title: 'Configure trust domain and PKI issuer',
      subtitle: 'Set the SPIFFE trust domain, select the intermediate CA, review X.509 defaults.',
      stageNumber: 'PE — Step 3',
      states: {
        'Empty form':         EngineConfigDefault,
        'Filled, valid':      EngineConfigFilledValid,
        'Saving':             EngineConfigSaving,
        'Saved':              EngineConfigSaved,
      },
      annotation: `
        <div class="ann-block">
          <h3>Trust domain</h3>
          <p>The trust domain field drives the SPIFFE ID namespace for every role created under this engine. Validated against RFC 3986 host format on blur.</p>
        </div>
        <div class="ann-block">
          <h3>PKI issuer</h3>
          <p>A dropdown populated from mounted PKI engines. Only intermediate CAs appear. If none are configured, a warning leads the engineer to set up PKI first.</p>
        </div>
      `,
    },
    {
      id: 'pe-role-create',
      title: 'Create SVID role',
      subtitle: 'Define the SPIFFE ID template, TTL, and key algorithm for a workload class.',
      stageNumber: 'PE — Step 4',
      states: {
        'Empty form':         RoleCreateDefault,
        'Filled, valid':      RoleCreateFilledValid,
        'Saving':             RoleCreateSaving,
        'Saved':              RoleCreateSaved,
      },
      annotation: `
        <div class="ann-block">
          <h3>SPIFFE ID template</h3>
          <p>Uses Vault Go template syntax. The field shows a live preview of the rendered SPIFFE ID as the operator types. Invalid template syntax triggers an inline error immediately.</p>
        </div>
        <div class="ann-block">
          <h3>TTL</h3>
          <p>Default 1h; max 24h. Short TTLs are intentional - SVIDs are not secrets, rotation is automatic. The form accepts Go duration strings (1h, 30m) with validation on blur.</p>
        </div>
      `,
    },
    {
      id: 'pe-auth-method',
      title: 'Attach auth method',
      subtitle: 'Map a Kubernetes auth method to the SPIFFE role so workloads can authenticate.',
      stageNumber: 'PE — Step 5',
      states: {
        'Empty':              AuthMethodMappingEmpty,
        'Method selected':    AuthMethodMappingMethodSelected,
        'Policy preview':     AuthMethodMappingPolicyPreview,
        'Attached':           AuthMethodMappingAttached,
      },
      annotation: `
        <div class="ann-block">
          <h3>Policy generation</h3>
          <p>Selecting a method generates a minimal HCL policy scoped to exactly the role's mint path. The operator can review it before attaching. No write access beyond the role's path.</p>
        </div>
        <div class="ann-block">
          <h3>Attached state</h3>
          <p>Shows the binding summary - which auth method, which role, which policy. Gives the platform engineer the exact values to hand off to app developers.</p>
        </div>
      `,
    },
    {
      id: 'pe-trust-bundle',
      title: 'Verify trust bundle',
      subtitle: 'Confirm the trust bundle endpoint is live, parseable, and returns the expected CA certs.',
      stageNumber: 'PE — Step 6',
      states: {
        'Checking':           TrustBundleVerifyChecking,
        'Success':            TrustBundleVerifySuccess,
        'Unreachable':        TrustBundleVerifyUnreachable,
      },
      annotation: `
        <div class="ann-block">
          <h3>Live check, not static message</h3>
          <p>The final step performs a real HTTP fetch to the bundle URL and parses the response. A static "Done" message would hide misconfiguration that only manifests at runtime.</p>
        </div>
        <div class="ann-block">
          <h3>Handoff artifact</h3>
          <p>The success state shows the bundle URL, key count, and CA fingerprint - the exact values an app developer or external federation partner needs to configure their trust store.</p>
        </div>
      `,
    },

    /* ── App Developer ─────────────────────────────────────────── */
    {
      id: 'dev-agent-config',
      title: 'Write Vault Agent config',
      subtitle: 'App Developer generates the Vault Agent HCL to mint and auto-renew an X.509 SVID.',
      stageNumber: 'Dev — Step 1',
      states: {
        'Empty form':                AgentConfigDefault,
        'Filled, valid':             AgentConfigFilledValid,
        'Missing role':              AgentConfigMissingRole,
      },
      annotation: `
        <div class="ann-block">
          <h3>Config generation</h3>
          <p>The role name and engine path are the only values the developer provides. Vault address and engine path are pre-filled from the engine mount. The generated HCL is copy/download ready.</p>
        </div>
        <div class="ann-block">
          <h3>Missing role</h3>
          <p>If the role name is blank, the Generate button stays disabled and an inline note prompts the developer to ask their platform team. The error surface is the only required field.</p>
        </div>
      `,
    },
    {
      id: 'dev-agent-running',
      title: 'Run Vault Agent',
      subtitle: 'Vault Agent authenticates to Vault and writes SVID files to the configured paths.',
      stageNumber: 'Dev — Step 2',
      states: {
        'Starting':           AgentRunningStarting,
        'Authenticated':      AgentRunningAuthenticated,
        'Auth failed':        AgentRunningAuthFailed,
      },
      annotation: `
        <div class="ann-block">
          <h3>Log readout</h3>
          <p>The view mirrors Vault Agent log output so developers can confirm auth succeeded without switching to a terminal. Written file paths and sizes confirm SVID delivery.</p>
        </div>
        <div class="ann-block">
          <h3>Auth failed</h3>
          <p>The error message surfaces the exact Vault response including the role name and service account mismatch. Developers see what to fix without hunting through CLI output.</p>
        </div>
      `,
    },
    {
      id: 'dev-svid-verify',
      title: 'Verify the SVID',
      subtitle: 'Inspect the issued SVID - SPIFFE ID, TTL, key algorithm, issuer, auto-renewal.',
      stageNumber: 'Dev — Step 3',
      states: {
        'Loading':            SvidVerifyDefault,
        'Verified':           SvidVerifyVerified,
        'Expired':            SvidVerifyExpired,
      },
      annotation: `
        <div class="ann-block">
          <h3>Key fields</h3>
          <p>The SPIFFE ID (URI SAN) is the primary confirmation. Expiry time and the auto-renewal note tell developers they do not need to handle rotation. Key algorithm and issuer close the trust chain verification.</p>
        </div>
        <div class="ann-block">
          <h3>Expired state</h3>
          <p>Points directly at Vault Agent connectivity as the likely cause rather than offering generic troubleshooting. Developers know what to check without reading docs.</p>
        </div>
      `,
    },
    {
      id: 'dev-mtls-test',
      title: 'Test mTLS with peers',
      subtitle: 'Confirm that peer services complete mutual TLS handshake using the issued SVID.',
      stageNumber: 'Dev — Step 4',
      states: {
        'Peer list':          MtlsTestPeerList,
        'All verified':       MtlsTestAllVerified,
      },
      annotation: `
        <div class="ann-block">
          <h3>Peer status</h3>
          <p>Services without a SVID show a "No SVID" badge rather than an error. The note clarifies they fall back to token auth - not broken, just not yet migrated.</p>
        </div>
        <div class="ann-block">
          <h3>Completion state</h3>
          <p>The success banner explicitly states no static credential was exchanged. This is the confirmation that the Secret Zero problem is solved for this workload.</p>
        </div>
      `,
    },

    /* ── Security Engineer ─────────────────────────────────────── */
    {
      id: 'sec-audit-log',
      title: 'Review audit log',
      subtitle: 'Security Engineer reviews every SVID issuance event with full attribution.',
      stageNumber: 'Sec — Step 1',
      states: {
        'All events':         AuditLogDefault,
        'Errors only':        AuditLogFilteredErrors,
      },
      annotation: `
        <div class="ann-block">
          <h3>Attribution model</h3>
          <p>Each row records: timestamp, operation, engine path, SPIFFE ID issued, Vault entity (k8s service account), and status. Failed attempts include the exact denial reason from Vault policy evaluation.</p>
        </div>
        <div class="ann-block">
          <h3>Error filter</h3>
          <p>Errors-only filter isolates unauthorized mint attempts. For compliance reviewers, this is the view that answers "show me every failed identity request and why."</p>
        </div>
      `,
    },
    {
      id: 'sec-inventory',
      title: 'Identity inventory',
      subtitle: 'Fleet view of all active SVIDs - TTL status, root of trust, expiry.',
      stageNumber: 'Sec — Step 2',
      states: {
        'Default':            IdentityInventoryDefault,
        'Expiring soon':      IdentityInventoryExpiringSoon,
      },
      annotation: `
        <div class="ann-block">
          <h3>Day-2 differentiator</h3>
          <p>SPIRE has no built-in fleet visibility. The inventory view answers the question 10+ banks have asked: show me every machine identity, its root of trust, and its owner. The count cards at the top are the compliance posture snapshot.</p>
        </div>
        <div class="ann-block">
          <h3>Expiring soon</h3>
          <p>The warning banner names the consequence of renewal failure - mTLS connections drop. Security engineers see this before it becomes an incident.</p>
        </div>
      `,
    },
    {
      id: 'sec-ca-rotation',
      title: 'CA rotation status',
      subtitle: 'Review CA rotation history, trust bundle freshness, and downstream consumer status.',
      stageNumber: 'Sec — Step 3',
      states: {
        'Default':                 CaRotationDefault,
        'Post-rotation':           CaRotationPostRotation,
      },
      annotation: `
        <div class="ann-block">
          <h3>Rotation transparency</h3>
          <p>The rotation history table shows the exact sequence of events - rotation started, bundle refreshed, rotation complete. Vault appends the new CA cert to the bundle before removing the old one; the overlap window is explicit.</p>
        </div>
        <div class="ann-block">
          <h3>Post-rotation state</h3>
          <p>The success banner confirms no manual action is needed. Vault Agent auto-renews SVIDs. The "previous cert valid until" date tells security engineers when the cleanup window closes.</p>
        </div>
      `,
    },
    {
      id: 'sec-compliance',
      title: 'Compliance report',
      subtitle: 'Export a dated summary of issuance events, policy violations, and CA rotations.',
      stageNumber: 'Sec — Step 4',
      states: {
        'Summary view':       ComplianceReportDefault,
        'Exported':           ComplianceReportExported,
      },
      annotation: `
        <div class="ann-block">
          <h3>What the report covers</h3>
          <p>Total SVIDs issued, active count, failed attempts, CA rotations in the last 30 days, and policy violations. CSV and JSON exports give compliance teams import-ready data for their audit tools.</p>
        </div>
        <div class="ann-block">
          <h3>Audit log is the report</h3>
          <p>There is no separate compliance database. Vault's audit log is the source of truth. The report aggregates directly from it - no ETL, no separate system, no lag.</p>
        </div>
      `,
    },
  ],
};
