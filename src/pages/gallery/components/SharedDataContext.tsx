import React, { createContext } from 'react';

interface IProps {
    deviceID: string;
    galleryDictTypes:Record<string,string>;
    searchPlateNoValue?:string;
    searchIdValue?:string;
    searchTimeValue?:{start:number;end:number;}
    viewType:string;
    openModal(key: string, info: any): any
  }

// 创建上下文对象
const SharedDataContext = createContext<IProps>({
  deviceID: '',
  galleryDictTypes: {},
  searchPlateNoValue:'',
  searchIdValue:'',
  searchTimeValue:{start:0,end:0},
  viewType:localStorage.getItem('galleryViewType') || 'card',
  openModal: () => {}
});

export default SharedDataContext;