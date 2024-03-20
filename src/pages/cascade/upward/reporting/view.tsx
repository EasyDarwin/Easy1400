import { useQuery } from '@umijs/max';
import React, { useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-components';
import { Button, Space, Tooltip, Form, Input, Select, DatePicker, Row, Col } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import Search from 'antd/es/input/Search';
import Box from '@/components/box/Box';
import { FindNotifies, findNotifies } from '@/services/http/cascade';
import FunctionBar, { ButtonList } from '@/components/bar/FunctionBar';
import { ErrorHandle } from '@/services/http/http';
import { TagsOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useSearchParams } from '@umijs/max';
import { AxiosResponse } from 'axios';
import InfoModal, { IInfoModalRef } from '@/pages/gallery/components/InfoModal';
// import InfoModal, { InfoModalRef } from '../notification/components/InfoModal';
import { timeToFormatTime } from '@/package/time/time';

const { RangePicker } = DatePicker;

const Notification: React.FC = () => {
  const [searchParams, _] = useSearchParams();
  const upID = searchParams.get('up_id') ?? '';
  const [form] = Form.useForm<Cascade.NotificationListReq>();
  const [loadings, setLoadings] = useState<string[]>([]);
  const [infoTypes] = useState<any[]>([
    { value: 'FaceObjectList', label: '人脸' },
    { value: 'PersonObjectList', label: '人员' },
    { value: 'MotorVehicleObjectList', label: '机动车' },
    { value: 'NonMotorVehicleObjectList', label: '非机动车' },
  ]);
  const infoTypeEnums = infoTypes.reduce((pre = {} , cur) => ({ ...pre, [cur.value]: cur.label }), {})
  const InfoModalRef = useRef<IInfoModalRef>();

  const columns: ColumnsType<Cascade.NotifyItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      fixed: true,
      width: 180,
    },
    {
      title: '设备ID',
      dataIndex: 'device_id',
      align: 'center',
      width: 200,
    },
    {
      title: '设备名称',
      dataIndex: 'device_name',
      align: 'center',
      width: 180,
    },
    {
      title: '图片类型',
      dataIndex: 'info_ids',
      align: 'center',
      width: 180,
      render: (text: string) => <span>{infoTypeEnums[text] || ''}</span>
    },
    {
      title: '订阅ID',
      dataIndex: 'subscribe_id',
      align: 'center',
      width: 180,
    },
    {
      title: '尝试次数',
      dataIndex: 'try_count',
      align: 'center',
      width: 140,
    },
    {
      title: '通知结果',
      dataIndex: 'result',
      align: 'center',
      width: 220,
      ellipsis: true,
      render: (text: string) => (
        <span className={text == 'OK' ? 'text-green-500' : ''}>{text}</span>
      ),
    },
    {
      title: '通知时间',
      dataIndex: 'trigger_time',
      align: 'center',
      width: 180,
      render: (text: string) => <span>{timeToFormatTime(text)}</span>,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (_: any, record: Cascade.NotifyItem) => {
        return (
          <Space>
            <Tooltip title="记录详情">
              <Button
                onClick={() =>
                  InfoModalRef.current?.init(record.info_ids.replace('ObjectList', ''), record)
                }
                icon={<TagsOutlined />}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const [params, setParams] = useState<Cascade.NotificationListReq>({
    PageRecordNum: 10,
    RecordStartNo: 1,
    up_id: upID || '',
    // device_id: '',
    // device_name: '',
    info_ids: '',
    value: '',
    timeRange: [],
    start_at: '',
    end_at: ''
  });

  const { data: notificationData, isLoading: notificationLoading } =
    useQuery<Cascade.NotifyListRes>(
      [findNotifies, params],
      () => {
        const { timeRange, ...others } = params
        return FindNotifies({
          ...others, ...timeRange?.length ? {
            start_at: timeRange[0].unix(),
            end_at: timeRange[1].unix(),
          } : {}
        }).then((res: AxiosResponse) => res.data)
      },
      {
        refetchInterval: 10000,
        onError: ErrorHandle,
      },
    );

  const barBtnList: ButtonList[] = [
    {
      label: '返回',
      icon: <ArrowLeftOutlined />,
      onClick: () => {
        history.back();
      }
    }
  ]

  const funcSearchComponet = (
    <div className="flex justify-between">
      <RangePicker
        showTime
        allowClear
        className="mr-2"
        format="YYYY-MM-DD HH:mm:ss"
        onChange={(value: any) => {
          setParams({ ...params, timeRange: value });
        }}
      />
      <Select 
        placeholder="请选择图片类型" 
        allowClear 
        className="mr-2 w-60"
        options={infoTypes}
        onChange={(value: string) => {
          setParams({ ...params, info_ids: value });
        }}
      />
      <Search
        enterButton
        className="w-80"
        placeholder="请输入设备ID或名称"
        onSearch={(value: string) => {
          setParams({ ...params, value: value });
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
          loading={notificationLoading}
          rowKey={'id'}
          scroll={{ x: '100%' }}
          key={'system_app_table_key'}
          columns={columns}
          dataSource={notificationData?.items}
          pagination={{
            total: notificationData?.total,
            pageSize: params.PageRecordNum,
            current: params.RecordStartNo,
            onChange: (RecordStartNo: number, PageRecordNum: number) => {
              setParams({ 
                ...params, 
                RecordStartNo: PageRecordNum !== params.PageRecordNum ? 1 : RecordStartNo, 
                PageRecordNum
              })
            },
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Box>
      <InfoModal ref={InfoModalRef} />
    </PageContainer>
  );
};

export default Notification;