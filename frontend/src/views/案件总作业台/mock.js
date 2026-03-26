// ============================================================
// 案件总作业台 Mock 数据
// 演示案件：（2026）粤仲案字第5412号
// 买卖合同纠纷 · 简易程序 · 办案秘书：陈炜
// ============================================================

// 案件基础信息（头部展示卡）
export const caseBaseInfo = {
  caseNo: '（2026）粤仲案字第5412号',
  caseType: '买卖合同纠纷',
  procedure: '简易程序',
  applicant: '新菱空调（佛冈）有限公司',
  applicantAgent: '黄德伟',
  respondent: '广东恒力建设工程有限公司',
  respondentAgent: '暂未委托',
  claimAmount: '82,957.70',
  counterClaimAmount: '0',
  fee: '受理费3,968元 · 处理费5,000元',
  caseYear: '2026',
  filingNo: '2026-2120007',
  secretary: '陈炜',
  currentStage: '证据交换',
  currentNode: '证据核验',
  status: '处理中',
  filingDate: '2026-03-05',
  institution: '立案业务部',
  deadlineDays: 2,
}

// 左侧导航视图列表
export const leftViews = [
  { key: 'overview', label: '案件总览' },
  { key: 'timeline', label: '时间线' },
  { key: 'reading', label: '智能阅卷' },
  { key: 'writing', label: '文书写作' },
]

// 总览 - 顶部基础信息卡（3列）
export const overviewCards = [
  { label: '当前阶段', value: '证据交换', type: 'stage' },
  { label: '当前节点', value: '证据核验', type: 'node' },
  { label: '距节点截止', value: '2天', type: 'deadline' },
]

// 总览 - AI 首屏摘要（重点展示）
export const summaryText =
  '本案由新菱空调（佛冈）有限公司申请，被申请人为广东恒力建设工程有限公司，案由为买卖合同纠纷，适用简易程序。案件已于2026年3月5日完成立案，当前处于证据交换阶段。双方主体信息一致，仲裁协议条款清晰。主要争议集中于货款支付义务的履行情况与违约责任归属，申请人主张货款82,957.70元未收到足额支付，被申请人对收货情况及付款时序存在异议。建议优先核实送达凭证完整性，并尽快推进证据交换节点。'

// 总览 - 当前关键提醒
export const highlights = [
  '流程待办 T-01「确认证据交换材料」临期，需今日18:00前完成确认',
  '争议焦点「违约责任」关联证据支撑存在缺口，建议补充送达凭证',
  '最近协同意见：仲裁员已确认焦点拆分方案，待秘书推进节点',
]

// 总览 - 最近关键动态
export const latestActivities = [
  { time: '2026-03-25 10:18', text: '办案秘书陈炜提交证据核验意见，结论：双方主证据目录齐全' },
  { time: '2026-03-25 09:42', text: '仲裁员确认争议焦点拆分方案，共识别3项主要焦点' },
  { time: '2026-03-24 17:33', text: '流程节点由「阅卷准备」推进至「证据交换」' },
  { time: '2026-03-24 14:10', text: '申请人提交补充证据目录，含付款流水3份' },
  { time: '2026-03-23 11:05', text: '完成第一轮争议焦点归纳并经人工确认' },
]

// 时间线数据
export const timelineItems = [
  {
    date: '2026-02-18',
    title: '提交立案申请',
    desc: '申请人新菱空调提交仲裁申请书及相关材料，主张货款未付及违约损失',
    source: '仲裁申请书（P1-P12）',
    focus: '主体资格',
    type: 'filing',
  },
  {
    date: '2026-03-01',
    title: '材料补正完成',
    desc: '立案秘书发出补正通知后，申请人补充了送达地址确认书及营业执照副本',
    source: '补正材料（P13-P16）',
    focus: '程序完整性',
    type: 'supplement',
  },
  {
    date: '2026-03-05',
    title: '正式立案，案件转入办案阶段',
    desc: '案件受理通过，生成正式案号，转交办案秘书陈炜处理',
    source: '受理决定书（P17）',
    focus: '程序合法性',
    type: 'milestone',
  },
  {
    date: '2026-03-11',
    title: '申请人提交首次证据目录',
    desc: '含采购合同正本、送货单、银行流水记录及双方往来邮件',
    source: '证据目录一（P18-P26）',
    focus: '付款事实',
    type: 'evidence',
  },
  {
    date: '2026-03-17',
    title: '被申请人提交答辩意见',
    desc: '对违约责任范围提出异议，主张货物存在质量问题，据此主张不应全额支付',
    source: '答辩意见书（P27-P31）',
    focus: '违约责任',
    type: 'defense',
  },
  {
    date: '2026-03-23',
    title: '完成第一轮争议焦点归纳',
    desc: 'AI辅助生成3项焦点候选，仲裁员审核后人工确认',
    source: '焦点确认记录（P32）',
    focus: '焦点归纳',
    type: 'milestone',
  },
  {
    date: '2026-03-24',
    title: '流程推进至证据交换阶段',
    desc: '阅卷准备阶段完成，案件推进至证据交换节点，双方补充证据截止日为3月27日',
    source: '节点推进记录（系统）',
    focus: '程序推进',
    type: 'process',
  },
]

// 争议焦点
export const focusList = [
  {
    id: 'F-01',
    title: '违约责任是否成立',
    desc: '双方对履约通知时点与违约归责条件存在分歧。申请人主张已按时发货，被申请人主张货物质量不合规，据此抗辩付款义务尚未触发。',
    evidence: ['采购合同第8条违约条款', '送货单存根（编号GZ-0312）', '收货确认短信记录'],
    extra: ['质检报告（被申请人提交）', '沟通会议纪要（2026-03-10）'],
    status: '待核查',
    riskLevel: 'high',
    riskNote: '证据链存在缺口，送达凭证待补充',
  },
  {
    id: 'F-02',
    title: '货款金额计算口径',
    desc: '申请人主张货款总额82,957.70元，分项明细与合同附件记录存在约300元差异，双方对费用计算基数理解不一致。',
    evidence: ['合同附件价格清单', '采购付款流水明细', '发票存根（3份）'],
    extra: ['财务核算说明书（申请人提交）', '发票红冲记录'],
    status: '处理中',
    riskLevel: 'normal',
    riskNote: '金额差异较小，建议先行协商确认',
  },
  {
    id: 'F-03',
    title: '货物质量异议是否成立',
    desc: '被申请人主张部分货物存在质量缺陷，但未在合同约定的7日异议期内书面告知申请人，异议时效性存疑。',
    evidence: ['合同质量验收条款', '被申请人质检报告（未盖章）', '申请人出货记录'],
    extra: ['第三方检测机构报告（未提交）'],
    status: '待核查',
    riskLevel: 'normal',
    riskNote: '被申请人质检报告文件不完整，需催收补充材料',
  },
]

// 研判记录
export const analysisRecords = [
  {
    id: 'A-01',
    title: '证据链完整性阶段性结论',
    content: '采购合同主文、送货单存根、银行付款记录已形成基础证据闭环。但违约通知的送达凭证（快递回单或电子确认记录）目前仍未完整提供，建议在证据交换阶段截止前催促申请人补充提交。',
    author: '办案秘书 陈炜',
    time: '2026-03-25 09:30',
    type: 'human',
  },
  {
    id: 'A-02',
    title: '焦点优先级排序建议（AI辅助草稿）',
    content: '建议先集中处理焦点F-01「违约责任成立」，该焦点对最终裁决方向影响最大，且证据支撑缺口最明显。F-02金额口径差异小，可在F-01结论明确后并行处理。F-03质量异议因时效性存疑，可视答辩材料完整情况再决定是否需要启动鉴定程序。',
    author: 'AI 辅助草稿',
    time: '2026-03-24 18:10',
    type: 'ai',
  },
  {
    id: 'A-03',
    title: '程序节点推进分析',
    content: '当前证据交换节点截止时间为2026年3月27日，距今2天。双方主要证据目录已提交，建议今日完成核验确认并推进节点，避免因超时影响整体庭审安排。',
    author: '办案秘书 陈炜',
    time: '2026-03-24 16:45',
    type: 'human',
  },
]

// 协同动态
export const collabFeeds = [
  {
    role: '仲裁员',
    name: '王明远 仲裁员',
    text: '焦点F-01建议优先补充违约通知送达证据，建议联系申请人代理人黄德伟尽快提交快递回单。',
    time: '10:05',
    date: '今日',
    avatar: '王',
  },
  {
    role: '办案秘书',
    name: '陈炜 秘书',
    text: '已电话联系黄代理，确认快递回单正在查找，预计今日下午上传至系统。',
    time: '10:22',
    date: '今日',
    avatar: '陈',
  },
  {
    role: '调解员',
    name: '林晓燕 调解员',
    text: '建议同步查阅双方2026年2月的沟通往来记录，可能有助于澄清交货时间争议。',
    time: '10:44',
    date: '今日',
    avatar: '林',
  },
  {
    role: '办案秘书',
    name: '陈炜 秘书',
    text: '已将沟通记录添加到证据补充请求中，等待申请人确认。',
    time: '11:03',
    date: '今日',
    avatar: '陈',
  },
]

// 右侧侧栏 - 流程待办
export const flowTodos = [
  { id: 'T-01', title: '确认证据交换节点材料', priority: '高', priorityType: 'danger', due: '今日 18:00', dueSoon: true },
  { id: 'T-02', title: '更新节点处理意见并推进', priority: '高', priorityType: 'warning', due: '明日 10:00', dueSoon: false },
  { id: 'T-03', title: '通知双方下一次庭审时间', priority: '中', priorityType: 'info', due: '本周五', dueSoon: false },
]

// 右侧侧栏 - 工作待办
export const workTodos = [
  { id: 'W-01', title: '整理付款凭证比对结果', priority: '高', priorityType: 'danger', due: '今日 16:30', dueSoon: true },
  { id: 'W-02', title: '催收申请人送达凭证', priority: '高', priorityType: 'warning', due: '今日 18:00', dueSoon: true },
  { id: 'W-03', title: '准备庭前沟通要点汇总', priority: '中', priorityType: 'info', due: '明日 10:00', dueSoon: false },
]

// 右侧侧栏 - 重点提醒
export const sideAlerts = [
  { text: '流程待办 T-01 临期 8 小时，需今日完成确认', level: 'danger' },
  { text: '焦点 F-01 证据支撑存在缺口，建议今日跟进', level: 'warning' },
  { text: '证据交换截止日3月27日，距今2天', level: 'info' },
]

// 右侧侧栏 - AI 当前要点
export const aiPoints = [
  '优先处理违约责任焦点，可降低后续争议扩散风险',
  '建议先补齐送达凭证，再确认货款金额口径',
  '下一步：完成 T-01 后触发节点推进至「庭审准备」',
]
