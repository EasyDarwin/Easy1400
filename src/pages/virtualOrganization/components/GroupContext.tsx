import { createContext } from 'react';

interface IProps {
  refreshTree(info?: any, type?: any): any
}

// 创建上下文对象
const SharedDataContext = createContext<IProps>({
  refreshTree: () => {}
});

export default SharedDataContext;