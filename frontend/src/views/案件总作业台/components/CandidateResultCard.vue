<template>
  <div
    v-if="visible"
    class="candidate-card wb-card"
    :style="{ top: `${position.top}px`, left: `${position.left}px` }"
    @mousedown.stop
  >
    <div class="card-header">
      <span class="header-title">AI 生成结果</span>
      <span class="close-btn" @click="$emit('close')">×</span>
    </div>
    <div class="card-content">{{ content }}</div>
    <div class="card-footer">
      <button class="wb-btn" @click="$emit('copy')">复制</button>
      <button class="wb-btn wb-btn-primary" @click="$emit('replace')">替换选中文本</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  content: String,
  position: {
    type: Object,
    default: () => ({ top: 0, left: 0 })
  }
});

defineEmits(['close', 'copy', 'replace']);
</script>

<style scoped>
.candidate-card {
  position: fixed;
  z-index: 1002;
  width: 400px;
  max-width: 90vw;
  box-shadow: var(--shadow-xl);
  animation: fadeIn 0.2s ease-out;
  display: flex;
  flex-direction: column;
}
.card-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-divider);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-page);
  border-top-left-radius: var(--radius-md);
  border-top-right-radius: var(--radius-md);
}
.header-title { font-size: 14px; font-weight: 600; color: var(--text-main); }
.close-btn {
  cursor: pointer;
  font-size: 18px;
  color: var(--color-text-sub);
  line-height: 1;
}
.close-btn:hover { color: var(--text-main); }
.card-content {
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-body);
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
}
.card-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--color-divider);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  background: #fff;
  border-bottom-left-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
