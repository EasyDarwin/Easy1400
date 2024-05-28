import { FindCascadeLists, getCascades, EditSelectPlatforms, findDownwardCascade } from '@/services/http/cascade';
import { ErrorHandle } from '@/services/http/http';
import { useMutation, useQuery, useQueryClient } from '@umijs/max';
import { Form, Modal, Transfer, Input, message } from 'antd';
import { AxiosResponse } from 'axios';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

export interface ICascadeModalRef {
  openModal: (v: { id: string; cascade_ids: string[] }) => void;
}

const CascadeModal: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    openModal: (v: { id: string; cascade_ids: string[] }) => {
      setModalVisible(true);
      setTimeout(() => {
        form.setFieldsValue(v);
        setTargetKeys(v.cascade_ids);
      }, 0);
    },
  }));

  const queryClient = useQueryClient();
  const [form] = Form.useForm(); // 表单数据
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [params] =  useState<Cascade.ListReq>({
    name: '',
    page: 1,
    size: 999
  });

  const { data: cascadeData, isLoading: loading } = useQuery<Cascade.ListRes>(
    [getCascades, params],
    () => FindCascadeLists({ ...params }).then((res: AxiosResponse) => res?.data),
    {
      onError: ErrorHandle,
    },
  );
  
  const { mutate: saveMutate, isLoading: saveLoading } = useMutation(EditSelectPlatforms, {
    onSuccess: () => {
      message.success('关联成功');
      handleClose();
      setTimeout(() => {
        queryClient.invalidateQueries([findDownwardCascade]);
      }, 1500);
    },
    onError: ErrorHandle,
  });

  const onChange = (
    newTargetKeys: string[],
  ) => {
    setTargetKeys(newTargetKeys);
  };

  //关闭表单
  const handleClose = () => {
    setTargetKeys([])
    form.resetFields();
    setModalVisible(false);
  };

  const renderItem = (item: Cascade.Item) => {
    const customLabel = (
      <span key={item.id}>{item.name} - {item.id}</span>
    );
    return { label: customLabel, value: item.id };
  };

  return (
    <Modal
      title="关联上级平台"
      width="920px"
      centered
      destroyOnClose
      open={modalVisible}
      onCancel={handleClose}
      confirmLoading={saveLoading}
      okButtonProps={{ disabled: !targetKeys?.length }}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        labelAlign="left"
        onFinish={(v) => {
          saveMutate(v)
        }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="cascade_ids" className="flex justify-center my-4">
          <Transfer 
            showSearch
            pagination
            dataSource={cascadeData?.items}
            targetKeys={targetKeys}
            titles={['上级平台', '已关联平台']}
            listStyle={{ width: 500, height: 400 }}
            onChange={onChange}
            rowKey={(record) => record.id}
            render={renderItem}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CascadeModal;
