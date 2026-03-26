<script setup>
import { ref, computed } from 'vue'
import { filingStats, filingQueue, filterTabs, aiCheckDimensions } from './mock'

const activeFilter = ref('all')
const expandedId = ref(null)

const filteredList = computed(() => {
  if (activeFilter.value === 'all') return filingQueue
  return filingQueue.filter(c => c.status === activeFilter.value)
})

const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

const statusMap = {
  pending:    { label: '待审核',  color: '#722ed1', bg: 'rgba(114,46,209,0.08)' },
  correcting: { label: '补正中',  color: '#ff7d00', bg: 'rgba(255,125,0,0.08)' },
  passed:     { label: '已通过',  color: '#00b479', bg: 'rgba(0,180,121,0.08)' },
}
</script>

<template>
  <div class="filing-page">

    <!-- 顶部统计行 -->
    <div class="stats-row">
      <div
        v-for="stat in filingStats"
        :key="stat.label"
        class="stat-card"
        :style="{ '--stat-color': stat.color }"
      >
        <div class="stat-value">{{ stat.value }}<span class="stat-unit">{{ stat.unit }}</span></div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>

      <!-- AI 核查说明 -->
      <div class="ai-check-intro">
        <div class="ai-check-title">
          <span class="ai-dot"></span>
          AI 材料核查（5项）
        </div>
        <div class="ai-dims">
          <span
            v-for="(dim, i) in aiCheckDimensions"
            :key="i"
            class="ai-dim-tag"
          >{{ dim }}</span>
        </div>
      </div>
    </div>

    <!-- 筛选 Tab -->
    <div class="filter-bar">
      <button
        v-for="tab in filterTabs"
        :key="tab.key"
        class="filter-btn"
        :class="{ 'filter-btn--active': activeFilter === tab.key }"
        @click="activeFilter = tab.key"
      >{{ tab.label }}</button>
    </div>

    <!-- 案件列表 -->
    <div class="queue-list">
      <div
        v-for="item in filteredList"
        :key="item.id"
        class="queue-card"
        :class="{ 'queue-card--expanded': expandedId === item.id }"
      >
        <!-- 卡片主行 -->
        <div class="card-main" @click="toggleExpand(item.id)">

          <!-- 左：紧急标记条 -->
          <div class="urgency-bar" :class="item.urgency === 'high' ? 'ubar--high' : 'ubar--normal'"></div>

          <!-- 中：案件信息 -->
          <div class="card-info">
            <div class="card-top">
              <span class="card-case-no">{{ item.caseNo }}</span>
              <span
                class="card-status"
                :style="{ color: statusMap[item.status].color, background: statusMap[item.status].bg }"
              >{{ statusMap[item.status].label }}</span>
              <span v-if="item.urgency === 'high'" class="card-urgent">紧急</span>
            </div>
            <div class="card-parties">{{ item.parties }}</div>
            <div class="card-meta">
              <span class="meta-type">{{ item.caseType }}</span>
              <span class="meta-amount">争议金额 ¥{{ item.amount }}</span>
              <span class="meta-source">{{ item.source }}</span>
              <span class="meta-time">{{ item.filedAt }} 申请</span>
            </div>
          </div>

          <!-- 右：AI 核查结果 -->
          <div class="card-ai-check">
            <div class="ai-check-bar">
              <div
                class="ai-bar-fill"
                :style="{
                  width: (item.aiCheckPassed / item.aiCheckTotal * 100) + '%',
                  background: item.aiCheckFailed === 0 ? '#00b479' : item.aiCheckFailed >= 3 ? '#f53f3f' : '#ff7d00'
                }"
              ></div>
            </div>
            <div class="ai-check-nums">
              <span class="check-pass">{{ item.aiCheckPassed }}项通过</span>
              <span v-if="item.aiCheckFailed > 0" class="check-fail">{{ item.aiCheckFailed }}项问题</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions" @click.stop>
            <button v-if="item.status === 'pending'" class="action-btn action-btn--primary">确认受理</button>
            <button v-if="item.status === 'pending' && item.aiCheckFailed > 0" class="action-btn action-btn--warn">发补正通知</button>
            <button v-if="item.status === 'correcting'" class="action-btn action-btn--warn">催交材料</button>
            <button v-if="item.status === 'passed'" class="action-btn action-btn--done" disabled>已受理</button>
            <button class="action-btn action-btn--ghost">查看详情</button>
          </div>

          <!-- 展开箭头 -->
          <div class="expand-arrow" :class="{ 'expanded': expandedId === item.id }">›</div>
        </div>

        <!-- 展开详情：AI 问题列表 -->
        <div v-if="expandedId === item.id" class="card-detail">
          <div v-if="item.aiCheckFailed > 0" class="detail-issues">
            <div class="detail-label">AI 发现的问题项：</div>
            <div
              v-for="(issue, idx) in item.aiIssues"
              :key="idx"
              class="issue-item"
            >
              <span class="issue-dot"></span>
              {{ issue }}
            </div>
          </div>
          <div v-else class="detail-all-pass">
            AI 核查全部通过，材料完整，可直接确认受理。
          </div>
          <div v-if="item.correctionDeadline" class="detail-deadline">
            补正截止：{{ item.correctionDeadline }}
          </div>
        </div>
      </div>

      <div v-if="filteredList.length === 0" class="queue-empty">
        暂无{{ filterTabs.find(t => t.key === activeFilter)?.label }}案件
      </div>
    </div>

  </div>
</template>

<style scoped>
.filing-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ===== 统计行 ===== */
.stats-row {
  display: flex;
  gap: 14px;
  align-items: stretch;
}

.stat-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 14px;
  padding: 16px 20px;
  min-width: 120px;
  box-shadow: 0 4px 16px rgba(59, 102, 245, 0.05);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: var(--stat-color);
  border-radius: 0 0 14px 14px;
  opacity: 0.7;
}

.stat-value {
  font-size: 30px;
  font-weight: 800;
  color: var(--stat-color);
  line-height: 1;
  letter-spacing: -0.5px;
}

.stat-unit {
  font-size: 13px;
  font-weight: 500;
  margin-left: 3px;
  color: var(--stat-color);
  opacity: 0.7;
}

.stat-label {
  font-size: 12px;
  color: var(--text-sub);
  margin-top: 6px;
}

/* AI 核查说明 */
.ai-check-intro {
  flex: 1;
  background: linear-gradient(135deg, rgba(59, 102, 245, 0.05) 0%, rgba(255,255,255,0.9) 100%);
  border: 1px solid rgba(59, 102, 245, 0.15);
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ai-check-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-color);
}

.ai-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00b479;
  box-shadow: 0 0 0 3px rgba(0, 180, 121, 0.2);
  flex-shrink: 0;
}

.ai-dims {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ai-dim-tag {
  font-size: 12px;
  color: var(--text-regular);
  background: rgba(59, 102, 245, 0.06);
  border: 1px solid rgba(59, 102, 245, 0.12);
  padding: 3px 9px;
  border-radius: 20px;
}

/* ===== 筛选 Tab ===== */
.filter-bar {
  display: flex;
  gap: 6px;
}

.filter-btn {
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid rgba(229, 230, 235, 0.8);
  background: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  color: var(--text-regular);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: rgba(59, 102, 245, 0.06);
  color: var(--primary-color);
  border-color: rgba(59, 102, 245, 0.2);
}

.filter-btn--active {
  background: linear-gradient(135deg, #3b66f5, #6187fa);
  color: #fff;
  border-color: transparent;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(59, 102, 245, 0.25);
}

/* ===== 队列列表 ===== */
.queue-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.queue-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(229, 230, 235, 0.6);
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.queue-card:hover {
  box-shadow: 0 4px 18px rgba(59, 102, 245, 0.08);
}

.card-main {
  display: flex;
  align-items: center;
  gap: 0;
  cursor: pointer;
  padding-right: 14px;
}

/* 左侧紧急色条 */
.urgency-bar {
  width: 4px;
  align-self: stretch;
  flex-shrink: 0;
  border-radius: 12px 0 0 12px;
}

.ubar--high { background: #f53f3f; }
.ubar--normal { background: #c9cdd4; }

/* 案件信息 */
.card-info {
  flex: 1;
  min-width: 0;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.card-case-no {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-color);
}

.card-status {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.card-urgent {
  font-size: 11px;
  color: #f53f3f;
  background: rgba(245, 63, 63, 0.08);
  padding: 2px 7px;
  border-radius: 10px;
  border: 1px solid rgba(245, 63, 63, 0.15);
}

.card-parties {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-type,
.meta-amount,
.meta-source,
.meta-time {
  font-size: 12px;
  color: var(--text-sub);
}

.meta-amount {
  color: var(--text-regular);
  font-weight: 500;
}

/* AI 核查结果区域 */
.card-ai-check {
  flex-shrink: 0;
  width: 130px;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
}

.ai-check-bar {
  height: 6px;
  background: rgba(229, 230, 235, 0.6);
  border-radius: 3px;
  overflow: hidden;
}

.ai-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.ai-check-nums {
  display: flex;
  gap: 8px;
  font-size: 12px;
}

.check-pass {
  color: #00b479;
  font-weight: 500;
}

.check-fail {
  color: #f53f3f;
  font-weight: 500;
}

/* 操作按钮 */
.card-actions {
  flex-shrink: 0;
  display: flex;
  gap: 7px;
  align-items: center;
  padding: 0 8px;
}

.action-btn {
  padding: 6px 13px;
  border-radius: 7px;
  border: 1px solid transparent;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;
  transition: all 0.18s;
}

.action-btn--primary {
  background: linear-gradient(135deg, #3b66f5, #6187fa);
  color: #fff;
  box-shadow: 0 2px 8px rgba(59, 102, 245, 0.25);
}

.action-btn--primary:hover {
  box-shadow: 0 4px 12px rgba(59, 102, 245, 0.35);
  transform: translateY(-1px);
}

.action-btn--warn {
  background: rgba(255, 125, 0, 0.08);
  color: #ff7d00;
  border-color: rgba(255, 125, 0, 0.2);
}

.action-btn--warn:hover {
  background: rgba(255, 125, 0, 0.14);
}

.action-btn--done {
  background: rgba(0, 180, 121, 0.08);
  color: #00b479;
  border-color: rgba(0, 180, 121, 0.2);
  cursor: default;
}

.action-btn--ghost {
  background: transparent;
  color: var(--text-sub);
  border-color: rgba(229, 230, 235, 0.8);
}

.action-btn--ghost:hover {
  color: var(--primary-color);
  border-color: rgba(59, 102, 245, 0.25);
}

/* 展开箭头 */
.expand-arrow {
  font-size: 18px;
  color: var(--text-sub);
  transition: transform 0.2s;
  user-select: none;
  flex-shrink: 0;
  line-height: 1;
}

.expand-arrow.expanded {
  transform: rotate(90deg);
}

/* 展开详情 */
.card-detail {
  border-top: 1px solid rgba(229, 230, 235, 0.5);
  padding: 12px 20px 14px;
  background: rgba(248, 249, 252, 0.6);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-regular);
  margin-bottom: 2px;
}

.issue-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-regular);
}

.issue-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f53f3f;
  flex-shrink: 0;
}

.detail-all-pass {
  font-size: 13px;
  color: #00b479;
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-all-pass::before {
  content: '✓';
  font-weight: 700;
}

.detail-deadline {
  font-size: 12px;
  color: #ff7d00;
  font-weight: 500;
}

/* 空状态 */
.queue-empty {
  text-align: center;
  padding: 40px 0;
  font-size: 14px;
  color: var(--text-sub);
}
</style>
