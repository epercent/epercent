import AttentionIndicator from './AttentionIndicator.jsx'

function WorkspaceRail({ activeWorkspaceId, attentionByWorkspace, metricsByWorkspace, onOpenWorkspace, workspaces }) {
  return (
    <aside className="workspace-rail" aria-label="Primary workspace selector">
      <div className="workspace-rail-heading">
        <span>Workspaces</span>
        <strong>Digital HQ</strong>
      </div>
      <div className="workspace-rail-list">
        {workspaces.map((workspace) => (
          <button
            className={workspace.id === activeWorkspaceId ? 'is-active' : ''}
            key={workspace.id}
            onClick={() => onOpenWorkspace(workspace)}
            title={workspace.description}
            type="button"
          >
            <span className="workspace-marker">{workspace.marker}</span>
            <span className="workspace-rail-copy">
              <strong>{workspace.label}</strong>
              <small>{workspace.description}</small>
            </span>
            <span className="workspace-rail-metric">{metricsByWorkspace[workspace.id] ?? 'Monitoring'}</span>
            <AttentionIndicator count={attentionByWorkspace[workspace.id] ?? 0} />
          </button>
        ))}
      </div>
    </aside>
  )
}

export default WorkspaceRail
