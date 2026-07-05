# ADM-0001 Codex Output: Frontend ECR Prioritization

Mission ID: ADM-0001
Mission Title: Frontend ECR Prioritization
Status: Completed
Owner: Codex
Output Date: 2026-07-05

## 1. Executive Summary

Mission Control has strong platform breadth, but the frontend audit shows it still behaves partly like a collection of routed pages, placeholders, and informational panels rather than a fully operational enterprise command system. The next Mission Control 2.0 programme should prioritize the AI Development Office, operational workspace dashboards, provider administration, autonomous engineering workflow visibility, and executable-but-governed interaction patterns.

The current ECR register contains five initial critical/high requests. This output expands it into a prioritized backlog of twenty implementation-ready ECRs and groups them into coherent autonomous development missions. The highest-priority sequence should establish a first-class AI Development Office workspace, separate EOS executive agents from AI providers, turn provider administration into an operational console, standardize dashboard workspace patterns, and remove placeholder-heavy executive office panels by replacing them with useful current-state widgets.

No application source code was modified by this mission.

## 2. Top 20 Prioritized ECRs

| Rank | ECR ID | Title | Priority | Area | Implementation Outcome | Acceptance Criteria |
|---:|---|---|---|---|---|---|
| 1 | ECR-0001 | Promote AI Development Office to First-Class Workspace | Critical | Navigation / Information Architecture | Add AI Development Office as a primary workspace with Dashboard, Workforce, Providers, Dispatch, Ledger, Roadmap, and Analytics. | Workspace appears in primary workspace rail; routes are context-scoped; default dashboard summarizes autonomous development status. |
| 2 | ECR-0002 | Separate EOS Executive Agents from External AI Providers | Critical | AI Workforce Model | Separate EOS Executive Agents, AI Workforce Members, and external AI Providers in labels, views, data grouping, and UI copy. | Executive agents are not presented as providers; providers are not presented as EOS executives; Mission Control language is unambiguous. |
| 3 | ECR-0003 | Convert AI Workforce Admin into Operational Provider Management | Critical | AI Workforce Administration | Convert provider admin from informational to operational readiness console for provider onboarding, credentials state, model selection, health, cost, latency, and dispatch readiness. | Provider cards show readiness, credential state, health, models, cost, latency, and available actions with execution disabled where governance requires it. |
| 4 | ECR-0004 | Replace Page-Based Experience with Workspace Dashboards | Critical | Mission Control UX | Every major workspace opens to a dashboard with metrics, current work, risks, decisions, recommended actions, and drill-down cards. | Workspace default routes show dashboard composition rather than static list pages or foundation panels. |
| 5 | ECR-0005 | Standardize Executive Office Layout Pattern | High | Design System / Office Standard | Standardize offices around Dashboard, Operations, Workforce, Knowledge, Analytics, Governance, and Settings. | Executive offices share the same section order, widget hierarchy, and action grammar while preserving executive-specific widgets. |
| 6 | ECR-0006 | Replace My Workspace Placeholders with Functional Executive Workspace Foundation | High | My Workspace | Turn Briefing, Tasks, Decisions, and Notes from future placeholders into useful local read-only operating views. | Each route displays current priority, pending attention, decisions, notes scaffold, and linked actions without showing "future" as the primary content. |
| 7 | ECR-0007 | Create Autonomous Engineering Mission Dashboard | Critical | AI Development Office | Add a dashboard for mission queue, active mission, provider assignment, review status, approval state, and engineering ledger summary. | Dashboard shows queue counts, active mission status, dispatch readiness, latest ledger events, and stop condition warnings. |
| 8 | ECR-0008 | Create Provider Dispatch Readiness Panel | Critical | Provider Gateway UX | Show provider availability, model capabilities, credential status, dispatch eligibility, risk level, and authorization state. | Dispatch panel clearly distinguishes "ready", "blocked", "requires credentials", and "requires human approval". |
| 9 | ECR-0009 | Convert Placeholder Panels into Current-State Operating Cards | High | Executive Offices / UX | Replace generic placeholder cards with useful current-state cards that explain existing capability state and next executable step. | Messages, meetings, calendar, temporary agents, and similar panels show status, reason, next step, and related mission rather than bare placeholder language. |
| 10 | ECR-0010 | Create Unified Workspace Dashboard Component Pattern | High | Frontend Architecture | Define reusable dashboard primitives for hero, metric strip, operating cards, risk cards, queue cards, and action panels. | At least three workspaces can use the same dashboard structure without duplicated layout code. |
| 11 | ECR-0011 | Improve Command Palette from Placeholder to Navigation Assistant | High | Navigation / Command UX | Keep execution governed, but make the command palette useful for search, navigation suggestions, and current workspace actions. | Palette can open suggested routes, show grouped commands, and clearly marks non-executable actions. |
| 12 | ECR-0012 | Add Engineering Ledger Visibility to Mission Control | High | Autonomous Development / Ledger | Show engineering ledger events, mission provenance, review status, and approval state in AI Development Office. | Ledger view displays event timeline and links each event to mission, ECR, provider, reviewer, and status. |
| 13 | ECR-0013 | Add Mission Package Viewer | High | Autonomous Development | Display generated mission packages with objective, inputs, outputs, rules, stop conditions, assigned provider, and approval state. | Mission package detail view supports mission review before execution and highlights stop conditions. |
| 14 | ECR-0014 | Add Frontend Readiness and UX Quality Gates View | High | Quality / UX Governance | Expose frontend readiness gates for executive clarity, visual quality, accessibility, consistency, investor readiness, and enterprise readiness. | UX gate panel shows score, status, owner, evidence, and recommended fix for each gate. |
| 15 | ECR-0015 | Normalize Status Language Across Frontend Audit Findings | Medium | Design Language | Replace inconsistent pending/future/placeholder phrasing with standardized executive language and clear lifecycle semantics. | Common labels use Operational, Monitoring, Awaiting Review, Requires Approval, Not Configured, Ready, Blocked, or No Action Required. |
| 16 | ECR-0016 | Improve Identity Media and Upload Feedback | Medium | Platform / Identity UX | Make upload state, preview state, accepted file types, errors, and successful media registration easier to understand. | Upload controls show selected file, status, validation result, preview, and linked profile or organization. |
| 17 | ECR-0017 | Add Workspace-Level Empty and Blocked States | Medium | UX Resilience | Create consistent empty, blocked, loading, and error states for workspace dashboards. | All major routes use clear executive-facing fallback states and avoid raw technical absence language. |
| 18 | ECR-0018 | Add Responsive Audit for Workspace Rail and Context Navigation | Medium | Responsive UX | Verify and refine workspace rail, command bar, context navigation, and dense dashboard behavior on smaller laptop screens. | Navigation remains usable without horizontal overflow or hidden primary controls. |
| 19 | ECR-0019 | Create Frontend Component Ownership Map | Medium | Frontend Architecture | Map each component to workspace, owner, data source, maturity, and redesign mission. | Documentation exists and future missions can target affected components without re-auditing. |
| 20 | ECR-0020 | Add Mission Control 2.0 Demo Script Readiness View | Medium | Investor / Executive Demo | Create a demo-readiness operating view that identifies which screens are investor-ready, internal-only, blocked, or under construction. | Demo view lists route, readiness score, risk, talking point, and next improvement mission. |

## 3. Grouped Implementation Missions

### Mission Group A: AI Development Office Foundation

Purpose: Make autonomous engineering visible and governable inside Mission Control.

Included ECRs:
- ECR-0001
- ECR-0007
- ECR-0012
- ECR-0013

Primary outcome:
AI Development Office becomes a first-class workspace with dashboard, mission queue, mission package viewer, ledger, dispatch readiness, and governance status.

Likely first mission:
ADM-IMP-0001: Create AI Development Office Workspace Dashboard

### Mission Group B: AI Workforce and Provider Separation

Purpose: Remove conceptual ambiguity between EOS executive agents and external AI providers.

Included ECRs:
- ECR-0002
- ECR-0003
- ECR-0008

Primary outcome:
Mission Control clearly separates executive leadership agents, working AI workforce members, and external model/provider infrastructure.

Likely first mission:
ADM-IMP-0002: Split Agents, Workforce Members, and Provider Administration Views

### Mission Group C: Workspace Dashboard Architecture

Purpose: Replace page-like routing with operational dashboards.

Included ECRs:
- ECR-0004
- ECR-0010
- ECR-0017
- ECR-0018

Primary outcome:
Every primary workspace opens to a dashboard that summarizes status, attention, work in progress, risks, decisions, and next actions.

Likely first mission:
ADM-IMP-0003: Create Reusable Workspace Dashboard Component Pattern

### Mission Group D: Executive Office Standardization

Purpose: Make each Executive Office feel like a consistent operating unit.

Included ECRs:
- ECR-0005
- ECR-0009
- ECR-0015

Primary outcome:
Executive Offices use consistent sections, useful operating cards, and standardized lifecycle/status language.

Likely first mission:
ADM-IMP-0004: Standardize Executive Office Layout and Replace Placeholder Panels

### Mission Group E: Personal Workspace and Executive Productivity

Purpose: Turn My Workspace into a useful CEO operating surface instead of placeholder routes.

Included ECRs:
- ECR-0006
- ECR-0011

Primary outcome:
Briefing, Tasks, Decisions, and Notes become useful local operating views, while command palette supports governed navigation assistance.

Likely first mission:
ADM-IMP-0005: Activate My Workspace Foundation

### Mission Group F: Quality, Demo, and Governance Visibility

Purpose: Improve readiness evidence for executive, investor, and engineering review.

Included ECRs:
- ECR-0014
- ECR-0019
- ECR-0020

Primary outcome:
Mission Control exposes frontend quality gates, component ownership, and demo readiness state.

Likely first mission:
ADM-IMP-0006: Create Mission Control UX Gate and Demo Readiness View

### Mission Group G: Identity and Intake UX Hardening

Purpose: Improve profile, avatar, logo, and organization intake usability.

Included ECRs:
- ECR-0016

Primary outcome:
Identity Media provides clearer upload feedback, preview, validation, and linked profile/organization state.

Likely first mission:
ADM-IMP-0007: Harden Identity Media Upload UX

## 4. Recommended First 5 Autonomous Development Missions

### ADM-IMP-0001: Create AI Development Office Workspace Dashboard

Source ECRs:
- ECR-0001
- ECR-0007

Objective:
Promote AI Development Office into a first-class workspace and create a dashboard that summarizes mission queue, active sprint, provider readiness, engineering ledger, and human approval state.

Scope:
- Add AI Development Office workspace entry if missing.
- Ensure context navigation includes Dashboard, Workforce, Providers, Dispatch, Ledger, Roadmap, and Analytics.
- Create or refine dashboard view using existing data services.
- Do not execute provider dispatch.

Acceptance Criteria:
- AI Development Office appears as a primary workspace.
- Dashboard includes mission queue, active mission, provider status, ledger summary, review status, and stop condition warnings.
- No execution actions are enabled.

### ADM-IMP-0002: Split Agents, Workforce Members, and Provider Administration Views

Source ECRs:
- ECR-0002
- ECR-0003
- ECR-0008

Objective:
Clarify the AI operating model by separating EOS executive agents, AI workforce members, and external AI providers.

Scope:
- Update labels and route copy.
- Create provider cards for readiness, credentials, model selection, cost, latency, health, and dispatch eligibility.
- Preserve existing executive agent views.

Acceptance Criteria:
- Users can identify who governs, who works, and which provider executes.
- Provider management is operationally structured but non-executable until credentials and governance are implemented.

### ADM-IMP-0003: Create Reusable Workspace Dashboard Component Pattern

Source ECRs:
- ECR-0004
- ECR-0010
- ECR-0017
- ECR-0018

Objective:
Create reusable dashboard primitives and apply them to priority workspaces.

Scope:
- Define shared dashboard layout components.
- Support metric strips, operating cards, queue cards, risk cards, and recommended action cards.
- Apply to AI Development Office, Platform, and My Workspace first.

Acceptance Criteria:
- Three workspaces use a shared dashboard pattern.
- Loading, empty, blocked, and error states are standardized.
- Smaller laptop layouts remain usable.

### ADM-IMP-0004: Standardize Executive Office Layout and Replace Placeholder Panels

Source ECRs:
- ECR-0005
- ECR-0009
- ECR-0015

Objective:
Make Executive Offices consistent, useful, and less placeholder-driven.

Scope:
- Standardize sections: Dashboard, Operations, Workforce, Knowledge, Analytics, Governance, Settings.
- Replace placeholder panels with current-state operating cards.
- Normalize status language.

Acceptance Criteria:
- All Executive Offices share the same layout pattern.
- Placeholder panels are replaced by cards that explain current state, why execution is not enabled, and the next mission.

### ADM-IMP-0005: Activate My Workspace Foundation

Source ECRs:
- ECR-0006
- ECR-0011

Objective:
Turn My Workspace into a useful CEO operating surface and improve command palette navigation assistance.

Scope:
- Improve Briefing, Tasks, Decisions, and Notes routes.
- Add current-priority, attention, decision, and note scaffolds.
- Make command palette useful for navigation suggestions while keeping execution disabled.

Acceptance Criteria:
- My Workspace no longer reads as empty future routes.
- Command palette offers route suggestions and clearly labels non-executable actions.

## 5. Files Likely Affected

Navigation and routing:
- `frontend/src/App.jsx`
- `frontend/src/navigation/missionControlWorkspaces.js`
- `frontend/src/services/api.js`

AI Development Office and AI workforce:
- `frontend/src/components/AiDevelopmentOfficeView.jsx`
- `frontend/src/components/AiDevelopmentOfficeView.css`
- `frontend/src/components/AiWorkforceAdministrationView.jsx`
- `frontend/src/components/AiWorkforceOperationsView.jsx`

Workspace and navigation components:
- `frontend/src/components/WorkspaceRail.jsx`
- `frontend/src/components/WorkspaceHome.jsx`
- `frontend/src/components/WorkspaceTile.jsx`
- `frontend/src/components/ContextNavigation.jsx`
- `frontend/src/components/CommandPalette.jsx`
- `frontend/src/components/Breadcrumbs.jsx`
- `frontend/src/components/ExecutiveCommandBar.jsx`

Executive and operational views:
- `frontend/src/components/ExecutiveOfficeView.jsx`
- `frontend/src/components/ExecutiveCouncilView.jsx`
- `frontend/src/components/CeoCockpitView.jsx`
- `frontend/src/components/FoundationView.jsx`
- `frontend/src/components/PlatformAdministrationCenter.jsx`
- `frontend/src/components/AuditReadinessView.jsx`

Design system and styling:
- `frontend/src/design-system/eosDesignSystem.js`
- `frontend/src/App.css`

Documentation and mission outputs:
- `docs/programmes/mission-control-2.0/IMPLEMENTATION-QUEUE.md`
- `docs/programmes/mission-control-2.0/PROGRAMME.md`
- Future `docs/autonomous-development/missions/*.md`

## 6. Risks

1. Scope creep risk: Mission Control 2.0 can become too broad if workspace redesign, provider admin, executive offices, and autonomous development are implemented in one mission.
2. Conceptual model risk: EOS executive agents, workforce members, providers, and models must remain separate or the UX will confuse governance ownership with execution infrastructure.
3. Placeholder risk: Removing placeholder language too aggressively can imply functionality exists when it is still governed or disabled.
4. Source-of-truth risk: Frontend views must not invent operational state that backend registries cannot support.
5. Demo risk: Investor-ready screens must avoid exposing raw internal implementation details, broken states, or ambiguous "future" language.
6. Execution safety risk: Provider dispatch, command palette execution, task assignment, and approval actions must remain disabled until governance, credentials, persistence, and audit controls exist.
7. Architecture risk: Adding more route-specific logic to `App.jsx` may worsen maintainability unless route/view registry work is included.
8. Accessibility risk: Dense dashboards and command surfaces may regress keyboard navigation, contrast, or screen-reader clarity if not checked.

## 7. Stop Conditions

Autonomous implementation missions generated from this backlog must stop if any of the following occur:

1. A mission requires real provider credentials, API keys, OAuth tokens, or external service authentication.
2. A mission would execute real provider dispatch, send messages, schedule meetings, push code, create external resources, or make irreversible changes.
3. A mission needs backend contract changes not included in its approved scope.
4. A mission cannot preserve existing Mission Control routes and current user access paths.
5. A mission would remove governance warnings or make display-only actions appear executable.
6. A mission requires modifying files outside its approved implementation scope.
7. Lint, build, or frontend verification cannot pass after implementation.
8. The implementation would confuse EOS executive agents with external AI providers.
9. The UI cannot clearly distinguish operational functionality from planned/future functionality.
10. Required human approval, review, or credentials are missing.
