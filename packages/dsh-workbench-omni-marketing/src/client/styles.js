export const css = `
.omni-root {
  --omni-chart-1: var(--dsw-alias-brand-primary);
  --omni-chart-2: var(--dsw-alias-state-success-primary);
  --omni-chart-3: var(--dsw-alias-state-business-primary);
  --omni-chart-4: var(--dsw-alias-state-error-primary);
  --omni-radius: 12px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  container-type: inline-size;
  container-name: omni-root;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', -apple-system, 'Segoe UI', sans-serif;
  font-size: 13px;
  line-height: 1.6;
}
.omni-root *, .omni-root *::before, .omni-root *::after { box-sizing: border-box; }
.omni-root button { font: inherit; cursor: pointer; }
.omni-root button:disabled { cursor: not-allowed; opacity: 0.55; }
.omni-root input, .omni-root select, .omni-root textarea { font: inherit; }
.omni-root :focus-visible {
  outline: 2px solid var(--dsw-alias-border-primary);
  outline-offset: 2px;
}
.omni-icon { flex-shrink: 0; vertical-align: -3px; }

.omni-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
  flex-shrink: 0;
}
.omni-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.omni-brand-mark {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-label-primary-foreground);
  flex-shrink: 0;
}
.omni-brand-name { font-size: 14px; font-weight: 650; letter-spacing: 0.01em; white-space: nowrap; }
.omni-brand-sub { font-size: 11px; color: var(--dsw-alias-label-tertiary); white-space: nowrap; }
.omni-header-spacer { flex: 1; }

.omni-body { flex: 1; display: flex; min-height: 0; position: relative; }
.omni-nav {
  width: 196px;
  flex-shrink: 0;
  border-right: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
  padding: 16px 10px;
  overflow-y: auto;
}
.omni-nav-group {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
  letter-spacing: 0.08em;
  padding: 14px 12px 6px;
}
.omni-nav-group:first-child { padding-top: 0; }
.omni-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  text-align: left;
  transition: background 160ms ease-out, color 160ms ease-out;
  white-space: nowrap;
}
.omni-nav-item:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.omni-nav-item.active {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-brand-primary);
  font-weight: 600;
}
.omni-nav-item .omni-nav-label { overflow: hidden; text-overflow: ellipsis; }

.omni-content {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 24px 28px 40px;
  container-type: inline-size;
  container-name: omni-content;
}
.omni-assistant {
  width: 340px;
  flex-shrink: 0;
  border-left: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.omni-assistant-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  font-weight: 600;
}
.omni-assistant-body { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.omni-assistant-tip { padding: 16px; color: var(--dsw-alias-label-tertiary); font-size: 12px; }

.omni-page-head { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.omni-page-title { font-size: 20px; font-weight: 650; letter-spacing: -0.01em; margin: 0; }
.omni-page-desc { color: var(--dsw-alias-label-tertiary); margin: 4px 0 0; font-size: 12px; }
.omni-page-actions { margin-left: auto; display: flex; gap: 8px; flex-wrap: wrap; }

.omni-card {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: var(--omni-radius);
  padding: 20px;
  min-width: 0;
}
.omni-card-title { font-size: 14px; font-weight: 600; margin: 0 0 4px; }
.omni-card-desc { font-size: 12px; color: var(--dsw-alias-label-tertiary); margin: 0 0 16px; }
.omni-grid { display: grid; gap: 16px; }
.omni-kpis { grid-template-columns: repeat(4, minmax(0, 1fr)); margin-bottom: 16px; }
.omni-dashboard-main { grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr); margin-bottom: 16px; }
.omni-dashboard-bottom { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); }
.omni-agents-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); margin-bottom: 16px; }
.omni-channels-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.omni-materials-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.omni-publish-layout { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); align-items: start; }
.omni-leads-layout { grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr); align-items: start; }

.omni-kpi-label { font-size: 12px; color: var(--dsw-alias-label-secondary); display: flex; align-items: center; gap: 6px; }
.omni-kpi-value {
  font-size: 30px;
  font-weight: 650;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  line-height: 1.3;
  margin: 6px 0 2px;
}
.omni-kpi-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.omni-delta { display: inline-flex; align-items: center; gap: 3px; font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums; }
.omni-delta.up { color: var(--dsw-alias-state-success-primary); }
.omni-delta.down { color: var(--dsw-alias-state-error-primary); }
.omni-kpi-note { font-size: 11px; color: var(--dsw-alias-label-tertiary); }

.omni-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1.7;
}
.omni-badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
.omni-badge.success { color: var(--dsw-alias-state-success-primary); background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent); }
.omni-badge.error { color: var(--dsw-alias-state-error-primary); background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent); }
.omni-badge.warning { color: var(--dsw-alias-state-business-primary); background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent); }
.omni-badge.info { color: var(--dsw-alias-brand-primary); background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent); }
.omni-badge.neutral { color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-hover); }

.omni-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-weight: 500;
  font-size: 12px;
  transition: background 160ms ease-out, border-color 160ms ease-out;
  white-space: nowrap;
}
.omni-btn.primary {
  background: var(--dsw-alias-button-primary-fill);
  color: var(--dsw-alias-label-primary-foreground);
}
.omni-btn.primary:hover:not(:disabled) { background: var(--dsw-alias-button-primary-hover); }
.omni-btn.ghost {
  background: transparent;
  border-color: var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-secondary);
}
.omni-btn.ghost:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.omni-btn.small { padding: 4px 10px; font-size: 11px; }
.omni-btn.danger { color: var(--dsw-alias-state-error-primary); }

.omni-input, .omni-select, .omni-textarea {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
}
.omni-textarea { min-height: 84px; resize: vertical; }
.omni-input:focus, .omni-select:focus, .omni-textarea:focus {
  border-color: var(--dsw-alias-border-primary);
  outline: none;
}
.omni-field { margin-bottom: 14px; }
.omni-field-label { display: block; font-size: 12px; color: var(--dsw-alias-label-secondary); margin-bottom: 6px; }
.omni-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.omni-form-error { color: var(--dsw-alias-state-error-primary); font-size: 12px; margin: 4px 0 10px; }
.omni-checkbox-group { display: flex; flex-wrap: wrap; gap: 8px; }
.omni-checkbox-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  cursor: pointer;
  color: var(--dsw-alias-label-secondary);
  transition: border-color 160ms ease-out, background 160ms ease-out;
  font-size: 12px;
}
.omni-checkbox-chip.checked {
  border-color: var(--dsw-alias-border-primary);
  color: var(--dsw-alias-brand-primary);
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, transparent);
}
.omni-checkbox-chip input { accent-color: var(--dsw-alias-brand-primary); margin: 0; }

.omni-table-wrap { overflow-x: auto; }
.omni-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.omni-table th {
  text-align: left;
  font-weight: 500;
  color: var(--dsw-alias-label-tertiary);
  padding: 8px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  white-space: nowrap;
}
.omni-table td {
  padding: 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  vertical-align: middle;
}
.omni-table tbody tr { transition: background 140ms ease-out; }
.omni-table tbody tr:hover { background: var(--dsw-alias-interactive-bg-hover); }
.omni-table tbody tr:last-child td { border-bottom: none; }
.omni-table .num { font-variant-numeric: tabular-nums; text-align: right; white-space: nowrap; }
.omni-table th.num { text-align: right; }
.omni-cell-main { font-weight: 500; color: var(--dsw-alias-label-primary); }
.omni-cell-sub { font-size: 11px; color: var(--dsw-alias-label-tertiary); }

.omni-modal-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 36%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}
.omni-modal {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 16px;
  width: 100%;
  max-width: 560px;
  max-height: calc(100vh - 96px);
  overflow-y: auto;
  padding: 24px;
}
.omni-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.omni-modal-title { font-size: 16px; font-weight: 650; margin: 0; }
.omni-modal-foot { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
.omni-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
}
.omni-icon-btn:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }

.omni-empty { text-align: center; padding: 48px 24px; color: var(--dsw-alias-label-tertiary); }
.omni-empty .omni-icon { opacity: 0.5; margin-bottom: 10px; }
.omni-loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 64px 24px; color: var(--dsw-alias-label-tertiary); }
.omni-spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--dsw-alias-border-l2);
  border-top-color: var(--dsw-alias-brand-primary);
  animation: omni-spin 800ms linear infinite;
}
@keyframes omni-spin { to { transform: rotate(360deg); } }

.omni-chart-legend { display: flex; gap: 16px; font-size: 11px; color: var(--dsw-alias-label-secondary); margin-bottom: 8px; flex-wrap: wrap; }
.omni-chart-legend i { display: inline-block; width: 10px; height: 3px; border-radius: 2px; margin-right: 5px; vertical-align: 2px; }
.omni-chart-svg { width: 100%; height: auto; display: block; }
.omni-chart-grid { stroke: var(--dsw-alias-border-l2); stroke-width: 1; }
.omni-chart-axis-text { fill: var(--dsw-alias-label-tertiary); font-size: 10px; font-variant-numeric: tabular-nums; }
.omni-bar-row { display: grid; grid-template-columns: 88px 1fr 88px; align-items: center; gap: 12px; padding: 7px 0; font-size: 12px; }
.omni-bar-label { color: var(--dsw-alias-label-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.omni-bar-track { height: 10px; border-radius: 5px; background: var(--dsw-alias-interactive-bg-hover); overflow: hidden; }
.omni-bar-fill { height: 100%; border-radius: 5px; transition: width 300ms ease-out; }
.omni-bar-value { text-align: right; font-variant-numeric: tabular-nums; font-weight: 500; }
.omni-funnel-row { display: flex; align-items: center; gap: 12px; padding: 6px 0; }
.omni-funnel-label { width: 64px; flex-shrink: 0; color: var(--dsw-alias-label-secondary); font-size: 12px; }
.omni-funnel-bar { height: 26px; border-radius: 6px; display: flex; align-items: center; padding: 0 10px; color: var(--dsw-alias-label-primary-foreground); font-size: 11px; font-variant-numeric: tabular-nums; min-width: 56px; transition: width 300ms ease-out; }
.omni-funnel-rate { font-size: 11px; color: var(--dsw-alias-label-tertiary); font-variant-numeric: tabular-nums; white-space: nowrap; }

.omni-todo-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  text-align: left;
  padding: 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-secondary);
  margin-bottom: 10px;
  transition: border-color 160ms ease-out;
}
.omni-todo-item:hover { border-color: var(--dsw-alias-border-primary); }
.omni-todo-item .omni-icon { margin-top: 2px; color: var(--dsw-alias-state-business-primary); }
.omni-todo-item .omni-arrow { margin-left: auto; color: var(--dsw-alias-label-tertiary); }

.omni-channel-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.omni-channel-name { font-weight: 650; font-size: 14px; }
.omni-channel-account { font-size: 12px; color: var(--dsw-alias-label-tertiary); margin-bottom: 14px; }
.omni-channel-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; margin-bottom: 14px; }
.omni-stat-label { font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.omni-stat-value { font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums; }
.omni-channel-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; border-top: 1px solid var(--dsw-alias-border-l2); padding-top: 12px; font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.omni-auth-warning { color: var(--dsw-alias-state-business-primary); }
.omni-auth-error { color: var(--dsw-alias-state-error-primary); }

.omni-agent-head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.omni-agent-name { font-weight: 650; font-size: 14px; }
.omni-agent-desc { color: var(--dsw-alias-label-tertiary); font-size: 12px; margin: 0 0 14px; }
.omni-agent-stats { display: flex; gap: 24px; margin-bottom: 14px; }
.omni-agent-run { display: flex; gap: 8px; }
.omni-agent-run .omni-input { flex: 1; }

.omni-material-preview {
  height: 120px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: var(--dsw-alias-label-primary-foreground);
}
.omni-material-preview.tone-brand { background: var(--dsw-alias-brand-primary); }
.omni-material-preview.tone-success { background: var(--dsw-alias-state-success-primary); }
.omni-material-preview.tone-business { background: var(--dsw-alias-state-business-primary); }
.omni-material-title { font-weight: 600; font-size: 13px; margin-bottom: 4px; }
.omni-material-meta { font-size: 11px; color: var(--dsw-alias-label-tertiary); margin-bottom: 2px; }
.omni-material-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 10px; }
.omni-material-actions { display: flex; gap: 6px; }

.omni-publish-task { border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; background: var(--dsw-alias-bg-base); }
.omni-publish-task-head { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; flex-wrap: wrap; }
.omni-publish-task-title { font-weight: 600; }
.omni-publish-task-meta { font-size: 11px; color: var(--dsw-alias-label-tertiary); margin-bottom: 10px; }
.omni-publish-target { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-top: 1px solid var(--dsw-alias-border-l2); font-size: 12px; }
.omni-publish-target-channel { width: 88px; flex-shrink: 0; color: var(--dsw-alias-label-secondary); }
.omni-publish-target-info { color: var(--dsw-alias-label-tertiary); font-size: 11px; flex: 1; min-width: 0; }
.omni-publish-target-error { color: var(--dsw-alias-state-error-primary); }

.omni-filter-bar { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
.omni-filter-bar .omni-input { max-width: 240px; }
.omni-filter-bar .omni-select { max-width: 160px; width: auto; }
.omni-summary-strip { display: flex; gap: 32px; flex-wrap: wrap; margin-bottom: 16px; }
.omni-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 12px;
  z-index: 1100;
  display: flex;
  align-items: center;
  gap: 8px;
}
.omni-toast .omni-icon { color: var(--dsw-alias-state-success-primary); }

@container omni-root (max-width: 760px) {
  .omni-nav { width: 56px; padding: 16px 8px; }
  .omni-nav-group { display: none; }
  .omni-nav-item { justify-content: center; padding: 10px 0; }
  .omni-nav-item .omni-nav-label { display: none; }
  .omni-brand-sub { display: none; }
  .omni-assistant { width: 280px; }
  .omni-content { padding: 16px 16px 32px; }
}
@container omni-root (max-width: 560px) {
  .omni-assistant { position: absolute; right: 0; top: 0; bottom: 0; width: min(320px, 88%); z-index: 900; box-shadow: -8px 0 24px color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent); }
}
@container omni-content (max-width: 1180px) {
  .omni-channels-grid, .omni-materials-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@container omni-content (max-width: 1080px) {
  .omni-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .omni-dashboard-main, .omni-dashboard-bottom, .omni-publish-layout, .omni-leads-layout { grid-template-columns: minmax(0, 1fr); }
  .omni-agents-grid { grid-template-columns: minmax(0, 1fr); }
}
@container omni-content (max-width: 640px) {
  .omni-kpis, .omni-channels-grid, .omni-materials-grid { grid-template-columns: minmax(0, 1fr); }
  .omni-kpi-value { font-size: 26px; }
  .omni-field-row { grid-template-columns: 1fr; }
  .omni-agent-stats { gap: 16px; flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .omni-root *, .omni-root *::before, .omni-root *::after {
    animation: none !important;
    transition: none !important;
  }
}
`

export function ensureStyles() {
  if (document.getElementById('omni-marketing-styles')) return
  const style = document.createElement('style')
  style.id = 'omni-marketing-styles'
  style.textContent = css
  document.head.appendChild(style)
}
