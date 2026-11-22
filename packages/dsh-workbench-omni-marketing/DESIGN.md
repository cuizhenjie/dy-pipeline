# DESIGN.md — OMNI 全域营销运营 Agent 平台

> DSH 工作台插件 `dsh-workbench-omni-marketing` 的设计思考。
> 参考 stitch-skills 的 taste-design / design-md 原则（premium、anti-generic），落地为本工作台的具体风格。

## 气质与意象

**营销作战室的指挥台**：一个品牌增长团队的作战室——墙面是多渠道实时数据屏，桌面摊着活动排期表与素材剪报，运营指挥官在频道之间调度资源。物理锚点是**精密航空仪表的可读性**（大数字、细刻度、一眼定位异常）叠加**纸质营销剪报簿的编排感**（模块拼贴、素材缩略图、批注式标签）。

不是冷色科技大屏，而是"白天也在高效运转的增长工作台"：浅色纸面为底，深色导航如指挥台边框，数据以仪表密度排布，异常与机会用信号色点亮。

## 视觉策略

- **图表即仪表**：折线、柱状、漏斗、环形全部以细刻度、清晰轴向、直接标注呈现；不堆装饰性渐变。SVG 手绘，无重型图表库。
- **拼贴式信息层级**：KPI 大数字卡（仪表）→ 趋势/对比图（作战图）→ 明细表格（账本）→ 素材缩略图（剪报）。每层有明确的视觉重量。
- **图标**：内联线性 SVG（1.5px 描边、圆角端点），不用 emoji、不引图标库。
- **状态表达**：状态用"色点 + 文字"双编码，不只改颜色；加载用骨架屏，空态给明确下一步动作。

## 配色方案

全部使用宿主 `--dsw-alias-*` 语义 token，深浅主题自动切换，不硬编码十六进制、不自建第三套 token 体系：

- 底色 `--dsw-alias-bg-base`：作战室纸面
- 卡片 `--dsw-alias-bg-layer-1` / `--dsw-alias-bg-layer-2`：浮于纸面的仪表板
- 品牌强调 `--dsw-alias-brand-primary`（按钮 `--dsw-alias-button-primary-fill/hover`）：指挥信号色，只用于关键动作、激活导航、核心数据强调
- 文字 `--dsw-alias-label-primary/secondary/tertiary/caption`：账本级四级灰度
- 边框 `--dsw-alias-border-l2/primary/secondary`：仪表刻度线，细分隔优先于阴影
- 状态 `--dsw-alias-state-success-primary`（增长/投放中）、`--dsw-alias-state-error-primary`（下滑/异常）、`--dsw-alias-state-business-primary`（业务高亮/待办）
- 图表多系列：以 brand/success/error/label-tertiary 为基色，用 `color-mix(in srgb, …)` 透明度派生层次，深浅主题下保持可辨

## 字体排版

- 字体栈：系统中文黑体（PingFang SC / Microsoft YaHei / Noto Sans SC）+ 西文系统无衬线；数字 `font-variant-numeric: tabular-nums`，对齐如仪表读数
- 节奏：页面标题 20px/600，卡片标题 14px/600，正文 13px，辅助 12px；KPI 大数字 28–32px/650
- 信息密度：高但留白有序——卡片内边距 16–20px，模块间距 16px，表格行高 40px；长中文标题缩略不换行挤压，按钮文案完整不裁切

## 动效与交互

- 运动性格：**仪表式精准**——150–200ms ease-out 微过渡，hover 只改背景/边框，不用夸张位移
- 页面切换：内容区 150ms 淡入；弹层 160ms 缩放淡入，含焦点陷阱、Esc、遮罩关闭、busy 禁关
- 响应式：按**业务容器实际宽度**（容器查询 + ResizeObserver 测量）重排——四列 KPI → 两列 → 单列；图表与表格在窄容器下允许有界横向滚动；侧栏展开/收起、窄窗口均不出现整页横向溢出
- 尊重 `prefers-reduced-motion`，关闭非必要过渡

## 设计禁忌

- 不做科技蓝 + 紫渐变、发光大屏等套路化"AI 感"
- 不用圆角卡片无脑堆叠、无意义大阴影、装饰性渐变背景
- 不硬编码色值、不新增 `--ds-*`、不写手写主题分支
- 不用整窗媒体查询代替容器响应式；不允许单字竖排、按钮裁切、整页横向溢出
- 不用 emoji 当图标；不把常驻聊天区当作默认布局（AI 会话按需唤起，用宿主 conversation 节点）
