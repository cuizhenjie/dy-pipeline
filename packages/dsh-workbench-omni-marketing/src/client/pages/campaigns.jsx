export function createCampaignsPage(React, { t, Icon, C, api, channelName }) {
  const { useState } = React
  const STATUS_OPTIONS = ['running', 'scheduled', 'paused', 'finished', 'draft']
  const CHANNELS = ['douyin', 'wechat', 'xiaohongshu', 'kuaishou', 'channels', 'weibo']

  function CreateModal({ onClose, onDone }) {
    const [form, setForm] = useState({ name: '', budget: '', start: '', end: '', channels: [] })
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
    const submit = async () => {
      if (!form.name.trim() || !form.budget) { setError(t('campaigns.nameRequired')); return }
      setBusy(true)
      setError('')
      try {
        await api.post('campaigns.create', { ...form, budget: Number(form.budget) })
        onDone()
      } catch (err) { setError(err.message); setBusy(false) }
    }
    return (
      <C.Modal title={t('campaigns.createTitle')} onClose={onClose} busy={busy} footer={(
        <>
          <button className="omni-btn ghost" onClick={onClose} disabled={busy}>{t('common.cancel')}</button>
          <button className="omni-btn primary" onClick={submit} disabled={busy}>
            {busy ? <span className="omni-spinner" style={{ width: 12, height: 12 }} /> : <Icon name="plus" size={14} />}
            {t('common.create')}
          </button>
        </>
      )}>
        <C.Field label={t('campaigns.name')}>
          <input className="omni-input" value={form.name} maxLength={80}
            placeholder={t('campaigns.namePlaceholder')} onChange={e => set('name', e.target.value)} />
        </C.Field>
        <C.Field label={t('campaigns.budget')}>
          <input className="omni-input" type="number" min="0" value={form.budget}
            placeholder={t('campaigns.budgetPlaceholder')} onChange={e => set('budget', e.target.value)} />
        </C.Field>
        <div className="omni-field-row">
          <C.Field label={`${t('campaigns.start')}（${t('common.optional')}）`}>
            <input className="omni-input" type="date" value={form.start} onChange={e => set('start', e.target.value)} />
          </C.Field>
          <C.Field label={`${t('campaigns.end')}（${t('common.optional')}）`}>
            <input className="omni-input" type="date" value={form.end} onChange={e => set('end', e.target.value)} />
          </C.Field>
        </div>
        <C.Field label={t('campaigns.channels')}>
          <div className="omni-checkbox-group">
            {CHANNELS.map(id => (
              <label key={id} className={`omni-checkbox-chip ${form.channels.includes(id) ? 'checked' : ''}`}>
                <input type="checkbox" checked={form.channels.includes(id)} onChange={e => {
                  set('channels', e.target.checked ? [...form.channels, id] : form.channels.filter(c => c !== id))
                }} />
                {channelName(id)}
              </label>
            ))}
          </div>
        </C.Field>
        {error && <div className="omni-form-error" role="alert">{error}</div>}
      </C.Modal>
    )
  }

  return function CampaignsPage({ data, reload }) {
    const [filter, setFilter] = useState('all')
    const [keyword, setKeyword] = useState('')
    const [creating, setCreating] = useState(false)
    const [busyId, setBusyId] = useState('')
    const [error, setError] = useState('')

    const list = data.filter(c =>
      (filter === 'all' || c.status === filter) &&
      (!keyword || c.name.toLowerCase().includes(keyword.toLowerCase())))

    const toggle = async (c) => {
      setBusyId(c.id)
      setError('')
      try { await api.post('campaigns.toggle', { id: c.id }); await reload() }
      catch (err) { setError(err.message) }
      finally { setBusyId('') }
    }

    return (
      <div>
        <div className="omni-filter-bar">
          <input className="omni-input" placeholder={t('common.search')} value={keyword}
            aria-label={t('common.search')} onChange={e => setKeyword(e.target.value)} />
          <select className="omni-select" value={filter} aria-label={t('common.status')}
            onChange={e => setFilter(e.target.value)}>
            <option value="all">{t('common.all')}</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
          </select>
          <span style={{ flex: 1 }} />
          <button className="omni-btn primary" onClick={() => setCreating(true)}>
            <Icon name="plus" size={14} />{t('campaigns.create')}
          </button>
        </div>
        {error && <div className="omni-form-error" role="alert">{error}</div>}
        <div className="omni-card" style={{ padding: '8px 12px' }}>
          {list.length === 0 ? <C.EmptyState /> : (
            <div className="omni-table-wrap">
              <table className="omni-table">
                <thead><tr>
                  <th>{t('campaigns.name')}</th><th>{t('common.status')}</th>
                  <th className="num">{t('campaigns.budget')}</th><th className="num">{t('campaigns.spend')}</th>
                  <th className="num">{t('campaigns.gmv')}</th><th className="num">ROI</th>
                  <th>{t('campaigns.period')}</th><th>{t('campaigns.channels')}</th>
                  <th>{t('common.owner')}</th><th>{t('common.actions')}</th>
                </tr></thead>
                <tbody>
                  {list.map(c => (
                    <tr key={c.id}>
                      <td className="omni-cell-main">{c.name}</td>
                      <td><C.Badge status={c.status} /></td>
                      <td className="num">{C.fmtMoney(c.budget)}</td>
                      <td className="num">{C.fmtMoney(c.spend)}</td>
                      <td className="num">{c.gmv ? C.fmtMoney(c.gmv) : '—'}</td>
                      <td className="num">{C.fmtRoi(c.roi)}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{c.start ? `${c.start.slice(5)} ~ ${c.end.slice(5)}` : '—'}</td>
                      <td>{c.channels.map(channelName).join(' / ') || '—'}</td>
                      <td>{c.owner}</td>
                      <td>
                        {['running', 'paused', 'draft', 'scheduled'].includes(c.status) && (
                          <button className="omni-btn ghost small" disabled={busyId === c.id} onClick={() => toggle(c)}>
                            {c.status === 'running' ? t('campaigns.pause') : t('campaigns.startRun')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {creating && <CreateModal onClose={() => setCreating(false)} onDone={async () => {
          setCreating(false)
          await reload()
        }} />}
      </div>
    )
  }
}
