/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const customRouter = [
  {
    path: '/vehicleManage',
    component: Layout,
    meta: { title: 'vehicleManage', icon: 'international' },
    children: [
      {
        path: 'vehicleManage',
        component: () => import('@/views/vehicleManage/vehicleManage'),
        name: 'Vehicle Manage',
        meta: { title: 'vehicleManage', icon: 'international' }
      },
    ]
  },
  {
    path: '/behaviorMonitor',
    component: Layout,
    meta: { title: 'behaviorMonitor', icon: 'international' },
    children: [
      {
        path: 'monitorDashboard',
        component: () => import('@/views/behaviorMonitor/dashboard'),
        name: 'Monitor Dashboard',
        meta: { title: 'monitorDashboard', icon: 'international' }
      },
      {
        path: 'monitorRecord',
        component: () => import('@/views/behaviorMonitor/index'),
        name: 'Monitor Record',
        meta: { title: 'monitorRecord', icon: 'international' }
      },
    ]
  },
  {
    path: '/videoManage',
    component: Layout,
    meta: { title: 'videoManage', icon: 'international' },
    children: [
      {
        path: 'moduleManage',
        component: () => import('@/views/videoManage/moduleManage'),
        name: 'moduleManage',
        meta: { title: 'moduleManage', icon: 'international' }
      },
      {
        path: 'videoLibrary',
        hidden: true,
        component: () => import('@/views/videoManage/videoLibrary'),
        name: 'videoLibrary',
        meta: { title: 'videoLibrary', icon: 'international' }
      },
    ]
  },
];

export default customRouter
