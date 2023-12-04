// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    logo: './favicon.ico',
    menu: {
      locale: false,
    },
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