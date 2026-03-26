import { computed, reactive } from 'vue'

const now = () => new Date().toLocaleString('zh-CN', { hour12: false })

const nextNodeMap = {
  立案受理: '材料校验',
  材料校验: '立案复核',
  立案复核: '立案完成',
  立案完成: '立案完成',
}

const state = reactive({
  cases: [
    { id: 'AR2026-001', title: '服务合同争议', applicant: '广州成远科技', respondent: '德信商贸', node: '立案受理', status: '待处理', riskLevel: '高', riskReason: '关键材料缺失', deadlineDays: 0, secretary: '李敏', updatedAt: now() },
    { id: 'AR2026-002', title: '采购付款争议', applicant: '华恒供应链', respondent: '南方设备', node: '材料校验', status: '处理中', riskLevel: '一般', riskReason: '信息字段冲突', deadlineDays: 1, secretary: '李敏', updatedAt: now() },
    { id: 'AR2026-003', title: '租赁违约争议', applicant: '金桥物业', respondent: '天禾物流', node: '立案复核', status: '处理中', riskLevel: '无', riskReason: '', deadlineDays: 3, secretary: '李敏', updatedAt: now() },
    { id: 'AR2026-004', title: '合作协议争议', applicant: '粤安咨询', respondent: '智合传媒', node: '立案受理', status: '待补正', riskLevel: '高', riskReason: '时限临近', deadlineDays: 0, secretary: '李敏', updatedAt: now() },
    { id: 'AR2026-005', title: '知识产权争议', applicant: '泽明数字', respondent: '蓝岸互动', node: '材料校验', status: '待处理', riskLevel: '一般', riskReason: '附件不完整', deadlineDays: 2, secretary: '李敏', updatedAt: now() },
    { id: 'AR2026-006', title: '建设工程争议', applicant: '华南建设', respondent: '柏瑞装饰', node: '立案受理', status: '待处理', riskLevel: '无', riskReason: '', deadlineDays: 1, secretary: '李敏', updatedAt: now() },
  ],
  operationLogs: [
    { id: 'log-01', content: '批量校验完成，新增 4 条警告项', operator: '李敏', time: now() },
    { id: 'log-02', content: '案件 AR2026-004 转入补正环节', operator: '李敏', time: now() },
    { id: 'log-03', content: '已对 3 条临期案件发起催办', operator: '李敏', time: now() },
  ],
})

const pushLog = (content) => {
  state.operationLogs.unshift({
    id: `log-${Date.now()}`,
    content,
    operator: '李敏',
    time: now(),
  })
}

export const summaryMetrics = computed(() => {
  const todayTodo = state.cases.filter((item) => ['待处理', '处理中', '待补正'].includes(item.status)).length
  const urgent = state.cases.filter((item) => item.deadlineDays <= 1).length
  const overtime = state.cases.filter((item) => item.deadlineDays < 0).length
  const highRisk = state.cases.filter((item) => item.riskLevel === '高').length
  return { todayTodo, urgent, overtime, highRisk }
})

export const myCases = computed(() => state.cases)
export const operationLogs = computed(() => state.operationLogs)

export const batchUpdateCases = (ids, actionType) => {
  state.cases.forEach((item) => {
    if (!ids.includes(item.id)) return
    if (actionType === '催办') {
      item.updatedAt = now()
    }
    if (actionType === '推进节点') {
      item.node = nextNodeMap[item.node]
      item.status = item.node === '立案完成' ? '已提交立案' : '处理中'
      item.updatedAt = now()
    }
  })
  if (ids.length > 0) {
    pushLog(`已对 ${ids.length} 条案件执行${actionType}`)
  }
}

export const markCaseRisk = (ids) => {
  state.cases.forEach((item) => {
    if (!ids.includes(item.id)) return
    item.riskLevel = '高'
    item.riskReason = '人工标记重点关注'
    item.updatedAt = now()
  })
  if (ids.length > 0) {
    pushLog(`已标记 ${ids.length} 条案件为高风险`)
  }
}

export const addFiledCases = (count) => {
  for (let i = 0; i < count; i += 1) {
    const base = state.cases.length + 1
    state.cases.unshift({
      id: `AR2026-${String(base).padStart(3, '0')}`,
      title: '批量导入案件',
      applicant: `导入申请人${base}`,
      respondent: `导入被申请人${base}`,
      node: '立案受理',
      status: '待处理',
      riskLevel: '无',
      riskReason: '',
      deadlineDays: 2,
      secretary: '李敏',
      updatedAt: now(),
    })
  }
  if (count > 0) {
    pushLog(`批量提交立案成功 ${count} 条`)
  }
}
