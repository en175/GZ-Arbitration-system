<template>
  <div class="left-panel">
    <div class="panel-header">案件概览</div>
    <div class="panel-content case-panel-content">
      <div class="wb-card summary-card">
        <div class="case-no">{{ summary.caseNo }}</div>
        <div class="case-parties">{{ summary.parties }}</div>
        <div class="case-meta">秘书：{{ summary.secretary }} | 庭审：{{ summary.hearingDate }}</div>
      </div>

      <div class="section-title">案件材料</div>
      <ul class="wb-list section-list">
        <li v-for="item in materials" :key="item.id" class="wb-list-item material-item">
          <div class="material-head">
            <span class="material-title">{{ item.title }}</span>
          </div>
          <div class="material-meta">{{ item.category }} · {{ item.size }} · {{ item.page }}页</div>
          <div class="material-foot">
            <span>{{ item.updatedAt }}</span>
            <button type="button" class="wb-btn wb-btn-text" @click.stop="openPreview(item)">预览</button>
          </div>
        </li>
      </ul>

      <div class="module-wrap">
        <div class="section-title section-title-tight">庭审记录提取</div>
        <button
          v-for="module in reviewModules"
          :key="module.key"
          type="button"
          class="wb-btn module-btn"
          :class="{ active: activeModuleKey === module.key }"
          @click="handleSelectModule(module)"
        >
          <span class="module-icon" v-html="getModuleIcon(module.key)"></span>
          {{ module.label }}
        </button>
      </div>

      <!-- 材料预览弹窗 -->
      <div v-if="previewMaterial" class="preview-mask" @click.self="previewMaterial = null">
        <div class="wb-card file-preview-dialog">
          <div class="preview-head">
            <div>
              <div class="preview-title">{{ previewMaterial.title }}</div>
              <div class="preview-sub">
                <span class="meta-pill">{{ materialTypeText(previewMaterial.type) }}</span>
                <span class="meta-pill">{{ previewMaterial.size }}</span>
              </div>
            </div>
            <button type="button" class="wb-btn" @click="previewMaterial = null">关闭</button>
          </div>
          <div class="preview-toolbar">
            <button type="button" class="toolbar-pill">上一页</button>
            <button type="button" class="toolbar-pill">下一页</button>
            <span class="toolbar-page">第 1 / {{ Math.max(1, previewMaterial.page) }} 页</span>
            <button type="button" class="toolbar-pill">缩小</button>
            <button type="button" class="toolbar-pill">100%</button>
            <button type="button" class="toolbar-pill">放大</button>
          </div>
          <div class="preview-body file-preview-body">
            <div class="file-page">
              <div class="file-page-title">{{ previewMaterial.title }}</div>
              <div class="file-page-meta">来源：{{ previewMaterial.category }} ｜ 更新时间：{{ previewMaterial.updatedAt }}</div>
              <div class="file-page-content">{{ materialPreviewText(previewMaterial) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 模块详情弹窗 -->
      <div v-if="activeModuleDialog" class="preview-mask" @click.self="closeModuleDialog">
        <div class="wb-card module-dialog">
          <div class="module-dialog-head">
            <div class="module-dialog-title">{{ activeModuleDialog.title }}</div>
            <button type="button" class="wb-btn wb-btn-text module-dialog-close" @click="closeModuleDialog">✕</button>
          </div>

          <ul v-if="activeModuleDialog.bullets" class="module-bullet-list">
            <li v-for="(item, idx) in activeModuleDialog.bullets" :key="`b-${idx}`">{{ item }}</li>
          </ul>

          <div v-if="activeModuleDialog.sections" class="module-section-list">
            <div v-for="(item, idx) in activeModuleDialog.sections" :key="`s-${idx}`" class="module-section-card">
              <div class="module-section-title">{{ item.heading }}</div>
              <div class="module-section-content">{{ item.content }}</div>
              <div class="module-section-quote">原话：{{ item.quote }}</div>
            </div>
          </div>

          <div v-if="activeModuleDialog.focuses" class="focus-list">
            <div v-for="(focus, idx) in activeModuleDialog.focuses" :key="`f-${idx}`" class="focus-card">
              <div class="focus-title">{{ focus.question }}</div>
              <div class="focus-party">
                <div class="focus-party-title">申请方主张与论证</div>
                <div class="focus-text">观点：{{ focus.applicant.view }}</div>
                <ul class="focus-evidence-list">
                  <li v-for="(line, lineIdx) in focus.applicant.evidence" :key="`fa-${idx}-${lineIdx}`">{{ line }}</li>
                </ul>
                <div class="focus-statement">关键庭审陈述：{{ focus.applicant.statement }}</div>
              </div>
              <div class="focus-party">
                <div class="focus-party-title">被申请方主张与论证</div>
                <div class="focus-text">观点：{{ focus.respondent.view }}</div>
                <ul class="focus-evidence-list">
                  <li v-for="(line, lineIdx) in focus.respondent.evidence" :key="`fr-${idx}-${lineIdx}`">{{ line }}</li>
                </ul>
                <div class="focus-statement">关键庭审陈述：{{ focus.respondent.statement }}</div>
              </div>
              <div class="focus-conclusion">证据对抗小结：{{ focus.conclusion }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  summary: { type: Object, required: true },
  materials: { type: Array, default: () => [] },
  reviewModules: { type: Array, default: () => [] },
  moduleDialogs: { type: Object, default: () => ({}) },
  activeModuleKey: { type: String, default: '' }
});

const emit = defineEmits(['select-module']);

const previewMaterial = ref(null);
const activeModuleDialog = ref(null);

const materialTypeText = (value) => {
  const map = { docx: '文书', pdf: '文档', xlsx: '表格', image: '图片', audio: '音频', video: '视频' };
  return map[value] || '材料';
};

const openPreview = (item) => {
  previewMaterial.value = item;
};

const materialPreviewText = (item) => {
  return `【文件摘要】\n${item.previewText}\n\n【卷内位置】\n共 ${item.page} 页，建议重点核对签章信息、金额口径与时间节点。\n\n【审查建议】\n1. 比对与裁决主文相关金额是否一致；\n2. 对关键事实对应页做证据编号标注；\n3. 对存在异议内容补充原始证明材料。`;
};

const handleSelectModule = (module) => {
  emit('select-module', module);
  activeModuleDialog.value = props.moduleDialogs[module.key] || null;
};

const closeModuleDialog = () => {
  activeModuleDialog.value = null;
};

const getModuleIcon = (key) => {
  if (key === 'coreClaim') {
    return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18"></path><path d="M12 3v18"></path><circle cx="12" cy="12" r="9"></circle></svg>';
  }
  if (key === 'undisputedFact') {
    return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>';
  }
  return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"></path><path d="M19 9l-5 5-4-4-3 3"></path></svg>';
};
</script>

<style scoped>
.case-panel-content {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}
.summary-card {
  padding: 14px 16px;
  margin-bottom: 16px;
  background: var(--color-muted);
}
.case-no {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 6px;
  color: var(--text-main);
}
.case-parties {
  font-size: 12px;
  color: var(--color-text-sub);
  margin-bottom: 4px;
  line-height: 1.5;
}
.case-meta {
  font-size: 12px;
  color: var(--color-text-sub);
}
.section-title {
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 13px;
  color: var(--text-main);
}
.section-list {
  margin-bottom: 14px;
}
.material-item {
  padding: 10px 0;
  border: none;
  border-bottom: 1px solid var(--color-divider);
}
.material-item:last-child {
  border-bottom: none;
}
.material-head {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.material-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.4;
  word-break: break-all;
}
.material-meta {
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-text-sub);
}
.material-foot {
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--color-text-sub);
}
.module-wrap {
  border-top: 1px solid var(--color-divider);
  padding-top: 14px;
}
.section-title-tight {
  margin-bottom: 8px;
}
.module-btn {
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 7px;
  gap: 8px;
  border-color: var(--color-border);
  background: #fafbfd;
  color: var(--color-text-body);
  font-size: 13px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
}
.module-btn:last-child { margin-bottom: 0; }
.module-btn:hover {
  border-color: #9aaee8;
  background: #f0f3ff;
}
.module-btn.active {
  border-color: #9aaee8;
  background: #eef1ff;
  color: var(--primary-color);
}
.module-icon {
  display: inline-flex;
  align-items: center;
  color: var(--primary-color);
  opacity: 0.7;
  flex-shrink: 0;
}
.module-btn.active .module-icon { opacity: 1; }

/* ── 预览遮罩 ── */
.preview-mask {
  position: fixed;
  inset: 0;
  z-index: 1500;
  background: rgba(15, 23, 42, 0.32);
  display: flex;
  align-items: center;
  justify-content: center;
}
.file-preview-dialog {
  width: min(960px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  padding: 0;
  overflow: hidden;
  border-radius: var(--radius-xl);
}
.preview-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.95);
}
.preview-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}
.preview-sub {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.meta-pill {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--primary-color);
  background: #eef1ff;
  border: 1px solid #b8c4ef;
  border-radius: var(--radius-sm);
  padding: 1px 8px;
}
.preview-toolbar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 14px;
  border-bottom: 1px solid var(--color-border);
  background: #fafbfd;
}
.toolbar-pill {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: #fff;
  color: var(--color-text-body);
  font-size: 12px;
  padding: 3px 9px;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.toolbar-pill:hover {
  border-color: #9aaee8;
  color: var(--primary-color);
  background: #eef1ff;
}
.toolbar-page {
  margin: 0 4px 0 8px;
  color: var(--color-text-sub);
  font-size: 12px;
}
.file-preview-body {
  overflow: auto;
  padding: 20px;
  max-height: calc(100vh - 220px);
  background: var(--bg-page);
}
.file-page {
  width: min(760px, calc(100% - 12px));
  margin: 0 auto;
  min-height: 600px;
  background: #fff;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
  padding: 28px 32px;
  border-radius: var(--radius-lg);
}
.file-page-title {
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
}
.file-page-meta {
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  color: var(--color-text-sub);
}
.file-page-content {
  margin-top: 18px;
  font-size: 14px;
  line-height: 1.85;
  color: var(--color-text-body);
  white-space: pre-wrap;
}

/* ── 模块详情弹窗 ── */
.module-dialog {
  width: min(960px, calc(100vw - 48px));
  max-height: calc(100vh - 56px);
  padding: 20px;
  overflow: auto;
  border-radius: var(--radius-xl);
}
.module-dialog-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.module-dialog-title {
  font-size: 19px;
  font-weight: 700;
  color: var(--text-main);
}
.module-dialog-close {
  font-size: 18px;
}
.module-bullet-list {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: #fafbfd;
  padding: 18px 26px;
  box-shadow: var(--shadow-sm);
}
.module-bullet-list li {
  font-size: 16px;
  line-height: 2;
  color: var(--text-main);
}
.module-section-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.module-section-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 16px;
  background: #fff;
  box-shadow: var(--shadow-sm);
}
.module-section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
}
.module-section-content {
  font-size: 14px;
  color: var(--color-text-body);
  line-height: 1.7;
}
.module-section-quote {
  margin-top: 10px;
  font-size: 13px;
  color: var(--color-text-sub);
  line-height: 1.6;
  padding-left: 12px;
  border-left: 3px solid var(--color-border);
}
.focus-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.focus-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 16px;
  background: #fff;
  box-shadow: var(--shadow-sm);
}
.focus-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 10px;
}
.focus-party { margin-bottom: 10px; }
.focus-party-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 4px;
}
.focus-text {
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-body);
}
.focus-evidence-list {
  padding-left: 18px;
  margin: 4px 0 0;
}
.focus-evidence-list li {
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-body);
}
.focus-statement {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-sub);
}
.focus-conclusion {
  margin-top: 8px;
  padding: 10px 12px;
  border: 1px solid #9aaee8;
  border-radius: var(--radius-md);
  background: #eef1ff;
  font-size: 13px;
  line-height: 1.7;
  color: var(--primary-color);
}
</style>
