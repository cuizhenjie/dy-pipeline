export function createComponents(React, { t, Icon }) {
  const { useEffect, useRef } = React

  const fmtNumber = n => new Intl.NumberFormat('zh-CN').format(Math.round(n || 0))
  const fmtMoney = n => `¥${fmtNumber(n)}`
  const fmtWan = n => (n >= 10000 ? `${(n / 10000).toFixed(1)} 万` : fmtNumber(n))
  const fmtRoi = n => (n ? Number(n).toFixed(2) : '—')

  function Loading() {
    return (
      <div className="omni-loading" role="status">
        <span className="omni-spinner" />
        <span>{t('common.loading')}…</span>
      </div>
    )
  }

  function EmptyState({ text }) {
    return (
      <div className="omni-empty">
        <div><Icon name="empty" size={32} /></div>
        <div>{text || t('common.empty')}</div>
      </div>
    )
  }

  function ErrorState({ error, onRetry }) {
    return (
      <div className="omni-empty" role="alert">
        <div><Icon name="alert" size={32} /></div>
        <div style={{ marginBottom: 12 }}>{error || t('common.loadFailed')}</div>
        {onRetry && <button className="omni-btn ghost" onClick={onRetry}>{t('common.retry')}</button>}
      </div>
    )
  }

  const toneMap = {
    running: 'success', active: 'success', connected: 'success', published: 'success',
    success: 'success', converted: 'success',
    paused: 'neutral', draft: 'neutral', invalid: 'neutral', finished: 'neutral',
    scheduled: 'info', publishing: 'info', new: 'info',
    review: 'warning', following: 'warning',
    failed: 'error', disconnected: 'error',
  }

  function Badge({ status, children }) {
    return <span className={`omni-badge ${toneMap[status] || 'neutral'}`}>{children || t(`status.${status}`)}</span>
  }

  function Modal({ title, onClose, busy, children, footer }) {
    const ref = useRef(null)
    useEffect(() => {
      const prev = document.activeElement
      const el = ref.current
      const focusables = () => Array.from(el.querySelectorAll(
        'button:not(:disabled), input, select, textarea, [tabindex="0"]',
      ))
      focusables()[0]?.focus()
      const onKey = (e) => {
        if (e.key === 'Escape' && !busy) { e.stopPropagation(); onClose() }
        if (e.key === 'Tab') {
          const items = focusables()
          if (!items.length) return
          const first = items[0]
          const last = items[items.length - 1]
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
        }
      }
      el.addEventListener('keydown', onKey)
      return () => { prev?.focus?.() }
    }, [busy, onClose])

    return (
      <div className="omni-modal-overlay" onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose()
      }}>
        <div className="omni-modal" role="dialog" aria-modal="true" aria-label={title} ref={ref}>
          <div className="omni-modal-head">
            <h3 className="omni-modal-title">{title}</h3>
            <button className="omni-icon-btn" aria-label={t('common.close')} onClick={onClose} disabled={busy}>
              <Icon name="close" size={16} />
            </button>
          </div>
          {children}
          {footer && <div className="omni-modal-foot">{footer}</div>}
        </div>
      </div>
    )
  }

  function Sparkline({ values, color = 'var(--omni-chart-1)' }) {
    const w = 96
    const h = 28
    const max = Math.max(...values)
    const min = Math.min(...values)
    const range = max - min || 1
    const points = values.map((v, i) =>
      `${(i / (values.length - 1)) * w},${h - 3 - ((v - min) / range) * (h - 6)}`).join(' ')
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    )
  }

  function LineChart({ labels, series, height = 240 }) {
    const w = 760
    const h = height
    const pad = { l: 40, r: 12, t: 14, b: 26 }
    const iw = w - pad.l - pad.r
    const ih = h - pad.t - pad.b
    const all = series.flatMap(s => s.values)
    const max = Math.max(...all) * 1.12 || 1
    const x = i => pad.l + (i / (labels.length - 1)) * iw
    const y = v => pad.t + ih - (v / max) * ih
    const ticks = [0, 0.25, 0.5, 0.75, 1].map(r => ({ y: y(max * r), v: max * r }))
    const step = Math.max(1, Math.floor(labels.length / 8))
    return (
      <svg className="omni-chart-svg" viewBox={`0 0 ${w} ${h}`} role="img">
        {ticks.map((tick, i) => (
          <g key={i}>
            <line className="omni-chart-grid" x1={pad.l} x2={w - pad.r} y1={tick.y} y2={tick.y} />
            <text className="omni-chart-axis-text" x={pad.l - 6} y={tick.y + 3} textAnchor="end">{Math.round(tick.v)}</text>
          </g>
        ))}
        {labels.map((label, i) => (i % step === 0 || i === labels.length - 1) && (
          <text key={label} className="omni-chart-axis-text" x={x(i)} y={h - 8} textAnchor="middle">{label}</text>
        ))}
        {series.map((s, si) => {
          const line = s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
          const area = `${line} L${x(s.values.length - 1)},${y(0)} L${x(0)},${y(0)} Z`
          return (
            <g key={si}>
              <path d={area} fill={s.color} opacity="0.08" />
              <path d={line} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" />
              {s.values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r="2.4" fill={s.color}>
                  <title>{`${labels[i]} · ${s.name}: ${v}`}</title>
                </circle>
              ))}
            </g>
          )
        })}
      </svg>
    )
  }

  function BarList({ items, format = fmtWan }) {
    const max = Math.max(...items.map(i => i.value)) || 1
    return (
      <div>
        {items.map((item, i) => (
          <div className="omni-bar-row" key={item.label}>
            <span className="omni-bar-label" title={item.label}>{item.label}</span>
            <div className="omni-bar-track">
              <div className="omni-bar-fill" style={{
                width: `${Math.max(3, (item.value / max) * 100)}%`,
                background: `var(--omni-chart-${(i % 4) + 1})`,
              }} />
            </div>
            <span className="omni-bar-value">{format(item.value)}</span>
          </div>
        ))}
      </div>
    )
  }

  function FunnelChart({ items }) {
    const max = items[0]?.value || 1
    return (
      <div>
        {items.map((item, i) => {
          const prev = items[i - 1]
          const rate = prev ? ((item.value / prev.value) * 100).toFixed(1) : '100'
          return (
            <div className="omni-funnel-row" key={item.key}>
              <span className="omni-funnel-label">{item.label}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="omni-funnel-bar" style={{
                  width: `${Math.max(9, (item.value / max) * 100)}%`,
                  background: `var(--omni-chart-${(i % 4) + 1})`,
                }}>{fmtWan(item.value)}</div>
              </div>
              <span className="omni-funnel-rate">{i ? `${rate}%` : ''}</span>
            </div>
          )
        })}
      </div>
    )
  }

  function DonutChart({ segments, centerLabel }) {
    const total = segments.reduce((s, x) => s + x.value, 0) || 1
    const r = 54
    const c = 2 * Math.PI * r
    let offset = 0
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <svg width="150" height="150" viewBox="0 0 150 150" role="img" aria-label={centerLabel}>
          <circle cx="75" cy="75" r={r} fill="none" stroke="var(--dsw-alias-interactive-bg-hover)" strokeWidth="18" />
          {segments.map((seg, i) => {
            const frac = seg.value / total
            const dash = `${frac * c} ${c}`
            const el = (
              <circle key={i} cx="75" cy="75" r={r} fill="none"
                stroke={`var(--omni-chart-${(i % 4) + 1})`} strokeWidth="18"
                strokeDasharray={dash} strokeDashoffset={-offset * c}
                transform="rotate(-90 75 75)">
                <title>{`${seg.label}: ${seg.value}`}</title>
              </circle>
            )
            offset += frac
            return el
          })}
          <text x="75" y="72" textAnchor="middle" fill="var(--dsw-alias-label-primary)" fontSize="22" fontWeight="650">{total}</text>
          <text x="75" y="92" textAnchor="middle" fill="var(--dsw-alias-label-tertiary)" fontSize="11">{centerLabel}</text>
        </svg>
        <div style={{ flex: 1, minWidth: 120 }}>
          {segments.map((seg, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 12 }}>
              <i style={{ width: 8, height: 8, borderRadius: 2, background: `var(--omni-chart-${(i % 4) + 1})` }} />
              <span style={{ color: 'var(--dsw-alias-label-secondary)', flex: 1 }}>{seg.label}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{seg.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function PageHead({ title, desc, children }) {
    return (
      <div className="omni-page-head">
        <div>
          <h2 className="omni-page-title">{title}</h2>
          {desc && <p className="omni-page-desc">{desc}</p>}
        </div>
        {children && <div className="omni-page-actions">{children}</div>}
      </div>
    )
  }

  function Field({ label, children }) {
    const id = React.useId()
    const control = typeof children.type === 'string' && ['input', 'select', 'textarea'].includes(children.type)
      ? React.cloneElement(children, { id: children.props.id || id })
      : children
    return (
      <div className="omni-field">
        <label className="omni-field-label" htmlFor={control === children ? undefined : id}>{label}</label>
        {control}
      </div>
    )
  }

  return {
    fmtNumber, fmtMoney, fmtWan, fmtRoi,
    Loading, EmptyState, ErrorState, Badge, Modal, Sparkline,
    LineChart, BarList, FunnelChart, DonutChart, PageHead, Field,
  }
}
