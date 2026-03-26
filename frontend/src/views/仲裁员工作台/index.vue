<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ── 顶部统计 ───────────────────────────────────────────
const stats = [
  { label: '待阅卷确认', value: 3, unit: '件', level: 'danger', icon: 'eye' },
  { label: '待确认争议焦点', value: 2, unit: '件', level: 'warning', icon: 'focus' },
  { label: '本周庭审', value: 4, unit: '场', level: 'primary', icon: 'gavel' },
  { label: '临期待处理', value: 1, unit: '件', level: 'danger', icon: 'clock' },
]

// ── AI 今日摘要 ────────────────────────────────────────
const aiSummary = '您今日有 3 件案件需阅卷确认，其中 5412 号案证据交换节点临期（距截止 2 天），焦点 F-01 证据链存在缺口，建议优先跟进。本周共有 4 场庭审，最近一场为 4 月 15 日上午（5412 号案），庭审材料已准备就绪，建议今日完成预阅。另有 1 件案件待确认补正意见，可在审批待办中处理。'

// ── 待处理事项 ─────────────────────────────────────────
const pendingItems = [
  {
    id: 'P-01',
    caseNo: '（2026）粤仲案字第5412号',
    type: '争议焦点确认',
    desc: 'AI 已归纳 3 项争议焦点候选，待仲裁员审核确认后推进证据交换节点',
    priority: 'high',
    deadline: '今日 18:00',
    tag: '焦点确认',
  },
  {
    id: 'P-02',
    caseNo: '（2026）粤仲案字第2831号',
    type: '阅卷意见批复',
    desc: '办案秘书提交阅卷意见草稿，请仲裁员审核并回复研判意见',
    priority: 'high',
    deadline: '明日 10:00',
    tag: '阅卷审核',
  },
  {
    id: 'P-03',
    caseNo: '（2026）粤仲案字第4017号',
    type: '补正材料审核',
    desc: '申请人提交补正材料（第二次），请仲裁员确认材料是否满足庭审要求',
    priority: 'normal',
    deadline: '本周五',
    tag: '材料审核',
  },
  {
    id: 'P-04',
    caseNo: '（2026）粤仲案字第1905号',
    type: '裁决书初稿审核',
    desc: '办案秘书已完成裁决书初稿（v2），请仲裁员审阅并提出修改意见',
    priority: 'normal',
    deadline: '下周一',
    tag: '文书审核',
  },
]

// ── 我的案件 ──────────────────────────────────────────
const caseTabActive = ref('active')
const caseTabs = [
  { key: 'active', label: '在办案件' },
  { key: 'hearing', label: '本周庭审' },
  { key: 'review', label: '待我确认' },
]

const allCases = [
  {
    id: 'C-5412',
    caseNo: '（2026）粤仲案字第5412号',
    type: '买卖合同纠纷',
    stage: '证据交换',
    node: '证据核验',
    secretary: '陈炜',
    amount: '82,957.70',
    deadline: '2026-03-27',
    urgent: true,
    focus: 3,
    tab: ['active', 'review'],
  },
  {
    id: 'C-2831',
    caseNo: '（2026）粤仲案字第2831号',
    type: '建设工程合同纠纷',
    stage: '庭审准备',
    node: '阅卷意见回复',
    secretary: '刘晓燕',
    amount: '1,280,000.00',
    deadline: '2026-04-02',
    urgent: false,
    focus: 5,
    tab: ['active', 'hearing', 'review'],
  },
  {
    id: 'C-4017',
    caseNo: '（2026）粤仲案字第4017号',
    type: '股权转让纠纷',
    stage: '证据交换',
    node: '补正材料审核',
    secretary: '王海涛',
    amount: '3,500,000.00',
    deadline: '2026-04-05',
    urgent: false,
    focus: 4,
    tab: ['active'],
  },
  {
    id: 'C-1905',
    caseNo: '（2026）粤仲案字第1905号',
    type: '货运代理合同纠纷',
    stage: '裁决阶段',
    node: '裁决书审核',
    secretary: '陈炜',
    amount: '428,600.00',
    deadline: '2026-04-10',
    urgent: false,
    focus: 2,
    tab: ['active', 'review'],
  },
  {
    id: 'C-3388',
    caseNo: '（2026）粤仲案字第3388号',
    type: '劳动争议（特别程序）',
    stage: '庭审准备',
    node: '庭前材料汇总',
    secretary: '刘晓燕',
    amount: '96,500.00',
    deadline: '2026-04-15',
    urgent: false,
    focus: 2,
    tab: ['active', 'hearing'],
  },
  {
    id: 'C-0612',
    caseNo: '（2026）粤仲案字第0612号',
    type: '服务合同纠纷',
    stage: '庭审准备',
    node: '庭审笔录整理',
    secretary: '王海涛',
    amount: '210,000.00',
    deadline: '2026-04-15',
    urgent: false,
    focus: 3,
    tab: ['active', 'hearing'],
  },
]

const filteredCases = computed(() =>
  allCases.filter(c => c.tab.includes(caseTabActive.value))
)

// ── 近期庭审安排 ───────────────────────────────────────
const hearings = [
  { date: '2026-04-15', time: '09:30', caseNo: '（2026）粤仲案字第5412号', type: '买卖合同纠纷', room: '第三庭审室', ready: true },
  { date: '2026-04-15', time: '14:00', caseNo: '（2026）粤仲案字第3388号', type: '劳动争议', room: '第一庭审室', ready: false },
  { date: '2026-04-17', time: '10:00', caseNo: '（2026）粤仲案字第2831号', type: '建设工程合同纠纷', room: '第二庭审室', ready: false },
  { date: '2026-04-18', time: '09:30', caseNo: '（2026）粤仲案字第0612号', type: '服务合同纠纷', room: '第三庭审室', ready: false },
]

// ── AI 阅卷建议 ────────────────────────────────────────
const aiRecommendations = [
  {
    caseNo: '（2026）粤仲案字第5412号',
    points: [
      '焦点 F-01「违约责任」证据链存在缺口，送达凭证未完整提交，建议庭前催收',
      '质量异议函时效临界（第7日），答辩书与出库记录存在明显矛盾，可作为关键突破口',
      '缺席审理程序已完备，建议庭审重点集中在货款支付事实及逾期利息起算节点',
    ]
  },
  {
    caseNo: '（2026）粤仲案字第2831号',
    points: [
      '工程款项争议金额较大（128万），建议重点审查工程量核实与结算依据',
      '双方对完工节点时间认定存在 45 天偏差，时间线证据链需在庭前厘清',
    ]
  },
]

const goToCase = (caseId) => {
  router.push({ path: '/case-workbench', query: { id: caseId } })
}

const priorityClass = (p) => p === 'high' ? 'priority--high' : 'priority--normal'
</script>

<template>
  <div class="arb-workbench">

    <!-- 顶部欢迎栏 -->
    <div class="page-header">
      <div class="stat-cards">
        <div v-for="s in stats" :key="s.label" class="stat-card" :class="`stat-card--${s.level}`">
          <div class="stat-value">{{ s.value }}<span class="stat-unit">{{ s.unit }}</span></div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <!-- AI 今日摘要 -->
    <div class="ai-summary-bar">
      <div class="ai-summary-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        AI 今日工作摘要
      </div>
      <div class="ai-summary-text">{{ aiSummary }}</div>
    </div>

    <!-- 主内容区 -->
    <div class="arb-main">

      <!-- 左列：待处理事项 + AI 阅卷建议 -->
      <div class="arb-left">

        <!-- 待处理事项 -->
        <div class="panel">
          <div class="panel-title">
            <span>待处理事项</span>
            <span class="panel-badge danger">{{ pendingItems.filter(p=>p.priority==='high').length }} 项紧急</span>
          </div>
          <div class="pending-list">
            <div v-for="item in pendingItems" :key="item.id" class="pending-item" :class="priorityClass(item.priority)">
              <div class="pending-top">
                <span class="pending-tag">{{ item.tag }}</span>
                <span class="pending-deadline" :class="item.priority === 'high' ? 'text-danger' : 'text-sub'">{{ item.deadline }}</span>
              </div>
              <div class="pending-caseno">{{ item.caseNo }}</div>
              <div class="pending-desc">{{ item.desc }}</div>
              <div class="pending-actions">
                <button class="wb-btn wb-btn-primary" @click="goToCase(item.id)">进入案件</button>
              </div>
            </div>
          </div>
        </div>

        <!-- AI 阅卷建议 -->
        <div class="panel panel--ai">
          <div class="panel-title panel-title--ai">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            AI 庭前阅卷建议
          </div>
          <div v-for="rec in aiRecommendations" :key="rec.caseNo" class="ai-rec-block">
            <div class="ai-rec-caseno">{{ rec.caseNo }}</div>
            <div v-for="(pt, i) in rec.points" :key="i" class="ai-rec-point">
              <span class="ai-rec-num">{{ i + 1 }}</span>
              <span>{{ pt }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- 右列：我的案件 + 庭审安排 -->
      <div class="arb-right">

        <!-- 我的案件 -->
        <div class="panel">
          <div class="panel-title">
            <span>我的案件</span>
            <div class="case-tabs">
              <button v-for="tab in caseTabs" :key="tab.key"
                class="case-tab" :class="{ active: caseTabActive === tab.key }"
                @click="caseTabActive = tab.key">
                {{ tab.label }}
              </button>
            </div>
          </div>
          <div class="case-list">
            <div v-for="c in filteredCases" :key="c.id" class="case-row" @click="goToCase(c.id)">
              <div class="case-row-left">
                <div class="case-row-no">
                  {{ c.caseNo }}
                  <span v-if="c.urgent" class="urgent-dot"></span>
                </div>
                <div class="case-row-meta">
                  <span class="meta-tag">{{ c.type }}</span>
                  <span class="meta-sep">·</span>
                  <span>{{ c.stage }} / {{ c.node }}</span>
                  <span class="meta-sep">·</span>
                  <span>秘书：{{ c.secretary }}</span>
                </div>
              </div>
              <div class="case-row-right">
                <div class="case-amount">¥ {{ c.amount }}</div>
                <div class="case-focus">焦点 {{ c.focus }} 项</div>
                <div class="case-deadline" :class="c.urgent ? 'text-danger' : 'text-sub'">{{ c.deadline }}</div>
              </div>
            </div>
            <div v-if="filteredCases.length === 0" class="empty-hint">暂无相关案件</div>
          </div>
        </div>

        <!-- 近期庭审安排 -->
        <div class="panel">
          <div class="panel-title">近期庭审安排</div>
          <div class="hearing-list">
            <div v-for="h in hearings" :key="h.caseNo + h.date" class="hearing-row">
              <div class="hearing-date">
                <div class="h-date">{{ h.date.slice(5) }}</div>
                <div class="h-time">{{ h.time }}</div>
              </div>
              <div class="hearing-info">
                <div class="h-caseno">{{ h.caseNo }}</div>
                <div class="h-meta">{{ h.type }} · {{ h.room }}</div>
              </div>
              <div class="hearing-status">
                <span class="h-ready" :class="h.ready ? 'ready--yes' : 'ready--no'">
                  {{ h.ready ? '材料已备' : '待准备' }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.arb-workbench {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow-y: auto;
  padding: 20px 24px;
  box-sizing: border-box;
}

/* ── 顶部 ── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-shrink: 0;
}
.page-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-main);
}
.page-sub {
  font-size: 13px;
  color: var(--text-sub);
  margin-top: 2px;
}
.stat-cards {
  display: flex;
  gap: 12px;
}
.stat-card {
  padding: 12px 18px;
  border-radius: 12px;
  border: 1px solid rgba(59,102,245,0.1);
  background: #fff;
  min-width: 100px;
  text-align: center;
}
.stat-card--danger { border-color: rgba(245,63,63,0.2); background: rgba(245,63,63,0.03); }
.stat-card--warning { border-color: rgba(255,125,0,0.2); background: rgba(255,125,0,0.03); }
.stat-card--primary { border-color: rgba(59,102,245,0.2); background: rgba(59,102,245,0.03); }
.stat-value {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1;
}
.stat-card--danger .stat-value { color: #f53f3f; }
.stat-card--warning .stat-value { color: #ff7d00; }
.stat-card--primary .stat-value { color: var(--primary-color); }
.stat-unit {
  font-size: 13px;
  font-weight: 500;
  margin-left: 2px;
}
.stat-label {
  font-size: 12px;
  color: var(--text-sub);
  margin-top: 4px;
}

/* ── AI 摘要 ── */
.ai-summary-bar {
  background: linear-gradient(135deg, rgba(59,102,245,0.06) 0%, rgba(97,135,250,0.04) 100%);
  border: 1px solid rgba(59,102,245,0.14);
  border-radius: 12px;
  padding: 14px 18px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex-shrink: 0;
}
.ai-summary-icon {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--primary-color);
  white-space: nowrap;
  flex-shrink: 0;
}
.ai-summary-text {
  font-size: 13px;
  color: var(--text-regular);
  line-height: 1.7;
}

/* ── 主布局 ── */
.arb-main {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 16px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.arb-left, .arb-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
.panel-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  margin-left: auto;
}
.panel-badge.danger {
  background: rgba(245,63,63,0.1);
  color: #f53f3f;
}

/* ── 待处理事项 ── */
.pending-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pending-item {
  padding: 12px 14px;
  border-radius: 10px;
  border-left: 3px solid #e0e0e0;
  background: #fafbfd;
}
.priority--high { border-left-color: #f53f3f; background: rgba(245,63,63,0.02); }
.priority--normal { border-left-color: #3b66f5; }
.pending-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.pending-tag {
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-color);
  background: rgba(59,102,245,0.08);
  padding: 2px 8px;
  border-radius: 20px;
}
.pending-deadline { font-size: 12px; }
.text-danger { color: #f53f3f; font-weight: 600; }
.text-sub { color: var(--text-sub); }
.pending-caseno {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 4px;
}
.pending-desc {
  font-size: 12px;
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 10px;
}
.pending-actions {
  display: flex;
  gap: 8px;
}

/* ── AI 建议 ── */
.ai-rec-block {
  margin-bottom: 14px;
}
.ai-rec-caseno {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-sub);
  margin-bottom: 8px;
  padding-left: 2px;
}
.ai-rec-point {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 6px;
}
.ai-rec-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b66f5, #6187fa);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

/* ── 案件列表 ── */
.case-tabs {
  display: flex;
  gap: 4px;
  margin-left: auto;
}
.case-tab {
  border: none;
  background: transparent;
  font-size: 12px;
  color: var(--text-sub);
  padding: 4px 10px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.15s;
}
.case-tab:hover { background: #f0f4ff; color: var(--primary-color); }
.case-tab.active { background: rgba(59,102,245,0.1); color: var(--primary-color); font-weight: 600; }

.case-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.case-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 10px;
  background: #fafbfd;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
}
.case-row:hover { background: #f0f4ff; border-color: rgba(59,102,245,0.15); }
.case-row-no {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}
.urgent-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f53f3f;
  flex-shrink: 0;
}
.case-row-meta {
  font-size: 12px;
  color: var(--text-sub);
  display: flex;
  align-items: center;
  gap: 4px;
}
.meta-tag {
  background: rgba(59,102,245,0.08);
  color: var(--primary-color);
  padding: 1px 7px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}
.meta-sep { opacity: 0.4; }
.case-row-right {
  text-align: right;
  flex-shrink: 0;
}
.case-amount {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
}
.case-focus {
  font-size: 11px;
  color: var(--text-sub);
  margin-top: 2px;
}
.case-deadline {
  font-size: 12px;
  margin-top: 2px;
}
.empty-hint {
  text-align: center;
  font-size: 13px;
  color: var(--text-sub);
  padding: 24px 0;
}

/* ── 庭审安排 ── */
.hearing-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hearing-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  background: #fafbfd;
  border-radius: 10px;
}
.hearing-date {
  flex-shrink: 0;
  text-align: center;
  min-width: 48px;
}
.h-date {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary-color);
}
.h-time {
  font-size: 12px;
  color: var(--text-sub);
}
.hearing-info { flex: 1; }
.h-caseno {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 2px;
}
.h-meta { font-size: 12px; color: var(--text-sub); }
.h-ready {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  flex-shrink: 0;
}
.ready--yes { background: rgba(0,180,121,0.1); color: #00b479; }
.ready--no { background: rgba(255,125,0,0.1); color: #ff7d00; }
</style>
