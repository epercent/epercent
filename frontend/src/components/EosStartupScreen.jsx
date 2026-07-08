import { useEffect, useMemo, useState } from 'react'

const BOOT_PHASES = [
  'Authenticating session',
  'Initializing EOS Core API',
  'Loading Enterprise Registry',
  'Opening Knowledge Vault',
  'Bringing AI Workforce online',
  'Preparing Digital Twin Engine',
  'Initializing Second Balance Sheet',
  'Preparing Enterprise Control'
]

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good Morning Eric'
  if (hour < 18) return 'Good Afternoon Eric'
  return 'Good Evening Eric'
}

function bootState(index, activeIndex) {
  if (index < activeIndex) return 'complete'
  if (index === activeIndex) return 'active'
  return 'pending'
}

function EosStartupScreen({ startupData }) {
  const startup = startupData?.startupExperience
  const phases = useMemo(() => startup?.bootPhases?.length ? startup.bootPhases : BOOT_PHASES, [startup?.bootPhases])
  const [stage, setStage] = useState('welcome')
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStage('greeting'), 3000),
      window.setTimeout(() => setStage('boot'), 5200),
      window.setTimeout(() => setStage('ready'), 20000),
      window.setTimeout(() => setStage('launch'), 22500),
    ]

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [])

  useEffect(() => {
    if (stage !== 'boot') return undefined

    setActiveIndex(0)

    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current >= phases.length - 1) {
          window.clearInterval(interval)
          return current
        }

        return current + 1
      })
    }, 1800)

    return () => window.clearInterval(interval)
  }, [stage, phases.length])

  return (
    <section className={`eos-startup-screen eos-startup-v3 startup-stage-${stage}`} aria-live="polite">
      <div className="startup-orb startup-orb-v2" aria-hidden="true">
        <span />
      </div>

      {stage === 'welcome' && (
        <div className="startup-copy startup-hero-copy">
          <p>{startup?.welcomeMessage ?? 'Welcome to EOS'}</p>
          <h1>{startup?.name ?? 'Enterprise Operating System'}</h1>
          <strong>The Enterprise Intelligence Platform</strong>
        </div>
      )}

      {stage === 'greeting' && (
        <div className="startup-copy startup-hero-copy">
          <p>{getGreeting()}</p>
          <h1>Welcome back to EOS.</h1>
          <strong>Initializing Enterprise Intelligence...</strong>
        </div>
      )}

      {stage === 'boot' && (
        <>
          <div className="startup-copy">
            <p>{getGreeting()}</p>
            <h1>Bringing EOS online</h1>
            <strong>Verifying enterprise systems and runtime intelligence...</strong>
          </div>

          <ol className="startup-sequence-list">
            {phases.slice(0, activeIndex + 1).map((phase, index) => {
              const state = bootState(index, activeIndex)

              return (
                <li className={`startup-sequence-step ${state}`} key={phase}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{phase}</strong>
                  <em>{state === 'complete' ? 'Operational' : 'Loading'}</em>
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
        </>
      )}

      {stage === 'ready' && (
        <div className="startup-copy startup-hero-copy">
          <p>Enterprise Ready</p>
          <h1>EOS is online.</h1>
          <strong>Enterprise Control is ready.</strong>
        </div>
      )}

      {stage === 'launch' && (
        <div className="startup-copy startup-hero-copy">
          <p>Launching</p>
          <h1>Enterprise Control</h1>
          <strong>Entering your executive operating layer...</strong>
        </div>
      )}
    </section>
  )
}

export default EosStartupScreen
