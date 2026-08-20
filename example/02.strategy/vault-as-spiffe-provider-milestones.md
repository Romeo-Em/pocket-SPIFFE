# Vault as a SPIFFE Provider — Milestone-by-Milestone Story

_Author: Kartik Lunkad · Created: 2026-07-23 · Status: Draft_

**Companion to:** [`strategy/vault-as-spiffe-provider-priorities.md`](vault-as-spiffe-provider-priorities.md)

---

## The challenge

None of the six engineering priorities needed for a complete SPIFFE provider (x509 SVIDs, trust bundles, Workload API socket, workload attestation, SVID-direct issuance, scoped binary) will be fully shipped by October. The story still needs to be told — credibly, not as vaporware — to customers, field teams, and the market.

The answer is to tell the story as a **deliberate progression**, where each milestone is a complete, useful thing on its own — not a fragment waiting for the next one.

---

## Grounding: what we actually have today

Before milestones, the honest inventory:

| Capability | State |
|---|---|
| JWT-SVID issuance (SPIFFE secrets engine) | **Shipping** — Vault Enterprise |
| SPIFFE auth method (JWT + x509 SVID consumption) | **Shipping** — Vault Enterprise |
| OIDC well-known + JWKS endpoint (JWT trust distribution) | **Shipping** — SPIFFE secrets engine |
| OAuth resource server + Agent Registry (tokenless auth, agentic governance) | **Private preview** — Vault Enterprise 2.x |
| TPM node attestation (RFC-VLT-2010) | **In development** — target Vault 2.1 |
| x509 SVID issuance | **Gap** — roadmap |
| x509 trust bundle endpoint | **Gap** — roadmap |
| Workload API socket (Vault Agent) | **Gap** — roadmap |
| Workload attestation (per-process) | **Gap** — roadmap |
| SVID-direct from attestation (no Vault token) | **Gap** — roadmap |
| `vault-spiffe-server` scoped binary | **Gap** — strategic future |

---

## The milestone arc

```
TODAY              OCTOBER              JANUARY              APRIL
  │                   │                    │                    │
  │◄── M0: Story ────►│◄──── M1: Attest ──►│◄──── M2: Issue ──►│◄── M3: Distribute
  │    foundation     │      + consume      │      directly      │    + full provider
  │    (now)          │      (Vault 2.1)    │      (SVID-first)  │    story
```

---

## Milestone 0 — "The story we can tell today"
**Status: Now. No new engineering required.**

### What exists

Vault can already be the SPIFFE authority for an organization, today, using only shipping capabilities:

1. **Vault mints JWT-SVIDs** via the SPIFFE secrets engine. Workloads authenticated to Vault through any auth method can be issued a SPIFFE ID templated to their Vault Identity entity.
2. **Vault serves a JWT trust bundle** via the OIDC well-known endpoint — any verifier can validate JWT-SVIDs offline without calling back to Vault.
3. **Vault consumes SVIDs** via the SPIFFE auth method — another Vault cluster (or any system) can authenticate *to* Vault using a JWT-SVID or x509-SVID issued by another SPIFFE authority.
4. **Vault governs agents** via the Agent Registry (private preview) — agents authenticated with a JWT can be constrained by ceiling policies, creating a governed class of agentic identity.
5. **Vault enforces tokenless access** via the OAuth resource server (private preview) — the agent presents a JWT per-request, no Vault token required.

### The story in one sentence

> *Vault is already the SPIFFE authority for JWT-based workload identity — any workload that can authenticate to Vault can get a verifiable, portable SPIFFE ID that works across Envoy, cloud IAM exchanges, and other Vault clusters.*

### What to do with this today

- **Customer conversations:** lead with the JWT-SVID + OAuth resource server story for customers who have agentic workloads or are evaluating SPIFFE. Vault already covers the JWT lane.
- **GTM:** position against "you need to run SPIRE infrastructure." Vault replaces the SPIRE Server for JWT-SVID use cases, today, with better day-2 (managed identity, audit, secrets in the same control plane).
- **Gap to name honestly:** x509 SVIDs, Workload API socket, and per-process workload attestation are not yet here. The JWT-SVID story is complete. The mTLS/service-mesh story requires x509 (M2).

---

## Milestone 1 — "Hardware-rooted identity for on-prem workloads"
**Target: October (Vault 2.1) — TPM auth (RFC-VLT-2010)**

### What ships

- **TPM node attestation in Vault Agent:** Vault Agent on a Linux VM uses the TPM 2.0 EK to prove the node's identity to Vault. No static bootstrap secret. No AppRole secret ID.
- **Vault-issued certificate from attestation:** after attestation, Vault issues a leaf certificate bound to that TPM. The private key never leaves the hardware.
- **Cert auth login with TPM binding:** the workload authenticates to Vault using the TPM-bound certificate. Vault verifies the certificate chains to an issuer that required the attestation workflow.
- **EK enrollment and host registry:** platform admin pre-registers the TPM EK; Vault rejects attestation from unregistered hosts.

### What this adds to the story

This is the **SPIRE node attestation equivalent for on-prem Linux VMs** — the step SPIRE takes with AWS IID for EC2, now done by Vault with TPM for bare-metal and vTPM workloads on VMware/Nutanix.

The result of attestation in M1 is a Vault token + certificate (not a SVID yet — that is M2). But the trust chain is established: Vault has verified the node's hardware identity. That is the foundation everything else builds on.

### The story addition

> *For on-premises Linux VMs on VMware or Nutanix, Vault Agent now solves Secret Zero using the TPM already in the hardware. No credential distribution. No AppRole secret. The VM proves its identity to Vault through its TPM, and Vault issues a certificate that lets the workload authenticate. This is what AWS IAM does for EC2, now available for on-prem.*

### What to name honestly

- The output of M1 attestation is a Vault token, not a SVID. The SVID-direct path is M2.
- Single workload per host. Multi-workload-per-host with distinct identities is a future milestone.
- Linux + vTPM only. Windows is a future milestone.

---

## Milestone 2 — "From attestation to SPIFFE identity, directly"
**Target: January — SVID-direct issuance + x509 SVID support**

### What ships

- **SVID-direct from TPM attestation:** the TPM attestation flow terminates in a JWT-SVID (and eventually an x509-SVID) — not a Vault token. Vault Agent receives the SVID and caches it locally.
- **x509 SVID issuance:** Vault SPIFFE secrets engine issues x509-SVIDs (cert + SPIFFE ID as URI SAN) using Vault PKI as the signing CA.
- **x509 trust bundle endpoint:** Vault serves a SPIFFE-compliant trust bundle containing both x509 CA cert(s) and JWT keys — the material verifiers need to validate x509 SVIDs offline.

### What this adds to the story

This is where Vault crosses from "can mint SPIFFE IDs" to "is a complete SPIFFE identity provider" for the certificate path. With x509 SVIDs and a trust bundle, workloads can use their Vault-issued SVID for mTLS — with Envoy, service meshes, and any system that accepts a SPIFFE x509 credential.

More importantly: the two-step flow (attest → Vault token → request SVID) collapses into one. The node proves its identity and **receives its SPIFFE ID directly**. This is the behavior customers expect from a SPIFFE provider and what SPIRE delivers today.

### The story addition

> *Vault Agent attests the node via TPM and receives a SPIFFE ID directly — no Vault token as an intermediary. That SPIFFE ID is an x509-SVID, valid for mTLS, portable to Envoy and service meshes, and verifiable by any system that fetches Vault's trust bundle. This is the SPIRE Server + Agent model, running on Vault, without the operational overhead of a separate SPIRE deployment.*

### What to name honestly

- Workload attestation (per-process, not just per-node) is still a gap. One SVID per node at this point.
- Workload API socket is not yet present; the workload still needs to be SVID-aware (it calls Vault Agent, not a transparent local socket).
- The `vault-spiffe-server` scoped binary is not yet available; this is still Vault Enterprise with SPIFFE capabilities enabled.

---

## Milestone 3 — "Vault as a complete SPIFFE provider"
**Target: April — Workload API socket + workload attestation + trust bundle distribution**

### What ships

- **Workload API socket in Vault Agent:** Vault Agent exposes a Unix Domain Socket implementing the SPIFFE Workload API. Workloads call the socket with no credentials to receive their SVID. Rotation is automatic.
- **Workload attestation (per-process):** Vault Agent inspects the calling process (UID, GID, binary path) and matches against registered workload entries to determine which SPIFFE ID to issue. Multiple workloads on a single host each get a distinct identity.
- **Trust bundle distribution:** Vault serves and optionally pushes the trust bundle to external systems on CA rotation.

### What this adds to the story

This is where Vault is **drop-in comparable to SPIRE** for a platform engineer evaluating whether to adopt Vault or run standalone SPIRE infrastructure. The Workload API socket means any SPIFFE-native workload — Envoy, a gRPC service, an AI agent sidecar — can get its SVID transparently, without code changes, just as it would from SPIRE.

Per-process workload attestation means multi-workload hosts are supported, which is the predominant on-prem pattern (multiple services on one VM). Each service gets its own SPIFFE ID and its own Vault policy scope.

### The story addition

> *Any workload on an attested node — regardless of how many services are co-located — calls a local socket and receives its own SPIFFE identity. No code changes. No credentials. The workload doesn't know Vault is behind it. Platform engineers manage workload registration and policy in Vault, the same control plane they already use for secrets. SPIRE infrastructure is not required.*

### What becomes possible at April

The three-layer agentic architecture closes:

```
Vault Agent (TPM attestation) → SVID (from Workload API socket)
    → Authorization Server (token exchange, RAR)
    → Vault resource server (Agent Registry, ceiling policies, enforcement)
```

An on-prem AI agent on an attested VM gets its identity from hardware attestation, exchanges it for a scoped OAuth token at an AS, and accesses Vault resources under ceiling-bounded governance — with a full audit trail. No static credential anywhere in the chain.

---

## Milestone 4 — "`vault-spiffe-server`: purpose-built deployment"
**Target: Beyond April — strategic**

Once M3 capabilities are stable, scope and ship the `vault-spiffe-server` scoped binary: a Vault Enterprise deployment profile that includes only the SPIFFE provider surface (attestation, SVID issuance, trust bundle, Workload API) and explicitly excludes the resource-server and secrets-engine surface.

This is not a near-term deliverable but should be named in the roadmap now, because it is what customers comparing Vault to SPIRE on operational simplicity will eventually ask for.

---

## How to tell the story at each milestone

| Milestone | Primary audience | Core message | Honest gap to acknowledge |
|---|---|---|---|
| **M0 — Today** | Customers evaluating SPIFFE or agentic access | "Vault mints SPIFFE IDs today; agents can use them tokenlessly with the OAuth resource server" | x509, Workload API, on-prem attestation not yet available |
| **M1 — October** | On-prem platform engineers; financial services customers with VMware/Nutanix fleets | "TPM attestation eliminates Secret Zero for on-prem Linux VMs — same as AWS IAM does for EC2" | Output is a Vault token + cert, not a SVID yet; single workload per host |
| **M2 — January** | Platform engineers ready to adopt SPIFFE end-to-end; customers evaluating SPIRE replacement | "Attestation now issues a SPIFFE ID directly; x509 SVIDs work with Envoy and service meshes" | No Workload API socket yet; workload must still be SVID-aware |
| **M3 — April** | Enterprise architects; SPIRE users evaluating migration | "Drop-in SPIRE alternative: Workload API socket, per-process identity, no SPIRE infrastructure" | Scoped binary, federation with existing SPIRE deployments — future |

---

## What ties all four milestones together (the through-line)

Every milestone advances the same single idea:

> **A workload should earn its identity from the hardware and environment it runs in — not from a credential someone placed there.**

- M0: Vault can issue that identity today, for workloads that already have a JWT.
- M1: Vault can prove the hardware before issuing anything, for on-prem VMs.
- M2: The identity Vault issues is a portable SPIFFE credential, not a Vault-internal token.
- M3: The identity is delivered transparently, the way SPIRE delivers it — workloads call a socket, not an API.

That arc is the "Vault as a SPIFFE provider" story, told across four deliverable steps.

---

## Relationship to other docs

| Document | Relationship |
|---|---|
| [`strategy/vault-as-spiffe-provider-priorities.md`](vault-as-spiffe-provider-priorities.md) | The six engineering priorities. This document maps those priorities to milestones and tells the story at each stage. |
| [`strategy/spiffe-identity-provider-vision.md`](spiffe-identity-provider-vision.md) | Full lifecycle vision (Root → Issue → Distribute → Manage → See). M0–M3 cover Root and Issue; M3+ covers Distribute. |
| [`tpm-auth/PRD-VLT-2009-TPM-Support-in-Vault--Attestation-Led.md`](../tpm-auth/PRD-VLT-2009-TPM-Support-in-Vault--Attestation-Led.md) | M1 detail — TPM auth requirements, acceptance criteria, and scope. |
| [`agentic-workflow-spiffe-provider-vision.md`](../agentic-workflow-spiffe-provider-vision.md) | Three-layer architecture. M3 is the milestone at which the full three-layer flow closes. |
| [`agent-preview-capabilities/SYNTHESIS.md`](../agent-preview-capabilities/SYNTHESIS.md) | OAuth resource server + Agent Registry — the agentic enforcement layer that consumes the SPIFFE ID issued by M0–M3. |
