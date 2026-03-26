const secretaryRoutes = [
  {
    path: 'case-workbench',
    name: '案件办理台',
    component: () => import('../../views/案件总作业台/index.vue'),
  },
  {
    path: 'workbench',
    name: '办案秘书工作台',
    component: () => import('../../views/办案秘书工作台/index.vue'),
  },
  {
    path: 'node-tracking',
    name: '流程节点追踪',
    component: () => import('../../views/流程节点追踪/index.vue'),
  },
  {
    path: 'batch-filing',
    name: '立案中心',
    component: () => import('../../views/批量立案中心/index.vue'),
  },
]

export default secretaryRoutes
