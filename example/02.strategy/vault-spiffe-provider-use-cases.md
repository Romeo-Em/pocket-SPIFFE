# Vault as a SPIFFE Provider — Two Use-Cases, Two Workflows

_Author: Kartik Lunkad · Created: 2026-07-23 · Status: Draft_

**Companion to:** [`strategy/vault-as-spiffe-provider-milestones.md`](vault-as-spiffe-provider-milestones.md)

---

## Overview

Two distinct use-cases drive different workflow requirements for Vault as a SPIFFE provider. They share the same identity foundation — hardware-rooted attestation, SPIFFE ID issuance — but diverge sharply after the SVID is issued.

| | **Use-Case 1: AI Agents** | **Use-Case 2: Traditional NHIs (on-prem VMs)** |
|---|---|---|
| **Primary persona** | AI Engineer, Security Architect | Platform Engineer, Application Developer |
| **Identity type** | Agentic — dynamic, delegated, multi-hop | Static NHI — stable, process-bound, long-lived |
| **Core JTBD** | Prove agent identity, get scoped runtime access on behalf of a user without standing credentials | Prove workload identity, access Vault secrets/policies without a static bootstrap secret |
| **After SVID** | Token Exchange AS → OAuth JWT (RAR) → Vault resource server | SVID is the durable identity credential — used directly for mTLS, Envoy, mesh, or re-presented to Vault |
| **Vault token** | **Skip entirely** — OAuth JWT presented per-request | **Acceptable short-term** — Vault token can still be the output; SVID-direct is the north star |
| **Key risk** | Confused deputy, prompt injection, delegation explosion | Secret Zero, orphaned credentials, stale identities at scale |

---

## Use-Case 1: AI Agents

### The problem

An AI agent — a running process, an LLM-backed service, an automation worker — needs to access Vault-backed resources on behalf of a user. The challenges are:

- The agent must not carry broad standing credentials (prompt injection can steal them).
- The agent's access must be bounded — it cannot exceed the user's permissions, and it must be further constrained by its own governance ceiling.
- Every delegation must be auditable: which user, which agent, which tool, which resource, for how long.
- Access should be scoped to the immediate task and expire automatically.

### The workflow

```
[Vault Agent on node]
    │
    │ 1. Node attestation (TPM / cloud metadata)
    ▼
[Vault SPIFFE Server]
    │ Issues node-level JWT-SVID
    │ (No Vault token — SVID is the identity artifact)
    ▼
[Vault Agent]
    │ Delivers SVID to the agent process (Workload API socket — future)
    │ or agent requests SVID directly (today)
    ▼
[Agent process holds JWT-SVID]
    │
    │ 2. Agent presents JWT-SVID to Token Exchange / Authorization Server
    ▼
[Authorization Server (Specialized Agentic AS / IBM Verify / Keycloak)]
    │ Validates JWT-SVID against Vault trust bundle
    │ Checks: user context, agent identity, Agent Registry status,
    │         requested resource, action, RAR claims, ceiling policy
    │ Mints short-lived OAuth 2.0 JWT (authorization_details, correct aud)
    ▼
[Agent holds OAuth JWT — short-lived, scoped, per-task]
    │
    │ 3. Agent presents OAuth JWT to Vault per-request (no Vault token)
    ▼
[Vault — Resource Server]
    │ Validates JWT: issuer, audience, signature, expiry
    │ Evaluates RAR authorization_details
    │ Checks Agent Registry: is agent registered and active?
    │ Policy intersection: subject baseline ∩ agent ceiling
    │ Allows or denies
    ▼
[Audit: user → agent → tool → resource → action → decision]
```

### Why Vault token must be skipped

For agents, a Vault token is the wrong abstraction:

- It is a Vault-internal session object, not a portable identity credential.
- It requires the agent to store and manage a stateful session — a standing credential that can be stolen or replayed across contexts.
- It does not carry delegation context (which user? which task? what RAR claims?) in a standards-based way that the audit layer can interpret.
- The per-request OAuth JWT model (Vault as OAuth resource server) is already built and in private preview — it is the correct architecture for agents, and it does not produce a Vault token.

### Current state and gap

| Step | Available today | Gap |
|---|---|---|
| Node attestation → JWT-SVID | Partial (SPIFFE secrets engine; TPM attestation in development) | x509 SVID, SVID-direct path (no Vault token) |
| JWT-SVID → Token Exchange (AS) | Depends on IDP capability (IBM Verify / Keycloak POC path) | No HashiCorp-native AS; IDP RAR support varies |
| OAuth JWT → Vault resource server (no token) | **Available** — private preview (OAuth resource server + Agent Registry) | GA, RAR schema stabilization |
| Audit trail (user → agent → tool → decision) | **Available** — private preview (audit JWT metadata) | Richer agentic event model (Audit V2) |

---

## Use-Case 2: Traditional NHIs on On-Premises VMs

### The problem

A service running on a Linux VM on VMware or Nutanix needs to authenticate to Vault and access secrets. The current pattern — AppRole — requires distributing a static secret ID to the workload before it starts. That is Secret Zero: the credential that protects the first credential.

The goal is to replace AppRole with a workflow where the VM proves its hardware identity through its TPM, and Vault issues an identity credential based on that proof — with no static secret pre-placed on the host.

### The workflow — today (Vault token output)

```
[Vault Agent on VM]
    │
    │ 1. Node attestation (TPM 2.0 EK cert + quote)
    │    EK pre-registered by platform admin in Vault
    ▼
[Vault Server]
    │ Validates EK against registered host
    │ Issues certificate (leaf cert, TPM-bound private key)
    ▼
[Vault Agent holds TPM-bound certificate]
    │
    │ 2. Cert auth login to Vault
    ▼
[Vault Server]
    │ Verifies certificate chains to TPM workflow issuer
    │ Issues Vault token with mapped policies
    ▼
[Workload uses Vault token to access secrets]
    │
    ▼
[Audit: host → certificate → login → token → secret access]
```

This is what ships with TPM auth (Vault 2.1). The Vault token is the output. That is acceptable for this use-case in the near term.

### The workflow — north star (SVID-direct output)

```
[Vault Agent on VM]
    │
    │ 1. Node attestation (TPM 2.0 EK cert + quote)
    ▼
[Vault SPIFFE Server]
    │ Validates EK, issues node JWT-SVID directly
    │ (No Vault token — SVID is the identity artifact)
    ▼
[Vault Agent caches SVID, delivers to workload]
    │
    │ 2. Workload uses SVID for:
    │    a. mTLS with other services (x509-SVID, Envoy / service mesh)
    │    b. Re-presentation to Vault resource server (OAuth resource server model)
    │    c. Token exchange at an AS for downstream system access
    ▼
[No static credential anywhere in the chain]
```

### What happens after the SPIFFE ID is issued — the proper identity system answer

This is where Vault must answer the same question that SPIRE, Teleport, and cloud IAM systems answer: **what is the SVID for, and what can it do?**

#### What SPIRE does

SPIRE issues the SVID and stops. It does not:
- Enforce access control based on the SVID.
- Govern what the workload can do with its identity.
- Provide a policy engine.
- Give visibility into which identities accessed what.
- Rotate dynamic secrets based on the identity.

Workloads that use SPIRE typically take the SVID and use it in one of these ways:
1. **mTLS** — present the x509-SVID as a TLS client cert; other services validate it against the trust bundle.
2. **JWT-SVID to another system** — present the JWT-SVID to another service (e.g., another Vault cluster via the SPIFFE auth method, or a cloud IAM endpoint).
3. **SPIFFE federation** — trust bundles are exchanged between domains; workloads across trust boundaries mutually authenticate.

SPIRE itself has no authorization layer. Authorization is entirely the responsibility of the consuming system.

#### What competitors do after SVID issuance

| Player | After SVID issuance |
|---|---|
| **SPIRE (open source)** | Nothing — SVID is delivered, authorization is the workload's problem. Strong on identity issuance; no policy engine, no secrets, no day-2 visibility. |
| **Teleport** | Issues SVIDs and also brokers SSH/RDP/DB access using the identity. Identity and access are coupled — the SVID is the ticket into Teleport-managed resources. Strong on access brokering; less general-purpose for non-Teleport-managed systems. |
| **Cofide** | Issues SVIDs (full SPIFFE spec, including x509 and federation) and provides a managed control plane for identity governance. Positioning: "SPIRE without SPIRE to operate." Focuses on the identity layer; does not provide a secrets engine or general authorization. |
| **Aembit** | Focuses on workload-to-workload credential brokering (service-to-SaaS). Automatically injects credentials into workload calls. Uses identity as the input but focuses on credential delivery, not SVID-based mTLS. |
| **Cloud IAM (AWS, GCP, Azure)** | Platform-issued workload identity (not SPIFFE) → short-lived cloud-native credentials. Authorization is via cloud IAM roles and policies. Works within the cloud perimeter; no on-prem equivalent. |
| **Vault (current + roadmap)** | Issues SVID → workload uses SVID to (a) authenticate to Vault via SPIFFE auth method, (b) get dynamic secrets/credentials, (c) participate in SPIFFE federation with other clusters. Authorization is via Vault's HCL policy engine — the most capable policy layer in this comparison. |

#### What Vault does that no one else does

After the SVID is issued, Vault's unique value is:

1. **Dynamic credentials from the SVID identity.** A workload presents its SVID to Vault (via SPIFFE auth method or OAuth resource server), and Vault issues dynamic database credentials, cloud credentials, PKI certificates, SSH certs — short-lived, scoped, auto-rotated. No other SPIFFE provider also has a secrets engine.

2. **Fine-grained HCL policy bound to the SVID identity.** Vault's policy engine is path-based, entity-aware, and deeply expressive. The SVID maps to a Vault Identity entity; policies govern exactly what that identity can access. SPIRE has no equivalent. Teleport has coarser brokering controls. Cofide and Aembit don't own the authorization layer.

3. **Managed inventory + audit.** Vault's audit log records every access. The SPIFFE ID is the identity thread through every audit event. No other SPIFFE provider has both the issuance layer and the audit layer in the same control plane.

4. **Multi-cloud + on-prem in one policy engine.** A workload with a Vault-issued SVID can use that identity to get AWS credentials, GCP credentials, Azure credentials, and database credentials — all from the same control plane, all governed by the same policy. This is Vault's structural differentiator in a hybrid estate.

### The proper answer for a traditional NHI after SVID issuance

For a Linux VM workload, the correct post-SVID flow is:

```
SVID (issued from TPM attestation)
    │
    ├── mTLS with other services → trust bundle validates SVID (no callback to Vault)
    │
    ├── Authenticate to Vault (SPIFFE auth method or OAuth resource server)
    │       → Vault maps SVID to Identity entity
    │       → Vault applies HCL policies for the workload
    │       → Vault issues dynamic credentials (DB, cloud, PKI, etc.)
    │
    └── SPIFFE federation → SVID accepted by other Vault clusters or SPIFFE-aware systems
```

The SVID is portable. It is the workload's cryptographic identity. Every system that trusts Vault's trust bundle can validate it without calling back to Vault. Vault's policy engine governs what that identity can access within Vault's resource space.

This is the answer to "what do other SPIFFE providers do?" — they stop at the SVID. Vault continues into secrets, dynamic credentials, policy enforcement, and audit. That is the product differentiation.

---

## How the two use-cases inform the milestone sequence

| Milestone | Use-Case 1 (Agents) | Use-Case 2 (NHIs on-prem) |
|---|---|---|
| **M0 (now)** | JWT-SVID + OAuth resource server works today for agents with an existing JWT | JWT-SVID issuance available but requires prior Vault auth; no TPM attestation yet |
| **M1 (October)** | TPM attestation gives agents a hardware-rooted identity; Vault token still the output | TPM auth ships — Secret Zero eliminated; Vault token is the output (acceptable) |
| **M2 (January)** | SVID-direct path: no Vault token; x509 SVID enables mTLS for agent sidecars | x509 SVID from attestation; workload can use SVID for mTLS and for Vault SPIFFE auth |
| **M3 (April)** | Workload API socket: agents get SVID transparently; per-process identity for agent isolation | Same — multi-workload per host with distinct identities; Workload API socket |

---

## Open questions specific to each use-case

### Use-Case 1: Agents
- [ ] Which AS is the near-term bridge? IBM Verify token exchange capability vs. Keycloak POC — what is the readiness of each for producing RAR-shaped JWTs from a JWT-SVID input?
- [ ] How does the Agent Registry check gate the SVID → AS → Vault flow? Does the AS check registry status, or does Vault enforce it at resource time only?
- [ ] What RAR `authorization_details` schema does Vault enforce? Is it published as a contract for AS implementers?

### Use-Case 2: Traditional NHIs
- [ ] At what milestone does the Vault token get removed from the TPM attestation output? Is that M2 (January) or later?
- [ ] For customers already using SPIRE: how do they migrate to Vault as the SPIFFE provider without a flag-day cutover? Is SPIFFE federation the bridge?
- [ ] For multi-workload hosts (the dominant on-prem pattern): what is the right workload attestation selector model for Vault Agent? (UID/GID/binary path matching SPIRE's Unix attestor?)

---

## Relationship to other docs

| Document | Relationship |
|---|---|
| [`strategy/vault-as-spiffe-provider-milestones.md`](vault-as-spiffe-provider-milestones.md) | Milestone sequence. This document maps two specific use-cases onto those milestones. |
| [`strategy/vault-as-spiffe-provider-priorities.md`](vault-as-spiffe-provider-priorities.md) | Engineering priorities. The two use-cases drive different urgency for each priority. |
| [`agentic-workflow-revised.md`](../agentic-workflow-revised.md) | Near-term agent workflow using today's capabilities. Use-Case 1 is the north-star extension of that document. |
| [`strategic-agentic-access-architecture.md`](../strategic-agentic-access-architecture.md) | Four-pillar architecture. Use-Case 1 is the full four-pillar realization; Use-Case 2 uses only Layer 1 (identity) and Layer 3 (resource enforcement). |
| [`tpm-auth/PRD-VLT-2009-TPM-Support-in-Vault--Attestation-Led.md`](../tpm-auth/PRD-VLT-2009-TPM-Support-in-Vault--Attestation-Led.md) | M1 detail for both use-cases. TPM attestation is the shared foundation. |
| [`strategy/use-cases.md`](use-cases.md) | Source JTBD for both use-cases. |
| [`context/reference-docs/spiffe/spire-concepts.md`](../context/reference-docs/spiffe/spire-concepts.md) | SPIRE reference — the competitive baseline for the "what happens after SVID issuance" section. |
