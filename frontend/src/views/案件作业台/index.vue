<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  caseBaseInfo,
  leftViews,
  overviewCards,
  summaryText,
  highlights,
  latestActivities,
  flowTodos,
  workTodos,
  sideAlerts,
} from './mock'
import DocWriterView from './components/DocWriterView.vue'
import DocReviewView from './components/DocReviewView.vue'
import DossierReadingView from './components/DossierReadingView.vue'

const route = useRoute()
const router = useRouter()

// 从路由参数读取案件ID（演示用，固定对应mock数据）
const caseId = computed(() => route.query.id || 'GZ-2026-5412')

const activeView = ref('overview')
const todoTab = ref('flow')

const currentTodos = computed(() => (todoTab.value === 'flow' ? flowTodos : workTodos))

const backToWorkbench = () => {
  router.push('/workbench')
}
</script>

<template>
  <div class="case-workbench">

    <!-- 顶部案件信息头部带 -->
    <div class="case-header-band">
      <div class="case-header-left">
        <button class="back-btn" @click="backToWorkbench">← 返回工作台</button>
        <div class="case-header-no">{{ caseBaseInfo.caseNo }}</div>
        <el-tag type="primary" size="small" effect="plain">{{ caseBaseInfo.caseType }}</el-tag>
      </div>
      <div class="case-header-right">
        <div class="header-info-item">
          <span class="info-label">申请人</span>
          <span class="info-value">{{ caseBaseInfo.applicant }}</span>
        </div>
        <span class="vs-sep">诉</span>
        <div class="header-info-item">
          <span class="info-label">被申请人</span>
          <span class="info-value">{{ caseBaseInfo.respondent }}</span>
        </div>
        <div class="header-divider"></div>
        <div class="header-info-item">
          <span class="info-label">争议金额</span>
          <span class="info-value info-value--amount">¥ {{ caseBaseInfo.claimAmount }}</span>
        </div>
        <div class="header-info-item">
          <span class="info-label">当前节点</span>
          <span class="info-value">{{ caseBaseInfo.currentNode }}</span>
        </div>
      </div>
    </div>

    <!-- 三栏主体 -->
    <div class="workbench-body" :class="{ 'workbench-body--wide': activeView === 'writing' || activeView === 'reading' || activeView === 'dossier' }">

      <!-- 左侧：案件导航 -->
      <aside class="case-left" v-if="activeView !== 'writing' && activeView !== 'reading' && activeView !== 'dossier'">
        <div class="left-section-label">案件视图</div>
        <nav class="case-view-nav">
          <button
            v-for="item in leftViews"
            :key="item.key"
            class="nav-item"
            :class="{ 'nav-item--active': activeView === item.key }"
            @click="activeView = item.key"
          >
            <span class="nav-item-dot"></span>
            {{ item.label }}
          </button>
        </nav>
      </aside>

      <!-- 智能阅卷视图（全宽独立渲染） -->
      <template v-if="activeView === 'dossier'">
        <div class="wide-view-nav">
          <nav class="case-view-nav case-view-nav--inline">
            <button
              v-for="item in leftViews"
              :key="item.key"
              class="nav-item"
              :class="{ 'nav-item--active': activeView === item.key }"
              @click="activeView = item.key"
            >
              <span class="nav-item-dot"></span>
              {{ item.label }}
            </button>
          </nav>
        </div>
        <DossierReadingView class="wide-view-content" />
      </template>

      <!-- 文书写作视图（全宽独立渲染） -->
      <template v-else-if="activeView === 'writing'">
        <div class="wide-view-nav">
          <nav class="case-view-nav case-view-nav--inline">
            <button
              v-for="item in leftViews"
              :key="item.key"
              class="nav-item"
              :class="{ 'nav-item--active': activeView === item.key }"
              @click="activeView = item.key"
            >
              <span class="nav-item-dot"></span>
              {{ item.label }}
            </button>
          </nav>
        </div>
        <DocWriterView class="wide-view-content" />
      </template>

      <!-- 文书审核视图（全宽独立渲染） -->
      <template v-else-if="activeView === 'reading'">
        <div class="wide-view-nav">
          <nav class="case-view-nav case-view-nav--inline">
            <button
              v-for="item in leftViews"
              :key="item.key"
              class="nav-item"
              :class="{ 'nav-item--active': activeView === item.key }"
              @click="activeView = item.key"
            >
              <span class="nav-item-dot"></span>
              {{ item.label }}
            </button>
          </nav>
        </div>
        <DocReviewView class="wide-view-content" />
      </template>

      <!-- 中间：主工作区（普通视图） -->
      <section class="case-main" v-else>

        <!-- ===== 总览视图 ===== -->
        <template v-if="activeView === 'overview'">

          <!-- AI 首屏摘要卡 - 核心高亮展示区 -->
          <div class="ai-summary-card">
            <div class="ai-summary-header">
              <div class="ai-summary-badge">
                <span class="ai-icon-dot"></span>
                AI 案情摘要
              </div>
              <span class="ai-summary-tip">自动生成 · 仅供参考</span>
            </div>
            <div class="ai-summary-text">{{ summaryText }}</div>
          </div>

          <!-- 案件基础信息卡 -->
          <div class="overview-info-row">
            <div
              v-for="card in overviewCards"
              :key="card.label"
              class="overview-info-card"
              :class="`info-card--${card.type}`"
            >
              <div class="info-card-label">{{ card.label }}</div>
              <div class="info-card-value">{{ card.value }}</div>
            </div>
          </div>

          <!-- 当前关键提醒 -->
          <div class="content-section">
            <div class="section-title-row">
              <span class="title-accent title-accent--warn"></span>
              当前关键提醒
            </div>
            <div class="highlight-list">
              <div
                v-for="(item, i) in highlights"
                :key="i"
                class="highlight-item"
              >
                <span class="highlight-bullet"></span>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>

          <!-- 最近关键动态 -->
          <div class="content-section">
            <div class="section-title-row">
              <span class="title-accent"></span>
              最近关键动态
            </div>
            <div class="activity-list">
              <div
                v-for="item in latestActivities"
                :key="item.time"
                class="activity-item"
              >
                <div class="activity-time">{{ item.time }}</div>
                <div class="activity-text">{{ item.text }}</div>
              </div>
            </div>
          </div>

        </template>

      </section>

      <!-- 右侧：待办 + 提醒 + AI要点 -->
      <aside class="case-right" v-if="activeView !== 'writing' && activeView !== 'reading' && activeView !== 'dossier'">

        <!-- 当前待办 -->
        <div class="right-block">
          <div class="right-block-title">当前待办</div>
          <div class="todo-tab-row">
            <button
              class="todo-tab"
              :class="{ 'todo-tab--active': todoTab === 'flow' }"
              @click="todoTab = 'flow'"
            >流程待办</button>
            <button
              class="todo-tab"
              :class="{ 'todo-tab--active': todoTab === 'work' }"
              @click="todoTab = 'work'"
            >工作待办</button>
          </div>
          <div class="right-todo-list">
            <div
              v-for="item in currentTodos"
              :key="item.id"
              class="right-todo-item"
              :class="item.dueSoon ? 'right-todo-item--soon' : ''"
            >
              <div class="rtodo-left">
                <div class="rtodo-title">{{ item.title }}</div>
                <div class="rtodo-due" :class="item.dueSoon ? 'rtodo-due--red' : ''">
                  {{ item.due }}
                </div>
              </div>
              <el-tag :type="item.priorityType" size="small" effect="light">{{ item.priority }}</el-tag>
            </div>
          </div>
        </div>

        <!-- AI 智能提醒 -->
        <div class="right-block right-block--ai">
          <div class="right-block-title right-block-title--ai ai-merged-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><circle cx="19" cy="5" r="3" fill="currentColor" stroke="none"/></svg>
            AI 智能提醒
          </div>
          <div class="alert-list">
            <div
              v-for="(item, i) in sideAlerts"
              :key="i"
              class="alert-row"
              :class="`alert-row--${item.level}`"
            >
              <span class="alert-dot" :class="`alert-dot--${item.level}`"></span>
              <span>{{ item.text }}</span>
            </div>
          </div>
        </div>

      </aside>
    </div>


  </div>
</template>

<style scoped>
/* ===================== 整体布局 ===================== */
.case-workbench {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

/* ===================== 案件头部带 ===================== */
.case-header-band {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(59, 102, 245, 0.06);
  flex-wrap: wrap;
}

.case-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.back-btn {
  padding: 5px 12px;
  border: 1px solid rgba(229, 230, 235, 0.8);
  border-radius: 8px;
  background: transparent;
  color: var(--text-regular);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.back-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.case-header-no {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
}

.case-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.header-info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 11px;
  color: var(--text-sub);
}

.info-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  white-space: nowrap;
}

.info-value--amount {
  color: #f53f3f;
  font-weight: 700;
}

.vs-sep {
  font-size: 12px;
  color: var(--text-sub);
  font-weight: 500;
  padding: 0 4px;
  align-self: flex-end;
  margin-bottom: 2px;
}

.header-divider {
  width: 1px;
  height: 32px;
  background: rgba(229, 230, 235, 0.7);
}

/* ===================== 三栏布局 ===================== */
.workbench-body {
  display: grid;
  grid-template-columns: 196px minmax(0, 1fr) 258px;
  gap: 14px;
}

/* 文书写作 / 智能阅卷 全宽模式 */
.workbench-body--wide {
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 14px;
  flex: 1;
  min-height: 0;
}

/* 宽视图导航列 */
.wide-view-nav {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 14px;
  padding: 18px 14px;
  height: fit-content;
  position: sticky;
  top: 0;
}

.case-view-nav--inline {
  flex-direction: column;
  gap: 4px;
  display: flex;
}

.wide-view-content {
  min-height: 0;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.65);
}

/* ===================== 左侧导航 ===================== */
.case-left {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 14px;
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 0;
  height: fit-content;
  position: sticky;
  top: 0;
}

.left-section-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-sub);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 10px;
  padding: 0 4px;
}

.case-view-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--text-regular);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(59, 102, 245, 0.06);
  color: var(--primary-color);
}

.nav-item--active {
  background: rgba(59, 102, 245, 0.1);
  color: var(--primary-color);
  font-weight: 600;
}

.nav-item-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.5;
  flex-shrink: 0;
}

.nav-item--active .nav-item-dot {
  opacity: 1;
}

.left-divider {
  height: 1px;
  background: rgba(229, 230, 235, 0.5);
  margin: 14px 0;
}

.left-case-stat {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-sub);
}

.stat-deadline {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-color);
}

.deadline--danger {
  color: #f53f3f;
}

.stat-val {
  font-size: 12px;
  color: var(--text-regular);
}

/* ===================== 中间主工作区 ===================== */
.case-main {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 14px;
  padding: 22px 24px;
  overflow-y: auto;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.case-main::-webkit-scrollbar { display: none; }

/* AI 摘要卡 */
.ai-summary-card {
  background: linear-gradient(135deg, #2c52d8 0%, #5a7cf0 50%, #7b9cff 100%);
  border-radius: 14px;
  padding: 22px 24px;
  color: #fff;
  box-shadow: 0 8px 32px rgba(59, 102, 245, 0.28);
  position: relative;
  overflow: hidden;
}

.ai-summary-card::before {
  content: '';
  position: absolute;
  top: -40px;
  right: -40px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.ai-summary-card::after {
  content: '';
  position: absolute;
  bottom: -30px;
  left: 40px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
}

.ai-summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
  z-index: 1;
}

.ai-summary-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.ai-icon-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7effc5;
  box-shadow: 0 0 6px rgba(126, 255, 197, 0.6);
}

.ai-summary-tip {
  font-size: 12px;
  opacity: 0.65;
}

.ai-summary-text {
  font-size: 14px;
  line-height: 1.8;
  opacity: 0.95;
  position: relative;
  z-index: 1;
}

/* 总览信息卡 */
.overview-info-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.overview-info-card {
  border: 1px solid rgba(229, 230, 235, 0.7);
  border-radius: 10px;
  padding: 14px 16px;
  background: #fff;
}

.info-card--deadline {
  border-color: rgba(245, 63, 63, 0.2);
  background: rgba(255, 249, 249, 0.8);
}

.info-card-label {
  font-size: 12px;
  color: var(--text-sub);
  margin-bottom: 6px;
}

.info-card-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
}

.info-card--deadline .info-card-value {
  color: #f53f3f;
}

/* 通用内容区块 */
.content-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
}

.title-accent {
  display: block;
  width: 3px;
  height: 15px;
  background: linear-gradient(180deg, #3b66f5, #6187fa);
  border-radius: 2px;
}

.title-accent--warn {
  background: linear-gradient(180deg, #ff4d4f, #ff7875);
}

/* 关键提醒 */
.highlight-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: var(--text-regular);
  line-height: 1.6;
  padding: 10px 14px;
  background: rgba(255, 77, 79, 0.04);
  border: 1px solid rgba(255, 77, 79, 0.1);
  border-radius: 8px;
  border-left: 3px solid #ff4d4f;
}

.highlight-bullet {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff4d4f;
  margin-top: 6px;
  flex-shrink: 0;
}

/* 最近动态 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.activity-item {
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px dashed rgba(229, 230, 235, 0.6);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-time {
  font-size: 12px;
  color: var(--text-sub);
}

.activity-text {
  font-size: 14px;
  color: var(--text-regular);
  line-height: 1.6;
}

/* 时间线 */
.view-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-title-sub {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-sub);
}

.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 14px;
}

.tl-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
}

.tl-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot--blue-glow {
  background: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(59, 102, 245, 0.15);
}

.dot--green { background: #00b479; }
.dot--orange { background: #ff7d00; }
.dot--primary { background: #3b66f5; }
.dot--gray { background: #c9cdd4; }
.dot--purple { background: #722ed1; }

.tl-line {
  width: 2px;
  flex: 1;
  background: rgba(229, 230, 235, 0.8);
  margin: 6px 0;
  min-height: 20px;
}

.tl-card {
  border: 1px solid rgba(229, 230, 235, 0.7);
  border-radius: 10px;
  padding: 14px 16px;
  background: #fff;
  margin-bottom: 12px;
}

.tl-date {
  font-size: 12px;
  color: var(--text-sub);
  margin-bottom: 4px;
}

.tl-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
}

.tl-desc {
  font-size: 13px;
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 10px;
}

.tl-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tl-source {
  font-size: 12px;
  color: var(--text-sub);
  background: rgba(59, 102, 245, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(59, 102, 245, 0.12);
}

/* 争议焦点 */
.focus-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.focus-card {
  border: 1px solid rgba(229, 230, 235, 0.7);
  border-radius: 12px;
  padding: 18px 20px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.focus-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.focus-id {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-sub);
  background: rgba(59, 102, 245, 0.07);
  padding: 2px 8px;
  border-radius: 4px;
}

.focus-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  flex: 1;
}

.focus-status-badges {
  display: flex;
  gap: 6px;
  align-items: center;
}

.risk-chip {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid currentColor;
  font-weight: 500;
}

.focus-desc {
  font-size: 14px;
  color: var(--text-regular);
  line-height: 1.7;
}

.focus-risk-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #ff7d00;
  background: rgba(255, 125, 0, 0.06);
  border: 1px solid rgba(255, 125, 0, 0.15);
  border-radius: 6px;
  padding: 8px 12px;
}

.risk-icon {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff7d00;
  margin-top: 5px;
  flex-shrink: 0;
}

.focus-evidence-area {
  border-top: 1px dashed rgba(229, 230, 235, 0.6);
  padding-top: 12px;
}

.evidence-label {
  font-size: 12px;
  color: var(--text-sub);
  margin-bottom: 8px;
}

.evidence-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.evidence-tag {
  font-size: 12px;
  background: rgba(59, 102, 245, 0.06);
  border: 1px solid rgba(59, 102, 245, 0.14);
  color: var(--primary-color);
  padding: 3px 10px;
  border-radius: 4px;
}

/* 研判记录 */
.analysis-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.analysis-card {
  border: 1px solid rgba(229, 230, 235, 0.7);
  border-radius: 12px;
  padding: 18px 20px;
  background: #fff;
}

.analysis-card--ai {
  background: rgba(59, 102, 245, 0.02);
  border-color: rgba(59, 102, 245, 0.15);
}

.analysis-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.analysis-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
}

.analysis-content {
  font-size: 14px;
  color: var(--text-regular);
  line-height: 1.8;
  margin-bottom: 10px;
}

.analysis-meta {
  font-size: 12px;
  color: var(--text-sub);
}

/* 协同动态 */
.collab-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.collab-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.collab-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.avatar--blue { background: linear-gradient(135deg, #3b66f5, #6187fa); }
.avatar--green { background: linear-gradient(135deg, #00b479, #36cfc9); }
.avatar--gray { background: linear-gradient(135deg, #8492a6, #a0aec0); }

.collab-body {
  flex: 1;
  background: #fff;
  border: 1px solid rgba(229, 230, 235, 0.7);
  border-radius: 10px;
  padding: 12px 14px;
}

.collab-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
}

.collab-text {
  font-size: 14px;
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 8px;
}

.collab-time {
  font-size: 12px;
  color: var(--text-sub);
}

/* ===================== 右侧侧栏 ===================== */
.case-right {
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 0;
  height: fit-content;
}

.right-block {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 12px;
  padding: 16px 16px;
  box-shadow: 0 4px 16px rgba(59, 102, 245, 0.05);
}

.right-block--ai {
  background: linear-gradient(160deg, rgba(59, 102, 245, 0.04) 0%, rgba(255,255,255,0.9) 100%);
  border-color: rgba(59, 102, 245, 0.15);
}

.right-block-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 12px;
}

.right-block-title--ai {
  background: linear-gradient(135deg, #3b66f5, #6187fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ai-merged-title {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ai-merged-title svg {
  color: #3b66f5;
  -webkit-text-fill-color: initial;
}

.ai-merged-sub {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-sub);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
  padding-left: 2px;
  opacity: 0.7;
}

/* 待办标签切换 */
.todo-tab-row {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.todo-tab {
  flex: 1;
  padding: 6px 0;
  border-radius: 7px;
  border: 1px solid rgba(229, 230, 235, 0.8);
  background: transparent;
  font-size: 12px;
  color: var(--text-regular);
  cursor: pointer;
  transition: all 0.2s;
}

.todo-tab--active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #fff;
  font-weight: 600;
}

/* 右侧待办列表 */
.right-todo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.right-todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f9faff;
  border: 1px solid rgba(229, 230, 235, 0.6);
  gap: 8px;
}

.right-todo-item--soon {
  border-left: 3px solid #f53f3f;
  background: rgba(255, 77, 79, 0.03);
}

.rtodo-left {
  flex: 1;
  min-width: 0;
}

.rtodo-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rtodo-due {
  font-size: 11px;
  color: var(--text-sub);
}

.rtodo-due--red {
  color: #f53f3f;
  font-weight: 500;
}

/* 重点提醒 */
.alert-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--text-regular);
  line-height: 1.5;
  padding: 8px 10px;
  border-radius: 7px;
}

.alert-row--danger { background: rgba(245, 63, 63, 0.05); }
.alert-row--warning { background: rgba(255, 125, 0, 0.05); }
.alert-row--info { background: rgba(59, 102, 245, 0.04); }

.alert-dot {
  display: block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

.alert-dot--danger { background: #f53f3f; }
.alert-dot--warning { background: #ff7d00; }
.alert-dot--info { background: #3b66f5; }

/* AI 要点 */
.ai-points-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ai-point-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: var(--text-regular);
  line-height: 1.6;
}

.ai-point-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b66f5, #6187fa);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Drawer 证据清单 */
.drawer-evidence-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 0;
}

.drawer-evidence-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 14px;
  background: #f9faff;
  border: 1px solid rgba(59, 102, 245, 0.1);
  border-radius: 8px;
}

.drawer-ev-num {
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.drawer-ev-text {
  font-size: 14px;
  color: var(--text-regular);
  line-height: 1.6;
}

/* ===================== 响应式 ===================== */
@media (max-width: 1280px) {
  .workbench-body {
    grid-template-columns: 180px minmax(0, 1fr) 230px;
  }
}

@media (max-width: 1100px) {
  .workbench-body {
    grid-template-columns: 1fr;
  }
  .case-left,
  .case-right {
    position: static;
  }
}
</style>
