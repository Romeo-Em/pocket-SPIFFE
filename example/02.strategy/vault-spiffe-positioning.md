# Vault SPIFFE Positioning — The Infrastructure Identity Layer

_Author: Kartik Lunkad · Created: 2026-07-23 · Status: Draft_

---

## The positioning in one sentence

> **Vault is the SPIFFE identity authority for workloads and agents that need infrastructure-rooted identity — on-premises, cross-cloud, or anywhere a cloud IAM or IdP cannot reach.**

This is distinct from what Okta, Entra, or AWS IAM do. They issue credential-based identity for registered clients within their own perimeter. Vault issues **attestation-based identity** rooted in the infrastructure the workload runs on — and that identity is portable everywhere.

---

## The three addressable scenarios

### Scenario 1: Agent born in a CSP or IdP, needs access to on-prem or cross-cloud systems

**The problem:**
An agent created in AWS Bedrock, Entra, Vertex, or Okta has a cloud-native identity (IAM ARN, managed identity, service account, Okta agent record). That identity is valid within the cloud perimeter. The moment the agent needs to access:

- An on-premises system (legacy database, internal API, Vault cluster on bare-metal)
- A resource in a different cloud or organization
- A service mesh or Envoy proxy that speaks mTLS but not AWS IAM

...the cloud-native identity stops working. There is no portable identity primitive. The agent either falls back to static credentials or requires custom federation configuration for every counterparty.

**What Vault adds:**
The agent presents its cloud-native token to `vault-spiffe-server`. Vault validates it (via the provider's OIDC/JWT endpoint), maps it to a Vault Identity entity (pre-provisioned by RFC-VLT-2027 sync), and issues a JWT-SVID or x509-SVID. That SVID is now usable anywhere that trusts Vault's trust bundle — on-prem, other clouds, service meshes, other organizations — with no further federation setup per system.

**SPIFFE's role:** Identity translation and portability. The cloud-native identity bootstraps into Vault; the SVID is the portable artifact.

---

### Scenario 2: Agent born on-premises (bare-metal, VMware, Nutanix)

**The problem:**
A workload running on a VMware VM, a bare-metal server, or a Nutanix cluster has no cloud platform beneath it. There is no IAM role to assume, no managed identity to attach, no metadata API to call. The only root of trust available is the TPM 2.0 chip in the hardware. Every current alternative — AppRole, cert auth, static API keys — requires distributing a credential to the workload before it runs. That is Secret Zero.

**What Vault adds:**
Vault Agent runs on the node and performs TPM attestation to `vault-spiffe-server`. The server validates the TPM Endorsement Key against a pre-registered host record and issues a JWT-SVID directly. No credential is distributed. No Secret Zero. The hardware proves itself.

**SPIFFE's role:** Vault is the **source of identity**, not a translator. The SVID is the first and only identity credential the workload holds. It is rooted in silicon, not in a distributed secret.

---

### Scenario 3: Agent born on-premises, needs to access cloud resources

**The problem:**
An on-prem workload with a Vault-issued SVID needs to access AWS S3, call an Azure API, or authenticate to a GCP service. Cloud IAMs issue identities from within the cloud — they have no native way to trust an on-prem workload's identity.

**What Vault adds:**
Vault's trust bundle — the OIDC well-known endpoint and JWKS — is the bridge. Cloud IAM systems that support OIDC federation (AWS IAM Roles Anywhere, GCP Workload Identity Federation, Azure Workload Identity) can be configured to trust Vault as an OIDC issuer. The on-prem workload presents its Vault-issued JWT-SVID, the cloud IAM validates it against Vault's trust bundle, and issues short-lived cloud credentials in exchange.

**SPIFFE's role:** Federation bridge. The SVID is the credential that crosses the cloud boundary. Vault's trust bundle is what the cloud IAM trusts. No static cloud credential is needed on the on-prem host.

---

## The two-server model and how it works

```
┌─────────────────────────────────────────────────────────────────────┐
│                      vault-spiffe-server                            │
│                   (infrastructure identity plane)                   │
│                                                                     │
│  • TPM node attestation (on-prem)                                   │
│  • Cloud metadata attestation (AWS IID, GCP token, Azure MSI)       │
│  • Issues JWT-SVIDs and x509-SVIDs                                  │
│  • Serves trust bundle (OIDC well-known + JWKS + x509 CA)           │
│  • Syncs issued identities → vault-resource-server Agent Registry   │
└──────────────────────┬──────────────────────────────────────────────┘
                       │ SVID issued
                       │ identity synced to Agent Registry
                       ▼
           ┌───────────────────────┐
           │  The SVID is portable │
           └───────────────────────┘
                       │
          ┌────────────┼──────────────────────────────────┐
          │            │                                  │
          ▼            ▼                                  ▼
  ┌──────────────┐  ┌──────────────────────────┐  ┌────────────────────┐
  │ Envoy / mesh │  │  Token Exchange / AS      │  │ Cloud IAM          │
  │ (mTLS via    │  │  (IBM Verify / Keycloak)  │  │ (AWS IAM Roles     │
  │  x509-SVID)  │  │                           │  │  Anywhere, GCP WIF,│
  │              │  │  Validates SVID against   │  │  Azure WI)         │
  │  Validates   │  │  Vault trust bundle       │  │                    │
  │  against     │  │  Issues scoped OAuth JWT  │  │  Validates SVID    │
  │  trust bundle│  │  with RAR claims          │  │  against Vault     │
  └──────────────┘  └────────────┬──────────────┘  │  trust bundle      │
                                 │ OAuth JWT         │  Issues cloud creds│
                                 ▼                  └────────────────────┘
                    ┌─────────────────────────────────────────────────────┐
                    │              vault-resource-server                  │
                    │           (governance + enforcement plane)          │
                    │                                                     │
                    │  • Agent Registry (synced from vault-spiffe-server) │
                    │  • OAuth resource server (validates OAuth JWT)      │
                    │  • Ceiling policy intersection                      │
                    │  • Dynamic secrets (DB, cloud, PKI, SSH)            │
                    │  • Full audit trail                                 │
                    └─────────────────────────────────────────────────────┘
```

---

## The trust bundle is the key integration point

For any external system — cloud IAM, another IdP, a service mesh, another organization — to accept Vault-issued SVIDs, it needs one thing: **Vault's trust bundle**.

The trust bundle is a static artifact: a set of CA certificates and JWKS keys that let any verifier validate a Vault-issued SVID **offline**, without calling back to Vault at validation time. Once distributed, validation is local, fast, and works in air-gapped environments.

**What needs Vault's trust bundle:**

| System | What it does with the trust bundle |
|---|---|
| AWS IAM Roles Anywhere | Trusts x509-SVIDs as client certificates for credential issuance |
| GCP Workload Identity Federation | Trusts JWT-SVIDs from Vault as OIDC tokens for service account impersonation |
| Azure Workload Identity | Trusts JWT-SVIDs from Vault as federated credentials |
| Envoy / Istio | Uses x509-SVIDs for mTLS; validates against trust bundle |
| Other Vault clusters | SPIFFE auth method fetches trust bundle from `trust_bundle/web` endpoint |
| Token Exchange AS (Verify / Keycloak) | Validates JWT-SVID `iss` against Vault's OIDC well-known endpoint |
| `vault-resource-server` OAuth profile | Already configured to trust `vault-spiffe-server` as an issuer |

**Distribution:** Vault serves the trust bundle at a stable endpoint. External systems fetch it once and cache it, refreshing periodically. Vault's x509 CA rotation automatically updates the bundle; systems with the endpoint configured pick up the new keys without manual intervention.

---

## Why SPIFFE, not just Okta or a cloud IdP

| Capability | Okta / cloud IdP | Vault SPIFFE |
|---|---|---|
| Agents with no prior credential (on-prem bare-metal) | ❌ Requires a credential to bootstrap | ✅ TPM attestation — no credential needed |
| Identity rooted in hardware | ❌ Credential-based only | ✅ TPM EK is hardware-bound |
| Works in air-gapped / offline environments | ❌ Requires callback to issuer endpoint | ✅ Trust bundle is a static artifact |
| mTLS between services (x509) | ❌ Not a certificate authority for workload identity | ✅ x509-SVID is the native format |
| Cross-cloud identity without per-system federation | ❌ Requires separate federation config per counterparty | ✅ Any system that trusts the bundle accepts the SVID |
| On-prem workload → cloud IAM access without static credentials | ❌ No bridge for on-prem to cloud IAM | ✅ OIDC federation from Vault trust bundle |
| Standard interoperability with service meshes | ❌ Not part of the SPIFFE spec | ✅ Envoy, Istio, SPIRE federation — all speak SVID |

Okta and cloud IAMs are not wrong for the use cases they cover. They are the right choice for agents that live entirely within their perimeter. The gap they all share is the **infrastructure layer**: they cannot reach into bare-metal hardware, and they cannot issue portable identity that works natively outside their own perimeter. That is the gap Vault fills.

---

## What needs to be true for this to work

### vault-spiffe-server must:
- [ ] Issue x509-SVIDs (not just JWT-SVIDs) — required for mTLS, Envoy, and cloud IAM Roles Anywhere
- [ ] Serve a complete trust bundle (x509 CA + JWKS) at a stable, queryable endpoint
- [ ] Sync issued identities to `vault-resource-server` Agent Registry at attestation time (the open gap from the current RFC)
- [ ] Support TPM node attestation (on-prem) — shipping in Vault 2.1
- [ ] Support cloud metadata attestation (AWS, GCP, Azure) — available today via existing auth methods

### External systems must:
- [ ] Be configured to trust Vault's trust bundle (one-time setup per system)
- [ ] For cloud IAM: OIDC federation configured pointing to Vault's well-known endpoint
- [ ] For service meshes: trust bundle distributed to Envoy/Istio config

### The sync gap (on-prem agents only):
For agents born on-prem, RFC-VLT-2027 does not help — there is no external provider to sync from. `vault-spiffe-server` must provision the entity in `vault-resource-server` at attestation time. This requires a provisioning API between the two servers and is the primary open design question for the two-server model.

---

## The competitive moat

No other single vendor provides all three:

1. **Hardware-rooted identity for on-prem workloads** (TPM attestation → SVID)
2. **Portable SPIFFE identity** that cloud IAMs, service meshes, and other organizations can validate without a shared IdP
3. **Governance and enforcement** (Agent Registry ceiling policies, dynamic secrets, audit) that activates once the identity is established

SPIRE provides the identity layer but stops there — no secrets engine, no policy engine, no agent governance. Okta and cloud IAMs provide governance but stop at their own perimeter. Vault is the only system that connects infrastructure-rooted identity to resource-level enforcement across the full hybrid estate.

---

## Relationship to other docs

| Document | Relationship |
|---|---|
| [`strategy/vault-as-spiffe-provider-priorities.md`](vault-as-spiffe-provider-priorities.md) | Engineering priorities for the vault-spiffe-server capabilities needed to make this positioning real |
| [`strategy/vault-as-spiffe-provider-milestones.md`](vault-as-spiffe-provider-milestones.md) | Milestone sequence for shipping these capabilities |
| [`strategy/vault-spiffe-provider-use-cases.md`](vault-spiffe-provider-use-cases.md) | Detailed workflows for each scenario |
| [`strategy/MEMO-SPIFFE--Vault-Strategy.md`](MEMO-SPIFFE--Vault-Strategy.md) | Strategy memo — this document sharpens the positioning angle |
| [`RFC-VLT-2027-Agent-Onboarding.md`](../RFC-VLT-2027-Agent-Onboarding.md) | Agent Registry sync from CSPs/IdPs — solves Scenario 1 onboarding; does not address Scenario 2 on-prem sync gap |
