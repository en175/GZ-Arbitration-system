<script setup>
import { ref } from 'vue'

// ── 顶部核心指标 ───────────────────────────────────────
const kpis = [
  { label: '案件总量（本年）', value: '1,284', delta: '+38 较上月', level: 'primary' },
  { label: '在办案件', value: '312', delta: '含 23 件临期', level: 'warning' },
  { label: '本月新收', value: '86', delta: '+12% 较上月', level: 'success' },
  { label: '超期未推进', value: '7', delta: '较上周减少 2 件', level: 'danger' },
]

// ── AI 管理摘要 ────────────────────────────────────────
const aiMgmtSummary = '当前在办案件 312 件，其中 23 件存在临期风险，7 件超期未推进。节点卡点主要集中在「证据交换核验」（平均滞留 4.2 天）和「裁决书审签」（平均滞留 5.8 天）两个环节。人员承载方面，陈炜、刘晓燕两位秘书当前负责案件超过 30 件，属高负荷状态，建议关注。近两周材料缺件率下降 15%，补正效率有所提升。'

// ── 阶段分布 ──────────────────────────────────────────
const stageData = [
  { stage: '立案审核', count: 42, pct: 13, color: '#6187fa' },
  { stage: '证据交换', count: 98, pct: 31, color: '#3b66f5' },
  { stage: '庭审准备', count: 76, pct: 24, color: '#f7c948' },
  { stage: '裁决阶段', count: 58, pct: 19, color: '#00b479' },
  { stage: '执行与归档', count: 38, pct: 12, color: '#aab0c0' },
]

// ── 环形图计算 ──────────────────────────────────────────
const DONUT_R = 72
const DONUT_C = +(2 * Math.PI * DONUT_R).toFixed(2) // ≈ 452.39
const GAP = 3
let _cum = 0
const donutSegments = stageData.map(s => {
  const fullLen = +((s.pct / 100) * DONUT_C).toFixed(2)
  const drawLen = Math.max(fullLen - GAP, 0)
  const dashOffset = -_cum
  _cum += fullLen
  return { ...s, drawLen, dashOffset }
})

// ── 月度趋势数据（折线图简版） ─────────────────────────
const trendMonths = ['10月', '11月', '12月', '1月', '2月', '3月']
const trendNew    = [62, 74, 58, 71, 77, 86]
const trendClosed = [55, 68, 63, 66, 72, 79]
const trendMax = 100
const TREND_W = 260
const TREND_H = 72
const trendPoints = (arr) =>
  arr.map((v, i) => `${(i / (arr.length - 1)) * TREND_W},${TREND_H - (v / trendMax) * TREND_H}`).join(' ')

// ── 节点卡点分析 ──────────────────────────────────────
const bottlenecks = [
  { node: '证据交换核验', count: 34, avgDays: 4.2, trend: 'up', riskCount: 8 },
  { node: '裁决书审签', count: 18, avgDays: 5.8, trend: 'up', riskCount: 5 },
  { node: '庭审材料汇总', count: 22, avgDays: 2.9, trend: 'stable', riskCount: 3 },
  { node: '补正材料收取', count: 15, avgDays: 6.1, trend: 'down', riskCount: 4 },
  { node: '仲裁员焦点确认', count: 11, avgDays: 1.8, trend: 'stable', riskCount: 1 },
]

// ── 重点关注案件 ──────────────────────────────────────
const riskCases = [
  { caseNo: '（2026）粤仲案字第0893号', type: '建设工程合同纠纷', amount: '4,280,000', risk: '超期 8 天未推进', riskLevel: 'danger', secretary: '王海涛', stage: '裁决阶段' },
  { caseNo: '（2026）粤仲案字第1126号', type: '股权纠纷', amount: '12,600,000', risk: '材料缺件 3 项 · 补正超期', riskLevel: 'danger', secretary: '陈炜', stage: '立案审核' },
  { caseNo: '（2026）粤仲案字第2274号', type: '买卖合同纠纷', amount: '386,000', risk: '证据交换节点滞留 7 天', riskLevel: 'warning', secretary: '刘晓燕', stage: '证据交换' },
  { caseNo: '（2026）粤仲案字第3905号', type: '服务合同纠纷', amount: '960,000', risk: '裁决书已退回 2 次', riskLevel: 'warning', secretary: '陈炜', stage: '裁决阶段' },
  { caseNo: '（2026）粤仲案字第5100号', type: '劳动争议', amount: '88,000', risk: '庭审通知未签收 · 送达存疑', riskLevel: 'warning', secretary: '王海涛', stage: '庭审准备' },
]

// ── 人员承载分布 ──────────────────────────────────────
const MAX_LOAD = 40
const staffLoads = [
  { name: '陈炜', role: '办案秘书', activeCases: 34, urgentCases: 5, overdueCases: 2, load: 'heavy' },
  { name: '刘晓燕', role: '办案秘书', activeCases: 31, urgentCases: 3, overdueCases: 1, load: 'heavy' },
  { name: '王海涛', role: '办案秘书', activeCases: 26, urgentCases: 4, overdueCases: 2, load: 'normal' },
  { name: '赵宇', role: '办案秘书', activeCases: 22, urgentCases: 2, overdueCases: 0, load: 'normal' },
  { name: '李婷', role: '立案秘书', activeCases: 18, urgentCases: 3, overdueCases: 1, load: 'normal' },
  { name: '张明', role: '立案秘书', activeCases: 15, urgentCases: 1, overdueCases: 0, load: 'light' },
]
const loadBarColor = (load) =>
  load === 'heavy' ? '#f53f3f' : load === 'normal' ? '#00b479' : '#3b66f5'

// ── AI 管理建议 ────────────────────────────────────────
const mgmtAdvices = [
  { level: 'danger', text: '7 件超期案件中，4 件集中在「裁决阶段」，建议本周优先逐一跟进，识别卡点原因并推进。' },
  { level: 'warning', text: '陈炜、刘晓燕当前负荷均超 30 件，其中各含 5 件、3 件临期事项，建议合理分配新案或临时协调支援。' },
  { level: 'warning', text: '「补正材料收取」平均滞留 6.1 天，为近期超期主要来源之一，建议优化补正催收流程。' },
  { level: 'info', text: '本月新收案件同比增长 12%，建议提前评估资源需求，避免月末积压。' },
  { level: 'info', text: '近两周材料齐备率提升，立案审核环节整体效率改善，可作为典型案例总结。' },
]

// ── 近期案件处理动态 ──────────────────────────────────
const recentActivities = [
  { time: '10:42', date: '今日', text: '（2026）粤仲案字第5412号 证据核验节点推进完成，转入庭审准备阶段', level: 'success' },
  { time: '09:18', date: '今日', text: '（2026）粤仲案字第0893号 超期预警升级至高风险，自动推送提醒至责任秘书', level: 'danger' },
  { time: '08:55', date: '今日', text: '本日新收案件 4 件，立案审核队列新增，当前待审 42 件', level: 'info' },
  { time: '17:30', date: '昨日', text: '（2026）粤仲案字第3905号 裁决书第二次退回，已通知秘书重新修订', level: 'warning' },
  { time: '16:00', date: '昨日', text: 'AI 批量完成本周 12 件案件首屏摘要更新，可直接查阅', level: 'info' },
]

const activeTab = ref('overview')
const tabs = [
  { key: 'overview', label: '总览' },
  { key: 'risk', label: '风险管控' },
  { key: 'staff', label: '人员承载' },
]
</script>

<template>
  <div class="dash-page">

    <!-- 顶部标题 -->
    <div class="dash-header">
      <div class="dash-tabs">
        <button v-for="t in tabs" :key="t.key"
          class="dash-tab" :class="{ active: activeTab === t.key }"
          @click="activeTab = t.key">
          {{ t.label }}
        </button>
      </div>
    </div>

    <!-- KPI 卡片行 -->
    <div class="kpi-row">
      <div v-for="k in kpis" :key="k.label" class="kpi-card" :class="`kpi-card--${k.level}`">
        <div class="kpi-value">{{ k.value }}</div>
        <div class="kpi-label">{{ k.label }}</div>
        <div class="kpi-delta">{{ k.delta }}</div>
      </div>
    </div>

    <!-- AI 管理摘要 -->
    <div class="ai-mgmt-bar">
      <div class="ai-mgmt-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        AI 管理摘要
      </div>
      <div class="ai-mgmt-text">{{ aiMgmtSummary }}</div>
    </div>

    <!-- 主内容区 -->
    <div class="dash-body">

      <!-- ═══ 左列 ═══ -->
      <div class="dash-col">

        <!-- 案件阶段分布 —— 环形图 -->
        <div class="panel">
          <div class="panel-title">案件阶段分布 <span class="panel-sub">共 312 件在办</span></div>
          <div class="donut-layout">
            <!-- SVG 环形图 -->
            <div class="donut-wrap">
              <svg viewBox="0 0 200 200" class="donut-svg">
                <!-- 底色轨道 -->
                <circle cx="100" cy="100" :r="DONUT_R" fill="none" stroke="#f0f2f5" stroke-width="28"/>
                <!-- 各阶段弧段 -->
                <circle
                  v-for="seg in donutSegments" :key="seg.stage"
                  cx="100" cy="100" :r="DONUT_R"
                  fill="none"
                  :stroke="seg.color"
                  stroke-width="28"
                  stroke-linecap="butt"
                  :stroke-dasharray="`${seg.drawLen} ${DONUT_C}`"
                  :stroke-dashoffset="seg.dashOffset"
                  transform="rotate(-90 100 100)"
                />
                <!-- 中心文字 -->
                <text x="100" y="93" text-anchor="middle" font-size="26" font-weight="800" fill="#1a1d2e">312</text>
                <text x="100" y="113" text-anchor="middle" font-size="11" fill="#9ca3af">在办案件</text>
              </svg>
            </div>
            <!-- 图例列表 -->
            <div class="donut-legend">
              <div v-for="s in stageData" :key="s.stage" class="donut-legend-row">
                <span class="legend-dot" :style="{ background: s.color }"></span>
                <span class="legend-label">{{ s.stage }}</span>
                <span class="legend-bar-wrap">
                  <span class="legend-bar" :style="{ width: s.pct + '%', background: s.color }"></span>
                </span>
                <span class="legend-count">{{ s.count }}</span>
                <span class="legend-pct">{{ s.pct }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 月度收案趋势 —— 折线图 SVG -->
        <div class="panel">
          <div class="panel-title">月度收结案趋势
            <span class="trend-legend-wrap">
              <span class="trend-dot" style="background:#3b66f5"></span>新收
              <span class="trend-dot" style="background:#00b479"></span>结案
            </span>
          </div>
          <div class="trend-chart">
            <svg :viewBox="`0 0 ${TREND_W} ${TREND_H}`" class="trend-svg" preserveAspectRatio="none">
              <!-- 网格线 -->
              <line v-for="i in 3" :key="i"
                x1="0" :y1="TREND_H - (i/3)*TREND_H"
                :x2="TREND_W" :y2="TREND_H - (i/3)*TREND_H"
                stroke="#f0f2f5" stroke-width="1"/>
              <!-- 新收折线填充 -->
              <polygon
                :points="`0,${TREND_H} ${trendPoints(trendNew)} ${TREND_W},${TREND_H}`"
                fill="rgba(59,102,245,0.07)"/>
              <!-- 结案折线填充 -->
              <polygon
                :points="`0,${TREND_H} ${trendPoints(trendClosed)} ${TREND_W},${TREND_H}`"
                fill="rgba(0,180,121,0.07)"/>
              <!-- 新收折线 -->
              <polyline :points="trendPoints(trendNew)"
                fill="none" stroke="#3b66f5" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
              <!-- 结案折线 -->
              <polyline :points="trendPoints(trendClosed)"
                fill="none" stroke="#00b479" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
              <!-- 节点圆点 -->
              <circle v-for="(v, i) in trendNew" :key="'n'+i"
                :cx="(i/(trendNew.length-1))*TREND_W"
                :cy="TREND_H - (v/trendMax)*TREND_H"
                r="3" fill="#3b66f5"/>
              <circle v-for="(v, i) in trendClosed" :key="'c'+i"
                :cx="(i/(trendClosed.length-1))*TREND_W"
                :cy="TREND_H - (v/trendMax)*TREND_H"
                r="3" fill="#00b479"/>
            </svg>
            <div class="trend-labels">
              <span v-for="m in trendMonths" :key="m">{{ m }}</span>
            </div>
          </div>
        </div>

        <!-- 节点卡点分析 -->
        <div class="panel">
          <div class="panel-title">节点卡点分析
            <span class="panel-badge warning">平均滞留时间异常</span>
          </div>
          <div class="bottleneck-list">
            <div v-for="b in bottlenecks" :key="b.node" class="bottleneck-row">
              <div class="bn-node">{{ b.node }}</div>
              <div class="bn-bar-wrap">
                <div class="bn-bar" :style="{ width: Math.min(b.avgDays / 7 * 100, 100) + '%', background: b.avgDays >= 5 ? '#f53f3f' : b.avgDays >= 3 ? '#ff7d00' : '#3b66f5' }"></div>
              </div>
              <div class="bn-stats">
                <span class="bn-days" :class="b.avgDays >= 5 ? 'text-danger' : b.avgDays >= 3 ? 'text-warning' : 'text-primary'">{{ b.avgDays }}天</span>
                <span class="bn-risk" v-if="b.riskCount > 0">{{ b.riskCount }}件风险</span>
                <span class="bn-trend" :class="`trend--${b.trend}`">
                  {{ b.trend === 'up' ? '↑' : b.trend === 'down' ? '↓' : '—' }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ═══ 右列 ═══ -->
      <div class="dash-col">

        <!-- 人员承载分布 —— 置顶，含可视化负载条 -->
        <div class="panel">
          <div class="panel-title">
            人员承载分布
            <span class="panel-badge danger">{{ staffLoads.filter(s=>s.load==='heavy').length }} 人高负荷</span>
          </div>
          <div class="staff-list">
            <div v-for="s in staffLoads" :key="s.name" class="staff-item">
              <div class="staff-left">
                <div class="staff-avatar" :class="`avatar--${s.load}`">{{ s.name[0] }}</div>
                <div class="staff-info">
                  <div class="staff-name-row">
                    <span class="staff-name">{{ s.name }}</span>
                    <span class="staff-role-tag">{{ s.role }}</span>
                  </div>
                  <div class="staff-bar-area">
                    <div class="staff-bar-track">
                      <div class="staff-bar-fill"
                        :style="{ width: Math.min(s.activeCases / MAX_LOAD * 100, 100) + '%', background: loadBarColor(s.load) }">
                      </div>
                    </div>
                    <span class="staff-bar-label">{{ s.activeCases }}/{{ MAX_LOAD }}</span>
                  </div>
                </div>
              </div>
              <div class="staff-right">
                <div class="staff-nums">
                  <span class="num-item">{{ s.activeCases }}<em>在办</em></span>
                  <span class="num-item text-warning">{{ s.urgentCases }}<em>临期</em></span>
                  <span class="num-item text-danger">{{ s.overdueCases }}<em>超期</em></span>
                </div>
                <span class="load-badge" :class="`load--${s.load}`">
                  {{ s.load === 'heavy' ? '高负荷' : s.load === 'normal' ? '正常' : '宽松' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- AI 管理建议 -->
        <div class="panel panel--ai">
          <div class="panel-title panel-title--ai">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            AI 管理建议
          </div>
          <div class="advice-list">
            <div v-for="(a, i) in mgmtAdvices" :key="i" class="advice-row" :class="`advice--${a.level}`">
              <span class="advice-dot" :class="`dot-color--${a.level}`"></span>
              <span>{{ a.text }}</span>
            </div>
          </div>
        </div>

        <!-- 风险案件池 -->
        <div class="panel">
          <div class="panel-title">
            风险案件池
            <span class="panel-badge danger">{{ riskCases.filter(r=>r.riskLevel==='danger').length }} 件高风险</span>
          </div>
          <div class="risk-list">
            <div v-for="c in riskCases" :key="c.caseNo" class="risk-row" :class="`risk-row--${c.riskLevel}`">
              <div class="risk-left">
                <div class="risk-caseno">{{ c.caseNo }}</div>
                <div class="risk-meta">{{ c.type }} · ¥{{ c.amount }} · {{ c.stage }}</div>
                <div class="risk-reason">
                  <span class="risk-tag" :class="`risk-tag--${c.riskLevel}`">{{ c.riskLevel === 'danger' ? '高风险' : '关注' }}</span>
                  {{ c.risk }}
                </div>
              </div>
              <div class="risk-secretary">{{ c.secretary }}</div>
            </div>
          </div>
        </div>

        <!-- 近期处理动态 -->
        <div class="panel">
          <div class="panel-title">近期处理动态</div>
          <div class="activity-list">
            <div v-for="(a, i) in recentActivities" :key="i" class="activity-row">
              <div class="activity-dot" :class="`dot--${a.level}`"></div>
              <div class="activity-content">
                <div class="activity-text">{{ a.text }}</div>
                <div class="activity-time">{{ a.date }} {{ a.time }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.dash-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  overflow-y: auto;
  padding: 20px 24px;
  box-sizing: border-box;
}

/* ── 头部 ── */
.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.dash-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-main);
}
.dash-tabs {
  display: flex;
  gap: 6px;
  background: rgba(59,102,245,0.05);
  border-radius: 10px;
  padding: 4px;
}
.dash-tab {
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--text-sub);
  padding: 6px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}
.dash-tab:hover { background: rgba(59,102,245,0.08); color: var(--primary-color); }
.dash-tab.active { background: #fff; color: var(--primary-color); font-weight: 700; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

/* ── KPI 卡片 ── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  flex-shrink: 0;
}
.kpi-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.06);
  padding: 16px 20px;
}
.kpi-card--primary { border-color: rgba(59,102,245,0.18); }
.kpi-card--warning { border-color: rgba(255,125,0,0.18); }
.kpi-card--success { border-color: rgba(0,180,121,0.18); }
.kpi-card--danger  { border-color: rgba(245,63,63,0.18); }
.kpi-value { font-size: 28px; font-weight: 800; color: var(--text-main); line-height: 1; }
.kpi-card--danger .kpi-value  { color: #f53f3f; }
.kpi-card--warning .kpi-value { color: #ff7d00; }
.kpi-card--success .kpi-value { color: #00b479; }
.kpi-card--primary .kpi-value { color: var(--primary-color); }
.kpi-label { font-size: 13px; color: var(--text-sub); margin-top: 6px; }
.kpi-delta { font-size: 11px; color: var(--text-sub); margin-top: 4px; opacity: 0.7; }

/* ── AI 摘要 ── */
.ai-mgmt-bar {
  background: linear-gradient(135deg, rgba(59,102,245,0.06) 0%, rgba(97,135,250,0.03) 100%);
  border: 1px solid rgba(59,102,245,0.14);
  border-radius: 12px;
  padding: 14px 18px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex-shrink: 0;
}
.ai-mgmt-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--primary-color);
  white-space: nowrap;
  flex-shrink: 0;
}
.ai-mgmt-text { font-size: 13px; color: var(--text-regular); line-height: 1.7; }

/* ── 主布局 ── */
.dash-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.dash-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}

/* ── 通用 Panel ── */
.panel {
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.06);
  padding: 16px;
  flex-shrink: 0;
}
.panel--ai {
  background: linear-gradient(160deg, rgba(59,102,245,0.04) 0%, #fff 100%);
  border-color: rgba(59,102,245,0.14);
}
.panel-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.panel-title--ai {
  background: linear-gradient(135deg, #3b66f5, #6187fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  gap: 6px;
}
.panel-sub { font-size: 12px; color: var(--text-sub); font-weight: 400; }
.panel-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  margin-left: auto;
}
.panel-badge.danger  { background: rgba(245,63,63,0.1); color: #f53f3f; }
.panel-badge.warning { background: rgba(255,125,0,0.1); color: #ff7d00; }

/* ── 环形图 ── */
.donut-layout {
  display: flex;
  align-items: center;
  gap: 20px;
}
.donut-wrap {
  flex-shrink: 0;
  width: 140px;
}
.donut-svg { width: 100%; height: auto; }
.donut-legend { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.donut-legend-row {
  display: grid;
  grid-template-columns: 10px 72px 1fr 28px 36px;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-regular);
}
.legend-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
.legend-label { font-size: 12px; color: var(--text-regular); }
.legend-bar-wrap { height: 6px; background: #f0f2f5; border-radius: 3px; overflow: hidden; }
.legend-bar { display: block; height: 100%; border-radius: 3px; }
.legend-count { font-weight: 700; color: var(--text-main); text-align: right; }
.legend-pct { color: var(--text-sub); font-size: 11px; text-align: right; }

/* ── 月度趋势折线图 ── */
.trend-legend-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-sub);
  font-weight: 400;
  margin-left: auto;
}
.trend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.trend-chart { padding: 4px 0 0; }
.trend-svg { width: 100%; height: 80px; display: block; overflow: visible; }
.trend-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 11px;
  color: var(--text-sub);
}

/* ── 节点卡点 ── */
.bottleneck-list { display: flex; flex-direction: column; gap: 10px; }
.bottleneck-row {
  display: grid;
  grid-template-columns: 110px 1fr 90px;
  align-items: center;
  gap: 10px;
}
.bn-node { font-size: 13px; color: var(--text-regular); }
.bn-bar-wrap { height: 8px; background: #f0f2f5; border-radius: 4px; overflow: hidden; }
.bn-bar { height: 100%; border-radius: 4px; transition: width 0.4s; }
.bn-stats { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }
.bn-days { font-size: 13px; font-weight: 700; }
.bn-risk { font-size: 11px; color: var(--text-sub); }
.bn-trend { font-size: 13px; font-weight: 700; }
.text-danger  { color: #f53f3f; }
.text-warning { color: #ff7d00; }
.text-primary { color: var(--primary-color); }
.trend--up     { color: #f53f3f; }
.trend--down   { color: #00b479; }
.trend--stable { color: var(--text-sub); }

/* ── 人员承载 ── */
.staff-list { display: flex; flex-direction: column; gap: 10px; }
.staff-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fafbfd;
  border: 1px solid transparent;
  transition: border-color 0.15s;
}
.staff-item:hover { border-color: rgba(59,102,245,0.12); }
.staff-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.staff-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.avatar--heavy  { background: linear-gradient(135deg, #f53f3f, #ff7d7d); }
.avatar--normal { background: linear-gradient(135deg, #00b479, #34d49e); }
.avatar--light  { background: linear-gradient(135deg, #3b66f5, #6187fa); }
.staff-info { flex: 1; min-width: 0; }
.staff-name-row { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; }
.staff-name { font-size: 13px; font-weight: 600; color: var(--text-main); }
.staff-role-tag {
  font-size: 10px;
  color: var(--text-sub);
  background: rgba(0,0,0,0.04);
  padding: 1px 6px;
  border-radius: 10px;
}
.staff-bar-area { display: flex; align-items: center; gap: 8px; }
.staff-bar-track {
  flex: 1;
  height: 6px;
  background: #edf0f7;
  border-radius: 3px;
  overflow: hidden;
}
.staff-bar-fill { height: 100%; border-radius: 3px; transition: width 0.4s; }
.staff-bar-label { font-size: 11px; color: var(--text-sub); flex-shrink: 0; white-space: nowrap; }
.staff-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
.staff-nums { display: flex; gap: 8px; }
.num-item { font-size: 12px; font-weight: 700; color: var(--text-main); display: flex; flex-direction: column; align-items: center; }
.num-item em { font-style: normal; font-size: 10px; font-weight: 400; color: var(--text-sub); }
.load-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
}
.load--heavy  { background: rgba(245,63,63,0.1); color: #f53f3f; }
.load--normal { background: rgba(0,180,121,0.1); color: #00b479; }
.load--light  { background: rgba(59,102,245,0.08); color: var(--primary-color); }

/* ── AI 建议 ── */
.advice-list { display: flex; flex-direction: column; gap: 8px; }
.advice-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: var(--text-regular);
  line-height: 1.6;
  padding: 10px 12px;
  border-radius: 8px;
}
.advice--danger  { background: rgba(245,63,63,0.04); }
.advice--warning { background: rgba(255,125,0,0.04); }
.advice--info    { background: rgba(59,102,245,0.04); }
.advice-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.dot-color--danger  { background: #f53f3f; }
.dot-color--warning { background: #ff7d00; }
.dot-color--info    { background: #3b66f5; }

/* ── 风险案件 ── */
.risk-list { display: flex; flex-direction: column; gap: 8px; }
.risk-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 10px;
  border-left: 3px solid #e0e0e0;
  background: #fafbfd;
}
.risk-row--danger  { border-left-color: #f53f3f; background: rgba(245,63,63,0.02); }
.risk-row--warning { border-left-color: #ff7d00; }
.risk-caseno { font-size: 13px; font-weight: 600; color: var(--text-main); margin-bottom: 2px; }
.risk-meta   { font-size: 12px; color: var(--text-sub); margin-bottom: 4px; }
.risk-reason { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-regular); }
.risk-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 20px;
  flex-shrink: 0;
}
.risk-tag--danger  { background: rgba(245,63,63,0.1); color: #f53f3f; }
.risk-tag--warning { background: rgba(255,125,0,0.1); color: #ff7d00; }
.risk-secretary { font-size: 12px; color: var(--text-sub); flex-shrink: 0; padding-left: 10px; }

/* ── 近期动态 ── */
.activity-list { display: flex; flex-direction: column; gap: 10px; }
.activity-row { display: flex; gap: 10px; align-items: flex-start; }
.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}
.dot--success { background: #00b479; }
.dot--danger  { background: #f53f3f; }
.dot--warning { background: #ff7d00; }
.dot--info    { background: #3b66f5; }
.activity-text { font-size: 13px; color: var(--text-regular); line-height: 1.5; }
.activity-time { font-size: 11px; color: var(--text-sub); margin-top: 2px; }
</style>
