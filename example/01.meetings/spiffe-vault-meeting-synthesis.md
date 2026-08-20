# SPIFFE & Vault — Meeting Synthesis

**Date:** May 26, 2026  
**Participants:** Kartik Lunkad, Scott Miller, Lizzy Forward, Mohan Rao (joined late)  
**Duration:** ~38 minutes

---

## Current State of Vault's SPIFFE Story

There are two distinct sides to Vault's SPIFFE story: Vault as an **identity provider** (minting SVIDs) and Vault as an **identity consumer** (auth method).

### Vault as SPIFFE Identity Provider (~95% complete)

- The PKI engine can mint X.509 SVIDs by templating the Subject Alternative Name (SAN) field to render a valid SPIFFE ID
- **Gap: Trust bundle hosting.** SPIFFE clients expect the issuing CA to host the trust bundle in a queryable format. Vault does not support this today.
- **Fix:** Move SVID minting from the PKI engine to the **SPIFFE Secrets Engine**, which is simpler and purpose-built for this. The SPIFFE Secrets Engine would support trust bundle hosting and complete the provider story. This was identified as the key near-term engineering task.

### Vault as SPIFFE Identity Consumer (complete)

- The SPIFFE auth method accepts JWT-SVIDs and X.509 SVIDs and exchanges them for a Vault token
- No known gaps; customers using SPIFFE auth have not complained about the token-exchange model

---

## Vault vs. SPIRE

Vault does approximately **90% of what SPIRE does**. The one gap is **workload attestation**.

| Capability | SPIRE | Vault |
|---|---|---|
| Node attestation (AWS, Azure, GCP, etc.) | Yes | Yes (via auth methods) |
| Workload attestation (per-process on a VM) | Yes | No (in progress via TPM work) |
| SVID minting | Yes | Yes (PKI engine; soon SPIFFE engine) |
| Dynamic secrets / PKI / KV | No | Yes |
| Trust bundle hosting | Yes | Not yet |

**The workload attestation gap** means Vault cannot today differentiate multiple workloads running on the same VM — it can only attest at the machine level. This is being addressed sequentially:

1. Node attestation via TPM (in progress)
2. Workload attestation built on top (future)

**Kubernetes exception:** The Kubernetes auth method already operates at workload granularity because Kubernetes service account tokens are scoped to a pod (not a node). So workload attestation is effectively solved in Kubernetes environments today.

**SPIRE is not worth emulating directly.** SPIRE is a series of distributed processes, not an API. Red Hat/IBM also ships a supported SPIRE product. The better path is tight Vault ↔ SPIRE integration for customers who want both, rather than trying to implement SPIRE inside Vault.

---

## Customer Segmentation

Three customer camps emerged in the discussion:

**Camp 1 — SPIFFE-native**  
Deeply understands SPIFFE and wants to standardize identity across their org using SVIDs. They want Vault to both mint SVIDs for their workloads and accept SVIDs as authentication credentials.

**Camp 2 — Secret Zero seekers**  
Want a workload to bootstrap its own credentials without a pre-placed secret. They may not know or care about SPIFFE specifically, but SPIFFE is a good solution for them. Key example: Fidelity's IM director noted that AWS has ARNs, Azure has managed identity, but on-premise has nothing agnostic — SPIFFE solves exactly this cross-environment identity problem.

**Camp 3 — Accidental SPIFFE consumers**  
Integrating with SPIFFE-adjacent technologies (e.g., Istio, service mesh) but don't understand SPIFFE itself. These customers need education, not necessarily a new product feature.

Camps 2 and 3 may overlap; both have the "intimidating to adopt" problem.

---

## The Education / Enablement Problem

This was the dominant theme of the second half of the meeting. Even the SE community finds Vault's SPIFFE story confusing because SPIFFE appears in multiple places:

- PKI engine (SVID minting today — complicated, not purpose-built)
- SPIFFE Secrets Engine (SVID minting — simpler, but not where customers land first)
- SPIFFE auth method (identity consumption — conceptually separate from minting)

**Core confusion:** customers (and SEs) conflate the two sides — minting SVIDs vs. using SVIDs to authenticate. These are intentionally independent because customers may need only one side:

- Customers with SPIRE already don't need Vault to mint SVIDs; they just need the auth method
- Customers with SPIFFE consumers (Istio) but no SPIRE need Vault to mint SVIDs

**What's needed:**

1. **Diagrams and learn materials** that clearly separate the two sides and when each applies
2. **SE enablement** — a clear decision framework: "Use Vault instead of SPIRE when..." / "Use Vault auth method when..."
3. **UX guidance** in the product (onboarding flows, wizard-style setup, reporting)
4. **Vault Agent** — better first-class SPIFFE support (sample templates, simplified config)

---

## Emerging: Tokenless Auth (Agentic / NHI Team)

A new auth method is being built by the NHI/Identity team that does **not** return a Vault token. Instead, a JWT is provided per-request directly (analogous to how mTLS works — the credential IS the request, no exchange step).

- Currently supports OIDC JWTs; SPIFFE JWTs and X.509 SVIDs should follow
- Docs PR being published imminently; team should review and align
- This is architecturally new for Vault — all prior auth methods required a token exchange
- If SPIFFE SVIDs are accepted per-request without exchange, it completes the "SPIFFE-native" workflow end to end

**Action:** Confirm exact name of this auth method with Claudia / NHI team and assess X.509 SVID support timeline.

---

## Strategic Context

The bigger goal behind all this work: **positioning Vault as an identity product, not just secrets management.** SPIFFE is one lever toward that positioning. The identity team owns the broader NHI story; the Vault team's role is to:

1. Ensure Vault participates in SPIFFE ecosystems as both provider and consumer
2. Articulate clearly where Vault replaces SPIRE vs. where it integrates with it
3. Reduce adoption friction enough that customers in camps 2 and 3 can self-serve

---

## Key Gaps & Action Items

| Area | Gap | Owner / Next Step |
|---|---|---|
| SPIFFE Secrets Engine | Trust bundle hosting not supported | Engineering — completes provider story |
| SVID minting UX | Currently routed through PKI engine (complex) | Engineering — move to SPIFFE engine |
| Workload attestation | Cannot distinguish workloads on same VM | Roadmap — follows TPM/node attestation |
| Tokenless auth | New method supports OIDC JWT; SPIFFE JWT + X.509 not yet confirmed | Kartik to confirm with Claudia |
| Vault Agent | No first-class SPIFFE templates or simplified config | Product + docs — sample templates |
| Enablement | No clear SE decision framework or diagrams | Kartik + Lizzy — content work |
| Product positioning | What does SPIFFE/SPIRE work buy Vault in the identity market? | Research / GTM homework |

---

## Key Insight: Why SPIFFE's PKI Model Matters

When Vault mints an SVID, the consuming system trusts the SVID by verifying the CA signature — it never calls back to Vault to verify the identity. This is standard PKI: trust is distributed via the trust bundle download, not via runtime verification calls. This holds for both X.509 SVIDs (certificate chain) and JWT-SVIDs (public key from trust bundle).

This means SPIFFE scales better than token-based systems for identity propagation across large, heterogeneous environments.
