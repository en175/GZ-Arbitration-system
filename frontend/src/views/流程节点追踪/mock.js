// ============================================================
// 我的案件看板 Mock 数据
// 办案秘书陈炜的全部在办案件，按节点阶段分布
// ============================================================

// 节点阶段定义（仲裁流程）
export const stageColumns = [
  { key: 'filing', label: '立案材料审核', color: '#722ed1', bgColor: 'rgba(114,46,209,0.07)' },
  { key: 'evidence', label: '证据交换', color: '#3b66f5', bgColor: 'rgba(59,102,245,0.07)' },
  { key: 'hearing', label: '庭审准备', color: '#00a8cc', bgColor: 'rgba(0,168,204,0.07)' },
  { key: 'mediation', label: '调解/裁决', color: '#00b479', bgColor: 'rgba(0,180,121,0.07)' },
  { key: 'closing', label: '结案归档', color: '#86909c', bgColor: 'rgba(134,144,156,0.07)' },
]

// 各阶段案件（看板卡片）
export const kanbanCases = {
  filing: [
    {
      id: 'GZ-2026-4520',
      caseNo: '（2026）粤仲案字第4520号',
      parties: '粤安咨询 诉 智合传媒',
      caseType: '服务合同纠纷',
      node: '材料补正',
      priority: 'urgent',
      due: '今日 17:00',
      issues: 2,
      issueDesc: '申请人材料2项缺失',
    },
    {
      id: 'GZ-2026-7201',
      caseNo: '（2026）粤仲案字第7201号',
      parties: '明泰科技 诉 联盛建材',
      caseType: '买卖合同纠纷',
      node: '材料审核',
      priority: 'normal',
      due: '明日 12:00',
      issues: 0,
      issueDesc: '',
    },
  ],
  evidence: [
    {
      id: 'GZ-2026-5412',
      caseNo: '（2026）粤仲案字第5412号',
      parties: '新菱空调 诉 广东恒力建设',
      caseType: '买卖合同纠纷',
      node: '证据核验',
      priority: 'high',
      due: '今日 18:00',
      issues: 1,
      issueDesc: '送达凭证尚未补充',
    },
    {
      id: 'GZ-2026-3821',
      caseNo: '（2026）粤仲案字第3821号',
      parties: '华恒供应链 诉 南方设备',
      caseType: '采购付款纠纷',
      node: '等待答辩',
      priority: 'urgent',
      due: '今日 16:30',
      issues: 0,
      issueDesc: '',
    },
  ],
  hearing: [
    {
      id: 'GZ-2026-2601',
      caseNo: '（2026）粤仲案字第2601号',
      parties: '宏远地产 诉 博源装饰',
      caseType: '建设工程纠纷',
      node: '庭审通知',
      priority: 'normal',
      due: '明日 14:00',
      issues: 0,
      issueDesc: '',
    },
  ],
  mediation: [
    {
      id: 'GZ-2026-2190',
      caseNo: '（2026）粤仲案字第2190号',
      parties: '金桥物业 诉 天禾物流',
      caseType: '租赁合同纠纷',
      node: '调解进行中',
      priority: 'normal',
      due: '本周五',
      issues: 0,
      issueDesc: '',
    },
    {
      id: 'GZ-2026-0944',
      caseNo: '（2026）粤仲案字第0944号',
      parties: '泽明数字 诉 蓝岸互动',
      caseType: '知识产权纠纷',
      node: '等待裁决',
      priority: 'low',
      due: '下周一',
      issues: 0,
      issueDesc: '',
    },
  ],
  closing: [
    {
      id: 'GZ-2026-1847',
      caseNo: '（2026）粤仲案字第1847号',
      parties: '泽明数字 诉 蓝岸互动',
      caseType: '知识产权纠纷',
      node: '结案归档',
      priority: 'normal',
      due: '后日 10:00',
      issues: 0,
      issueDesc: '',
    },
  ],
}

// 顶部统计
export const statsOverview = [
  { label: '在办案件总数', value: 8, unit: '件', color: '#3b66f5' },
  { label: '临期待处理', value: 3, unit: '件', color: '#f53f3f' },
  { label: '存在问题项', value: 3, unit: '件', color: '#ff7d00' },
  { label: '本周结案', value: 1, unit: '件', color: '#00b479' },
]

// AI 节点分析
export const aiNodeAnalysis = [
  '证据交换阶段当前有2件，其中1件送达凭证缺失，建议今日跟进',
  '立案材料审核阶段1件存在补正待办，已临期',
  '调解/裁决阶段进展平稳，无紧急事项',
]
