<template>
  <div class="three-column-layout doc-writer-page" @click="handleGlobalClick">
    <LeftMaterialPanel
      :materials="materials"
      @quote-evidence="handleQuoteEvidence"
    />
    <EditorArea
      ref="editorRef"
      v-model="content"
      :sections="docSections"
      :check-paragraph-ids="checkParagraphMarkers"
      :comment-markers="commentMarkers"
      @selection-change="handleSelectionChange"
      @section-change="handleSectionChange"
      @import-word="handleImportWord"
      @export-word="handleExportWord"
      @comment-paragraph-click="handleCommentParagraphClick"
    />
    <RightWriterPanel
      ref="rightPanelRef"
      :ai-msgs="aiMsgs"
      :check-groups="checkGroups"
      :comments="comments"
      :current-section="currentSection"
      @locate-check="handleLocateCheck"
      @locate-comment="handleLocateComment"
      @locate-failed="handleLocateFailed"
      @ai-preset-select="handleAiPresetSelect"
      @update-comment="handleUpdateComment"
      @add-comment="() => {}"
      @delete-comment="handleDeleteComment"
    />

    <FloatingSelectionToolbar
      :visible="toolbarVisible"
      :position="toolbarPosition"
      @action="handleAiAction"
      @add-comment="handleToolbarAddComment"
    />

    <AiWritePopover
      :visible="popoverVisible"
      :position="popoverPosition"
      @close="popoverVisible = false"
      @action="handleAiAction"
      @send="handleAiSend"
    />

    <CandidateResultCard
      :visible="resultVisible"
      :content="candidateText"
      :position="resultPosition"
      @close="resultVisible = false"
      @copy="handleCopyResult"
      @replace="handleReplaceResult"
    />

    <input
      ref="wordFileInput"
      type="file"
      accept=".docx,.doc"
      style="display: none"
      @change="handleWordFileSelected"
    />

    <ToastMessage
      :message="toastMsg"
      :type="toastType"
      :show="toastShow"
      @update:show="toastShow = $event"
    />
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import LeftMaterialPanel from './LeftMaterialPanel.vue';
import EditorArea from '@/components/editor/EditorArea.vue';
import RightWriterPanel from './RightWriterPanel.vue';
import FloatingSelectionToolbar from './FloatingSelectionToolbar.vue';
import AiWritePopover from './AiWritePopover.vue';
import CandidateResultCard from './CandidateResultCard.vue';
import ToastMessage from '@/components/ToastMessage.vue';

import {
  DOC_SECTIONS,
  MOCK_MATERIALS,
  MOCK_AI_MSGS,
  MOCK_CHECK_GROUPS,
  MOCK_COMMENTS,
  MOCK_EDITOR_CONTENT,
  getMockCandidate,
  getPresetReply
} from './docWriterConfig.js';

const materials = ref(JSON.parse(JSON.stringify(MOCK_MATERIALS)));
const aiMsgs = ref([...MOCK_AI_MSGS]);
const checkGroups = MOCK_CHECK_GROUPS;
const comments = ref([...MOCK_COMMENTS]);
const content = ref(MOCK_EDITOR_CONTENT);
const docSections = DOC_SECTIONS;

const currentSection = ref('');
const editorRef = ref(null);
const rightPanelRef = ref(null);
const wordFileInput = ref(null);

const toolbarVisible = ref(false);
const toolbarPosition = ref({ top: 0, left: 0 });
const popoverVisible = ref(false);
const popoverPosition = ref({ top: 0, left: 0 });
const resultVisible = ref(false);
const resultPosition = ref({ top: 0, left: 0 });
const candidateText = ref('');
const currentSelectionRange = ref(null);

const toastShow = ref(false);
const toastMsg = ref('');
const toastType = ref('success');
const showToast = (msg, type = 'success') => {
  toastMsg.value = msg;
  toastType.value = type;
  toastShow.value = true;
};

const checkParagraphMarkers = computed(() => {
  const markers = [];
  for (const group of checkGroups) {
    for (const item of group.items) {
      markers.push({ paragraphId: item.paragraphId, severity: item.severity || 'warning' });
    }
  }
  return markers;
});

const handleSectionChange = (sectionKey) => {
  currentSection.value = sectionKey;
};

const handleSelectionChange = ({ range, position }) => {
  if (!range || range.empty) {
    toolbarVisible.value = false;
    popoverVisible.value = false;
    return;
  }
  currentSelectionRange.value = range;
  toolbarPosition.value = { top: position.top - 50, left: position.left };
  toolbarVisible.value = true;
  popoverVisible.value = false;
};

const handleGlobalClick = (event) => {
  if (!currentSelectionRange.value || currentSelectionRange.value.empty) {
    toolbarVisible.value = false;
    popoverVisible.value = false;
  }
  const isEditorClick = event.target.closest('.editor-container');
  if (!isEditorClick) {
    toolbarVisible.value = false;
    popoverVisible.value = false;
  }
};

const handleAiAction = (action) => {
  generateCandidate(action.key, action.label);
};

const handleAiSend = (text) => {
  generateCandidate('custom', text);
};

const generateCandidate = (type, prompt) => {
  popoverVisible.value = false;
  toolbarVisible.value = false;
  setTimeout(() => {
    candidateText.value = getMockCandidate(type, prompt);
    resultPosition.value = { ...toolbarPosition.value, top: toolbarPosition.value.top + 20 };
    resultVisible.value = true;
  }, 500);
};

const handleQuoteEvidence = ({ material, evidence }) => {
  if (evidence.conflictLevel === 'high') {
    showToast(`当前证据存在高风险冲突：${evidence.conflictNote}，请先完成冲突处理后再入稿。`, 'error');
    return;
  }
  if (!editorRef.value) return;
  editorRef.value.insertContentAndHighlight(evidence.excerpt);
  markEvidenceQuoted(evidence.id);
  showToast(`已引用「${evidence.claim}」`);
};

const markEvidenceQuoted = (evidenceId) => {
  for (const mat of materials.value) {
    for (const ev of mat.evidenceItems) {
      if (ev.id === evidenceId) {
        ev.quoted = true;
        ev.quoteCount = (ev.quoteCount || 0) + 1;
        return;
      }
    }
  }
};

const handleAiPresetSelect = ({ actionKey, optionKey, actionLabel, optionLabel }) => {
  const prompt = optionKey === '_default' ? `预选任务：${actionLabel}` : `预选任务：${actionLabel} / ${optionLabel}`;
  aiMsgs.value.push({ id: `u-${Date.now()}`, role: 'user', content: prompt });
  const reply = getPresetReply(actionKey, optionKey);
  aiMsgs.value.push({ id: `a-${Date.now()}`, role: 'ai', content: reply });
};

const commentMarkers = computed(() => {
  return comments.value
    .filter(c => c.paragraphId)
    .map(c => ({ id: c.id, paragraphId: c.paragraphId, selectedText: c.selectedText || '' }));
});

const handleLocateCheck = ({ paragraphId, severity, targetText }) => {
  if (!editorRef.value) return;
  editorRef.value.scrollToCheckParagraph(paragraphId, severity, targetText || '');
};

const handleLocateComment = ({ paragraphId, selectedText }) => {
  if (!editorRef.value) return;
  editorRef.value.scrollToCommentParagraph(paragraphId, selectedText || '');
};

const handleLocateFailed = () => {
  showToast('未找到对应段落，请确保文档已加载', 'warning');
};

const handleCommentParagraphClick = (paragraphId) => {
  const comment = comments.value.find(c => c.paragraphId === paragraphId);
  if (comment && rightPanelRef.value) {
    rightPanelRef.value.switchToCommentTab(comment.id);
  }
};

const handleUpdateComment = (updated) => {
  const idx = comments.value.findIndex(c => c.id === updated.id);
  if (idx !== -1) comments.value[idx] = { ...comments.value[idx], ...updated };
};

const handleDeleteComment = (commentId) => {
  comments.value = comments.value.filter(c => c.id !== commentId);
};

const handleToolbarAddComment = () => {
  const selection = window.getSelection();
  const selectedText = selection ? selection.toString().trim() : '';
  const paragraphId = getSelectionParagraphId(selection);
  const newId = 'cm-sel-' + Date.now();
  const newItem = {
    id: newId,
    title: selectedText ? (selectedText.length > 20 ? selectedText.slice(0, 20) + '...' : selectedText) : '新批注',
    content: '',
    status: 'pending',
    paragraphId,
    author: '当前用户',
    createdAt: new Date().toLocaleString('zh-CN'),
    selectedText: selectedText || ''
  };
  comments.value.unshift(newItem);
  toolbarVisible.value = false;
  nextTick(() => {
    if (rightPanelRef.value) rightPanelRef.value.switchToCommentAndEdit(newId);
  });
};

const getSelectionParagraphId = (selection) => {
  if (!selection || selection.rangeCount === 0) return '';
  let node = selection.anchorNode;
  if (!node) return '';
  if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
  const el = node instanceof Element ? node : null;
  if (!el) return '';
  const paragraphEl = el.closest('[data-paragraph-id]');
  return paragraphEl ? paragraphEl.getAttribute('data-paragraph-id') || '' : '';
};

const handleCopyResult = async () => {
  try {
    await navigator.clipboard.writeText(candidateText.value);
    showToast('已复制到剪贴板');
  } catch (err) {
    showToast('复制失败，请手动复制', 'error');
  }
};

const handleReplaceResult = () => {
  if (editorRef.value) {
    editorRef.value.replaceSelectionText(candidateText.value);
    resultVisible.value = false;
    showToast('已替换选中文本');
  }
};

const handleImportWord = () => {
  if (wordFileInput.value) wordFileInput.value.click();
};

const handleWordFileSelected = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  showToast('正在导入文档...', 'info');
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    let html = result.value;
    if (editorRef.value) {
      editorRef.value.setContent(html);
      content.value = html;
    }
    showToast(`已导入「${file.name}」`);
  } catch (err) {
    showToast('导入失败，请检查文件格式', 'error');
  }
  if (wordFileInput.value) wordFileInput.value.value = '';
};

const handleExportWord = async () => {
  if (!editorRef.value) return;
  showToast('正在生成 Word 文档...', 'info');
  try {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
    const htmlContent = editorRef.value.getHTML();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const elements = tempDiv.querySelectorAll('h1, h2, h3, p');
    const docParagraphs = [];
    for (const el of elements) {
      const text = el.textContent?.trim() || '';
      if (!text) continue;
      if (el.tagName === 'H1') {
        docParagraphs.push(new Paragraph({
          children: [new TextRun({ text, bold: true, size: 36, font: '仿宋' })],
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }));
      } else if (el.tagName === 'H2') {
        docParagraphs.push(new Paragraph({
          children: [new TextRun({ text, bold: true, size: 28, font: '黑体' })],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 200 }
        }));
      } else {
        const style = el.getAttribute('style') || '';
        const alignment = style.includes('text-align: right') ? AlignmentType.RIGHT
          : style.includes('text-align: center') ? AlignmentType.CENTER
          : AlignmentType.JUSTIFIED;
        const isBold = el.querySelector('strong') !== null;
        docParagraphs.push(new Paragraph({
          children: [new TextRun({ text, bold: isBold, size: 24, font: '仿宋' })],
          alignment,
          indent: alignment === AlignmentType.JUSTIFIED ? { firstLine: 480 } : undefined,
          spacing: { line: 360 }
        }));
      }
    }
    const doc = new Document({
      sections: [{
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: docParagraphs
      }]
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '裁决书.docx';
    a.click();
    URL.revokeObjectURL(url);
    showToast('裁决书已导出为 Word 文档');
  } catch (err) {
    showToast('导出失败，请稍后重试', 'error');
  }
};
</script>

<style scoped>
.doc-writer-page { background: var(--bg-page); }
</style>
