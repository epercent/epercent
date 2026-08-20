# Objective 10.6.4 — AI Workforce Assignment Contract

## Contract Purpose

This contract defines the minimum semantic boundary for assigning one
canonical EOS Engineering Mission to the existing EOS AI Workforce.

## Input Contract

Input:

- exactly one canonical Engineering Mission;
- mission identity must be present;
- mission-required capabilities must be available where assignment
  depends on capability matching;
- upstream provenance must remain available or referenceable.

The assignment service must not recreate the Engineering Mission.

## Output Contract

Exactly one assignment result must be produced for one assignment
transaction.

The result must semantically contain:

- assignmentId;
- assignmentStatus;
- engineeringMissionId;
- assignedOffice;
- assignedWorkforce;
- assignedAgent or canonical executable workforce identity;
- requiredCapabilities;
- matchedCapabilities;
- unmatchedCapabilities;
- assignmentReasons;
- governanceState;
- blockingConditions;
- provenance;
- nextStep.

## Canonical Decisions

ASSIGNED

UNASSIGNABLE

BLOCKED

GOVERNANCE_REVIEW_REQUIRED

## Assignment Invariants

1. Assignment is not mission execution.

2. Assignment is not provider dispatch.

3. Assignment is not workspace creation.

4. Assignment is not repository promotion.

5. Assignment is not Git commit.

6. Assignment is not Git push.

7. The Engineering Mission must remain immutable.

8. Workforce registry/capability state must remain immutable.

9. Assignment identity must be deterministic.

10. Mission capabilities must be matched against canonical workforce
    capabilities.

11. Workforce selection must be explainable through assignment reasons.

12. Provenance must preserve the Engineering Mission identity and
    selected workforce identity.

13. Exactly one canonical assignment result is returned per transaction.

14. Closed Objective 10.6.1-10.6.3 contracts remain authoritative.

## Eligibility for ASSIGNED

A mission may be ASSIGNED only when:

- canonical mission identity exists;
- mission is structurally valid for assignment;
- required capability information is sufficient for assignment;
- at least one canonical workforce candidate satisfies required
  capability and governance constraints;
- no blocking condition prevents assignment;
- no outstanding governance review requirement prevents assignment.

## UNASSIGNABLE

UNASSIGNABLE is appropriate when the assignment transaction completes
successfully but no canonical workforce candidate can satisfy the
mission's assignment requirements.

UNASSIGNABLE is not an execution failure.

## BLOCKED

BLOCKED is appropriate when an explicit blocking condition prevents
assignment.

## GOVERNANCE_REVIEW_REQUIRED

GOVERNANCE_REVIEW_REQUIRED is appropriate where assignment requires
human governance before a workforce entity may be selected.

## Determinism

Materially identical mission input plus materially identical workforce
state must produce materially identical:

- assignment decision;
- assignment identity;
- selected workforce identity;
- assignment reasons.

Operational timestamps must not participate in deterministic identity.

## Side-Effect Boundary

Deterministic assignment must not:

- invoke external AI providers;
- execute mission work;
- modify the mission;
- modify workforce state;
- create governed engineering workspaces;
- alter repository state.

## Downstream Boundary

An ASSIGNED result becomes eligible for downstream integration with
the existing governed autonomous engineering runtime.

Actual runtime execution is outside this contract.
