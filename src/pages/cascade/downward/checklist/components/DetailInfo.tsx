import { CACHE_CLEAR_TIME } from '@/constants';
import { FindDictDatas } from '@/services/http/dict';
import { ErrorHandle } from '@/services/http/http';
import { useQuery } from '@umijs/max';
import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from 'antd';
import { AxiosResponse } from 'axios';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

export interface IInfoModalRef {
  OpenModal: (v: Device.APEObject) => void;
}

const Info: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    OpenModal: (v: Device.APEObject) => {
      if (v) {
        const monitorDirection = v.MonitorDirection
          ? v.MonitorDirection.split('/')
          : [];
        const positionType = v.PositionType ? v.PositionType.split('/') : [];
        const functionType = v.FunctionType ? v.FunctionType.split('/') : [];
        form.setFieldsValue({
          ...v,
          MonitorDirection: monitorDirection,
          PositionType: positionType,
          FunctionType: functionType,
        });
      }
      setOpen(true);
    },
  }));
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm(); // 表单数据

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

  //获取功能类型类型字典列表
  const { data: functionTypeList } = useQuery<Dict.DataItem[]>(
    ['positionType'],
    () =>
      FindDictDatas('FunctionType').then(
        (res: AxiosResponse) => res.data.items,
      ),
    {
      staleTime: CACHE_CLEAR_TIME,
      onError: ErrorHandle,
    },
  );

  //获取水平方向字典列表
  const { data: hdirectionTypeList } = useQuery<Dict.DataItem[]>(
    ['hdirectionTypes'],
    () =>
      FindDictDatas('HDirectionType').then(
        (res: AxiosResponse) => res.data.items,
      ),
    {
      staleTime: CACHE_CLEAR_TIME,
      onError: ErrorHandle,
    },
  );

  //关闭表单
  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <Modal
      title="详情信息"
      centered
      open={open}
      onCancel={handleCancel}
      width="70%"
      footer={[]}
    >
      <Form
        form={form}
        layout="horizontal"
        labelAlign="left"
        labelCol={{ span: 6 }}
        disabled={true}
      >
        <Row gutter={16}>
          <Col span={11}>
            <Form.Item labelAlign="right" label="设备 ID" name="ApeID">
              <Input maxLength={20} placeholder="设备ID" />
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
              <Input disabled />
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
              label="监视区域说明"
              name="MonitorAreaDesc"
            >
              <Input placeholder="监视区域说明" />
            </Form.Item>
            <Form.Item
              labelAlign="right"
              label="车辆抓拍方向"
              name="CapDirection"
            >
              <Select
                style={{ width: '100%' }}
                placeholder="车辆抓拍方向"
                options={[
                  { label: '拍车头', value: 0 },
                  { label: '拍车尾，兼容无视频卡口信息设备', value: 1 },
                ]}
              />
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

            <Form.Item labelAlign="right" label="功能类型" name="FunctionType">
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="功能类型"
                options={functionTypeList?.map((item: Dict.DataItem) => ({
                  label: item.label,
                  value: item.value,
                }))}
              />
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

export default Info;
