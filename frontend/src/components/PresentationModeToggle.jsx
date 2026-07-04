function PresentationModeToggle({ isEnabled, onToggle }) {
  return (
    <button
      aria-pressed={isEnabled}
      className={`presentation-toggle ${isEnabled ? 'is-active' : ''}`}
      onClick={onToggle}
      type="button"
    >
      {isEnabled ? 'Presentation Mode Active' : 'Presentation Mode'}
    </button>
  )
}

export default PresentationModeToggle
