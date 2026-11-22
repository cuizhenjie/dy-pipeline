export function createDashboardPage(React, { t, Icon, C }) {
  return function DashboardPage({ data, onNavigate }) {
    const { kpis, trend, funnel, todos, channelCompare } = data
    const kpiIcons = { gmv: 'reports', spend: 'campaigns', roi: 'up', leads: 'leads' }
    const kpiFormat = {
      gmv: C.fmtMoney, spend: C.fmtMoney, roi: v => Number(v).toFixed(2), leads: C.fmtNumber,
    }
    return (
      <div>
        <div className="omni-grid omni-kpis">
          {kpis.map(kpi => (
            <div className="omni-card" key={kpi.key}>
              <div className="omni-kpi-label"><Icon name={kpiIcons[kpi.key]} size={15} />{t(`dashboard.${kpi.key}`)}</div>
              <div className="omni-kpi-value">{kpiFormat[kpi.key](kpi.value)}</div>
              <div className="omni-kpi-foot">
                <span>
                  <span className={`omni-delta ${kpi.delta >= 0 ? 'up' : 'down'}`}>
                    <Icon name={kpi.delta >= 0 ? 'up' : 'down'} size={12} />
                    {kpi.delta >= 0 ? '+' : ''}{kpi.delta}%
                  </span>
                  <span className="omni-kpi-note"> {t('common.vsLastPeriod')}</span>
                </span>
                <C.Sparkline values={kpi.spark} color={kpi.delta >= 0 ? 'var(--omni-chart-2)' : 'var(--omni-chart-4)'} />
              </div>
            </div>
          ))}
        </div>
        <div className="omni-grid omni-dashboard-main">
          <div className="omni-card">
            <h3 className="omni-card-title">{t('dashboard.trend')}</h3>
            <p className="omni-card-desc">{t('dashboard.trendTip')}</p>
            <div className="omni-chart-legend">
              <span><i style={{ background: 'var(--omni-chart-1)' }} />GMV</span>
              <span><i style={{ background: 'var(--omni-chart-3)' }} />{t('dashboard.spend')}</span>
            </div>
            <C.LineChart labels={trend.days} series={[
              { name: 'GMV', color: 'var(--omni-chart-1)', values: trend.gmv },
              { name: t('dashboard.spend'), color: 'var(--omni-chart-3)', values: trend.spend },
            ]} />
          </div>
          <div className="omni-card">
            <h3 className="omni-card-title">{t('dashboard.channelCompare')}</h3>
            <p className="omni-card-desc">GMV</p>
            <C.BarList items={channelCompare} />
          </div>
        </div>
        <div className="omni-grid omni-dashboard-bottom">
          <div className="omni-card">
            <h3 className="omni-card-title">{t('dashboard.funnel')}</h3>
            <p className="omni-card-desc">{t('dashboard.funnelTip')}</p>
            <C.FunnelChart items={funnel.map(f => ({ ...f, label: t(`dashboard.funnel.${f.key}`) }))} />
          </div>
          <div className="omni-card">
            <h3 className="omni-card-title">{t('dashboard.todos')}</h3>
            <p className="omni-card-desc">{todos.length}</p>
            {todos.map(todo => (
              <button className="omni-todo-item" key={todo.key} onClick={() => onNavigate(todo.target)}>
                <Icon name="alert" size={16} />
                <span style={{ flex: 1 }}>{t(`dashboard.todo.${todo.key}`)}</span>
                <Icon name="arrowRight" size={14} className="omni-arrow" />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
