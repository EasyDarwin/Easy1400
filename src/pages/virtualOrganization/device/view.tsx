import { useQuery, useQueryClient, useMutation, useLocation } from '@umijs/max';
import React, { useRef, useState } from 'react';
import { ArrowLeftOutlined, AppstoreAddOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Tooltip, Popconfirm, Select, Button, Space, message } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { DeleteOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import Box from '@/components/box/Box';
import { getGroupDeviceListPage, GetGroupDeviceListPage, DeleteGroupDevice, SaveGroupDevice } from '@/services/http/groups';
import FunctionBar, { ButtonList } from '@/components/bar/FunctionBar';
import { ErrorHandle } from '@/services/http/http';
import { AxiosResponse } from 'axios';
import queryString from 'query-string';
import OrgTree, { ITreeRef } from '../components/OrgTree'
import BindModal, { IBindModalRef } from '../components/BindModal'
import EditableCell from '../components/EditableCell'
import DeviceModal, { IDeviceModalRef } from '../components/DeviceModal';
import '../view.less'

const OrgDevice: React.FC = () => {
  const queryClient = useQueryClient();
  const location = useLocation()
  const querys = queryString.parse(location.search);
  const [loadings, setLoadings] = useState<string[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [params, setParams] = useState<any>({
    id: querys.id,
    include_child: false,
    value: '',
    size: 10,
    page: 1
  });
  const treeRef = useRef<ITreeRef>();
  const bindModalRef = useRef<IBindModalRef>();
  const deviceModalRef = useRef<IDeviceModalRef>();

  const columns: ColumnsType<any> = [
    {
      title: '设备名称',
      dataIndex: 'name',
      align: 'center',
      fixed: true,
      width: 180,
    },
    {
      title: '原设备编码',
      dataIndex: 'ape_id',
      align: 'center',
      width: 200,
    },
    // {
    //   title: '原通道号',
    //   dataIndex: 'channel',
    //   align: 'center',
    //   width: 200,
    // },
    {
      title: '级联码',
      dataIndex: 'virtual_ape_id',
      align: 'center',
      width: 320,
      render: (text: string, info: any) => (
        <EditableCell 
          dataIndex="virtual_ape_id" 
          record={info} 
          onRefresh={refetch}
        >
          {text}
        </EditableCell>
      )
    },
    {
      title: '状态',
      dataIndex: 'is_online',
      align: 'center',
      width: 120,
      render: (text: string) => <span>{{ 1: '在线', 2: '离线' }[text] || '-'}</span>
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (_: string, record: Cascade.DownItem) => (
        <Tooltip title="删除">
          <Popconfirm
            title={
              <p>
                确定删除设备
                <span className="text-red-500"> {record.name} </span>
                吗?
              </p>
            }
            onConfirm={() => {
              deleteMutate(record.id);
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
      )
    }
  ];
  const barBtnList: ButtonList[] = [
    {
      label: '返回',
      icon: <ArrowLeftOutlined />,
      onClick: () => {
        history.back();
      }
    },
    {
      label: '更新绑定',
      type: 'primary',
      icon: <EditOutlined />,
      disabled: !selectedRowKeys.length,
      onClick: () => {
        onBind(selectedRowKeys, 'update')
      }
    },
    {
      label: '全部设备',
      type: 'primary',
      icon: <AppstoreAddOutlined />,
      onClick: () => {
        onOpenDevice([])
      }
    }
  ]
  const funcSearchComponet = (
    <Space>
      <Select
        placeholder="请选择绑定状态"
        allowClear
        className="mr-2 w-40"
        options={[
          { label: '已绑定', value: '1' },
          { label: '未绑定', value: '0' },
        ]}
        onChange={(v: string) => {
          setParams({ ...params, is_online: v });
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
    </Space>
  );

  const { data: dataSource, isLoading: loading, refetch } =
    useQuery(
      [getGroupDeviceListPage, params],
      () => {
        setSelectedRowKeys([])
        return GetGroupDeviceListPage(params).then((res: AxiosResponse) => res.data)
      },
      {
        onError: ErrorHandle,
      },
    );


  const { mutate: deleteMutate } = useMutation(DeleteGroupDevice, {
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

  const onSelectChild = (v: boolean) => {
    setParams({ ...params, include_child: v })
    refetch()
  }

  /**
   * 组织树 更新
   * @param id 选中根组织id
   * @param info 选中根组织明细
   */
  const onTreeChange = (id: any, info: Group.GroupItem) => {
    setParams({ ...params, id })
    queryClient.invalidateQueries([getGroupDeviceListPage]);
  }

  const onOpenDevice = (ids?: any[]) => {
    deviceModalRef.current?.openModal(ids)
  }

  const onBind = (ids: any[], type?: any) => {
    bindModalRef.current?.openModal(ids, type)
  }

  return (
    <PageContainer title={process.env.PAGE_TITLE} style={{ height: 'calc(100vh - 26px)' }}>
      <Box className="page-wrapper">
        <div className="left-wrapper">
          <OrgTree ref={treeRef} parentInfo={querys} onSelectChild={onSelectChild} onChange={onTreeChange} />
        </div>
        <div className="right-wrapper">
          <div className="flex justify-between items-center mt-2 pl-[10px]">
            <FunctionBar
              btnChannle={barBtnList}
              span={[4, 20]}
              rigthChannle={funcSearchComponet}
              rigthChannleClass="flex justify-end"
            />
          </div>
          <Box>
            <Table
              loading={loading}
              rowKey={'ape_id'}
              columns={columns}
              scroll={{ x: '100%' }}
              dataSource={dataSource?.items}
              rowSelection={{
                fixed: true,
                selectedRowKeys,
                onChange: (keys: React.Key[]) => setSelectedRowKeys(keys)
              }}
              pagination={{
                total: dataSource?.total,
                pageSize: params.size,
                current: params.page,
                onChange: (page: number, size: number) => {
                  setParams({ ...params, page: size !== params.size ? page : 1, size });
                },
                showTotal: (total) => `共 ${total} 条`,
              }}
            />
          </Box>
        </div>
      </Box>
      <BindModal ref={bindModalRef} onBack={onOpenDevice} />
      <DeviceModal ref={deviceModalRef} onBind={(v: any[]) => onBind(v, 'device')} />
    </PageContainer>
  );
};

export default OrgDevice;
