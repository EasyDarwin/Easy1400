import { SaveCascade, getCascades } from '@/services/http/cascade';
import { ErrorHandle } from '@/services/http/http';
import { FindSystemInfo, findSystemInfo } from '@/services/http/system';
import { useMutation, useQuery, useQueryClient } from '@umijs/max';
import { Form, Input, InputNumber, Modal, Switch, message } from 'antd';
import { AxiosResponse } from 'axios';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import OrgTreeSelect from './OrgTreeSelect'

export interface ICascadeRef {
  setFieldsValue: (data?: any, type?: boolean) => void;
}

const CascadeFrom: React.FC<{ ref: any }> = forwardRef(({ }, ref) => {
  useImperativeHandle(ref, () => ({
    setFieldsValue: (v: any, isEdit?: boolean) => {
      if (v) setGroupId(v.virtual_group_id)
      setModalVisible(true);
      setIsEdit(isEdit || false);
      setTimeout(() => {
        form.setFieldsValue(v);
      }, 0)
    },
  }));
  const queryClient = useQueryClient();
  const [form] = Form.useForm(); // 表单数据
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [groupId, setGroupId] = useState<any>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { mutate: saveMutate, isLoading: saveLoading } =
    useMutation(SaveCascade, {
      onSuccess() {
        message.success(isEdit ? '编辑' : '新增成功');
        queryClient.invalidateQueries([getCascades]);
        onClose();
      },
      onError: ErrorHandle,
    });

  //关闭表单
  const onClose = () => {
    form.resetFields();
    setGroupId('')
    setModalVisible(false);
  };

  //获取系统信息
  const { data: infoData, isLoading: infoLoading } =
    useQuery<System.SystemInfo>(
      [findSystemInfo],
      () => FindSystemInfo().then((res: AxiosResponse) => res.data),
      {
        onError: ErrorHandle,
      },
    );

  return (
    <Modal
      title={isEdit ? '编辑上级视图库' : '新增上级视图库'}
      centered
      open={modalVisible}
      width="36%"
      destroyOnClose={true}
      confirmLoading={saveLoading}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        labelAlign="left"
        labelCol={{ span: 6 }}
        onFinish={(v: Cascade.AddReq) => {
          saveMutate(v);
        }}
      >
        <Form.Item hidden={isEdit} label="ID" name="id" rules={[{ required: true }]}>
          <Input placeholder="上级视图库ID" />
        </Form.Item>
        <Form.Item label="名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="上级视图库名称" />
        </Form.Item>
        <Form.Item
          label="用户名"
          name="username"
          initialValue={infoData?.username}
          rules={[{ required: true }]}
        >
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
        <Form.Item label="是否启用" name="enabled" valuePropName="checked" rules={[{ required: true }]}>
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
        {
          modalVisible && (
            <Form.Item label="虚拟组织" name="virtual_group_id">
              <OrgTreeSelect label="虚拟组织" value={groupId} onChange={(v: any) => setGroupId(v)} />
            </Form.Item>
          )
        }
      </Form>
    </Modal>
  );
});

export default CascadeFrom;
