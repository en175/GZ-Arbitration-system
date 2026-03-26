<template>
  <div class="pdf-cover-page">
    <div v-if="loading" class="pdf-cover-loading">
      <span>封面加载中…</span>
    </div>
    <canvas v-show="!loading" ref="canvasRef" class="pdf-cover-canvas" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
// Vite ?url 让 Vite 正确处理模块 worker 路径
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

const props = defineProps({
  src: { type: String, required: true },
})

const canvasRef = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const pdf = await pdfjsLib.getDocument({
      url: props.src,
      verbosity: 0,
    }).promise

    const page = await pdf.getPage(1)

    const desiredWidth = 860
    const viewport = page.getViewport({ scale: 1 })
    const scale = desiredWidth / viewport.width
    const scaled = page.getViewport({ scale })

    const canvas = canvasRef.value
    canvas.width = scaled.width
    canvas.height = scaled.height

    await page.render({
      canvasContext: canvas.getContext('2d'),
      viewport: scaled,
    }).promise

    loading.value = false
  } catch (e) {
    console.error('[PdfPageCover] 渲染失败:', e)
    // 渲染失败时隐藏加载提示，显示空白
    loading.value = false
  }
})
</script>

<style scoped>
.pdf-cover-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  /* 负边距抵消 editor-content-wrapper 的 24px padding，让封面铺满宽度 */
  margin: -24px -24px 0 -24px;
  padding: 0;
}

.pdf-cover-canvas {
  width: 100%;
  display: block;
}

.pdf-cover-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
  color: #bbb;
  font-size: 14px;
}
</style>
