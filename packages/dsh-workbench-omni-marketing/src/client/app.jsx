import { copy } from './copy.js'
import { createApi } from './api.js'
import { ensureStyles } from './styles.js'
import { createIcons } from './icons.jsx'
import { createComponents } from './components.jsx'
import { createDashboardPage } from './pages/dashboard.jsx'
import { createChannelsPage } from './pages/channels.jsx'
import { createCampaignsPage } from './pages/campaigns.jsx'
import { createAgentsPage } from './pages/agents.jsx'
import { createMaterialsPage } from './pages/materials.jsx'
import { createPublishPage } from './pages/publish.jsx'
import { createLeadsPage } from './pages/leads.jsx'
import { createReportsPage } from './pages/reports.jsx'

const NS = 'omni-marketing'
const CHANNEL_NAMES = {
  douyin: '抖音', wechat: '微信公众号', xiaohongshu: '小红书',
  kuaishou: '快手', channels: '视频号', weibo: '微博',
}
const NAV = [
  { group: 'nav.groupOverview', pages: ['dashboard'] },
  { group: 'nav.groupGrowth', pages: ['channels', 'campaigns', 'agents', 'materials', 'publish'] },
  { group: 'nav.groupInsight', pages: ['leads', 'reports'] },
]
const NAV_ICONS = {
  dashboard: 'dashboard', channels: 'channels', campaigns: 'campaigns', agents: 'agents',
  materials: 'materials', publish: 'publish', leads: 'leads', reports: 'reports',
}

export function createWorkbench(require) {
  const React = require('react')
  const { useState, useEffect, useCallback } = React
  const api = createApi()
  const channelName = id => CHANNEL_NAMES[id] || id

  return {
    inject: ['desktopWorkbenches'],
    apply(ctx) {
      ctx.locale.register(NS, copy)
      const rawT = ctx.locale.bind(NS)
      const t = (key, params) => {
        let text = rawT(key)
        if (typeof text !== 'string') text = key
        if (params) for (const [k, v] of Object.entries(params)) text = text.replaceAll(`{${k}}`, String(v))
        return text
      }

      const Icon = createIcons(React)
      const C = createComponents(React, { t, Icon })

      function BusinessPanel({ conversation }) {
        const [page, setPage] = useState('dashboard')
        const [assistantOpen, setAssistantOpen] = useState(false)
        const [version, setVersion] = useState(0)
        const [state, setState] = useState({ data: null, error: '', loading: true })
        const [materials, setMaterials] = useState([])
        const [channelData, setChannelData] = useState(null)
        const reload = useCallback(() => setVersion(v => v + 1), [])

        useEffect(() => { ensureStyles() }, [])

        useEffect(() => {
          const controller = new AbortController()
          setState(s => ({ ...s, loading: true, error: '' }))
          api.get(page, controller.signal)
            .then(data => setState({ data, error: '', loading: false }))
            .catch(err => {
              if (err.name === 'AbortError') return
              setState({ data: null, error: err.message || t('common.loadFailed'), loading: false })
            })
          return () => controller.abort()
        }, [page, version])

        useEffect(() => {
          let alive = true
          api.get('channels').then(data => { if (alive) setChannelData(data) }).catch(() => {})
          return () => { alive = false }
        }, [version])

        useEffect(() => {
          if (page !== 'publish') return
          let alive = true
          api.get('materials').then(data => { if (alive) setMaterials(data) }).catch(() => {})
          return () => { alive = false }
        }, [page, version])

        // Page component types must stay stable across renders, otherwise React
        // remounts the active page on every render and loses local input state.
        const pages = React.useMemo(() => {
          const deps = { t, Icon, C, api, channelName, onOpenAssistant: () => setAssistantOpen(true) }
          return {
            dashboard: createDashboardPage(React, deps),
            channels: createChannelsPage(React, deps),
            campaigns: createCampaignsPage(React, deps),
            agents: createAgentsPage(React, deps),
            materials: createMaterialsPage(React, deps),
            publish: createPublishPage(React, deps),
            leads: createLeadsPage(React, deps),
            reports: createReportsPage(React, deps),
          }
        }, [])
        const ActivePage = pages[page]

        return (
          <div className="omni-root">
            <div className="omni-header" data-dsh-workbench-toolbar>
              <div className="omni-brand">
                <span className="omni-brand-mark"><Icon name="agents" size={16} /></span>
                <div>
                  <div className="omni-brand-name">{t('app.title')}</div>
                  <div className="omni-brand-sub">{t('app.subtitle')}</div>
                </div>
              </div>
              <span className="omni-header-spacer" />
              <button className="omni-btn ghost" onClick={reload} title={t('app.refresh')}>
                <Icon name="refresh" size={14} />{t('app.refresh')}
              </button>
              <button className={`omni-btn ${assistantOpen ? 'primary' : 'ghost'}`}
                onClick={() => setAssistantOpen(v => !v)} aria-pressed={assistantOpen}>
                <Icon name="sparkle" size={14} />
                {assistantOpen ? t('app.closeAssistant') : t('app.aiAssistant')}
              </button>
            </div>
            <div className="omni-body">
              <nav className="omni-nav" aria-label={t('app.title')}>
                {NAV.map(section => (
                  <div key={section.group}>
                    <div className="omni-nav-group">{t(section.group)}</div>
                    {section.pages.map(id => (
                      <button key={id} className={`omni-nav-item ${page === id ? 'active' : ''}`}
                        onClick={() => setPage(id)} aria-current={page === id ? 'page' : undefined}
                        title={t(`nav.${id}`)}>
                        <Icon name={NAV_ICONS[id]} size={17} />
                        <span className="omni-nav-label">{t(`nav.${id}`)}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </nav>
              <main className="omni-content">
                <C.PageHead title={t(`nav.${page}`)} desc={t('app.subtitle')} />
                {state.loading ? <C.Loading /> : state.error ? (
                  <C.ErrorState error={state.error} onRetry={reload} />
                ) : (
                  <ActivePage data={state.data} reload={reload} onNavigate={setPage}
                    materials={materials} channels={channelData} />
                )}
              </main>
              {assistantOpen && (
                <aside className="omni-assistant" aria-label={t('app.aiAssistant')}>
                  <div className="omni-assistant-head">
                    <span>{t('app.aiAssistant')}</span>
                    <button className="omni-icon-btn" aria-label={t('app.closeAssistant')}
                      onClick={() => setAssistantOpen(false)}>
                      <Icon name="close" size={15} />
                    </button>
                  </div>
                  <div className="omni-assistant-body">
                    {conversation || <div className="omni-assistant-tip">{t('app.assistantTip')}</div>}
                  </div>
                </aside>
              )}
            </div>
          </div>
        )
      }

      ctx.effect(() => ctx.desktopWorkbenches.register({
        title: t('app.title'),
        description: t('app.subtitle'),
        customFrame: true,
        headerLayout: 'compact',
      }, BusinessPanel))
    },
  }
}
