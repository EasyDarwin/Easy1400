import FunctionBar, { ButtonList } from '@/components/bar/FunctionBar';
import Box from '@/components/box/Box';
import CopyBtn from '@/components/copy/CopyBtn';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useMutation, useQuery } from '@umijs/max';
import { Button, Popconfirm, Space, Table, Tag, Tooltip, message } from 'antd';
import DeviceFrom from './components/DeviceFrom';

import { shortenString } from '@/package/string/string';
import {
  DeleteDevice,
  GetDeviceList,
  getDeviceList,
} from '@/services/http/device';
import { ErrorHandle } from '@/services/http/http';
import { ColumnsType } from 'antd/es/table';
import React, { useRef, useState } from 'react';

interface IDeviceFrom {
  setFieldsValue: () => void;
}

const View: React.FC = () => {
  const deviceFromRef = useRef<IDeviceFrom>();

  const columns: ColumnsType<Device.Item> = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip title={text}>{shortenString(text)}</Tooltip>
      ),
    },
    {
      title: '秘钥',
      dataIndex: 'password',
      align: 'center',
      render: (text: string) => <CopyBtn value={text} />,
    },
    {
      title: '是否在线',
      dataIndex: 'is_online',
      align: 'center',
      render: (text: string) => (
        <Tag color={text ? 'green' : 'red'}>{text ? '在线' : '离线'}</Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'register_at',
      align: 'center',
      render: (text: string) => (
        <span className="text-gray-400">{text ? text : '-'}</span>
      ),
    },
    {
      title: '心跳时间',
      dataIndex: 'heartbeat_at',
      align: 'center',
      render: (text: string) => <span>{text ? text : '-'}</span>,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 150,
      render: (text: string, record: any) => {
        return (
          <Space>
            <Tooltip title="图片列表">
              <Button icon={<UnorderedListOutlined />} />
            </Tooltip>
            <Tooltip title="编辑设备">
              <Button icon={<EditOutlined />} />
            </Tooltip>
            <Tooltip title="删除设备">
              <Popconfirm
                title={
                  <p>
                    确定删除
                    <span className="text-red-500"> {record.id} </span>
                    设备吗?
                  </p>
                }
                okButtonProps={{
                  loading: loadings.includes(record.id),
                }}
                onConfirm={() => {
                  deleteDeviceMutate(record.id);
                }}
              >
                <Button
                  type="dashed"
                  loading={loadings.includes(record.id)}
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
  const [loadings, setLoadings] = useState<string[]>([]);

  const { mutate: deleteDeviceMutate } = useMutation(DeleteDevice, {
    onMutate: (v: string) => {
      setLoadings([...loadings, v]);
    },
    onSuccess: (data: any) => {
      message.success('删除成功');
      setLoadings((v) => v.filter((item) => item !== data.data.id));
      refetch();
    },
    onError: (error: Error) => {
      setLoadings([]);
      ErrorHandle(error);
    },
  });

  const [pagination, setPagination] = useState<Device.ListReq>({
    page: 1,
    size: 10,
    device_id: '',
  });

  const {
    data: deviceData,
    isLoading: deviceListLoading,
    refetch,
  } = useQuery<Device.ListRes>([getDeviceList], () =>
    GetDeviceList(pagination).then((res) => res.data as Device.ListRes),
  );

  //点击添加按钮
  const onAddBtnClick = () => {
    deviceFromRef.current?.setFieldsValue();
  };

  const funcBtnList: ButtonList[] = [
    //顶部按钮列表
    {
      label: '添加',
      loading: false,
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: onAddBtnClick,
    },
  ];

  return (
    <PageContainer title={process.env.PAGE_TITLE}>
      <FunctionBar btnChannle={funcBtnList} />
      <Box>
        <Table
          loading={deviceListLoading}
          rowKey={'id'}
          key={'system_app_table_key'}
          bordered
          columns={columns}
          dataSource={deviceData?.items}
          pagination={{
            total: deviceData?.total,
            pageSize: pagination.size,
            current: pagination.page,
            onChange: (page, size) => {
              setPagination({ ...pagination, page, size });
            },
          }}
        />
      </Box>
      <DeviceFrom ref={deviceFromRef} />
    </PageContainer>
  );
};

export default View;
