# Sprint 10.6 — Objective 10.6.4

## Objective Name

Automatic AI Workforce Assignment

## Programme

EOS — Enterprise Operating System

## Sprint

Sprint 10.6 — Self-Improving Platform Foundation

## Objective Status

DEFINED — IMPLEMENTATION NOT STARTED

## Purpose

Objective 10.6.4 connects the closed Enhancement Engineering
Orchestration capability from Objective 10.6.3 to the existing EOS
AI Workforce architecture.

The objective establishes the governed and deterministic mechanism
through which an Engineering Mission may be assigned to the
appropriate EOS AI office, workforce capability, and executable
iiAgent or equivalent canonical workforce identity.

This objective must extend the existing EOS AI workforce architecture.
It must not create a competing workforce model, second autonomous
engineering runtime, or parallel mission architecture.

## Starting Capability

At the start of Objective 10.6.4:

- Objective 10.6.1 can generate a canonical Engineering Mission from
  an approved implementation-ready Enhancement/ECR;

- Objective 10.6.2 can deterministically assess Enhancement/ECR
  engineering eligibility;

- Objective 10.6.3 can compose the canonical eligibility assessment
  and Engineering Mission bridge;

- one eligible Enhancement/ECR can deterministically produce exactly
  one canonical Engineering Mission;

- provenance between source, assessment, orchestration and Engineering
  Mission is preserved;

- successful orchestration is distinct from mission execution;

- human governance boundaries remain authoritative;

- autonomous engineering execution already exists from earlier
  Sprint 10.x capabilities.

The verified starting principle is:

> EOS can turn a governed eligible enhancement into exactly one
> canonical Engineering Mission.

## Objective

Establish a canonical, governed and deterministic AI Workforce
Assignment capability that accepts an Engineering Mission and resolves
the appropriate EOS workforce assignment without executing the
Engineering Mission.

## Target Flow

Eligible Enhancement / ECR

→ Objective 10.6.2 Eligibility Assessment

→ Objective 10.6.3 Enhancement Engineering Orchestration

→ Canonical Engineering Mission

→ Objective 10.6.4 AI Workforce Assignment

→ Assigned AI Office / Workforce / iiAgent

→ Existing Governed Self-Build Runtime

Objective 10.6.4 ends at the assignment boundary.

Execution of the mission remains the responsibility of the existing
governed autonomous engineering runtime.

## Canonical Input

The primary input is one canonical Engineering Mission produced by
Objective 10.6.1 and surfaced through Objective 10.6.3.

The assignment capability must consume canonical mission data rather
than reconstructing Enhancement/ECR eligibility or mission-generation
logic.

## Canonical Output

The assignment result must expose a deterministic assignment record
containing at minimum:

- assignmentId;
- assignmentStatus;
- engineeringMissionId;
- source identity or upstream provenance reference;
- assignedOffice;
- assignedWorkforce;
- assignedAgent or equivalent canonical executable workforce identity;
- assignmentReasons;
- requiredCapabilities;
- matchedCapabilities;
- unmatchedCapabilities;
- governanceState;
- blockingConditions;
- provenance;
- nextStep.

The exact field names may be refined during implementation only where
existing canonical EOS workforce contracts require them.

Any such refinement must preserve the semantic roles above and must be
explicitly evidenced.

## Assignment Decisions

The assignment layer must distinguish at least:

### ASSIGNED

The Engineering Mission is valid for workforce assignment and exactly
one canonical assignment has been resolved.

### UNASSIGNABLE

The Engineering Mission cannot be assigned because required workforce
capability or identity cannot be satisfied.

### BLOCKED

Assignment cannot proceed because a blocking condition exists.

### GOVERNANCE_REVIEW_REQUIRED

The assignment cannot proceed without explicit governance review.

Additional internal states may exist only where required by existing
EOS workforce contracts and must not weaken these canonical outcomes.

## Deterministic Assignment Principle

Repeated processing of materially identical canonical Engineering
Mission input against materially identical workforce capability state
must produce the same canonical assignment identity and same assignment
decision.

Runtime timestamps or other non-deterministic operational values must
not affect assignment identity.

## Workforce Matching Principle

Assignment must be capability-driven.

The assignment mechanism should consider the mission's declared
required capabilities and the canonical capabilities of available
EOS workforce entities.

Assignment must not occur solely because an agent name is hard-coded
into the Objective 10.6.4 implementation.

Where Hermes, another iiAgent, an AI office, or another canonical
workforce entity is selected, the selection must be derived through
the existing workforce model and evidenced through the assignment
result.

## Governance Boundary

Objective 10.6.4 may determine assignment eligibility and resolve a
workforce destination.

It must not:

- execute the Engineering Mission;
- dispatch external AI providers;
- create an engineering workspace;
- promote repository changes;
- commit Git changes;
- push Git changes;
- close the Engineering Mission;
- close the originating Enhancement/ECR.

Those capabilities remain downstream.

## Provenance Requirements

The assignment result must preserve or reference the complete
upstream lineage necessary to trace:

Enhancement/ECR

→ eligibility assessment

→ enhancement engineering orchestration

→ Engineering Mission

→ AI Workforce Assignment

At minimum, provenance must expose or reference:

- source Enhancement/ECR identity;
- eligibility assessment identity where available;
- orchestration identity where available;
- Engineering Mission identity;
- assignment identity;
- assignment authority;
- selected workforce identity.

## Architectural Rules

1. Reuse the existing EOS AI Workforce architecture.

2. Reuse the existing Engineering Mission contract.

3. Do not reimplement Objective 10.6.2 eligibility logic.

4. Do not reimplement Objective 10.6.1 mission construction.

5. Do not create a second autonomous engineering runtime.

6. Do not silently mutate the Engineering Mission.

7. Do not silently mutate workforce registry or capability state.

8. Assignment must be deterministic for materially identical state.

9. Exactly one canonical assignment record must be produced per
   assignment transaction.

10. Assignment does not equal execution.

11. External provider dispatch is prohibited inside deterministic
    Objective 10.6.4 tests.

12. Repository promotion, commit and push are outside Objective 10.6.4.

13. Existing closed Objective 10.6.1, 10.6.2 and 10.6.3 semantics
    must remain backward compatible.

14. ECMAScript module conventions must be preserved.

15. Objective 10.6.4 must follow:
    define → implement → test → verify → close.

## Implementation Readiness

Implementation should begin only after canonical inspection identifies:

- the existing AI Workforce service or registry;
- canonical workforce entity identities;
- available capability representations;
- existing Engineering Mission assignment fields;
- current call sites or consumers for assignedOffice,
  assignedWorkforce or assignedAgent;
- any existing governance or availability state associated with
  workforce entities.

The implementation must integrate those contracts rather than guess
their structure.

## Required Behavioral Coverage

Deterministic tests must prove at minimum:

1. a valid canonical Engineering Mission can be assessed for workforce
   assignment;

2. required mission capabilities are read from canonical mission data;

3. workforce capabilities are read from existing canonical workforce
   state;

4. one valid candidate produces exactly one deterministic assignment;

5. repeated materially identical assignment produces the same
   assignment identity;

6. source Engineering Mission is not mutated;

7. workforce registry/capability state is not mutated;

8. missing Engineering Mission identity is rejected deterministically;

9. missing required capabilities are handled deterministically;

10. no matching workforce capability produces UNASSIGNABLE or the
    equivalent canonical result;

11. blockers take precedence where applicable;

12. governance review requirements take precedence where applicable;

13. assignment provenance identifies the Engineering Mission and
    selected workforce entity;

14. assignment reasons explain why the workforce entity was selected;

15. no external provider dispatch occurs in deterministic tests;

16. no Engineering Mission execution occurs during assignment tests;

17. Objective 10.6.3 regression remains green;

18. Objective 10.6.2 regression remains green;

19. Objective 10.6.1 regression remains green.

## Success Condition

Objective 10.6.4 succeeds when EOS can accept the canonical Engineering
Mission produced through the closed Objective 10.6.3 flow and
deterministically resolve one governed AI Workforce assignment while
preserving provenance and without executing the mission.

## Completion State

When formally closed, the verified principle should be:

> EOS can automatically determine who in its AI Workforce should
> execute a governed Engineering Mission.

The next canonical Sprint 10.6 objective is:

Objective 10.6.5 — Engineering Ledger Lifecycle Synchronization.
