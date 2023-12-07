import React, { useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';

import FunctionBar, { ButtonList } from '@/components/bar/FunctionBar';
import Box from '@/components/box/Box';
import { ColumnsType } from 'antd/es/table';
const Dispositions: React.FC = () => {
  const columns: ColumnsType = [
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
  ];
  
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

  const [pagination, setPagination] = useState<Cascade.DispositionsListReq>({
    MaxNumRecordReturn: '0',
    PageRecordNum: 10,
    RecordStartNo: 1,
  });

  //   const {
  //     data: dispositionData,
  //     isLoading: dispositionLoading,
  //     refetch,
  //   } = useQuery(
  //     [findSubscribes],
  //     () => FindSubscribes(pagination).then((res) => { console.log(res);
  //      }),
  //     {
  //       refetchInterval: 10000,
  //       onError: (error: Error) => ErrorHandle(error),
  //     },
  //   );

  return (
    <PageContainer title={process.env.PAGE_TITLE}>
      <FunctionBar btnChannle={funcBtnList} />
      <Box>
        {/* <Table
          loading={dispositionLoading}
          rowKey={'ApeID'}
          key={'system_app_table_key'}
          columns={columns}
          dataSource={cascadeData?.items}
          pagination={{
            total: cascadeData?.total,
            pageSize: pagination.limit,
            current: pagination.page,
            onChange: (page: number, limit: number) => {
              setPagination({ ...pagination, page, limit });
            },
            showTotal: (total) => `共 ${total} 条`,
          }}
        /> */}
      </Box>
    </PageContainer>
  );
};

export default Dispositions;
