import { Table, Modal, Tooltip, Tag, Typography } from "antd";
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/es/table';
import React, {
  forwardRef,
  useState,
  useImperativeHandle,
} from "react";
import { FindDeviceLists } from '@/services/http/device';

export interface IDeviceModalRef {
  openModal: (data?: any) => void;
}

interface DeviceModalProps {
  ref: any;
  onBind: (ids?: any) => void;
}

const DeviceModal: React.FC<DeviceModalProps> = forwardRef(({ onBind }, ref) => {
  useImperativeHandle(ref, () => ({
    openModal(ids?: any) {
      setVisible(true);
      setCheckList(ids)
      getData()
    }
  }));

  const title = '设备绑定'
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkList, setCheckList] = useState<React.Key[]>([]);
  const [deviceData, setDeviceData] = useState<any>({})
  const [params, setParams] = useState<Device.Pager>({
    value: '',
    PageRecordNum: 10,
    RecordStartNo: 1,
  });

  const columns: ColumnsType<Device.APEObject> = [
    { title: '名称', dataIndex: 'Name', align: 'center', width: 180, fixed: true, ellipsis: true, },
    { title: 'ID', dataIndex: 'ApeID', align: 'center', width: 180, ellipsis: true },
    { title: '用户账号', dataIndex: 'UserId', align: 'center', width: 120, ellipsis: true },
    { title: '口令', dataIndex: 'Password', align: 'center', width: 120, ellipsis: true },
    {
      title: '状态',
      dataIndex: 'IsOnline',
      align: 'center',
      width: 100,
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
              {text || ''}
            </Tooltip>
          </div>
          <div>
            <Tooltip
              className="text-gray-400"
              title={'注册时间'}
              placement="left"
            >
              {record.RegisteredAt || ''}
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
      ellipsis: true,
      render: (text: any, record: Device.APEObject) => (
        <span
          className={
            record.MaxCount && text >= record.MaxCount
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
      ellipsis: true,
      render: (text: string) => <span className={text == '0' ? 'text-red-500' : ''}>{text == '-1' ? '-' : text}</span>,
    },
    {
      title: 'IP',
      dataIndex: 'IPAddr',
      align: 'center',
      ellipsis: true,
      width: 150,
      render: (text: string) => text || '-'
    }
  ];

  const getData = (v?: any) => {
    const obj = { ...params, ...v }
    setParams(obj)
    setLoading(true)
    FindDeviceLists(obj).then((res) => {
      setDeviceData(res?.data?.APEListObject || [])
    }).finally(() => {
      setLoading(false)
    })
  }

  const onCancel = () => {
    setVisible(false)
    setCheckList([])
  }

  const onOk = () => {
    onBind?.(checkList)
    onCancel()
  }

  return (
    <Modal
      width="80%"
      title={title}
      destroyOnClose
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      okButtonProps={{
        disabled: !checkList?.length
      }}
    >
      <div className="flex justify-between items-center mb-[10px]">
        <Typography.Text type="secondary">
          已勾选 {checkList?.length || 0} 项
        </Typography.Text>
        <Search
          className="w-96"
          enterButton
          placeholder="请输入id 或 名称"
          onSearch={(v: string) => {
            getData({ ...params, value: v })
          }}
        />
      </div>
      <Table
        loading={loading}
        rowKey={'ApeID'}
        key={'system_app_table_key'}
        scroll={{ x: '100%', y: 800 }}
        columns={columns}
        dataSource={deviceData?.APEObject || []}
        pagination={{
          simple: true,
          total: deviceData?.TotalNum || 0,
          pageSize: params.PageRecordNum,
          current: params.RecordStartNo,
          onChange: (num: number, size: number) => {
            getData({ ...params, RecordStartNo: params.PageRecordNum !== size ? 1 : num, PageRecordNum: size });
          },
          showTotal: (total: number) => `共 ${total} 条`,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        rowSelection={{
          type: 'checkbox',
          fixed: true,
          selectedRowKeys: checkList,
          onChange: (selectedRowKeys: React.Key[]) => {
            setCheckList(selectedRowKeys);
          }
        }}
      />
    </Modal>
  )
})


export default DeviceModal;
