import AttentionIndicator from './AttentionIndicator.jsx'

function WorkspaceTile({ workspace, metric, status = 'Monitoring', attentionCount = 0, onOpen }) {
  return (
    <button
      className="workspace-tile"
      onClick={() => onOpen(workspace)}
      title={workspace.description}
      type="button"
    >
      <span className="workspace-marker">{workspace.marker}</span>
      <span className="workspace-tile-copy">
        <strong>{workspace.label}</strong>
        <small>{workspace.description}</small>
      </span>
      <span className="workspace-tile-meta">
        <span>{status}</span>
        <strong>{metric}</strong>
      </span>
      <AttentionIndicator count={attentionCount} />
    </button>
  )
}

export default WorkspaceTile
