import { defineConfig } from '@umijs/max';

export default defineConfig({
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      component: 'login/view',
      layout: false,
    },
    {
      name: '首页',
      path: '/home',
      component: 'home/view',
    },
    {
      name: '采集设备',
      path: '/devices',
      component: 'device/view',
    },
    {
      name: '内容图库',
      path: '/gallery',
      component: 'gallery/view',
    },
    {
      name: '向上级联',
      path: '/upward/cascade',
      component: 'cascade/upward/view',
    },
    {
      name: '上级订阅',
      path: '/upward/cascade/subscribes',
      component: 'cascade/upward/subscribes/view',
      hideInMenu: true,
    },
    {
      name: '通知记录',
      path: '/upward/cascade/notification',
      component: 'cascade/upward/notification/view',
      hideInMenu: true,
    },
    {
      name: '上报记录',
      path: '/upward/cascade/reporting',
      component: 'cascade/upward/reporting/view',
      hideInMenu: true,
    },
    {
      name: '下级平台',
      path: '/downward/cascade',
      component: 'cascade/downward/view',
    },
    {
      name: '设备清单',
      path: '/downward/cascade/checklist/:device_id',
      component: 'cascade/downward/checklist/view',
      hideInMenu: true,
    },
    {
      name: '订阅内容',
      path: '/downward/cascade/subscribes',
      component: 'cascade/downward/subscribes/view',
      hideInMenu: true,
    },
    {
      name: '下级布控',
      path: '/downward/cascade/dispositions',
      component: 'cascade/downward/dispositions/view',
      hideInMenu: true,
    },
    {
      name: '通知记录',
      path: '/downward/cascade/subscribes/notification',
      component: 'cascade/downward/notification/view',
      hideInMenu: true,
    },
    {
      name: '系统设置',
      path: '/system',
      routes: [
        {
          path: '/system',
          redirect: '/system/dicts',
        },
        {
          path: '/system/dicts',
          component: 'system/dict/view',
          name: '字典管理',
        },
        {
          name: '资源管理',
          path: '/system/resource',
          component: 'system/resource/view',
        },
        // {
        //   name: '系统信息',
        //   path: '/system/info',
        //   component: 'system/info/view',
        // },
        {
          name: '定时任务',
          path: '/system/cron',
          component: 'system/cron/view',
        },
        {
          name: '导入记录',
          path: '/system/importhistory',
          component: 'system/import/view',
        },
        {
          name: '关于我们',
          path: '/system/about',
          component:'system/about/view',
        },
      ],
    },
    {
      name: '修改密码',
      path: '/user/edit',
      component: 'user/edit/view',
      hideInMenu: true,
    },
    {
      path: '/404',
      component: '404',
    },
  ],
  antd: {},
  reactQuery: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  publicPath: '/admin/',
  history: { type: 'hash' },
  layout: {
    title: '',
  },
  define: {
    'process.env': {
      PUBLIC_PATH: '/admin/',
      SOME_KEY: 'value',
      WEB_VERSION: '0.0.1',
      BASEURL: '/',
      PAGE_TITLE: false, //是否显示页面title
    },
  },
  tailwindcss: {},
  fastRefresh: true,
  npmClient: 'yarn',
  esbuildMinifyIIFE: true,
});
