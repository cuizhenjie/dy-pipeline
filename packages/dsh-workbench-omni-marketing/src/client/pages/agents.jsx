export function createAgentsPage(React, { t, Icon, C, api }) {
  const { useState } = React

  function AgentCard({ agent, onRun }) {
    const [task, setTask] = useState('')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const run = async () => {
      if (!task.trim()) { setError(t('agents.taskRequired')); return }
      setBusy(true)
      setError('')
      try {
        await onRun(agent.id, task.trim())
        setTask('')
      } catch (err) { setError(err.message) }
      finally { setBusy(false) }
    }
    return (
      <div className="omni-card">
        <div className="omni-agent-head">
          <Icon name="agents" size={20} />
          <span className="omni-agent-name">{agent.name}</span>
          <span style={{ marginLeft: 'auto' }}><C.Badge status="active" /></span>
        </div>
        <p className="omni-agent-desc">{agent.description}</p>
        <div className="omni-agent-stats">
          <div><div className="omni-stat-label">{t('agents.todayTasks')}</div><div className="omni-stat-value">{C.fmtNumber(agent.todayTasks)}</div></div>
          <div><div className="omni-stat-label">{t('agents.successRate')}</div><div className="omni-stat-value">{agent.successRate}%</div></div>
          <div><div className="omni-stat-label">{t('agents.model')}</div><div className="omni-stat-value" style={{ fontSize: 13 }}>{agent.model}</div></div>
          {agent.advices > 0 && (
            <div><div className="omni-stat-label">{t('dashboard.todos')}</div>
              <div className="omni-stat-value" style={{ fontSize: 12 }}><C.Badge status="review">{t('agents.advices', { count: agent.advices })}</C.Badge></div>
            </div>
          )}
        </div>
        <div className="omni-agent-run">
          <input className="omni-input" value={task} placeholder={t('agents.taskPlaceholder')}
            aria-label={t('agents.runTask')} onChange={e => setTask(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !busy) run() }} />
          <button className="omni-btn primary" onClick={run} disabled={busy}>
            {busy ? <span className="omni-spinner" style={{ width: 12, height: 12 }} /> : <Icon name="sparkle" size={14} />}
            {t('agents.run')}
          </button>
        </div>
        {error && <div className="omni-form-error" role="alert" style={{ marginTop: 8 }}>{error}</div>}
      </div>
    )
  }

  return function AgentsPage({ data, reload }) {
    const { agents, runs } = data
    const nameOf = id => agents.find(a => a.id === id)?.name || id
    const onRun = async (agentId, task) => {
      await api.post('agents.run', { agentId, task })
      await reload()
    }
    return (
      <div>
        <div className="omni-grid omni-agents-grid">
          {agents.map(a => <AgentCard key={a.id} agent={a} onRun={onRun} />)}
        </div>
        <div className="omni-card" style={{ padding: '16px 20px' }}>
          <h3 className="omni-card-title">{t('agents.recentRuns')}</h3>
          {runs.length === 0 ? <C.EmptyState text={t('agents.empty')} /> : (
            <div className="omni-table-wrap">
              <table className="omni-table">
                <thead><tr>
                  <th>{t('common.time')}</th><th>Agent</th><th>{t('agents.runTask')}</th>
                  <th>{t('common.status')}</th><th className="num">{t('agents.durationLabel')}</th>
                </tr></thead>
                <tbody>
                  {runs.map(run => (
                    <tr key={run.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{run.time}</td>
                      <td>{nameOf(run.agentId)}</td>
                      <td>
                        <div className="omni-cell-main">{run.task}</div>
                        {run.error && <div className="omni-cell-sub omni-publish-target-error">{run.error}</div>}
                      </td>
                      <td><C.Badge status={run.status} /></td>
                      <td className="num">{t('agents.duration', { seconds: run.duration })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )
  }
}
