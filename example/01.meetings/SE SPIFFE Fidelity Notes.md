

Fidelity (Dan Stover) Summary
- Fidelity operates at significant scale, with approximately 500 applications across 1,000+
Kubernetes clusters and a large mainframe backend environment.
- Current identity-related discussions are primarily driven by the Identity Architecture team.
- They are not using SPIFFE broadly today and are evaluating how it would scale in their
environment.
## Key Themes
- Scalability is a primary concern:
o How does SPIFFE scale?
o Will it work effectively at Fidelity's size?
- Interest in incorporating SPIFFE into Agentic Runtime Security (ARS) and potentially
within Service Mesh environments.
- Fidelity has built its own solution similar to Vault Agent.
## Secret Zero
- Secret Zero is a major concern and area of focus.
- They are looking at ways to establish trust beyond TPM.
- They do not fully trust AWS identity as the initial root identity.
- Interested in solutions that help address Secret Zero challenges.
## Fidelity Environment
- Running Kubernetes environments and primarily using Kubernetes Auth.
- Governance practices are not as mature as desired.
- There is some friction between application teams and IAM teams.
Agentic Runtime Security (ARS)
- Discussion included:
o AIUC.1
o Secure and Scale concepts
o Agentic Runtime Security use cases
- Agentic use cases are a significant area of interest.
## Strategic Engagement
- Interest in establishing a strategic cadence with Dan's team.
- Ray Bennett (Fidelity) was mentioned as a stakeholder.

- Continued interest in Service Mesh.
## Vault
- Vault is not currently considered a Tier-0 platform.
- Reason cited: scalability concerns.
## Overall Takeaway
The conversation centered on scaling workload identity, Secret Zero challenges, Agentic
Runtime Security, Service Mesh adoption, and whether SPIFFE and Vault can meet Fidelity's
scalability and operational requirements.
