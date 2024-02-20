import {
  AddDownwardDispositions,
  findDownwardDispoitions,
} from '@/services/http/cascade';
import { ErrorHandle } from '@/services/http/http';
import { useMutation, useQueryClient, useSearchParams } from '@umijs/max';
import {
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  message,
} from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

export interface IDownDispositionRef {
  setFieldsValue: (data?: any, type?: boolean) => void;
}

const DispositionFrom: React.FC<{
  dictTypeList: Dict.DataItem[];
  dispositionTypeList: Dict.DataItem[];
  ref: any;
}> = forwardRef(({ dictTypeList, dispositionTypeList }, ref) => {
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
  const [searchParams, _] = useSearchParams();
  const deviceID = searchParams.get('device_id') ?? '';

  const { mutate: addDispotitionMutate, isLoading: addDispotitionLoading } =
    useMutation(AddDownwardDispositions, {
      onSuccess() {
        message.success('新增成功');
        queryClient.invalidateQueries([findDownwardDispoitions]);
        handleClose();
      },
      onError: ErrorHandle,
    });

  const [showItem, setShowItem] = useState(false);
  const handleSelectorChange = (value: number) => {
    if (value === 2) {
      setShowItem(true);
    } else {
      setShowItem(false);
    }
  };

  //提交表单
  const handleSubmit = (v: Cascade.DispositionObject) => {
    if (!deviceID) return message.error('获取code失败!');
    let dispositionCategory = '';
    let dispositionRange = '';
    if (v.DispositionCategory) dispositionCategory = [...v.DispositionCategory].join();
    if (v.DispositionRange) dispositionRange = [...v.DispositionRange].join();
    let dispositionObject = {
      ...v,
      DispositionCategory: dispositionCategory,
      DispositionRange:dispositionRange,
      BeginTime: dayjs(v.BeginTime).format('YYYYMMDDhhmmss') ?? '',
      EndTime: dayjs(v.EndTime).format('YYYYMMDDhhmmss') ?? '',
    };
    const fromData = { code: deviceID, DispositionObject: dispositionObject };
    addDispotitionMutate(fromData);
  };

  //关闭表单
  const handleClose = () => {
    form.resetFields();
    setModalVisible(false);
  };

  return (
    <Modal
      title="新增下级布控"
      width="70%"
      centered
      open={modalVisible}
      onOk={() => form.submit()}
      onCancel={handleClose}
      destroyOnClose={true}
      confirmLoading={addDispotitionLoading}
    >
      <Form
        form={form}
        layout="vertical"
        labelAlign="left"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="布控标识符"
              name="DispositionID"
              rules={[{ required: true }]}
            >
              <Input placeholder="布控标识符" />
            </Form.Item>
            <Form.Item
              label="布控标题"
              name="Title"
              rules={[{ required: true }]}
            >
              <Input placeholder="布控标题" />
            </Form.Item>
            <Form.Item
              label="布控类别"
              name="DispositionCategory"
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
              label="布控对象特征"
              name="TargetFeature"
              rules={[{ required: true }]}
            >
              <Input placeholder="布控对象特征" />
            </Form.Item>
            <Form.Item label="布控对象图像" name="TargetImageURI">
              <Input placeholder="布控对象图像" />
            </Form.Item>
            <Form.Item label="布控优先级" name="PriorityLevel">
              <Input placeholder="布控优先级" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="申请人"
              name="ApplicantName"
              rules={[{ required: true }]}
            >
              <Input placeholder="申请人" />
            </Form.Item>
            <Form.Item label="申请人联系方式" name="ApplicantInfo">
              <Input placeholder="申请人联系方式" />
            </Form.Item>
            <Form.Item
              label="申请单位"
              name="ApplicantOrg"
              rules={[{ required: true }]}
            >
              <Input placeholder="申请单位" />
            </Form.Item>
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
              label="布控范围"
              name="DispositionRange"
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="布控范围"
                options={dispositionTypeList?.map((item: Dict.DataItem) => ({
                  label: item.label,
                  value: item.value,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="布控卡口" name="TollgateList">
              <Input placeholder="布控卡口" />
            </Form.Item>
            <Form.Item label="布控行政区代码" name="DispositionArea">
              <Input placeholder="布控行政区代码" />
            </Form.Item>
            <Form.Item label="告警信息接收地址" name="ReceiveAddr">
              <Input placeholder="告警信息接收地址" />
            </Form.Item>
            <Form.Item label="告警信息接收手机号" name="ReceiveMobile">
              <Input placeholder="多个号码间以英文半角分号”;”间隔" />
            </Form.Item>
            <Form.Item label="理由" name="Reason">
              <Input placeholder="理由" />
            </Form.Item>
            <Form.Item
              label="操作类型"
              name="OperateType"
              rules={[{ required: true }]}
            >
              <Select
                allowClear
                style={{ width: '100%' }}
                placeholder="操作类型"
                onChange={handleSelectorChange}
                options={[
                  { label: '布控', value: 1 },
                  { label: '撤控', value: 2 },
                ]}
              />
            </Form.Item>
            {showItem && (
              <>
                <Form.Item
                  label="撤销单位名称"
                  name="DispositionRemoveOrg"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="撤销单位名称" />
                </Form.Item>
                <Form.Item
                  label="撤销人"
                  name="DispositionRemovePerson"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="撤销人" />
                </Form.Item>
                <Form.Item
                  label="撤销原因"
                  name="DispositionRemoveReason"
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

export default DispositionFrom;
