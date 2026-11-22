export function createIcons(React) {
  const paths = {
    dashboard: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
    channels: 'M12 5a3 3 0 1 0 0-.01M5 19a3 3 0 1 0 0-.01M19 19a3 3 0 1 0 0-.01M12 8v4m0 0-5.5 4.5M12 12l5.5 4.5',
    campaigns: 'M5 4v16M5 5h12l-2.5 4L17 13H5',
    agents: 'M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4zM18 15l.9 2.3L21 18l-2.1.7L18 21l-.9-2.3L15 18l2.1-.7zM5 15l.7 1.8L7.5 17l-1.8.6L5 19.4 4.3 17.6 2.5 17l1.8-.2z',
    materials: 'M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15.5 8.5h.01',
    publish: 'M21 3 10 14M21 3l-7 18-4-7-7-4z',
    leads: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2M17 8a3 3 0 0 1 0 6M22 21v-2a4 4 0 0 0-3-3.87',
    reports: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
    refresh: 'M20 11A8 8 0 1 0 18.4 16M20 4v7h-7',
    close: 'M6 6l12 12M18 6 6 18',
    plus: 'M12 5v14M5 12h14',
    download: 'M12 3v12m0 0 4-4m-4 4-4-4M4 17v4h16v-4',
    alert: 'M12 3 2 21h20zM12 10v5m0 3h.01',
    check: 'M4 12.5 9.5 18 20 6.5',
    up: 'M12 19V5m0 0-6 6m6-6 6 6',
    down: 'M12 5v14m0 0 6-6m-6 6-6-6',
    empty: 'M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8',
    sparkle: 'M12 4l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
    arrowRight: 'M4 12h16m0 0-6-6m6 6-6 6',
  }

  return function Icon({ name, size = 18, className = '' }) {
    return (
      <svg className={`omni-icon ${className}`} width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true" focusable="false">
        <path d={paths[name] || paths.empty} />
      </svg>
    )
  }
}
