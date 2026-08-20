# Vault as a SPIFFE Provider — Vision and Engineering Priorities

_Author: Kartik Lunkad · Created: 2026-07-23 · Status: Draft_

**Companion to:** [`strategy/spiffe-identity-provider-vision.md`](spiffe-identity-provider-vision.md) (the full lifecycle narrative) and [`strategy/MEMO-SPIFFE--Vault-Strategy.md`](MEMO-SPIFFE--Vault-Strategy.md) (the strategy memo).

---

## Vision

> **Vault should be deployable as a standalone SPIFFE identity provider — analogous to a SPIRE Server — responsible for attesting the infrastructure a workload runs on, issuing a SPIFFE ID directly from that attestation, and serving the trust bundle that lets any verifier validate that identity offline.**
>
> Vault Agent plays the SPIRE Agent role: it runs on every node, performs attestation to the Vault SPIFFE server, attests local workloads, and delivers SVIDs to them through a local socket API — with no static credential and no Vault token in the workload.
>
> This identity layer is the **first step** of a three-layer agentic access architecture. The SVID it issues feeds into a Token Exchange / Authorization Server for grant-time authorization, and then into Vault-as-resource-server for enforcement. The identity layer is deliberately decoupled from the authorization and enforcement layers so the SVID is portable: it can be consumed by any SPIFFE-aware system, not just Vault.

This positions Vault as the operational alternative to running standalone SPIRE infrastructure — with the day-2 advantages (managed inventory, policy engine, audit, secrets) that SPIRE does not provide.

---

## Why "SPIFFE provider" is a distinct deployment posture

Today, Vault's SPIFFE capabilities are tightly coupled to its resource-server and policy-enforcement role: a workload authenticates to Vault, Vault issues a Vault token, and optionally that token can be traded for a JWT-SVID. Identity issuance and resource access are the same transaction.

The SPIFFE provider model separates them:

| Concern | Today | SPIFFE provider vision |
|---|---|---|
| Identity issuance | Part of a Vault auth flow that produces a Vault token | First-class, standalone — TPM/node attestation → SVID, no Vault token needed |
| Resource access | Requires a Vault token obtained from a login | Separate step: SVID → Token Exchange / AS → OAuth JWT → Vault resource server |
| Workload experience | Workload calls Vault, exchanges credential for a token | Workload calls a local socket (Vault Agent); SVID is delivered transparently |
| SVID portability | JWT-SVID can be used elsewhere; Vault token is Vault-specific | SVID is the portable artifact; it can go to Envoy, service meshes, cloud IAM, or AS |
| Deployment model | Single Vault cluster does everything | Vault SPIFFE provider can be a distinct deployment; resource-server Vault is separate |

---

## Engineering Priorities

The six priorities below are sequenced by: (a) whether they are blockers for the standalone provider story, and (b) the SPIRE capability comparison gap table in the strategy memo.

---

### Priority 1 — X.509 SVID support

**What it is:**
Today Vault's SPIFFE secrets engine only issues JWT-SVIDs. X.509 SVIDs are certificates with the SPIFFE ID embedded as a URI Subject Alternative Name — the primary credential format in SPIRE and the one that Envoy, Istio, gRPC mTLS, and all service-mesh workloads expect.

**Why it's the top priority:**
Without X.509 SVIDs, Vault cannot be a complete SPIFFE provider. Every workload that relies on mTLS for service-to-service authentication — which is the majority of real SPIFFE deployments — cannot use Vault as its issuer. It also blocks SPIFFE federation (which requires X.509 trust bundle exchange) and the Workload API (which serves X.509 SVIDs as the primary credential).

Vault's PKI secrets engine already issues X.509 certificates; the gap is issuing them in the SPIFFE-compliant format (URI SAN carrying the SPIFFE ID) through the SPIFFE secrets engine API, with the correct TTLs, key types, and rotation behavior.

**Definition of done:**
- SPIFFE secrets engine can mint X.509 SVIDs (cert + SPIFFE ID as URI SAN) for any registered workload
- X.509-SVID TTL, key algorithm (ECDSA P-256 / RSA-2048), and rotation are configurable per role
- The signing CA is the Vault PKI engine (existing); the SPIFFE engine wraps it with the correct SPIFFE-format issuance

---

### Priority 2 — Trust bundle hosting and distribution

**What it is:**
A SPIFFE trust bundle is a set of CA certificates (and JWKS for JWT-SVIDs) for a trust domain. It is the material that any verifier — a service, a mesh proxy, another Vault cluster, a cloud IAM system — uses to validate a SVID **offline**, without calling back to Vault at verification time. Hosting this bundle at a queryable, well-known endpoint is a prerequisite for being a complete SPIFFE identity provider.

**Why it matters — specifically:**
Trust scales by signature, not by runtime lookup. If Vault issues an SVID but doesn't serve a stable, queryable trust bundle, every verifier has to either:
- Call Vault at validation time (latency, Vault dependency, doesn't work offline), or
- Be manually given the CA cert out-of-band (operational fragility, doesn't support CA rotation)

A proper trust bundle endpoint means a verifier fetches the bundle once (or periodically), caches it, and validates SVIDs locally against it. This is how SPIFFE is designed to scale across heterogeneous environments.

**Current state:**
Vault's SPIFFE secrets engine already exposes:
- `.well-known/openid-configuration` — OIDC discovery endpoint (for JWT-SVID validation)
- `.well-known/keys` — JWKS endpoint (for JWT-SVID signature verification)
- `trust_bundle/web` — trust bundle endpoint for JWT key material

The gap is the **X.509 trust bundle** — a queryable endpoint that serves the X.509 CA certificate(s) for the trust domain in a SPIFFE-compliant format (JWKS document containing both X.509 roots and JWT keys, per the SPIFFE bundle format spec). Without this, X.509 SVIDs cannot be validated by external verifiers.

Additionally, SPIRE supports **BundlePublisher plugins** that push the trust bundle to external systems (AWS S3, GCP GCS, Kubernetes ConfigMaps) so verifiers that cannot reach the SPIFFE server directly can still fetch a current bundle. Vault should support equivalent push or pull distribution.

**Definition of done:**
- Vault serves a SPIFFE-compliant trust bundle endpoint for the trust domain, containing both X.509 CA cert(s) and JWT keys in a single queryable document
- Trust bundle is automatically updated when the Vault PKI CA rotates
- Bundle refresh hint is configurable
- (Future) BundlePublisher-equivalent: push trust bundle to an external store on rotation

---

### Priority 3 — Workload API socket (Vault Agent)

**What it is:**
The SPIFFE Workload API is a local gRPC interface exposed by the SPIRE Agent as a Unix Domain Socket on each node (`/run/spire/sockets/agent.sock` or similar). A workload process calls this socket — with no credentials, no tokens, no configuration — to receive its SVID. The agent interrogates the OS kernel to identify the calling process, matches it against registered workload entries, and returns the correct cached SVID.

The socket also handles **automatic rotation**: the agent pushes updated SVIDs to any workload watching the stream before the current SVID expires, so the workload never has to poll or manage its own renewal.

**Why it's needed:**
This is the interface that makes SPIFFE invisible to the workload. Without it:
- Workloads must explicitly call Vault to request their SVID — which means they need Vault credentials to do so (reintroducing Secret Zero at the workload level)
- Envoy, Istio, gRPC-based services, and any other SPIFFE-aware runtime that expects the standard Workload API socket cannot use Vault Agent as its SVID source
- The "no static credential in the workload" property of the architecture breaks down

Vault Agent already acts as a local proxy for many Vault operations; extending it to serve the SPIFFE Workload API socket is the right architectural home for this capability.

**Definition of done:**
- Vault Agent exposes a Unix Domain Socket implementing the SPIFFE Workload API (gRPC, `spiffe.workload.v1`)
- Workloads can call `FetchX509SVID` and `FetchJWTSVID` with no credentials
- Agent caches SVIDs and pushes renewals automatically
- Socket path is configurable; defaults align with SPIRE Agent convention for drop-in compatibility

---

### Priority 4 — Workload attestation gaps (per-process identity)

**What it is:**
Today Vault can attest the **node** a workload runs on (via TPM, cloud metadata, k8s SA, etc.) but cannot attest **individual processes** on that node. SPIRE's workload attestation interrogates the OS kernel for the calling process's UID, GID, binary path, SHA256, cgroup, and Kubernetes pod metadata, then matches those properties against registration entries to determine which specific SPIFFE ID to issue.

Without workload attestation, a node gets one SPIFFE ID and all workloads on it share it. That is insufficient for multi-workload hosts — a common pattern on-prem — where each service needs a distinct identity and distinct policy scope.

**The gap precisely:**

| Attestation type | SPIRE | Vault today |
|---|---|---|
| Node (cloud — AWS, GCP, Azure) | Yes | Yes (via auth methods) |
| Node (TPM / vTPM, on-prem) | Yes (official plugin) | In-flight (VLT-2009 / VLT-2010) |
| Node (Kubernetes) | Yes | Yes (k8s auth method) |
| Workload (Unix UID/GID, binary path) | Yes | **No** |
| Workload (Kubernetes pod / SA / namespace) | Yes | **No** (k8s auth method attests the pod but not via Workload API) |
| Workload (Docker container attrs) | Yes | **No** |

**Definition of done:**
- Vault Agent includes a workload attestor plugin interface (analogous to SPIRE's workload attestor plugin model)
- Built-in Unix workload attestor: inspects UID, GID, binary path of calling process
- Built-in Kubernetes workload attestor: inspects pod SA, namespace, labels
- Vault Server matches attestation selectors against registration entries to determine which SPIFFE ID to issue per workload

---

### Priority 5 — Skip Vault token generation; issue SVID directly from attestation

**What it is:**
Today's attestation flows end with Vault issuing a **Vault token** — the central session credential for all subsequent Vault operations. Even with TPM attestation, the current design is: prove your identity → receive a Vault token → use that token to request a SVID.

The target behavior is: prove your identity → **receive a SVID directly** — no Vault token as an intermediate step.

**Why it matters:**
The Vault token is a Vault-internal session object. It carries Vault-specific TTLs, accessor IDs, and policy bindings. For the SPIFFE provider use case, the workload doesn't need a Vault session — it needs a portable, standards-based identity credential (the SVID) it can present anywhere. Requiring a Vault token as an intermediate:
- Reintroduces a Vault-specific credential that must be stored in the workload or agent
- Creates a two-step flow (attest → token, then token → SVID) that Vault Agent must manage
- Ties SVID issuance to Vault's session/lease model, which is the wrong abstraction for identity

The right flow for the SPIFFE provider posture is:
```
Vault Agent attests node to Vault Server
    → Vault Server issues node SVID directly (no Vault token)
Vault Agent attests workload process
    → Vault Server issues workload SVID directly (no Vault token)
Vault Agent caches and delivers SVIDs via Workload API socket
```

This mirrors SPIRE exactly: after node attestation, the SPIRE Agent receives an SVID for itself — not a session token — and that SVID is what it uses to authenticate subsequent workload SVID requests.

**Definition of done:**
- A dedicated Vault Agent ↔ Vault Server attestation protocol that terminates in SVID issuance, not Vault token issuance
- Vault Server can issue node-level and workload-level SVIDs via this path without creating a Vault lease or token
- Existing auth-method-based Vault token flows are unchanged; the SVID-direct path is an additional mode, not a replacement

---

### Priority 6 — A `vault-spiffe-server` binary: a purpose-built SPIFFE provider deployment

**What it is:**
A separately deployable binary (or a narrowly scoped Vault Enterprise configuration profile) that includes **only the capabilities needed to act as a SPIFFE identity provider** — and deliberately excludes the resource-server, policy-enforcement, and secrets-engine surface of a full Vault deployment.

**What it would include:**
- SPIFFE secrets engine (X.509-SVID + JWT-SVID issuance)
- Trust bundle hosting and distribution
- TPM / cloud / Kubernetes node attestation
- Workload attestation (Priority 4)
- SVID-direct issuance path (Priority 5)
- Vault Agent with Workload API socket (Priority 3)
- Identity entity model (for registration entries)
- Audit logging
- Raft-based HA

**What it would exclude:**
- KV secrets engines
- Dynamic secrets (AWS, database, PKI, SSH, etc.)
- Auth methods beyond attestation-based ones
- Agent Registry / OAuth resource server (those belong in the resource-server Vault)
- Vault UI for secrets management
- Anything that makes it a general-purpose Vault cluster

**Why this matters:**
Two reasons:

1. **Operational simplicity.** A SPIFFE provider is critical infrastructure — it must be highly available, lightweight, and have a narrow attack surface. Operators running SPIRE today want to replace SPIRE with something that is operationally simpler and has better day-2 tooling, not something that is also a full secrets manager. A purpose-built binary is a credible drop-in replacement for SPIRE Server + Agent.

2. **Positioning clarity.** Vault-as-everything is a hard story to sell against "SPIRE is purpose-built for SPIFFE." A `vault-spiffe-server` is a direct answer: it is purpose-built for SPIFFE, uses Vault's infrastructure (Raft HA, audit, PKI), and integrates with the broader Vault ecosystem without requiring every customer to expose their full Vault cluster as their SPIFFE provider.

**Definition of done:**
- Defined component boundary: a documented, enforced set of Vault Enterprise capabilities included in this deployment profile
- Vault Agent correspondingly ships a `spiffe-agent` mode that enables the Workload API socket and disables unrelated agent behaviors
- Deployment can be operated independently of a resource-server Vault cluster, with the two communicating only via OIDC/JWKS trust bundle exchange

---

## Priority Summary

| # | Priority | Blocks | Gap vs. SPIRE |
|---|---|---|---|
| 1 | X.509 SVID support | Trust bundle (P2), Workload API (P3), Federation | Critical — JWT-only is insufficient for most deployments |
| 2 | Trust bundle hosting (X.509) | External verifiers, federation, mesh integration | Gap — JWT JWKS exists; X.509 bundle missing |
| 3 | Workload API socket (Vault Agent) | Per-workload SVID delivery, Envoy/mesh compatibility | Gap — no UDS socket today |
| 4 | Workload attestation (per-process) | Multi-workload-per-host identity | Gap — node-level only today |
| 5 | SVID-direct from attestation (no Vault token) | Clean provider architecture, true Secret Zero elimination | Gap — all current flows produce a Vault token |
| 6 | `vault-spiffe-server` binary | Operational simplicity, positioning vs. SPIRE | Strategic — no equivalent scoped deployment today |

Priorities 1–3 are the **minimum for a complete SPIFFE provider** (the table stakes that SPIRE already satisfies). Priorities 4–6 are the **differentiating layer** that makes Vault better than SPIRE for enterprise deployments.

---

## Relationship to Other Docs

| Document | Relationship |
|---|---|
| [`strategy/spiffe-identity-provider-vision.md`](spiffe-identity-provider-vision.md) | Full lifecycle narrative (Root → Issue → Distribute → Manage → See). This document defines the engineering priorities that make that vision real. |
| [`strategy/MEMO-SPIFFE--Vault-Strategy.md`](MEMO-SPIFFE--Vault-Strategy.md) | Strategy memo. Capability gap table in the appendix is the source for the gap column above. |
| [`agentic-workflow-spiffe-provider-vision.md`](../agentic-workflow-spiffe-provider-vision.md) | Three-layer agentic architecture (SPIFFE provider → Token Exchange AS → Vault resource server). This document defines the first layer. |
| [`tpm-auth/PRD-VLT-2009-TPM-Support-in-Vault--Attestation-Led.md`](../tpm-auth/PRD-VLT-2009-TPM-Support-in-Vault--Attestation-Led.md) | TPM auth is the on-prem node attestation primitive for Priority 5 (SVID-direct from attestation). |
| [`context/reference-docs/spiffe/spire-concepts.md`](../context/reference-docs/spiffe/spire-concepts.md) | SPIRE architecture reference; the analogy baseline for all six priorities. |
