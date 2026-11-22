export function createMaterialsPage(React, { t, Icon, C, api, onOpenAssistant }) {
  const { useState } = React

  return function MaterialsPage({ data, reload }) {
    const [type, setType] = useState('all')
    const [keyword, setKeyword] = useState('')
    const [busyId, setBusyId] = useState('')
    const [error, setError] = useState('')

    const list = data.filter(m =>
      (type === 'all' || m.type === type) &&
      (!keyword || m.title.toLowerCase().includes(keyword.toLowerCase())))

    const review = async (m, approve) => {
      setBusyId(m.id)
      setError('')
      try { await api.post('materials.review', { id: m.id, approve }); await reload() }
      catch (err) { setError(err.message) }
      finally { setBusyId('') }
    }

    return (
      <div>
        <div className="omni-filter-bar">
          <input className="omni-input" placeholder={t('common.search')} value={keyword}
            aria-label={t('common.search')} onChange={e => setKeyword(e.target.value)} />
          <select className="omni-select" value={type} aria-label={t('materials.filterType')}
            onChange={e => setType(e.target.value)}>
            <option value="all">{t('common.all')}</option>
            <option value="image">{t('materials.type.image')}</option>
            <option value="video">{t('materials.type.video')}</option>
          </select>
          <span style={{ flex: 1 }} />
          <button className="omni-btn primary" onClick={onOpenAssistant}>
            <Icon name="sparkle" size={14} />{t('materials.aiGenerate')}
          </button>
        </div>
        {error && <div className="omni-form-error" role="alert">{error}</div>}
        {list.length === 0 ? <div className="omni-card"><C.EmptyState /></div> : (
          <div className="omni-grid omni-materials-grid">
            {list.map(m => (
              <div className="omni-card" key={m.id}>
                <div className={`omni-material-preview tone-${m.tone}`}>
                  <Icon name={m.type === 'video' ? 'publish' : 'materials'} size={34} />
                </div>
                <div className="omni-material-title">{m.title}</div>
                <div className="omni-material-meta">{t(`materials.type.${m.type}`)} · {m.size}</div>
                <div className="omni-material-meta">{t('materials.campaign')}：{m.campaign}</div>
                <div className="omni-material-meta">{t('materials.updated')}：{m.updated}</div>
                <div className="omni-material-foot">
                  <C.Badge status={m.status} />
                  {m.status === 'review' && (
                    <div className="omni-material-actions">
                      <button className="omni-btn ghost small" disabled={busyId === m.id} onClick={() => review(m, true)}>
                        <Icon name="check" size={12} />{t('materials.approve')}
                      </button>
                      <button className="omni-btn ghost small danger" disabled={busyId === m.id} onClick={() => review(m, false)}>
                        {t('materials.reject')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}
