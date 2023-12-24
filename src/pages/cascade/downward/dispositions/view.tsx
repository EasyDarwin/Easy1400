import React, { useRef, useState } from 'react';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useQuery, useSearchParams } from '@umijs/max';
import { Button, Popconfirm, Space, Tag, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import FunctionBar, { ButtonList } from '@/components/bar/FunctionBar';
import Box from '@/components/box/Box';
import { CACHE_CLEAR_TIME } from '@/constants';
import { shortenString } from '@/package/string/string';
import {
  FindDownwardDispositions,
  findDownwardDispoitions,
} from '@/services/http/cascade';
import { FindDictDatas } from '@/services/http/dict';
import { ErrorHandle } from '@/services/http/http';
import { AxiosResponse } from 'axios';
import DispositionFrom, {
  IDownDispositionRef,
} from './components/DownDispositionFrom';
import {findDictLabel} from '@/package/array/array'


const Dispositions: React.FC = () => {
  const [searchParams, _] = useSearchParams();
  const deviceID = searchParams.get('device_id') ?? '';
  const dispositionRef = useRef<IDownDispositionRef>();

  const columns: ColumnsType<Cascade.DownDispositionItem> = [
    {
      title: '布控标识',
      dataIndex: 'EXT.SubscribeID',
      align: 'center',
      ellipsis: {
        showTitle: false,
      },
      width: 130,
      render: (_: string, record: Cascade.DownDispositionItem) => (
        <Tooltip title={record.Ext?.DispositionID}>
          {shortenString(record.Ext?.DispositionID ?? '')}
        </Tooltip>
      ),
    },
    {
      title: '订阅标题',
      dataIndex: 'Ext.Title',
      align: 'center',
      render: (_: string, record: Cascade.DownDispositionItem) => (
        <span>{record.Ext?.Title ?? ''}</span>
      ),
    },
    {
      title: '布控类别',
      dataIndex: 'Ext.DispositionCateg',
      align: 'center',
      render: (_: string, record: Cascade.DownDispositionItem) => (
        <Tag>
          {findDictLabel(dictTypeList ?? [],record.Ext?.DispositionCategory ?? '')}
        </Tag>
      ),
    },
    {
      title: '时间',
      align: 'center',
      render: (text: string, record: Cascade.DownDispositionItem) => (
        <span>
          <div>开始时间:{record.Ext?.BeginTime}</div>
          <div>结束时间:{record.Ext?.EndTime}</div>
        </span>
      ),
    },

    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 130,
      render: (text: string, record: Cascade.DownDispositionItem) => (
        <Space>
          <Tooltip title="删除">
            <Popconfirm
              title={
                <p>
                  确定删除
                  <span className="text-red-500">
                    {' '}
                    {record.Ext?.DispositionID}{' '}
                  </span>
                  级联吗?
                </p>
              }
              onConfirm={() => {}}
            >
              <Button type="dashed" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const [loadings, setLoadings] = useState<string[]>([]);

  const funcBtnList: ButtonList[] = [
    //顶部按钮列表
    {
      label: '添加',
      loading: false,
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: () => {
        dispositionRef.current?.setFieldsValue();
      },
    },
  ];

  const [pagination, setPagination] = useState<
    Cascade.ListReq & { code: string }
  >({
    size: 10,
    page: 1,
    code: deviceID || '',
  });

  const { data: dispositionData, isLoading: dispositionLoading } =
    useQuery<Cascade.DownDispositionsRes>(
      [findDownwardDispoitions, pagination],
      () =>
        FindDownwardDispositions(pagination).then(
          (res: AxiosResponse) => res.data,
        ),
      {
        onError: ErrorHandle,
      },
    );

  //获取订阅类别字典列表
  const { data: dictTypeList } = useQuery<Dict.DataItem[]>(
    ['dispositionType'],
    () =>
      FindDictDatas('DispositionCategoryType').then(
        (res: AxiosResponse) => res.data.items,
      ),
    {
      staleTime: CACHE_CLEAR_TIME,
      onError: ErrorHandle,
    },
  );

  const { data: dictDispositionTypeList } = useQuery<Dict.DataItem[]>(
    ['DispositionRangeType'],
    () =>
      FindDictDatas('DispositionRangeType').then(
        (res: AxiosResponse) => res.data.items,
      ),
    {
      staleTime: CACHE_CLEAR_TIME,
      onError: ErrorHandle,
    },
  );

  return (
    <PageContainer title={process.env.PAGE_TITLE}>
      <Box>
        <FunctionBar btnChannle={funcBtnList} />
      </Box>
      <Box>
        <Table
          loading={dispositionLoading}
          rowKey={'ApeID'}
          key={'system_app_table_key'}
          columns={columns}
          dataSource={dispositionData?.items}
          pagination={{
            total: dispositionData?.total,
            pageSize: pagination.size,
            current: pagination.page,
            onChange: (page: number, size: number) => {
              setPagination({ ...pagination, page, size });
            },
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Box>
      <DispositionFrom dispositionTypeList={dictDispositionTypeList || []} dictTypeList={dictTypeList || []} ref={dispositionRef} />
    </PageContainer>
  );
};

export default Dispositions;
