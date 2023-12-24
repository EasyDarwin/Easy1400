import { EditMaxCollectNum, getDeviceList } from '@/services/http/device';
import { ErrorHandle } from '@/services/http/http';
import { useQueryClient } from '@umijs/max';
import { useMutation } from '@umijs/max';
import { Form, Input, InputNumber, Modal, message } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

export interface IQuantityFromProps {
    setFieldsValue:(v:{id:string;max_count:number}) => void;
}

const QuantityFrom: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    setFieldsValue: (v:any) => {
      form.setFieldsValue(v);
      setModalVisible(true);
    },
  }));
  
  const queryClient = useQueryClient();
  const [form] = Form.useForm<Device.APEObject>(); // 表单数据
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const {mutate,isLoading} = useMutation(EditMaxCollectNum, {
    onSuccess: () => {
      message.success('设置成功');
      queryClient.invalidateQueries([getDeviceList]);
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
      confirmLoading={isLoading}
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
          rules={[{ required: true,message:'请输入限制数，如果不需要限制请输入0' }]}
        >
          <InputNumber className='w-full' placeholder="最大数量 如:300  如果不需要限制请输入0" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default QuantityFrom;
