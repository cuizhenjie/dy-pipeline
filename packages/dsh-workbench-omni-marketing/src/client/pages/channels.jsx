export function createChannelsPage(React, { t, Icon, C }) {
  const { useState } = React

  function ChannelCard({ channel }) {
    const [showTip, setShowTip] = useState(false)
    const expired = channel.status === 'disconnected'
    const soon = !expired && channel.authDaysLeft <= 7
    return (
      <div className="omni-card">
        <div className="omni-channel-head">
          <span className="omni-channel-name">{channel.name}</span>
          <span style={{ marginLeft: 'auto' }}><C.Badge status={channel.status} /></span>
        </div>
        <div className="omni-channel-account">{channel.account}</div>
        <div className="omni-channel-stats">
          <div><div className="omni-stat-label">{t('channels.followers')}</div><div className="omni-stat-value">{C.fmtWan(channel.followers)}</div></div>
          <div><div className="omni-stat-label">{t('channels.spend')}</div><div className="omni-stat-value">{C.fmtMoney(channel.spend)}</div></div>
          <div><div className="omni-stat-label">{t('channels.gmv')}</div><div className="omni-stat-value">{C.fmtMoney(channel.gmv)}</div></div>
          <div><div className="omni-stat-label">{t('channels.roi')}</div><div className="omni-stat-value">{C.fmtRoi(channel.roi)}</div></div>
        </div>
        <div className="omni-channel-foot">
          <span className={expired ? 'omni-auth-error' : soon ? 'omni-auth-warning' : ''}>
            {expired ? t('channels.authExpired') : t('channels.authLeft', { days: channel.authDaysLeft })}
          </span>
          {(expired || soon) && (
            <button className="omni-btn ghost small" onClick={() => setShowTip(v => !v)}>
              {t('channels.reconnect')}
            </button>
          )}
        </div>
        {showTip && <p className="omni-card-desc" style={{ margin: '10px 0 0' }}>{t('channels.reconnectTip')}</p>}
      </div>
    )
  }

  return function ChannelsPage({ data }) {
    return <div className="omni-grid omni-channels-grid">{data.map(c => <ChannelCard key={c.id} channel={c} />)}</div>
  }
}
