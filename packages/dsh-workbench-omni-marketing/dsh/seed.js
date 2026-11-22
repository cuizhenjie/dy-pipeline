export function createSeed() {
  return {
    dashboard: {
      kpis: [
        { key: 'gmv', value: 1286400, delta: 18.6, spark: [62, 66, 61, 70, 74, 71, 78, 82, 79, 86, 90, 88] },
        { key: 'spend', value: 342180, delta: 12.4, spark: [40, 44, 42, 47, 45, 50, 52, 49, 55, 57, 54, 59] },
        { key: 'roi', value: 3.76, delta: 8.0, spark: [30, 32, 31, 34, 33, 36, 35, 38, 37, 40, 39, 42] },
        { key: 'leads', value: 2847, delta: 9.3, spark: [22, 25, 24, 27, 29, 28, 31, 30, 33, 35, 34, 37] },
      ],
      trend: {
        days: ['05-23', '05-24', '05-25', '05-26', '05-27', '05-28', '05-29', '05-30', '05-31', '06-01', '06-02', '06-03', '06-04', '06-05', '06-06', '06-07', '06-08', '06-09', '06-10', '06-11', '06-12', '06-13', '06-14', '06-15', '06-16', '06-17', '06-18', '06-19', '06-20', '06-21'],
        gmv: [28.4, 30.1, 27.6, 31.8, 33.2, 30.5, 35.6, 38.2, 36.4, 42.8, 45.1, 43.6, 40.2, 38.9, 41.5, 44.8, 47.2, 46.1, 49.6, 52.3, 50.8, 54.2, 58.6, 62.4, 60.1, 66.8, 72.4, 68.9, 64.2, 61.6],
        spend: [8.2, 8.6, 8.1, 9.0, 9.4, 8.8, 10.2, 10.8, 10.1, 12.6, 13.2, 12.4, 11.8, 11.2, 12.0, 12.8, 13.4, 12.9, 14.2, 14.8, 14.1, 15.2, 16.4, 17.2, 16.1, 18.2, 19.6, 18.4, 17.0, 16.2],
      },
      funnel: [
        { key: 'impression', value: 84200000 },
        { key: 'click', value: 3860000 },
        { key: 'visit', value: 924000 },
        { key: 'order', value: 48600 },
        { key: 'deal', value: 39200 },
      ],
      todos: [
        { key: 'authExpiring', level: 'warning', target: 'channels' },
        { key: 'materialReview', level: 'info', target: 'materials' },
        { key: 'budgetAdvice', level: 'info', target: 'agents' },
      ],
    },
    channels: [
      { id: 'douyin', name: '抖音', account: 'OMNI 官方旗舰店', followers: 1286000, spend: 126800, gmv: 486200, roi: 3.83, status: 'connected', health: 'good', leads: 1024, authDaysLeft: 62 },
      { id: 'wechat', name: '微信公众号', account: 'OMNI 品牌服务号', followers: 462000, spend: 18200, gmv: 96400, roi: 5.30, status: 'connected', health: 'good', leads: 486, authDaysLeft: 128 },
      { id: 'xiaohongshu', name: '小红书', account: 'OMNI 美学研究所', followers: 328000, spend: 64500, gmv: 268400, roi: 4.16, status: 'connected', health: 'good', leads: 642, authDaysLeft: 45 },
      { id: 'kuaishou', name: '快手', account: 'OMNI 好物严选', followers: 581000, spend: 42300, gmv: 148600, roi: 3.51, status: 'connected', health: 'good', leads: 328, authDaysLeft: 88 },
      { id: 'channels', name: '视频号', account: 'OMNI 品牌视频号', followers: 214000, spend: 36900, gmv: 118200, roi: 3.20, status: 'connected', health: 'warning', leads: 214, authDaysLeft: 3 },
      { id: 'weibo', name: '微博', account: 'OMNI 官方微博', followers: 893000, spend: 53480, gmv: 168600, roi: 3.15, status: 'disconnected', health: 'error', leads: 153, authDaysLeft: 0 },
    ],
    campaigns: [
      { id: 'c618', name: '618 全域大促 · 爆款直降', status: 'running', budget: 500000, spend: 342180, gmv: 1286400, roi: 3.76, start: '2026-06-01', end: '2026-06-20', channels: ['douyin', 'kuaishou', 'weibo'], owner: '王雅静' },
      { id: 'cnew', name: '新品上市 · 轻盈系列首发', status: 'running', budget: 180000, spend: 96420, gmv: 283400, roi: 2.94, start: '2026-06-10', end: '2026-06-30', channels: ['douyin', 'xiaohongshu'], owner: '李昊然' },
      { id: 'cvip', name: '品牌会员日 · 老客召回', status: 'scheduled', budget: 80000, spend: 0, gmv: 0, roi: 0, start: '2026-06-25', end: '2026-06-27', channels: ['wechat', 'channels'], owner: '陈思远' },
      { id: 'cwarm', name: '618 预热 · 种草笔记矩阵', status: 'finished', budget: 120000, spend: 118600, gmv: 488600, roi: 4.12, start: '2026-05-20', end: '2026-05-31', channels: ['xiaohongshu'], owner: '赵梦琪' },
      { id: 'cmay', name: '五一出行季 · 场景种草', status: 'finished', budget: 150000, spend: 149200, gmv: 489400, roi: 3.28, start: '2026-04-28', end: '2026-05-05', channels: ['douyin', 'kuaishou'], owner: '王雅静' },
      { id: 'cnewuser', name: '新客首单礼 · 拉新专项', status: 'paused', budget: 200000, spend: 86300, gmv: 160500, roi: 1.86, start: '2026-06-05', end: '2026-06-30', channels: ['douyin', 'weibo'], owner: '刘一帆' },
      { id: 'cclear', name: '清库存 · 尾货闪购', status: 'draft', budget: 60000, spend: 0, gmv: 0, roi: 0, start: '', end: '', channels: ['kuaishou'], owner: '孙可欣' },
    ],
    agents: [
      { id: 'content', name: '内容工坊', role: 'content', description: '生成短视频脚本、种草笔记与直播话术', todayTasks: 46, successRate: 98.2, status: 'active', model: 'DeepSeek-V4' },
      { id: 'optimize', name: '投放参谋', role: 'optimize', description: '预算调配、出价建议与人群包优化', todayTasks: 18, successRate: 96.4, status: 'active', model: 'DeepSeek-V4', advices: 3 },
      { id: 'service', name: '全域客服', role: 'service', description: '多平台私信与评论聚合回复', todayTasks: 1284, successRate: 89.6, status: 'active', model: 'DeepSeek-V4' },
      { id: 'analyst', name: '增长分析师', role: 'analyst', description: '全域归因、周报生成与异常检测', todayTasks: 6, successRate: 99.1, status: 'active', model: 'DeepSeek-V4' },
    ],
    agentRuns: [
      { id: 'r1', agentId: 'content', task: '为「轻盈系列」生成 3 条小红书种草笔记', status: 'success', duration: 42, time: '2026-06-21 14:32' },
      { id: 'r2', agentId: 'optimize', task: '618 大促抖音渠道预算再分配建议', status: 'success', duration: 28, time: '2026-06-21 13:58' },
      { id: 'r3', agentId: 'service', task: '集中回复抖音评论区 126 条询价留言', status: 'success', duration: 156, time: '2026-06-21 13:20' },
      { id: 'r4', agentId: 'analyst', task: '生成 6 月第 3 周全域经营周报', status: 'success', duration: 64, time: '2026-06-21 11:05' },
      { id: 'r5', agentId: 'content', task: '撰写 618 返场直播口播脚本', status: 'failed', duration: 18, time: '2026-06-21 10:46', error: '素材引用缺失' },
    ],
    materials: [
      { id: 'm1', title: '618 爆款直降 · 15s 短视频', type: 'video', size: '1080 × 1920', campaign: '618 全域大促 · 爆款直降', status: 'active', updated: '2026-06-20 18:22', tone: 'brand' },
      { id: 'm2', title: '轻盈系列 · 上新主图', type: 'image', size: '1080 × 1080', campaign: '新品上市 · 轻盈系列首发', status: 'active', updated: '2026-06-19 11:08', tone: 'success' },
      { id: 'm3', title: '种草笔记封面 · 通勤场景', type: 'image', size: '1242 × 1656', campaign: '618 预热 · 种草笔记矩阵', status: 'active', updated: '2026-06-18 16:40', tone: 'business' },
      { id: 'm4', title: '直播高光切片 · 爆款讲解', type: 'video', size: '1080 × 1920', campaign: '618 全域大促 · 爆款直降', status: 'review', updated: '2026-06-21 09:14', tone: 'brand' },
      { id: 'm5', title: '会员日召回 · 推文头图', type: 'image', size: '900 × 383', campaign: '品牌会员日 · 老客召回', status: 'review', updated: '2026-06-20 20:02', tone: 'success' },
      { id: 'm6', title: '618 返场 · 直播预告海报', type: 'image', size: '1080 × 1440', campaign: '618 全域大促 · 爆款直降', status: 'draft', updated: '2026-06-17 15:36', tone: 'business' },
      { id: 'm7', title: '产品详情页 · 轻盈系列长图', type: 'image', size: '750 × 4200', campaign: '新品上市 · 轻盈系列首发', status: 'active', updated: '2026-06-16 10:12', tone: 'success' },
      { id: 'm8', title: '尾货闪购 · 促销贴纸包', type: 'image', size: '1080 × 1080', campaign: '清库存 · 尾货闪购', status: 'draft', updated: '2026-06-15 14:48', tone: 'brand' },
      { id: 'm9', title: '五一出行 · 场景混剪视频', type: 'video', size: '1920 × 1080', campaign: '五一出行季 · 场景种草', status: 'active', updated: '2026-05-04 17:26', tone: 'business' },
    ],
    publishTasks: [
      { id: 'p1', title: '618 爆款直降 15s 短视频', materialId: 'm1', created: '2026-06-20 19:00', mode: 'now', targets: [
        { channel: 'douyin', status: 'published', time: '2026-06-20 19:02' },
        { channel: 'kuaishou', status: 'published', time: '2026-06-20 19:03' },
        { channel: 'channels', status: 'publishing', time: '' },
      ] },
      { id: 'p2', title: '轻盈系列上新笔记（图文）', materialId: 'm2', created: '2026-06-19 12:00', mode: 'now', targets: [
        { channel: 'xiaohongshu', status: 'published', time: '2026-06-19 12:04' },
        { channel: 'weibo', status: 'published', time: '2026-06-19 12:05' },
      ] },
      { id: 'p3', title: '会员日召回推文', materialId: 'm5', created: '2026-06-20 21:00', mode: 'schedule', schedule: '2026-06-25 10:00', targets: [
        { channel: 'wechat', status: 'scheduled', time: '2026-06-25 10:00' },
        { channel: 'channels', status: 'scheduled', time: '2026-06-25 10:00' },
      ] },
      { id: 'p4', title: '直播高光切片 · 爆款讲解', materialId: 'm4', created: '2026-06-21 09:30', mode: 'now', targets: [
        { channel: 'douyin', status: 'published', time: '2026-06-21 09:34' },
        { channel: 'channels', status: 'failed', time: '', error: '视频号授权已过期' },
      ] },
    ],
    leads: [
      { id: 'l1', contact: '王雅静', company: '上海岚调服饰有限公司', channel: 'douyin', intent: '轻盈系列 · 企业团购', stage: 'following', score: 86, owner: '陈思远', lastTouch: '2026-06-21 10:20' },
      { id: 'l2', contact: '李昊然', company: '杭州栖木家居', channel: 'xiaohongshu', intent: '618 大促联名合作', stage: 'new', score: 72, owner: '未分配', lastTouch: '2026-06-21 09:48' },
      { id: 'l3', contact: '陈思远', company: '深圳逐光电子科技', channel: 'wechat', intent: '企业年度采购框架', stage: 'converted', score: 94, owner: '王雅静', lastTouch: '2026-06-20 16:32' },
      { id: 'l4', contact: '赵梦琪', company: '北京璞真食品', channel: 'kuaishou', intent: '直播带货渠道供货', stage: 'following', score: 68, owner: '刘一帆', lastTouch: '2026-06-20 14:05' },
      { id: 'l5', contact: '刘一帆', company: '广州沐白美妆', channel: 'douyin', intent: '新品试用装批量采购', stage: 'new', score: 61, owner: '未分配', lastTouch: '2026-06-21 11:12' },
      { id: 'l6', contact: '孙可欣', company: '成都山丘户外用品', channel: 'channels', intent: '会员日企业福利采购', stage: 'following', score: 78, owner: '陈思远', lastTouch: '2026-06-19 17:44' },
      { id: 'l7', contact: '周文博', company: '南京禾风教育', channel: 'weibo', intent: '品牌联名课程礼盒', stage: 'invalid', score: 32, owner: '赵梦琪', lastTouch: '2026-06-18 15:20' },
      { id: 'l8', contact: '吴倩', company: '武汉初语母婴', channel: 'xiaohongshu', intent: '亲子场景产品定制', stage: 'following', score: 81, owner: '王雅静', lastTouch: '2026-06-21 08:56' },
      { id: 'l9', contact: '郑皓', company: '苏州澄川智能', channel: 'wechat', intent: '经销商年度订货', stage: 'converted', score: 90, owner: '陈思远', lastTouch: '2026-06-20 11:30' },
      { id: 'l10', contact: '林诗涵', company: '厦门屿蓝文旅', channel: 'douyin', intent: '文旅伴手礼定制', stage: 'new', score: 66, owner: '未分配', lastTouch: '2026-06-21 12:02' },
    ],
  }
}

export const CHANNEL_IDS = ['douyin', 'wechat', 'xiaohongshu', 'kuaishou', 'channels', 'weibo']

export function buildReports(state) {
  return {
    byChannel: state.channels.map(c => ({
      id: c.id, name: c.name, spend: c.spend, gmv: c.gmv, roi: c.roi, leads: c.leads,
      impressions: Math.round(c.spend * 246), clicks: Math.round(c.spend * 11.2), status: c.status,
    })),
    byCampaign: state.campaigns.filter(c => c.status !== 'draft').map(c => ({
      id: c.id, name: c.name, status: c.status, spend: c.spend, gmv: c.gmv, roi: c.roi,
      ctr: c.spend ? +(2.4 + c.roi / 3).toFixed(2) : 0, leads: Math.round(c.spend / 120),
    })),
    summary: {
      totalSpend: state.channels.reduce((s, c) => s + c.spend, 0),
      totalGmv: state.channels.reduce((s, c) => s + c.gmv, 0),
      totalLeads: state.channels.reduce((s, c) => s + c.leads, 0),
    },
  }
}
