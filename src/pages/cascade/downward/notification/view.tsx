import { useQuery } from '@umijs/max';
import React, { useRef, useState } from 'react';

import { Button, Popconfirm, Space, Tooltip, message } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import Box from '@/components/box/Box';
import {
  DelDownwardNotification,
  FindDownwardNotification,
  findDownwardNotification,
} from '@/services/http/cascade';
import { ErrorHandle } from '@/services/http/http';
import { DeleteOutlined, TagsOutlined } from '@ant-design/icons';
import { history, useMutation, useSearchParams } from '@umijs/max';
import { AxiosResponse } from 'axios';
import InfoModal, { InfoModalRef } from './components/InfoModal';

const Notification: React.FC = () => {
  const [searchParams, _] = useSearchParams();
  const notificationId = searchParams.get('notification_id') ?? '';
  const deviceID = searchParams.get('device_id') ?? '';

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: '订阅ID',
      dataIndex: 'SubscribeID',
      align: 'center',
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: '通知时间',
      dataIndex: 'created_at',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (_: string, record: Cascade.DownwardNotificationItem) => {
        return (
          <Space>
            <Tooltip title="通知详情">
              <Button
                onClick={() => {
                  infoModalRef.current?.openModal(record);
                }}
                icon={<TagsOutlined />}
              />
            </Tooltip>
            <Tooltip title="删除">
              <Popconfirm
                title={
                  <p>
                    确定删除
                    <span className="text-red-500"> {record.id} </span>
                    通知吗?
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
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const infoModalRef = useRef<InfoModalRef>();

  //删除通知记录
  const [loadings, setLoadings] = useState<string[]>([]);
  const { mutate: deleteCascadeMutate } = useMutation(DelDownwardNotification, {
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

  const [pagination, setPagination] = useState<Cascade.FindNotificationReq>({
    page: 1,
    size: 10,
    subscribe_id: notificationId || '',
  });

  const {
    data: subscribesData,
    isLoading: subscribesLoading,
    refetch,
  } = useQuery<Cascade.DownwardNotificationRes>(
    [findDownwardNotification, pagination],
    () =>
      FindDownwardNotification(pagination).then(
        (res: AxiosResponse) => res.data,
      ),
    {
      refetchInterval: 100000,
      onError: ErrorHandle,
    },
  );

  return (
    <div>
      <Box>
        <Button
          onClick={() => {
            history.back();
          }}
        >
          返回
        </Button>
      </Box>
      <Box>
        <Table
          loading={subscribesLoading}
          rowKey={'id'}
          key={'system_app_table_key'}
          columns={columns}
          dataSource={subscribesData?.items}
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
      <InfoModal ref={infoModalRef} />
    </div>
  );
};

export default Notification;
