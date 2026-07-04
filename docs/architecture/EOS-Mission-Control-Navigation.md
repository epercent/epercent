# EOS Mission Control Navigation

Version: 0.23.0

## Purpose

Mission Control navigation is now designed as a Digital Enterprise Headquarters operating model rather than a long website menu. Navigation should help executives choose a workspace, understand current context, and move to the next decision without scanning unrelated platform areas.

## Model

Mission Control uses four navigation layers:

1. Executive Command Bar: always visible platform identity, workspace context, headline metrics, attention, command/search, and Presentation Mode.
2. Digital Headquarters Lobby: default home experience with greeting, enterprise health, internal enterprise value, review time, attention, and workspace tiles.
3. Primary Workspace Rail: eight workspace selector for Headquarters, Enterprise, Enterprise Value, AI Workforce, Knowledge, Platform, Development, and My Workspace.
4. Context Navigation: only shows the routes relevant to the active workspace.

Hover behavior explains items. It does not navigate.

## Workspace Routes

- Headquarters: CEO Cockpit, Executive Council, Executive Offices
- Enterprise: Strategy, Governance, PMO, Roadmap, Programs
- Enterprise Value: Master Monitoring, Technology Flywheel, Valuation, Revenue Engine, Second Balance Sheet, Digital Twin Assets, Enterprise Home, Digital Twin Structure, Data Feeds, Systems, Assets, Human Workflows, DTA Lifecycle, Enterprise Profile, Investor Readiness, Commercial Readiness, Investor Centre
- AI Workforce: Agents, Communications, Activity, Calendar, Performance
- Knowledge: Knowledge Vault, White Papers, Academic Papers, Patents, Publications
- Platform: Administration, Startup Experience, Identity Media, Organization Intake, Repository Links, Storage, Backups, Health, Releases
- Development: Capabilities, Architecture, Engineering
- My Workspace: Briefing, Tasks, Decisions, Notes

## Command Palette Foundation

The command palette is display and navigation only. It may suggest executive actions such as Search Athena, Open Backup Status, Review Second Balance Sheet, Message Codex, and Open Digital Twin Assets. Command execution remains disabled until governed write APIs, audit controls, permissions, and action execution policies are implemented.

## Future Architecture

Future capabilities should connect the command palette to governed action records, user-specific saved workspaces, persistent preferences, cross-object search, and keyboard shortcuts.
