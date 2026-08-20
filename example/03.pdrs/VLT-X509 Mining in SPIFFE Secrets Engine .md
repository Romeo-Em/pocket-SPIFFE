





PRD VLT-515: X509 Minting in SPIFFE Secrets
## Engine
Summary: This PRD describes the need and requirements for adding x509 SVID
minting to the SPIFFE Secrets Engine.
Created:  Jul 9, 2026 Status:  WIP | In-Review | Approved | Obsolete
Product:  Vault Owner:  Elizabeth.Forward@ibm.com
## Contributors:
Elizabeth.Forward@ibm.com
Approvers:  Kartik.Lunkad@ibm.com and
ncabatoff@ibm.com


This PRD aims to add X509 Minting support to the Vault SPIFFE Secrets Engine. This will allow
customers to more seamlessly generate X509 SVIDs, associate those SVIDs with a Trust
Bundle, and utilize them in existing and new Vault workflows.

## Glossary

SPIFFE ID: A unique identifier for a workload in URI format: spiffe://trust-domain/path. The
SPIFFE ID is the "name" of the workload—it says "who" the workload is within a trust domain. It
is embedded in SVIDs to create verifiable identity.

SVID: The actual credential that proves a workload's SPIFFE ID. The two types of SVIDs
include:

X.509 SVID: SPIFFE Credential formatted as an X.509 certificate. The SPIFFE ID must be passed
in the SAN (Subject Alternative Name) field. Can be used with any system that understands X.509
certs while carrying a SPIFFE identity.

JWT SVID: A signed JSON Web Token containing the SPIFFE ID as claims. OIDC-compatible,
passed as Bearer token in Authorization header. Currently supported for minting in the SPIFFE
## Secrets Engine.

SPIRE Server: An open-source, comprehensive, runtime implementation of the SPIFFE standard,
performing  key  functions including  minting  JWT  and  X.509  SVIDs,  as  well  as  attestation  and
federation.

Trust  Bundle: Acts  as  the anchor  of  truth  and  foundation  for  validating  SVIDs.  A  trust  bundle
typically holds a collection of cryptographic keys and a root certificate.






Background and Strategic Context
Fundamentally,  Vault  is  a  machine  identity  management  product.  For  the  longest  time,  the
machine  identity  was  expressed  via  secrets  and  certificates.  With  the  advent  of agents,  the
criticality  of  workload-based  identity  has  gone  up.  Workload  Identity  has  a  strong  benefit  of
eliminating credentials altogether for proving the identity of the workload.

SPIFFE has emerged as a standard for providing workload identity to agents & NHIs agnostic of
infrastructure. In Vault 2.0, the SPIFFE secrets engine delivered minting JWT-SVIDs. The SPIFFE
Secrets  Engine  is one  of the few times Vault  acts as  an  Identity  Provider,  issuing  identifiable
artifacts, which can then be used by or in other systems. This PRD aims to expand the SPIFFE
Secrets Engine as an Identity Provider by adding support for generating X509 SVIDs natively in
the SPIFFE Secrets Engine.

The primary mechanism used today to generate SVIDs is SPIRE, the open-source server
implementation associated with SPIFFE. Deploying SPIRE can be complex, with attestation
flows required for each supported infrastructure type. Vault could provide an alternative to
SPIRE which for existing customers, already have auth methods configured for attestation, and
sets of policy. More on SPIFFE as an Identity Provider and Overall Strategy here!
Adding X.509 SVID support is the next step in expanding Vault's SPIFFE capabilities. Closing
the gap eliminates long lived secrets, enables workload identity that is portable across clouds
and on-prem environments without platform lock-in.
## Problems
#1 Risk of Secret Zero for Non-Human Identities and Autonomous agents
The number and scope of non-human identities is growing rapidly, accelerated by the
proliferation of AI agents and automated workloads. NHIs & Agents must be issued a Secret
Zero to authenticate to Vault and other systems. Organizations such as Bank of America (BoA),
Fidelity, and Development Bank of Singapore are focused on securing the secret zero challenge
for workloads to remove all hard coded credentials and static secrets. Credentials should be
short lived, dynamic, and auditable in order to eliminate the security risk associated with long
lived, static credentials
#2 Workload Identity established per infrastructure type reenforces identity silos for Non-
## Human Identities
Historically, workloads were centralized to a single pod or VM, therefore establishing identity
could be done through local, native authentication patterns with each application team
maintaining their own identity store. This works in isolation but creates identity silos, which can
be tedious, error-prone, and difficult to manage at scale. For example, if an application team
deploys workloads to both on-prem and AWS, the app team must manage two or more forms of
identity with no portable credential in common. Interoperating securely across these





environments requires bespoke integration at every boundary, with no consistent, portable
identity for the workload or application.

#3 Existing Vault Customers Struggling and Slow to Adopt SPIFFE
In Vault today, the PKI Engine can generate X.509 SVIDs. However, it is not documented, does
not satisfy all use cases, and is not in alignment to Vault SPIFFE Strategy. In the SPIFFE
Secrets Engine, Vault generates and associates the engine with a minted Trust Bundle. The
current minting capability in the PKI Engine would be tied to an intermediate CA. Epic Systems
is currently using the Vault PKI engine to generate CSRs but had to use custom code for the
validation of the trust bundle.
Personas: JTBD and CUJs
## Platform Engineer
## JTBD:
- When providing guidance to application teams on establishing workload and NHI
management, I want to be able to recommend a common solution, instead of
building best practices and troubleshooting a wide variety of secret engines and
authentication methods per infrastructure type.
- As a platform engineer, I want to develop a means to establish workload identity
with SPIFFE without the additional operational overhead of setting up and
managing Secrets Management, Privileged Access Management, and Identity
Solutions per workload.
A platform engineer can,
- Use configured auth methods with associated metadata to attest a workload,
establishing Non-Human Identity through minting an X509 SVID.
- Set up one trust domain for different application teams to reference and mint
SVIDs.
- Provide permission to application teams to create one or multiple roles for
different workflows within Trust Domain/SPIFFE Secrets Engine.
- Replicate the Trust Bundle and SPIFFE Secrets Engine to a different vault
cluster for availability purposes.
- Generate short-lived X.509-SVIDs for workloads across infrastructure types to
build a common, centralized, auditable workload identity.

Application Developer/Workload Owner





## JTBD:
- When building an application or system of workloads, I want to be able to use
x509 SVID certificates to have services quickly and securely prove identity
across different workloads and IT infrastructure types (microservices, workloads,
and applications).
- When building or integrating applications or workloads, I don’t want to maintain
my own source of identity per workload, in order to spend less time managing
identity and more time building applications.
- When adding SPIFFE workloads into my application, I’d like those workloads to
interact seamlessly with downstream, dependent systems.
CUJ: An application developer/workload owner can,
- Utilize an existing SPIFFE Secrets Engine with Trust domain and validation
endpoint to mint and validate any SVID, matching my application infrastructure
(Kubernetes/AWS/VM).
- Configure one or more roles to define unique TTL and SPIFFE paths specific to a
use case or set of workloads.
- Validate that a SPIRE-minted X.509-SVID contains the correct SPIFFE URI SAN,
and that the receiving workload can verify its signature against the trust bundle
during an mTLS handshake.
- Use the Vault Agent, CLI or SDK to fetch X.509-SVID minting for workloads at
scale.
- Utilize a SPIFFE Secrets Engine minted SVID as a form of Identity in the SPIFFE
Auth Method to gain access to Vault Secrets.
## Security Engineer
## JTBD:
- When evaluating the state of Non-Human Identity in my organization for security
and compliance, I want to see increased automation, short lived agent identity, and
significant decrease in hard coded secrets in workloads and agents.
CUJ: A Security Engineer
- Audit which NHIs have been issued X.509 SVIDs including viewing the SPIFFE ID,
associated role,  TTL, path and auth  method  used,  to  verify  that  only  authorized
workloads hold SVIDs.
- Enforce TTL through roles for X509 SVIDs, ensuring no workloads hold long lived
secrets.





- Investigate a failed SVID issuance or verification – identify unauthorized services
or untrusted SVIDs operating.
## Solution Design Overview
The  proposed  solution  extends  Vault's  existing  SPIFFE  capabilities  by  adding  X.509-
SVID minting to the SPIFFE secrets engine. This is a core capability required to address
usability gaps with SPIFFE adoption and to position Vault as a competitive alternative to
SPIRE  for  Non-Human  Identity  Management.  Adding  X.509-SVID  minting  enables
workloads  to  obtain  SPIFFE-standard  certificates  directly  from  Vault,  accelerating
adoption of mTLS and other X.509-dependent use cases.
Requirements and Phases
Requirement 1 Generating X509 SVIDs
The system shall generate X509 SVIDs when presented with a valid authentication
method. The Secrets Engine set up, and documentation should include all configuration
steps across the engine and auth methods required to generate an X509 SVID.
Documentation, UI, and on-boarding wizards should differentiate the requirements for
X509 minting vs. JWT minting.
## Acceptance Criteria
- Positive Test: Given a Vault operator enabling the SPIFFE Secrets Engine,
when setting up minting for X509, JWT or both, then the engine configuration
distinguishes required attributes for X509 vs JWT minting processes.
- Positive Test: Given a Vault generated X509 SVID associated with a workload,
when that workload presents it’s SVID to a SPIFFE compliant destination entity
during a connection (ex. MTLS) the destination entity can validate the SVID
against the published publicly accessible trust bundle endpoint.
- Positive Test: Given an operator configuring the SPIFFE Secrets Engine, when
populating the role, the template and configuration should expose only the fields
required by the SPIFFE spec for the signing of the certificate. See the appendix
for more detail.
- Negative Test: Given a SPIFFE Secrets Engine Mount, when utilizing a specific
auth method, X509 SVID minting cannot be performed due to insufficient
metadata, the system indicates the meta data that must be included.
## Requirement 2: X509 Trust Bundle Hosting





The System shall allow a Trust Bundle to be generated for each SPIFFE Secrets engine
mount. Hosting an X509 compatible Trust Bundle is essential for X509 minting and
implementation. The trust bundle will enforce a common root of trust across different
workloads and a point of validation for authentication.
## Acceptance Criteria
- Positive test: Given a SPIFFE Secrets Engine mount with an existing trust
domain and bundle, after enabling the ability to minting X509 SVIDs, the Trust
bundle populates and refreshes the required key and certificate material to verify
X509 SVIDs.
- Positive test: Given an existing SPIFFE Secrets Engine and trust bundle, when
performance replication is enabled, then the secondary cluster serves an
identical trust bundle for availability purposes.
- Positive test: Given that Vault has rotated its signing CA, when a verifier fetches
the trust bundle, then the bundle contains both the new and prior CA public keys
until all SVIDs signed by the prior key have expired.
- Negative test: Given a trust domain improperly configured with invalid attributes,
when the Secrets Engine is created or modified, the process cannot be
processed, and the trust bundle should not be created or updated.
- Negative test: Given a workload that can’t access the trust bundle endpoint,

## Requirement 3: Trust Bundle Endpoint Conformance
The system shall allow federation across serve as an X.509 trust bundle at a queryable
endpoint conforming to the SPIFFE Federation Bundle Endpoint specification, allowing
for workloads to validate authenticity of an SVID without a Vault token.
- Positive test: Given a configured SPIFFE Secrets Engine mount, when a client
calls the trust bundle endpoint, Vault returns a document containing the X.509
CA public keys for the Trust domain. Relevant SPIFFE Spec here.
- Negative test: Given an SVID not issued by the CA in the trust bundle, when a
verifier uses the Vault-hosted trust bundle to validate it, then validation fails.
- Negative test: Given a request for the trust bundle of a non-existent mount, then
Vault returns a 404 without exposing bundle material from other mounts.

Out of Scope in Current PRD 1: The SPIFFE Secret Engine docs state, “At this time
it's not possible to integrate SPIFFE secrets with SPIRE federation, since that requires
x509 SVID support.” Federation with SPIRE will be out of scope for this PRD so as to
not increase the scope of the PRD without customer demand.






Requirement 3: SPIFFE Federation Through Trust Bundle
The system shall allow federation of SVIDs across Trust Domains through a “SPIFFE
Bundle” and endpoint profiles. A SPIFFE Secrets Engine can validate identities beyond
its own trust domain for purposes such as but not limited to validating workloads
between related environments such as staging and production, or across different
organizational entities and teams.
- Positive test: Given a configured SPIFFE Secrets Engine mount, when
federation is enabled to a SPIRE server, the SPIFFE Secret Engine hosts and
updates the SPIRE Server’s Trust Bundle at a unique and separate endpoint to
perform validation for SVIDs minted from the SPIRE Server.
- Positive test: Given two unique SPIFFE Secrets Engine or a Secrets Engine
and SPIRE Server, when federation is successfully configured one or both ways,
workloads across compatible infrastructure type can be validated.
- Roles? And AuthZ?

Requirement 4: Security, Telemetry and Auditability
The system shall record an auditable event for every SVID minting action, successful or
failed across both JWT and X.509 issuance, without exposing sensitive credential
material in the audit trail.
## Acceptance Criteria
- Positive test: Given a SPIFFE Secrets trust bundle, when a signing certificate is
reaching expiry, the keys are rotated to ensure security best practices.
- Positive test: Given any SVID minting request (JWT or X.509), when the action
completes successfully, then Vault records an auditable event identifying the
requesting entity, the trust domain, the SVID type, auth method used, and the
## TTL.
- Positive test: Given a failed SVID minting request, when the action is rejected,
then Vault records an auditable event identifying the requesting entity, the trust
domain, auth method used, and the failure reason.
- Negative test: Given an SVID minting event in the audit log, when the log is
inspected, then it does not contain private key material or sensitive data.
Out of Scope for Milestone 1:
- Federation between Trust Bundles
Given a SPIRE server requests federation with Vault's trust bundle endpoint,
then Vault returns a valid X.509 trust bundle that SPIRE can use to establish
cross-domain trust.





- BYO-Certificate, BYO-Key
Bring your own certificate or bring your own key scenarios can be built pending
customer demand.
- Replication Across multiple SPIFFE Secrets Engine

Hypothesis, Outcomes and KPIs
Within two quarters of GA release,
- Get 8 customers enrolled into an early preview program for feedback specifically
on X509 and JWT SVID Minting. Learn more about their utilization of SPIFFE.
- At least 3 of the 8 preview customers complete a full SVID minting workflow
including engine configuration, trust bundle hosting, SVID issuance, and any last
mile integration. See a decrease in manual effort managing cross domain
authentication.
- Enable at least 1 customer to test or use Vault-minted X509 SVIDs for the
following use cases,
o establish workload identity across a hybrid cloud/on-premises
environment, to replace static credentials and decrease security risk.
o establish Agentic Identity, to bring compliance, compatibility, and
auditability to autonomous agents
o establish workload identity and validation via SVID on high volume mtls
transactions to centralize identity across different domains.
Supporting KPI
- Number of distinct Vault clusters that enable the SPIFFE Secrets Engine in the 6
months following the released capability.
- Number of SPIFFE secrets Engine enabled, roles created, and authentic
methods utilized.
- Number of SPIFFE SVIDs minted, including type, and associated Auth Method.
- Data from the SPIFFE on-boarding wizard when available.
GTM Market Goals to Increase Field Awareness of SPIFFE
- Track Confluent’s use of the SPIFFE Auth methods and SPIFFE Secrets Engine
as Confluent evaluates replacing their existing SPIRE deployment with Vault.
- Replace SPIRE in Vault’s Agentic Runtime Security Demo.







## Appendix
## User Research
To drive research for this PRD, existing Vault customers and published SPIFFE Patterns were
analyzed. Below is a high-level view of the research conducted, for more detail, see Appendix
## X.

- Customer Implementations - greater detail here
a. EPIC
b. Macquarie Bank
c. NAB
d. Confluent – utilizing the SPIFFE Auth Method today with SPIRE deployment.
Considering replacing SPIRE with Vault for internal use cases.
e. Fidelity – most concerned with utilizing SPIFFE in the context of Secret Zero
f. Development Bank of Singapore, interested in TPM auth and SPIFFE. Evaluated
SPIRE, but development stalled.
Note: Interestingly, DBS requested support for X509 SVIDs for establishing
machine identity for their VM workloads as they considered X509 SVIDs more secure
than JWT SVIDs.

- Published SPIFFE Case Studies
a. Transcribed and summarized all published case studies from SPIFFE org.
Enterprises who discussed their SPIFFE deployments included, GitHub, HPE,
Square, TransferWise, Uber, Anthem, IBM Research, Frontdoor, Network Service
## Mesh, Doc.ai
b. Summarized Use cases and Key Themes:
https://ibm.box.com/s/bpbykenw32ar5biyn1z1tndnaxno2b47

## 3. Feature Requests:
a. Current feature requests related to SPIFFE, primarily out of scope for this use case,
i. https://hashicorp.atlassian.net/browse/FRB-2336
ii. https://hashicorp.atlassian.net/browse/FRB-
952?atlOrigin=eyJpIjoiNzZiMDUxMjA5MDA2NGM4ZDlhZjQ2NmJmMD
diNzVkYmEiLCJwIjoiaiJ9

- Additional research is being done beyond the scope of this PRD for the overall SPIFFE
project. Can be found on this mural board,
https://app.mural.co/t/hashicorpproductexperience7582/m/hashicorpproductexperien
ce7582/1783453021918/316eff23a10511f6505ba766cbaa92e5eb900a5b?sender=u
d96708be1ac19b0dd8c51039.






Competitive and Market Research

- RedHat Zero Trust Workload Identity Manager
a. RHZTWIM is a competitor to Vault’s strategy to provide an enterprise friendly
alternative to SPIRE. However, a major limitation is their focus is primarily on
Kubernetes, see detail below. https://github.com/hashicorp/vault-spiffe-
pm/blob/main/market-research/redhat-openshift-ztwim-research-2026-06-
## 16.md

GitHub Repo for Research

Kartik and Lizzy are piloting using a GitHub repository for consolidated view of research
links to build a query able resources to ask SPIFFE and TPM Related questions. Please
check it out;it is compatible with IBM Bob.

https://github.com/hashicorp/vault-spiffe-pm/tree/main

Details on the X509 Certificate Components Spec:
Basic Constraints based on SPIFFE Spec for X509 SVID:
- Exactly one URI SAN = the SPIFFE ID (spiffe://trust-domain/path)
- Signing certificates MUST set the cA field to true, and leaf certificates MUST set
the cA field to false
- Key Usage extension, marked critical, with digitalSignature
- Extended Key Usage with id-kp-serverAuth and id-kp-clientAuth
- May set the pathLenConstraint field.
- No name constraints
