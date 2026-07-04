import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import { executiveValue } from '../design-system/eosDesignSystem.js'

function StatusCard({ description, label, value, detail }) {
  return (
    <article className="status-card">
      <p className="section-label">
        <ExecutiveTooltip description={description}>{label}</ExecutiveTooltip>
      </p>
      <strong>{executiveValue(value, 'Awaiting Live Signal')}</strong>
      {detail && <span>{detail}</span>}
    </article>
  )
}

export default StatusCard
