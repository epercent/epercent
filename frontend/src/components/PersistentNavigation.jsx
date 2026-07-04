import ExecutiveTooltip from './ExecutiveTooltip.jsx'
import { executiveValue } from '../design-system/eosDesignSystem.js'

function PersistentNavigation({ activeMode, navigationData, onNavigate }) {
  const navigation = navigationData?.navigation ?? []

  return (
    <aside className="persistent-navigation" aria-label="Mission Control navigation">
      <div className="navigation-brand">
        <span>EOS</span>
        <strong>Headquarters</strong>
      </div>

      <div className="navigation-domain-list">
        {navigation.map((domain) => (
          <section key={domain.id}>
            <h2>{domain.domain}</h2>
            <div>
              {domain.items.map((item) => (
                <button
                  aria-current={activeMode === item.route ? 'page' : undefined}
                  className={activeMode === item.route ? 'is-active' : ''}
                  key={item.id}
                  onClick={() => onNavigate(item.route)}
                  type="button"
                >
                  <ExecutiveTooltip description={item.description}>
                    {executiveValue(item.label, 'Mission Control')}
                  </ExecutiveTooltip>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  )
}

export default PersistentNavigation
