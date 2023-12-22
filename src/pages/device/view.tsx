import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { history, useMutation, useQuery } from '@umijs/max';
import { Button, Popconfirm, Space, Table, Tag, Tooltip, message } from 'antd';
import React, { useRef, useState } from 'react';

import { shortenString } from '@/package/string/string';
import {
  DelDevice,
  FindDeviceLists,
  getDeviceList,
} from '@/services/http/device';
import { ErrorHandle } from '@/services/http/http';
import { ColumnsType } from 'antd/es/table';
import { AxiosResponse } from 'axios';

import FunctionBar, {
  ButtonList,
  SearchComponent,
} from '@/components/bar/FunctionBar';
import Box from '@/components/box/Box';
import CopyBtn from '@/components/copy/CopyBtn';
import { POLLING_TIME } from '@/constants/index';
import DeviceFrom from './components/DeviceFrom';
import QuantityFrom, { IQuantityFromProps } from './components/QuantityFrom';

interface IDeviceFrom {
  setFieldsValue: (data?: Device.APEObject, isEdit?: boolean) => void;
}

const View: React.FC = () => {
  const deviceFromRef = useRef<IDeviceFrom>();
  const quantityFrom = useRef<IQuantityFromProps>();
  const columns: ColumnsType<Device.APEObject> = [
    {
      title: 'ID',
      dataIndex: 'ApeID',
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
              {record.RegisteredAt ? record.RegisteredAt : '-'}
            </Tooltip>
          </div>
        </>
      ),
    },
    {
      title: 'IP',
      dataIndex: 'IPAddr',
      align: 'center',
      width: 150,
      render: (text: string, record: Device.APEObject) => <span>{text}</span>,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 150,
      render: (text: string, record: Device.APEObject) => {
        return (
          <Space>
            <Tooltip title="图片列表">
              <Button
                icon={<UnorderedListOutlined />}
                onClick={() => {
                  history.push(`/gallery?device_id=${record.ApeID}`);
                }}
              />
            </Tooltip>
            <Tooltip title="编辑设备">
              <Button
                onClick={() =>
                  deviceFromRef.current?.setFieldsValue(record, true)
                }
                icon={<EditOutlined />}
                // loading={
                //   record.ApeID == currentDeviceId && getDeviceInfoLoading
                // }
              />
            </Tooltip>
            <Tooltip title="最大采集数量">
              <Button
                icon={<FilterOutlined />}
                onClick={() => {
                  quantityFrom.current?.setFieldsValue(record.ApeID)
                }}
              />
            </Tooltip>
            <Tooltip title="删除设备">
              <Popconfirm
                title={
                  <p>
                    确定删除
                    <span className="text-red-500"> {record.ApeID} </span>
                    设备吗?
                  </p>
                }
                okButtonProps={{
                  loading: loadings.includes(record.ApeID),
                }}
                onConfirm={() => {
                  deleteDeviceMutate(record.ApeID);
                }}
              >
                <Button
                  type="dashed"
                  loading={loadings.includes(record.ApeID)}
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

  const { mutate: deleteDeviceMutate } = useMutation(DelDevice, {
    onMutate: (v: string) => {
      setLoadings([...loadings, v]);
    },
    onSuccess: (data: AxiosResponse) => {
      message.success('删除成功');
      setLoadings((v) => v.filter((item) => item !== data.data.id));
      refetch();
    },
    onError: (error: Error) => {
      setLoadings([]);
      ErrorHandle(error);
    },
  });

  const [pagination, setPagination] = useState<Device.Pager>({
    ApeID: '',
    PageRecordNum: 10,
    RecordStartNo: 1,
  });

  const {
    data: deviceData,
    isLoading: deviceListLoading,
    refetch,
  } = useQuery<Device.FindReq>(
    [getDeviceList, pagination],
    () => FindDeviceLists({ ...pagination }).then((res) => res.data),
    {
      onError: ErrorHandle,
      refetchInterval: POLLING_TIME,
    },
  );

  //点击添加按钮
  const onAddBtnClick = () => {
    deviceFromRef.current?.setFieldsValue();
  };

  const funcBtnList: ButtonList[] = [
    {
      label: '添加',
      loading: false,
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: onAddBtnClick,
    },
  ];

  const funcSearchComponet: SearchComponent = {
    placeholder: '请输入设备 ID',
    onSearch: (value: string) => {
      setPagination({ ...pagination, ApeID: value });
    },
  };
  return (
    <PageContainer title={process.env.PAGE_TITLE}>
      <Box>
        <FunctionBar
          searchChannle={funcSearchComponet}
          btnChannle={funcBtnList}
        />
      </Box>
      <Box>
        <Table
          loading={deviceListLoading}
          rowKey={'ApeID'}
          key={'system_app_table_key'}
          // bordered

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
            pageSizeOptions: [10, 50, 100],
          }}
        />
      </Box>
      <DeviceFrom ref={deviceFromRef} />
      <QuantityFrom ref={quantityFrom} />
    </PageContainer>
  );
};

export default View;
