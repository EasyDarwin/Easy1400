import { POLLING_TIME } from '@/constants';
import { EditSelectDevice } from '@/services/http/cascade';
import { FindDeviceLists, getDeviceList } from '@/services/http/device';
import { ErrorHandle } from '@/services/http/http';
import { useMutation, useQuery, useQueryClient } from '@umijs/max';
import { Form, Input, Modal, Transfer, message } from 'antd';
import { TransferDirection } from 'antd/es/transfer';
import { AxiosResponse } from 'axios';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

export interface IDeviceRef {
  setFieldsValue: (v: { id: string; device_ids: string[] }) => void;
}

interface RecordType {
  key: string;
  title: string;
  description: string;
}

const CascadeFrom: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    setFieldsValue: (v: { id: string; device_ids: string[] }) => {
      form.setFieldsValue(v);
      setTargetKeys(v.device_ids);
      setModalVisible(true);
    },
  }));

  const [form] = Form.useForm(); // 表单数据
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mockData, setMockData] = useState<RecordType[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const [pagination, setPagination] = useState<Device.Pager>({
    value: '',
    PageRecordNum: 3000,
    RecordStartNo: 1,
  });

  //获取设备列表
  const {
    data: deviceData,
    isLoading: deviceListLoading,
    refetch,
  } = useQuery<Device.FindReq>(
    [getDeviceList, pagination],
    () =>
      FindDeviceLists({ ...pagination }).then(
        (res: AxiosResponse<Device.FindReq>) => {
          const newMockData = [];
          for (let i = 0; i < res.data.APEListObject.APEObject.length; i++) {
            const data = {
              key: i.toString(),
              title: res.data.APEListObject.APEObject[i].Name,
              description: res.data.APEListObject.APEObject[i].ApeID,
            };
            newMockData.push(data);
          }
          setMockData(newMockData);
          return res.data;
        },
      ),
    {
      onError: ErrorHandle,
      refetchInterval: POLLING_TIME,
    },
  );

  const { mutate } = useMutation(EditSelectDevice, {
    onSuccess: () => {
      message.success('设置成功');
      handleClose();
    },
    onError: () => {},
  });

  //关闭表单
  const handleClose = () => {
    form.resetFields();
    setModalVisible(false);
  };

  const onChange = (
    newTargetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[],
  ) => {
    console.log(newTargetKeys, direction, moveKeys);
    setTargetKeys(newTargetKeys);
  };

  return (
    <Modal
      title="选择共享设备及对象"
      centered
      open={modalVisible}
      onOk={() => form.submit()}
      onCancel={handleClose}
      destroyOnClose={true}
      confirmLoading={false}
    >
      <Form
        form={form}
        layout="vertical"
        labelAlign="left"
        onFinish={(v) => {
          mutate(v);
        }}
      >
        <Form.Item name="device_ids" className='flex justify-center my-6'>
          <Transfer
            dataSource={mockData}
            targetKeys={targetKeys}
            onChange={onChange}
            render={(item) => item.title}
          />
        </Form.Item>
        <Form.Item label="ID" name="id" hidden>
          <Input placeholder="上级视图库ID" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CascadeFrom;
