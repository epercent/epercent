# Mission Control 2.0 Frontend ECR Register

## Purpose
Convert frontend audit findings into Engineering Change Requests for the AI Development Office.

## Status
Draft

## Source Files
- mission-control-automated-review.md
- frontend-design-findings.txt

## Review Rule
Every accepted ECR must be specific enough to become an Engineering Mission.

---

## ECR-0001
Title: Promote AI Development Office to First-Class Workspace  
Area: Navigation / Information Architecture  
Priority: Critical  
Finding: AI Development capabilities are currently distributed across AI Workforce and isolated routes.  
Recommendation: Create a dedicated AI Development Office workspace with Dashboard, AI Workforce, Engineering, Providers, Dispatch, Ledger, Roadmap, and Analytics.  
Target: Mission Control 2.0  
Mission Candidate: Yes  

## ECR-0002
Title: Separate EOS Executive Agents from External AI Providers  
Area: AI Workforce Model  
Priority: Critical  
Finding: EOS agents such as Athena, Hermes, Atlas, Codex, Argus, Mercury, and Vulcan are conceptually different from external providers such as OpenAI, Anthropic, and Google.  
Recommendation: Split the model into EOS Executive Agents, AI Workforce Members, and AI Providers.  
Target: Mission Control 2.0  
Mission Candidate: Yes  

## ECR-0003
Title: Convert AI Workforce Admin from Informational Screen to Operational Provider Management  
Area: AI Workforce Administration  
Priority: Critical  
Finding: Current provider administration is mostly informational and does not yet support real configuration, credential entry, model selection, or live health tests.  
Recommendation: Build operational provider onboarding with Add Provider, Configure Credentials, Test Connection, Enable/Disable, Health, Cost, Latency, Mission History, and Dispatch Readiness.  
Target: Mission Control 2.0  
Mission Candidate: Yes  

## ECR-0004
Title: Replace Page-Based Experience with Workspace Dashboards  
Area: Mission Control UX  
Priority: Critical  
Finding: Mission Control currently behaves like a collection of pages rather than an enterprise operating system.  
Recommendation: Each workspace should open to an operational dashboard with widgets, actions, metrics, next steps, and deeper drill-down pages.  
Target: Mission Control 2.0  
Mission Candidate: Yes  

## ECR-0005
Title: Standardize Executive Office Layout Pattern  
Area: Design System / Office Standard  
Priority: High  
Finding: Different workspaces and offices use inconsistent layouts and interaction models.  
Recommendation: Standardize every office around Dashboard, Operations, Workforce, Knowledge, Analytics, Governance, and Settings.  
Target: Mission Control 2.0  
Mission Candidate: Yes  

---

# Raw Audit Findings

416:        description: 'Capability readiness, functional coverage, placeholder register, technical debt, and maturity scoring.'
520:        description: 'Future task queue and executive assignments.'
526:        description: 'Future decision queue and governance approvals.'
532:        description: 'Future executive notes and saved context.'
694:## Placeholder / Future / Pending References
696:frontend/src/navigation/missionControlWorkspaces.js:371:        description: 'Capability readiness, functional coverage, placeholder register, technical debt, and maturity scoring.'
697:frontend/src/navigation/missionControlWorkspaces.js:475:        description: 'Future task queue and executive assignments.'
698:frontend/src/navigation/missionControlWorkspaces.js:481:        description: 'Future decision queue and governance approvals.'
699:frontend/src/navigation/missionControlWorkspaces.js:487:        description: 'Future executive notes and saved context.'
700:frontend/src/App.css:2532:.office-placeholder-grid {
701:frontend/src/App.css:2551:.office-placeholder > span,
702:frontend/src/App.css:2563:.office-placeholder strong {
703:frontend/src/App.css:2570:.office-placeholder p,
704:frontend/src/App.css:2602:.office-placeholder,
705:frontend/src/App.css:2726:.office-placeholder {
706:frontend/src/App.css:2773:.office-placeholder-grid {
707:frontend/src/App.css:4060:.identity-upload-row button:disabled {
708:frontend/src/App.css:4484:.dashboard-shell.is-presentation-mode .office-placeholder-grid,
709:frontend/src/App.css:4639:  .office-placeholder-grid,
710:frontend/src/components/IdentityIntakeView.jsx:139:            <button disabled={isUploading} onClick={() => profilePictureInputRef.current?.click()} type="button">
711:frontend/src/components/IdentityIntakeView.jsx:145:              disabled={isUploading}
712:frontend/src/components/IdentityIntakeView.jsx:154:            <button disabled={isUploading} onClick={() => logoInputRef.current?.click()} type="button">
713:frontend/src/components/IdentityIntakeView.jsx:160:              disabled={isUploading}
714:frontend/src/components/IdentityIntakeView.jsx:276:            placeholder="https://drive.example.com/folder"
716:frontend/src/components/ExecutiveCouncilView.jsx:43:          <dd>{executiveValue(action.approvalStatus, 'Pending Assessment')}</dd>
717:frontend/src/components/ExecutiveCouncilView.jsx:47:          <dd>{executiveValue(action.riskLevel, 'Pending Assessment')}</dd>
719:frontend/src/components/AiWorkforceOperationsView.jsx:10:      <strong>{executiveValue(value, 'Pending Assessment')}</strong>
720:frontend/src/components/AuditReadinessView.jsx:4:  const normalizedStatus = executiveValue(status, 'Pending Assessment')
721:frontend/src/components/AuditReadinessView.jsx:81:            partial, placeholder, broken, and still required for EOS maturity.
722:frontend/src/components/AuditReadinessView.jsx:101:          <small>{summary.placeholders} placeholder capability classifications</small>
724:frontend/src/components/AuditReadinessView.jsx:141:            {(audit.placeholderRegister ?? []).map((item) => (
725:frontend/src/components/ExecutiveActionsPanel.jsx:14:      <strong>{executiveValue(value, 'Pending Assessment')}</strong>
726:frontend/src/components/ExecutiveActionsPanel.jsx:29:          <dd>{executiveValue(action.status, 'Pending Assessment')}</dd>
727:frontend/src/components/ExecutiveActionsPanel.jsx:33:          <dd>{executiveValue(action.approvalStatus, 'Pending Assessment')}</dd>
728:frontend/src/components/ExecutiveActionsPanel.jsx:37:          <dd>{executiveValue(action.riskLevel, 'Pending Assessment')}</dd>
730:frontend/src/components/ExecutiveActionsPanel.jsx:73:        <ActionMetric description={eosTooltips.attentionLevel} label="Pending Approval" value={summary.pendingApproval} />
731:frontend/src/components/StrategicAlignmentView.jsx:83:              <small>{item.recommendedFutureCapability}</small>
732:frontend/src/components/StrategicAlignmentView.jsx:162:              <dd>{executiveValue(activeStep?.enterpriseValueContribution, 'Pending Assessment')}</dd>
733:frontend/src/components/StrategicAlignmentView.jsx:331:            <strong>{executiveValue(value, 'Pending Assessment')}</strong>
735:frontend/src/components/AiWorkforceAdministrationView.jsx:101:          <Metric label="Sprint" value={report?.sprint?.id ?? 'Pending'} />
736:frontend/src/components/AiWorkforceAdministrationView.jsx:102:          <Metric label="Status" value={report?.sprint?.status ?? 'Pending'} />
737:frontend/src/components/AiWorkforceAdministrationView.jsx:103:          <Metric label="Maturity" value={report?.maturity?.status ?? 'Pending'} />
738:frontend/src/components/KnowledgeAssetViewer.jsx:92:              <em>{executiveValue(knowledgeObject.liveStatus.lifecycleStatus, 'Pending Assessment')}</em>
739:frontend/src/components/CeoCockpitView.jsx:18:    return 'Pending Assessment'
741:frontend/src/components/CeoCockpitView.jsx:156:          <p>Executive actions are governed and execution remains disabled.</p>
742:frontend/src/components/WorkspaceHome.jsx:54:            <dd>{executiveValue(roadmap?.currentCapability, 'Pending assessment')}</dd>
744:frontend/src/components/StorageHealthPanel.jsx:23:        <h2>{executiveValue(storageStatus.storageStatus, 'Pending Assessment')}</h2>
745:frontend/src/components/StorageHealthPanel.jsx:37:          <dd>{executiveValue(storageStatus.lastUpdated, 'Pending Assessment')}</dd>
747:frontend/src/components/OnboardedEnterprisesView.jsx:16:    return 'Pending assessment'
751:frontend/src/components/MasterMonitoringView.jsx:234:            <span>Future Onboarding Workflow</span>
752:frontend/src/components/PlatformAdministrationCenter.jsx:10:      <strong>{executiveValue(value, 'Pending Assessment')}</strong>
753:frontend/src/components/PlatformAdministrationCenter.jsx:11:      {detail && <small>{executiveValue(detail, 'Pending Assessment')}</small>}
754:frontend/src/components/StrategicLayerView.jsx:6:    return 'Pending Assessment'
755:frontend/src/components/StrategicLayerView.jsx:22:      <strong>{executiveValue(value, 'Pending Assessment')}</strong>
756:frontend/src/components/StrategicLayerView.jsx:75:              <li key={note}>{executiveValue(note, 'Pending Assessment')}</li>
757:frontend/src/components/KnowledgeObjectDetail.jsx:9:  const values = Array.isArray(items) && items.length > 0 ? items : ['Pending Assessment']
758:frontend/src/components/KnowledgeObjectDetail.jsx:120:            <button disabled key={action} type="button">
762:frontend/src/components/FoundationView.jsx:153:            <p>Backup health: {executiveValue(adminData?.backupHealth, 'Pending Assessment')}</p>
763:frontend/src/components/ExecutiveOfficeView.jsx:53:function PlaceholderPanel({ title, placeholder }) {
764:frontend/src/components/ExecutiveOfficeView.jsx:55:    <article className="office-placeholder">
765:frontend/src/components/ExecutiveOfficeView.jsx:57:      <strong>{executiveValue(placeholder.status, 'Future Capability')}</strong>
766:frontend/src/components/ExecutiveOfficeView.jsx:58:      <p>{executiveValue(placeholder.summary, 'This capability is planned for a future release.')}</p>
767:frontend/src/components/ExecutiveOfficeView.jsx:117:              <dd>{executiveValue(selectedOffice.estimatedCeoReviewTime, 'Pending Assessment')}</dd>
768:frontend/src/components/ExecutiveOfficeView.jsx:199:        <section className="office-placeholder-grid">
769:frontend/src/components/ExecutiveOfficeView.jsx:200:          <PlaceholderPanel title="Messages" placeholder={selectedOffice.messages} />
770:frontend/src/components/ExecutiveOfficeView.jsx:201:          <PlaceholderPanel title="Meetings" placeholder={selectedOffice.meetings} />
771:frontend/src/components/ExecutiveOfficeView.jsx:202:          <PlaceholderPanel title="Calendar" placeholder={selectedOffice.calendar} />
772:frontend/src/components/ExecutiveOfficeView.jsx:203:          <PlaceholderPanel title="Temporary Agents" placeholder={selectedOffice.temporaryAgents} />
773:frontend/src/components/CommandPalette.jsx:48:        placeholder="Search Athena, open backups, review Second Balance Sheet..."
776:frontend/src/components/LiveStatusPanel.jsx:55:          <dd>{executiveValue(liveStatus?.lifecycleStatus, 'Pending Assessment')}</dd>
779:frontend/src/components/AiDevelopmentOfficeView.jsx:27:        <Metric label="Pending Reviews" value={metrics.pendingReviews ?? 0} />
780:frontend/src/components/PmoView.jsx:14:      <strong>{executiveValue(value, 'Pending Assessment')}</strong>
786:frontend/src/design-system/eosDesignSystem.js:44:  unknown: 'Pending Assessment',
787:frontend/src/design-system/eosDesignSystem.js:55:    return value ? 'Yes' : 'Pending Assessment'
