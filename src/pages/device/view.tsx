import {
  DelDevice,
  ExportDevice,
  FindDeviceLists,
  SetDeviceNoAuth,
  getDeviceList,
} from '@/services/http/device';
import { ErrorHandle } from '@/services/http/http';
import {
  AuditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { history, useMutation, useQuery } from '@umijs/max';
import {
  Button,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/es/table';
import { AxiosResponse } from 'axios';
import React, { useRef, useState } from 'react';

import FunctionBar, { ButtonList } from '@/components/bar/FunctionBar';
import Box from '@/components/box/Box';
import CopyBtn from '@/components/copy/CopyBtn';
import { POLLING_TIME } from '@/constants/index';
import { downloadByData } from '@/package/download/download';
import DeviceFrom from './components/DeviceFrom';
import ImportFrom, { IImportFromProps } from './components/ImportFrom';
import QuantityFrom, { IQuantityFromProps } from './components/QuantityFrom';

interface IDeviceFrom {
  setFieldsValue: (data?: Device.APEObject, isEdit?: boolean) => void;
}

const View: React.FC = () => {
  const deviceFromRef = useRef<IDeviceFrom>();
  const quantityFromRef = useRef<IQuantityFromProps>();
  const importFromRef = useRef<IImportFromProps>();

  const columns: ColumnsType<Device.APEObject> = [
    {
      title: 'ID',
      dataIndex: 'ApeID',
      align: 'center',
      width: 200,
      render: (text: string) => (
        // <Tooltip title={text}>{shortenString(text)}</Tooltip>
        <span>{text}</span>
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
      render: (text: string) => <span className={text == '0' ? 'text-red-500' : ''}>{text == '-1' ? '-' : text}</span>,
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
      width: 180,
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
                  quantityFromRef.current?.setFieldsValue({
                    id: record.ApeID,
                    max_count: record.MaxCount,
                  });
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

  const [authLoading, setAuthLoading] = useState('');

  //开启关闭 免检权
  const { mutate: noAuthMutate } = useMutation(SetDeviceNoAuth, {
    onSuccess: () => {
      setAuthLoading('');
      refetch();
      message.success('操作成功');
    },
    onError: (error: Error) => {
      setAuthLoading('');
      ErrorHandle(error);
    },
  });

  const [loadings, setLoadings] = useState<string[]>([]);

  const { mutate: deleteDeviceMutate } = useMutation(DelDevice, {
    onMutate: (v: string) => {
      setLoadings([...loadings, v]);
    },
    onSuccess: (data: AxiosResponse) => {
      message.success('删除成功');
      setLoadings((v) => v.filter((item) => item !== data.data.ID));
      refetch();
    },
    onError: (error: Error) => {
      setLoadings([]);
      ErrorHandle(error);
    },
  });

  const [pagination, setPagination] = useState<Device.Pager>({
    value: '',
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

  const { mutate: exprotExcelMutate, isLoading: exprotExcelLoading } =
    useMutation(ExportDevice, {
      onSuccess: (res: AxiosResponse) => {
        const fileName = res.headers['content-disposition'].split('=')[1];
        const fileType = res.headers['content-type'];
        downloadByData(res.data, fileName, fileType);
      },
      onError: (error: Error) => {
        ErrorHandle(error);
      },
    });

  const funcBtnList: ButtonList[] = [
    {
      label: '添加',
      loading: false,
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: onAddBtnClick,
    },
    {
      label: '导入',
      loading: false,
      type: 'primary',
      icon: <DownloadOutlined />,
      onClick: () => {
        importFromRef.current?.openModalvisible();
      },
    },
    {
      label: '导出',
      loading: exprotExcelLoading,
      type: 'primary',
      icon: <UploadOutlined />,
      onClick: () => {
        const data = checkList?.join() || '';
        exprotExcelMutate(data);
      },
    },
  ];

  const funcSearchComponet = (
    <Search
      className="w-96"
      enterButton
      placeholder="请输入id 或 名称"
      onSearch={(value: string) => {
        setPagination({ ...pagination, value: value });
      }}
    />
  );

  //多选
  const [checkList, setCheckList] = useState<React.Key[]>();
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setCheckList(selectedRowKeys);
    },
  };

  const btnPositionComponet = (
    <>
      {checkList && checkList?.length > 0 && (
        <Typography.Text type="secondary" className="ml-3">
          已勾选 {checkList?.length} 项
        </Typography.Text>
      )}
    </>
  );

  return (
    <PageContainer title={process.env.PAGE_TITLE}>
      <Box>
        <FunctionBar
          rigthChannle={funcSearchComponet}
          btnChannle={funcBtnList}
          btnPosition={btnPositionComponet}
          rigthChannleClass="flex justify-end"
        />
      </Box>
      <Box>
        <Table
          loading={deviceListLoading}
          rowKey={'ApeID'}
          key={'system_app_table_key'}
          scroll={{ x: 1300 }}
          columns={columns}
          dataSource={deviceData?.APEListObject.APEObject}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
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
      <QuantityFrom ref={quantityFromRef} />
      <ImportFrom ref={importFromRef} />
    </PageContainer>
  );
};

export default View;
