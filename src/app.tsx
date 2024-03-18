// 运行时配置
import { FindConfigs } from '@/services/http/config';
import { RunTimeLayoutConfig, history } from '@umijs/max';
import { AxiosResponse } from 'axios';
import Footer from './components/footer/Footer';
import FooterContent from './components/footerContent/FooterContent';
import { LOGIN_PAGE_ROUTE } from './constants';
import { getToken } from './services/http/http';
import { getConfig, setConfig } from './services/store/local';
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
// export async function getInitialState(): Promise<{ name: string }> {
//   return { name: 'admin' };
// }

export const layout: RunTimeLayoutConfig = () => {
  return {
    title: getConfig('title'),
    logo: './favicon.ico',
    rightContentRender: () => <FooterContent />,
    footerRender: () => <Footer />,
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

//路由拦截
export const onRouteChange = ({ location }: any) => {
  const token = getToken();
  if (!token && location.pathname !== LOGIN_PAGE_ROUTE) {
    history.push(LOGIN_PAGE_ROUTE);
  }
  if (token && location.pathname === LOGIN_PAGE_ROUTE) {
    history.push('/home');
  }
};

export function patchClientRoutes({ routes }: any) {
  if (!getConfig('isAbout')) {
    routes[1].routes[11].children[5] = {};
  }
}

export function render(oldRender: () => void) {
  FindConfigs()
    .then((res: AxiosResponse) => {
      setConfig(res.data);
      oldRender();
    })
    .catch(() => {
      console.log('加载配置失败');
      oldRender();
    });
}
