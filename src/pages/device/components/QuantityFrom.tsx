import { EditMaxCollectNum } from '@/services/http/device';
import { ErrorHandle } from '@/services/http/http';
import { useMutation } from '@umijs/max';
import { Form, Input, InputNumber, Modal, message } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

export interface IQuantityFromProps {
    setFieldsValue:(v:string) => void;
}

const QuantityFrom: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    setFieldsValue: (v: string) => {
      form.setFieldValue('id', v);
      setModalVisible(true);
    },
  }));

  const [form] = Form.useForm<Device.APEObject>(); // 表单数据
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const {mutate,isLoading} = useMutation(EditMaxCollectNum, {
    onSuccess: () => {
      message.success('设置成功');
      form.resetFields();
      setModalVisible(false);
    },
    onError:ErrorHandle
  });

  //关闭表单
  const handleCancel = () => {
    form.resetFields();
    setModalVisible(false);
  };

  return (
    <Modal
      title="限制采集数量"
      centered
      open={modalVisible}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      destroyOnClose={true}
      confirmLoading={false}
    >
      <Form
        form={form}
        layout="vertical"
        labelAlign="left"
        labelCol={{ span: 6 }}
        onFinish={(v:any) => {mutate(v)}}
      >
        <Form.Item label="设备 ID" name="id">
          <Input placeholder="设备ID" disabled={true} />
        </Form.Item>
        <Form.Item
          label="最大数量"
          name="max_count"
          rules={[{ required: true }]}
        >
          <InputNumber className='w-full' placeholder="最大数量 如:300" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default QuantityFrom;
