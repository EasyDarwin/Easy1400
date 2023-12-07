import React, { createContext } from 'react';

interface IProps {
    deviceID: string;
    galleryDictTypes:Dict.DataItem[];
  }

// 创建上下文对象
const SharedDataContext = createContext<IProps>({
  deviceID: '',
  galleryDictTypes: []
});

export default SharedDataContext;