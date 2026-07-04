function EosStartupScreen({ startupData }) {
  const startup = startupData?.startupExperience
  const phases = startup?.bootPhases ?? [
    'Initialize EOS Core API',
    'Load Enterprise Object Registry',
    'Open Enterprise Value'
  ]

  return (
    <section className="eos-startup-screen" aria-live="polite">
      <div className="startup-orb" aria-hidden="true">
        <span />
      </div>
      <div className="startup-copy">
        <p>EOS Mission Control</p>
        <h1>{startup?.name ?? 'EOS Startup Experience'}</h1>
        <strong>{startup?.theme ?? 'Master Monitoring Executive Dark'}</strong>
      </div>
      <ol>
        {phases.map((phase, index) => (
          <li key={phase}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{phase}</strong>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default EosStartupScreen
