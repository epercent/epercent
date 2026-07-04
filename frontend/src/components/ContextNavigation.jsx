function ContextNavigation({ activeMode, onNavigate, workspace }) {
  if (!workspace?.items?.length) {
    return null
  }

  return (
    <nav className="context-navigation" aria-label={`${workspace.label} navigation`}>
      <div>
        <span>{workspace.label}</span>
        <strong>{workspace.description}</strong>
      </div>
      <div className="context-navigation-actions">
        {workspace.items.map((item) => (
          <button
            className={item.route === activeMode ? 'is-active' : ''}
            key={item.id}
            onClick={() => onNavigate(item.route)}
            title={item.description}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default ContextNavigation
