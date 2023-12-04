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
      name: '设备',
      path: '/devices',
      component: 'device/view',
    },
    {
      name: '图库',
      path: '/gallery',
      component: 'gallery/view',
    },
    {
      name: '级联',
      path: '/cascade',
      component: 'cascade/view',
    },
  ],
  antd: {},
  reactQuery: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  publicPath: '/',
  history: { type: 'hash' },
  layout: {
    title: '1400视图库管理系统',
  },
  define: {
    'process.env': {
      PUBLIC_PATH: '/',
      SOME_KEY: 'value',
      WEB_VERSION: '0.0.1',
      BASEURL: '/api',
      PAGE_TITLE: false, //是否显示页面title
    },
  },
  tailwindcss: {},
  fastRefresh: true,
  npmClient: 'yarn',
});
