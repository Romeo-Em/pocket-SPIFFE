# Research Synthesis Reference

Templates and frameworks for user research, synthesis, and insight generation.

---

## Research Method Selection

### When to Use Each Method

| Research Question | Recommended Methods |
|-------------------|---------------------|
| What are user needs/pain points? | Interviews, contextual inquiry, diary studies |
| How do users currently solve this? | Ethnography, contextual inquiry |
| Does this concept resonate? | Concept testing, interviews |
| Can users complete key tasks? | Usability testing |
| Which design performs better? | A/B testing, preference testing |
| Is our IA intuitive? | Tree testing, card sorting |
| How satisfied are users? | Surveys (NPS, CSAT, SUS) |
| Why do users drop off? | Usability testing + interviews |

### Method Classification

```
            ATTITUDINAL ◄─────────────────────► BEHAVIORAL
                │                                    │
QUALITATIVE     │  Interviews        Usability Tests │
                │  Focus Groups      Field Studies   │
                │  Card Sorting      Eye Tracking    │
                │                                    │
────────────────┼────────────────────────────────────┤
                │                                    │
QUANTITATIVE    │  Surveys           A/B Tests       │
                │  Desirability      Analytics       │
                │  Studies           Click Tracking  │
                │                                    │
            GENERATIVE ◄──────────────────────► EVALUATIVE
```

---

## SPARK Research Plan

Use this when you need a short research plan tied to a decision, a stage, and a clear learning agenda.

### Inputs to Collect

- Situation - why this research is needed now
- Stage - discovery / solution evaluation / design evaluation / MVP testing / beta
- Top 1-3 learning goals
- What the research should inform
- Primary decision at the end of the research, or what to explore next for discovery
- Participant description or persona
- Method preference, if any
- Participant count or recruiting constraints
- Timeline and other constraints

If inputs are missing, ask only for the missing fields. If speed matters more than precision, state assumptions clearly.

### Fill-in Prompt Shell

Use or recognize this prompt format directly:

```text
SPARK Research Plan Prompt

Situation
I need to create a research plan to [align the team / conduct research in a standardised way / other goal].
This research is for [discovery / solution evaluation / design evaluation / MVP testing / beta].
We need to learn [top 1-3 learning goals]
so we can decide [what this research will inform].

Primary decision (if applicable)
At the end of this research, we need to decide:
[which problem to prioritise / whether to proceed / which option to choose / what to iterate]

Persona(s)
You are an experienced researcher good at taking [source materials, such as vague product spec docs]
and turning them into a focused research plan.

Action
Create a research plan based on my inputs and the context I provided under Situation, especially the learning goals and primary decision.

Additional input to fill in the plan:
We will talk to [persona(s)].
Suggest [method(s)] with [number] participants to answer the learning goals above.

Kind of Output
- Max length: 2 A4 pages
- Format: Word
- Clear and scannable
- Plain English, no jargon
- Grounded in the input provided

Constraints (if any)
- Timeline: [e.g. 1-2 weeks]
- Participants: [number + type]
- Other constraints: [if any]
```

### Output Rules

- Aim for 2 A4 pages max
- Use simple headings and bullets
- Plain English, no jargon
- Ground the plan in the provided inputs
- Keep the discussion guide to 5 questions max
- Order questions as warm-up, norming, storming

### Required Sections

1. Context - why this research is needed now
2. Learning goals - what we need to learn, aligned to stage
3. Participant description - who we are talking to and why
4. Method - how we will learn and why the method fits
5. Decision criteria - 1-2 sentences on what we prioritize next vs. not, plus one sentence on what remains for later learning
6. Discussion guide - key questions mapped to learning goals

### Stage to Method Defaults

- Discovery -> interviews or contextual inquiry to understand needs, workarounds, and current behavior
- Solution evaluation -> concept testing or structured interviews to compare options before build
- Design evaluation -> moderated usability testing to identify breakdowns in the proposed flow
- MVP testing -> usability testing, plus a short survey when you need extra breadth
- Beta -> interviews or usability testing, paired with product signals if available

### Participant Count Defaults

- Interviews: 5-8 participants per distinct segment
- Usability tests: 5-7 participants per key persona for directional issues
- Surveys: use when breadth matters; pair with qualitative work for higher-risk decisions

### Discussion Guide Pattern

1. Warm-up / icebreaker - understand role, responsibilities, and current workflow
2. Norming / context setting - learn current tools, frequency, and decision context
3. Storming / deep learning - probe the main learning goals, trade-offs, pain points, and reactions

Tag questions to learning goals with labels such as `[LG1]` or `[LG1, LG2]`.

### Template

```
RESEARCH PLAN: [Topic]

CONTEXT
[1 short paragraph on why this research is needed now]

LEARNING GOALS
1. [Learning goal]
2. [Learning goal]
3. [Optional learning goal]

PARTICIPANT DESCRIPTION
- [Who we will talk to]
- [Why this group fits the learning goals]

METHOD
- Method: [Interviews / usability test / survey / mixed method]
- Participants: [count and segment]
- Why this fits: [1-2 bullets]

DECISION CRITERIA
[1-2 sentences on what this research will help us prioritize, choose, or change next.]
[1 sentence on what remains out of scope for this phase and will be learned later.]

DISCUSSION GUIDE
1. Warm-up question [LG1]
2. Norming question [LG1]
3. Storming question [LG1, LG2]
4. Storming question [LG2]
5. Storming question [LG2, LG3]
```

---

## Interview Guide Template

```
INTERVIEW GUIDE

PROJECT: [Name]
DURATION: [45-60 minutes]
PARTICIPANT CRITERIA: [Who qualifies]

─────────────────────────────────────────────────

1. INTRODUCTION (5 min)
   
   Purpose: Build rapport, set expectations
   
   Script:
   "Thank you for taking the time to speak with me today.
   I'm [name] from [company]. We're working on [general topic]
   and want to understand your experiences better.
   
   There are no right or wrong answers - we want to hear
   your honest thoughts and experiences.
   
   Do you have any questions before we begin?"
   
   □ Confirm recording consent
   □ Explain confidentiality

─────────────────────────────────────────────────

2. WARM-UP QUESTIONS (5 min)
   
   Purpose: Easy questions to start conversation
   
   • Tell me a bit about your role and what you do day-to-day.
   • How long have you been doing [relevant activity]?
   • What tools or methods do you currently use for [topic]?

─────────────────────────────────────────────────

3. CORE TOPIC 1: [Topic Name] (15 min)
   
   Key Question:
   • "Walk me through the last time you [relevant activity]..."
   
   Probes:
   • "What happened before that?"
   • "How did that make you feel?"
   • "What did you do next?"
   • "Why did you choose that approach?"
   • "What would have made that easier?"

─────────────────────────────────────────────────

4. CORE TOPIC 2: [Topic Name] (15 min)
   
   Key Question:
   • "Tell me about a time when [scenario]..."
   
   Probes:
   • "What was the biggest challenge?"
   • "How did you work around that?"
   • "What would the ideal experience look like?"

─────────────────────────────────────────────────

5. WRAP-UP (5 min)
   
   • "What haven't I asked about that you think is important?"
   • "If you could change one thing about [topic], what would it be?"
   • "Is there anything else you'd like to share?"
   
   Thank participant, explain next steps

─────────────────────────────────────────────────

PROBING TECHNIQUES:
• Echo: Repeat last words with rising intonation
• Expand: "Tell me more about that"
• Clarify: "What do you mean by X?"
• Contrast: "How does that compare to Y?"
• Timeline: "What happened before/after?"
• Emotion: "How did that make you feel?"
• Silence: Wait 5+ seconds for elaboration
```

---

## Observation vs. Insight

### Definition

```
OBSERVATION: A factual statement about what was seen or heard
- Specific to instance
- Descriptive
- No interpretation

INSIGHT: An actionable understanding of user behavior, motivation, or need
- Generalizable pattern
- Explanatory (answers "why")
- Implies design direction
```

### Examples

```
OBSERVATION: "User clicked 'Help' button 3 times during checkout"

INSIGHT: "Users expect real-time assistance during high-stakes actions; 
         static help content doesn't meet their need for immediate guidance"

─────────────────────────────────────────────────

OBSERVATION: "5 of 8 participants saved items to multiple lists"

INSIGHT: "Users organize saved items by context of use, not category - 
         they need flexible, cross-cutting organization rather than 
         a single favorites list"
```

### Insight Quality Checklist

```
GOOD INSIGHT:
☑ Grounded in evidence (multiple data points)
☑ Reveals underlying motivation or behavior pattern
☑ Not obvious before research
☑ Actionable (implies design response)
☑ Generalizable (not one-off occurrence)

WEAK INSIGHT:
☒ Single observation stated as insight
☒ Obvious statement requiring no research
☒ Description without explanation
☒ No clear design implication
☒ Based on assumption, not evidence
```

### Insight Statement Template

```
INSIGHT STATEMENT:

[User segment] [behavior/belief] because [underlying motivation/context],
which means [design implication].

─────────────────────────────────────────────────

EXAMPLE:

"First-time users abandon checkout at the shipping step 
because they don't know final costs upfront and fear surprise fees,
which means we need to show estimated totals earlier in the flow."

SUPPORTING EVIDENCE:
• P2: "I always want to know the total before I commit"
• P5: "I've had bad experiences with hidden shipping costs"
• Analytics: 34% drop-off at shipping step
• Competitor analysis: Top 3 competitors show estimates on product page
```

---

## Affinity Mapping

### Process

```
STEP 1: CAPTURE
─────────────────────────────────────────────────
Extract individual data points onto notes:
• One observation per note
• Include source identifier (P1, P2, etc.)
• Use participant's words when possible

STEP 2: CLUSTER
─────────────────────────────────────────────────
Group similar notes:
• Let patterns emerge bottom-up
• Don't use predefined categories
• Move notes between groups as patterns clarify

STEP 3: LABEL
─────────────────────────────────────────────────
Name each cluster:
• Header should capture the theme
• Not just a list of contents
• Hierarchy may emerge (clusters within clusters)

STEP 4: SYNTHESIZE
─────────────────────────────────────────────────
Write insight statements:
• One insight per major theme
• Note outliers that don't fit
• Identify relationships between themes
```

### Output Format

```
THEME: [Cluster label]
├── SUB-THEME: [Sub-cluster label]
│   ├── Note 1: [Observation] - P2
│   ├── Note 2: [Observation] - P4
│   └── Note 3: [Observation] - P7
└── SUB-THEME: [Sub-cluster label]
    ├── Note 4: [Observation] - P1
    └── Note 5: [Observation] - P3

INSIGHT: [Synthesis of what this theme means]
```

---

## Empathy Map Template

```
┌──────────────────────────────────────────────────────────────────┐
│                         EMPATHY MAP                               │
│                        [Persona Name]                             │
├────────────────────────────────┬─────────────────────────────────┤
│                                │                                  │
│            THINKS              │             FEELS                │
│                                │                                  │
│  What occupies their mind?     │  What emotions do they          │
│  What matters to them?         │  experience?                    │
│  What worries them?            │  What are they afraid of?       │
│                                │  What excites them?             │
│  • [Thought 1]                 │                                 │
│  • [Thought 2]                 │  • [Feeling 1]                  │
│  • [Thought 3]                 │  • [Feeling 2]                  │
│                                │  • [Feeling 3]                  │
│                                │                                  │
├────────────────────────────────┼─────────────────────────────────┤
│                                │                                  │
│             SAYS               │             DOES                 │
│                                │                                  │
│  What do they say to others?   │  What actions do they take?     │
│  What do they share publicly?  │  What behaviors do we observe?  │
│                                │                                  │
│  • "[Quote 1]"                 │  • [Behavior 1]                 │
│  • "[Quote 2]"                 │  • [Behavior 2]                 │
│  • "[Quote 3]"                 │  • [Behavior 3]                 │
│                                │                                  │
├────────────────────────────────┴─────────────────────────────────┤
│                                                                   │
│   PAINS                              │   GAINS                    │
│   (Frustrations, obstacles)          │   (Goals, desires)         │
│                                      │                            │
│   • [Pain point 1]                   │   • [Desired outcome 1]    │
│   • [Pain point 2]                   │   • [Desired outcome 2]    │
│   • [Pain point 3]                   │   • [Desired outcome 3]    │
│                                      │                            │
└──────────────────────────────────────┴────────────────────────────┘
```

---

## Persona Template

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  [PERSONA NAME]                                                   │
│  [Archetype label, e.g., "The Efficient Optimizer"]              │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  QUOTE: "[Representative statement in their voice]"               │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  CONTEXT                                                          │
│  ─────────────────────────────────────────────────────────────   │
│  • Role/situation: [Relevant background]                          │
│  • Environment: [Where they work/live]                            │
│  • Technology: [Comfort level, tools used]                        │
│  • Frequency: [How often they do relevant activity]               │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  GOALS                              │  PAIN POINTS                │
│  ──────────────────                 │  ────────────               │
│  • [Primary goal]                   │  • [Frustration 1]          │
│  • [Secondary goal]                 │  • [Frustration 2]          │
│  • [Tertiary goal]                  │  • [Frustration 3]          │
│                                     │                             │
├─────────────────────────────────────┴─────────────────────────────┤
│                                                                   │
│  BEHAVIORS                                                        │
│  ─────────────────────────────────────────────────────────────   │
│  • [Behavioral pattern 1]                                         │
│  • [Behavioral pattern 2]                                         │
│  • [Behavioral pattern 3]                                         │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  DESIGN IMPLICATIONS                                              │
│  ─────────────────────────────────────────────────────────────   │
│  • [What this means for our design]                               │
│  • [Features/approaches this persona needs]                       │
│  • [What to avoid for this persona]                               │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Persona Anti-Patterns

```
AVOID:
✗ Persona based on demographics only
✗ "Marketing persona" with no behavioral detail
✗ Too many personas (> 5 becomes unmanageable)
✗ Persona created without research
✗ Persona with no clear design implications
✗ "Average user" persona (averages obscure real patterns)

INSTEAD:
✓ Segment by behavior, not demographics
✓ Ground in research data
✓ Include actionable design implications
✓ Keep to 3-5 distinct personas
✓ Show behavioral differences that matter
```

---

## Journey Map Template

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ JOURNEY MAP: [Journey Name]                                                   │
│ PERSONA: [Persona Name]                                                       │
│ SCENARIO: [Specific context/goal]                                             │
├──────────┬──────────────┬──────────────┬──────────────┬──────────────────────┤
│ PHASE    │  Awareness   │  Consideration│   Decision   │   Post-Purchase     │
├──────────┼──────────────┼──────────────┼──────────────┼──────────────────────┤
│          │              │              │              │                      │
│ ACTIONS  │ [What user   │ [What user   │ [What user   │ [What user does]     │
│          │  does]       │  does]       │  does]       │                      │
│          │              │              │              │                      │
├──────────┼──────────────┼──────────────┼──────────────┼──────────────────────┤
│          │              │              │              │                      │
│TOUCHPOINT│ [Where       │ [Where       │ [Where       │ [Where interaction   │
│          │  interaction │  interaction │  interaction │  occurs]             │
│          │  occurs]     │  occurs]     │  occurs]     │                      │
│          │              │              │              │                      │
├──────────┼──────────────┼──────────────┼──────────────┼──────────────────────┤
│          │              │              │              │                      │
│ THOUGHTS │ [What user   │ [What user   │ [What user   │ [What user thinks]   │
│          │  thinks]     │  thinks]     │  thinks]     │                      │
│          │              │              │              │                      │
├──────────┼──────────────┼──────────────┼──────────────┼──────────────────────┤
│          │              │              │              │                      │
│ EMOTIONS │     😊───────────😐───────────😟───────────😊                     │
│          │              │              │              │                      │
├──────────┼──────────────┼──────────────┼──────────────┼──────────────────────┤
│          │              │              │              │                      │
│ PAIN     │ [Frustration]│ [Frustration]│ [Frustration]│ [Frustration]        │
│ POINTS   │              │              │              │                      │
│          │              │              │              │                      │
├──────────┼──────────────┼──────────────┼──────────────┼──────────────────────┤
│          │              │              │              │                      │
│OPPORTUNTY│ [How we can  │ [How we can  │ [How we can  │ [How we can          │
│          │  improve]    │  improve]    │  improve]    │  improve]            │
│          │              │              │              │                      │
└──────────┴──────────────┴──────────────┴──────────────┴──────────────────────┘
```

### Journey Map Quality Checklist

```
☑ Based on research, not assumptions
☑ Represents specific persona, not "everyone"
☑ Includes pre and post-interaction context
☑ Emotional arc based on evidence
☑ Pain points linked to specific moments
☑ Opportunities are actionable
☑ Appropriate granularity (not too detailed or too vague)
```

---

## Jobs to Be Done (JTBD)

### Job Statement Format

```
BASIC FORMAT:
─────────────────────────────────────────────────

When [situation],
I want to [motivation],
so I can [expected outcome].


FULL FORMAT:
─────────────────────────────────────────────────

When [situation/trigger]
I want to [motivation/goal]
So I can [desired outcome]

Functional job: [What task needs to be accomplished]
Emotional job:  [How user wants to feel]
Social job:     [How user wants to be perceived]


EXAMPLE:
─────────────────────────────────────────────────

When I'm rushing to leave for work in the morning,
I want to quickly eat something filling,
So I can stay focused and energized until lunch.

Functional: Consume adequate nutrition quickly
Emotional:  Feel prepared and not anxious
Social:     Be seen as having things together
```

### Job Mapping Process

```
1. IDENTIFY TRIGGER
   ─────────────────────────────────────────────────
   • What situation prompts the need?
   • What's the context?
   • What time pressure exists?

2. DEFINE DESIRED OUTCOME
   ─────────────────────────────────────────────────
   • What does success look like?
   • How is progress measured?
   • What would "done" feel like?

3. MAP CURRENT SOLUTIONS
   ─────────────────────────────────────────────────
   • What do users currently "hire" for this job?
   • What are the workarounds?
   • What alternatives exist?

4. IDENTIFY PAIN POINTS
   ─────────────────────────────────────────────────
   • Where do current solutions fail?
   • What compromises do users make?
   • What's left unsatisfied?

5. FIND OPPORTUNITY
   ─────────────────────────────────────────────────
   • How might our solution do the job better?
   • What progress would users value most?
   • What's the unique angle?
```

### Competition Through JTBD Lens

```
TRADITIONAL VIEW: Competitors are similar products

JTBD VIEW: Competitors are anything hired for the same job

─────────────────────────────────────────────────

EXAMPLE - "Job: Wind down before bed"

JTBD COMPETITORS:
• Reading a book
• Watching TV
• Scrolling social media
• Meditation app
• Glass of wine
• Video games

INSIGHT: Different product categories compete when they serve the same job.
```

---

## Problem Framing

### Problem Statement Templates

```
BASIC FORMAT:
─────────────────────────────────────────────────

[User] needs a way to [user's need] because [insight].


EXTENDED FORMAT:
─────────────────────────────────────────────────

[User] needs a way to [user's need] because [insight],
but currently [barrier/current state], 
which results in [consequence].


EXAMPLE:
─────────────────────────────────────────────────

"New managers need a way to track their team's workload 
because they can't give effective support without visibility, 
but currently they rely on ad-hoc check-ins, 
which results in work imbalances and burnout going unnoticed 
until it's a crisis."
```

### How Might We (HMW)

```
PURPOSE: Reframe problems as opportunities

FORMULA: "How might we [verb] [user need] [context]?"

─────────────────────────────────────────────────

PROBLEM: Users forget to take their medication

HMW VARIATIONS:
• How might we make medication memorable?
• How might we reduce the need for remembering?
• How might we leverage existing routines?
• How might we make the consequence of forgetting less severe?
• How might we help others support medication adherence?

─────────────────────────────────────────────────

SCOPING RULES:

TOO BROAD: "How might we improve healthcare?"
→ Too many possible solutions, no clear direction

TOO NARROW: "How might we add a notification at 9am?"
→ Solution embedded in problem, closes off alternatives

WELL-SCOPED: "How might we help busy parents maintain exercise routines?"
→ Clear user and context, specific need, multiple solutions possible
```

### Five Whys

```
PURPOSE: Find root cause of a problem

PROCESS:
─────────────────────────────────────────────────

OBSERVATION: Users abandon the onboarding flow

WHY? They get confused at step 3
WHY? The instructions are unclear
WHY? We assume knowledge they don't have
WHY? We designed for power users, not beginners
WHY? We didn't research our actual user base

→ ROOT CAUSE: Assumption-based design without user research
```

---

## Research Report Template

```
RESEARCH REPORT

PROJECT: [Name]
DATE: [Date]
RESEARCHER: [Name]

═══════════════════════════════════════════════════════

1. EXECUTIVE SUMMARY
─────────────────────────────────────────────────

[1 paragraph overview]

Key Findings:
• [Finding 1]
• [Finding 2]
• [Finding 3]

Top Recommendations:
• [Recommendation 1]
• [Recommendation 2]

═══════════════════════════════════════════════════════

2. RESEARCH OVERVIEW
─────────────────────────────────────────────────

Objectives:
• [What we wanted to learn]

Methodology:
• Method: [Interview/Usability test/Survey/etc.]
• Participants: [N participants, criteria]
• Duration: [Date range]

═══════════════════════════════════════════════════════

3. KEY FINDINGS
─────────────────────────────────────────────────

FINDING 1: [Insight headline]

[User segment] [behavior/belief] because [motivation],
which means [design implication].

Evidence:
• [Quote or data point] - P1
• [Quote or data point] - P3
• [Quote or data point] - P5

Severity/Impact: [High/Medium/Low]

─────────────────────────────────────────────────

FINDING 2: [Insight headline]

[Description and evidence]

─────────────────────────────────────────────────

[Additional findings...]

═══════════════════════════════════════════════════════

4. RECOMMENDATIONS
─────────────────────────────────────────────────

| Priority | Recommendation | Finding | Effort |
|----------|---------------|---------|--------|
| High     | [Rec 1]       | F1, F3  | Medium |
| High     | [Rec 2]       | F2      | Low    |
| Medium   | [Rec 3]       | F4      | High   |

═══════════════════════════════════════════════════════

5. APPENDIX
─────────────────────────────────────────────────

• Discussion guide
• Participant details
• Additional quotes
• Raw data (if appropriate)
```

---

## Usability Finding Format

```
FINDING ID: [U-001]

TASK: [Task where issue was observed]

OBSERVATION: 
[What happened - factual description]

SEVERITY: [Critical / Major / Minor / Cosmetic]
• Critical (4): User cannot complete task; data loss; security issue
• Major (3): User completes with significant difficulty
• Minor (2): User completes but with hesitation or minor confusion
• Cosmetic (1): Aesthetic issue; no functional impact

FREQUENCY: [X of Y participants experienced this]

CAUSE: 
[Underlying usability issue - why it happened]

RECOMMENDATION: 
[Specific fix suggestion]

HEURISTIC VIOLATED: 
[Nielsen heuristic or design principle]

─────────────────────────────────────────────────

EXAMPLE:

FINDING ID: U-003

TASK: Complete checkout process

OBSERVATION: 
4 of 6 participants looked for a "back" button at the shipping 
step but couldn't find one. They used browser back button instead,
which lost their cart items.

SEVERITY: Critical

FREQUENCY: 4 of 6 participants (67%)

CAUSE: 
No in-app navigation to previous checkout steps. Browser back 
behavior not tested/handled.

RECOMMENDATION: 
Add explicit back/previous navigation within checkout flow.
Handle browser back gracefully (preserve cart state).

HEURISTIC VIOLATED: 
3. User Control and Freedom - No clear emergency exit
```
