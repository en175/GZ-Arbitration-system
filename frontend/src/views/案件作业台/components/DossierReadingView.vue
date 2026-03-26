<template>
  <div class="dossier-view">

    <!-- 左侧面板 -->
    <aside class="dossier-left">
      <div class="panel-header">智能阅卷</div>
      <div class="panel-body">

        <!-- 当前审查请求 -->
        <div class="current-req-card">
          <div class="cur-req-label">当前审查请求</div>
          <div class="cur-req-text">{{ currentRequest.requestStatement }}</div>
        </div>

        <!-- 仲裁请求列表 -->
        <div class="section-head">
          <span class="section-title">仲裁请求</span>
          <span class="section-count">{{ requests.length }} 项</span>
        </div>
        <div class="req-list">
          <button
            v-for="req in requests"
            :key="req.id"
            class="req-item"
            :class="{ active: selectedRequestId === req.id }"
            @click="selectedRequestId = req.id"
          >
            <div class="req-top">
              <span class="req-title">{{ req.title }}</span>
              <span class="req-strength" :class="req.evidenceStrength">{{ strengthText(req.evidenceStrength) }}</span>
            </div>
            <div class="req-text">{{ req.requestStatement }}</div>
            <div class="req-meta">
              <span>要件 {{ req.elementCount }} 项</span>
              <span>{{ req.hasDefense ? `抗辩 ${req.defenseCount} 条` : '无抗辩' }}</span>
            </div>
          </button>
        </div>

        <!-- 在卷材料 -->
        <div class="section-head" style="margin-top:16px">
          <span class="section-title">在卷证据材料</span>
          <span class="section-count">{{ materials.length }} 份</span>
        </div>
        <div class="material-list">
          <div
            v-for="mat in materials"
            :key="mat.id"
            class="material-item"
            :class="{ active: selectedMaterialId === mat.id }"
            @click="openMaterialPreview(mat)"
          >
            <div class="mat-title-row">
              <span class="mat-title">{{ mat.title }}</span>
              <span class="mat-badge" :class="reliabilityClass(mat.reliability)">{{ reliabilityText(mat.reliability) }}</span>
            </div>
            <div class="mat-meta">{{ mat.source }} · {{ mat.format }} · {{ mat.fileSize }}</div>
          </div>
        </div>

      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="dossier-main" ref="mainRef">

      <!-- 案情摘要卡 -->
      <section class="summary-section">
        <div class="summary-grid">
          <div v-for="item in caseSummary" :key="item.label" class="summary-item" :class="{ full: item.span === 'full' }">
            <div class="sum-label">{{ item.label }}</div>
            <div class="sum-value">{{ item.value }}</div>
          </div>
        </div>
      </section>

      <!-- 争议事实时序 -->
      <section class="timeline-section">
        <div class="sec-head">
          <div>
            <h3 class="sec-title">争议事实时序</h3>
            <div class="sec-tip">点击时间节点，联动下方请求要件和事实</div>
          </div>
        </div>
        <div class="timeline-row">
          <button
            v-for="item in relatedTimeline"
            :key="item.id"
            class="tl-item"
            :class="{ active: activeTimelineId === item.id }"
            @click="activeTimelineId = item.id"
          >
            <div class="tl-date">{{ item.date }}</div>
            <div class="tl-title">{{ item.title }}</div>
            <div class="tl-detail">{{ item.detail }}</div>
            <div class="tl-tags">
              <span v-for="tag in item.tags" :key="tag" class="tl-tag" :class="tag">{{ tagText(tag) }}</span>
            </div>
          </button>
        </div>
      </section>

      <!-- 请求要件区域 -->
      <section class="request-section">
        <div class="sec-head">
          <div>
            <h3 class="sec-title">{{ currentRequest.title }}</h3>
            <div class="sec-tip">{{ currentRequest.reviewHint }}</div>
          </div>
        </div>

        <div
          v-for="(element, eIdx) in currentRequest.elements"
          :key="element.id"
          :id="`element-${element.id}`"
          class="element-block"
          :class="element.status"
        >
          <div class="element-head">
            <div>
              <div class="element-title">要件{{ eIdx + 1 }}：{{ element.title }}</div>
              <div class="element-desc">{{ element.description }}</div>
            </div>
            <span class="element-badge" :class="element.status">{{ elementStatusText(element.status) }}</span>
          </div>

          <div class="element-grid">
            <!-- 申请方事实/证据列 -->
            <div class="facts-col">
              <div class="col-head applicant">
                <span class="role-badge applicant-badge">申请方</span>
                <span class="role-text">主张 / 事实证据</span>
              </div>
              <div
                v-for="fact in element.facts"
                :key="fact.id"
                :id="`fact-${fact.id}`"
                class="fact-card"
                :class="{ active: activeTimelineFactIds.includes(fact.id) }"
              >
                <div class="fact-head">
                  <div>
                    <div class="fact-title">{{ fact.title }}</div>
                    <div class="fact-date">{{ fact.eventDate }}</div>
                  </div>
                  <span class="strength-badge" :class="fact.evidenceStrength">{{ strengthText(fact.evidenceStrength) }}</span>
                </div>
                <div class="fact-content">{{ fact.content }}</div>
                <div class="evidence-list">
                  <div v-for="ev in fact.evidences.slice(0,3)" :key="ev.id" class="ev-card">
                    <div class="ev-head">
                      <div>
                        <div class="ev-title">{{ ev.title }}</div>
                        <div class="ev-meta">{{ ev.source }} · {{ ev.position }}</div>
                      </div>
                      <span class="strength-badge sm" :class="ev.strength">{{ strengthText(ev.strength) }}</span>
                    </div>
                    <div class="ev-proving">证明方向：{{ ev.provingPoint }}</div>
                    <div class="ev-summary">{{ ev.summary }}</div>
                    <button class="ev-btn" @click="openEvidence(ev.id, element)">查看原文</button>
                  </div>
                  <div v-if="fact.evidences.length > 3" class="ev-more">另有 {{ fact.evidences.length - 3 }} 条证据…</div>
                </div>
              </div>
            </div>

            <!-- 被申请方抗辩列 -->
            <div class="defense-col">
              <div class="col-head respondent">
                <span class="role-badge respondent-badge">被申请方</span>
                <span class="role-text">抗辩 / 反驳依据</span>
                <span v-if="elementDefenses(element.id).length" class="defense-count-badge">{{ elementDefenses(element.id).length }} 条</span>
              </div>
              <template v-if="elementDefenses(element.id).length">
                <div
                  v-for="def in elementDefenses(element.id)"
                  :key="def.id"
                  class="defense-card"
                  :class="def.hitLevel"
                >
                  <div class="defense-head">
                    <span class="defense-type-badge">{{ defenseTypeText(def.type) }}</span>
                    <span class="hit-level-text" :class="def.hitLevel">{{ hitLevelText(def.hitLevel) }}</span>
                  </div>
                  <div class="defense-target">反驳对象：{{ def.targetName }}</div>
                  <div class="defense-point">抗辩要点：{{ def.point }}</div>
                  <div class="defense-content">{{ def.content }}</div>
                  <div class="defense-ev-label">证据原文</div>
                  <div class="defense-ev-quote">{{ def.evidenceExcerpt }}</div>
                  <div class="defense-source">来源：{{ def.source }}</div>
                </div>
              </template>
              <div v-else class="empty-defense">当前要件下暂无明确抗辩，可先根据事实和证据完成申请人主张链梳理。</div>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- 材料预览弹窗 -->
    <div v-if="showMaterialDialog && previewMaterial" class="dialog-overlay" @click.self="closeMaterialDialog">
      <div class="preview-dialog">
        <div class="dialog-header">
          <div>
            <div class="dialog-title">{{ previewMaterial.title }}</div>
            <div class="dialog-meta">
              <span class="meta-tag">{{ previewMaterial.format }}</span>
              <span class="meta-dot">·</span>
              <span class="meta-tag">{{ previewMaterial.fileSize }}</span>
              <span class="meta-dot">·</span>
              <span class="meta-tag">{{ previewMaterial.source }}</span>
            </div>
          </div>
          <button class="close-btn" @click="closeMaterialDialog">关闭</button>
        </div>
        <div class="dialog-body">
          <pre class="preview-content">{{ previewMaterial.previewContent }}</pre>
        </div>
      </div>
    </div>

    <!-- 证据原文弹窗 -->
    <div v-if="showTraceDialog && selectedEvidence" class="dialog-overlay" @click.self="closeTraceDialog">
      <div class="trace-dialog">
        <div class="dialog-header">
          <div>
            <div class="dialog-title">{{ selectedEvidence.title }}</div>
            <div class="dialog-meta">
              <span class="meta-tag">{{ selectedEvidence.source }}</span>
              <span class="meta-dot">·</span>
              <span class="meta-tag">{{ selectedEvidence.position }}</span>
            </div>
          </div>
          <button class="close-btn" @click="closeTraceDialog">关闭</button>
        </div>
        <div class="trace-section">
          <div class="trace-label">证明方向</div>
          <div class="trace-content">{{ selectedEvidence.provingPoint }}</div>
        </div>
        <div class="trace-section">
          <div class="trace-label">证据摘要</div>
          <div class="trace-content">{{ selectedEvidence.summary }}</div>
        </div>
        <div class="trace-section">
          <div class="trace-label">证据原文</div>
          <div class="trace-content raw">{{ selectedEvidenceAnchor }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// ===== Mock 数据（基于案例：新菱空调 vs 广东恒力，买卖合同纠纷）=====

const materials = [
  {
    id: 'm1', title: '仲裁申请书', format: 'PDF', fileSize: '1.8 MB', source: '申请人', reliability: 'high',
    previewContent: `仲裁申请书\n\n申请人：新菱空调（佛冈）有限公司\n被申请人：广东恒力建设工程有限公司\n\n仲裁请求：\n一、请求裁决被申请人支付货款人民币82,957.70元；\n二、请求裁决被申请人支付自2025年12月9日起至实际付款之日止，按贷款市场报价利率计算的逾期付款利息；\n三、请求裁决本案仲裁费用由被申请人承担。\n\n事实与理由：\n2025年10月12日，申请人与被申请人签订《空调设备采购合同》，约定申请人向被申请人供应空调设备及配件，合同总价人民币82,957.70元，被申请人应于收货验收后30日内一次性付清货款。\n\n申请人按合同约定于2025年11月8日完成全部货物交付，被申请人收货后在送货单上签字确认，但此后以"部分设备型号不符"为由拒绝付款，货款至今分文未付。\n\n申请人于2025年12月5日向被申请人发出催款函，要求于3日内支付全部货款，快递单据显示已于2025年12月6日签收。`
  },
  {
    id: 'm2', title: '被申请人答辩书', format: 'PDF', fileSize: '1.2 MB', source: '被申请人', reliability: 'high',
    previewContent: `答辩书\n\n答辩人：广东恒力建设工程有限公司\n\n针对申请人新菱空调（佛冈）有限公司提出的仲裁请求，答辩人答辩如下：\n\n一、关于货款支付请求\n答辩人不同意支付全部货款，理由如下：\n1. 到货后发现约20%设备型号与合同约定不符，部分机组制冷量偏低，已于2025年11月15日向申请人发出书面质量异议；\n2. 申请人主张总额与合同附件价格清单存在约300元差异，请求核实后再计算。\n\n二、关于质量异议时效\n答辩人于收货后7日内（2025年11月15日）已发出书面质量异议，符合合同约定期限。`
  },
  {
    id: 'm3', title: '空调设备采购合同', format: 'PDF', fileSize: '2.6 MB', source: '双方签署', reliability: 'high',
    previewContent: `空调设备采购合同\n\n甲方（买方）：广东恒力建设工程有限公司\n乙方（卖方）：新菱空调（佛冈）有限公司\n\n第一条 合同标的\n乙方向甲方供应空调设备及配件，具体规格型号详见合同附件价格清单。\n\n第二条 合同金额\n合同总价款人民币82,957.70元（大写：捌万贰仟玖佰伍拾柒元柒角整）。\n\n第三条 付款方式\n甲方应于收货验收后30日内一次性付清全部货款。\n\n第四条 质量验收\n甲方应于收货后7日内以书面形式提出质量异议，逾期视为验收合格。\n\n第十一条 争议解决\n因本合同发生争议，双方同意提交广州仲裁委员会仲裁解决。\n\n签约日期：2025年10月12日`
  },
  {
    id: 'm4', title: '送货单与签收回执', format: 'PDF', fileSize: '980 KB', source: '申请人', reliability: 'high',
    previewContent: `送货单\n\n送货日期：2025年11月8日\n送货单位：新菱空调（佛冈）有限公司\n收货单位：广东恒力建设工程有限公司\n\n货物明细：（详见附件价格清单）\n合计金额：人民币82,957.70元\n\n签收回执\n收货时间：2025年11月8日\n收货人员签字：（签字）\n收货人员盖章：（章）\n\n备注：数量点清，待质量验收\n\n注：送货单载明2025年11月8日完成全部合同货物交付，签收回执有被申请人收货人员签字盖章，备注"数量点清，待质量验收"，未注明任何当场质量异议。`
  },
  {
    id: 'm5', title: '催款函及快递回执', format: 'PDF', fileSize: '640 KB', source: '申请人', reliability: 'high',
    previewContent: `催款函\n\n发函日期：2025年12月5日\n致：广东恒力建设工程有限公司\n\n贵司于2025年11月8日签收我司供应的全部空调设备，按合同约定应于2025年12月8日前支付货款人民币82,957.70元。截至今日，贵司仍未支付任何货款，已构成违约。\n\n现郑重催告：请贵司于本函送达后3日内支付全部货款，逾期我司将依法追究全部违约责任。\n\n申请人：新菱空调（佛冈）有限公司\n\n快递回执\n快递单号：SF1234567890\n发件日期：2025年12月5日\n签收日期：2025年12月6日\n签收人：（签字）`
  },
  {
    id: 'm6', title: '质量异议函（被申请人）', format: 'PDF', fileSize: '420 KB', source: '被申请人', reliability: 'medium',
    previewContent: `质量异议函\n\n发函日期：2025年11月15日\n致：新菱空调（佛冈）有限公司\n\n我司于2025年11月8日收到贵司供应的空调设备，经清点验收，发现部分设备型号与合同约定不符，约20%机组制冷量偏低，与合同附件技术参数存在偏差。\n\n特此提出书面质量异议，请贵司就上述问题予以说明并提出解决方案。\n\n被申请人：广东恒力建设工程有限公司\n\n注：发函日期2025年11月15日距签收日2025年11月8日已达7日，时效认定存临界争议。且未附第三方检测报告，仅附被申请人自制型号对比表，证明力不足。`
  },
  {
    id: 'm7', title: '庭审笔录（2026-04-15）', format: 'PDF', fileSize: '3.1 MB', source: '仲裁庭', reliability: 'high',
    previewContent: `庭审笔录\n\n案号：（2026）粤仲案字第5412号\n案由：买卖合同纠纷\n开庭时间：2026年4月15日上午9:30\n开庭地点：广州仲裁委员会第三仲裁庭\n独任仲裁员：陈某某\n\n申请人出庭：委托代理人黄德伟（律师）\n被申请人：经合法通知未出庭，缺席审理\n\n一、申请人陈述\n申请人代理人：申请人与被申请人于2025年10月12日签订采购合同，被申请人于2025年11月8日签收全部货物，付款期届满后至今未付任何货款。被申请人所称质量异议已超合同约定7日期限，且未提供第三方检测报告，抗辩不能成立。\n\n二、缺席审理\n被申请人经合法通知后未出庭，仲裁庭依规缺席审理，视为放弃答辩权利及质证机会。`
  }
]

const caseSummary = [
  { label: '案号', value: '（2026）粤仲案字第5412号' },
  { label: '案由', value: '买卖合同纠纷' },
  { label: '申请人', value: '新菱空调（佛冈）有限公司' },
  { label: '被申请人', value: '广东恒力建设工程有限公司' },
  { label: '当前争议焦点', value: '被申请人质量异议是否成立（时效 + 证明力）；货款支付义务是否已触发；逾期利息起算日期认定。', span: 'full' },
  { label: '当前主审请求', value: '请求1：请求裁决被申请人支付货款人民币82,957.70元', span: 'full' }
]

const timeline = [
  { id: 'tl1', date: '2025-10-12', title: '签订采购合同', detail: '双方签订《空调设备采购合同》，约定货款82,957.70元，收货后30日内付清。', requestIds: ['req1', 'req2'], targetElementIds: ['el11', 'el21'], targetFactIds: ['f11', 'f21'], tags: ['coreFact'] },
  { id: 'tl2', date: '2025-11-08', title: '交付货物并签收', detail: '申请人完成全部交付，被申请人签收，备注"数量点清，待质量验收"。', requestIds: ['req1', 'req2'], targetElementIds: ['el12'], targetFactIds: ['f12', 'f22'], tags: ['coreFact'] },
  { id: 'tl3', date: '2025-11-15', title: '被申请人发出质量异议函', detail: '距签收日第7日，被申请人发出质量异议函，无第三方检测报告。', requestIds: ['req1'], targetElementIds: ['el13'], targetFactIds: ['f13'], tags: ['defenseHit', 'evidenceWeak'] },
  { id: 'tl4', date: '2025-12-08', title: '付款期届满未付', detail: '收货后30日付款期届满，被申请人未支付任何货款。', requestIds: ['req1', 'req2'], targetElementIds: ['el12', 'el21'], targetFactIds: ['f12', 'f21'], tags: ['coreFact'] },
  { id: 'tl5', date: '2025-12-09', title: '逾期起算日', detail: '付款期届满翌日，申请人主张自此起算逾期利息。', requestIds: ['req2'], targetElementIds: ['el21', 'el22'], targetFactIds: ['f21', 'f22'], tags: ['coreFact'] },
  { id: 'tl6', date: '2025-12-06', title: '催款函送达', detail: '申请人催款函已由被申请人工作人员签收，确认催告程序合法有效。', requestIds: ['req1', 'req2'], targetElementIds: ['el12'], targetFactIds: ['f12'], tags: ['coreFact'] },
  { id: 'tl7', date: '2026-04-15', title: '开庭审理', detail: '申请人代理人出庭，被申请人缺席，仲裁庭依规缺席审理。', requestIds: ['req1', 'req2', 'req3'], targetElementIds: ['el13', 'el31'], targetFactIds: ['f13', 'f31'], tags: ['coreFact', 'defenseHit'] }
]

const requests = [
  { id: 'req1', title: '请求1', requestStatement: '支付货款人民币82,957.70元', evidenceStrength: 'strong', hasDefense: true, elementCount: 3, defenseCount: 2 },
  { id: 'req2', title: '请求2', requestStatement: '支付逾期付款利息（自2025-12-09起）', evidenceStrength: 'medium', hasDefense: true, elementCount: 2, defenseCount: 1 },
  { id: 'req3', title: '请求3', requestStatement: '仲裁费用由被申请人承担', evidenceStrength: 'medium', hasDefense: false, elementCount: 1, defenseCount: 0 }
]

const workbench = [
  {
    id: 'req1',
    title: '请求1：支付货款82,957.70元',
    requestStatement: '支付货款人民币82,957.70元',
    reviewHint: '本请求重点核查合同关系、交付义务是否已履行、质量异议时效是否成立，以判断被申请人付款义务是否已触发。',
    elements: [
      {
        id: 'el11',
        title: '合同关系及履约义务是否成立',
        description: '需确认买卖合同有效成立，申请人已按约完成供货义务。',
        status: 'supported',
        facts: [
          {
            id: 'f11',
            title: '双方签订《空调设备采购合同》',
            eventDate: '2025-10-12',
            content: '双方于2025年10月12日签订合同，约定货款总价82,957.70元，付款方式为收货验收后30日内一次性付清。',
            evidenceStrength: 'strong',
            evidences: [
              { id: 'ev11', title: '空调设备采购合同', source: '双方签署', position: '第1-3页', provingPoint: '证明合同关系成立及付款义务', summary: '合同明确货款金额、付款期及验收程序。', anchorId: 'a1', strength: 'strong' }
            ]
          }
        ]
      },
      {
        id: 'el12',
        title: '申请人是否已完成交货义务',
        description: '需确认货物已按合同约定完整交付，被申请人已签收。',
        status: 'supported',
        facts: [
          {
            id: 'f12',
            title: '申请人于2025年11月8日完成全部交付',
            eventDate: '2025-11-08',
            content: '申请人完成全部货物交付，被申请人工作人员在送货单签字盖章，备注"数量点清"。',
            evidenceStrength: 'strong',
            evidences: [
              { id: 'ev12', title: '送货单与签收回执', source: '申请人提交', position: '第1-2页', provingPoint: '证明交货义务已完成履行', summary: '签收回执有被申请人收货人员签字盖章，仅备注待质量验收，未注明任何质量异议。', anchorId: 'a2', strength: 'strong' },
              { id: 'ev13', title: '催款函及快递回执', source: '申请人提交', position: '全文', provingPoint: '证明催告程序合法有效', summary: '催款函已于2025年12月6日由被申请人工作人员签收。', anchorId: 'a3', strength: 'strong' }
            ]
          }
        ]
      },
      {
        id: 'el13',
        title: '质量异议抗辩是否成立',
        description: '需审查被申请人质量异议是否在合同约定7日期限内提出，是否有充分证据支持。',
        status: 'contested',
        facts: [
          {
            id: 'f13',
            title: '被申请人质量异议函于第7日发出',
            eventDate: '2025-11-15',
            content: '被申请人于收货后第7日（2025年11月15日）发出质量异议函，合同约定异议期为7日内，时效认定存临界争议。',
            evidenceStrength: 'medium',
            evidences: [
              { id: 'ev14', title: '质量异议函', source: '被申请人提交', position: '全文', provingPoint: '核查质量异议时效及证明力', summary: '异议函日期2025-11-15，距签收日2025-11-08恰为第7日，时效临界。且无第三方检测报告，仅凭自制型号对比表，证明力不足。', anchorId: 'a4', strength: 'weak' }
            ]
          }
        ]
      }
    ],
    defenses: [
      {
        id: 'df11', targetElementId: 'el13', targetLabel: '质量异议是否成立', type: 'fact', targetName: '被申请人质量异议函', hitLevel: 'high',
        point: '被申请人主张质量异议已于7日内提出，据此主张暂停付款。',
        content: '被申请人抗辩称型号不符导致合同目的部分不能实现，质量异议构成付款抗辩。',
        source: '答辩书', evidenceExcerpt: '答辩书载明："已于2025年11月15日向申请人发出书面质量异议，部分机组制冷量偏低，与合同附件技术参数存在偏差，据此主张暂停付款直至质量争议解决。"'
      },
      {
        id: 'df12', targetElementId: 'el11', targetLabel: '合同金额认定', type: 'evidence', targetName: '合同附件价格清单', hitLevel: 'low',
        point: '被申请人称合同附件价格清单与申请人主张金额存在约300元差异。',
        content: '被申请人抗辩称存在约300元金额差异，但未提供具体计算依据，说服力不足。',
        source: '答辩书', evidenceExcerpt: '答辩书载明："申请人主张总额与合同附件价格清单存在约300元差异，请求核实后再计算。"'
      }
    ]
  },
  {
    id: 'req2',
    title: '请求2：支付逾期付款利息',
    requestStatement: '支付自2025年12月9日起的逾期付款利息',
    reviewHint: '本请求重点核查付款期届满日认定、逾期起算日期及利率标准，并关注被申请人对逾期利息的抗辩依据。',
    elements: [
      {
        id: 'el21',
        title: '付款期届满日及逾期事实',
        description: '需确认收货验收后30日付款期届满日，被申请人逾期未付的事实。',
        status: 'supported',
        facts: [
          {
            id: 'f21',
            title: '付款期届满日为2025年12月8日',
            eventDate: '2025-12-08',
            content: '签收日2025年11月8日起30日后，付款期届满日为2025年12月8日。被申请人至今未支付任何货款，逾期事实清晰。',
            evidenceStrength: 'strong',
            evidences: [
              { id: 'ev21', title: '空调设备采购合同', source: '双方签署', position: '第二条', provingPoint: '确认付款期届满日计算依据', summary: '合同约定收货验收后30日内付清，据此推算届满日为2025年12月8日。', anchorId: 'a1', strength: 'strong' }
            ]
          }
        ]
      },
      {
        id: 'el22',
        title: '利息起算日及利率标准',
        description: '需确认逾期利息自付款期届满翌日起算，利率按贷款市场报价利率计算。',
        status: 'pending',
        facts: [
          {
            id: 'f22',
            title: '申请人主张自2025年12月9日起算利息',
            eventDate: '2025-12-09',
            content: '申请人主张利息自2025年12月9日（付款期届满翌日）起，按全国银行间同业拆借中心公布的一年期贷款市场报价利率计算。',
            evidenceStrength: 'medium',
            evidences: [
              { id: 'ev22', title: '仲裁申请书', source: '申请人', position: '仲裁请求第二项', provingPoint: '明确利息起算日及利率标准', summary: '申请人在申请书中明确主张自付款期届满翌日起，按LPR计算逾期利息。', anchorId: 'a5', strength: 'medium' }
            ]
          }
        ]
      }
    ],
    defenses: [
      {
        id: 'df21', targetElementId: 'el22', targetLabel: '利息起算日认定', type: 'fact', targetName: '催告函签收日', hitLevel: 'medium',
        point: '被申请人认为质量异议构成付款条件未成就，逾期利息不应起算。',
        content: '被申请人抗辩称因质量争议尚未解决，付款条件未成就，不应计算逾期利息。',
        source: '答辩书', evidenceExcerpt: '答辩书载明："质量争议尚未解决，被申请人暂停付款具有合理依据，逾期利息请求不能成立。"'
      }
    ]
  },
  {
    id: 'req3',
    title: '请求3：仲裁费用承担',
    requestStatement: '本案仲裁费用由被申请人承担',
    reviewHint: '本请求依附前两项主请求的支持程度，若主要请求获支持则仲裁费由被申请人承担具有充分依据。',
    elements: [
      {
        id: 'el31',
        title: '主请求是否具备被支持基础',
        description: '若货款支付请求获支持，则仲裁费承担请求顺势成立。',
        status: 'pending',
        facts: [
          {
            id: 'f31',
            title: '仲裁费承担依附主请求审查结论',
            eventDate: '2026-04-15',
            content: '仲裁费用承担无独立事实链，主要依附于货款支付和逾期利息请求的支持程度。',
            evidenceStrength: 'medium',
            evidences: [
              { id: 'ev31', title: '仲裁申请书', source: '申请人', position: '仲裁请求第三项', provingPoint: '申请人将仲裁费列为第三项请求', summary: '仲裁申请书将仲裁费用承担列为第三项请求。', anchorId: 'a5', strength: 'medium' }
            ]
          }
        ]
      }
    ],
    defenses: []
  }
]

const originalAnchors = [
  { id: 'a1', content: '【空调设备采购合同 · 原文摘录】\n\n第二条 合同金额\n合同总价款人民币82,957.70元（大写：捌万贰仟玖佰伍拾柒元柒角整）。\n\n第三条 付款方式\n甲方应于收货验收后30日内一次性付清全部货款。\n\n第四条 质量验收\n甲方应于收货后7日内以书面形式提出质量异议，逾期视为验收合格。' },
  { id: 'a2', content: '【送货单 · 签收回执原文摘录】\n\n送货日期：2025年11月8日\n货物明细：空调设备及配件（详见附件）\n合计金额：人民币82,957.70元\n\n签收回执\n收货时间：2025年11月8日\n备注：数量点清，待质量验收\n\n（收货人签字盖章）' },
  { id: 'a3', content: '【催款函及快递回执 · 原文摘录】\n\n催款函发出日：2025年12月5日\n快递回执签收日：2025年12月6日\n签收人：（被申请人工作人员）\n\n催款函内容：截至今日，贵司仍未支付任何货款，请于本函送达后3日内支付全部货款82,957.70元。' },
  { id: 'a4', content: '【质量异议函 · 原文摘录】\n\n发函日期：2025年11月15日（收货后第7日）\n\n异议内容：约20%设备型号与合同约定不符，部分机组制冷量偏低。\n\n注：未附第三方检测报告，仅附被申请人自制型号对比表。合同约定"收货后7日内以书面形式提出质量异议，逾期视为验收合格"，本函发出日距签收日恰为第7日，时效认定存临界争议。' },
  { id: 'a5', content: '【仲裁申请书 · 仲裁请求摘录】\n\n仲裁请求：\n一、请求裁决被申请人支付货款人民币82,957.70元；\n二、请求裁决被申请人支付自2025年12月9日起至实际付款之日止，按全国银行间同业拆借中心公布的贷款市场报价利率计算的逾期付款利息；\n三、请求裁决本案仲裁费用由被申请人承担。' }
]

// ===== 响应式状态 =====
const selectedRequestId = ref(requests[0].id)
const selectedMaterialId = ref(materials[0].id)
const activeTimelineId = ref(
  timeline.find(t => t.requestIds.includes(requests[0].id))?.id || timeline[0].id
)

const showMaterialDialog = ref(false)
const previewMaterial = ref(null)
const showTraceDialog = ref(false)
const selectedEvidenceId = ref('')
const selectedEvidenceElement = ref(null)

// ===== 计算属性 =====
const currentRequest = computed(() => workbench.find(w => w.id === selectedRequestId.value) || workbench[0])

const relatedTimeline = computed(() => timeline.filter(t => t.requestIds.includes(selectedRequestId.value)))

const activeTimelineFactIds = computed(() => {
  if (!activeTimelineId.value) return []
  const tl = timeline.find(t => t.id === activeTimelineId.value)
  if (!tl || !tl.requestIds.includes(selectedRequestId.value)) return []
  return tl.targetFactIds
})

const selectedEvidence = computed(() => {
  if (!selectedEvidenceElement.value) return null
  return selectedEvidenceElement.value.facts
    .flatMap(f => f.evidences)
    .find(e => e.id === selectedEvidenceId.value)
})

const selectedEvidenceAnchor = computed(() => {
  const ev = selectedEvidence.value
  if (!ev) return ''
  return originalAnchors.find(a => a.id === ev.anchorId)?.content || '暂无对应原文'
})

// ===== 方法 =====
const elementDefenses = (elementId) => currentRequest.value.defenses.filter(d => d.targetElementId === elementId)

const openMaterialPreview = (mat) => {
  previewMaterial.value = mat
  selectedMaterialId.value = mat.id
  showMaterialDialog.value = true
}
const closeMaterialDialog = () => { showMaterialDialog.value = false }

const openEvidence = (evidenceId, element) => {
  selectedEvidenceId.value = evidenceId
  selectedEvidenceElement.value = element
  showTraceDialog.value = true
}
const closeTraceDialog = () => { showTraceDialog.value = false }

const strengthText = (v) => v === 'strong' ? '证据充分' : v === 'medium' ? '证据一般' : '证据薄弱'
const reliabilityText = (v) => v === 'high' ? '高可信' : v === 'medium' ? '中可信' : '待核验'
const reliabilityClass = (v) => v === 'high' ? 'badge-success' : v === 'medium' ? 'badge-warn' : 'badge-danger'
const tagText = (tag) => tag === 'coreFact' ? '核心事实' : tag === 'defenseHit' ? '存在抗辩' : '证据待补强'
const defenseTypeText = (v) => v === 'request' ? '针对请求' : v === 'fact' ? '针对事实' : '针对证据'
const hitLevelText = (v) => v === 'high' ? '击中关键要件' : v === 'medium' ? '需重点复核' : '一般抗辩'
const elementStatusText = (v) => v === 'supported' ? '已支撑' : v === 'contested' ? '被抗辩' : '待补强'

watch(selectedRequestId, (reqId) => {
  const tl = timeline.find(t => t.requestIds.includes(reqId))
  if (tl) activeTimelineId.value = tl.id
})

watch(activeTimelineId, (tlId) => {
  if (!tlId) return
  const tl = timeline.find(t => t.id === tlId)
  const targetFactId = tl?.targetFactIds.find(id =>
    currentRequest.value.elements.some(el => el.facts.some(f => f.id === id))
  )
  const targetElId = tl?.targetElementIds.find(id =>
    currentRequest.value.elements.some(el => el.id === id)
  )
  const nodeId = targetFactId ? `fact-${targetFactId}` : targetElId ? `element-${targetElId}` : ''
  if (!nodeId) return
  const el = document.getElementById(nodeId)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
})
</script>

<style scoped>
.dossier-view {
  display: grid;
  grid-template-columns: 260px 1fr;
  height: 100%;
  overflow: hidden;
  background: var(--bg-page);
}

/* ===== 左侧面板 ===== */
.dossier-left {
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(229, 230, 235, 0.7);
  background: rgba(255, 255, 255, 0.95);
  overflow: hidden;
}

.panel-header {
  padding: 14px 16px;
  background: linear-gradient(135deg, #1e3170 0%, #3d56c8 100%);
  color: rgba(255, 255, 255, 0.95);
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px 12px;
  scrollbar-width: none;
}
.panel-body::-webkit-scrollbar { display: none; }

.current-req-card {
  background: rgba(59, 102, 245, 0.05);
  border: 1px solid rgba(59, 102, 245, 0.15);
  border-radius: 10px;
  padding: 11px 12px;
  margin-bottom: 14px;
}
.cur-req-label { font-size: 11px; color: var(--text-sub); margin-bottom: 5px; }
.cur-req-text { font-size: 12.5px; font-weight: 600; color: var(--text-main); line-height: 1.6; }

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.section-title { font-size: 12px; color: var(--text-sub); font-weight: 500; }
.section-count { font-size: 11px; color: #c0c4cc; }

.req-list { display: flex; flex-direction: column; gap: 8px; }

.req-item {
  text-align: left;
  border: 1px solid rgba(229, 230, 235, 0.8);
  border-radius: 10px;
  background: #fff;
  padding: 10px 11px;
  cursor: pointer;
  transition: all 0.18s;
}
.req-item:hover { border-color: rgba(59, 102, 245, 0.3); background: rgba(59, 102, 245, 0.02); }
.req-item.active { border-color: rgba(59, 102, 245, 0.4); background: rgba(59, 102, 245, 0.05); box-shadow: 0 0 0 3px rgba(59, 102, 245, 0.08); }
.req-top { display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 5px; }
.req-title { font-size: 12.5px; font-weight: 700; color: var(--text-main); }
.req-strength { font-size: 10.5px; padding: 2px 7px; border-radius: 20px; border: 1px solid transparent; font-weight: 600; flex-shrink: 0; }
.req-strength.strong { color: #00b479; background: rgba(0,180,121,0.08); border-color: rgba(0,180,121,0.2); }
.req-strength.medium { color: #ff7d00; background: rgba(255,125,0,0.08); border-color: rgba(255,125,0,0.2); }
.req-strength.weak { color: #f53f3f; background: rgba(245,63,63,0.08); border-color: rgba(245,63,63,0.2); }
.req-text { font-size: 12px; color: var(--text-regular); line-height: 1.55; margin-bottom: 6px; }
.req-meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-sub); }

.material-list { display: flex; flex-direction: column; border: 1px solid rgba(229, 230, 235, 0.7); border-radius: 10px; overflow: hidden; }
.material-item { padding: 10px 12px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid rgba(229, 230, 235, 0.5); }
.material-item:last-child { border-bottom: none; }
.material-item:hover, .material-item.active { background: rgba(59, 102, 245, 0.04); }
.mat-title-row { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
.mat-title { font-size: 12.5px; font-weight: 500; color: var(--text-main); }
.mat-badge { font-size: 10px; padding: 1px 6px; border-radius: 20px; border: 1px solid transparent; font-weight: 600; flex-shrink: 0; }
.badge-success { color: #00b479; background: rgba(0,180,121,0.08); border-color: rgba(0,180,121,0.2); }
.badge-warn { color: #ff7d00; background: rgba(255,125,0,0.08); border-color: rgba(255,125,0,0.2); }
.badge-danger { color: #f53f3f; background: rgba(245,63,63,0.08); border-color: rgba(245,63,63,0.2); }
.mat-meta { font-size: 11px; color: var(--text-sub); margin-top: 4px; }

/* ===== 主内容区 ===== */
.dossier-main {
  overflow-y: auto;
  padding: 20px 24px;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.dossier-main::-webkit-scrollbar { display: none; }

/* 案情摘要 */
.summary-section { }
.summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 9px; }
.summary-item { border: 1px solid rgba(229, 230, 235, 0.7); border-radius: 10px; background: rgba(255,255,255,0.9); padding: 11px 12px; }
.summary-item.full { grid-column: 1 / -1; }
.sum-label { font-size: 11px; color: var(--text-sub); margin-bottom: 4px; font-weight: 500; }
.sum-value { font-size: 13px; font-weight: 600; color: var(--text-main); line-height: 1.55; }

/* 时序 */
.sec-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.sec-title { margin: 0; font-size: 14px; font-weight: 700; color: var(--text-main); }
.sec-tip { margin-top: 3px; font-size: 12px; color: var(--text-sub); }

.timeline-row { display: flex; gap: 9px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: thin; scroll-snap-type: x proximity; }
.tl-item {
  min-width: 240px; flex-shrink: 0; border: 1px solid rgba(229,230,235,0.8); border-radius: 10px; background: #fff;
  padding: 11px 12px; text-align: left; cursor: pointer; scroll-snap-align: start;
  transition: all 0.18s; font-family: inherit;
}
.tl-item:hover { border-color: rgba(59,102,245,0.25); box-shadow: 0 2px 8px rgba(59,102,245,0.08); }
.tl-item.active { border-color: rgba(59,102,245,0.4); background: rgba(59,102,245,0.05); box-shadow: 0 0 0 3px rgba(59,102,245,0.1); }
.tl-date { font-size: 11px; color: var(--text-sub); }
.tl-title { font-size: 13px; font-weight: 700; color: var(--text-main); margin-top: 5px; line-height: 1.5; }
.tl-detail { font-size: 12px; color: var(--text-regular); line-height: 1.65; margin-top: 7px; }
.tl-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 9px; }
.tl-tag { font-size: 11px; font-weight: 600; border-radius: 20px; padding: 2px 8px; border: 1px solid transparent; }
.tl-tag.coreFact { color: var(--primary-color); background: rgba(59,102,245,0.08); border-color: rgba(59,102,245,0.2); }
.tl-tag.defenseHit { color: #ff7d00; background: rgba(255,125,0,0.08); border-color: rgba(255,125,0,0.2); }
.tl-tag.evidenceWeak { color: #f53f3f; background: rgba(245,63,63,0.08); border-color: rgba(245,63,63,0.15); }

/* 要件区块 */
.element-block {
  border: 1px solid rgba(229,230,235,0.7); border-radius: 12px; background: #fff;
  padding: 14px 16px; margin-bottom: 12px;
}
.element-block.supported { border-left: 3px solid #00b479; }
.element-block.contested { border-left: 3px solid #ff7d00; }
.element-block.pending { border-left: 3px solid #f53f3f; }

.element-head { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; margin-bottom: 12px; }
.element-title { font-size: 13.5px; font-weight: 700; color: var(--text-main); }
.element-desc { font-size: 12px; color: var(--text-sub); margin-top: 4px; line-height: 1.6; }
.element-badge { font-size: 11px; font-weight: 600; padding: 2px 9px; border-radius: 20px; border: 1px solid transparent; flex-shrink: 0; }
.element-badge.supported { color: #00b479; background: rgba(0,180,121,0.08); border-color: rgba(0,180,121,0.2); }
.element-badge.contested { color: #ff7d00; background: rgba(255,125,0,0.08); border-color: rgba(255,125,0,0.2); }
.element-badge.pending { color: #f53f3f; background: rgba(245,63,63,0.08); border-color: rgba(245,63,63,0.15); }

.element-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.9fr); gap: 14px; }

/* 列头 */
.col-head {
  display: flex; align-items: center; gap: 8px; margin-bottom: 9px;
  padding: 8px 11px; border-radius: 8px; border: 1px solid transparent;
}
.col-head.applicant { background: rgba(59,102,245,0.05); border-color: rgba(59,102,245,0.15); }
.col-head.respondent { background: rgba(245,63,63,0.04); border-color: rgba(245,63,63,0.12); }
.role-badge {
  display: inline-flex; align-items: center; justify-content: center; height: 22px; padding: 0 10px;
  border-radius: 20px; font-size: 11px; font-weight: 700; color: #fff;
}
.applicant-badge { background: linear-gradient(135deg, #3b66f5, #6187fa); }
.respondent-badge { background: linear-gradient(135deg, #f53f3f, #ff7d00); }
.role-text { font-size: 12px; font-weight: 600; color: var(--text-regular); }
.defense-count-badge { margin-left: auto; font-size: 11px; color: #ff7d00; background: rgba(255,125,0,0.08); border: 1px solid rgba(255,125,0,0.2); border-radius: 20px; padding: 1px 8px; font-weight: 600; }

/* 事实卡 */
.fact-card {
  border: 1px solid rgba(229,230,235,0.7); border-radius: 10px; background: rgba(250,251,253,0.9);
  padding: 11px 12px; margin-bottom: 10px; transition: all 0.18s;
}
.fact-card:hover { box-shadow: 0 2px 8px rgba(59,102,245,0.06); border-color: rgba(59,102,245,0.2); }
.fact-card.active { border-color: rgba(59,102,245,0.35); box-shadow: 0 0 0 3px rgba(59,102,245,0.1); }
.fact-head { display: flex; justify-content: space-between; gap: 8px; align-items: flex-start; }
.fact-title { font-size: 13px; font-weight: 700; color: var(--text-main); }
.fact-date { font-size: 11px; color: var(--text-sub); margin-top: 2px; }
.fact-content { font-size: 12.5px; color: var(--text-regular); line-height: 1.7; margin-top: 8px; }

.strength-badge { font-size: 10.5px; font-weight: 600; padding: 2px 7px; border-radius: 20px; border: 1px solid transparent; flex-shrink: 0; }
.strength-badge.strong { color: #00b479; background: rgba(0,180,121,0.08); border-color: rgba(0,180,121,0.2); }
.strength-badge.medium { color: #ff7d00; background: rgba(255,125,0,0.08); border-color: rgba(255,125,0,0.2); }
.strength-badge.weak { color: #f53f3f; background: rgba(245,63,63,0.08); border-color: rgba(245,63,63,0.15); }
.strength-badge.sm { font-size: 10px; padding: 1px 6px; }

/* 证据卡 */
.evidence-list { display: flex; flex-direction: column; gap: 8px; margin-top: 9px; }
.ev-card {
  border: 1px solid rgba(229,230,235,0.7); border-radius: 8px; background: rgba(247,249,255,0.9);
  padding: 10px 12px; transition: all 0.15s;
}
.ev-card:hover { border-color: rgba(59,102,245,0.2); }
.ev-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 5px; }
.ev-title { font-size: 12.5px; font-weight: 700; color: var(--text-main); }
.ev-meta { font-size: 11px; color: var(--text-sub); margin-top: 2px; }
.ev-proving, .ev-summary { font-size: 12px; color: var(--text-regular); line-height: 1.65; margin-top: 5px; }
.ev-btn {
  margin-top: 8px; padding: 4px 11px; border: 1px solid rgba(59,102,245,0.2); border-radius: 6px;
  background: transparent; color: var(--primary-color); font-size: 12px; cursor: pointer; transition: all 0.15s;
}
.ev-btn:hover { background: rgba(59,102,245,0.06); }
.ev-more { font-size: 11.5px; color: var(--text-sub); }

/* 抗辩卡 */
.defense-list-wrapper { display: flex; flex-direction: column; gap: 9px; }
.defense-card {
  border: 1px solid rgba(229,230,235,0.7); border-left: 3px solid #ff7d00;
  border-radius: 8px; padding: 10px 12px; background: rgba(250,251,253,0.9); transition: all 0.15s;
}
.defense-card:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
.defense-card.high { border-left-color: #f53f3f; }
.defense-card.medium { border-left-color: #ff7d00; }
.defense-card.low { border-left-color: var(--primary-color); }
.defense-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 6px; }
.defense-type-badge { font-size: 11px; font-weight: 600; color: #ff7d00; background: rgba(255,125,0,0.08); border: 1px solid rgba(255,125,0,0.2); border-radius: 20px; padding: 2px 8px; }
.hit-level-text { font-size: 11px; font-weight: 600; }
.hit-level-text.high { color: #f53f3f; }
.hit-level-text.medium { color: #ff7d00; }
.hit-level-text.low { color: var(--primary-color); }
.defense-target, .defense-point, .defense-content, .defense-source { font-size: 12px; color: var(--text-regular); line-height: 1.65; margin-top: 6px; }
.defense-target { font-weight: 600; color: var(--text-main); }
.defense-ev-label { font-size: 11.5px; font-weight: 700; color: var(--text-regular); margin-top: 8px; }
.defense-ev-quote { border: 1px solid rgba(229,230,235,0.7); border-radius: 6px; background: #fff; padding: 8px 10px; font-size: 12px; line-height: 1.65; color: var(--text-regular); margin-top: 4px; }
.defense-source { color: var(--text-sub); font-size: 11px; }
.empty-defense {
  border: 1px dashed rgba(59,102,245,0.2); border-radius: 8px; padding: 12px 14px;
  background: rgba(59,102,245,0.02); font-size: 12.5px; color: var(--text-sub); line-height: 1.7;
}

/* ===== 弹窗 ===== */
.dialog-overlay {
  position: fixed; inset: 0; z-index: 9998;
  background: rgba(13, 27, 48, 0.4);
  display: flex; align-items: center; justify-content: center;
}
.preview-dialog, .trace-dialog {
  width: 840px; max-width: calc(100vw - 48px); max-height: calc(100vh - 48px);
  display: flex; flex-direction: column; border-radius: 14px; background: #fff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28); overflow: hidden;
}
.trace-dialog { width: 700px; overflow-y: auto; }
.dialog-header {
  display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
  padding: 16px 20px; border-bottom: 1px solid rgba(229,230,235,0.7); background: #fafcff; flex-shrink: 0;
}
.dialog-title { font-size: 15px; font-weight: 700; color: var(--text-main); }
.dialog-meta { display: flex; align-items: center; gap: 6px; margin-top: 5px; }
.meta-tag { font-size: 11px; color: var(--text-sub); background: rgba(59,102,245,0.06); padding: 2px 8px; border-radius: 4px; }
.meta-dot { color: #c0c4cc; }
.close-btn {
  flex-shrink: 0; padding: 6px 14px; border: 1px solid rgba(229,230,235,0.8); border-radius: 7px;
  background: #fff; font-size: 12.5px; color: var(--text-regular); cursor: pointer; transition: all 0.15s;
}
.close-btn:hover { border-color: rgba(59,102,245,0.3); color: var(--primary-color); }
.dialog-body { flex: 1; overflow-y: auto; padding: 20px; }
.preview-content {
  font-size: 13px; line-height: 1.8; color: var(--text-regular); white-space: pre-wrap;
  font-family: 'Consolas', 'Microsoft YaHei', monospace; background: #f8fafc;
  border: 1px solid rgba(229,230,235,0.7); border-radius: 8px; padding: 20px; min-height: 300px;
}
.trace-section { margin: 14px 18px; }
.trace-label { font-size: 11px; font-weight: 700; color: var(--text-sub); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
.trace-content { border: 1px solid rgba(229,230,235,0.7); border-radius: 8px; background: rgba(247,249,255,0.9); padding: 11px 13px; font-size: 13px; line-height: 1.7; color: var(--text-regular); }
.trace-content.raw { background: #fff; white-space: pre-wrap; font-family: 'Microsoft YaHei', monospace; }

@media (max-width: 1100px) {
  .element-grid { grid-template-columns: 1fr; }
}
</style>
