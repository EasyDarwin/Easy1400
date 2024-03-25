
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Modal, Transfer, message, Form, Checkbox, Table, Row, Col } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useParams, useQueryClient } from '@umijs/max';
import { findCascadeShare, SaveCascadeShare } from '@/services/http/cascade';
import { ErrorHandle } from '@/services/http/http';
import { getDeviceList, FindDeviceLists } from '@/services/http/device';

export interface IInfoModalRef {
  openModal: (data?: Cascade.DeviceShareItem, edit?: boolean) => void;
}

const InfoModal: React.FC<{ ref: any }> = forwardRef(({ }, ref) => {
  useImperativeHandle(ref, () => ({
    openModal: (v: Cascade.DeviceShareItem, edit: boolean) => {
      if (edit) {
        setData(v)
      }
      setVisible(true);
      setEdit(edit || false)
    },
  }));
  const queryClient = useQueryClient();
  const platformID = useParams().platform_id ?? '';
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState<any>();
  const [form] = Form.useForm<Cascade.DeviceShareReq>(); // 表单数据
  const [checkList, setCheckList] = useState<React.Key[]>();
  const columns: ColumnsType<Device.APEObject> = [
    { title: '设备ID', dataIndex: 'ApeID', align: 'center', width: 180 },
    { title: '名称', dataIndex: 'Name', align: 'center', width: 180, },
  ]

  const [params, setParams] = useState<Device.Pager>({
    PageRecordNum: 20,
    RecordStartNo: 1,
  });

  useEffect(() => {
    if (visible && data) {
      setCheckList([data.APEID])
      form.setFieldsValue({
        platform: data.PlatformID,
        // devices: [data.APEID],
        person: data.Person,
        face: data.Face,
        motor_vehicle: data.MotorVehicle,
        non_motor_vehicle: data.NonMotorVehicle,
      })
    }
  }, [visible]);

  const {
    data: deviceData,
    isLoading: deviceLoading,
  } = useQuery<Device.FindReq>(
    [getDeviceList, params],
    () => FindDeviceLists(params).then((res) => res.data),
    {
      onError: ErrorHandle,
    },
  );

  const { mutate: saveMute, isLoading: saveLoading } =
    useMutation(SaveCascadeShare, {
      onSuccess: () => {
        message.success(`${edit ? '修改' : '添加'}成功`);
        queryClient.invalidateQueries([findCascadeShare]);
        onCancel()
      },
      onError: (error: Error) => {
        ErrorHandle(error);
      },
    });

  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  // const onChange = (v: string[]) => {
  //   setTargetKeys(v)
  //   form.setFieldValue('devices', v)
  // }

  const onSave = (v: Cascade.DeviceShareReq) => {
    if (!checkList?.length) {
      return message.info('请至少选择一个设备')
    }
    saveMute({ ...v, devices: checkList, platform: platformID })
  }

  return (
    <Modal
      title={'共享设备'}
      open={visible}
      width="70%"
      centered
      destroyOnClose={true}
      confirmLoading={saveLoading}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="inline"
        labelAlign="right"
        onFinish={(v: Cascade.DeviceShareReq) => onSave(v)}
      >
        {/* <Form.Item name="devices">
          <Transfer
            dataSource={deviceList}
            targetKeys={targetKeys}
            titles={['共享设备', '限制设备']}
            listStyle={{ width: '100%', height: 300 }}
            showSearch
            pagination
            onChange={onChange}
          />
        </Form.Item> */}
        <Row gutter={24} className='w-full'>
          {
            [
              { label: '人脸', name: 'face' },
              { label: '人员', name: 'person' },
              { label: '机动车', name: 'motor_vehicle' },
              { label: '非机动车', name: 'non_motor_vehicle' },
            ]
              .map(el => (
                <Col key={el.name} span={6}>
                  <Form.Item label={el.label} name={el.name} valuePropName="checked">
                    <Checkbox />
                  </Form.Item>
                </Col>
              ))
          }
        </Row>
      </Form>
      <div className="mt-2">设备选择：</div>
      <Table
        rowKey={'ApeID'}
        loading={deviceLoading}
        scroll={{ x: '100%', y: 500 }}
        size="small"
        columns={columns}
        dataSource={deviceData?.APEListObject.APEObject}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: checkList,
          onChange: (v: React.Key[]) => {
            setCheckList(v);
          }
        }}
        pagination={{
          total: deviceData?.APEListObject?.TotalNum,
          pageSize: params.PageRecordNum,
          current: params.RecordStartNo,
          size: 'small',
          onChange: (RecordStartNo, PageRecordNum) => {
            setParams({
              ...params,
              RecordStartNo: PageRecordNum !== params.PageRecordNum ? 1 : RecordStartNo,
              PageRecordNum,
            });
          },
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
        }}
      />
    </Modal>
  )
})

export default InfoModal