function Breadcrumbs({ item, workspace }) {
  const trail = ['Mission Control']

  if (workspace) {
    trail.push(workspace.label)
  }

  if (item?.label) {
    trail.push(item.label)
  }

  if (!item?.label && !workspace) {
    trail.push('Lobby')
  }

  return (
    <nav className="breadcrumbs" aria-label="Current location">
      {trail.map((entry, index) => (
        <span key={`${entry}-${index}`}>
          {entry}
        </span>
      ))}
    </nav>
  )
}

export default Breadcrumbs
