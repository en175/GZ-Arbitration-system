<template>
  <div
    v-if="visible"
    class="floating-toolbar"
    :style="{ top: `${position.top}px`, left: `${position.left}px` }"
    @mousedown.stop
  >
    <div
      v-for="action in filteredActions"
      :key="action.key"
      class="toolbar-item"
      :style="{ '--hover-color': action.color }"
      @click="handleClick(action)"
    >
      <span class="icon-dot" :style="{ background: action.color }"></span>
      <span>{{ action.label }}</span>
    </div>
    <div class="divider"></div>
    <div class="toolbar-item comment-btn" @click="$emit('add-comment')">
      <span class="icon-dot" style="background: #F59E0B;"></span>
      <span>审签批注</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { AI_ACTIONS } from './docWriterConfig.js';

defineProps({
  visible: Boolean,
  position: {
    type: Object,
    default: () => ({ top: 0, left: 0 })
  }
});

const emit = defineEmits(['action', 'add-comment']);

const filteredActions = computed(() =>
  AI_ACTIONS.filter(a => !['translate', 'check'].includes(a.key))
);

const handleClick = (action) => {
  emit('action', action);
};
</script>

<style scoped>
.floating-toolbar {
  position: fixed;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  padding: 6px;
  border: 1px solid var(--color-border);
  animation: fadeIn var(--transition-normal);
}
.toolbar-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-body);
  transition: all var(--transition-fast);
  height: 32px;
  line-height: 1;
  white-space: nowrap;
}
.toolbar-item:hover {
  background: var(--color-bg-body);
  color: var(--hover-color, var(--color-primary));
}
.comment-btn:hover { background: #FFFBEB; color: #F59E0B; }
.icon-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.divider {
  width: 1px;
  height: 20px;
  background: var(--color-divider);
  margin: 0 4px;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
