const secretaryRoutes = [
  {
    path: 'case-workbench',
    name: '案件作业台',
    component: () => import('../../views/案件作业台/index.vue'),
  },
  {
    path: 'workbench',
    name: '工作台',
    component: () => import('../../views/工作台/index.vue'),
  },
  {
    path: 'node-tracking',
    name: '流程节点追踪',
    component: () => import('../../views/流程节点追踪/index.vue'),
  },
  {
    path: 'batch-filing',
    name: '立案中心',
    component: () => import('../../views/立案中心/index.vue'),
  },
  {
    path: 'arbitrator-workbench',
    name: '仲裁员工作台',
    component: () => import('../../views/仲裁员工作台/index.vue'),
  },
  {
    path: 'admin-dashboard',
    name: '管理驾驶舱',
    component: () => import('../../views/管理驾驶舱/index.vue'),
  },
]

export default secretaryRoutes
