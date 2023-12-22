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
      path: '/cascade',
      component: 'cascade/view',
    },
    {
      name: '上级布控',
      path: '/cascade/dispositions',
      component: 'cascade/dispositions/view',
      hideInMenu: true,
    },
    {
      name: '上级订阅',
      path: '/cascade/subscribes',
      component: 'cascade/subscribes/view',
      hideInMenu: true,
    },
    {
      name: '通知记录',
      path: '/cascade/notification',
      component: 'cascade/notification/view',
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
        {
          name: '系统信息',
          path: '/system/info',
          component: 'system/info/view',
        },
      ],
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
    title: '1400视图库管理系统',
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
