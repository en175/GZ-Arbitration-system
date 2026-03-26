<template>
  <div class="three-column-layout doc-review-page">
    <LeftCaseReviewPanel
      :summary="summary"
      :materials="materials"
      :reviewModules="reviewModules"
      :moduleDialogs="moduleDialogs"
      :activeModuleKey="activeModuleKey"
      @select-module="handleSelectModule"
    />
    <EditorArea
      v-model="content"
      :sections="sections"
      :editable="false"
    >
      <template #cover>
        <PdfPageCover src="/verdict-cover.pdf" />
      </template>
    </EditorArea>
    <RightAiAnalysisPanel
      :results="analysisResults"
      :activeModuleKey="activeModuleKey"
      :moduleInsights="moduleInsights"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LeftCaseReviewPanel from './LeftCaseReviewPanel.vue';
import EditorArea from '@/components/editor/EditorArea.vue';
import PdfPageCover from '@/components/editor/PdfPageCover.vue';
import RightAiAnalysisPanel from './RightAiAnalysisPanel.vue';

import {
  MOCK_CASE_SUMMARY,
  MOCK_MATERIALS_REVIEW,
  MOCK_ANALYSIS_RESULTS,
  REVIEW_MODULES,
  MODULE_INSIGHTS,
  REVIEW_MODULE_DIALOGS
} from './docReviewConfig.js';

import { DOC_SECTIONS, MOCK_EDITOR_CONTENT } from './docWriterConfig.js';

const summary = MOCK_CASE_SUMMARY;
const materials = MOCK_MATERIALS_REVIEW;
const reviewModules = REVIEW_MODULES;
const moduleDialogs = REVIEW_MODULE_DIALOGS;
const moduleInsights = MODULE_INSIGHTS;
const analysisResults = MOCK_ANALYSIS_RESULTS;
const sections = DOC_SECTIONS;

const activeModuleKey = ref(reviewModules[0]?.key || 'coreClaim');
const content = ref(MOCK_EDITOR_CONTENT);

const handleSelectModule = (module) => {
  activeModuleKey.value = module.key;
};
</script>

<style scoped>
.doc-review-page {
  background: var(--bg-page);
}
.doc-review-page :deep(.panel-header) {
  background: var(--gradient-primary);
  border-bottom: 1px solid rgba(100, 130, 210, 0.3);
  color: rgba(255, 255, 255, 0.95);
  font-weight: 700;
}
.doc-review-page :deep(.panel-header span) {
  color: rgba(255, 255, 255, 0.95);
}
.doc-review-page :deep(.editor-toolbar) {
  display: none;
}
</style>
