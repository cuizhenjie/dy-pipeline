import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import z from '@deepseek-ai/schemastery'
import { createSeed, buildReports, CHANNEL_IDS } from './seed.js'

export const name = 'omni-marketing'
export const inject = ['connection']
export const Config = z.object({
  root: z.string().required(),
})

const PREFIX = '/api/omni-marketing'
const MAX_BODY = 1024 * 1024

function json(data, status = 200) {
  return Response.json(data, { status })
}

function uid(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`
}

function nowText() {
  const d = new Date()
  const p = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function resourceData(state, resource) {
  switch (resource) {
    case 'dashboard': return {
      ...state.dashboard,
      channelCompare: state.channels.map(c => ({ label: c.name, value: c.gmv })),
    }
    case 'channels': return state.channels
    case 'campaigns': return state.campaigns
    case 'agents': return { agents: state.agents, runs: state.agentRuns }
    case 'materials': return state.materials
    case 'publish': return state.publishTasks
    case 'leads': return state.leads
    case 'reports': return buildReports(state)
    default: return null
  }
}

export function apply(ctx, config) {
  let state = createSeed()
  const file = () => join(config.root, 'data.json')

  async function load() {
    try {
      const raw = await readFile(file(), 'utf8')
      const saved = JSON.parse(raw)
      // Seed keys stay authoritative for newly added modules across upgrades.
      state = { ...createSeed(), ...saved }
    } catch {}
  }

  async function save() {
    await mkdir(config.root, { recursive: true })
    await writeFile(file(), JSON.stringify(state, null, 2))
  }

  const ready = load()

  const actions = {
    'campaigns.create': (p) => {
      if (!p.name || !p.budget) return json({ error: 'name and budget are required' }, 400)
      state.campaigns.unshift({
        id: uid('c'), name: String(p.name).slice(0, 80), status: 'draft',
        budget: Number(p.budget) || 0, spend: 0, gmv: 0, roi: 0,
        start: p.start || '', end: p.end || '',
        channels: (p.channels || []).filter(c => CHANNEL_IDS.includes(c)),
        owner: p.owner || '未分配',
      })
      return json({ data: state.campaigns })
    },
    'campaigns.toggle': (p) => {
      const c = state.campaigns.find(c => c.id === p.id)
      if (!c) return json({ error: 'campaign not found' }, 404)
      if (c.status === 'running') c.status = 'paused'
      else if (c.status === 'paused' || c.status === 'draft' || c.status === 'scheduled') c.status = 'running'
      else return json({ error: 'finished campaign cannot be toggled' }, 400)
      return json({ data: state.campaigns })
    },
    'agents.run': (p) => {
      const agent = state.agents.find(a => a.id === p.agentId)
      if (!agent) return json({ error: 'agent not found' }, 404)
      if (!p.task) return json({ error: 'task is required' }, 400)
      state.agentRuns.unshift({
        id: uid('r'), agentId: agent.id, task: String(p.task).slice(0, 200),
        status: 'success', duration: 8 + Math.floor(Math.random() * 60), time: nowText(),
      })
      agent.todayTasks += 1
      return json({ data: { agents: state.agents, runs: state.agentRuns } })
    },
    'publish.create': (p) => {
      if (!p.title || !Array.isArray(p.channels) || !p.channels.length) {
        return json({ error: 'title and channels are required' }, 400)
      }
      const mode = p.mode === 'schedule' ? 'schedule' : 'now'
      const targets = p.channels.filter(c => CHANNEL_IDS.includes(c)).map(channel => {
        const ch = state.channels.find(c => c.id === channel)
        if (ch?.status === 'disconnected') return { channel, status: 'failed', time: '', error: `${ch.name}授权已过期` }
        if (mode === 'schedule') return { channel, status: 'scheduled', time: p.schedule || '' }
        return { channel, status: 'published', time: nowText() }
      })
      state.publishTasks.unshift({
        id: uid('p'), title: String(p.title).slice(0, 80), materialId: p.materialId || '',
        created: nowText(), mode, schedule: p.schedule || '', targets,
      })
      return json({ data: state.publishTasks })
    },
    'publish.retry': (p) => {
      const task = state.publishTasks.find(t => t.id === p.id)
      const target = task?.targets.find(t => t.channel === p.channel)
      if (!target) return json({ error: 'publish target not found' }, 404)
      const ch = state.channels.find(c => c.id === p.channel)
      if (ch?.status === 'disconnected') return json({ error: `${ch.name}授权已过期，请先在渠道管理中重新授权` }, 400)
      target.status = 'published'
      target.time = nowText()
      delete target.error
      return json({ data: state.publishTasks })
    },
    'leads.update': (p) => {
      const lead = state.leads.find(l => l.id === p.id)
      if (!lead) return json({ error: 'lead not found' }, 404)
      if (!['new', 'following', 'converted', 'invalid'].includes(p.stage)) return json({ error: 'invalid stage' }, 400)
      lead.stage = p.stage
      lead.lastTouch = nowText()
      return json({ data: state.leads })
    },
    'materials.review': (p) => {
      const m = state.materials.find(m => m.id === p.id)
      if (!m) return json({ error: 'material not found' }, 404)
      if (m.status !== 'review') return json({ error: 'material is not pending review' }, 400)
      m.status = p.approve ? 'active' : 'draft'
      m.updated = nowText()
      return json({ data: state.materials })
    },
  }

  ctx.effect(() => ctx.connection.fetch.register({
    path: `${PREFIX}.*`,
    methods: ['GET', 'POST'],
    requestBody: 'buffered',
    async fetch(request) {
      await ready
      const url = new URL(request.url)
      const route = url.pathname.slice(PREFIX.length + 1)
      try {
        if (route === 'data' && request.method === 'GET') {
          const resource = url.searchParams.get('resource') || 'dashboard'
          const data = resourceData(state, resource)
          if (data === null) return json({ error: `unknown resource: ${resource}` }, 404)
          return json({ data })
        }
        if (route === 'action' && request.method === 'POST') {
          const size = Number(request.headers.get('content-length') || 0)
          if (size > MAX_BODY) return json({ error: 'request too large' }, 413)
          const text = await request.text()
          if (text.length > MAX_BODY) return json({ error: 'request too large' }, 413)
          let body
          try { body = JSON.parse(text || '{}') } catch { return json({ error: 'invalid JSON body' }, 400) }
          const action = actions[body.action]
          if (!action) return json({ error: `unknown action: ${body.action}` }, 404)
          const res = action(body.payload || {})
          if (res.status === 200) await save()
          return res
        }
        return json({ error: 'not found' }, 404)
      } catch (err) {
        console.error('[omni-marketing] request failed:', route, err)
        return json({ error: 'internal error' }, 500)
      }
    },
  }))
}
