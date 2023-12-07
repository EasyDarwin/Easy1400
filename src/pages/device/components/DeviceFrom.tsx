import { AddDevice, getDeviceList } from '@/services/http/device';
import { ErrorHandle } from '@/services/http/http';
import { useMutation, useQueryClient } from '@umijs/max';
import { Col, Form, Input, InputNumber, Modal, Row, message } from 'antd';
import React, {
  forwardRef,
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
    form.setFieldsValue({ username: e.target.value });
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
      width="60%"
      destroyOnClose={true}
      confirmLoading={addLoading}
    >
      <Form
        form={form}
        layout="horizontal"
        labelAlign="left"
        labelCol={{ span: 6 }}
        onFinish={(v: Device.AddReq) => {
          console.log(v);

          addMutate(v);
        }}
      >
        <Row gutter={16}>
          <Col span={11}>
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
              <Input
                placeholder="建议为空 默认为id"
                onChange={handleDeviceUserNameChange}
              />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="密码" />
            </Form.Item>
            <div
              style={{
                width: '100%',
                height: '0.8px',
                backgroundColor: '#aaa',
              }}
              className="my-10"
            ></div>

            <Form.Item label="Ipv4" name={['ext', 'ipv4']}>
              <Input placeholder="ipv4地址" />
            </Form.Item>

            <Form.Item label="IPv6" name={['ext', 'ipv6']}>
              <Input placeholder="IPv6地址" />
            </Form.Item>

            <Form.Item label="端口" name={['ext', 'port']}>
              <InputNumber placeholder="端口" />
            </Form.Item>
          </Col>
          <Col span={2}>
            <div
              style={{
                width: '0.8px',
                height: '100%',
                backgroundColor: '#aaa',
                margin: 'auto',
              }}
            ></div>
          </Col>
          <Col span={11}>
            <Form.Item label="行政区划代码" name={['ext', 'place_code']}>
              <Input placeholder="行政区划代码" />
            </Form.Item>

            <Form.Item label="管辖单位代码" name={['ext', 'organize']}>
              <Input placeholder="管辖单位代码" />
            </Form.Item>
            <Form.Item label="所属采集系统" name={['ext', 'owner_id']}>
              <Input placeholder="所属采集系统" />
            </Form.Item>
            <Form.Item label="经度" name={['ext', 'longitude']}>
              <InputNumber placeholder="经度" />
            </Form.Item>
            <Form.Item label="纬度" name={['ext', 'latitude']}>
              <InputNumber placeholder="纬度" />
            </Form.Item>
            <Form.Item label="位置名" name={['ext', 'place']}>
              <Input placeholder="位置名" />
            </Form.Item>
            <Form.Item label="方向" name={['ext', 'direction']}>
              <Input placeholder="方向" />
            </Form.Item>
            <Form.Item label="区域" name={['ext', 'area']}>
              <Input placeholder="区域" />
            </Form.Item>

            <Form.Item label="型号" name={['ext', 'model']}>
              <Input placeholder="型号" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
});

export default DeviceFrom;
