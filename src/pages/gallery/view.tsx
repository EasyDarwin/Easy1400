import { CACHE_CLEAR_TIME } from '@/constants';
import { FindDictDatas } from '@/services/http/dict';
import {
  findFace,
  findMotorVehicles,
  findNonMotorVehicles,
  findPersons,
} from '@/services/http/gallery';
import { ErrorHandle } from '@/services/http/http';
import React, { useRef, useState } from 'react';

import {
  PictureOutlined,
  SyncOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useQuery, useQueryClient, useSearchParams } from '@umijs/max';
import { DatePicker, DatePickerProps } from 'antd';
import { AxiosResponse } from 'axios';

import Box from '@/components/box/Box';

import FunctionBar, { ButtonList } from '@/components/bar/FunctionBar';
import ToolBox, { ToolBoxProps } from '@/components/toolBox/ToolBox';
import { datePickerToTimestamp } from '@/package/time/time';
import { RangePickerProps } from 'antd/es/date-picker';
import Search from 'antd/es/input/Search';
import Face from './components/Face';
import MotorVehicle from './components/MotorVehicle';
import NonMotorVehicle from './components/NonMotorvehicle';
import Person from './components/Person';
import SharedDataContext from './components/SharedDataContext';

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
        onChangeClearSearch(findFace);
      },
    },
    {
      label: '人员',
      loading: false,
      type: 'primary',
      onClick: () => {
        onChangeClearSearch(findPersons);
      },
    },
    {
      label: '机动车',
      loading: false,
      type: 'primary',
      onClick: () => {
        onChangeClearSearch(findMotorVehicles);
      },
    },
    {
      label: '非机动车',
      loading: false,
      type: 'primary',
      onClick: () => {
        onChangeClearSearch(findNonMotorVehicles);
      },
    },
  ];

  //切换页面清除筛选条件
  const onChangeClearSearch = (key: string) => {
    setCurrentPageKey(key);
  };

  //筛选组件
  const [searchIdValue, setSearchIdValue] = useState<string>();
  const [searchPlateNoValue, setSearchPlateNoValue] = useState<string>('');
  const [searchTimeValue, setSearchTimeValue] = useState<{
    start: number;
    end: number;
  }>();

  const onOk = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
  ) => {
    if (Array.isArray(value) && value.length === 2) {
      let time = datePickerToTimestamp(value);
      setSearchTimeValue(time);
    }
  };
  //清空时间
  const onCalendarChange = (dates: any, dateStrings: any) => {
    if (dates === null || dates.length === 0) {
      setSearchTimeValue({ start: 0, end: 0 });
    }
  };

  const funcSearchComponet = (
    <div
      className={
        currentPageKey == findMotorVehicles
          ? 'flex mt-3 justify-between'
          : 'flex'
      }
    >
      <DatePicker.RangePicker
        showTime
        className="mr-2"
        format="YYYY-MM-DD HH:mm:ss"
        onOk={onOk}
        onCalendarChange={onCalendarChange}
      />
      <Search
        defaultValue={deviceID}
        className="w-96"
        enterButton
        placeholder="请输入设备ID"
        onSearch={(value: string) => {
          setSearchIdValue(value.trim());
        }}
        onChange={(e) => {
          if (e.target.value === '') {
            setSearchIdValue(e.target.value);
          }
        }}
      />
      {currentPageKey == findMotorVehicles && (
        <Search
          className="w-80"
          enterButton
          placeholder="请输入车辆牌照"
          onSearch={(value: string) => {
            setSearchPlateNoValue(value.trim());
          }}
          onChange={(e) => {
            if (e.target.value === '') {
              setSearchIdValue(e.target.value);
            }
          }}
        />
      )}
    </div>
  );

  //控制图库显示方式是通过列表或者卡片方式展示
  const [viewType, setViewType] = useState<string>(
    localStorage.getItem('galleryViewType') || 'card',
  );

  //工具栏按钮
  const toolBtnList: ToolBoxProps[] = [
    {
      id: '4',
      icon: <SyncOutlined />,
      onClick: () => {
        queryClient.invalidateQueries([currentPageKey]);
      },
    },
    {
      id: '5',
      icon:
        viewType == 'table' ? <UnorderedListOutlined /> : <PictureOutlined />,
      onClick: () => {
        let type = viewType == 'table' ? 'card' : 'table';
        setViewType(type);
        localStorage.setItem('galleryViewType', type);
      },
    },
  ];

  //获取图片类型字典 这里采用 map 对照
  const galleryDictTypes = useRef({});
  const {} = useQuery<Dict.DataItem[]>(
    ['Imagetype'],
    () =>
      FindDictDatas('Imagetype').then((res: AxiosResponse) => {
        const galleryDictTypesMap = res.data.items.reduce(
          (
            map: { [x: string]: any },
            item: { value: string | number; label: any },
          ) => {
            map[item.value] = item.label;
            return map;
          },
          {},
        );
        galleryDictTypes.current = galleryDictTypesMap;
        return res.data.items;
      }),
    {
      staleTime: CACHE_CLEAR_TIME,
      onError: ErrorHandle,
    },
  );

  return (
    <PageContainer title={process.env.PAGE_TITLE}>
      <Box>
        {/* <Tag color="processing">设备ID: {deviceID}</Tag> */}
        <div className="flex justify-between items-center mt-2">
          <FunctionBar
            btnChannle={barBtnList}
            span={currentPageKey == findMotorVehicles ? [24, 24] : [8, 16]}
            rigthChannle={funcSearchComponet}
            rigthChannleClass={
              currentPageKey == findMotorVehicles ? '' : 'flex justify-end'
            }
            isBar={false}
          />
        </div>
      </Box>
      <Box style={{ padding: '8px' }}>
        <SharedDataContext.Provider
          value={{
            searchPlateNoValue,
            searchIdValue,
            deviceID,
            galleryDictTypes: galleryDictTypes.current || {},
            viewType,
            searchTimeValue,
          }}
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
