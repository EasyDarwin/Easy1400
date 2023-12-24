import { EditSelectDevice, getCascades } from '@/services/http/cascade';
import { FindDeviceLists, getDeviceList } from '@/services/http/device';
import { ErrorHandle } from '@/services/http/http';
import { useMutation, useQuery, useQueryClient } from '@umijs/max';
import { Form, Input, Modal, Transfer, Typography, message } from 'antd';
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
    PageRecordNum: 9999,
    RecordStartNo: 1,
  });

  //获取设备列表
  const {} = useQuery<Device.FindReq>(
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
    },
  );

  const { mutate, isLoading: editIsLoading } = useMutation(EditSelectDevice, {
    onSuccess: () => {
      message.success('设置成功');
      queryClient.invalidateQueries([getCascades]);
      handleClose();
    },
    onError: ErrorHandle,
  });

  const onChange = (
    newTargetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[],
  ) => {
    // console.log(newTargetKeys, direction, moveKeys);
    setTargetKeys(newTargetKeys);
  };

  //搜索
  const handleSearch = (dir: TransferDirection, value: string) => {
    console.log('search:', dir, value);
  };

  //关闭表单
  const handleClose = () => {
    form.resetFields();
    setModalVisible(false);
  };

  return (
    <Modal
      title="限制共享设备"
      centered
      open={modalVisible}
      onOk={() => form.submit()}
      onCancel={handleClose}
      destroyOnClose={true}
      confirmLoading={editIsLoading}
      width="50%"
    >
      <Form
        form={form}
        layout="vertical"
        labelAlign="left"
        onFinish={(v) => {
          mutate(v);
        }}
      >
        <Form.Item name="device_ids" className="flex justify-center my-4">
          <Transfer
            dataSource={mockData}
            targetKeys={targetKeys}
            showSearch
            titles={['共享设备', '限制设备']}
            onSearch={handleSearch}
            listStyle={{
              width: 500,
              height: 400,
            }}
            onChange={onChange}
            render={(item) => item.title}
          />
        </Form.Item>
        <Typography.Text type="secondary">默认共享所有设备</Typography.Text>
        <Form.Item label="ID" name="id" hidden>
          <Input placeholder="上级视图库ID" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CascadeFrom;
