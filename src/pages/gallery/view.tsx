
import React, { useState } from 'react';
import {
  findFace,
  findMotorVehicles,
  findNonMotorVehicles,
  findPersons,
} from '@/services/http/gallery';
import { FindDictDatas } from '@/services/http/dict';
import { ErrorHandle } from '@/services/http/http';
import { CACHE_CLEAR_TIME } from '@/constants';


import { useQuery, useSearchParams,useQueryClient } from '@umijs/max';
import { AxiosResponse } from 'axios';
import { SyncOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Tag } from 'antd';

import Box from '@/components/box/Box';

import FunctionBar, { ButtonList } from '@/components/bar/FunctionBar';
import Face from './components/Face';
import MotorVehicle from './components/MotorVehicle';
import NonMotorVehicle from './components/NonMotorvehicle';
import Person from './components/Person';
import SharedDataContext from './components/SharedDataContext';
import ToolBox, { ToolBoxProps } from '@/components/toolBox/ToolBox';

const View: React.FC = () => {
  const [searchParams, _] = useSearchParams();
  const deviceID = searchParams.get('device_id') ?? '';
  const queryClient = useQueryClient();

  const [currentPageKey, setCurrentPageKey] = useState('face');

  const barBtnList: ButtonList[] = [
    {
      label: '人脸',
      loading: false,
      type: 'primary',
      onClick: () => {
        setCurrentPageKey(findFace);
      },
    },
    {
      label: '人员',
      loading: false,
      type: 'primary',
      onClick: () => {
        setCurrentPageKey(findPersons);
      },
    },
    {
      label: '机动车',
      loading: false,
      type: 'primary',
      onClick: () => {
        setCurrentPageKey(findMotorVehicles);
      },
    },
    {
      label: '非机动车',
      loading: false,
      type: 'primary',
      onClick: () => {
        setCurrentPageKey(findNonMotorVehicles);
      },
    },
    {
      label: '物品',
      loading: false,
      type: 'primary',
      disabled: true,
      onClick: () => {},
    },
    {
      label: '图像',
      loading: false,
      type: 'primary',
      disabled: true,
      onClick: () => {},
    },
    {
      label: '视频片段',
      loading: false,
      type: 'primary',
      disabled: true,
      onClick: () => {},
    },
    {
      label: '文件',
      loading: false,
      type: 'primary',
      disabled: true,
      onClick: () => {},
    },
  ];

  //工具栏按钮
  const toolBtnList: ToolBoxProps[] = [
    {
      id: '4',
      icon: <SyncOutlined />,
      onClick: () => {
        queryClient.invalidateQueries([currentPageKey]);
      },
    },
  ];

  //获取图片类型字典
  const { data: galleryTypeList } = useQuery<Dict.DataItem[]>(
    ['Imagetype'],
    () =>
      FindDictDatas('Imagetype').then((res: AxiosResponse) => res.data.items),
    {
      staleTime: CACHE_CLEAR_TIME,
      onError: ErrorHandle,
    },
  );

  return (
    <PageContainer title={process.env.PAGE_TITLE}>
      <Box>
        <div className="flex justify-between items-center">
          <FunctionBar btnChannle={barBtnList} />
          <Tag color="processing">设备ID: {deviceID}</Tag>
        </div>
      </Box>
      <Box>
        <SharedDataContext.Provider
          value={{ deviceID, galleryDictTypes: galleryTypeList || [] }}
        >
          {currentPageKey == findFace && <Face />}
          {currentPageKey == findPersons && <Person />}
          {currentPageKey == findMotorVehicles && <MotorVehicle />}
          {currentPageKey == findNonMotorVehicles && <NonMotorVehicle />}
        </SharedDataContext.Provider>
      </Box>
      <ToolBox data={toolBtnList} />
    </PageContainer>
  );
};

export default View;
