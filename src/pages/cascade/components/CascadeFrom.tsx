import { AddCascade, getCascades } from '@/services/http/cascade';
import { ErrorHandle } from '@/services/http/http';
import { useMutation, useQueryClient } from '@umijs/max';
import { Form, Input, InputNumber, Modal, message } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

export interface ICascadeRef {
  setFieldsValue: (data?: any, type?: boolean) => void;
}

const CascadeFrom: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    setFieldsValue: (v: any, isEdit?: boolean) => {
      form.setFieldsValue(v);
      setModalVisible(true);
      setIsEdit(isEdit || false);
    },
  }));

  const [form] = Form.useForm(); // 表单数据
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { mutate: addCascadeMutate, isLoading: addCascadeLoading } =
    useMutation(AddCascade, {
      onSuccess() {
        message.success('新增成功');
        queryClient.invalidateQueries([getCascades]);
        handleClose();
      },
      onError: ErrorHandle,
    });

  //关闭表单
  const handleClose = () => {
    form.resetFields();
    setModalVisible(false);
  };

  return (
    <Modal
      title="新增上级视图库"
      centered
      open={modalVisible}
      onOk={() => form.submit()}
      onCancel={handleClose}
      width="36%"
      destroyOnClose={true}
      confirmLoading={addCascadeLoading}
    >
      <Form
        form={form}
        layout="vertical"
        labelAlign="left"
        labelCol={{ span: 6 }}
        onFinish={(v: Cascade.AddReq) => {
          addCascadeMutate(v);
        }}
      >
        <Form.Item label="ID" name="id" rules={[{ required: true }]}>
          <Input placeholder="上级视图库ID" />
        </Form.Item>
        <Form.Item label="名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="上级视图库名称" />
        </Form.Item>
        <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
          <Input placeholder="上级视图库用户名" />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true }]}>
          <Input placeholder="上级视图库密码" />
        </Form.Item>
        <Form.Item label="IP" name="ip" rules={[{ required: true }]}>
          <Input placeholder="上级视图库 IP" />
        </Form.Item>
        <Form.Item label="Port" name="port" rules={[{ required: true }]}>
          <InputNumber className="w-full" placeholder="上级视图库端口" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CascadeFrom;
