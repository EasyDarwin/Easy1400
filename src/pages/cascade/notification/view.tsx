import { useQuery } from '@umijs/max';
import React, { useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-components';
import { Button, Space, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import Box from '@/components/box/Box';
import { shortenString } from '@/package/string/string';
import { FindNotifies, findNotifies } from '@/services/http/cascade';
import { ErrorHandle } from '@/services/http/http';
import { TagsOutlined } from '@ant-design/icons';
import { useSearchParams } from '@umijs/max';
import { AxiosResponse } from 'axios';
import InfoModal, { InfoModalRef } from './components/InfoModal';

const Dispositions: React.FC = () => {
  const [searchParams, _] = useSearchParams();
  const deviceID = searchParams.get('device_id') ?? '';

  const columns: ColumnsType<Cascade.NotifyItem> = [
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
      title: '订阅ID',
      dataIndex: 'subscribe_id',
      align: 'center',
    },
    {
      title: '尝试次数',
      dataIndex: 'try_count',
      align: 'center',
      width: '90px',
    },
    {
      title: '通知结果',
      dataIndex: 'result',
      align: 'center',
    },
    {
      title: '通知时间',
      dataIndex: 'trigger_time',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (text: string, record: Cascade.NotifyItem) => {
        return (
          <Space>
            <Button onClick={()=>infoModalRef.current?.openModal(record.ext,record.info_ids)} icon={<TagsOutlined />} />
          </Space>
        );
      },
    },
  ];

  const [loadings, setLoadings] = useState<string[]>([]);
  const infoModalRef = useRef<InfoModalRef>();

  const [pagination, setPagination] = useState<Cascade.DispositionsListReq>({
    PageRecordNum: 10,
    RecordStartNo: 1,
    up_id: deviceID || '',
  });

  const { data: subscribesData, isLoading: subscribesLoading } =
    useQuery<Cascade.NotifyListRes>(
      [findNotifies, pagination],
      () => FindNotifies(pagination).then((res: AxiosResponse) => res.data),
      {
        refetchInterval: 10000,
        onError: ErrorHandle,
      },
    );

  return (
    <PageContainer title={process.env.PAGE_TITLE}>
      <Box>
        <Table
          loading={subscribesLoading}
          rowKey={'id'}
          key={'system_app_table_key'}
          columns={columns}
          dataSource={subscribesData?.items}
          pagination={{
            total: subscribesData?.total,
            pageSize: pagination.PageRecordNum,
            current: pagination.RecordStartNo,
            onChange: (RecordStartNo: number, PageRecordNum: number) => {
              setPagination({ ...pagination, RecordStartNo, PageRecordNum });
            },
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Box>
      <InfoModal ref={infoModalRef} />
    </PageContainer>
  );
};

export default Dispositions;
