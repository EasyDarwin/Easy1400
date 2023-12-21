import { useQuery } from '@umijs/max';
import React, { useState } from 'react';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Tag, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import FunctionBar, { ButtonList } from '@/components/bar/FunctionBar';
import Box from '@/components/box/Box';
import { CACHE_CLEAR_TIME } from '@/constants';
import { shortenString } from '@/package/string/string';
import { FindSubscribes, findSubscribes } from '@/services/http/cascade';
import { FindDictDatas } from '@/services/http/dict';
import { ErrorHandle } from '@/services/http/http';
import { useSearchParams } from '@umijs/max';
import { AxiosResponse } from 'axios';

const Dispositions: React.FC = () => {
  const [searchParams, _] = useSearchParams();
  const deviceID = searchParams.get('device_id') ?? '';

  const columns: ColumnsType<Cascade.SubscribeObject> = [
    {
      title: '订阅标识符',
      dataIndex: 'SubscribeID',
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
      title: '订阅标题',
      dataIndex: 'Title',
      align: 'center',
    },
    {
      title: '订阅类别',
      dataIndex: 'SubscribeDetail',
      align: 'center',
      render: (text: string, record: Cascade.SubscribeObject) => {
       return record.SubscribeDetail?.split(',').map(item => <Tag className='my-1' color="processing" key={item}>{findSubscribeDetailLable(item)}</Tag>)
      },
    },
    {
      title: '间隔时间(秒)',
      dataIndex: 'ReportInterval',
      align: 'center',
    },

    {
      title: '时间',
      align: 'center',
      render: (text: string, record: Cascade.SubscribeObject) => (
        <span>
          <div>开始时间:{record.BeginTime}</div>
          <div>结束时间:{record.EndTime}</div>
        </span>
      ),
    },

    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 130,
      render: (text: string, record: Cascade.SubscribeObject) => (
        <Space>
          <Tooltip title="删除">
            <Popconfirm
              title={
                <p>
                  确定删除
                  <span className="text-red-500"> {record.SubscribeID} </span>
                  级联吗?
                </p>
              }
              okButtonProps={{
                loading: loadings.includes(record.SubscribeID),
              }}
              onConfirm={() => {}}
            >
              <Button
                loading={loadings.includes(record.SubscribeID)}
                type="dashed"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const [loadings, setLoadings] = useState<string[]>([]);

  const funcBtnList: ButtonList[] = [
    //顶部按钮列表
    {
      label: '添加',
      loading: false,
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: () => {},
    },
  ];

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

  const findSubscribeDetailLable = (value:string) => {
    
    let matchingObjects = hdirectionTypeList?.find((item:Dict.DataItem) => item.value == value);
    console.log(matchingObjects);
    
    return matchingObjects?.label
  }


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
        <FunctionBar btnChannle={funcBtnList} />
      </Box>
      <Box>
        <Table
          loading={subscribesLoading}
          rowKey={'ApeID'}
          key={'system_app_table_key'}
          columns={columns}
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

export default Dispositions;
