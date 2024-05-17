import { Form, Modal, Select, message } from "antd";
import React, {
  useRef,
  forwardRef,
  useState,
  useImperativeHandle,
} from "react";
import { ErrorHandle } from "@/services/http/http";
import { useQueryClient, useMutation, useLocation } from "@umijs/max";
import { AddGroupDeviceAuto, getGroupDeviceListPage } from '@/services/http/groups';
import GroupContext from './GroupContext'
import OrgTree, { ITreeRef } from './OrgTree'
import AttributeSelect from "@/components/attribute/AttributeSelect";
import queryString from 'query-string';

export const useGroup = () => {
  return React.useContext(GroupContext);
};
export interface IBindModalRef {
  openModal: (ids?: any, type?: any) => void;
}

const BindModal: React.FC<{
  ref: any; onBack:
  (ids?: any[]) => void;
}> = forwardRef(({ onBack }, ref) => {
  useImperativeHandle(ref, () => ({
    openModal(ids: any, type?: any) {
      setDeviceIds(ids)
      setInfo(info || {})
      setType(type)
      setVisible(true);
      setTimeout(() => {
        form.setFieldsValue(info)
      }, 0)
    }
  }));

  const location = useLocation()
  const querys = queryString.parse(location.search);

  const queryClient = useQueryClient();
  const treeRef = useRef<ITreeRef>();
  const [form] = Form.useForm<any>();
  const [type, setType] = useState<any>()
  const [info, setInfo] = useState<any>({})
  const [deviceIds, setDeviceIds] = useState<any[]>([])
  const [groupId, setGroupId] = useState<string>()
  const [visible, setVisible] = useState<boolean>(false);

  const { mutate: saveMutate, isLoading: saveLoading } = useMutation(AddGroupDeviceAuto, {
    onSuccess: () => {
      message.success('绑定成功');
      queryClient.invalidateQueries([getGroupDeviceListPage]);
      onCancel(false);
    },
    onError: ErrorHandle,
  });

  const onTreeChange = (id: any, info: Group.GroupItem) => {
    // setGroupId(info.ape_id)
    setGroupId(id)
  }

  const onSetAttrValue = (code:string, v: any) => {
    form.setFieldValue(code, v)
  }

  const onCancel = (isBack?: boolean) => {
    form.resetFields();
    setVisible(false)

    if (isBack && type === 'device') {
      // 全部设备 手动取消返回 需打开上个弹窗
      onBack(deviceIds)
    }
    setDeviceIds([])
  }

  const items = [
    { label: '行业类型', code: 'industry_code', attr: 'IndustryCode' },
    { label: '类型编码', code: 'type_code', attr: 'TypeCode' },
    { label: '网络标识', code: 'network_code', attr: 'NetworkCode' },
  ]

  return (
    <Modal
      title={type === 'device' ? '生成级联码' : '更新级联码'}
      open={visible}
      width={500}
      destroyOnClose={true}
      confirmLoading={saveLoading}
      onOk={() => form.submit()}
      onCancel={() => onCancel(true)}
    >
      <Form
        form={form}
        layout="vertical"
        className="max-w-[500px]"
        autoComplete="false"
        onFinish={vals => {
          saveMutate({ 
            ...vals,
            virtual_group_id: Number(groupId),
            device_ids: deviceIds
          })
        }}
      >
        {
          visible && items.map(el => (
            <Form.Item
              key={el.code}
              label={el.label}
              name={el.code}
              rules={[{ required: true, message: '请选择' + el.label }]}
            >
              <AttributeSelect code={el.attr} label={el.label} change={(v: any) => onSetAttrValue(el.code, v)} />
            </Form.Item>
          ))
        }
        <div className="min-h-[100px] max-h-[300px] overflow-auto">
          <OrgTree ref={treeRef} parentInfo={querys} onChange={onTreeChange} />
        </div>
      </Form>
    </Modal>
  )
})
export default BindModal;
