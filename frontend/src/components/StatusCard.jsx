function StatusCard({ label, value, detail }) {
  return (
    <article className="status-card">
      <p className="section-label">{label}</p>
      <strong>{value ?? 'Unavailable'}</strong>
      {detail && <span>{detail}</span>}
    </article>
  )
}

export default StatusCard
