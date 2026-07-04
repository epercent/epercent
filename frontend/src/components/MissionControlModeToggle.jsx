const modes = [
  { id: 'cockpit', label: 'CEO Cockpit' },
  { id: 'council', label: 'Executive Council' },
  { id: 'offices', label: 'Executive Offices' },
  { id: 'programs', label: 'Programs' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'assets', label: 'Assets' },
  { id: 'knowledge', label: 'Knowledge' },
  { id: 'roadmap', label: 'Roadmap' },
]

function MissionControlModeToggle({ mode, onModeChange }) {
  return (
    <div className="mode-toggle" aria-label="Mission Control mode">
      {modes.map((modeOption) => (
        <button
          aria-pressed={mode === modeOption.id}
          className={mode === modeOption.id ? 'is-active' : ''}
          key={modeOption.id}
          onClick={() => onModeChange(modeOption.id)}
          type="button"
        >
          {modeOption.label}
        </button>
      ))}
    </div>
  )
}

export default MissionControlModeToggle
