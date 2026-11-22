export function createLeadsPage(React, { t, C, api, channelName }) {
  const { useState } = React
  const STAGES = ['new', 'following', 'converted', 'invalid']

  return function LeadsPage({ data, reload }) {
    const [stage, setStage] = useState('all')
    const [keyword, setKeyword] = useState('')
    const [busyId, setBusyId] = useState('')
    const [error, setError] = useState('')

    const list = data.filter(l =>
      (stage === 'all' || l.stage === stage) &&
      (!keyword || `${l.contact}${l.company}`.toLowerCase().includes(keyword.toLowerCase())))

    const update = async (lead, nextStage) => {
      setBusyId(lead.id)
      setError('')
      try { await api.post('leads.update', { id: lead.id, stage: nextStage }); await reload() }
      catch (err) { setError(err.message) }
      finally { setBusyId('') }
    }

    const segments = STAGES.map(s => ({
      label: t(`status.${s}`), value: data.filter(l => l.stage === s).length,
    })).filter(s => s.value > 0)

    return (
      <div className="omni-grid omni-leads-layout">
        <div>
          <div className="omni-filter-bar">
            <input className="omni-input" placeholder={t('common.search')} value={keyword}
              aria-label={t('common.search')} onChange={e => setKeyword(e.target.value)} />
            <select className="omni-select" value={stage} aria-label={t('leads.stage')}
              onChange={e => setStage(e.target.value)}>
              <option value="all">{t('common.all')}</option>
              {STAGES.map(s => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
            </select>
          </div>
          {error && <div className="omni-form-error" role="alert">{error}</div>}
          <div className="omni-card" style={{ padding: '8px 12px' }}>
            {list.length === 0 ? <C.EmptyState /> : (
              <div className="omni-table-wrap">
                <table className="omni-table">
                  <thead><tr>
                    <th>{t('leads.contact')}</th><th>{t('leads.channel')}</th><th>{t('leads.intent')}</th>
                    <th>{t('leads.stage')}</th><th className="num">{t('leads.score')}</th>
                    <th>{t('common.owner')}</th><th>{t('leads.lastTouch')}</th>
                  </tr></thead>
                  <tbody>
                    {list.map(l => (
                      <tr key={l.id}>
                        <td>
                          <div className="omni-cell-main">{l.contact}</div>
                          <div className="omni-cell-sub">{l.company}</div>
                        </td>
                        <td>{channelName(l.channel)}</td>
                        <td>{l.intent}</td>
                        <td>
                          <select className="omni-select" style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }}
                            value={l.stage} disabled={busyId === l.id} aria-label={t('leads.updateStage')}
                            onChange={e => update(l, e.target.value)}>
                            {STAGES.map(s => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
                          </select>
                        </td>
                        <td className="num">{l.score}</td>
                        <td>{l.owner}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{l.lastTouch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="omni-card">
          <h3 className="omni-card-title">{t('leads.distribution')}</h3>
          <p className="omni-card-desc">{data.length}</p>
          <C.DonutChart segments={segments} centerLabel={t('nav.leads')} />
        </div>
      </div>
    )
  }
}
