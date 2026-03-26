<template>
  <div class="right-panel">
    <div class="panel-header">AI 审查建议与质量评估</div>
    <div class="panel-content analysis-panel-content">

      <!-- 审查要点建议 -->
      <div class="wb-card section-card">
        <div class="section-head">
          <span>审查要点建议</span>
        </div>
        <div class="insight-title">{{ activeInsight.title }}</div>
        <div class="insight-summary">{{ activeInsight.summary }}</div>
        <ul class="tip-list" v-if="activeInsight.tips && activeInsight.tips.length">
          <li v-for="(tip, idx) in activeInsight.tips" :key="idx">{{ tip }}</li>
        </ul>
      </div>

      <!-- 裁决质量评估 -->
      <div class="wb-card section-card">
        <div class="section-head">裁决质量评估</div>
        <div
          v-for="(item, idx) in results"
          :key="idx"
          class="score-card"
        >
          <div class="score-head">
            <div class="score-label">
              <span class="score-dot" :class="item.status === 'success' ? 'dot-success' : 'dot-warning'"></span>
              {{ getLabel(item.metric) }}
            </div>
            <div class="score-value" :style="{ color: item.score >= 90 ? 'var(--success-color)' : '#ff7d00' }">
              {{ item.score }}分
            </div>
          </div>
          <div class="score-desc">{{ item.desc }}</div>
          <div v-if="item.detail" class="score-detail">{{ item.detail }}</div>
          <span class="wb-badge" :class="item.status === 'success' ? 'wb-badge-success' : 'wb-badge-warning'">
            {{ item.status === 'success' ? '符合' : '需关注' }}
          </span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ANALYSIS_METRICS } from './docReviewConfig.js';

const props = defineProps({
  results: { type: Array, default: () => [] },
  activeModuleKey: { type: String, default: '' },
  moduleInsights: { type: Object, default: () => ({}) }
});

const activeInsight = computed(() => props.moduleInsights?.[props.activeModuleKey] || {
  title: '审查要点建议',
  summary: '请选择左侧模块以查看对应审查建议。',
  tips: []
});

const getLabel = (key) => ANALYSIS_METRICS.find(m => m.key === key)?.label || key;
</script>

<style scoped>
.analysis-panel-content {
  padding: 14px;
  overflow-y: auto;
  flex: 1;
}
.section-card {
  padding: 13px 14px;
  margin-bottom: 10px;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-divider);
}
.insight-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 6px;
}
.insight-summary {
  font-size: 12.5px;
  color: var(--color-text-body);
  line-height: 1.65;
}
.tip-list {
  margin: 8px 0 0;
  padding-left: 16px;
}
.tip-list li {
  font-size: 12px;
  color: var(--color-text-sub);
  line-height: 1.8;
  margin-bottom: 2px;
}
.score-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 11px 12px;
  margin-bottom: 8px;
  background: #fafbfd;
  transition: all var(--transition-fast);
}
.score-card:last-child { margin-bottom: 0; }
.score-card:hover {
  box-shadow: var(--shadow-sm);
  border-color: #c8d0e4;
  transform: translateY(-1px);
}
.score-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.score-label {
  font-weight: 600;
  font-size: 12.5px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--text-main);
}
.score-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-success { background: var(--success-color); }
.dot-warning { background: #ff7d00; }
.score-value {
  font-size: 14px;
  font-weight: 700;
}
.score-desc {
  font-size: 12px;
  color: var(--color-text-body);
  line-height: 1.55;
  margin-bottom: 5px;
}
.score-detail {
  font-size: 11.5px;
  color: var(--color-text-sub);
  line-height: 1.6;
  margin-bottom: 7px;
}
</style>
