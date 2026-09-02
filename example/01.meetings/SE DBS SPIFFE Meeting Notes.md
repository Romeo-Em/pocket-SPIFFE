

DBS Meeting Notes
Overview of DBS and SPIRE
- DBS evaluated SPIRE and engaged a systems integrator to deploy it.
- It is possible the deployment became overly complex.
- Strong interest in a Zero Trust use case.
- Banking organizations are often resource-constrained and may not have highly specialized
platform engineering teams.
SPIFFE and Workload Identity
## Current Perspective
- DBS are large Consul users.
- A key concern was that SPIFFE IDs were not easily visible or accessible from the Consul
console.
- They view machine identity as a platform problem that needs to be solved consistently.
## Workload Identity Journey
Current direction appears to be:
- Establish workload identity through TPM-based attestation.
- Use TPM as the initial trust anchor.
- Potentially adopt SPIFFE more broadly over time.
Additional notes:
- Looking more closely at TPM-backed identity than SPIFFE today.
- SPIFFE may become more valuable as integration requirements grow.
- TPM is viewed as the immediate priority; SPIFFE may be a future evolution.
## Consul Takeaways
- Interest in automating identity for legacy workloads.
- Consul can generate SPIFFE identities.
- Relevant environments include:
o AWS
o Core Banking systems

- Only Core Banking is currently running on Consul.
- Most remaining workloads are running on VMs.

## Vault Relationship
- DBS are very satisfied Vault customers.
- Discussion around a potential Agentic + Verify proof of concept.
- General interest in improving security across banking infrastructure.

## Agentic Use Cases
Identity and Delegation
- Interest in generating SPIFFE JWT-SVIDs using:
o On-Behalf-Of (OBO)
o May Act delegation flows
- Discussion referenced scaling to potentially 10,000+ agents/workloads.
X.509 SVIDs
- Stronger interest in X.509 SVIDs than JWT-SVIDs.
- Verify was discussed as part of this conversation.

SPIFFE Challenges
- SPIFFE can sometimes be difficult to operationalize.
- Certain use cases are not easily supported through traditional PKI approaches.
- Additional implementation details to be shared later.

DBS Secrets Engine
- Tentative timing mentioned: Q4.


Product and Platform Requirements
TPM → SPIFFE Workflow
Desired capabilities:
- Minimize configuration required to move from:
o TPM attestation
o → SPIFFE workload identity
o → JWT-SVID issuance
- Enable mapping of TPM-based identity to a specific SPIFFE ID.
- Allow SPIFFE identities to map directly into authentication methods.
- Improve enterprise support and documentation.
## Enterprise Support Expectations
- Red Hat provides enterprise support in this space.
- However, current support appears focused primarily on Kubernetes environments.

## Workload Attestation Requirements
## Requirement
- Support for two forms of attestation, including workload attestation.

## Customer Interest
## Other Banking Customers
- SCB: Interested.
- DCB: Appears to be the only customer actively looking to implement currently.

## SPIRE

## Requested Update
- Provide an update by August.
(Note: This may have been a pre-meeting note or action item.)

Open Questions / Follow-Ups
Questions from DBS
- How can TPM identities be mapped to specific SPIFFE IDs?
- What is HashiCorp's high-level SPIFFE roadmap and long-term direction?
## Additional Notes Requiring Clarification
These were difficult to interpret and may need cleanup:
- "Eventually 10k" → 10k agents? workloads? identities?
- "Generating the SPIFFE JWT with OBO, May Act" → Was this specifically in the context of
agent-to-agent delegation for Verify?
- "Change Management: If I want something right now, be sure that it's actually..." → sentence
appears incomplete.
- "Vault business" → heading only; no associated notes.
- "Could you tell me about DBS?" → discussion item or question?
- "Update by August" → August of which year and for what deliverable?
Overall, my interpretation is that DBS is most interested in TPM-backed workload identity today,
sees SPIFFE as a future-state architecture, wants a simple TPM → SPIFFE mapping model, and
is looking for clearer product direction and enterprise support around workload identity.
