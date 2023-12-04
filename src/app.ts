// 运行时配置
import { RunTimeLayoutConfig } from '@umijs/max';
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout: RunTimeLayoutConfig = () => {
  return {
    logo: './favicon.ico',
    menu: {
      locale: false,
      theme: 'dark',
    },
    token: {
      // sider 侧边栏配置 可参考 https://pro-components.antdigital.dev/components/layout#sider-token
      sider: {
        colorTextMenu:'#000',
        colorTextMenuSelected: '#ffffff',
        colorTextMenuActive:'#ffffff',
        colorBgMenuItemSelected: '#0081f8',
        colorBgMenuItemHover:'#a3dfff',
      },
    },
    rightContentRender: false,
  };
};

export const reactQuery = {
  devtool: {
    initialIsOpen: true,
  },
  queryClient: {
    defaultOptions: {
      queries: {
        cacheTime: 5 * 60 * 1000,
        staleTime: 0,
        retry: 0,
        refetchOnWindowFocus: false,
      },
    },
  },
};
