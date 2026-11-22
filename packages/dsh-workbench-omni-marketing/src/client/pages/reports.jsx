export function createReportsPage(React, { t, Icon, C }) {
  const { useState } = React

  function exportCsv(filename, headers, rows) {
    const escape = v => `"${String(v ?? '').replaceAll('"', '""')}"`
    const csv = '﻿' + [headers, ...rows].map(row => row.map(escape).join(',')).join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return function ReportsPage({ data }) {
    const [exported, setExported] = useState(false)
    const { byChannel, byCampaign, summary } = data
    const overallRoi = summary.totalSpend ? (summary.totalGmv / summary.totalSpend).toFixed(2) : '—'

    const doExport = (kind) => {
      if (kind === 'channel') {
        exportCsv('omni-channel-report.csv',
          [t('leads.channel'), t('reports.impressions'), t('reports.clicks'), t('channels.spend'), t('channels.gmv'), 'ROI', t('channels.leads')],
          byChannel.map(c => [c.name, c.impressions, c.clicks, c.spend, c.gmv, c.roi, c.leads]))
      } else {
        exportCsv('omni-campaign-report.csv',
          [t('campaigns.name'), t('common.status'), t('campaigns.spend'), t('campaigns.gmv'), 'ROI', t('reports.ctr'), t('channels.leads')],
          byCampaign.map(c => [c.name, t(`status.${c.status}`), c.spend, c.gmv, c.roi, c.ctr, c.leads]))
      }
      setExported(true)
      setTimeout(() => setExported(false), 2400)
    }

    return (
      <div>
        <div className="omni-card" style={{ marginBottom: 16 }}>
          <h3 className="omni-card-title">{t('reports.summary')}</h3>
          <div className="omni-summary-strip" style={{ marginTop: 12 }}>
            <div><div className="omni-stat-label">{t('dashboard.spend')}</div><div className="omni-stat-value">{C.fmtMoney(summary.totalSpend)}</div></div>
            <div><div className="omni-stat-label">{t('dashboard.gmv')}</div><div className="omni-stat-value">{C.fmtMoney(summary.totalGmv)}</div></div>
            <div><div className="omni-stat-label">{t('dashboard.roi')}</div><div className="omni-stat-value">{overallRoi}</div></div>
            <div><div className="omni-stat-label">{t('dashboard.leads')}</div><div className="omni-stat-value">{C.fmtNumber(summary.totalLeads)}</div></div>
          </div>
        </div>
        <div className="omni-card" style={{ marginBottom: 16, padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <h3 className="omni-card-title" style={{ margin: 0 }}>{t('reports.byChannel')}</h3>
            <button className="omni-btn ghost small" style={{ marginLeft: 'auto' }} onClick={() => doExport('channel')}>
              <Icon name="download" size={13} />{t('common.export')}
            </button>
          </div>
          <div className="omni-table-wrap">
            <table className="omni-table">
              <thead><tr>
                <th>{t('leads.channel')}</th><th>{t('common.status')}</th>
                <th className="num">{t('reports.impressions')}</th><th className="num">{t('reports.clicks')}</th>
                <th className="num">{t('channels.spend')}</th><th className="num">{t('channels.gmv')}</th>
                <th className="num">ROI</th><th className="num">{t('channels.leads')}</th>
              </tr></thead>
              <tbody>
                {byChannel.map(c => (
                  <tr key={c.id}>
                    <td className="omni-cell-main">{c.name}</td>
                    <td><C.Badge status={c.status} /></td>
                    <td className="num">{C.fmtWan(c.impressions)}</td>
                    <td className="num">{C.fmtWan(c.clicks)}</td>
                    <td className="num">{C.fmtMoney(c.spend)}</td>
                    <td className="num">{C.fmtMoney(c.gmv)}</td>
                    <td className="num">{C.fmtRoi(c.roi)}</td>
                    <td className="num">{C.fmtNumber(c.leads)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="omni-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <h3 className="omni-card-title" style={{ margin: 0 }}>{t('reports.byCampaign')}</h3>
            <button className="omni-btn ghost small" style={{ marginLeft: 'auto' }} onClick={() => doExport('campaign')}>
              <Icon name="download" size={13} />{t('common.export')}
            </button>
          </div>
          <div className="omni-table-wrap">
            <table className="omni-table">
              <thead><tr>
                <th>{t('campaigns.name')}</th><th>{t('common.status')}</th>
                <th className="num">{t('campaigns.spend')}</th><th className="num">{t('campaigns.gmv')}</th>
                <th className="num">ROI</th><th className="num">{t('reports.ctr')}</th>
                <th className="num">{t('channels.leads')}</th>
              </tr></thead>
              <tbody>
                {byCampaign.map(c => (
                  <tr key={c.id}>
                    <td className="omni-cell-main">{c.name}</td>
                    <td><C.Badge status={c.status} /></td>
                    <td className="num">{C.fmtMoney(c.spend)}</td>
                    <td className="num">{C.fmtMoney(c.gmv)}</td>
                    <td className="num">{C.fmtRoi(c.roi)}</td>
                    <td className="num">{c.ctr}</td>
                    <td className="num">{C.fmtNumber(c.leads)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {exported && <div className="omni-toast" role="status"><Icon name="check" size={14} />{t('reports.exported')}</div>}
      </div>
    )
  }
}
