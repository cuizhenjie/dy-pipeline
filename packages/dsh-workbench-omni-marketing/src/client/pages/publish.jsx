export function createPublishPage(React, { t, Icon, C, api, channelName, channels }) {
  const { useState } = React
  const CHANNELS = ['douyin', 'wechat', 'xiaohongshu', 'kuaishou', 'channels', 'weibo']

  function CreateForm({ materials, onDone }) {
    const [form, setForm] = useState({ title: '', materialId: '', channels: [], mode: 'now', schedule: '' })
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
    const submit = async () => {
      if (!form.title.trim() || !form.channels.length) { setError(t('publish.required')); return }
      setBusy(true)
      setError('')
      try {
        await api.post('publish.create', form)
        setForm({ title: '', materialId: '', channels: [], mode: 'now', schedule: '' })
        await onDone()
      } catch (err) { setError(err.message) }
      finally { setBusy(false) }
    }
    return (
      <div className="omni-card">
        <h3 className="omni-card-title">{t('publish.createTitle')}</h3>
        <p className="omni-card-desc">{t('publish.mode')} · {t('publish.channels')}</p>
        <C.Field label={t('campaigns.name')}>
          <input className="omni-input" value={form.title} maxLength={80}
            placeholder={t('publish.titlePlaceholder')} onChange={e => set('title', e.target.value)} />
        </C.Field>
        <C.Field label={`${t('publish.material')}（${t('common.optional')}）`}>
          <select className="omni-select" value={form.materialId} onChange={e => set('materialId', e.target.value)}>
            <option value="">—</option>
            {materials.filter(m => m.status === 'active').map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </C.Field>
        <C.Field label={t('publish.channels')}>
          <div className="omni-checkbox-group">
            {CHANNELS.map(id => {
              const offline = channels?.find(c => c.id === id)?.status === 'disconnected'
              return (
                <label key={id} className={`omni-checkbox-chip ${form.channels.includes(id) ? 'checked' : ''}`}
                  title={offline ? t('channels.authExpired') : ''}>
                  <input type="checkbox" checked={form.channels.includes(id)} onChange={e => {
                    set('channels', e.target.checked ? [...form.channels, id] : form.channels.filter(c => c !== id))
                  }} />
                  {channelName(id)}{offline ? `（${t('status.disconnected')}）` : ''}
                </label>
              )
            })}
          </div>
        </C.Field>
        <C.Field label={t('publish.mode')}>
          <div className="omni-checkbox-group">
            {['now', 'schedule'].map(mode => (
              <label key={mode} className={`omni-checkbox-chip ${form.mode === mode ? 'checked' : ''}`}>
                <input type="radio" name="omni-publish-mode" checked={form.mode === mode} onChange={() => set('mode', mode)} />
                {t(`publish.${mode}`)}
              </label>
            ))}
          </div>
        </C.Field>
        {form.mode === 'schedule' && (
          <C.Field label={t('publish.scheduleTime')}>
            <input className="omni-input" type="datetime-local" value={form.schedule}
              onChange={e => set('schedule', e.target.value)} />
          </C.Field>
        )}
        {error && <div className="omni-form-error" role="alert">{error}</div>}
        <button className="omni-btn primary" onClick={submit} disabled={busy} style={{ width: '100%' }}>
          {busy ? <span className="omni-spinner" style={{ width: 12, height: 12 }} /> : <Icon name="publish" size={14} />}
          {t('publish.create')}
        </button>
      </div>
    )
  }

  return function PublishPage({ data, reload, materials }) {
    const [error, setError] = useState('')
    const [busyKey, setBusyKey] = useState('')
    const retry = async (task, target) => {
      setBusyKey(`${task.id}:${target.channel}`)
      setError('')
      try { await api.post('publish.retry', { id: task.id, channel: target.channel }); await reload() }
      catch (err) { setError(err.message) }
      finally { setBusyKey('') }
    }
    return (
      <div className="omni-grid omni-publish-layout">
        <div>
          {error && <div className="omni-form-error" role="alert">{error}</div>}
          {data.length === 0 ? <div className="omni-card"><C.EmptyState /></div> : data.map(task => (
            <div className="omni-publish-task" key={task.id}>
              <div className="omni-publish-task-head">
                <span className="omni-publish-task-title">{task.title}</span>
                <C.Badge status={task.mode === 'schedule' ? 'scheduled' : 'published'}>
                  {t(`publish.${task.mode}`)}
                </C.Badge>
              </div>
              <div className="omni-publish-task-meta">
                {t('publish.created')}：{task.created}
                {task.mode === 'schedule' && task.schedule ? ` · ${t('publish.scheduleTime')}：${task.schedule}` : ''}
              </div>
              {task.targets.map(target => (
                <div className="omni-publish-target" key={target.channel}>
                  <span className="omni-publish-target-channel">{channelName(target.channel)}</span>
                  <C.Badge status={target.status} />
                  <span className={`omni-publish-target-info ${target.error ? 'omni-publish-target-error' : ''}`}>
                    {target.error || target.time || ''}
                  </span>
                  {target.status === 'failed' && (
                    <button className="omni-btn ghost small" disabled={busyKey === `${task.id}:${target.channel}`}
                      onClick={() => retry(task, target)}>
                      <Icon name="refresh" size={12} />{t('publish.retry')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <CreateForm materials={materials || []} onDone={reload} />
      </div>
    )
  }
}
