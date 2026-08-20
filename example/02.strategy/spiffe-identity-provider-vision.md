<!--
Document Metadata
=================
Title:       Vault as a SPIFFE Identity Provider — Vision
Doc Type:    VISION
Status:      WIP / Draft
Product:     Vault
Summary:     North-star vision for Vault as the SPIFFE Identity Provider for every workload and agent — a managed control plane spanning the full identity lifecycle: attestation-rooted issuance, trust distribution, automated rotation/revocation, and fleet-wide visibility and reporting. The operational reach of SPIFFE without the burden of operating SPIRE.
Owner:       Kartik.Lunkad@ibm.com
Created:     June 9, 2026
Modified:    June 9, 2026
-->

# Vault as a SPIFFE Identity Provider — Vision

**Companion to:** [`strategy/MEMO-SPIFFE--Vault-Strategy.md`](MEMO-SPIFFE--Vault-Strategy.md) — this is the narrative for "Complete Vault's SPIFFE identity provider story" and "first-class machine identity provider." Scope here is the **provider** side (minting and managing identities). The **consumption / authorization** side (Agent Registry ceiling, RAR transaction tokens, resource-server enforcement) is the downstream story — see [`agent-preview-capabilities/SYNTHESIS.md`](../agent-preview-capabilities/SYNTHESIS.md).

---

## Vision statement

> **Vault is the SPIFFE Identity Provider for every workload and agent.** It is the managed control plane that replaces a secret with a verifiable, portable, hardware-rooted identity — and then manages that identity across its whole lifecycle: **rooted** in attestation, **issued** as a short-lived SVID, **verifiable anywhere** through a hosted trust bundle, **rotated and revoked** automatically, and **visible and reportable** across the entire fleet. The operational reach of SPIFFE without the burden of operating SPIRE.

**Taglines under test:**
- *Identity, not secrets — managed for life.*
- *Every workload and agent, a verifiable identity. Every identity, accounted for.*
- *SPIFFE without SPIRE to run.*

---

## The identity lifecycle (the pillars)

Vault owns the full lifecycle of a workload/agent identity, not just the moment of issuance:

| Stage | What Vault does | Why it matters |
|---|---|---|
| **1. Root** | Establish trust with no pre-placed secret — TPM 2.0, cloud metadata, or k8s SA attestation | Eliminates Secret Zero; the identity is earned, not distributed |
| **2. Issue** | Mint SVIDs (X.509-SVID + JWT-SVID) with the SPIFFE ID templated to the workload/agent; short-lived by default | One portable identity across cloud, on-prem, and mesh |
| **3. Distribute** | Host the trust bundle (X.509 roots + JWKS) so any verifier validates **offline**, with no callback to Vault | Trust scales by signature, not by runtime lookup — the property that lets SPIFFE span heterogeneous environments |
| **4. Manage** | Automated rotation, renewal, and revocation across the identity's lifetime | Short-lived credentials become operationally free instead of a burden |
| **5. See** | Fleet-wide **visibility & reporting** — a live inventory of every identity, its root of trust, owner, freshness, and usage | The day-2 layer SPIRE doesn't have; the answer to "show me every agent identity and who owns it" |

```
        ┌──────────────────────────────────────────────────────────────┐
        │                 VAULT — SPIFFE IDENTITY PROVIDER               │
        └──────────────────────────────────────────────────────────────┘

  workload / agent
        │
        │ 1. ATTEST  (TPM 2.0 / cloud metadata / k8s SA)   ── no secret zero
        ▼
   ┌─────────┐  2. ISSUE     template SPIFFE ID, mint SVID
   │  Vault  │  ──────────────────────────────►  spiffe://corp/agents/deploy-bot
   │ SPIFFE  │                                    (X.509-SVID + JWT-SVID, short-lived)
   │ engine  │
   └─────────┘  3. DISTRIBUTE  host trust bundle (X.509 roots + JWKS)
        │        ──────────────────────────────►  any verifier validates offline
        │
        │ 4. MANAGE   rotate · renew · revoke  (automated)
        ▼
   ┌────────────────────────────────────────────────────────┐
   │ 5. SEE — lifecycle visibility & reporting               │
   │   fleet inventory · root of trust · owner · freshness   │
   │   attribution · compliance reports · revocation         │
   └────────────────────────────────────────────────────────┘
```

---

## Lifecycle management & visibility (the day-2 layer)

This is the component that turns "Vault can mint SVIDs" into "Vault is the managed identity provider" — and it is where Vault out-positions SPIRE.

**What it provides:**
- **Identity inventory** — a single view of every SPIFFE identity Vault has issued: SPIFFE ID, the workload/agent it maps to, its root of trust (which TPM / cloud / k8s attestation), owner, trust domain / namespace.
- **Freshness & posture** — which identities are active, expiring, stale, or unused; rotation status across the fleet.
- **Attribution & audit** — who or what authenticated as which identity, when, and for what — tied back to the issuance event (connects to the audit JWT metadata already in the preview).
- **Governance reporting** — exportable, compliance-ready reports: how many agents/workloads, owned by whom, rooted in what; drift from policy.
- **Revocation & kill-switch** — see and act on a compromised identity across the whole fleet from one place.

**Why it's a differentiator, not a feature:**
- **SPIRE issues identities but gives you no managed inventory, no reporting, no fleet view** — it is a set of distributed processes, not a control plane. This is precisely the operational burden the strategy memo names ("remove the need to deploy and operate standalone SPIRE infrastructure").
- For the regulated customers driving the demand (the 10+ banks in the FR), *"show me every machine and agent identity, its root of trust, and who owns it"* is a hard requirement that neither SPIRE nor any single cloud IAM answers across hybrid environments.
- Vault is **already** a managed, audited, API-driven control plane with a UI. Extending that to SPIFFE means Vault doesn't merely match SPIRE on issuance — it exceeds it on day-2. The provider story and the visibility story are the same story.

---

## Why this is uniquely Vault's to tell

1. **Managed lifecycle + visibility is the SPIRE gap.** Anyone can issue an SVID. Almost no one gives you a governed, reportable inventory of identities across cloud and on-prem. That is the wedge.
2. **Hardware-rooted issuance.** On-prem, the SPIFFE ID is rooted in TPM attestation (VLT-2009) — a chain of custody from silicon to identity that cloud-native IAM and stock SPIRE deployments don't provide for hybrid estates.
3. **It resolves the field's confusion.** Minting vs. consuming SVIDs stops being two disconnected halves: this doc is the *provider* half (issue → manage → see), and it hands off cleanly to the consumer/authorization half.

---

## Downstream: from identity to authorization

The provider story ends at a managed, verifiable identity. What that identity *enables* is a separate (adjacent) story, already materializing in the agentic private preview:

```
SVID  →  Authorization Server (RAR / transaction token, on-behalf-of)
      →  Vault Resource Server + Agent Registry ceiling  →  enforced, bounded, audited access
```

Detail and the open "is Vault also the Authorization Server?" decision live in [`agent-preview-capabilities/SYNTHESIS.md`](../agent-preview-capabilities/SYNTHESIS.md). Keeping the two stories distinct is deliberate — many customers need only the provider side (they already have SPIRE consumers, or their own authorization layer).

---

## What must be true to ship this

| Need | Status / owner |
|---|---|
| **Trust-bundle / JWKS hosting** — the core "Distribute" gap; without it, identities aren't verifiable offline | Known SPIFFE-engine gap — engineering, near-term |
| **X.509-SVID support** alongside JWT-SVID | Roadmap (memo lists for the provider story) |
| **Lifecycle automation** — rotation/renewal/revocation surfaced as first-class | Build |
| **Visibility & reporting layer** — identity inventory, posture, compliance reports | New — the day-2 differentiator; scope this deliberately |
| **Onboarding UX** — wizard/intro flows so setting up SPIFFE minting is self-serve | Memo coherent action (UX intro & onboarding) |
| **Attestation breadth** — TPM (2.1), cloud, k8s as roots of trust | TPM auth in Vault 2.1; others via existing auth methods |

---

## Relationship to existing strategy

- **SPIFFE & Vault Strategy memo** — this vision is the narrative for the memo's "Complete Vault's SPIFFE identity provider story" coherent action and its "first-class machine identity provider" guiding policy.
- **NHI strategy** (`frd-nhi-vault.md`, `use-cases.md`) — the identity-provider foundation under the NHI category.
- **TPM / VLT-2009** — supplies the hardware root for on-prem SPIFFE identities; the strongest form of the "Root" pillar.
- **Agentic private preview** (`agent-preview-capabilities/`) — the downstream consumption/authorization side; its audit JWT metadata is also the raw material for the "See" pillar's attribution and reporting.
