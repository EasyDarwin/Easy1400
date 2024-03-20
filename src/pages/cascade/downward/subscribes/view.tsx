import React, { useRef, useState } from 'react';
import {
  BellOutlined,
  DeleteOutlined,
  FormOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useMutation, useQuery, useSearchParams } from '@umijs/max';
import { Button, Popconfirm, Space, Tag, Tooltip, message } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import FunctionBar, { ButtonList } from '@/components/bar/FunctionBar';
import Box from '@/components/box/Box';
import { CACHE_CLEAR_TIME } from '@/constants';
import { findDictLabel } from '@/package/array/array';
import { timeToFormatTime } from '@/package/time/time';
import {
  DelDownwardSubscribes,
  FindDownwardSubscribes,
  findDownwardSubscribes,
} from '@/services/http/cascade';
import { FindDictDatas } from '@/services/http/dict';
import { ErrorHandle } from '@/services/http/http';
import { FindSystemInfo, findSystemInfo } from '@/services/http/system';
import { AxiosResponse } from 'axios';
import SubscribeFrom, { IDownCascadeRef } from './components/SubscribeFrom';

const SubScribes: React.FC = () => {
  const [searchParams, _] = useSearchParams();
  const deviceID = searchParams.get('device_id') ?? '';
  const isOnline = searchParams.get('is_online');
  const subscribeRef = useRef<IDownCascadeRef>(null);

  const columns: ColumnsType<Cascade.DownSubscribesListItem> = [
    {
      title: '订阅标识符',
      dataIndex: 'EXT.SubscribeID',
      align: 'center',
      fixed: true,
      width: 200,
      render: (_: string, record: Cascade.DownSubscribesListItem) => (
        <span>{record.id}</span>
      ),
    },
    {
      title: '订阅标题',
      dataIndex: 'Ext.Title',
      align: 'center',
      width: 200,
      render: (_: string, record: Cascade.DownSubscribesListItem) => (
        <span>{record.Ext?.Title ?? ''}</span>
      ),
    },
    {
      title: '订阅类别',
      align: 'center',
      width: 380,
      render: (_: string, record: Cascade.DownSubscribesListItem) => (
        record.Ext?.SubscribeDetail?.split(',').map((item, i) => (
          <Tag className="my-1" color="processing" key={i}>
            {findDictLabel(dictTypeList ?? [], item)}
          </Tag>
        ))
      ),
    },
    {
      title: '订阅状态',
      dataIndex: 'OperateType',
      align: 'center',
      width: 120,
      render: (_: number,record: Cascade.DownSubscribesListItem) => (
        <Tag>{record.Ext?.OperateType == 0 ? '订阅中' : '订阅已取消'}</Tag>
      ),
    },
    {
      title: '间隔时间(秒)',
      dataIndex: 'Ext.ReportInterval',
      align: 'center',
      width: 120,
      render: (_: string, record: Cascade.DownSubscribesListItem) => (
        <span>{record.Ext?.ReportInterval ?? ''}</span>
      ),
    },
    {
      title: '时间',
      align: 'center',
      width: 240,
      render: (_: string, record: Cascade.DownSubscribesListItem) => (
        <span>
          <div>开始时间: {timeToFormatTime(record.Ext?.BeginTime ?? '')}</div>
          <div>结束时间: {timeToFormatTime(record.Ext?.EndTime ?? '')}</div>
        </span>
      ),
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 130,
      render: (_: string, record: Cascade.DownSubscribesListItem) => (
        <Space>
          <Tooltip title="编辑">
            <Button
              onClick={() => {
                subscribeRef.current?.setFieldsValue(record.Ext, true);
              }}
              icon={<FormOutlined />}
            />
          </Tooltip>
          <Tooltip title="通知记录">
            <Button
              onClick={() => {
                history.push(
                  `/downward/cascade/subscribes/notification?notification_id=${record.id}`,
                );
              }}
              icon={<BellOutlined />}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title={
                <p>
                  确定删除
                  <span className="text-red-500">
                    {record.id}
                  </span>
                  吗?
                </p>
              }
              onConfirm={() => {
                deleteCascadeMutate(record.id);
              }}
            >
              <Button
                loading={loadings.includes(record.id)}
                type="dashed"
                danger
                disabled={isOnline == 'false'}
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const funcBtnList: ButtonList[] = [
    {
      label: '返回',
      icon: <ArrowLeftOutlined />,
      onClick: () => {
        history.back();
      }
    },
    //顶部按钮列表
    {
      label: '添加',
      loading: false,
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: () => {
        subscribeRef.current?.setFieldsValue({
          ResourceURI: deviceID,
          ReceiveAddr: `http://${infoData?.host}:${infoData?.port}/VIID/SubscribeNotifications`,
        });
      },
    },
  ];

  const { data: infoData, isLoading: infoLoading } =
    useQuery<System.SystemInfo>(
      [findSystemInfo],
      () => FindSystemInfo().then((res: AxiosResponse) => res.data),
      {
        onError: ErrorHandle,
      },
    );

  //删除订阅
  const [loadings, setLoadings] = useState<string[]>([]);
  const { mutate: deleteCascadeMutate } = useMutation(DelDownwardSubscribes, {
    onMutate: (v: string) => {
      setLoadings([...loadings, v]);
    },
    onSuccess(res: AxiosResponse) {
      message.success('删除成功');
      setLoadings((v) => v.filter((item) => item !== res.data.id));
      refetch();
    },
    onError: (error: Error) => {
      setLoadings([]);
      ErrorHandle(error);
    },
  });

  //获取订阅类别字典列表
  const { data: dictTypeList } = useQuery<Dict.DataItem[]>(
    ['subscribeDetailType'],
    () =>
      FindDictDatas('SubscribeDetailType').then(
        (res: AxiosResponse) => res.data.items,
      ),
    {
      staleTime: CACHE_CLEAR_TIME,
      onError: ErrorHandle,
    },
  );

  const [pagination, setPagination] = useState<
    Cascade.ListReq & { id: string }
  >({
    size: 10,
    page: 1,
    id: deviceID,
  });

  const {
    data: subscribesData,
    isLoading: subscribesLoading,
    refetch,
  } = useQuery<Cascade.DownSubscribesListRes>(
    [findDownwardSubscribes, pagination],
    () =>
      FindDownwardSubscribes(pagination).then((res: AxiosResponse) => res.data),
    {
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
          loading={subscribesLoading}
          rowKey={'ApeID'}
          key={'system_app_table_key'}
          columns={columns}
          dataSource={subscribesData?.items}
          scroll={{ x: '100%' }}
          pagination={{
            total: subscribesData?.total,
            pageSize: pagination.size,
            current: pagination.page,
            onChange: (page: number, size: number) => {
              setPagination({ ...pagination, page, size });
            },
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Box>
      <SubscribeFrom dictTypeList={dictTypeList || []} ref={subscribeRef} />
    </PageContainer>
  );
};

export default SubScribes;
