// ============================================================
// 立案中心 Mock 数据
// 来自主系统立案模块，待办案秘书审核受理的新案件队列
// ============================================================

// 筛选标签定义
export const filterTabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待审核' },
  { key: 'correcting', label: '补正中' },
  { key: 'passed', label: '已通过' },
]

// 待受理案件队列
export const filingQueue = [
  {
    id: 'GZ-2026-8801',
    caseNo: '（2026）粤仲受字第8801号',
    parties: '广州荣达科技 诉 珠海信恒电子',
    caseType: '买卖合同纠纷',
    amount: '134,500.00',
    filedAt: '2026-03-25 09:14',
    status: 'pending',
    aiCheckPassed: 3,
    aiCheckFailed: 2,
    aiCheckTotal: 5,
    aiIssues: [
      '申请书未注明仲裁条款依据',
      '被申请人营业执照复印件缺失',
    ],
    urgency: 'high',
    source: '线上申请',
  },
  {
    id: 'GZ-2026-8802',
    caseNo: '（2026）粤仲受字第8802号',
    parties: '顺丰冷链物流 诉 东莞鼎盛食品',
    caseType: '服务合同纠纷',
    amount: '67,200.00',
    filedAt: '2026-03-25 10:02',
    status: 'pending',
    aiCheckPassed: 5,
    aiCheckFailed: 0,
    aiCheckTotal: 5,
    aiIssues: [],
    urgency: 'normal',
    source: '线上申请',
  },
  {
    id: 'GZ-2026-8803',
    caseNo: '（2026）粤仲受字第8803号',
    parties: '南方电网设备 诉 广州建基工程',
    caseType: '建设工程纠纷',
    amount: '980,000.00',
    filedAt: '2026-03-24 16:45',
    status: 'correcting',
    aiCheckPassed: 2,
    aiCheckFailed: 3,
    aiCheckTotal: 5,
    aiIssues: [
      '仲裁申请书签字/盖章缺失',
      '合同原件未提交',
      '争议金额计算说明不符',
    ],
    urgency: 'high',
    correctionDeadline: '2026-03-28',
    source: '线下提交',
  },
  {
    id: 'GZ-2026-8804',
    caseNo: '（2026）粤仲受字第8804号',
    parties: '广东泰和置业 诉 广州大宇装饰',
    caseType: '建设工程纠纷',
    amount: '2,350,000.00',
    filedAt: '2026-03-24 11:30',
    status: 'correcting',
    aiCheckPassed: 3,
    aiCheckFailed: 1,
    aiCheckTotal: 4,
    aiIssues: [
      '授权委托书未公证',
    ],
    urgency: 'normal',
    correctionDeadline: '2026-03-27',
    source: '线下提交',
  },
  {
    id: 'GZ-2026-8795',
    caseNo: '（2026）粤仲受字第8795号',
    parties: '中山博雅科技 诉 深圳泓远贸易',
    caseType: '技术服务合同纠纷',
    amount: '215,800.00',
    filedAt: '2026-03-23 14:20',
    status: 'passed',
    aiCheckPassed: 5,
    aiCheckFailed: 0,
    aiCheckTotal: 5,
    aiIssues: [],
    urgency: 'normal',
    source: '线上申请',
  },
  {
    id: 'GZ-2026-8793',
    caseNo: '（2026）粤仲受字第8793号',
    parties: '广州融兴贸易 诉 佛山汇通供应链',
    caseType: '采购付款纠纷',
    amount: '88,600.00',
    filedAt: '2026-03-23 09:55',
    status: 'passed',
    aiCheckPassed: 5,
    aiCheckFailed: 0,
    aiCheckTotal: 5,
    aiIssues: [],
    urgency: 'normal',
    source: '线上申请',
  },
]

// 顶部统计
export const filingStats = [
  { label: '今日新收案', value: 2, unit: '件', color: '#3b66f5' },
  { label: '待审核', value: 2, unit: '件', color: '#722ed1' },
  { label: '补正中', value: 2, unit: '件', color: '#ff7d00' },
  { label: '本周已受理', value: 4, unit: '件', color: '#00b479' },
]

// AI 核查维度（5项）
export const aiCheckDimensions = [
  '仲裁申请书完整性',
  '当事人主体资格',
  '仲裁协议有效性',
  '材料签字/盖章',
  '争议金额与诉请一致性',
]
