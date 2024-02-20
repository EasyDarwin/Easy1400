import { history, useMutation, useQuery } from '@umijs/max';
import React, { useRef, useState } from 'react';

import {
  ApartmentOutlined,
  BellOutlined,
  DeleteOutlined,
  FormOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Table, Tag, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';

import FunctionBar, { ButtonList } from '@/components/bar/FunctionBar';
import Box from '@/components/box/Box';
import { shortenString } from '@/package/string/string';
import {
  DelDownwardCascade,
  FindDownwardCascade,
  findDownwardCascade,
} from '@/services/http/cascade';
import { ErrorHandle } from '@/services/http/http';
import { AxiosResponse } from 'axios';
import DownCascadeFrom, { IDownCascadeRef } from './components/DownCascadeFrom';

const View: React.FC = () => {
  const columns: ColumnsType<Cascade.DownItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width:220
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
      width:200,
      render: (text: string) => <span>{text ? text : '-'}</span>,
    },
    {
      title: '状态',
      dataIndex: 'is_online',
      align: 'center',
      width: 110,
      render: (text: string) => (
        <Tag color={text ? 'green' : 'red'}>{text ? '在线' : '离线'}</Tag>
      ),
    },
    {
      title: 'IP地址',
      dataIndex: 'remote_ip',
      align: 'center',
      width: 200,
      render: (text: string) => (
        <span>{text != '' ? text : '-'}</span>
      ),
    },
    {
      title: '端口',
      dataIndex: 'remote_port',
      align: 'center',
      width: 100,
      render: (text: string) => <span>{text ? text : '-'}</span>,
    },
    {
      title: '心跳时间',
      dataIndex: 'heartbeat_at',
      align: 'center',
      width:200,
      render: (text: string) => <span>{text ? text : '-'}</span>,
    },
    {
      title: '注册时间',
      dataIndex: 'register_at',
      align: 'center',
      width:200,
      render: (text: string) => <span>{text ? text : '-'}</span>,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 180,
      render: (_: string, record: Cascade.DownItem) => {
        return (
          <Space>
            <Tooltip title="编辑">
              <Button
                onClick={() => {
                  let data: Cascade.DownReq = {
                    platform_id:record.id,
                    name:record.name ?? '',
                    user_name:record.user_name,
                    password:record.password,
                    realm:record.realm,
                    remote_port:record.remote_port,
                    description:record.description,
                  }
                  downCascadeRef.current?.setFieldsValue(data,true);
                }}
                icon={<FormOutlined />}
              />
            </Tooltip>
            <Tooltip title="订阅内容">
              <Button
                onClick={() => {
                  history.push(
                    `/downward/cascade/subscribes?device_id=${record.id}&is_online=${record.is_online}`,
                  );
                }}
                icon={<ApartmentOutlined />}
              />
            </Tooltip>
            {/* <Tooltip title="下级的布控">
              <Button
                onClick={() => {
                  history.push(
                    `/downward/cascade/dispositions?device_id=${record.id}`,
                  );
                }}
                icon={<AppstoreOutlined />}
              />
            </Tooltip> */}
            <Tooltip title="删除">
              <Popconfirm
                title={
                  <p>
                    确定删除
                    <span className="text-red-500"> {record.id} </span>
                    吗?
                  </p>
                }
                onConfirm={() => {
                  deleteCascadeMutate(record.id);
                }}
              >
                <Button
                  loading={loadings.includes(record.id)}
                  type="dashed"
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
  const downCascadeRef = useRef<IDownCascadeRef>();

  const funcBtnList: ButtonList[] = [
    //顶部按钮列表
    {
      label: '添加',
      loading: false,
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: () => {
        downCascadeRef.current?.setFieldsValue();
      },
    },
  ];

  //删除下级视图库
  const [loadings, setLoadings] = useState<string[]>([]);
  const { mutate: deleteCascadeMutate } = useMutation(DelDownwardCascade, {
    onMutate: (v: string) => {
      setLoadings([...loadings, v]);
    },
    onSuccess(res: AxiosResponse) {
      message.success('删除成功');
      setLoadings((v) => v.filter((item) => item !== res.data.id));
      refetch();
    },
    onError: (error: Error) => {
      setLoadings([]);
      ErrorHandle(error);
    },
  });

  const [pagination, setPagination] = useState<Cascade.ListReq>({
    page: 1,
    size: 10,
  });

  const {
    data: cascadeData,
    isLoading: cascadeLoading,
    refetch,
  } = useQuery(
    [findDownwardCascade, pagination],
    () =>
      FindDownwardCascade(pagination).then(
        (res: AxiosResponse<Cascade.DownListRes>) => res.data,
      ),
    {
      refetchInterval: 10000,
      onError: (error: Error) => ErrorHandle(error),
    },
  );

  return (
    <PageContainer title={process.env.PAGE_TITLE}>
      <Box>
        <FunctionBar btnChannle={funcBtnList} />
      </Box>
      <Box>
        <Table
          loading={cascadeLoading}
          rowKey={'ApeID'}
          key={'system_app_table_key'}
          columns={columns}
          scroll={{ x: 1300 }}
          dataSource={cascadeData?.items}
          pagination={{
            total: cascadeData?.total,
            pageSize: pagination.size,
            current: pagination.page,
            onChange: (page: number, size: number) => {
              setPagination({ ...pagination, page, size });
            },
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Box>
      <DownCascadeFrom ref={downCascadeRef} />
    </PageContainer>
  );
};

export default View;