import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { apply } from '../dsh/index.js'

async function setup(existingRoot) {
  const root = existingRoot || await mkdtemp(join(tmpdir(), 'omni-'))
  let handler
  const ctx = {
    effect: fn => fn(),
    connection: { fetch: { register: opts => { handler = opts.fetch } } },
  }
  apply(ctx, { root })
  const call = (path, options) => handler(new Request(`http://local/api/omni-marketing.${path}`, options))
  const get = async resource => {
    const res = await call(`data?resource=${resource}`)
    return { status: res.status, body: await res.json() }
  }
  const post = async (action, payload) => {
    const res = await call('action', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload }),
    })
    return { status: res.status, body: await res.json() }
  }
  return { root, get, post }
}

test('GET returns all eight resources with expected shapes', async () => {
  const { get } = await setup()
  const dashboard = await get('dashboard')
  assert.equal(dashboard.status, 200)
  assert.equal(dashboard.body.data.kpis.length, 4)
  assert.equal(dashboard.body.data.channelCompare.length, 6)
  assert.equal(dashboard.body.data.trend.days.length, 30)

  for (const [resource, length] of [['channels', 6], ['campaigns', 7], ['materials', 9], ['publish', 4], ['leads', 10]]) {
    const res = await get(resource)
    assert.equal(res.status, 200, resource)
    assert.equal(res.body.data.length, length, resource)
  }
  const agents = await get('agents')
  assert.equal(agents.body.data.agents.length, 4)
  assert.ok(agents.body.data.runs.length >= 5)

  const reports = await get('reports')
  const channels = await get('channels')
  const expectedSpend = channels.body.data.reduce((s, c) => s + c.spend, 0)
  assert.equal(reports.body.data.summary.totalSpend, expectedSpend)
})

test('campaign create validates input and prepends a draft', async () => {
  const { get, post } = await setup()
  const invalid = await post('campaigns.create', { name: '' })
  assert.equal(invalid.status, 400)

  const created = await post('campaigns.create', {
    name: '暑期大促 · 全渠道联动', budget: 99000, channels: ['douyin', 'invalid-channel'],
  })
  assert.equal(created.status, 200)
  const first = created.body.data[0]
  assert.equal(first.name, '暑期大促 · 全渠道联动')
  assert.equal(first.status, 'draft')
  assert.deepEqual(first.channels, ['douyin'])
  assert.equal((await get('campaigns')).body.data.length, 8)
})

test('campaign toggle follows the status machine', async () => {
  const { post } = await setup()
  const paused = await post('campaigns.toggle', { id: 'c618' })
  assert.equal(paused.body.data.find(c => c.id === 'c618').status, 'paused')
  const resumed = await post('campaigns.toggle', { id: 'c618' })
  assert.equal(resumed.body.data.find(c => c.id === 'c618').status, 'running')
  const finished = await post('campaigns.toggle', { id: 'cwarm' })
  assert.equal(finished.status, 400)
  const missing = await post('campaigns.toggle', { id: 'nope' })
  assert.equal(missing.status, 404)
})

test('agent run appends a record and increments counters', async () => {
  const { post } = await setup()
  const before = (await post('agents.run', { agentId: 'content', task: '生成 3 条笔记' }))
  assert.equal(before.status, 200)
  assert.equal(before.body.data.runs[0].task, '生成 3 条笔记')
  assert.equal(before.body.data.runs[0].status, 'success')
  assert.equal(before.body.data.agents.find(a => a.id === 'content').todayTasks, 47)
  assert.equal((await post('agents.run', { agentId: 'content' })).status, 400)
  assert.equal((await post('agents.run', { agentId: 'ghost', task: 'x' })).status, 404)
})

test('publish marks disconnected channels failed and retry respects authorization', async () => {
  const { post } = await setup()
  const created = await post('publish.create', { title: '暑期预热视频', channels: ['douyin', 'weibo'] })
  assert.equal(created.status, 200)
  const task = created.body.data[0]
  assert.equal(task.targets.find(t => t.channel === 'douyin').status, 'published')
  const weibo = task.targets.find(t => t.channel === 'weibo')
  assert.equal(weibo.status, 'failed')
  assert.ok(weibo.error.includes('授权'))

  const retryOffline = await post('publish.retry', { id: task.id, channel: 'weibo' })
  assert.equal(retryOffline.status, 400)
  const retryOnline = await post('publish.retry', { id: 'p4', channel: 'channels' })
  assert.equal(retryOnline.status, 200)
  assert.equal(retryOnline.body.data.find(t => t.id === 'p4').targets.find(t => t.channel === 'channels').status, 'published')

  const scheduled = await post('publish.create', { title: '定时推文', channels: ['wechat'], mode: 'schedule', schedule: '2026-07-01 10:00' })
  assert.equal(scheduled.body.data[0].targets[0].status, 'scheduled')
  assert.equal((await post('publish.create', { title: '', channels: [] })).status, 400)
})

test('lead stage and material review transitions', async () => {
  const { post } = await setup()
  assert.equal((await post('leads.update', { id: 'l1', stage: 'bad' })).status, 400)
  const lead = await post('leads.update', { id: 'l1', stage: 'converted' })
  assert.equal(lead.body.data.find(l => l.id === 'l1').stage, 'converted')

  assert.equal((await post('materials.review', { id: 'm1', approve: true })).status, 400)
  const approved = await post('materials.review', { id: 'm4', approve: true })
  assert.equal(approved.body.data.find(m => m.id === 'm4').status, 'active')
  const rejected = await post('materials.review', { id: 'm5', approve: false })
  assert.equal(rejected.body.data.find(m => m.id === 'm5').status, 'draft')
})

test('unknown routes and malformed bodies are rejected', async () => {
  const { get, post } = await setup()
  assert.equal((await get('ghost')).status, 404)
  assert.equal((await post('ghost.action', {})).status, 404)
  const { root } = await setup()
  let handler
  apply({ effect: fn => fn(), connection: { fetch: { register: opts => { handler = opts.fetch } } } }, { root })
  const bad = await handler(new Request('http://local/api/omni-marketing.action', { method: 'POST', body: '{not-json' }))
  assert.equal(bad.status, 400)
})

test('mutations persist across plugin restarts', async () => {
  const { root, post } = await setup()
  await post('campaigns.create', { name: '持久化验证活动', budget: 1000 })
  const second = await setup(root)
  const campaigns = await second.get('campaigns')
  assert.ok(campaigns.body.data.some(c => c.name === '持久化验证活动'))
})
