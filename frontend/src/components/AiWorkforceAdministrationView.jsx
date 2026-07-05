import { useEffect, useState } from 'react'
import {
  fetchAiWorkforceMembers,
  fetchAiWorkforceProviderHealth,
  fetchSprintReport
} from '../services/api'

export default function AiWorkforceAdministrationView() {
  const [members, setMembers] = useState([])
  const [health, setHealth] = useState(null)
  const [report, setReport] = useState(null)

  useEffect(() => {
    Promise.all([
      fetchAiWorkforceMembers(),
      fetchAiWorkforceProviderHealth(),
      fetchSprintReport()
    ]).then(([membersResult, healthResult, reportResult]) => {
      setMembers(membersResult.members)
      setHealth(healthResult)
      setReport(reportResult)
    })
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] opacity-60">AI Development Office</p>
        <h1 className="text-3xl font-semibold">AI Workforce Administration</h1>
        <p className="opacity-70">
          Onboard, configure, monitor, and govern AI engineering workforce members.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Workforce Members" value={members.length} />
        <Metric label="Enabled" value={members.filter((m) => m.enabled).length} />
        <Metric label="Connected" value={members.filter((m) => m.connected).length} />
        <Metric label="ADI" value={`${report?.maturity?.autonomousDevelopmentIndex ?? 0}%`} />
      </div>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">AI Workforce Providers</h2>
            <p className="opacity-60">Provider onboarding and configuration status.</p>
          </div>
          <button className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10">
            Add Provider
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {members.map((member) => (
            <article key={member.id} className="rounded-xl border border-white/10 bg-black/20 p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm opacity-60">{member.role}</p>
                </div>
                <StatusPill active={member.connected} label={member.connected ? 'Connected' : 'Not Connected'} />
              </div>

              <div className="space-y-2 text-sm">
                <Row label="Provider" value={member.provider} />
                <Row label="Model" value={member.model} />
                <Row label="Enabled" value={member.enabled ? 'Yes' : 'No'} />
                <Row label="Health" value={member.health} />
                <Row label="Missions" value={member.missionsCompleted} />
                <Row label="Performance" value={`${member.performance}%`} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
                  Configure
                </button>
                <button className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
                  Test
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Provider Readiness</h2>
        <p className="mt-2 opacity-70">{health?.message}</p>

        <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4">
          <p className="font-medium">Configuration Required</p>
          <p className="mt-1 text-sm opacity-70">
            API credentials and live provider health checks are pending. Next step: connect OpenAI and run a live test mission.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Latest Sprint Report</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Metric label="Sprint" value={report?.sprint?.id ?? 'Pending'} />
          <Metric label="Status" value={report?.sprint?.status ?? 'Pending'} />
          <Metric label="Maturity" value={report?.maturity?.status ?? 'Pending'} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold">Achievements</h3>
            <ul className="mt-3 space-y-2 text-sm opacity-80">
              {(report?.achievements ?? []).map((item) => <li key={item}>✓ {item}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Next Sprint</h3>
            <ul className="mt-3 space-y-2 text-sm opacity-80">
              {(report?.nextSprint ?? []).map((item) => <li key={item}>→ {item}</li>)}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm opacity-60">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="opacity-60">{label}</span>
      <span>{value}</span>
    </div>
  )
}

function StatusPill({ active, label }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs ${active ? 'border-emerald-400/30 text-emerald-300' : 'border-amber-400/30 text-amber-300'}`}>
      {label}
    </span>
  )
}
