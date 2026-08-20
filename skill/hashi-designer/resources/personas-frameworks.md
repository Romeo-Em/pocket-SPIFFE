# Personas & Frameworks Reference

This document captures the persona framework, Jobs to be Done (JTBD), and Critical User Journeys (CUJ) methodology for product design.

---

## Persona Categories

Organize personas into three main categories based on their relationship to the product:

### 1. User Personas

**Definition**: Users who directly interact with a system interface and are most affected by it. They are the core audience for the product experience and engage with features and functionalities to achieve their goals.

Also known as: "Practitioners" or "Hands on keyboard" users

**Example User Personas:**
- Application Developer
- Platform Engineer
- Site Reliability Engineer (SRE)
- Operations Engineer
- Security Engineer
- Compliance Manager
- Team Lead / Engineering Manager

### 2. Buyer Personas

**Definition**: Personas affected by the product often, without directly interacting with it. They are influential in driving or facilitating buying decisions in the organization.

Also known as: "Business Decision Makers (BDM)" or occasionally "Technical Decision Makers (TDM)"

**Example Buyer Personas:**
- CTO (Chief Technology Officer)
- CIO (Chief Information Officer)
- CISO (Chief Information Security Officer)
- VP/Director of Engineering
- VP/Director of Operations
- VP/Director of Security

### 3. Champion Personas

**Definition**: Individuals with influence in a company who hold power because of their position and business expertise. They are potential business champions with access to buyer personas and aim to find solutions for critical business challenges.

Also known as: "Technical Decision Makers (TDM)"

**Example Champion Personas:**
- Engineering Manager
- Operations Manager
- Security Lead

---

## Jobs to Be Done (JTBD)

### Background

Developed by Clayton Christensen, Harvard Business School professor, in the 1990s. The framework is inspired by the idea that customers "hire" products or services to fulfill specific jobs or tasks in their lives. It shifts focus from product features to customer needs and desired outcomes.

### JTBD Format

```
When [circumstance], I want to [user goal or need] so that [motivation]
```

**Components:**
| Component | Description |
|-----------|-------------|
| **Circumstance** | Additional information about the situation or context surrounding the job |
| **User goal or need** | The action the customer wants to accomplish |
| **Motivation** | The thing or outcome the customer is trying to achieve |

### Example JTBD

```
When deploying code to production environments,
I want to manage and access secrets
so that I can maintain the integrity and security of our applications 
without compromising developer productivity.
```

### Further Reading
- HBR: "Know Your Customers' Jobs to Be Done" (2016)
- HBR: "Marketing Malpractice: The Cause and the Cure" (2005)
- NN/g: "Personas vs. Jobs-to-Be-Done"

---

## Critical User Journeys (CUJ)

### Definition

Critical User Journeys raise product excellence and adoption by helping product teams define, prioritize, measure, and improve the experiences that users care about.

User journeys define how a user can work towards achieving a particular Job to be Done. Each CUJ defines a path to help achieve a goal and maps the various steps in completing (or not) the journey.

### Why "Critical"?

There are many journeys users can take in products. With limited resources, teams cannot measure and improve all of them. Critical User Journeys are **prioritized** based on importance to users achieving their goals.

### Types of Critical Journeys

| Type | Description | Example |
|------|-------------|---------|
| **Frequent** | Tasks users do regularly | Check system status, view recent activity |
| **Impactful** | Critical to achieving key goals, driving business KPIs, or meeting regulatory requirements | Emergency situations, compliance workflows |

### CUJ Format

```
As a [persona] I want to [action or task] to achieve [goal].
```

**Components:**
| Component | Description |
|-----------|-------------|
| **Persona** | Role in the organization completing the journey |
| **Action or task** | Specific action the persona wants to accomplish |
| **Goal** | Larger outcome the persona is trying to achieve with this task |

### Example CUJ

```
Role: Application Developer

As an application developer I want to easily create initial secrets quickly 
in order to get my application up and running fast.
```

---

## How to Use Personas

### For Marketing Professionals

**Content and Messaging Development:**
Leverage personas to understand the personas you market to, their challenges, needs, profiles, and pain points. Incorporate this knowledge into messaging and content targeting specific personas so the message resonates with them.

**Marketing Campaign Development:**
Review personas when designing marketing campaigns to ensure you are targeting the appropriate audience and using the right language, content, and channels based on the specific personas.

### For Sales Professionals

**Outreach:**
Review personas before reaching out to prospects and customers to understand how to best speak their language and present solutions in a way that matters to that specific persona.

**Sales Calls:**
Review personas before sales calls and meetings to understand how to best speak their language and present solutions in a way that matters to that specific persona.

### For Product Managers

**Requirements (PRD/RFC):**
User personas help nail the business case for a product idea. Bringing in user personas allows you to ground ideas within the bigger context of the business. What kind of users is this idea meant to help and how valuable does that make it?

**Initiatives/Epics:**
Start with your primary persona and capture the functionality as epics, as coarse-grained, high-level stories. Write all the epics necessary to meet the persona goals but keep them rough and sketchy at this stage.

**User Stories:**
With a holistic but coarse-grained description of your product in place, start progressively breaking your epics into smaller stories. Rather than detailing all epics and writing all user stories upfront, derive stories step by step.

### For Developers

**Epics:**
Start with your primary persona and capture the functionality as epics, as coarse-grained, high-level stories. Write all the epics necessary to meet the persona goals but keep them rough and sketchy at this stage.

**User Stories:**
With a holistic but coarse-grained description of your product in place, start progressively breaking your epics into smaller stories. Rather than detailing all epics and writing all user stories upfront, derive stories step by step.

### For Designers

**Requirements (PRD/RFC):**
User personas help nail the business case for a product idea. Bringing in user personas allows you to ground ideas within the bigger context of your business. What kind of users is this idea meant to help and how valuable does that make it?

**Epics:**
Start with your primary persona and capture the functionality as epics, as coarse-grained, high-level stories. Write all the epics necessary to meet the persona goals but keep them rough and sketchy at this stage.

**User Stories:**
With a holistic but coarse-grained description of your product in place, start progressively breaking your epics into smaller stories. Rather than detailing all epics and writing all user stories upfront, derive stories step by step.

**Journey Mapping:**
Select the main persona(s) of the experience you would like to describe, keep in mind their thoughts and feelings while using your product/service.

**Research:**
Use the persona to refer to the segment you need to run your research.

**Design Walkthrough:**
When doing a walkthrough of the designs, use the personas on it.

**Documentation:**
When documenting your designs, use personas to explain what the user is trying to accomplish.

**Usability Testing:**
Use the persona to refer to the segment you need to validate your designs.

### For Product Leadership/PMM/Docs/Support

The faster and better we understand the needs of our users, the more effectively we can communicate those needs to others, align on solutions, and work together to create strong experiences for our users.

---

## Quick Reference Templates

### JTBD Template
```
When [circumstance],
I want to [user goal or need]
so that [motivation].
```

### CUJ Template
```
As a [persona]
I want to [action or task]
to achieve [goal].
```

### Persona Classification Quick Check

| Question | User | Buyer | Champion |
|----------|------|-------|----------|
| Directly uses the product? | Yes | No | Sometimes |
| Influences purchase decision? | Indirectly | Yes | Yes |
| Has budget authority? | No | Yes | Sometimes |
| Technical hands-on? | Yes | Rarely | Often |
| Also known as | Practitioner | BDM | TDM |

---

## Further Learning

- NN/g: "Why Prioritize Personas?" (Video)
- NN/g: "Personas Are Living Documents: Design Them to Evolve"
- NN/g: "Personas: Study Guide"
