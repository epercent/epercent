function ExecutiveTooltip({ children, description }) {
  if (!description) {
    return children
  }

  return (
    <span className="executive-tooltip" tabIndex="0">
      {children}
      <span className="executive-tooltip-content" role="tooltip">
        {description}
      </span>
    </span>
  )
}

export default ExecutiveTooltip
