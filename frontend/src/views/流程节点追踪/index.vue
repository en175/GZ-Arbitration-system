<script setup>
import { useRouter } from 'vue-router'
import { stageColumns, kanbanCases, statsOverview, aiNodeAnalysis } from './mock'

const router = useRouter()

const enterCase = (caseId) => {
  router.push({ path: '/case-workbench', query: { id: caseId } })
}

const totalCases = Object.values(kanbanCases).reduce((sum, arr) => sum + arr.length, 0)
</script>

<template>
  <div class="kanban-page">

    <!-- 顶部统计行 -->
    <div class="stats-row">
      <div
        v-for="stat in statsOverview"
        :key="stat.label"
        class="stat-card"
        :style="{ '--stat-color': stat.color }"
      >
        <div class="stat-value">{{ stat.value }}<span class="stat-unit">{{ stat.unit }}</span></div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>

      <!-- AI 分析区（和统计行同行） -->
      <div class="ai-analysis-inline">
        <div class="ai-analysis-title">
          <span class="ai-dot-green"></span>
          AI 节点分析
        </div>
        <div class="ai-analysis-tips">
          <span
            v-for="(tip, i) in aiNodeAnalysis"
            :key="i"
            class="ai-tip-inline"
          >{{ tip }}</span>
        </div>
      </div>
    </div>

    <!-- 看板主体（按节点阶段分列） -->
    <div class="kanban-board">
      <div
        v-for="stage in stageColumns"
        :key="stage.key"
        class="kanban-col"
        :style="{ '--col-color': stage.color, '--col-bg': stage.bgColor }"
      >
        <!-- 列标题 -->
        <div class="col-header">
          <div class="col-dot" :style="{ background: stage.color }"></div>
          <div class="col-title">{{ stage.label }}</div>
          <div class="col-count">{{ (kanbanCases[stage.key] || []).length }}</div>
        </div>

        <!-- 该阶段的案件卡片 -->
        <div class="col-cards">
          <div
            v-for="c in (kanbanCases[stage.key] || [])"
            :key="c.id"
            class="kanban-card"
            :class="`kanban-card--${c.priority}`"
            @click="enterCase(c.id)"
          >
            <!-- 优先级左侧色条 -->
            <div class="card-priority-bar" :class="`cpbar--${c.priority}`"></div>

            <div class="card-body">
              <div class="card-case-no">{{ c.caseNo }}</div>
              <div class="card-parties">{{ c.parties }}</div>
              <div class="card-node-row">
                <span class="card-node">{{ c.node }}</span>
                <span
                  v-if="c.issues > 0"
                  class="card-issues"
                >{{ c.issues }}项问题</span>
              </div>
              <div v-if="c.issueDesc" class="card-issue-desc">{{ c.issueDesc }}</div>
              <div class="card-footer">
                <span class="card-due" :class="c.priority === 'urgent' ? 'due--red' : c.priority === 'high' ? 'due--orange' : ''">
                  {{ c.due }}
                </span>
                <span class="card-enter">进入 →</span>
              </div>
            </div>
          </div>

          <!-- 空列占位 -->
          <div v-if="!(kanbanCases[stage.key] || []).length" class="col-empty">
            暂无案件
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ===================== 页面 ===================== */
.kanban-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ===================== 顶部统计行 ===================== */
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
  bottom: 0;
  left: 0;
  right: 0;
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

/* AI 分析（行内卡片，占剩余空间） */
.ai-analysis-inline {
  flex: 1;
  background: linear-gradient(135deg, rgba(59, 102, 245, 0.05) 0%, rgba(255,255,255,0.9) 100%);
  border: 1px solid rgba(59, 102, 245, 0.15);
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-analysis-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-color);
}

.ai-dot-green {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00b479;
  box-shadow: 0 0 0 3px rgba(0, 180, 121, 0.2);
}

.ai-analysis-tips {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ai-tip-inline {
  font-size: 13px;
  color: var(--text-regular);
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.ai-tip-inline::before {
  content: '·';
  color: var(--primary-color);
  font-weight: 700;
  flex-shrink: 0;
}

/* ===================== 看板主体 ===================== */
.kanban-board {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  align-items: start;
}

/* ===================== 列 ===================== */
.kanban-col {
  background: var(--col-bg);
  border: 1px solid rgba(229, 230, 235, 0.5);
  border-top: 3px solid var(--col-color);
  border-radius: 12px;
  overflow: hidden;
}

.col-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px 10px;
  border-bottom: 1px solid rgba(229, 230, 235, 0.4);
}

.col-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.col-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
  flex: 1;
}

.col-count {
  font-size: 12px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(229, 230, 235, 0.6);
  border-radius: 20px;
  padding: 1px 8px;
  color: var(--text-regular);
}

.col-cards {
  padding: 10px 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ===================== 卡片 ===================== */
.kanban-card {
  background: #fff;
  border: 1px solid rgba(229, 230, 235, 0.7);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  overflow: hidden;
}

.kanban-card:hover {
  box-shadow: 0 4px 14px rgba(59, 102, 245, 0.1);
  transform: translateY(-2px);
}

/* 左侧优先级色条 */
.card-priority-bar {
  width: 3px;
  flex-shrink: 0;
}

.cpbar--urgent { background: #f53f3f; }
.cpbar--high { background: #ff7d00; }
.cpbar--normal { background: #3b66f5; }
.cpbar--low { background: #c9cdd4; }

.card-body {
  flex: 1;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.card-case-no {
  font-size: 11px;
  color: var(--primary-color);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-parties {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-node-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-node {
  font-size: 12px;
  color: var(--text-sub);
  background: rgba(59, 102, 245, 0.06);
  padding: 2px 7px;
  border-radius: 4px;
}

.card-issues {
  font-size: 11px;
  color: #ff7d00;
  background: rgba(255, 125, 0, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 125, 0, 0.15);
}

.card-issue-desc {
  font-size: 12px;
  color: #ff7d00;
  line-height: 1.4;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.card-due {
  font-size: 11px;
  color: var(--text-sub);
  font-weight: 500;
}

.due--red { color: #f53f3f; }
.due--orange { color: #ff7d00; }

.card-enter {
  font-size: 11px;
  color: var(--primary-color);
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.2s;
}

.kanban-card:hover .card-enter {
  opacity: 1;
}

.col-empty {
  text-align: center;
  font-size: 13px;
  color: var(--text-sub);
  padding: 20px 0;
}

/* 响应式 */
@media (max-width: 1280px) {
  .kanban-board {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
