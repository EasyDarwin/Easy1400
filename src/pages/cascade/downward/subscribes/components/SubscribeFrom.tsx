import React, { forwardRef, useImperativeHandle, useState } from 'react';

import {
  AddDownwardSubscribes,
  findDownwardSubscribes,
} from '@/services/http/cascade';
import { ErrorHandle } from '@/services/http/http';
import { useMutation, useQueryClient, useSearchParams } from '@umijs/max';
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  message,
} from 'antd';
import dayjs from 'dayjs';

export interface IDownCascadeRef {
  setFieldsValue: (data?: any, type?: boolean) => void;
}

const SubscribeFrom: React.FC<{ dictTypeList: Dict.DataItem[]; ref: any }> =
  forwardRef(({ dictTypeList }, ref) => {
    useImperativeHandle(ref, () => ({
      setFieldsValue: (v?: any, isEdit?: boolean) => {
        let subscribeDetail;
        let endTime;
        let beginTime;
        if (v.SubscribeDetail) {
          subscribeDetail = v.SubscribeDetail.split(',') ?? [];
        }
        if (v.EndTime) {
          endTime = dayjs(v.EndTime);
          beginTime = dayjs(v.BeginTime);
        }
        form.setFieldsValue({
          ...v,
          SubscribeDetail: subscribeDetail,
          EndTime: endTime,
          BeginTime: beginTime,
        });
        setIsEdit(isEdit || false);
        setModalVisible(true);
      },
    }));
    const [searchParams, _] = useSearchParams();
    const deviceID = searchParams.get('device_id') ?? '';
    const [form] = Form.useForm(); // 表单数据
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const { mutate: addMutate, isLoading: addLoading } = useMutation(
      AddDownwardSubscribes,
      {
        onSuccess() {
          message.success(isEdit ? '修改成功' : '新增成功');
          handleClose();
          setTimeout(() => {
            queryClient.invalidateQueries([findDownwardSubscribes]);
          }, 1500);
        },
        onError: ErrorHandle,
      },
    );

    //提交表单
    const handleSubmit = (v: Cascade.DownSubscribesReq) => {
      let subscribeDetail = '';
      if (v.SubscribeDetail) subscribeDetail = [...v.SubscribeDetail].join();
      const formattedValues = {
        ...v,
        SubscribeDetail: subscribeDetail,
        BeginTime: dayjs(v.BeginTime).format('YYYYMMDDhhmmss') ?? '',
        EndTime: dayjs(v.EndTime).format('YYYYMMDDhhmmss') ?? '',
      };
      const data = {
        id: deviceID,
        data: formattedValues,
      };
      addMutate(data);
    };

    const [showItem, setShowItem] = useState(false);

    const handleSelectorChange = (value: number) => {
      if (value === 1) {
        setShowItem(true);
      } else {
        setShowItem(false);
      }
    };

    //关闭表单
    const handleClose = () => {
      form.resetFields();
      setModalVisible(false);
    };
    return (
      <Modal
        title={isEdit ? '编辑下级订阅' : '新增下级订阅'}
        centered
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={handleClose}
        destroyOnClose={true}
        width="50%"
        confirmLoading={addLoading}
      >
        <Form
          form={form}
          layout="vertical"
          labelAlign="left"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="订阅标识符" name="SubscribeID">
                <Input
                  maxLength={33}
                  disabled
                  placeholder="订阅标识符33位编码 默认生成"
                />
              </Form.Item>
              <Form.Item
                label="订阅标题"
                name="Title"
                rules={[{ required: true }]}
              >
                <Input placeholder="订阅标题" />
              </Form.Item>
              <Form.Item
                label="订阅类别"
                name="SubscribeDetail"
                rules={[{ required: true }]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="订阅类别"
                  options={dictTypeList?.map((item: Dict.DataItem) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="订阅资源路径"
                name="ResourceURI"
                rules={[{ required: true }]}
              >
                <Input placeholder="订阅资源路径" />
              </Form.Item>
              <Form.Item
                label="申请人"
                name="ApplicantName"
                rules={[{ required: true }]}
              >
                <Input placeholder="申请人" />
              </Form.Item>
              <Form.Item
                label="申请单位"
                name="ApplicantOrg"
                rules={[{ required: true }]}
              >
                <Input placeholder="申请单位" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="开始时间"
                name="BeginTime"
                rules={[{ required: true }]}
              >
                <DatePicker
                  format={'YYYY-MM-DD HH:mm:ss'}
                  style={{ width: '100%' }}
                  showTime
                />
              </Form.Item>
              <Form.Item
                label="结束时间"
                name="EndTime"
                rules={[{ required: true }]}
              >
                <DatePicker
                  format={'YYYY-MM-DD HH:mm:ss'}
                  style={{ width: '100%' }}
                  showTime
                />
              </Form.Item>
              <Form.Item
                label="信息接收地址"
                name="ReceiveAddr"
                rules={[{ required: true }]}
              >
                <Input placeholder="信息接收地址" />
              </Form.Item>
              <Form.Item
                label="信息上报间隔时间(秒)"
                name="ReportInterval"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="信息上报间隔时间(秒)"
                />
              </Form.Item>
              <Form.Item label="理由" name="Reason">
                <Input placeholder="理由" />
              </Form.Item>
              <Form.Item
                label="操作类型"
                name="OperateType"
                rules={[{ required: true }]}
                initialValue={0}
              >
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="操作类型"
                  onChange={handleSelectorChange}
                  options={[
                    { label: '订阅', value: 0 },
                    { label: '取消订阅', value: 1 },
                  ]}
                />
              </Form.Item>
              {showItem && (
                <>
                  <Form.Item
                    label="订阅撤销单位"
                    name="SubscribeCancelOrg"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="订阅单位名称" />
                  </Form.Item>
                  <Form.Item
                    label="撤销人"
                    name="SubscribeCancelPerson"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="撤销人" />
                  </Form.Item>
                  <Form.Item
                    label="撤销原因"
                    name="CancelReason"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="撤销原因" />
                  </Form.Item>
                </>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  });

export default SubscribeFrom;
