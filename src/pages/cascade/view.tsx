import { history, useMutation, useQuery } from '@umijs/max';
import React, { useRef, useState } from 'react';

import {
  ApartmentOutlined,
  ApiOutlined,
  BellOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Table, Tag, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';

import FunctionBar, { ButtonList } from '@/components/bar/FunctionBar';
import Box from '@/components/box/Box';
import { shortenString } from '@/package/string/string';
import {
  DelCascade,
  FindCascadeLists,
  getCascades,
} from '@/services/http/cascade';
import { ErrorHandle } from '@/services/http/http';
import CascadeFrom, { ICascadeRef } from './components/CascadeFrom';
import DeviceFrom, { IDeviceRef } from './components/DeviceFrom';

const View: React.FC = () => {
  const columns: ColumnsType<Cascade.Item> = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      ellipsis: {
        showTitle: false,
      },
      width: 130,
      render: (text: string) => (
        <Tooltip title={text}>{shortenString(text)}</Tooltip>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
      width: 150,
      render: (text: string) => <span>{text ? text : '-'}</span>,
    },
    {
      title: '状态',
      dataIndex: 'is_online',
      align: 'center',
      width: 110,
      render: (text: string, record) => (
        <Tag color={text == '1' ? 'green' : 'red'}>
          {text == '1' ? '在线' : '离线'}
        </Tag>
      ),
    },
    {
      title: '状态描述',
      dataIndex: 'status',
      align: 'center',
      render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
    },

    {
      title: '地址',
      dataIndex: 'ip',
      align: 'center',
      render: (text: string, record: Cascade.Item) => {
        const str = `${record.ip}:${record.port}`;
        return <span>{str ? str : '-'}</span>;
      },
    },
    {
      title: '心跳时间/注册时间',
      dataIndex: 'created_at',
      align: 'center',
      width: 200,
      render: (text: string) => <span>{text ? text : '-'}</span>,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 180,
      render: (text: string, record: Cascade.Item) => {
        return (
          <Space>
            {/* <Tooltip title="上级的布控">
              <Button onClick={()=>{
                history.push(`/cascade/dispositions`)
              }} icon={<ClusterOutlined />} />
            </Tooltip> */}
            <Tooltip title="上级的订阅">
              <Button
                onClick={() => {
                  history.push(`/cascade/subscribes?device_id=${record.id}`);
                }}
                icon={<ApartmentOutlined />}
              />
            </Tooltip>
            <Tooltip title="通知记录">
              <Button
                onClick={() => {
                  history.push(`/cascade/notification?device_id=${record.id}`);
                }}
                icon={<BellOutlined />}
              />
            </Tooltip>
            <Tooltip title="选择共享设备">
              <Button
                onClick={() => {
                  deviceRef.current?.setFieldsValue({id:record.id,device_ids:record.device_ids || []});
                }}
                icon={<ApiOutlined />}
              />
            </Tooltip>
            <Tooltip title="删除">
              <Popconfirm
                title={
                  <p>
                    确定删除
                    <span className="text-red-500"> {record.id} </span>
                    级联吗?
                  </p>
                }
                okButtonProps={{
                  loading: loadings.includes(record.id),
                }}
                onConfirm={() => deleteCascadeMutate(record.id)}
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

  const funcBtnList: ButtonList[] = [
    //顶部按钮列表
    {
      label: '添加',
      loading: false,
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: () => {
        cascadeRef.current?.setFieldsValue();
      },
    },
  ];
  const cascadeRef = useRef<ICascadeRef>();
  const deviceRef = useRef<IDeviceRef>();

  const [loadings, setLoadings] = useState<string[]>([]);
  const { mutate: deleteCascadeMutate, isLoading: deleteCascadeLoading } =
    useMutation(DelCascade, {
      onMutate: (v: string) => {
        setLoadings([...loadings, v]);
      },
      onSuccess(data: any) {
        message.success('删除成功');
        setLoadings((v) => v.filter((item) => item !== data.data.id));
        refetch();
      },
      onError: (error: Error) => {
        setLoadings([]);
        ErrorHandle(error);
      },
    });

  const [pagination, setPagination] = useState<Cascade.ListReq>({
    page: 1,
    limit: 10,
  });

  const {
    data: cascadeData,
    isLoading: cascadeLoading,
    refetch,
  } = useQuery(
    [getCascades],
    () =>
      FindCascadeLists(pagination).then((res) => res.data as Cascade.ListRes),
    {
      refetchInterval: 10000,
      onError: (error: Error) => ErrorHandle(error),
    },
  );

  return (
    <PageContainer title={process.env.PAGE_TITLE}>
      <Box>
        <FunctionBar btnChannle={funcBtnList} />
      </Box>
      <Box>
        <Table
          loading={cascadeLoading}
          rowKey={'ApeID'}
          key={'system_app_table_key'}
          columns={columns}
          scroll={{x:1300}}
          dataSource={cascadeData?.items}
          pagination={{
            total: cascadeData?.total,
            pageSize: pagination.limit,
            current: pagination.page,
            onChange: (page: number, limit: number) => {
              setPagination({ ...pagination, page, limit });
            },
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Box>
      <CascadeFrom ref={cascadeRef} />
      <DeviceFrom ref={deviceRef} />
    </PageContainer>
  );
};

export default View;
