<template>
  <div class="right-panel">
    <div class="wb-tabs" role="tablist">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="wb-tab-item"
        :class="{ active: currentTab === tab.key }"
        role="tab"
        @click="currentTab = tab.key"
      >{{ tab.label }}</div>
    </div>

    <div class="panel-content rp-content">
      <!-- AI 写作助手 -->
      <div v-if="currentTab === 'ai'" class="ai-tab-wrap">
        <div v-if="currentSectionLabel" class="section-context-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          当前编辑：<strong>{{ currentSectionLabel }}</strong>
        </div>

        <div class="preset-area">
          <div class="preset-title">{{ sectionPresets.length > 0 ? '推荐任务' : '快捷任务' }}</div>
          <div class="preset-grid">
            <button
              v-for="item in displayPresets"
              :key="item.key"
              type="button"
              class="preset-card"
              :class="{ active: activePresetKey === item.key, recommended: sectionPresetKeys.has(item.key) }"
              @click="activePresetKey = item.key"
            >
              <div class="preset-label">
                {{ item.label }}
                <span v-if="sectionPresetKeys.has(item.key)" class="rec-dot"></span>
              </div>
              <div class="preset-desc">{{ item.desc }}</div>
            </button>
          </div>
          <div v-if="currentPresetOptions.length > 0" class="option-row">
            <button
              v-for="option in currentPresetOptions"
              :key="option.key"
              type="button"
              class="option-chip"
              @click="emit('ai-preset-select', { actionKey: activePresetKey, optionKey: option.key, actionLabel: activePresetLabel, optionLabel: option.label })"
            >{{ option.label }}</button>
          </div>
          <div v-else-if="activePresetKey" class="option-row">
            <button type="button" class="option-chip primary-chip" @click="emit('ai-preset-select', { actionKey: activePresetKey, optionKey: '_default', actionLabel: activePresetLabel, optionLabel: '执行' })">
              执行此任务
            </button>
          </div>
        </div>

        <div class="msg-list">
          <div v-for="msg in aiMsgs" :key="msg.id" class="msg-row" :class="msg.role">
            <div class="msg-bubble">{{ msg.content }}</div>
          </div>
        </div>
      </div>

      <!-- 校对检查 -->
      <div v-if="currentTab === 'check'" class="check-tab-wrap">
        <div v-for="group in checkGroups" :key="group.id" class="check-group">
          <div class="group-title">{{ group.title }}</div>
          <div
            v-for="issue in group.items"
            :key="issue.id"
            class="check-card wb-card"
            :class="{ 'severity-error': issue.severity === 'error' }"
            @click="emit('locate-check', { paragraphId: issue.paragraphId, severity: issue.severity || 'warning', targetText: issue.targetText || '' })"
          >
            <div class="check-head">
              <span class="check-type">
                <span class="severity-dot" :class="issue.severity || 'warning'"></span>
                {{ checkTypeText(issue.type) }}
              </span>
            </div>
            <div class="check-desc">{{ issue.desc }}</div>
          </div>
        </div>
      </div>

      <!-- 人工批注 -->
      <div v-if="currentTab === 'comment'" class="comment-tab-wrap">
        <div class="comment-filter">
          <button
            v-for="item in commentFilters"
            :key="item.key"
            type="button"
            class="filter-chip"
            :class="{ active: commentFilter === item.key }"
            @click="commentFilter = item.key"
          >{{ item.label }}</button>
        </div>

        <div v-if="filteredComments.length === 0" class="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <div style="margin-top: 8px;">选中正文文字，点击工具栏「批注」添加</div>
        </div>

        <div
          v-for="comment in filteredComments"
          :key="comment.id"
          :data-comment-id="comment.id"
          class="comment-card"
          :class="{ active: activeCommentId === comment.id, editing: editingCommentId === comment.id }"
          @click="handleCommentClick(comment)"
        >
          <div v-if="comment.selectedText" class="comment-quote">
            <div class="quote-bar"></div>
            <div class="quote-text">{{ comment.selectedText }}</div>
          </div>

          <div v-if="editingCommentId === comment.id" class="comment-edit-area">
            <textarea
              ref="editTextareaRef"
              v-model="editingContent"
              class="comment-edit-input"
              placeholder="输入批注内容..."
              rows="3"
              @keydown.meta.enter="saveEdit(comment)"
              @keydown.ctrl.enter="saveEdit(comment)"
            />
            <div class="edit-actions">
              <button class="edit-btn cancel" @click.stop="cancelEdit">取消</button>
              <button class="edit-btn save" @click.stop="saveEdit(comment)">保存</button>
            </div>
          </div>

          <div v-else>
            <div class="comment-body">{{ comment.content || '暂无批注内容' }}</div>
            <div class="comment-meta-row">
              <span class="meta-left">
                <span v-if="comment.author" class="meta-author">{{ comment.author }}</span>
                <span v-if="comment.createdAt" class="meta-time">{{ comment.createdAt }}</span>
              </span>
              <span class="meta-right">
                <span class="comment-status-dot" :class="comment.status"></span>
                <span class="comment-status-text" :class="comment.status">{{ comment.status === 'pending' ? '待处理' : '已解决' }}</span>
              </span>
            </div>
          </div>

          <div v-if="editingCommentId !== comment.id" class="comment-action-bar">
            <button class="action-icon-btn" title="编辑" @click.stop="startEdit(comment)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="M15 5l4 4"/></svg>
            </button>
            <button v-if="comment.status === 'pending'" class="action-icon-btn resolve-btn" title="标记已解决" @click.stop="resolveComment(comment)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button class="action-icon-btn delete-btn" title="删除" @click.stop="deleteComment(comment)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, nextTick, watch } from 'vue';
import {
  COMMENT_FILTERS,
  WRITER_TABS,
  DOC_SECTIONS,
  SECTION_AI_PRESETS,
  SECTION_AI_OPTIONS,
  AI_COMMON_ACTIONS,
  AI_PRESET_OPTIONS
} from './docWriterConfig.js';

const props = defineProps({
  aiMsgs: { type: Array, default: () => [] },
  checkGroups: { type: Array, default: () => [] },
  comments: { type: Array, default: () => [] },
  currentSection: { type: String, default: '' }
});

const emit = defineEmits(['locate-check', 'locate-comment', 'locate-failed', 'ai-preset-select', 'update-comment', 'add-comment', 'delete-comment']);

const currentTab = ref('ai');
const tabs = WRITER_TABS;
const commentFilters = COMMENT_FILTERS;
const commentFilter = ref('all');
const activeCommentId = ref('');

const currentSectionLabel = computed(() => {
  if (!props.currentSection) return '';
  const sec = DOC_SECTIONS.find(s => s.key === props.currentSection);
  return sec ? sec.label : '';
});

const sectionPresets = computed(() => {
  if (!props.currentSection) return [];
  return SECTION_AI_PRESETS[props.currentSection] || [];
});

const sectionPresetKeys = computed(() => new Set(sectionPresets.value.map(p => p.key)));

const displayPresets = computed(() => {
  if (sectionPresets.value.length > 0) {
    const sectionKeys = new Set(sectionPresets.value.map(p => p.key));
    const common = AI_COMMON_ACTIONS.filter(a => !sectionKeys.has(a.key));
    return [...sectionPresets.value, ...common];
  }
  return AI_COMMON_ACTIONS;
});

const activePresetKey = ref(displayPresets.value[0]?.key || 'focus');

watch(displayPresets, (presets) => {
  if (presets.length > 0 && !presets.find(p => p.key === activePresetKey.value)) {
    activePresetKey.value = presets[0]?.key || 'focus';
  }
});

const currentPresetOptions = computed(() => {
  const section = props.currentSection || '';
  const sectionOpts = SECTION_AI_OPTIONS[section];
  return sectionOpts?.[activePresetKey.value] || AI_PRESET_OPTIONS[activePresetKey.value] || [];
});

const activePresetLabel = computed(() => {
  const item = displayPresets.value.find(p => p.key === activePresetKey.value);
  return item ? item.label : '快捷任务';
});

const checkTypeText = (value) => {
  if (value === 'format') return '格式';
  if (value === 'logic') return '逻辑';
  if (value === 'evidence') return '证据';
  return '审查项';
};

const filteredComments = computed(() => {
  if (commentFilter.value === 'all') return props.comments;
  return props.comments.filter(item => item.status === commentFilter.value);
});

const editingCommentId = ref('');
const editingContent = ref('');
const editTextareaRef = ref(null);

const handleCommentClick = (comment) => {
  activeCommentId.value = comment.id;
  if (comment.paragraphId) emit('locate-comment', { paragraphId: comment.paragraphId, selectedText: comment.selectedText || '' });
};

const startEdit = (comment) => {
  editingCommentId.value = comment.id;
  editingContent.value = comment.content;
  nextTick(() => {
    const el = Array.isArray(editTextareaRef.value) ? editTextareaRef.value[0] : editTextareaRef.value;
    if (el) el.focus();
  });
};

const cancelEdit = () => { editingCommentId.value = ''; };

const saveEdit = (comment) => {
  emit('update-comment', { ...comment, content: editingContent.value });
  editingCommentId.value = '';
};

const resolveComment = (comment) => {
  emit('update-comment', { ...comment, status: 'resolved' });
};

const deleteComment = (comment) => {
  emit('delete-comment', comment.id);
};

const switchToCommentAndEdit = (commentId) => {
  currentTab.value = 'comment';
  editingCommentId.value = commentId;
  const target = props.comments.find(c => c.id === commentId);
  editingContent.value = target?.content || '';
  activeCommentId.value = commentId;
  nextTick(() => {
    const el = Array.isArray(editTextareaRef.value) ? editTextareaRef.value[0] : editTextareaRef.value;
    if (el) el.focus();
  });
};

const switchToCommentTab = (commentId) => {
  currentTab.value = 'comment';
  activeCommentId.value = commentId;
  nextTick(() => {
    const el = document.querySelector(`[data-comment-id="${commentId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('comment-card-flash');
      setTimeout(() => el.classList.remove('comment-card-flash'), 2000);
    }
  });
};

defineExpose({ switchToCommentAndEdit, switchToCommentTab });
</script>

<style scoped>
.wb-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  margin: 10px 10px 0;
  border: 1px solid #b8c4ef;
  border-radius: var(--radius-lg);
  background: var(--gradient-primary);
}
.wb-tab-item {
  flex: 1;
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  padding: 5px 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
}
.wb-tab-item:hover { color: #fff; background: rgba(255,255,255,0.14); }
.wb-tab-item.active { color: #fff; background: rgba(255,255,255,0.20); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.24); }

.rp-content { padding: 10px; }

.ai-tab-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.msg-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 12px;
}
.msg-row {
  margin-bottom: 12px;
  display: flex;
}
.msg-row.user { justify-content: flex-end; }
.msg-row.ai { justify-content: flex-start; }
.msg-bubble {
  max-width: 85%;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  background: #F2F3F5;
  color: var(--color-text-body);
}
.msg-row.user .msg-bubble {
  background: var(--color-primary);
  color: #fff;
}

.section-context-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 11px;
  margin-bottom: 9px;
  background: #eef1ff;
  border-radius: var(--radius-md);
  font-size: 12px;
  color: var(--color-primary);
  border: 1px solid #c0caef;
}
.section-context-bar strong { font-weight: 700; }

.preset-area {
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-lg);
  background: #fafbfd;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: var(--shadow-xs);
}
.preset-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-disabled);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.preset-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}
.preset-card {
  text-align: left;
  border: 1px solid var(--color-border);
  background: #ffffff;
  border-radius: var(--radius-md);
  padding: 8px;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
}
.preset-card:hover {
  border-color: #c0caef;
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}
.preset-card.active { border-color: #9aaee8; background: #eef1ff; }
.preset-card.recommended { border-color: #9aaee8; }
.preset-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 4px;
}
.rec-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--color-primary);
  flex-shrink: 0;
}
.preset-desc {
  margin-top: 3px;
  font-size: 11.5px;
  color: var(--color-text-sub);
  line-height: 1.4;
}
.option-row {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 9px;
}
.option-chip {
  border: 1px solid #c0caef;
  background: #f3f6ff;
  border-radius: var(--radius-full);
  padding: 3px 10px;
  font-size: 11.5px;
  cursor: pointer;
  font-family: inherit;
  color: var(--color-text-body);
  transition: all 0.15s;
}
.option-chip:hover { border-color: #9aaee8; background: #eef1ff; color: var(--color-primary); }
.primary-chip { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.primary-chip:hover { opacity: 0.88; }

.check-tab-wrap { padding-top: 2px; }
.check-group { margin-bottom: 12px; }
.group-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-disabled);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 7px;
}
.check-card {
  padding: 10px 12px;
  margin-bottom: 7px;
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--warning-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: #ffffff;
}
.check-card.severity-error { border-left-color: var(--danger-color); }
.check-card:hover { background: #fafbff; box-shadow: var(--shadow-xs); border-color: #c8d0e4; }
.check-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.check-type {
  font-size: 11.5px;
  color: var(--color-text-sub);
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}
.severity-dot { width: 6px; height: 6px; border-radius: 50%; }
.severity-dot.error { background: var(--danger-color); }
.severity-dot.warning { background: var(--warning-color); }
.check-desc { font-size: 13px; }

.comment-tab-wrap {}
.comment-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}
.filter-chip {
  border: 1px solid var(--color-border);
  background: #fafbfd;
  border-radius: var(--radius-full);
  padding: 3px 10px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  color: var(--color-text-sub);
  transition: all var(--transition-fast);
}
.filter-chip:hover { border-color: #c0caef; color: var(--color-primary); }
.filter-chip.active { border-color: #9aaee8; color: var(--color-primary); background: #eef1ff; font-weight: 600; }

.empty-state {
  text-align: center;
  color: var(--color-text-disabled);
  margin-top: 48px;
  font-size: 13px;
}

.comment-card {
  position: relative;
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-lg);
  padding: 11px 12px;
  margin-bottom: 7px;
  cursor: pointer;
  transition: all 0.15s;
  background: #ffffff;
}
.comment-card:hover { border-color: #b8c4ef; background: #fafbff; }
.comment-card.active { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(61,86,200,0.14); }
.comment-card.editing { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(61,86,200,0.14); }
.comment-quote {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-divider);
}
.quote-bar { width: 2.5px; min-height: 16px; background: var(--warning-color); border-radius: 2px; flex-shrink: 0; }
.quote-text {
  font-size: 11.5px;
  color: var(--color-text-sub);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.comment-body { font-size: 12.5px; line-height: 1.6; color: var(--color-text-body); }
.comment-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 7px;
}
.meta-left { display: flex; gap: 7px; font-size: 11.5px; color: var(--color-text-sub); }
.meta-right { display: flex; align-items: center; gap: 4px; }
.comment-status-dot { width: 6px; height: 6px; border-radius: 50%; }
.comment-status-dot.pending { background: var(--warning-color); }
.comment-status-dot.resolved { background: var(--success-color); }
.comment-status-text { font-size: 11px; font-weight: 600; }
.comment-status-text.pending { color: var(--warning-color); }
.comment-status-text.resolved { color: var(--success-color); }

.comment-edit-area { margin-top: 4px; }
.comment-edit-input {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 12.5px;
  resize: none;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1.5;
  background: #fafbfd;
  color: var(--color-text-body);
}
.comment-edit-input:focus { border-color: var(--color-primary); background: #fff; }
.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 6px;
}
.edit-btn {
  font-size: 12px;
  padding: 4px 11px;
  border-radius: var(--radius-md);
  cursor: pointer;
  border: 1px solid var(--color-border);
  background: #fff;
  color: var(--color-text-body);
  font-family: inherit;
  transition: all var(--transition-fast);
}
.edit-btn.save { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.edit-btn.cancel:hover { background: var(--color-muted); }
.edit-btn.save:hover { opacity: 0.88; }

.comment-action-bar {
  position: absolute;
  top: 7px;
  right: 7px;
  display: none;
  gap: 2px;
  background: #fff;
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-md);
  padding: 2px;
  box-shadow: var(--shadow-sm);
}
.comment-card:hover .comment-action-bar { display: flex; }
.action-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-text-sub);
  transition: all 0.15s;
}
.action-icon-btn:hover { background: #eef1ff; color: var(--color-primary); }
.action-icon-btn.delete-btn:hover { background: var(--color-danger-light); color: var(--danger-color); }
.action-icon-btn.resolve-btn:hover { background: var(--color-success-light); color: var(--success-color); }

.comment-card-flash {
  animation: card-flash 2s ease-out forwards;
}
@keyframes card-flash {
  0%, 40% { box-shadow: 0 0 0 2px rgba(61,86,200,0.3); background: #eef1ff; }
  100% { box-shadow: none; background: #fff; }
}
</style>
