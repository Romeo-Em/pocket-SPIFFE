

SPIFFE Case Studies — Trends & Patterns
Compiled from SPIFFE/SPIRE Community Days and CNCF webinars · GitHub, HPE, Square,
TransferWise, Uber, Anthem, IBM Research, Frontdoor, Network Service Mesh, Doc.ai
## 1. Key Themes
Six dominant problems drove SPIFFE adoption across every organisation in the dataset.
Eliminating Long-Lived Secrets
The primary motivation. Shared secrets distributed via Ansible, Vault, or scripts were leaking
into logs, heap dumps, and rotation nightmares. SPIFFE replaced them with short-lived, auto-
rotating x.509 SVIDs.
TransferWise GitHub Uber Square Anthem
## Unified Identity Across Hybrid Environments
Every org ran workloads across on-prem data centres, multiple clouds, and Kubernetes clusters.
A single, portable identity standard was needed to span all of them without per-environment
special-casing.
GitHub HPE Square TransferWise Uber
## Multiple Trust Domains
Regulatory (PCI-DSS, GDPR, SOX), organisational (business units), and environment-based
(prod/staging/dev) isolation required separate trust domains that still needed to authenticate to
each other.
TransferWise Square Network Service Mesh Uber
Service Mesh as the Primary Consumer
Envoy/mTLS was the dominant integration surface. SPIFFE IDs replaced manually-issued certs
as the identity backing the service mesh, enabling workload-to-workload auth with no long-lived
key material in services.
TransferWise Square Frontdoor Network Service Mesh GitHub
## Zero Trust / Perimeter Elimination

VPN-connected "squishy" perimeters were the target to replace. SPIFFE-backed attestation
meant a breach of the network perimeter no longer granted lateral movement — every
connection required cryptographic workload proof.
Anthem / Healthcare Doc.ai Uber TransferWise
## Acquisition & Ecosystem Integration
Acquisitions and partner systems brought incompatible identity setups. SPIFFE's extensible
plugin model and federation model allowed incremental adoption without requiring all parties to
migrate into a single system first.
GitHub HPE (Scytale acquisition)
## 2. Implementation Patterns
How organisations actually wired SPIFFE/SPIRE into their stacks — grouped by pattern type.
Pattern A — Envoy mTLS + SPIFFE ID Header (most common)
Services talk plain-text to local Envoy. Envoy upgrades to mTLS, validates the remote SPIFFE
SVID, and injects a header with the validated SPIFFE ID for the receiving service to use for
authorisation. No long-lived key material in the service itself.
TransferWise Square Frontdoor GitHub
Pattern B — SPIRE Agent Baked into Node Image (fleet-scale enforcement)
SPIRE agents are baked into a base image and deployed fleet-wide, ensuring every host has an
agent present. A low-level registrant service auto-creates SPIRE registrations. Removes reliance
on individual teams to opt in.
Uber GitHub (systemd daemon approach)
Pattern C — Offline CA → AWS Private CA → SPIRE Upstream CA (regulated multi-trust-
domain)
An offline root CA signs intermediates for each trust domain. Each intermediate is loaded into
AWS ACM Private CA with name constraints, and SPIRE server uses that PCA as its upstream
CA. Compromising one SPIRE server cannot issue certs for another trust domain.
TransferWise
Pattern D — Kafka Auth via SPIFFE Java Library

Java SPIFFE library on both Kafka client and broker. The Kafka ACL principal is populated
from the x.509 SVID. Envoy proxy explored as a transparent path for non-Java clients to avoid
embedding the SPIRE client library in every service.
TransferWise
Pattern E — Custom Node Attestation via Plugin Framework
Rather than waiting for upstream attestation plugins, organisations used SPIRE's plugin
framework to build attestors against their own internal APIs or node identity systems (e.g.
x509pop + custom node resolver).
GitHub Uber (in-house orchestrators)
Pattern F — SPIRE as Replacement Identity Issuer for Istio / Service Mesh
Replacing Istio's default namespace/service-account-based identity with SPIRE-issued SVIDs,
enabling finer-grained workload identity for policy enforcement (e.g. data access controls, not
just service-level mTLS).
IBM Research (Data Mesh) Frontdoor
Pattern G — SPIRE + Vault Paired for Identity + Secrets
SPIRE handles workload identity and trust; Vault handles secrets management. The two are used
side-by-side — SPIRE for the identity primitive, Vault for what it is "very good at." A natural
pairing that multiple organisations referenced even when not detailing the integration fully.
GitHub TransferWise
## 3. Company Reference Table
Quick-reference mapping of each organisation's environment, core use case, and implementation
pattern.
## Company Environment Core Use Case Patterns Used
GitHub
Own facilities + multi-
cloud + acquisitions
Single trusted identity
principal for all internal
services; acquisition
infrastructure onboarding
## A, B (systemd), E
(custom attestor), G
(Vault pairing)
## HPE
Full product line —
cloud, on-prem, devices
Trusted connectivity fabric
spanning entire HPE
portfolio; acquired Scytale to
accelerate
Strategic platform
(integration pattern
not detailed)

## Company Environment Core Use Case Patterns Used
## Square / Cash
## App
## Kubernetes + Lambda +
data centres; multiple
BUs
Replace manual mTLS cert
issuance (Kiwis); multiple
trust domains per
environment & business unit
A, C (trust domain
isolation), custom
lambda identity
bridge
TransferWise
K8s on AWS + EC2 +
vSphere VMs + data
centres
Replace fragmented auth
(shared secrets, JWT server,
IAM, perimeter trust);
Envoy mTLS + Kafka auth
## A, C, D, G
## Uber
~12 data centres; tens of
thousands of hosts; 500+
services; Go/Java/Python
Compliance (GDPR/SOX) +
zero-trust identity at massive
scale; smooth developer
onboarding
B (agent in base
image), E (custom
low-level registrant)
## Anthem + Daki
(Healthcare)
Regulated healthcare;
mixed cloud + on-prem
Zero-trust auth for
workloads crossing network
boundaries; eliminate
perimeter-trust model
F (Istio/SPIRE),
zero-trust policy
enforcement
IBM Research
Kubernetes / Istio service
mesh
Fine-grained workload
identity for data access
policy enforcement (Data
Mesh project)
## F (replace Istio
identity with SPIRE)
## Frontdoor
## Kubernetes + Istio;
platform modernisation
Stronger workload identity
for Istio service mesh;
platform revitalisation
## A, F
## Network
## Service Mesh
CNCF project; hybrid
multi-cloud
## Cross-trust-domain
workload auth for global IP-
layer service mesh;
federation at scale
SPIFFE federation
## (cross-trust-domain)
## Doc.ai
Mobile health + AI
platform; edge + cloud
## Privacy-preserving
infrastructure; SPIRE for
workload identity in health
AI products
F, SPIRE as identity
primitive for privacy
architecture
## 4. Shared Gaps & Pain Points
Problems that remain unsolved or painful across multiple adopters — relevant signal for where
SPIFFE/Vault tooling can add value.
- Non-Kubernetes node attestation — attesting bare metal, VMs (vSphere, EC2), and
non-container workloads remains consistently painful. Every multi-environment org
flagged this. (TransferWise, Square, Uber)
- Slow, cautious rollout cycles — because SPIFFE touches every service-to-service call,
rollout must be gradual. TransferWise described a very long journey from test to
production. High activation cost is universal.

- TOFU (Time of First Use) checks — agent reconnection and first-use attestation create
operational overhead, especially in dev/staging environments where agents go offline.
(TransferWise)
- Workload registration at scale — auto-registering entries for thousands of workloads
requires custom tooling. Multiple orgs built their own CRD-based registrars or low-level
registrant services. (TransferWise, Uber, GitHub)
- Non-Java clients for SPIFFE-backed Kafka — SPIFFE Java library works well; non-
Java languages need an Envoy-transparent proxy path, which breaks pod security policies
on Kubernetes. (TransferWise)
- x.509 PoP key handling for non-Kubernetes nodes — rotating x.509 proof-of-
possession keys on bare metal / VM nodes lacks the clean story Kubernetes provides.
(TransferWise)
- Upstream workload registrar standardisation — bespoke CRD-based registrars are
working but not upstreamed; community alignment on the right abstraction remains open.
(TransferWise, F5/Networks)
- Signal for Vault TPM / SPIFFE Strategy
The dominant gap across all case studies is on-premises and non-Kubernetes workload
attestation. Every large adopter eventually runs into bare metal, VMs, or legacy infrastructure
that Kubernetes attestation cannot reach. This is precisely the gap TPM-backed hardware
attestation in Vault addresses. The SPIRE + Vault pairing already appears in practice (GitHub).
The missing piece — and the strongest product signal here — is a first-class, low-friction
attestation path for on-prem Linux VMs that doesn't require running SPIRE infrastructure
separately. Vault as the SPIFFE control plane with TPM-rooted identity closes that loop.
Made with IBM Bob