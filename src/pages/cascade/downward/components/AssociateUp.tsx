import { getCascades } from '@/services/http/cascade';
import { ErrorHandle } from '@/services/http/http';
import { useQuery, useQueryClient } from '@umijs/max';
import { Form, Input, Select, Modal, Table, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

export interface IAssociateUpRef {
  openModal: (v: { id: string; device_ids: string[] }) => void;
}

interface RecordType {
  key: string;
  title: string;
  description: string;
}

const AssociateUp: React.FC<{ ref: any }> = forwardRef(({ }, ref) => {
  useImperativeHandle(ref, () => ({
    openModal: (v: { id: string; device_ids: string[] }) => {
      form.setFieldsValue(v);
      setVisible(true);
    },
  }));

  const [form] = Form.useForm(); // 表单数据
  const [visible, setVisible] = useState<boolean>(false);

  const [params, setParams] = useState<Cascade.ListReq>({
    page: 1,
    size: 10,
    name: '',
    value: '',
    status: ''
  });

  const columns: ColumnsType<Cascade.Item[]> = [
    {
      title: '平台名称',
      dataIndex: 'name',
      align: 'center',
      width: 180,
      render: (text: string) => (text || '-'),
    },
    {
      title: '视图库编码',
      dataIndex: 'code',
      align: 'center',
      width: 180,
      render: (text: string) => (text || '-'),
    },
    {
      title: '是否推送',
      dataIndex: 'isSend',
      align: 'center',
      width: 120,
      render: (text: string) => ({ 1: '是', 0: '否' }[text] || '-'),
    },
    // {
    //   title: '操作',
    //   align: 'center',
    //   fixed: 'right',
    //   width: 180,
    //   render: (text: string, record: Cascade.Item) => {
    //     return (
    //       <Space>
    //         <Tooltip title="删除">
    //           <Popconfirm
    //             title={
    //               <p>
    //                 确定删除
    //                 <span className="text-red-500"> {record.id} </span>
    //                 级联吗?
    //               </p>
    //             }
    //             okButtonProps={{
    //               loading: loadings.includes(record.id),
    //             }}
    //             onConfirm={() => deleteCascadeMutate(record.id)}
    //           >
    //             <Button
    //               loading={loadings.includes(record.id)}
    //               type="dashed"
    //               danger
    //               icon={<DeleteOutlined />}
    //             />
    //           </Popconfirm>
    //         </Tooltip>
    //       </Space>
    //     );
    //   },
    // },
  ];

  const {
    data: cascadeData,
    isLoading: loading,
    refetch,
  } = useQuery(
    [getCascades, params],
    () => Promise.resolve({ total: 1, data: [{ id: 1 }] }),
    // FindCascadeLists(pagination).then((res) => res.data as <Cascade.ListRes>),
    {
      // refetchInterval: 10000,
      onError: (error: Error) => ErrorHandle(error),
    },
  );


  //关闭表单
  const handleClose = () => {
    form.resetFields();
    setVisible(false);
  };

  return (
    <Modal
      title="关联上级平台"
      width="60%"
      centered
      destroyOnClose
      footer={null}
      open={visible}
      onCancel={handleClose}
    >
      <Form
        form={form}
        className="mb-[10px]"
        layout="inline"
        labelAlign="right"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={(v) => {
          refetch(v);
        }}
      >
        <Form.Item label="平台名称" name="name" style={{flex: 1}}>
          <Input placeholder="请输入平台名称" allowClear />
        </Form.Item>
        <Form.Item label="接入编码" name="value" style={{flex: 1}}>
          <Input placeholder="请输入接入编码" allowClear />
        </Form.Item>
        <Form.Item label="是否推送" name="status" style={{flex: 1}}>
          <Select
            placeholder="请选择是否推送"
            allowClear
            options={[
              { label: '是', value: 'online' },
              { label: '否', value: 'offline' },
            ]}
          />
        </Form.Item>
        <Form.Item style={{flex: 1}} wrapperCol={{ span: 24 }}>
          <Button type="primary" className="mr-[8px]">查询</Button>
          <Button>重置</Button>
        </Form.Item>
      </Form>
      <Table
        loading={loading}
        rowKey={'id'}
        columns={columns}
        scroll={{ x: '100%' }}
        dataSource={cascadeData?.data}
        pagination={{
          total: cascadeData?.total,
          pageSize: params.size,
          current: params.page,
          onChange: (page: number, size: number) => {
            setParams({ ...params, page, size });
          },
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </Modal>
  );
});

export default AssociateUp;
