import { executiveValue } from '../design-system/eosDesignSystem.js'

function MetricPill({ label, value, detail, description }) {
  return (
    <span className="metric-pill" title={description}>
      <span>{label}</span>
      <strong>{executiveValue(value, 'Awaiting data')}</strong>
      {detail ? <small>{detail}</small> : null}
    </span>
  )
}

export default MetricPill
