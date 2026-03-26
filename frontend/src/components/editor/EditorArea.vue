<template>
  <div class="editor-container">
    <!-- Toolbar -->
    <div class="editor-toolbar" v-if="editor">
      <div class="toolbar-main">
        <!-- Undo/Redo -->
        <div class="toolbar-group">
          <button class="toolbar-btn" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" title="撤销">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
          </button>
          <button class="toolbar-btn" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" title="重做">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
          </button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- Heading -->
        <div class="toolbar-group">
          <select class="toolbar-select" @change="setHeading($event)" :value="currentHeading">
            <option value="p">正文</option>
            <option value="1">标题 1</option>
            <option value="2">标题 2</option>
            <option value="3">标题 3</option>
          </select>
        </div>

        <div class="toolbar-divider"></div>

        <!-- Basic Formatting -->
        <div class="toolbar-group">
          <button class="toolbar-btn" :class="{ 'is-active': editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()" title="加粗">
            <span style="font-weight: bold;">B</span>
          </button>
          <button class="toolbar-btn" :class="{ 'is-active': editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()" title="斜体">
            <span style="font-style: italic;">I</span>
          </button>
          <button class="toolbar-btn" :class="{ 'is-active': editor.isActive('underline') }" @click="editor.chain().focus().toggleUnderline().run()" title="下划线">
            <span style="text-decoration: underline;">U</span>
          </button>
          <button class="toolbar-btn" :class="{ 'is-active': editor.isActive('highlight') }" @click="editor.chain().focus().toggleHighlight().run()" title="高亮">
            <span style="background: yellow; padding: 0 2px;">H</span>
          </button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- Alignment -->
        <div class="toolbar-group">
          <button class="toolbar-btn" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }" @click="editor.chain().focus().setTextAlign('left').run()" title="左对齐">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
          </button>
          <button class="toolbar-btn" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" @click="editor.chain().focus().setTextAlign('center').run()" title="居中">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="17" y1="10" x2="7" y2="10"/><line x1="19" y1="14" x2="5" y2="14"/><line x1="17" y1="18" x2="7" y2="18"/></svg>
          </button>
          <button class="toolbar-btn" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" @click="editor.chain().focus().setTextAlign('right').run()" title="右对齐">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
          </button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- Lists & Quote -->
        <div class="toolbar-group">
          <button class="toolbar-btn" :class="{ 'is-active': editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()" title="无序列表">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
          <button class="toolbar-btn" :class="{ 'is-active': editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()" title="有序列表">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
          </button>
          <button class="toolbar-btn" :class="{ 'is-active': editor.isActive('blockquote') }" @click="editor.chain().focus().toggleBlockquote().run()" title="引用">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>
          </button>
        </div>

        <!-- Word Import/Export -->
        <div class="toolbar-divider"></div>
        <div class="toolbar-group">
          <button class="toolbar-btn" title="导入 Word" @click="$emit('import-word')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
          <button class="toolbar-btn" title="导出 Word" @click="$emit('export-word')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </button>
        </div>
      </div>

      <!-- 自动保存指示 -->
      <div class="toolbar-right">
        <span class="auto-save-indicator">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          已自动保存 {{ autoSaveTime }}
        </span>
      </div>
    </div>

    <!-- 模块导航条 -->
    <div v-if="sections && sections.length > 0" class="section-nav">
      <button
        v-for="sec in sections"
        :key="sec.key"
        type="button"
        class="section-nav-item"
        :class="{ active: activeSection === sec.key }"
        @click="handleSectionClick(sec.key)"
      >{{ sec.label }}</button>
    </div>

    <!-- Editor Content -->
    <div ref="editorScrollRef" class="editor-content-wrapper" @scroll="handleEditorScroll" @click="handleContentClick">
      <editor-content :editor="editor" class="wb-paper" />
      <div ref="commentUnderlineLayerRef" class="comment-underline-layer"></div>
      <div ref="highlightOverlayRef" class="highlight-overlay" v-show="highlightOverlayActive"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, computed, watch, onMounted, nextTick } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';

const ParagraphIdAttr = Extension.create({
  name: 'paragraphIdAttr',
  addGlobalAttributes() {
    return [{
      types: ['heading', 'paragraph'],
      attributes: {
        dataParagraphId: {
          default: null,
          parseHTML: (el) => el.getAttribute('data-paragraph-id'),
          renderHTML: (attrs) => {
            if (!attrs.dataParagraphId) return {};
            return { 'data-paragraph-id': attrs.dataParagraphId };
          },
        },
      },
    }];
  },
});

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '请输入内容...' },
  editable: { type: Boolean, default: true },
  sections: { type: Array, default: () => [] },
  checkParagraphIds: { type: Array, default: () => [] },
  commentMarkers: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:modelValue', 'selection-change', 'section-change', 'import-word', 'export-word', 'comment-paragraph-click', 'locate-failed']);

const editorScrollRef = ref(null);
const highlightOverlayRef = ref(null);
const commentUnderlineLayerRef = ref(null);
const highlightOverlayActive = ref(false);
const activeSection = ref('');
const autoSaveTime = ref('');
let navScrollLock = false;
let overlayCleanup = null;
let commentUnderlineRaf = 0;

const updateAutoSaveTime = () => {
  const now = new Date();
  autoSaveTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const getEditorRoot = () => {
  const view = editor.value?.view;
  return view?.dom ?? editorScrollRef.value;
};

const queryInEditor = (selector) => {
  const root = getEditorRoot();
  return root ? root.querySelector(selector) : document.querySelector(selector);
};

const queryAllInEditor = (selector) => {
  const root = getEditorRoot();
  return root ? Array.from(root.querySelectorAll(selector)) : Array.from(document.querySelectorAll(selector));
};

const injectCheckMarkers = () => {
  queryAllInEditor('[data-check-marked]').forEach(el => {
    el.style.borderLeft = '';
    el.style.paddingLeft = '';
    el.style.marginLeft = '';
    el.removeAttribute('data-check-marked');
  });
  for (const item of props.checkParagraphIds) {
    const el = queryInEditor(`[data-paragraph-id="${item.paragraphId}"]`);
    if (el) {
      el.setAttribute('data-check-marked', item.severity);
      const color = item.severity === 'error' ? '#EF4444' : '#F59E0B';
      el.style.borderLeft = `3px solid ${color}`;
      el.style.paddingLeft = '12px';
      el.style.marginLeft = '-15px';
    }
  }
};

const injectCommentMarkers = () => {
  queryAllInEditor('[data-comment-marked]').forEach(el => {
    el.style.cursor = '';
    el.removeAttribute('data-comment-marked');
    el.classList.remove('comment-marker');
  });
  for (const marker of props.commentMarkers) {
    const el = queryInEditor(`[data-paragraph-id="${marker.paragraphId}"]`);
    if (el) {
      el.setAttribute('data-comment-marked', 'true');
      el.classList.add('comment-marker');
      el.style.cursor = 'pointer';
    }
  }
};

const findTextRangeInElement = (el, text) => {
  const target = text.trim();
  if (!target) return null;
  const fullText = el.textContent || '';
  const start = fullText.indexOf(target);
  if (start === -1) return null;
  const end = start + target.length;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let textNode = walker.nextNode();
  let current = 0;
  let startNode = null;
  let endNode = null;
  let startOffset = 0;
  let endOffset = 0;
  while (textNode) {
    const value = textNode.textContent || '';
    const next = current + value.length;
    if (!startNode && start >= current && start <= next) {
      startNode = textNode;
      startOffset = Math.max(0, start - current);
    }
    if (!endNode && end >= current && end <= next) {
      endNode = textNode;
      endOffset = Math.max(0, end - current);
    }
    if (startNode && endNode) break;
    current = next;
    textNode = walker.nextNode();
  }
  if (!startNode || !endNode) return null;
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  return range;
};

const renderCommentUnderlines = () => {
  const layer = commentUnderlineLayerRef.value;
  const container = editorScrollRef.value;
  if (!layer || !container) return;
  layer.innerHTML = '';
  const cr = container.getBoundingClientRect();
  for (const marker of props.commentMarkers) {
    const el = tryFindEl(marker.paragraphId);
    if (!el) continue;
    const range = marker.selectedText ? findTextRangeInElement(el, marker.selectedText) : null;
    const rects = range ? Array.from(range.getClientRects()) : [el.getBoundingClientRect()];
    for (const rect of rects) {
      if (!rect.width || !rect.height) continue;
      const line = document.createElement('span');
      line.className = 'comment-underline-line';
      line.style.left = (rect.left - cr.left + container.scrollLeft) + 'px';
      line.style.top = (rect.bottom - cr.top + container.scrollTop - 2) + 'px';
      line.style.width = rect.width + 'px';
      layer.appendChild(line);
    }
  }
};

const scheduleCommentUnderlineRender = () => {
  if (commentUnderlineRaf) return;
  commentUnderlineRaf = requestAnimationFrame(() => {
    commentUnderlineRaf = 0;
    renderCommentUnderlines();
  });
};

const injectAllMarkers = () => {
  injectCheckMarkers();
  injectCommentMarkers();
};

let autoSaveInterval;

onMounted(() => {
  updateAutoSaveTime();
  autoSaveInterval = setInterval(updateAutoSaveTime, 30000);
  setTimeout(injectAllMarkers, 300);
  setTimeout(renderCommentUnderlines, 320);
  window.addEventListener('resize', scheduleCommentUnderlineRender);
});

const editor = useEditor({
  content: props.modelValue,
  editable: props.editable,
  extensions: [
    StarterKit,
    Underline,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({ placeholder: props.placeholder }),
    Typography,
    ParagraphIdAttr
  ],
  onCreate: () => {
    nextTick(injectAllMarkers);
  },
  onUpdate: ({ editor: e }) => {
    emit('update:modelValue', e.getHTML());
    updateAutoSaveTime();
    nextTick(() => {
      injectAllMarkers();
      scheduleCommentUnderlineRender();
    });
  },
  onSelectionUpdate: ({ editor: e }) => {
    const { from, to } = e.state.selection;
    const domSelection = window.getSelection();
    if (domSelection && domSelection.rangeCount > 0 && !domSelection.isCollapsed) {
      const range = domSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      emit('selection-change', {
        range: { from, to, empty: false },
        position: { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height }
      });
    } else {
      emit('selection-change', { range: { from, to, empty: true }, position: null });
    }
  }
});

watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue, false);
  }
});

watch(() => props.editable, (newValue) => {
  if (editor.value) editor.value.setEditable(newValue);
});

onBeforeUnmount(() => {
  if (editor.value) editor.value.destroy();
  clearInterval(autoSaveInterval);
  window.removeEventListener('resize', scheduleCommentUnderlineRender);
  if (commentUnderlineRaf) cancelAnimationFrame(commentUnderlineRaf);
});

const currentHeading = computed(() => {
  if (!editor.value) return 'p';
  if (editor.value.isActive('heading', { level: 1 })) return '1';
  if (editor.value.isActive('heading', { level: 2 })) return '2';
  if (editor.value.isActive('heading', { level: 3 })) return '3';
  return 'p';
});

const setHeading = (event) => {
  const value = event.target.value;
  if (!editor.value) return;
  if (value === 'p') {
    editor.value.chain().focus().setParagraph().run();
  } else {
    editor.value.chain().focus().toggleHeading({ level: parseInt(value) }).run();
  }
};

const handleSectionClick = (key) => {
  navScrollLock = true;
  activeSection.value = key;
  scrollToParagraph(key);
  emit('section-change', key);
  setTimeout(() => { navScrollLock = false; }, 800);
};

const handleEditorScroll = () => {
  scheduleCommentUnderlineRender();
  if (navScrollLock) return;
  if (!editorScrollRef.value || !props.sections || props.sections.length === 0) return;
  const containerTop = editorScrollRef.value.getBoundingClientRect().top + 60;

  let currentKey = props.sections[0]?.key || '';
  for (const sec of props.sections) {
    const el = queryInEditor(`[data-paragraph-id="${sec.key}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= containerTop) {
        currentKey = sec.key;
      }
    }
  }

  if (currentKey !== activeSection.value) {
    activeSection.value = currentKey;
    emit('section-change', currentKey);
  }
};

watch(() => props.checkParagraphIds, () => { nextTick(injectCheckMarkers); }, { deep: true });
watch(() => props.commentMarkers, () => {
  nextTick(() => {
    injectCommentMarkers();
    scheduleCommentUnderlineRender();
  });
}, { deep: true });

const handleContentClick = (e) => {
  const target = e.target;
  const markerEl = target.closest('.comment-marker');
  if (markerEl) {
    const pid = markerEl.getAttribute('data-paragraph-id');
    if (pid) emit('comment-paragraph-click', pid);
  }
};

const showHighlightOverlay = (target, type) => {
  if (overlayCleanup) overlayCleanup();
  const overlay = highlightOverlayRef.value;
  const container = editorScrollRef.value;
  if (!overlay || !container) return;

  const updatePos = () => {
    const tr = target instanceof Range ? target.getBoundingClientRect() : target.getBoundingClientRect();
    const cr = container.getBoundingClientRect();
    overlay.style.top = (tr.top - cr.top + container.scrollTop) + 'px';
    overlay.style.left = (tr.left - cr.left + container.scrollLeft) + 'px';
    overlay.style.width = tr.width + 'px';
    overlay.style.height = tr.height + 'px';
  };

  overlay.className = 'highlight-overlay highlight-overlay-' + type;
  overlay.style.background = type === 'check-error' ? 'rgba(239,68,68,0.25)'
    : type === 'check-warning' ? 'rgba(245,158,11,0.25)'
    : 'rgba(251,191,36,0.35)';
  updatePos();
  highlightOverlayActive.value = true;

  const onScroll = () => updatePos();
  container.addEventListener('scroll', onScroll);
  const t = setTimeout(() => {
    highlightOverlayActive.value = false;
    container.removeEventListener('scroll', onScroll);
    overlayCleanup = null;
  }, 5500);
  overlayCleanup = () => {
    clearTimeout(t);
    container.removeEventListener('scroll', onScroll);
    highlightOverlayActive.value = false;
    overlayCleanup = null;
  };
};

const tryFindEl = (paragraphId) => {
  let el = queryInEditor(`[data-paragraph-id="${paragraphId}"]`) || document.querySelector(`[data-paragraph-id="${paragraphId}"]`);
  if (el) return el;
  const view = editor.value?.view;
  if (view) {
    let found = null;
    view.state.doc.descendants((node, pos) => {
      if (node.attrs?.dataParagraphId === paragraphId) {
        const dom = view.nodeDOM(pos);
        if (dom) found = dom;
      }
    });
    return found;
  }
  return null;
};

const resolveHighlightTarget = (paragraphId, targetText = '') => {
  const paragraphEl = tryFindEl(paragraphId);
  if (!paragraphEl) return null;
  const range = targetText ? findTextRangeInElement(paragraphEl, targetText) : null;
  if (range) return { paragraphEl, target: range };
  return { paragraphEl, target: paragraphEl };
};

const scrollToCheckParagraph = (paragraphId, severity, targetText = '') => {
  let resolved = resolveHighlightTarget(paragraphId, targetText);
  if (!resolved) {
    setTimeout(() => {
      resolved = resolveHighlightTarget(paragraphId, targetText);
      if (resolved) doCheckHighlight(resolved.paragraphEl, resolved.target, severity);
      else emit('locate-failed', paragraphId);
    }, 150);
    return;
  }
  doCheckHighlight(resolved.paragraphEl, resolved.target, severity);
};

const doCheckHighlight = (paragraphEl, target, severity) => {
  paragraphEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => showHighlightOverlay(target, severity === 'error' ? 'check-error' : 'check-warning'), 180);
};

const scrollToCommentParagraph = (paragraphId, selectedText = '') => {
  let resolved = resolveHighlightTarget(paragraphId, selectedText);
  if (!resolved) {
    setTimeout(() => {
      resolved = resolveHighlightTarget(paragraphId, selectedText);
      if (resolved) doCommentHighlight(resolved.paragraphEl, resolved.target);
      else emit('locate-failed', paragraphId);
    }, 150);
    return;
  }
  doCommentHighlight(resolved.paragraphEl, resolved.target);
};

const doCommentHighlight = (paragraphEl, target) => {
  paragraphEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => showHighlightOverlay(target, 'comment'), 180);
};

const scrollToParagraph = (paragraphId) => {
  if (!editor.value) return;
  const el = queryInEditor(`[data-paragraph-id="${paragraphId}"]`) || queryInEditor(`[data-section-id="${paragraphId}"]`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlightParagraph(paragraphId);
  }
};

const highlightParagraph = (paragraphId) => {
  const el = queryInEditor(`[data-paragraph-id="${paragraphId}"]`) || queryInEditor(`[data-section-id="${paragraphId}"]`);
  if (el) {
    el.classList.add('temp-highlight');
    setTimeout(() => el.classList.remove('temp-highlight'), 6000);
  }
};

const insertContentAndHighlight = (html) => {
  if (!editor.value) return;
  editor.value.chain().focus().insertContent(html).scrollIntoView().run();

  nextTick(() => {
    try {
      const sel = window.getSelection();
      if (!sel || !sel.focusNode) return;
      let node = sel.focusNode;
      while (node && node !== editorScrollRef.value) {
        if (node instanceof HTMLElement && /^(P|H[1-6]|DIV|LI)$/i.test(node.tagName) && !node.classList.contains('ProseMirror')) {
          node.scrollIntoView({ behavior: 'smooth', block: 'center' });
          node.classList.add('temp-highlight');
          const target = node;
          setTimeout(() => target.classList.remove('temp-highlight'), 6000);
          break;
        }
        node = node.parentNode;
      }
    } catch (_) { /* silent */ }
  });
};

const getSelectionRange = () => {
  if (!editor.value) return null;
  return editor.value.state.selection;
};

const replaceSelectionText = (text) => {
  if (!editor.value) return;
  editor.value.chain().focus().insertContent(text).run();
};

const getHTML = () => {
  if (!editor.value) return '';
  return editor.value.getHTML();
};

const setContent = (html) => {
  if (!editor.value) return;
  editor.value.commands.setContent(html, false);
};

defineExpose({
  scrollToParagraph,
  scrollToCheckParagraph,
  scrollToCommentParagraph,
  highlightParagraph,
  insertContentAndHighlight,
  getSelectionRange,
  replaceSelectionText,
  getHTML,
  setContent,
  editor
});
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  overflow: hidden;
  min-height: 0;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #fff;
  border-bottom: 1px solid var(--color-divider);
  flex-shrink: 0;
}
.toolbar-main {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
}
.toolbar-right {
  flex-shrink: 0;
  margin-left: 12px;
}
.auto-save-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #10B981;
  white-space: nowrap;
}

.toolbar-group {
  display: flex;
  gap: 4px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: var(--color-text-body);
  transition: all 0.2s;
}
.toolbar-btn:hover {
  background: var(--color-bg-body);
  color: var(--color-primary);
}
.toolbar-btn.is-active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}
.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: var(--color-divider);
  margin: 0 4px;
}
.toolbar-select {
  height: 28px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0 8px;
  font-size: 13px;
  color: var(--color-text-body);
  outline: none;
}

.section-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 16px;
  background: #fff;
  border-bottom: 1px solid var(--color-divider);
  flex-shrink: 0;
  overflow-x: auto;
}
.section-nav-item {
  padding: 4px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-sub);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.section-nav-item:hover {
  background: #f0f4ff;
  color: var(--color-primary);
}
.section-nav-item.active {
  background: var(--color-primary);
  color: #fff;
}

.editor-content-wrapper {
  position: relative;
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: block;
  min-height: 0;
}

.comment-underline-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
}

.comment-underline-line {
  position: absolute;
  display: block;
  height: 2px;
  border-radius: 2px;
  background: #FBBF24;
  opacity: 0.95;
}

.highlight-overlay {
  position: absolute;
  pointer-events: none;
  border-radius: 4px;
  z-index: 5;
  transition: opacity 0.3s ease-out;
}

:deep(.ProseMirror) { outline: none; }
:deep(.ProseMirror p) {
  margin-bottom: 1em;
  line-height: 1.8;
  text-indent: 2em;
  position: relative;
}
:deep(.ProseMirror h1), :deep(.ProseMirror h2), :deep(.ProseMirror h3) {
  margin-top: 1em;
  margin-bottom: 0.5em;
  line-height: 1.4;
  text-align: center;
  position: relative;
}
:deep(.ProseMirror ul), :deep(.ProseMirror ol) {
  padding-left: 2em;
  margin-bottom: 1em;
}
:deep(.ProseMirror blockquote) {
  border-left: 3px solid var(--color-primary);
  padding-left: 1em;
  margin-left: 0;
  color: var(--color-text-sub);
}
:deep(.ProseMirror hr) {
  border: none;
  border-top: 1px solid var(--color-divider);
  margin: 2em 0;
}
:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
:deep(.temp-highlight) {
  animation: highlight-fade 6s ease-out forwards;
}
@keyframes highlight-fade {
  0%, 83% { background-color: rgba(255, 255, 0, 0.4); }
  100% { background-color: transparent; }
}
:deep(.comment-marker) {
  cursor: pointer;
  transition: color 0.2s;
}
</style>

<style>
[data-highlight="check-error"] {
  background-color: rgba(239, 68, 68, 0.35) !important;
  border-radius: 2px;
}
[data-highlight="check-warning"] {
  background-color: rgba(245, 158, 11, 0.35) !important;
  border-radius: 2px;
}
[data-highlight="comment"] {
  background-color: rgba(251, 191, 36, 0.4) !important;
  border-right: 3px solid #F59E0B !important;
  border-radius: 2px;
}
</style>
