import { AddDevice, getDeviceList } from '@/services/http/device';
import { ErrorHandle } from '@/services/http/http';
import { useMutation, useQueryClient } from '@umijs/max';
import { Form, Input, Modal, message } from 'antd';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

const DeviceFrom: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    setFieldsValue: (v: any, isEdit?: boolean) => {
      form.setFieldsValue(v);
      setModalVisible(true);
    },
  }));

  const [form] = Form.useForm(); // 表单数据
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { mutate: addMutate, isLoading: addLoading } = useMutation(AddDevice, {
    onSuccess: () => {
      message.success('添加成功');
      queryClient.invalidateQueries([getDeviceList]);
      setModalVisible(false);
      form.resetFields();
    },
    onError: ErrorHandle,
  });

  //默认username跟随id，但是如果username有值就不跟随
  const useIdName = useRef<boolean>(false);
  const handleDeviceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (useIdName.current) return;
    form.setFieldsValue({'username':e.target.value});    
  };

  const handleDeviceUserNameChange = () => {
    useIdName.current = true; // 标记用户名输入框已被修改过
  };

  return (
    <Modal
      title="新增设备"
      centered
      open={modalVisible}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setModalVisible(false);
        useIdName.current = false;
      }}
      width={500}
      destroyOnClose={true}
      confirmLoading={addLoading}
    >
      <Form
        form={form}
        layout="vertical"
        labelAlign="left"
        onFinish={(v: Device.AddReq) => addMutate(v)}
      >
        <Form.Item
          label="设备ID"
          name="id"
          rules={[{ required: true, message: '请输入设备ID' }]}
        >
          <Input placeholder="设备ID" onChange={handleDeviceIdChange} />
        </Form.Item>
        <Form.Item label="设备名称" name="name">
          <Input placeholder="设备名称" />
        </Form.Item>
        <Form.Item label="用户名" name="username">
          <Input placeholder="建议为空 默认为id" onChange={handleDeviceUserNameChange}/>
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default DeviceFrom;
