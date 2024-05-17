import { Form, Input, Modal, Select, message } from "antd";
import React, {
  useContext,
  useEffect,
  forwardRef,
  useState,
  useImperativeHandle,
} from "react";
import { ErrorHandle } from "@/services/http/http";
import { useQueryClient, useMutation } from "@umijs/max";
import { SaveGroup } from '@/services/http/groups';
import GroupContext from './GroupContext'

export const useGroup = () => {
  return React.useContext(GroupContext);
};

export interface IGroupModalRef {
  // 当前节点 是否编辑 是否需要刷新树
  openModal: (info?: any, edit?: any, reloadType?: any) => void;
}

const GroupModal: React.FC<{ ref: any }> = forwardRef(({ }, ref) => {
  useImperativeHandle(ref, () => ({
    // group
    openModal(info: any, edit: any, reloadType?: any) {
      setEdit(edit === 'edit')
      setInfo(info || {})
      setRefresh(reloadType)
      setVisible(true);
      setTimeout(() => {
        form.setFieldsValue(info)
      }, 0)
    }
  }));

  const sharedData = useGroup();
  const [info, setInfo] = useState<any>({})
  const [edit, setEdit] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [form] = Form.useForm<any>();

  // 编辑
  const { mutate: saveMutate, isLoading: saveLoading } = useMutation(SaveGroup, {
    onSuccess: () => {
      message.success(`${edit ? '修改' : '新增'}成功`);
      const values = form.getFieldsValue()
      sharedData.refreshTree({ ...info, ...values }, refresh)
      onCancel();
    },
    onError: ErrorHandle,
  });

  const title = info?.pid ? '节点' : '组织'

  const onCancel = () => {
    form.resetFields();
    setEdit(false)
    setVisible(false)
  }

  const validateCode = (_: any, value: string) => {
    if (!/^\d{2}$/g.test(value) || value === '00') {
      return Promise.reject(new Error('请输入两位十进制数，且不能是00'));
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title={`${edit ? '编辑' : '新增'}${title}`}
      open={visible}
      width={500}
      destroyOnClose={true}
      confirmLoading={saveLoading}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        className="max-w-[500px]"
        autoComplete="off"
        onFinish={vals => {
          saveMutate({ 
            ...vals,
            ...info.id && { id: info.id }
          })
        }}
      >
        {
          !!info?.pid && (
            <Form.Item label="上级节点" name="pid">
              <Select
                disabled
                options={[{ label: info.pname, value: info.pid }]}
              />
            </Form.Item>
          )
        }
        <Form.Item
          label={`${title}名称`}
          name="name"
          rules={[{ required: true, message: "请输入名称" }]}
        >
          <Input placeholder="请输入名称" allowClear />
        </Form.Item>
        <Form.Item
          label={`${title}编码`}
          name="code"
          required
          rules={edit ? [] : [
            { required: true, message: "请输入编码" },
            { validator: validateCode }
          ]}
        >
          {}
          <Input placeholder="请输入编码" allowClear disabled={edit} readOnly={edit} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default GroupModal;
