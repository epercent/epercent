import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import { eosTooltips, executiveValue } from '../design-system/eosDesignSystem.js'

function WorkforceMetric({ description, label, value, detail }) {
  return (
    <article>
      <span>
        <ExecutiveTooltip description={description}>{label}</ExecutiveTooltip>
      </span>
      <strong>{executiveValue(value, 'Pending Assessment')}</strong>
      {detail && <small>{detail}</small>}
    </article>
  )
}

function MessageThreadList({ messages }) {
  const threadIds = [...new Set(messages.map((message) => message.threadId))]

  return (
    <div className="message-thread-list">
      {threadIds.map((threadId) => {
        const threadMessages = messages.filter((message) => message.threadId === threadId)
        const latestMessage = threadMessages.at(-1)

        return (
          <article key={threadId}>
            <div>
              <span>{threadId}</span>
              <h4>{latestMessage?.subject}</h4>
              <p>{latestMessage?.body}</p>
            </div>
            <dl>
              <div>
                <dt>Priority</dt>
                <dd>{latestMessage?.priority}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{latestMessage?.status}</dd>
              </div>
              <div>
                <dt>Response</dt>
                <dd>{latestMessage?.requiresResponse ? 'Required' : 'Not Required'}</dd>
              </div>
            </dl>
          </article>
        )
      })}
    </div>
  )
}

function ActivityList({ activity }) {
  return (
    <div className="activity-list">
      {activity.map((item) => (
        <article key={item.id}>
          <div>
            <span>{item.agentName} / {item.activityType}</span>
            <h4>{item.title}</h4>
            <p>{item.summary}</p>
          </div>
          <div className="progress-line" aria-label={`${item.title} progress`}>
            <span style={{ width: `${Math.max(0, Math.min(100, item.progress ?? 0))}%` }} />
          </div>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>{item.status}</dd>
            </div>
            <div>
              <dt>Progress</dt>
              <dd>{item.progress}%</dd>
            </div>
            <div>
              <dt>Attention</dt>
              <dd>{item.attentionLevel}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  )
}

function AttentionList({ attention }) {
  return (
    <div className="attention-list">
      {attention.map((item) => (
        <article key={item.id}>
          <div>
            <span>{item.sourceAgent} / {item.priority}</span>
            <h4>{item.title}</h4>
            <p>{item.reason}</p>
          </div>
          <strong>{item.estimatedReviewTime}</strong>
          <small>{item.recommendedAction}</small>
        </article>
      ))}
    </div>
  )
}

function CalendarList({ calendar }) {
  return (
    <div className="calendar-list">
      {calendar.map((event) => (
        <article key={event.id}>
          <div>
            <span>{event.type}</span>
            <h4>{event.title}</h4>
            <p>{event.recommendedPreparation}</p>
          </div>
          <dl>
            <div>
              <dt>Priority</dt>
              <dd>{event.priority}</dd>
            </div>
            <div>
              <dt>Attendance</dt>
              <dd>{event.requiresHumanAttendance ? 'CEO Review' : 'Agent Managed'}</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>{event.meetingMode}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  )
}

function AiWorkforceOperationsView({
  mode,
  messagesData,
  activityData,
  attentionData,
  calendarData,
  agents,
}) {
  const messages = messagesData?.messages ?? []
  const activity = activityData?.activity ?? []
  const attention = attentionData?.attention ?? []
  const calendar = calendarData?.calendar ?? []
  const activeAgents = agents?.filter((agent) => agent.status === 'Active') ?? []

  const isCommunications = mode === 'communications'
  const isCalendar = mode === 'calendar'
  const isPerformance = mode === 'performance'

  return (
    <section className="operations-section">
      <div className="section-heading">
        <div>
          <p className="section-label">AI Workforce</p>
          <h2>
            {isCommunications
              ? 'Communications'
              : isCalendar
                ? 'Calendar'
                : isPerformance
                  ? 'Performance'
                  : 'Activity & Attention'}
          </h2>
        </div>
        <strong>{activeAgents.length} Active Agents</strong>
      </div>

      <div className="operations-metric-grid">
        <WorkforceMetric description={eosTooltips.activeExecutives} label="AI Workforce" value={activeAgents.length} detail="Active agents" />
        <WorkforceMetric label="Messages" value={messages.length} detail={`${messages.filter((message) => message.requiresResponse).length} require response`} />
        <WorkforceMetric description={eosTooltips.progress} label="Active Work" value={activity.length} detail={`${activity.filter((item) => item.requiresHumanAttention).length} need review`} />
        <WorkforceMetric description={eosTooltips.attentionLevel} label="Attention Queue" value={attention.length} detail={`${attention.filter((item) => item.status === 'Open').length} open`} />
        <WorkforceMetric label="Calendar Events" value={calendar.length} detail={`${calendar.filter((event) => event.requiresHumanAttendance).length} CEO review`} />
        <WorkforceMetric label="Executive Review Time" value="30 minutes" detail="Estimated open review load" />
      </div>

      {isCommunications ? (
        <section className="operations-panel">
          <div className="operations-panel-heading">
            <h3>Agent Inbox</h3>
            <strong>{messages.length}</strong>
          </div>
          <MessageThreadList messages={messages} />
        </section>
      ) : isCalendar ? (
        <section className="operations-panel">
          <div className="operations-panel-heading">
            <h3>Upcoming Agent Events</h3>
            <strong>{calendar.length}</strong>
          </div>
          <CalendarList calendar={calendar} />
        </section>
      ) : (
        <>
          <div className="operations-grid">
            <section className="operations-panel">
              <div className="operations-panel-heading">
                <h3>Live Agent Activity</h3>
                <strong>{activity.length}</strong>
              </div>
              <ActivityList activity={activity} />
            </section>

            <section className="operations-panel">
              <div className="operations-panel-heading">
                <h3>Attention Queue</h3>
                <strong>{attention.length}</strong>
              </div>
              <AttentionList attention={attention} />
            </section>
          </div>

          <section className="operations-panel">
            <div className="operations-panel-heading">
              <h3>Agent Performance Foundation</h3>
              <strong>{isPerformance ? 'Ready' : 'Monitoring'}</strong>
            </div>
            <div className="policy-list">
              {activeAgents.map((agent) => (
                <article key={agent.id}>
                  <h4>{agent.name}</h4>
                  <p>{executiveValue(agent.currentTask, 'Current focus is being assessed.')}</p>
                  <small>{agent.health} / {agent.progress}% progress</small>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </section>
  )
}

export default AiWorkforceOperationsView
