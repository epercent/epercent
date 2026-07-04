import { useState } from 'react'

const commandSuggestions = [
  {
    id: 'search-athena',
    label: 'Search Athena',
    route: 'knowledge',
    description: 'Open the Knowledge workspace and review Athena research assets.'
  },
  {
    id: 'open-backup-status',
    label: 'Open Backup Status',
    route: 'backups',
    description: 'Review latest backup archive, checksum, and restore validation posture.'
  },
  {
    id: 'review-second-balance-sheet',
    label: 'Review Second Balance Sheet',
    route: 'second-balance-sheet',
    description: 'Open operational digital asset metrics and value thesis.'
  },
  {
    id: 'message-codex',
    label: 'Message Codex',
    route: 'communications',
    description: 'Open AI Workforce communications. External messaging is not enabled.'
  },
  {
    id: 'open-digital-twin-assets',
    label: 'Open Digital Twin Assets',
    route: 'digital-twin-assets',
    description: 'Review DTA monitoring, formation, and commercialization readiness.'
  }
]

function CommandPalette({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="command-palette">
      <label htmlFor="mission-command">Command</label>
      <input
        autoComplete="off"
        id="mission-command"
        onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
        onFocus={() => setIsOpen(true)}
        onMouseDown={() => setIsOpen(true)}
        placeholder="Search Athena, open backups, review Second Balance Sheet..."
        type="search"
      />
      {isOpen ? (
        <div className="command-palette-suggestions" role="listbox">
          {commandSuggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onNavigate(suggestion.route)
                setIsOpen(false)
              }}
              title={suggestion.description}
              type="button"
            >
              <strong>{suggestion.label}</strong>
              <span>{suggestion.description}</span>
            </button>
          ))}
          <p>Command execution is pending governance approval. Navigation commands are available.</p>
        </div>
      ) : null}
    </div>
  )
}

export default CommandPalette
