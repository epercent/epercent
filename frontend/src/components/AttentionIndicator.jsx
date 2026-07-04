import { executiveValue } from '../design-system/eosDesignSystem.js'

function AttentionIndicator({ count = 0, level = 'No Action Required', description }) {
  const normalizedCount = Number.isFinite(Number(count)) ? Number(count) : 0
  const requiresAttention = normalizedCount > 0

  return (
    <span
      className={`attention-indicator ${requiresAttention ? 'requires-attention' : 'is-clear'}`}
      title={description}
    >
      <span>{requiresAttention ? normalizedCount : '0'}</span>
      <strong>{requiresAttention ? executiveValue(level, 'Review Required') : 'No Action Required'}</strong>
    </span>
  )
}

export default AttentionIndicator
