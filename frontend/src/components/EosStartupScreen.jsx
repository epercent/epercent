function EosStartupScreen({ startupData }) {
  const startup = startupData?.startupExperience
  const phases = startup?.bootPhases ?? [
    'Initialize EOS Core API',
    'Load Enterprise Object Registry',
    'Load Digital Twin Asset Layer',
    'Load AI Workforce',
    'Load Knowledge Repository',
    'Launch Enterprise Control'
  ]

  return (
    <section className="eos-startup-screen" aria-live="polite">
      <div className="startup-orb" aria-hidden="true">
        <span />
      </div>

      <div className="startup-copy">
        <p>Welcome to EOS</p>
        <h1>{startup?.name ?? 'Enterprise Operating System'}</h1>
        <strong>{startup?.theme ?? 'Preparing your Enterprise Control environment'}</strong>
      </div>

      <ol>
        {phases.map((phase, index) => (
          <li
            className={`startup-step startup-step-${index + 1}`}
            key={phase}
            style={{ animationDelay: `${index * 0.65}s` }}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{phase}</strong>
            <em>{index === phases.length - 1 ? 'Launching' : 'Verifying'}</em>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default EosStartupScreen
