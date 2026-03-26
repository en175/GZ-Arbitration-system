export const WRITER_TABS = [
  { key: 'ai', label: '智能写作助手' },
  { key: 'check', label: '校对检查' },
  { key: 'comment', label: '人工批注' }
];

export const DOC_SECTIONS = [
  { key: 'sec-header', label: '首部' },
  { key: 'sec-claims', label: '案件受理及程序' },
  { key: 'sec-facts', label: '案件事实及双方主张' },
  { key: 'sec-defense', label: '被申请人答辩及反请求' },
  { key: 'sec-investigation', label: '仲裁庭查明' },
  { key: 'sec-analysis', label: '仲裁庭意见' },
  { key: 'sec-ruling', label: '裁决' }
];

export const SECTION_AI_PRESETS = {
  'sec-header': [
    { key: 'check-party', label: '核验当事人信息', desc: '比对申请书与答辩书中的主体信息' },
    { key: 'gen-header', label: '补全首部格式', desc: '按仲裁委文书规范补全首部信息' }
  ],
  'sec-claims': [
    { key: 'gen-timeline', label: '梳理程序时间轴', desc: '按受理、组庭、开庭节点生成程序段' },
    { key: 'check-amount', label: '核验程序文书', desc: '核验受理通知、组庭通知、送达记录一致性' }
  ],
  'sec-facts': [
    { key: 'list-claims', label: '梳理请求与主张', desc: '结构化申请请求、答辩观点与证据线索' },
    { key: 'quote-evidence', label: '补充证据指向', desc: '为事实段插入证据编号与核心内容' }
  ],
  'sec-defense': [
    { key: 'summarize-defense', label: '归纳答辩反请求', desc: '提取抗辩逻辑与反请求条款' },
    { key: 'compare-claims', label: '对比申辩争点', desc: '逐项对照请求、反请求与证据矛盾点' }
  ],
  'sec-investigation': [
    { key: 'gen-findings', label: '生成查明事实', desc: '综合双方证据生成查明段落' },
    { key: 'check-evidence-chain', label: '检查证据链', desc: '检验查明事实是否有充分证据支撑' }
  ],
  'sec-analysis': [
    { key: 'focus', label: '生成争议焦点', desc: '围绕请求事项提炼争议焦点与审查路径' },
    { key: 'reason', label: '生成裁决理由', desc: '形成"事实-规则-结论"说理段落' },
    { key: 'conflict', label: '检测证据冲突', desc: '扫描金额、时间线、主体信息冲突' }
  ],
  'sec-ruling': [
    { key: 'gen-ruling', label: '生成裁决条款', desc: '根据说理结论生成裁决主文条款' },
    { key: 'check-ruling', label: '检查裁决完整性', desc: '核验裁决条款是否覆盖全部请求' }
  ]
};

export const SECTION_AI_OPTIONS = {
  'sec-analysis': {
    focus: [
      { key: 'pay', label: '货款支付义务' },
      { key: 'interest', label: '利息起算节点' },
      { key: 'penalty', label: '违约金调减标准' }
    ],
    reason: [
      { key: 'support', label: '支持全部请求' },
      { key: 'partial', label: '部分支持请求' },
      { key: 'reject', label: '驳回请求' }
    ],
    conflict: [
      { key: 'amount', label: '金额一致性冲突' },
      { key: 'timeline', label: '时间线倒置冲突' },
      { key: 'subject', label: '主体信息冲突' }
    ]
  },
  'sec-facts': {
    'gen-timeline': [
      { key: 'contract', label: '合同签署至交付' },
      { key: 'payment', label: '付款与催告' }
    ],
    'quote-evidence': [
      { key: 'delivery', label: '交付事实' },
      { key: 'payment-fact', label: '付款事实' }
    ]
  }
};

export const AI_COMMON_ACTIONS = [
  { key: 'focus', label: '生成争议焦点', desc: '围绕请求事项提炼争议焦点与审查路径' },
  { key: 'quote', label: '生成证据引用段落', desc: '按主张输出事实+证据悬浮脚注' },
  { key: 'conflict', label: '检测证据冲突', desc: '扫描金额、时间线、主体信息冲突' },
  { key: 'reason', label: '生成裁决理由', desc: '形成"事实-规则-结论"说理段落' }
];

export const AI_PRESET_ACTIONS = AI_COMMON_ACTIONS;

export const AI_PRESET_OPTIONS = {
  focus: [
    { key: 'pay', label: '货款支付义务' },
    { key: 'interest', label: '利息起算节点' },
    { key: 'penalty', label: '违约金调减标准' }
  ],
  quote: [
    { key: 'pay', label: '货款支付请求' },
    { key: 'quality', label: '质量抗辩' },
    { key: 'penalty', label: '违约金争议' }
  ],
  conflict: [
    { key: 'amount', label: '金额一致性冲突' },
    { key: 'timeline', label: '时间线倒置冲突' },
    { key: 'subject', label: '主体信息冲突' }
  ],
  reason: [
    { key: 'support', label: '支持全部请求' },
    { key: 'partial', label: '部分支持请求' },
    { key: 'reject', label: '驳回请求' }
  ]
};

export const AI_PRESET_RESPONSES = {
  focus: {
    pay: '争议焦点建议：1）申请人是否已完成合同项下供货义务；2）被申请人拒付是否具备合同或法定依据；3）逾期付款责任承担范围如何确定。',
    interest: '争议焦点建议：1）利息起算日应以约定付款期限届满日还是催告日计算；2）申请日期与合同日期矛盾是否影响起算逻辑；3）利息计算区间是否与证据一致。',
    penalty: '争议焦点建议：1）违约金条款效力是否成立；2）约定比例是否明显高于实际损失；3）是否需要基于行业利润率与损失证据进行调减。'
  },
  quote: {
    pay: '证据引用段落：申请人提交《购销合同》与《发货签收回执》能够相互印证其已完成交付义务，且《对账邮件》进一步确认应付货款余额。故对货款支付请求具备事实基础。',
    quality: '证据引用段落：被申请人以《质量异议说明》主张型号不符，但其提交时间与签收后异议期限是否一致仍需复核。现有材料尚不足以完全否定申请人履约事实。',
    penalty: '证据引用段落：合同违约条款明确约定违约金计算方式，同时被申请人提交调减意见及行业利润率材料。建议在确认实际损失后，对违约金幅度作比例审查。'
  },
  conflict: {
    amount: '冲突检测结果：高风险。诉请本金与分项汇总存在 12,000 元差异，建议先补齐计算明细，否则阻断对应段落入稿。',
    timeline: '冲突检测结果：高风险。申请日期早于合同签署日期，时间线倒置，建议先复核日期字段并保留校验记录。',
    subject: '冲突检测结果：高风险。庭审陈述主体与答辩书落款主体不一致，需先完成主体信息统一后再采纳该证据结论。'
  },
  reason: {
    support: '裁决理由建议：在申请人履约事实充分、被申请人抗辩证据不足的前提下，依据合同约定及民法典相关条款，对申请人请求予以支持。',
    partial: '裁决理由建议：对货款本金请求予以支持；对利息及违约金部分，结合起算依据和损失证明程度，酌情部分支持。',
    reject: '裁决理由建议：申请人关键证据在金额与主体信息上存在未消除冲突，尚不足以达到高度盖然性标准，故对相应请求不予支持。'
  },
  'check-party': { _default: '当事人信息核验结果：申请人全称、被申请人全称、法定代表人姓名与申请书一致。建议确认被申请人住所地是否为最新工商登记地址。' },
  'gen-header': { _default: '首部格式已按照仲裁委标准补全：案号居中、当事人信息分段、委托代理人独立段落。' },
  'list-claims': { _default: '请求事项梳理：1）支付货款 82,957.70 元；2）支付自 2025-12-09 起的逾期付款利息；3）仲裁费用由被申请人承担。共 3 项请求。' },
  'check-amount': { _default: '金额核验：合同总价 82,957.70 元，已付 0 元，请求金额 82,957.70 元。被申请人主张存在约 300 元差异但未提供明细，可维持合同约定金额认定。' },
  'gen-timeline': {
    contract: '程序时间线：2025-10-12 签订合同 → 2025-11-08 交付货物/收货签收 → 2025-11-15 被申请人质量异议（超期）→ 2025-12-05 催款函发出 → 2025-12-06 催款函签收 → 2026-02-18 申请立案 → 2026-03-05 正式受理。',
    payment: '付款时间线：合同约定付款期限 2025-12-08（收货后30日）→ 届满未付 → 2025-12-09 起算逾期利息 → 至庭审日仍未付任何款项。'
  },
  'quote-evidence': {
    delivery: '交付事实证据引用：送货单载明 2025-11-08 完成全部货物交付，签收回执有被申请人收货人员签字盖章，备注"数量点清"，证明交付义务已履行完毕。',
    'payment-fact': '催告送达证据引用：催款函于 2025-12-05 发出，快递回执显示 2025-12-06 由被申请人工作人员签收，证明催告程序合法有效。'
  },
  'summarize-defense': { _default: '答辩要点归纳：1）质量异议——称约 20% 设备型号不符（但超异议期且无第三方检测）；2）金额差异——称存在约 300 元差异（未提供明细）。被申请人缺席庭审，放弃质证机会。' },
  'compare-claims': { _default: '申辩对比：货款请求（有合同+签收+催告证据链）vs 质量异议抗辩（超期+无检测报告，说服力弱）；合同金额 vs 300 元差异主张（被申请人未举证具体差异明细）。整体而言申请人证据优势明显。' },
  'gen-findings': { _default: '查明事实草稿已生成，涵盖合同签订（2025-10-12）、货物交付（2025-11-08）、质量异议超期（2025-11-15）、催款送达（2025-12-06）及缺席审理五个核心事实节点。' },
  'check-evidence-chain': { _default: '证据链检查：合同→交付→签收→催告→受理 链条完整；质量异议超期且无第三方检测报告，抗辩无法成立；无付款记录，货款未付事实清楚。' },
  'gen-ruling': { _default: '裁决条款草稿：一、支付货款 82,957.70 元；二、支付自 2025-12-09 起逾期利息；三、仲裁费 8,968 元由被申请人承担。' },
  'check-ruling': { _default: '裁决完整性检查：3 项请求均已在裁决主文中回应。建议在第一项补充履行期限（"自本裁决书送达之日起十五日内"），利息条款建议明确截止时间表述。' }
};

export const SOURCE_FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'applicant', label: '申请方' },
  { key: 'respondent', label: '被申请方' },
  { key: 'tribunal', label: '仲裁庭' }
];

export const MOCK_MATERIALS = [
  {
    id: 'w1',
    title: '仲裁申请书',
    type: 'doc',
    source: '申请人提交',
    sourceParty: 'applicant',
    submittedAt: '2026-02-18',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    evidenceItems: [
      { id: 'w1-e1', claim: '货款支付请求', excerpt: '申请人主张被申请人应支付货款人民币 82,957.70 元及逾期利息，货物已按合同约定完成交付。', conflictLevel: 'none', conflictNote: '' },
      { id: 'w1-e2', claim: '利息起算日主张', excerpt: '申请人主张利息自 2025 年 12 月 9 日起（付款期届满翌日）按贷款市场报价利率计算。', conflictLevel: 'none', conflictNote: '' },
      { id: 'w1-e3', claim: '仲裁费用请求', excerpt: '申请人请求本案仲裁费用由被申请人全额承担。', conflictLevel: 'none', conflictNote: '' }
    ]
  },
  {
    id: 'w2',
    title: '被申请人答辩书',
    type: 'doc',
    source: '被申请人提交',
    sourceParty: 'respondent',
    submittedAt: '2026-03-17',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    evidenceItems: [
      { id: 'w2-e1', claim: '质量异议抗辩', excerpt: '被申请人称到货后发现约 20% 设备型号与合同约定不符，已于收货后 7 日内书面通知申请人。', conflictLevel: 'high', conflictNote: '答辩书称"7日内通知"，但质量异议函日期为2025-11-15（收货后第7日），边界时效存争议。' },
      { id: 'w2-e2', claim: '金额差异主张', excerpt: '被申请人称申请人主张总额与合同附件价格清单存在约 300 元差异，请求核实后再计算。', conflictLevel: 'medium', conflictNote: '被申请人未提供具体差异明细，仅泛称差异，说服力不足。' }
    ]
  },
  {
    id: 'w3',
    title: '空调设备采购合同',
    type: 'contract',
    source: '双方签署',
    sourceParty: 'both',
    submittedAt: '2025-10-12',
    fileType: 'PDF',
    fileSize: '2.6 MB',
    evidenceItems: [
      { id: 'w3-e1', claim: '合同价款约定', excerpt: '合同约定货物总价款人民币 82,957.70 元，付款期为收货验收后 30 日内一次性支付。', conflictLevel: 'none', conflictNote: '' },
      { id: 'w3-e2', claim: '质量异议期约定', excerpt: '合同第 6 条约定：买方应于收货后 7 日内以书面形式提出质量异议，逾期视为验收合格。', conflictLevel: 'none', conflictNote: '' },
      { id: 'w3-e3', claim: '仲裁条款', excerpt: '合同第 11 条约定：因本合同发生争议，双方同意提交广州仲裁委员会仲裁解决。', conflictLevel: 'none', conflictNote: '' }
    ]
  },
  {
    id: 'w4',
    title: '送货单与签收回执',
    type: 'evidence',
    source: '申请人提交',
    sourceParty: 'applicant',
    submittedAt: '2025-11-08',
    fileType: 'PDF',
    fileSize: '980 KB',
    evidenceItems: [
      { id: 'w4-e1', claim: '交付事实', excerpt: '送货单载明 2025 年 11 月 8 日完成全部合同货物交付，签收回执有被申请人收货人员签字盖章。', conflictLevel: 'none', conflictNote: '' },
      { id: 'w4-e2', claim: '签收备注', excerpt: '签收回执备注"数量点清，待质量验收"，未注明任何当场质量异议内容。', conflictLevel: 'medium', conflictNote: '"待质量验收"措辞可能被用于支撑被申请人后续质量抗辩，需关注。' }
    ]
  },
  {
    id: 'w5',
    title: '催款函及快递回执',
    type: 'evidence',
    source: '申请人提交',
    sourceParty: 'applicant',
    submittedAt: '2025-12-05',
    fileType: 'PDF',
    fileSize: '640 KB',
    evidenceItems: [
      { id: 'w5-e1', claim: '催告送达事实', excerpt: '催款函载明要求被申请人于 3 日内支付全部货款 82,957.70 元，快递单显示已于 2025 年 12 月 6 日签收。', conflictLevel: 'none', conflictNote: '' },
      { id: 'w5-e2', claim: '催告时间节点', excerpt: '催款发出日为 2025 年 12 月 5 日，签收日 2025 年 12 月 6 日，可作为被申请人明知逾期节点的辅助证明。', conflictLevel: 'none', conflictNote: '' }
    ]
  },
  {
    id: 'w6',
    title: '质量异议函（被申请人提交）',
    type: 'evidence',
    source: '被申请人提交',
    sourceParty: 'respondent',
    submittedAt: '2025-11-15',
    fileType: 'PDF',
    fileSize: '420 KB',
    evidenceItems: [
      { id: 'w6-e1', claim: '质量异议时间节点', excerpt: '被申请人质量异议函注明日期为 2025 年 11 月 15 日，距收货日（11 月 8 日）已达 7 日。', conflictLevel: 'high', conflictNote: '合同约定"7日内书面提出"，2025-11-15距签收2025-11-08恰好第7日，时效认定存临界争议。' },
      { id: 'w6-e2', claim: '质量异议内容', excerpt: '异议函称约 20% 设备型号不符，但未附第三方检测报告，证明力不足。', conflictLevel: 'medium', conflictNote: '无第三方检测报告，仅被申请人自制型号对比表，证明标准未达到。' }
    ]
  },
  {
    id: 'w7',
    title: '庭审笔录（2026-04-15）',
    type: 'doc',
    source: '仲裁庭记录',
    sourceParty: 'tribunal',
    submittedAt: '2026-04-15',
    fileType: 'PDF',
    fileSize: '3.1 MB',
    evidenceItems: [
      { id: 'w7-e1', claim: '申请人庭审陈述', excerpt: '申请人代理人黄德伟当庭确认货款总额 82,957.70 元，强调签收回执证明交货完成，质量异议超期。', conflictLevel: 'none', conflictNote: '' },
      { id: 'w7-e2', claim: '缺席审理记录', excerpt: '被申请人经合法通知未出庭，依规缺席审理，视为放弃答辩权利及质证机会。', conflictLevel: 'none', conflictNote: '' }
    ]
  }
];

export const MOCK_AI_MSGS = [
  { id: 'm1', role: 'ai', content: '您好，我是文书写作助手。请选择上方任务卡和预选项，我将按仲裁委文书规范生成建议。' }
];

export const MOCK_EDITOR_CONTENT = `
  <h1 style="text-align: center">裁决书</h1>
  <p data-paragraph-id="p-caseno" style="text-align: center">（2026）粤仲案字第 5412 号</p>

  <h2 data-paragraph-id="sec-header">一、首部</h2>
  <p data-paragraph-id="p-applicant"><strong>申 请 人：</strong>新菱空调（佛冈）有限公司</p>
  <p data-paragraph-id="p-agent1"><strong>住　　所：</strong>广东省清远市佛冈县经济开发区兴发大道 18 号</p>
  <p data-paragraph-id="p-respondent"><strong>法定代表人：</strong>梁某某，总经理</p>
  <p data-paragraph-id="p-party4"><strong>委托代理人：</strong>黄德伟，广东XX律师事务所律师</p>
  <p data-paragraph-id="p-party7"><strong>被 申 请 人：</strong>广东恒力建设工程有限公司</p>
  <p data-paragraph-id="p-party8"><strong>住　　所：</strong>广东省广州市天河区黄埔大道西 100 号</p>
  <p data-paragraph-id="p-party9"><strong>法定代表人：</strong>郑某某，执行董事</p>
  <p data-paragraph-id="p-party10"><strong>委托代理人：</strong>暂未委托</p>

  <h2 data-paragraph-id="sec-claims">二、案件受理及程序</h2>
  <p data-paragraph-id="p-claim1">广州仲裁委员会根据申请人提交的《仲裁申请书》及双方签署的《空调设备采购合同》中的仲裁条款，于 2026 年 3 月 5 日受理本案，案号为（2026）粤仲案字第 5412 号。</p>
  <p data-paragraph-id="p-claim2">本案争议标的金额为人民币 82,957.70 元，依据《广州仲裁委员会仲裁规则》适用简易程序，由独任仲裁员审理。本会依法向双方当事人送达了受理通知、仲裁规则、仲裁员名册、举证通知及开庭通知。</p>
  <p data-paragraph-id="p-claim3">申请人在规定期限内选定仲裁员陈某某。经本会确认，陈某某于 2026 年 3 月 20 日担任本案独任仲裁员。</p>
  <p data-paragraph-id="p-claim4">仲裁庭于 2026 年 4 月 15 日开庭审理本案。申请人委托代理人黄德伟出庭参加庭审；被申请人经合法通知后未出庭，仲裁庭依规缺席审理。</p>

  <h2 data-paragraph-id="sec-facts">三、案件事实及双方主张</h2>
  <p data-paragraph-id="p-fact1">申请人称：其与被申请人于 2025 年 10 月 12 日签订《空调设备采购合同》，合同约定申请人向被申请人供应空调设备及配件，合同总价人民币 82,957.70 元，被申请人应于收货验收后 30 日内一次性付清货款。</p>
  <p data-paragraph-id="p-fact2">申请人按合同约定于 2025 年 11 月 8 日完成全部货物交付，被申请人收货后在送货单上签字确认，但此后以"部分设备型号不符"为由拒绝付款，货款至今分文未付。</p>
  <p data-paragraph-id="p-fact3">申请人最终确认的仲裁请求为：1. 被申请人支付货款人民币 82,957.70 元；2. 被申请人支付自 2025 年 12 月 9 日起至实际付款之日止，按全国银行间同业拆借中心公布的贷款市场报价利率计算的逾期付款利息；3. 本案仲裁费用由被申请人承担。</p>
  <p data-paragraph-id="p-fact-evidence">申请人提交的主要证据包括：《空调设备采购合同》、送货单及签收回执、往来邮件、催款函及快递回执、产品质量检测报告等。</p>

  <h2 data-paragraph-id="sec-defense">四、被申请人答辩</h2>
  <p data-paragraph-id="p-defense1">被申请人书面答辩称：到货后发现约 20% 设备型号与合同约定不符，部分机组制冷量偏低，已于 2025 年 11 月 15 日向申请人发出书面质量异议，据此主张暂停付款直至质量争议解决。</p>
  <p data-paragraph-id="p-defense2">被申请人同时主张：合同附件价格清单与申请人主张总额存在约 300 元差异，请求核实后再行计算。被申请人未提出反请求。</p>
  <p data-paragraph-id="p-defense3">被申请人提交的主要证据包括：书面质量异议函（2025 年 11 月 15 日）、部分设备型号对比表。</p>

  <h2 data-paragraph-id="sec-investigation">五、仲裁庭查明</h2>
  <p data-paragraph-id="p-inv1">仲裁庭查明：双方于 2025 年 10 月 12 日签署《空调设备采购合同》，合同总价 82,957.70 元，付款方式为"收货验收后 30 日内一次性付清"，合同约定质量异议期为收货后 7 日内书面提出。</p>
  <p data-paragraph-id="p-inv2">申请人提交的送货单显示，被申请人收货人员于 2025 年 11 月 8 日签收全部货物，送货单备注"数量点清，待质量验收"，未注明任何当场质量异议。</p>
  <p data-paragraph-id="p-inv3">被申请人提交的质量异议函注明日期为 2025 年 11 月 15 日，距收货日已超 7 日，超出合同约定的异议期限。被申请人未能提交第三方检测机构出具的质量鉴定报告，仅凭自制型号对比表，不足以证明货物存在实质性质量缺陷。</p>
  <p data-paragraph-id="p-inv4">关于金额差异，申请人提交的合同附件价格明细与合同总价 82,957.70 元相互印证；被申请人所称 300 元差异未提供具体计算依据，仲裁庭无法核实。</p>
  <p data-paragraph-id="p-inv5">申请人已于 2025 年 12 月 5 日向被申请人发出催款函，要求于 3 日内付清全部货款，快递单据显示已于 2025 年 12 月 6 日签收。被申请人至今未支付任何货款。</p>

  <h2 data-paragraph-id="sec-analysis">六、仲裁庭意见</h2>
  <p data-paragraph-id="p-focus-title"><strong>（一）合同效力与货款支付义务</strong></p>
  <p data-paragraph-id="p-focus1">双方签订的《空调设备采购合同》系真实意思表示，内容合法有效。申请人已按约完成交货义务，合同约定付款条件已成就，被申请人负有支付全部货款 82,957.70 元的合同义务。</p>
  <p data-paragraph-id="p-focus-title2"><strong>（二）质量异议是否成立</strong></p>
  <p data-paragraph-id="p-focus2">被申请人提出质量异议的时间（2025 年 11 月 15 日）已超出合同约定的 7 日异议期，且未提供具有说服力的第三方检测报告。依据合同约定，视为被申请人已认可货物质量，该抗辩主张不予支持。</p>
  <p data-paragraph-id="p-focus-title3"><strong>（三）逾期付款责任</strong></p>
  <p data-paragraph-id="p-focus3">收货验收后 30 日付款期届满日为 2025 年 12 月 8 日，被申请人逾期未付，应自 2025 年 12 月 9 日起按贷款市场报价利率承担逾期付款利息。关于金额差异，被申请人未提供充分证据，不影响合同约定金额的认定。</p>

  <h2 data-paragraph-id="sec-ruling">七、裁决</h2>
  <p data-paragraph-id="p-ruling1">据此，依据《中华人民共和国民法典》及《广州仲裁委员会仲裁规则》相关规定，仲裁庭裁决如下：</p>
  <p data-paragraph-id="p-ruling2">（一）被申请人广东恒力建设工程有限公司于本裁决书送达之日起十五日内向申请人新菱空调（佛冈）有限公司支付货款人民币 82,957.70 元；</p>
  <p data-paragraph-id="p-ruling3">（二）被申请人广东恒力建设工程有限公司向申请人支付自 2025 年 12 月 9 日至实际付款之日止，以人民币 82,957.70 元为本金，按全国银行间同业拆借中心公布的一年期贷款市场报价利率计算的逾期付款利息；</p>
  <p data-paragraph-id="p-ruling4">（三）驳回申请人的其他仲裁请求。</p>
  <p data-paragraph-id="p-ruling5">如未按本裁决确定的期间履行给付义务，应依照《中华人民共和国民事诉讼法》有关规定加倍支付迟延履行期间的债务利息。</p>
  <p data-paragraph-id="p-ruling6">本案仲裁费人民币 8,968 元（受理费 3,968 元、处理费 5,000 元），由被申请人承担。申请人已预交全部仲裁费，被申请人应于履行上述款项时一并向申请人支付仲裁费人民币 8,968 元。</p>
  <p data-paragraph-id="p-ruling7" style="text-align: right">独任仲裁员：陈某某　　二〇二六年五月二十日　广州</p>
`;

export const MOCK_CHECK_GROUPS = [
  {
    id: 'cg1',
    title: '格式与术语',
    items: [
      { id: 'c1', type: 'format', desc: '案号格式建议核对与广州仲裁委登记系统保持一致', paragraphId: 'p-caseno', paragraphLabel: '案号', severity: 'warning', targetText: '（2026）粤仲案字第 5412 号' },
      { id: 'c2', type: 'format', desc: '裁决主文第一项当事人全称应与首部保持一致', paragraphId: 'p-ruling2', paragraphLabel: '裁决条款第一项', severity: 'error', targetText: '（一）被申请人广东恒力建设工程有限公司' },
      { id: 'c3', type: 'format', desc: '"广州仲裁委员会"与"仲裁庭"称谓建议全文统一使用规范', paragraphId: 'p-claim1', paragraphLabel: '案件受理首段', severity: 'warning', targetText: '广州仲裁委员会根据申请人提交' }
    ]
  },
  {
    id: 'cg2',
    title: '逻辑与论证',
    items: [
      { id: 'c4', type: 'logic', desc: '质量异议时效认定应明确"第7日"是否属于合同约定期内', paragraphId: 'p-inv3', paragraphLabel: '查明·质量异议时效', severity: 'error', targetText: '距收货日已超 7 日' },
      { id: 'c5', type: 'logic', desc: '驳回质量抗辩理由建议补充"无第三方检测证明"的具体说明', paragraphId: 'p-focus2', paragraphLabel: '仲裁庭意见·质量异议', severity: 'warning', targetText: '该抗辩主张不予支持' },
      { id: 'c6', type: 'logic', desc: '逾期利息起算日期推导过程建议补充合同付款期届满日计算依据', paragraphId: 'p-focus3', paragraphLabel: '仲裁庭意见·逾期利息', severity: 'warning', targetText: '收货验收后 30 日付款期届满日为 2025 年 12 月 8 日' }
    ]
  },
  {
    id: 'cg3',
    title: '证据引用',
    items: [
      { id: 'c7', type: 'evidence', desc: '送货单"待质量验收"备注的认定立场建议在意见段明确', paragraphId: 'p-inv2', paragraphLabel: '查明·签收回执', severity: 'warning', targetText: '数量点清，待质量验收' },
      { id: 'c8', type: 'evidence', desc: '催款函签收日期应与利息起算逻辑挂钩说明', paragraphId: 'p-inv5', paragraphLabel: '查明·催告送达', severity: 'warning', targetText: '已于 2025 年 12 月 6 日签收' },
      { id: 'c9', type: 'evidence', desc: '申请人主要证据清单建议逐项列明证据编号', paragraphId: 'p-fact-evidence', paragraphLabel: '事实·申请人证据', severity: 'error', targetText: '申请人提交的主要证据包括' }
    ]
  }
];

export const COMMENT_FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'resolved', label: '已处理' }
];

export const MOCK_COMMENTS = [
  { id: 'cm1', title: '质量异议时效需明确表态', content: '2025-11-15距签收日2025-11-08恰好第7日，建议在查明段明确说明"已届合同约定7日异议期届满当日，不属于7日内"，避免歧义。', status: 'pending', paragraphId: 'p-inv3', author: '陈仲裁员', createdAt: '2026-04-16 10:30', selectedText: '距收货日已超 7 日' },
  { id: 'cm2', title: '首部格式规范', content: '首部申请人/被申请人分段与全角间隔符使用规范，符合简易程序文书标准，可保持。', status: 'resolved', paragraphId: 'p-applicant', author: '陈炜秘书', createdAt: '2026-04-16 09:00', selectedText: '新菱空调（佛冈）有限公司' },
  { id: 'cm3', title: '缺席审理程序表述可补充', content: '缺席审理段落可补充"仲裁庭依规向被申请人送达开庭通知，对方无正当理由未出庭"的具体说明，程序完整性更强。', status: 'pending', paragraphId: 'p-claim4', author: '陈仲裁员', createdAt: '2026-04-16 11:00', selectedText: '被申请人经合法通知后未出庭' },
  { id: 'cm4', title: '利息利率表述建议完整', content: '逾期利息利率表述建议改为"按全国银行间同业拆借中心公布的一年期贷款市场报价利率"，与裁决条款保持一致。', status: 'pending', paragraphId: 'p-focus3', author: '陈仲裁员', createdAt: '2026-04-16 11:20', selectedText: '按贷款市场报价利率承担逾期付款利息' },
  { id: 'cm5', title: '仲裁费条款格式完整', content: '仲裁费承担条款已包含受理费+处理费明细，"已预交+应补付"结构清晰，可保持。', status: 'resolved', paragraphId: 'p-ruling6', author: '陈炜秘书', createdAt: '2026-04-16 13:00', selectedText: '本案仲裁费人民币 8,968 元' }
];

export const MOCK_AI_CANDIDATES = {
  continue: '仲裁庭进一步认为，被申请人在收到催告后仍未履行付款义务，违约状态持续存在，应继续承担相应给付责任。',
  rewrite: '建议改写为规范裁判语体：申请人履行合同义务事实清楚，被申请人未按约付款事实成立，应依法承担违约责任。',
  expand: '结合合同、工程结算复核报告、付款台账及催告记录，现有证据已形成"合同关系—履约完成—逾期未付—损失后果"的完整证明链，可支撑主文对应裁断。',
  simplify: '申请人已履约，被申请人逾期付款，依法应承担违约责任。',
  summarize: '审理结论可归纳为：合同有效、履约成立、逾期付款成立、违约责任成立。',
  custom: '根据您的指令，建议将该段调整为"先述事实，再述规则，最后给出裁判结论"的三段式表述。'
};

export const AI_ACTIONS = [
  { key: 'continue', label: '续拟说理', color: '#3B82F6' },
  { key: 'rewrite', label: '规范表述', color: '#8B5CF6' },
  { key: 'expand', label: '补强论证', color: '#10B981' },
  { key: 'simplify', label: '提炼要旨', color: '#F59E0B' },
  { key: 'summarize', label: '归纳结论', color: '#EC4899' }
];

export const getMockCandidate = (type, prompt) => {
  if (type === 'custom') {
    return `${MOCK_AI_CANDIDATES.custom}（${prompt}）`;
  }
  return MOCK_AI_CANDIDATES[type] || MOCK_AI_CANDIDATES.custom;
};

export const getPresetReply = (actionKey, optionKey) => {
  const group = AI_PRESET_RESPONSES[actionKey];
  if (!group) return '当前预选任务暂无返回内容，请选择其他任务。';
  return group[optionKey] || group['_default'] || '当前选项暂无返回内容，请更换选项。';
};
