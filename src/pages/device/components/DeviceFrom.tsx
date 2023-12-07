import { useMutation, useQueryClient } from '@umijs/max';
import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  message,
} from 'antd';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { CACHE_CLEAR_TIME } from '@/constants/index';
import { AddDevice, EditDevice, getDeviceList } from '@/services/http/device';
import { FindDictDatas } from '@/services/http/dict';
import { ErrorHandle } from '@/services/http/http';
import { useQuery } from '@umijs/max';
import { AxiosResponse } from 'axios';

const DeviceFrom: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    setFieldsValue: (v: Device.APEObject, isEdit?: boolean) => {
      if (v) {
        const monitorDirection = v.MonitorDirection
          ? v.MonitorDirection.split('/')
          : [];
        const positionType = v.PositionType ? v.PositionType.split('/') : [];
        form.setFieldsValue({
          ...v,
          MonitorDirection: monitorDirection,
          PositionType: positionType,
        });
      }
      setModalVisible(true);
      setIsEdit(isEdit || false);
    },
  }));

  const [form] = Form.useForm<Device.APEObject>(); // 表单数据
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  //获取摄像机位置类型字典列表
  const { data: positionTypeList } = useQuery<Dict.DataItem[]>(
    ['positionType'],
    () =>
      FindDictDatas('PositionType').then(
        (res: AxiosResponse) => res.data.items,
      ),
    {
      staleTime: CACHE_CLEAR_TIME,
      onError: ErrorHandle,
    },
  );

  //获取水平方向字典列表
  const { data: hdirectionTypeList } = useQuery<Dict.DataItem[]>(
    ['hdirectionType'],
    () =>
      FindDictDatas('HDirectionType').then(
        (res: AxiosResponse) => res.data.items,
      ),
    {
      staleTime: CACHE_CLEAR_TIME,
      onError: ErrorHandle,
    },
  );

  const { mutate: addMutate, isLoading: addLoading } = useMutation(AddDevice, {
    onSuccess: () => {
      message.success('添加成功');
      queryClient.invalidateQueries([getDeviceList]);
      handleCancel()
    },
    onError: ErrorHandle,
  });

  //修改设备
  const { mutate: editMutate, isLoading: editDeviceLoading } = useMutation(
    EditDevice,
    {
      onSuccess: (res) => {
        message.success('修改成功');
        queryClient.invalidateQueries([getDeviceList]);
        handleCancel()
      },
      onError: ErrorHandle,
    },
  );

  //默认username跟随id，但是如果username有值就不跟随
  const useIdName = useRef<boolean>(false);
  const handleDeviceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (useIdName.current) return;
    form.setFieldsValue({ UserId: e.target.value });
  };

  const handleDeviceUserNameChange = () => {
    useIdName.current = true; // 标记用户名输入框已被修改过
  };

  //提交表单
  const handleSubmit = (v: Device.APEObject) => {
    let positionType = '';
    let monitorDirection = '';
    if (v.PositionType) positionType = [...v.PositionType].join('/');
    if (v.MonitorDirection)
      monitorDirection = [...v.MonitorDirection].join('/');
    const formattedValues = {
      ...v,
      PositionType: positionType,
      MonitorDirection: monitorDirection,
    };
    if (isEdit) {
      editMutate({ id: v.ApeID, data: formattedValues });
    } else {
      addMutate(formattedValues);
    }
  };

  //关闭表单
  const handleCancel = () => {
    form.resetFields();
    setModalVisible(false);
    useIdName.current = false;
  }

  return (
    <Modal
      title={isEdit ? '修改设备' : '新增设备'}
      centered
      open={modalVisible}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      width="70%"
      destroyOnClose={true}
      confirmLoading={addLoading}
    >
      <Form
        form={form}
        layout="horizontal"
        labelAlign="left"
        labelCol={{ span: 6 }}
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={11}>
            <Form.Item
              labelAlign="right"
              label="设备 ID"
              name="ApeID"
              rules={[{ required: true }]}
            >
              <Input
                maxLength={20}
                disabled={isEdit}
                placeholder="设备ID"
                onChange={handleDeviceIdChange}
              />
            </Form.Item>
            <Form.Item
              labelAlign="right"
              label="名 称"
              name="Name"
              rules={[{ required: true }]}
            >
              <Input maxLength={30} placeholder="设备名称" />
            </Form.Item>
            <Form.Item
              labelAlign="right"
              label="用户账号"
              name="UserId"
              rules={[{ required: true }]}
            >
              <Input disabled onChange={handleDeviceUserNameChange} />
            </Form.Item>
            <Form.Item
              labelAlign="right"
              label="用户口令"
              name="Password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="密码" />
            </Form.Item>

            <Divider
              className="w-full bg-slate-300"
              style={{
                margin: '40px 0px',
              }}
              dashed
            />
            <Form.Item labelAlign="right" label="IPv4" name="IPAddr">
              <Input placeholder="例如: 192.168.0.2" />
            </Form.Item>

            <Form.Item labelAlign="right" label="IPv6" name="IPV6Addr">
              <Input placeholder="IPv6地址" />
            </Form.Item>

            <Form.Item labelAlign="right" label="端口" name="Port">
              <InputNumber style={{ width: '100%' }} placeholder="端口" />
            </Form.Item>
            <Form.Item labelAlign="right" label="经度" name="Longitude">
              <InputNumber style={{ width: '100%' }} placeholder="经度" />
            </Form.Item>
            <Form.Item labelAlign="right" label="纬度" name="Latitude">
              <InputNumber style={{ width: '100%' }} placeholder="纬度" />
            </Form.Item>
          </Col>
          <Col span={2} className="items-center flex flex-col">
            <Divider className="h-full bg-slate-300" type="vertical" dashed />
          </Col>
          <Col span={11}>
            <Form.Item labelAlign="right" label="型号" name="Model">
              <Input placeholder="型号" />
            </Form.Item>
            <Form.Item labelAlign="right" label="行政区划代码" name="PlaceCode">
              <Input placeholder="安装地点行政区划代码" />
            </Form.Item>
            <Form.Item labelAlign="right" label="位置名" name="Place">
              <Input placeholder="位置名" />
            </Form.Item>
            <Form.Item labelAlign="right" label="管辖单位代码" name="OrgCode">
              <Input placeholder="管辖单位代码" />
            </Form.Item>
            <Form.Item
              labelAlign="right"
              label="所属采集系统"
              name="OwnerApsID"
            >
              <Input placeholder="所属采集系统" />
            </Form.Item>

            <Form.Item
              labelAlign="right"
              label="车辆抓拍方向"
              name="CapDirection"
            >
              <Input placeholder="车辆抓拍方向" />
            </Form.Item>
            <Form.Item
              labelAlign="right"
              label="监视方向"
              name="MonitorDirection"
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="监视方向"
                options={hdirectionTypeList?.map((item: Dict.DataItem) => ({
                  label: item.label,
                  value: item.value,
                }))}
              />
            </Form.Item>
            <Form.Item
              labelAlign="right"
              label="监视区域说明"
              name="MonitorAreaDesc"
            >
              <Input placeholder="监视区域说明" />
            </Form.Item>
            <Form.Item labelAlign="right" label="功能类型" name="FunctionType">
              <Input placeholder="功能类型" />
            </Form.Item>
            <Form.Item
              labelAlign="right"
              label="摄像机位置类型"
              name="PositionType"
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="摄像机位置类型"
                options={positionTypeList?.map((item: Dict.DataItem) => ({
                  label: item.label,
                  value: item.value,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
});

export default DeviceFrom;
