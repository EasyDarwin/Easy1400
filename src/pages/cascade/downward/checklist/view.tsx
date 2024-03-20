import { ErrorHandle } from '@/services/http/http';
import { TagsOutlined, ArrowLeftOutlined, SyncOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useQuery, useMutation } from '@umijs/max';
import { Button, Space, Table, Tag, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useRef, useState } from 'react';
import FunctionBar, { ButtonList } from '@/components/bar/FunctionBar';
import Box from '@/components/box/Box';
import CopyBtn from '@/components/copy/CopyBtn';
import { FindDownwardDeviceCheck, FindDownwardDeviceSyncCheck } from '@/services/http/cascade';
import { useParams } from '@umijs/max';
import Search from 'antd/es/input/Search';
import Info, { IInfoModalRef } from './components/DetailInfo';

const View: React.FC = () => {
  const deviceID = useParams().device_id ?? '';
  const infoRef = useRef<IInfoModalRef>();
  const columns: ColumnsType<Device.APEObject> = [
    {
      title: 'ID',
      dataIndex: 'ApeID',
      align: 'center',
      width: 200,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: '名称',
      dataIndex: 'Name',
      align: 'center',
      width: 150,
    },

    {
      title: '用户账号',
      dataIndex: 'UserId',
      align: 'center',
      width: 110,
      render: (text: string, record: Device.APEObject) => (
        <CopyBtn value={text} title="账号" disabled={record.IsOnline === '1'} />
      ),
    },
    {
      title: '口令',
      dataIndex: 'Password',
      align: 'center',
      width: 110,
      render: (text: string, record: Device.APEObject) => (
        <CopyBtn value={text} title="口令" disabled={record.IsOnline === '1'} />
      ),
    },

    {
      title: '状态',
      dataIndex: 'IsOnline',
      align: 'center',
      width: 110,
      render: (text: string, record: Device.APEObject) => (
        <Tag color={record.IsOnline === '1' ? 'green' : 'red'}>
          {record.IsOnline === '1' ? '在线' : '离线'}
        </Tag>
      ),
    },
    {
      title: '心跳时间/注册时间',
      dataIndex: 'HeartbeatAt',
      align: 'center',
      width: 180,
      render: (text: string, record: Device.APEObject) => (
        <>
          <div>
            <Tooltip title={'心跳时间'} placement="left">
              {record.HeartbeatAt ? record.HeartbeatAt : '-'}
            </Tooltip>
          </div>
          <div>
            <Tooltip
              className="text-gray-400"
              title={'注册时间'}
              placement="left"
            >
              {record.RegisteredAt}
            </Tooltip>
          </div>
        </>
      ),
    },
    {
      title: '今天数量',
      dataIndex: 'CurrentCount',
      align: 'center',
      width: 110,
      render: (text: string, record: Device.APEObject) => (
        <span
          className={
            record.CurrentCount >= record.MaxCount && record.MaxCount > 0
              ? 'text-red-500'
              : ''
          }
        >
          {text || '-'}
        </span>
      ),
    },
    {
      title: '每天限制总数',
      dataIndex: 'MaxCount',
      align: 'center',
      width: 120,
      render: (text: string) => (
        <span className={text == '0' ? 'text-red-500' : ''}>
          {text == '-1' ? '-' : text}
        </span>
      ),
    },
    {
      title: 'IP',
      dataIndex: 'IPAddr',
      align: 'center',
      width: 150,
      render: (text: string) => <span>{text ? text : '-'}</span>,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (text: string, record: Device.APEObject) => {
        return (
          <Space>
            <Tooltip title="详情信息">
              <Button
                icon={<TagsOutlined />}
                onClick={() => {
                  infoRef.current?.OpenModal(record);
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const [pagination, setPagination] = useState<Cascade.DownwardDeviceCheckReq>({
    value: '',
    PageRecordNum: 30,
    RecordStartNo: 1,
    id: deviceID,
  });

  const { data: deviceData, isLoading: deviceListLoading } = useQuery(
    ['FindDownwardDeviceCheck', pagination],
    () => FindDownwardDeviceCheck(pagination).then((res) => res.data),
    {
      onError: ErrorHandle,
    },
  );

  const { mutate: syncMutate, isLoading: syncLoading } =
    useMutation(FindDownwardDeviceSyncCheck, {
      onSuccess: (res: any) => {
        message.success(res.msg)
      },
      onError: (error: Error) => {
        ErrorHandle(error);
      },
    });

  const barBtnList: ButtonList[] = [
    {
      label: '返回',
      icon: <ArrowLeftOutlined />,
      onClick: () => {
        history.back();
      }
    },
    {
      label: '检索',
      icon: <SyncOutlined />,
      loading: syncLoading,
      type: 'primary',
      onClick: () => {
        syncMutate(deviceID)
      },
    },
  ]

  const funcSearchComponet = (
    <div className="flex justify-between">
      <Search
        className="w-96"
        enterButton
        placeholder="请输入 ID"
        onSearch={(value: string) => {
          setPagination({ ...pagination, value: value });
        }}
      />
    </div>
  );

  return (
    <PageContainer title={process.env.PAGE_TITLE}>
      <Box className="flex justify-between items-center mt-2">
        <FunctionBar
          btnChannle={barBtnList}
          span={[4, 20]}
          rigthChannle={funcSearchComponet}
          rigthChannleClass="flex justify-end"
        />
      </Box>
      <Box>
        <Table
          loading={deviceListLoading}
          key={'system_app_table_key1'}
          rowKey={'ApeID'}
          scroll={{ x: '100%' }}
          columns={columns}
          dataSource={deviceData?.APEListObject.APEObject}
          pagination={{
            total: deviceData?.APEListObject.TotalNum,
            pageSize: pagination.PageRecordNum,
            current: pagination.RecordStartNo,
            onChange: (RecordStartNo, PageRecordNum) => {
              setPagination({
                ...pagination,
                RecordStartNo,
                PageRecordNum,
              });
            },
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }}
        />
      </Box>
      <Info ref={infoRef} />
    </PageContainer>
  );
};

export default View;
