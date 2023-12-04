import { defineConfig } from '@umijs/max';

export default defineConfig({
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './home',
    },
  ],
  antd: {},
  reactQuery:{},
  access: {},
  model: {},
  initialState: {},
  request: {},
  publicPath: '/',
  history: { type: 'hash' },
  layout: {
    title: '',
  },
  define: {
    'process.env': {
      PUBLIC_PATH: '/',
      SOME_KEY: 'value',
      WEB_VERSION: '0.0.1',
      BASEURL: '/api',
    },
  },
  tailwindcss: {},
  fastRefresh: true,
  npmClient: 'yarn',
});
