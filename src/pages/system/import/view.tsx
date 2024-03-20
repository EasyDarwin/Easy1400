import { useQuery, useQueryClient } from '@umijs/max';
import React, { useRef, useState } from 'react';

import Box from '@/components/box/Box';
import { FindImportHistory, findImportHistory } from '@/services/http/device';
import { ErrorHandle } from '@/services/http/http';
import { TagsOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AxiosResponse } from 'axios';
import InfoModal, { IInfoModalRef } from './components/InfoModal';
const View: React.FC = () => {
  const InfoModalRef = useRef<IInfoModalRef>();

  const columns: ColumnsType<Device.ImportHistoryItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width: 180,
    },
    {
      title: '成功',
      align: 'center',
      render: (_, record: Device.ImportHistoryItem) => (
        <span className="text-green-500">{record.overview.success}</span>
      ),
    },
    {
      title: '失败',
      align: 'center',
      render: (_, record: Device.ImportHistoryItem) => (
        <span className="text-red-500">{record.overview.failure}</span>
      ),
    },
    {
      title: '总条数',
      align: 'center',
      render: (_, record: Device.ImportHistoryItem) => (
        <span>{record.overview.success + record.overview.failure}</span>
      ),
    },
    {
      title: '导入类型',
      align: 'center',
      dataIndex: 'type',
      render: (text: string) => (
        <span>{text == 'ape' ? '采集设备导入' : text}</span>
      ),
    },
    {
      title: '导入时间',
      align: 'center',
      dataIndex: 'created_at',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 180,
      render: (_, record: Device.ImportHistoryItem) => {
        return (
          <Space>
            <Tooltip title="导入详情">
              <Button icon={<TagsOutlined />} onClick={() => {
                InfoModalRef.current?.OpenModal(record.id)
              }} />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  // const queryClient = useQueryClient();
  const [historyQuery, setHistoryQuery] = useState<Device.FindImportHistoryReq>(
    {
      page: 1,
      size: 30,
      type: 'ape',
    },
  );

  //获取 上传 历史记录
  const { data, isLoading } = useQuery<Device.FindImportHistoryRes>(
    [findImportHistory, historyQuery],
    () =>
      FindImportHistory(historyQuery).then((res: AxiosResponse) => res.data),
    {
      onError: ErrorHandle,
    },
  );

  return (
    <Box>
      <Table
        loading={isLoading}
        rowKey={'ApeID'}
        key={'system_app_table_key'}
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data?.items}
        pagination={{
          total: data?.total,
          pageSize: historyQuery.size,
          current: historyQuery.page,
          onChange: (page, size) => {
            setHistoryQuery({
              ...historyQuery,
              page,
              size,
            });
          },
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
        }}
      />
      <InfoModal ref={InfoModalRef} />
    </Box>
  );
};

export default View;
