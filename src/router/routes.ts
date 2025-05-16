export default [
  // 交易加速
  {
    path: '/',
    name: 'energy',
    component: () => import('@/pages/energy/index.vue'),
  },

  // PC端
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/pc/home/index.vue'),
  },
]
