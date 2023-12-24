import { useQuery } from '@umijs/max';
import React, { useState } from 'react';

import { PageContainer } from '@ant-design/pro-components';
import { Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import Box from '@/components/box/Box';
import { CACHE_CLEAR_TIME } from '@/constants';
import { findDictLabel } from '@/package/array/array';
import { timeToFormatTime } from '@/package/time/time';
import { FindSubscribes, findSubscribes } from '@/services/http/cascade';
import { FindDictDatas } from '@/services/http/dict';
import { ErrorHandle } from '@/services/http/http';
import { useSearchParams } from '@umijs/max';
import { AxiosResponse } from 'axios';

const Subscribes: React.FC = () => {
  const [searchParams, _] = useSearchParams();
  const deviceID = searchParams.get('device_id') ?? '';

  const columns: ColumnsType<Cascade.SubscribeObject> = [
    {
      title: '订阅标识符',
      dataIndex: 'SubscribeID',
      align: 'center',
      width: 230,
    },
    {
      title: '订阅标题',
      dataIndex: 'Title',
      align: 'center',
      width: 150,
    },

    {
      title: '订阅类别',
      dataIndex: 'SubscribeDetail',
      align: 'center',
      render: (text: string, record: Cascade.SubscribeObject) => {
        return record.SubscribeDetail?.split(',').map((item) => (
          <Tag className="my-1" color="processing" key={item}>
            {findDictLabel(hdirectionTypeList ?? [], item)}
          </Tag>
        ));
      },
    },

    {
      title: '订阅状态',
      dataIndex: 'OperateType',
      align: 'center',
      width: 100,
      render: (text: number) => (
        <Tag>{text == 0 ? '订阅中' : '订阅已取消'}</Tag>
      ),
    },
    {
      title: '间隔时间(秒)',
      dataIndex: 'ReportInterval',
      align: 'center',
    },

    {
      title: '时间',
      align: 'center',
      width: 300,
      render: (text: string, record: Cascade.SubscribeObject) => (
        <span>
          <div>开始时间:{timeToFormatTime(record.BeginTime ?? '')}</div>
          <div>结束时间:{timeToFormatTime(record.EndTime ?? '')}</div>
        </span>
      ),
    },

    // {
    //   title: '操作',
    //   align: 'center',
    //   fixed: 'right',
    //   width: 130,
    //   render: (text: string, record: Cascade.SubscribeObject) => (
    //     <Space>
    //       <Tooltip title="删除">
    //         <Popconfirm
    //           title={
    //             <p>
    //               确定删除
    //               <span className="text-red-500"> {record.SubscribeID} </span>
    //               级联吗?
    //             </p>
    //           }
    //           okButtonProps={{
    //             loading: loadings.includes(record.SubscribeID),
    //           }}
    //           onConfirm={() => {}}
    //         >
    //           <Button
    //             loading={loadings.includes(record.SubscribeID)}
    //             type="dashed"
    //             danger
    //             icon={<DeleteOutlined />}
    //           />
    //         </Popconfirm>
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
  ];

  const [loadings, setLoadings] = useState<string[]>([]);

  //获取订阅类别字典列表
  const { data: hdirectionTypeList } = useQuery<Dict.DataItem[]>(
    ['hdirectionType'],
    () =>
      FindDictDatas('SubscribeDetailType').then(
        (res: AxiosResponse) => res.data.items,
      ),
    {
      staleTime: CACHE_CLEAR_TIME,
      onError: ErrorHandle,
    },
  );

  const [pagination, setPagination] = useState<Cascade.DispositionsListReq>({
    PageRecordNum: 10,
    RecordStartNo: 1,
    up_id: deviceID || '',
  });

  const { data: subscribesData, isLoading: subscribesLoading } =
    useQuery<Cascade.DispositionsListRes>(
      [findSubscribes, pagination],
      () => FindSubscribes(pagination).then((res: AxiosResponse) => res.data),
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
          rowKey={'ApeID'}
          key={'system_app_table_key'}
          columns={columns}
          scroll={{ x: 1100 }}
          dataSource={subscribesData?.SubscribeObject}
          pagination={{
            total: subscribesData?.TotalNum,
            pageSize: pagination.PageRecordNum,
            current: pagination.RecordStartNo,
            onChange: (RecordStartNo: number, PageRecordNum: number) => {
              setPagination({ ...pagination, RecordStartNo, PageRecordNum });
            },
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Box>
    </PageContainer>
  );
};

export default Subscribes;
