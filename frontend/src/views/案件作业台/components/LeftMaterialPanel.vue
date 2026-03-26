<template>
  <div class="left-panel">
    <div class="panel-header">证据材料引用</div>
    <div class="panel-content evidence-panel">
      <!-- 提交方筛选 -->
      <div class="source-filter">
        <button
          v-for="f in sourceFilters"
          :key="f.key"
          type="button"
          class="filter-chip"
          :class="{ active: activeFilter === f.key }"
          @click="activeFilter = f.key"
        >{{ f.label }}</button>
      </div>

      <!-- 手风琴材料列表 -->
      <div class="accordion-list">
        <div
          v-for="mat in filteredMaterials"
          :key="mat.id"
          class="accordion-item"
          :class="{ expanded: expandedIds.has(mat.id) }"
        >
          <!-- 材料标题行 -->
          <div class="accordion-header" @click="toggleExpand(mat.id)">
            <div class="header-left">
              <span class="expand-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline v-if="expandedIds.has(mat.id)" points="6 9 12 15 18 9"/>
                  <polyline v-else points="9 18 15 12 9 6"/>
                </svg>
              </span>
              <span class="mat-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </span>
              <span class="mat-title">{{ mat.title }}</span>
            </div>
            <div class="header-right">
              <button type="button" class="wb-btn wb-btn-text preview-btn" @click.stop="openMaterialPreview(mat)">预览</button>
            </div>
          </div>

          <!-- 展开的证据列表 -->
          <div v-if="expandedIds.has(mat.id)" class="accordion-body">
            <div
              v-for="row in mat.evidenceItems"
              :key="row.id"
              class="evidence-card"
              :class="riskClass(row.conflictLevel)"
            >
              <div class="evidence-head">
                <span class="evidence-claim">{{ row.claim }}</span>
              </div>
              <div class="evidence-excerpt">{{ row.excerpt }}</div>
              <div v-if="row.conflictNote" class="evidence-note">冲突提示：{{ row.conflictNote }}</div>
              <div class="action-row">
                <span v-if="row.quoted" class="quoted-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  已引用{{ row.quoteCount && row.quoteCount > 1 ? ` ×${row.quoteCount}` : '' }}
                </span>
                <button class="wb-btn wb-btn-primary quote-btn" @click.stop="handleQuote(mat, row)">
                  引用
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPreviewDialog && previewMaterial" class="dialog-overlay" @click.self="closePreviewDialog">
      <div class="pdf-viewer-dialog">
        <div class="pdf-head">
          <div class="pdf-title-wrap">
            <div class="pdf-title">{{ previewMaterial.title }}</div>
            <div class="pdf-meta">
              <span class="pdf-pill">{{ previewMaterial.fileType || 'PDF' }}</span>
              <span class="pdf-pill">{{ previewMaterial.fileSize || '2.1 MB' }}</span>
            </div>
          </div>
          <button type="button" class="wb-btn" @click="closePreviewDialog">关闭</button>
        </div>
        <div class="pdf-toolbar">
          <button type="button" class="pdf-toolbar-btn">上一页</button>
          <button type="button" class="pdf-toolbar-btn">下一页</button>
          <span class="pdf-page">第 1 / {{ Math.max(1, previewMaterial?.evidenceItems?.length || 1) }} 页</span>
          <button type="button" class="pdf-toolbar-btn">缩小</button>
          <button type="button" class="pdf-toolbar-btn">100%</button>
          <button type="button" class="pdf-toolbar-btn">放大</button>
        </div>
        <div class="pdf-body">
          <div class="pdf-page-paper">
            <div class="paper-title">{{ previewMaterial.title }}</div>
            <div class="paper-subtitle">{{ previewMaterial.source }} ｜ 提交时间：{{ previewMaterial.submittedAt }}</div>
            <div class="paper-content">{{ buildMaterialPreviewText(previewMaterial) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue';
import { SOURCE_FILTERS } from './docWriterConfig.js';

const props = defineProps({
  materials: { type: Array, default: () => [] }
});

const emit = defineEmits(['quote-evidence']);

const sourceFilters = SOURCE_FILTERS;
const activeFilter = ref('all');

const expandedIds = reactive(new Set());
const showPreviewDialog = ref(false);
const previewMaterial = ref(null);
const firstMaterial = props.materials[0];
if (firstMaterial) {
  expandedIds.add(firstMaterial.id);
}

const filteredMaterials = computed(() => {
  if (activeFilter.value === 'all') return props.materials;
  return props.materials.filter(m => {
    if (activeFilter.value === 'applicant') return m.sourceParty === 'applicant' || m.sourceParty === 'both';
    if (activeFilter.value === 'respondent') return m.sourceParty === 'respondent' || m.sourceParty === 'both';
    return m.sourceParty === activeFilter.value;
  });
});

const toggleExpand = (id) => {
  if (expandedIds.has(id)) {
    expandedIds.delete(id);
  } else {
    expandedIds.add(id);
  }
};

const riskClass = (level) => {
  if (level === 'high') return 'danger';
  if (level === 'medium') return 'warning';
  return 'safe';
};

const handleQuote = (mat, ev) => {
  emit('quote-evidence', { material: mat, evidence: ev });
};

const openMaterialPreview = (mat) => {
  previewMaterial.value = mat;
  showPreviewDialog.value = true;
};

const closePreviewDialog = () => {
  showPreviewDialog.value = false;
};

const buildMaterialPreviewText = (mat) => {
  const lines = mat.evidenceItems.map((item, idx) => `${idx + 1}. ${item.claim}\n${item.excerpt}`);
  return `【材料摘要】\n${lines.join('\n\n')}\n\n【审查提示】\n1. 优先核对金额、日期与主体信息是否一致；\n2. 对冲突项补充页码或证据编号；\n3. 形成"事实-证据-结论"对应关系后再引用入稿。`;
};
</script>

<style scoped>
.evidence-panel {
  padding: 12px;
}

.source-filter {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: nowrap;
}
.filter-chip {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}
.filter-chip.active {
  border-color: #bfdbfe;
  color: var(--color-primary);
  background: #eff6ff;
}
.filter-chip:hover:not(.active) {
  border-color: #d5def8;
  background: #f8faff;
}

.accordion-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.accordion-item {
  border: 1px solid var(--color-divider);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s;
}
.accordion-item.expanded {
  border-color: #c7d2fe;
}
.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.15s;
  gap: 8px;
}
.accordion-header:hover {
  background: #f7faff;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex: 1;
}
.expand-icon {
  display: flex;
  align-items: center;
  color: var(--color-text-sub);
  flex-shrink: 0;
}
.mat-icon {
  width: 14px;
  height: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-sub);
  flex-shrink: 0;
}
.mat-title {
  font-size: 13px;
  font-weight: 600;
  word-break: break-all;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.preview-btn {
  font-size: 12px;
  padding: 2px 6px;
}

.accordion-body {
  padding: 0 10px 10px;
  animation: slideDown 0.2s ease-out;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.evidence-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 6px;
  background: #fff;
}
.evidence-card:last-child { margin-bottom: 0; }
.evidence-card.warning { border-color: #f8d8a9; }
.evidence-card.danger { border-color: #f6b5b5; }

.evidence-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.evidence-claim {
  font-size: 13px;
  font-weight: 600;
}
.evidence-excerpt {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--color-text-body);
}
.evidence-note {
  margin-top: 4px;
  font-size: 11px;
  color: #b45309;
}
.action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
}
.quoted-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: #15803d;
}
.quote-btn {
  font-size: 12px;
  padding: 4px 10px;
  min-height: 28px;
  margin-left: auto;
}

.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 1800;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.35);
}
.pdf-viewer-dialog {
  width: min(1100px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
  display: flex;
  flex-direction: column;
}
.pdf-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
  background: #f8fbff;
}
.pdf-title { font-size: 18px; font-weight: 700; color: #1e3257; }
.pdf-meta { margin-top: 6px; display: flex; gap: 8px; }
.pdf-pill {
  font-size: 12px;
  color: #4a5f88;
  background: #edf2fc;
  border: 1px solid #d9e4f8;
  border-radius: 4px;
  padding: 2px 8px;
}
.pdf-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-border);
  background: #fff;
}
.pdf-toolbar-btn {
  border: 1px solid #dae3f6;
  border-radius: 6px;
  background: #fff;
  color: #2b3f64;
  font-size: 12px;
  padding: 4px 10px;
  cursor: pointer;
}
.pdf-page { margin: 0 4px 0 8px; font-size: 12px; color: #5f7398; }
.pdf-body { flex: 1; background: #edf2fb; overflow: auto; padding: 20px; }
.pdf-page-paper {
  width: min(760px, calc(100% - 12px));
  margin: 0 auto;
  min-height: 760px;
  border: 1px solid #d5dff0;
  background: #fff;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.1);
  padding: 28px 30px;
}
.paper-title { text-align: center; font-size: 20px; font-weight: 700; color: #1f3359; }
.paper-subtitle { text-align: center; font-size: 12px; color: #687c9f; margin-top: 10px; }
.paper-content { margin-top: 18px; white-space: pre-wrap; font-size: 14px; line-height: 1.85; color: #1f3151; }
</style>
