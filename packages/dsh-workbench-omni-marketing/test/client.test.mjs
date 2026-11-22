import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { build } from 'esbuild'
import { createSeed, buildReports } from '../dsh/seed.js'
import { copy } from '../src/client/copy.js'

const require = createRequire(import.meta.url)
const root = fileURLToPath(new URL('..', import.meta.url))
let mod
let workbenchFactory

before(async () => {
  const result = await build({
    entryPoints: [`${root}test/ssr-entry.jsx`],
    bundle: true, write: false, format: 'cjs', platform: 'node',
    jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment',
    external: ['react', 'react-dom'], logLevel: 'silent',
  })
  const module = { exports: {} }
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(require, module, module.exports)
  mod = module.exports

  globalThis.window = {
    __ModuleLoader__: { load: ({ factory }) => { workbenchFactory = factory } },
  }
  await import('../lib/client.js')
})

const t = (key, params) => {
  let text = copy.zh[key] || key
  if (params) for (const [k, v] of Object.entries(params)) text = text.replaceAll(`{${k}}`, String(v))
  return text
}
const CHANNEL_NAMES = {
  douyin: '抖音', wechat: '微信公众号', xiaohongshu: '小红书',
  kuaishou: '快手', channels: '视频号', weibo: '微博',
}

function makeDeps() {
  const Icon = mod.createIcons(React)
  const C = mod.createComponents(React, { t, Icon })
  return {
    t, Icon, C,
    api: { post: async () => ({}) },
    channelName: id => CHANNEL_NAMES[id] || id,
    onOpenAssistant() {}, onNavigate() {},
  }
}

test('locale dictionaries keep zh and en keys in sync', () => {
  assert.deepEqual(Object.keys(copy.zh).sort(), Object.keys(copy.en).sort())
})

test('workbench registers with custom frame and compact toolbar', () => {
  const wb = workbenchFactory(id => {
    if (id === 'react') return React
    throw new Error(`unexpected require: ${id}`)
  })
  assert.deepEqual(wb.inject, ['desktopWorkbenches'])
  let captured
  const ctx = {
    effect: fn => fn(),
    locale: {
      register: (ns, dict) => { assert.ok(dict.zh && dict.en) },
      bind: () => t,
    },
    desktopWorkbenches: { register: (meta, Panel) => { captured = { meta, Panel } } },
  }
  wb.apply(ctx)
  assert.equal(captured.meta.customFrame, true)
  assert.equal(captured.meta.headerLayout, 'compact')
  const html = renderToString(React.createElement(captured.Panel, {}))
  assert.ok(html.includes('data-dsh-workbench-toolbar'))
  assert.ok(html.includes('omni-nav'))
  assert.ok(html.includes(copy.zh['common.loading']))
})

test('all eight pages render seed data without crashing', () => {
  const seed = createSeed()
  const deps = makeDeps()
  const cases = [
    ['dashboard', mod.createDashboardPage, {
      ...seed.dashboard,
      channelCompare: seed.channels.map(c => ({ label: c.name, value: c.gmv })),
    }, ['全域 GMV', '今日待办', 'omni-chart-svg']],
    ['channels', mod.createChannelsPage, seed.channels, ['OMNI 官方旗舰店', '授权已过期', '授权剩余']],
    ['campaigns', mod.createCampaignsPage, seed.campaigns, ['618 全域大促 · 爆款直降', '投放中', '新建活动']],
    ['agents', mod.createAgentsPage, { agents: seed.agents, runs: seed.agentRuns }, ['内容工坊', '最近运行记录', '素材引用缺失']],
    ['materials', mod.createMaterialsPage, seed.materials, ['直播高光切片 · 爆款讲解', '待审核', '让 AI 生成素材']],
    ['publish', mod.createPublishPage, seed.publishTasks, ['视频号授权已过期', '全渠道发布', '定时发布']],
    ['leads', mod.createLeadsPage, seed.leads, ['王雅静', '线索阶段分布', '上海岚调服饰有限公司']],
    ['reports', mod.createReportsPage, buildReports(seed), ['渠道经营报表', '活动效果报表', '导出 CSV']],
  ]
  for (const [name, factory, data, expected] of cases) {
    const Page = factory(React, deps)
    const html = renderToString(React.createElement(Page, {
      data, reload: async () => {}, onNavigate() {}, materials: seed.materials, channels: seed.channels,
    }))
    for (const text of expected) assert.ok(html.includes(text), `${name} should render "${text}"`)
  }
})

test('status badges and numeric formatting stay stable', () => {
  const deps = makeDeps()
  const { Badge, fmtMoney, fmtWan } = deps.C
  const html = renderToString(React.createElement(Badge, { status: 'running' }))
  assert.ok(html.includes('omni-badge success'))
  assert.ok(html.includes('投放中'))
  assert.equal(fmtMoney(1286400), '¥1,286,400')
  assert.equal(fmtWan(1286000), '128.6 万')
})
