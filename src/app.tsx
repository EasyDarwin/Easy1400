// 运行时配置
import { RunTimeLayoutConfig,history } from '@umijs/max';
import FooterContent from './components/footerContent/FooterContent';
import Footer from './components/footer/Footer';
import { LOGIN_PAGE_ROUTE } from './constants';
import { getToken } from './services/http/http';
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
// export async function getInitialState(): Promise<{ name: string }> {
//   return { name: 'admin' };
// }

export const layout:RunTimeLayoutConfig= () => {
  return {
    logo: './favicon.ico',
    rightContentRender: () => <FooterContent />,
    footerRender:()=><Footer/>
  }
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
