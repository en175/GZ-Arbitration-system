<script setup>
defineProps({
  risks: { type: Array, default: () => [] },
  suggestions: { type: Array, default: () => [] },
  evidences: { type: Array, default: () => [] },
})
</script>

<template>
  <aside class="ai-panel card-shell">
    <div class="ai-head">
      <div class="ai-title">AI 辅助面板</div>
      <el-tag type="primary" effect="plain">实时建议</el-tag>
    </div>
    <div class="ai-block">
      <div class="ai-block-title">风险提示</div>
      <ul>
        <li v-for="item in risks" :key="item">{{ item }}</li>
      </ul>
    </div>
    <div class="ai-block">
      <div class="ai-block-title">处理建议</div>
      <ul>
        <li v-for="item in suggestions" :key="item">{{ item }}</li>
      </ul>
    </div>
    <div class="ai-block">
      <div class="ai-block-title">依据片段</div>
      <ul>
        <li v-for="item in evidences" :key="item">{{ item }}</li>
      </ul>
    </div>
  </aside>
</template>
