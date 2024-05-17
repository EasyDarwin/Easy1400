
import { AxiosResponse } from 'axios';
import { ErrorHandle } from '@/services/http/http';
import React, { useRef, useState } from 'react';
import { PlusOutlined, AppstoreAddOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Table, Space, Tooltip, Popconfirm, message } from 'antd';
import { useQuery, useQueryClient, useMutation, history } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/es/table';
import Box from '@/components/box/Box';
import { getGroupListPage, GetGroupListPage, DeleteGroup } from '@/services/http/groups';
import GroupContext from './components/GroupContext'
import OrgTree, { ITreeRef } from './components/OrgTree'
import GroupModal, { IGroupModalRef } from './components/GroupModal'
import './view.less';

const View: React.FC = () => {
  const groupModalRef = useRef<IGroupModalRef>();
  const treeRef = useRef<ITreeRef>();
  const [selectInfo, setSelectInfo] = useState<any>({})
  const [loadings, setLoadings] = useState<string[]>([]);
  const [deviceCount, setDeviceCount] = useState<any>({})
  const [params, setParams] = useState<Group.GroupDeviceListReq>({
    id: '',
    name: '',
    size: 10,
    page: 1
  })
  const queryClient = useQueryClient();

  const columns: ColumnsType<any> = [
    {
      title: '节点名称',
      dataIndex: 'name',
      fixed: true,
      align: 'center',
      width: 180,
    },
    {
      title: '组织编码',
      dataIndex: 'code',
      align: 'center',
      width: 180,
    },
    {
      title: '(在线/绑定)设备数',
      dataIndex: 'id',
      align: 'center',
      width: 180,
      render: (text: any) => {
        const cur = deviceCount[text] || {}
        return cur.count ? `${cur.online}/${cur.count}` : '-'
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
      width: 180,
    },
    {
      title: '修改时间',
      dataIndex: 'updated_at',
      align: 'center',
      width: 180,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 140,
      render: (_: string, record: Cascade.DownItem) => {
        return (
          <Space>
            <Tooltip title="编辑">
              <Button
                onClick={() => {
                  groupModalRef.current?.openModal({ ...record, pname: selectInfo.name }, 'edit', 'refresh')
                }}
                icon={<FormOutlined />}
              />
            </Tooltip>
            <Tooltip title="删除">
              <Popconfirm
                title={
                  <p>
                    确定删除节点
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
          </Space>
        );
      },
    },
  ];

  // 查询表格
  const {
    data: dataSource,
    isLoading: loading,
    refetch
  } = useQuery<Group.GroupListRes>(
    [getGroupListPage, params],
    () => {
      if (!params.id) {
        return new Promise(resolve => {
          resolve({ items: [], total: 0 });
        })
      }
      return GetGroupListPage(params).then((res: AxiosResponse) => res.data)
    },
    {
      // refetchInterval: 10000,
      onError: ErrorHandle,
    },
  );

  // 删除组织
  const { mutate: deleteSelMutate, isLoading: deleteLoading } = useMutation(
    DeleteGroup,
    {
      onSuccess(res: AxiosResponse) {
        message.success('组织删除成功');
        // 删除后重新查询下拉列表
        refreshTree({}, 'group')
      },
      onError: (error: Error) => {
        ErrorHandle(error);
      },
    }
  );

  // 删除子节点
  const { mutate: deleteMutate } = useMutation(
    DeleteGroup,
    {
      onMutate: (v: string) => {
        setLoadings([...loadings, v]);
      },
      onSuccess(res: AxiosResponse) {
        message.success('节点删除成功');
        setLoadings((v) => v.filter((item) => item !== res.data.id));
        // 刷新表格
        refetch()
        // 重新查询组织树
        refreshTree({}, 'refresh')
      },
      onError: (error: Error) => {
        setLoadings([]);
        ErrorHandle(error);
      },
    }
  );

  const onTreeChange = (id: any, info: Group.GroupItem) => {
    setSelectInfo(info)
    setParams({ ...params, id })
    queryClient.invalidateQueries([getGroupListPage]);
  }

  const onSetDeviceCount = (info: any) => {
    setDeviceCount(info)
  }

  // 刷新树
  const refreshTree = (info?: any, type?: any) => {
    treeRef.current?.refreshTree(info, type)
  }

  const labelText = selectInfo.pid ? '节点' : '组织'
  
  return (
    <PageContainer title={process.env.PAGE_TITLE} style={{ height: 'calc(100vh - 26px)' }}>
      <GroupContext.Provider value={{ refreshTree }}>
        <Box className="page-wrapper">
          <div className="left-wrapper">
            <Button.Group>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  groupModalRef.current?.openModal({}, '', 'group')
                }}
              >
                新增组织
              </Button>
              <Button
                type="primary"
                ghost
                icon={<AppstoreAddOutlined />}
                onClick={() => {
                  const info = treeRef?.current?.rootInfo
                  history.push({
                    pathname: `/virtualOrganization/device`,
                    search: `id=${info?.id}&name=${info.name}`,
                  })
                }}
              >
                绑定设备
              </Button>
            </Button.Group>
            <OrgTree 
              ref={treeRef} 
              onChange={onTreeChange}
              refreshCount={onSetDeviceCount} 
            />
          </div>
          <div className="right-wrapper">
            <Box className="info">
              <Space size="large">
                <div><span className="label">{labelText}名称：</span>{selectInfo.name}</div>
                <div><span className="label">{labelText}编码：</span>{selectInfo.code}</div>
              </Space>
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    groupModalRef.current?.openModal(selectInfo, 'edit', 'refresh')
                  }}
                >
                  编辑
                </Button>
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    groupModalRef.current?.openModal({ pid: selectInfo.id || 0, pname: selectInfo.name }, 'add', 'refresh')
                  }}
                >
                  添加子节点
                </Button>
                {
                  // 仅跟组织展示删除按钮
                  !selectInfo.pid && (
                    <Popconfirm
                      title={
                        <p>
                          确定删除组织
                          <span className="text-red-500"> {selectInfo.name} </span>
                          吗?
                        </p>
                      }
                      onConfirm={() => {
                        deleteSelMutate(selectInfo.id)
                      }}
                    >
                      <Button
                        loading={deleteLoading}
                        type="dashed"
                        danger
                      >
                        删除
                      </Button>
                    </Popconfirm>)
                }
              </Space>
            </Box>
            <Box className="search">
              <Search
                className="w-80"
                enterButton
                allowClear
                placeholder="请输入组织名称"
                onSearch={(v: string) => {
                  setParams({ ...params, name: v });
                }}
              />
            </Box>
            <Box>
              <Table
                loading={loading}
                rowKey={'id'}
                key={'system_app_table_key'}
                columns={columns}
                scroll={{ x: '100%' }}
                dataSource={dataSource?.items}
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

        <GroupModal ref={groupModalRef} />
      </GroupContext.Provider>
    </PageContainer>
  )
}

export default View;
