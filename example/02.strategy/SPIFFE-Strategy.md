# Vault + SPIFFE: A Strategy for Decentralized Workload Identity

**Framework**: Good Strategy Bad Strategy (Rumelt)  
**Date**: May 2026  
**Author**: Kartik Lunkad

## Diagnosis

- Workload identity remains a core unresolved problem in enterprise infrastructure security.
  - Cloud providers solve workload identity only inside their own perimeters.
  - Hybrid, multi-cloud, and on-premises workloads still fall back to static credentials, AppRole patterns, certificates, or other Secret Zero workarounds.
- SPIFFE is the strongest open standard for portable workload identity.
  - A SPIFFE ID gives workloads a universal identity format across clouds, platforms, and hardware.
  - It can be issued by SPIFFE-compliant authorities, verified cryptographically, mapped to downstream IAM systems, and used as a policy anchor.
  - SPIFFE is CNCF-graduated and aligned with zero trust guidance such as NIST SP 800-207A.
- SPIFFE adoption has stalled because of operational complexity, not lack of conceptual validity.
  - Running SPIRE requires a separate server, datastore, CA, agents, node attestors, workload registry, federation setup, and operating model.
  - Advanced customers can absorb that complexity; most Vault customers cannot.
- The market is split into two groups.
  - SPIFFE-expert customers already running SPIRE want deeper Vault integration for policy enforcement, secrets delivery, and PKI authority.
  - SPIFFE-naive customers want the outcome of portable, cryptographic workload identity without deploying and operating SPIRE.
- The on-premises gap is especially important.
  - Many enterprise workloads still run outside public cloud and lack access to AWS IAM Roles, GCP Workload Identity Federation, or Azure Managed Identity.
  - TPM 2.0 is widely available in modern servers but underused as a workload identity root of trust.
- TPM auth with attestation can solve Secret Zero for on-prem workloads, but the identity currently remains Vault-internal.
  - TPM-authenticated workloads become Vault entities, but they do not automatically receive a portable SPIFFE identity.
  - Without SPIFFE, TPM identity cannot easily flow to Envoy, service meshes, cloud IAM exchanges, or other SPIFFE-aware systems.
- Core diagnosis:
  - Vault is central to enterprise secrets management, but not yet central to workload identity.
  - SPIFFE is the standard that can make Vault central to both.
  - The strategic opening is to make SPIFFE simple enough for mainstream Vault customers while remaining compatible with customers already using SPIRE.

## Guiding Policy

- Make Vault the SPIFFE control plane for workload identity.
  - For most customers, Vault should remove the need to deploy and operate standalone SPIRE infrastructure.
  - For customers already running SPIRE, Vault should become the deepest integration partner for PKI, federation, policy enforcement, and secrets delivery.
- Treat SPIFFE as the identity and Vault as the authority.
  - Vault should issue SPIFFE SVIDs natively, including X.509 and JWT SVIDs.
  - Vault PKI should serve as the signing authority where appropriate.
  - SPIFFE IDs should become canonical workload identities in Vault, not only aliases mapped after authentication.
- Simplify SPIFFE for the majority without weakening it for expert users.
  - SPIFFE-native customers should get federation, trust bundle management, and Workload API compatibility.
  - SPIFFE-naive customers should get cryptographic workload identity through Vault Agent, TPM attestation, and existing Vault operating patterns.
  - Both paths should converge on the same universal SPIFFE ID model.
- Use hardware root of trust as an origin for SPIFFE identity.
  - TPM attestation should produce SPIFFE IDs natively.
  - On-prem workloads should receive portable, hardware-rooted identities that can be used beyond Vault.
- Use SPIFFE as the universal pass-through to downstream IAM systems.
  - A workload should present a SPIFFE identity once and exchange it through Vault for platform-specific short-lived credentials.
  - Vault becomes the translator between universal workload identity and downstream systems such as AWS, GCP, Azure, and Kubernetes.
- Explicit non-goal:
  - Do not build a SPIRE replacement.
  - Instead, make SPIFFE usable for customers who will not deploy SPIRE, while improving integration for customers who already have.

## Coherent Actions

- **1\. Issue native X.509 SVIDs from Vault.**
  - Extend the SPIFFE secrets engine to issue X.509 SVIDs directly using Vault PKI.
  - Embed SPIFFE IDs in URI SANs and support short-lived certificate rotation.
  - Allow customers to issue SVIDs without putting a SPIRE server in the path.
  - Primary customers: Kubernetes workloads using Vault Agent and non-orchestrated Linux workloads.
- **2\. Make SPIFFE auth a first-class, widely available capability.**
  - Move SPIFFE auth from Enterprise-only positioning to general availability.
  - Support SPIFFE path pattern matching such as spiffe://trust-domain/region/\*/service/\*.
  - Enable wildcard or glob-based role mapping for workload families.
  - Support dynamic entity creation on first SPIFFE-authenticated login, seeded by SVID claims.
  - Reduce the provisioning burden that blocks SPIFFE adoption at scale.
- **3\. Connect TPM attestation to SPIFFE identity.**
  - Convert TPM-attested Vault entities into native SPIFFE identities such as spiffe://&lt;trust_domain&gt;/node/tpm/&lt;ek_sha256&gt;.
  - Establish the chain: TPM EK → attestation-verified certificate → Vault entity → SPIFFE SVID.
  - Make on-prem TPM-authenticated workloads portable across SPIFFE-aware systems.
  - Position TPM auth as part of the broader workload identity strategy, not an isolated Vault auth method.
- **4\. Enable SPIFFE-to-cloud IAM exchange through Vault.**
  - Use Vault to verify SVIDs, resolve entities and policies, and return platform credentials.
  - Support exchanges such as:
    - AWS: X.509 SVID → IAM Roles Anywhere → STS credentials.
    - GCP: JWT SVID → Workload Identity Federation → access tokens.
    - Azure: JWT SVID → Workload Identity → access tokens.
    - Kubernetes: SPIFFE ID → Kubernetes service account token or TokenReview-based mapping.
  - Make SPIFFE the common identity input for dynamic credentials across clouds and platforms.
- **5\. Make Vault Agent a SPIFFE Workload API endpoint.**
  - Expose a local SPIFFE Workload API socket from Vault Agent.
  - Allow SPIFFE-native workloads, sidecars, gRPC services, Envoy, and service meshes to retrieve SVIDs from Vault Agent.
  - Enable migration from SPIRE Agent to Vault Agent where customers prefer Vault as the backing authority.
  - Let customers consume SPIFFE-native patterns without operating SPIRE.
- **6\. Support SPIFFE-native policy authoring and audit.**
  - Allow Vault policies to reference SPIFFE path patterns as first-class identity subjects.
  - Make SPIFFE IDs visible in policy review and audit logs alongside Vault entities.
  - Reduce the need for operators to reason through internal entity and group translations.
  - Make SPIFFE the identity used for authentication, governance, and auditability.
- Expected strategic outcome:
  - Near term: on-prem workloads get hardware-rooted SPIFFE identities; Kubernetes workloads can adopt SPIFFE through Vault Agent; SPIFFE auth becomes easier to adopt.
  - Medium term: Vault Agent supports the Workload API; SPIFFE-identified workloads exchange identity for short-lived cloud credentials; SPIFFE IDs become visible policy and audit anchors.
  - Long term: Vault becomes the practical answer for mainstream enterprise SPIFFE adoption and the deepest integration point for customers already using SPIRE.