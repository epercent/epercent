import { useEffect, useMemo, useState } from 'react'

const DEFAULT_PHASES = [
  'Authenticating session',
  'Initializing EOS Core API',
  'Loading Enterprise Object Registry',
  'Opening Knowledge Vault',
  'Bringing AI Workforce online',
  'Preparing Digital Twin Engine',
  'Initializing Second Balance Sheet',
  'Launching Enterprise Control'
]

function phaseState(index, activeIndex) {
  if (index < activeIndex) return 'complete'
  if (index === activeIndex) return 'active'
  return 'pending'
}

function EosStartupScreen({ startupData }) {
  const startup = startupData?.startupExperience

  const configuredPhases = startup?.bootPhases?.length
    ? startup.bootPhases
    : DEFAULT_PHASES

  const phases = useMemo(() => {
    const basePhases = configuredPhases.filter(
      (phase) => !/open enterprise value/i.test(phase)
    )

    return [...basePhases, 'Launching Enterprise Control']
  }, [configuredPhases])

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)

    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current >= phases.length - 1) {
          window.clearInterval(interval)
          return current
        }

        return current + 1
      })
    }, 2600)

    return () => window.clearInterval(interval)
  }, [phases.length])

  const visiblePhases = phases.slice(0, activeIndex + 1)
  const isLaunching = activeIndex >= phases.length - 1

  return (
    <section className="eos-startup-screen eos-startup-v2" aria-live="polite">
      <div className="startup-orb startup-orb-v2" aria-hidden="true">
        <span />
      </div>

      <div className="startup-copy">
        <p>{startup?.welcomeMessage ?? 'Welcome to EOS'}</p>
        <h1>{startup?.name ?? 'Enterprise Operating System'}</h1>
        <strong>
          {isLaunching
            ? 'Launching Enterprise Control...'
            : startup?.theme ?? 'Preparing your Enterprise Intelligence environment'}
        </strong>
      </div>

      <ol className="startup-sequence-list">
        {visiblePhases.map((phase, index) => {
          const state = phaseState(index, activeIndex)

          return (
            <li className={`startup-sequence-step ${state}`} key={phase}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{phase}</strong>
              <em>
                {state === 'complete'
                  ? 'Operational'
                  : state === 'active'
                    ? 'Loading'
                    : 'Waiting'}
              </em>
            </li>
          )
        })}
      </ol>

      <div className="startup-progress-track">
        <div
          className="startup-progress-fill"
          style={{ width: `${((activeIndex + 1) / phases.length) * 100}%` }}
        />
      </div>
    </section>
  )
}

export default EosStartupScreen
