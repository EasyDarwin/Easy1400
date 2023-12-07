import { Form, Input, InputNumber, Modal, Radio, Select, message } from "antd";
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { AddDictData, EditDictData, findDictTypes } from "@/services/http/dict";
import { ErrorHandle } from "@/services/http/http";
import { useQueryClient, useQuery } from "@umijs/max";

interface ChildProps {
  title: string;
  refresh: () => void;
}

interface IForwardRef {
  toggleOpen: () => void;
  setFieldsValue: (v: Dict.DataItem) => void;
}

const AddDictDataView = forwardRef<IForwardRef, ChildProps>(
  ({ refresh, title }, ref) => {
    useImperativeHandle(ref, () => ({
      toggleOpen: () => setIsModalVisible(true),
      setFieldsValue: (v: any) => {
        form.setFieldsValue(v);
        setDictId(v.id);
      },
    }));

    const queryClient = useQueryClient();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dictId, setDictId] = useState('');

    const [form] = Form.useForm(); // 表单数据

    const dictTypeData =
      queryClient.getQueryState<Dict.TypeItem[]>([findDictTypes])?.data || [];

    //点击确定按钮，发生表单
    const onOkEvent = () => {
      form.validateFields().then(async (row: Dict.AddData) => {
        setLoading(true);
        if (dictId) {
          editRequest(row);
        } else {
          addRequest(row);
        }
        setLoading(false);
      });
    };

    //新增字典请求
    function addRequest(row: Dict.AddData) {
      AddDictData(row)
        .then((res) => {
          refresh();
          onCancelEvent();
          message.success("添加字典成功!");
        })
        .catch((error) => {
          ErrorHandle(error);
        });
    }

    //编辑字典请求
    function editRequest(row: Dict.AddData) {
      EditDictData(dictId, row)
        .then((res) => {
          refresh();
          onCancelEvent();
          message.success("修改字典成功!");
        })
        .catch((error) => {
          ErrorHandle(error);
        });
    }

    //点击取消关闭对话框，并且重置表单
    const onCancelEvent = () => {
      form.resetFields();
      setIsModalVisible(false);
    };

    return (
      <Modal
        title={title}
        centered
        open={isModalVisible}
        onOk={onOkEvent}
        onCancel={onCancelEvent}
        width={500}
        destroyOnClose={true}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          labelAlign="left"
          initialValues={{ enabled: true, sort: 0 }}
        >
          <Form.Item
            label="编码类型"
            name="code"
            rules={[{ required: true, message: "请选择编码" }]}
          >
            <Select
              options={dictTypeData!.map((v) => {
                return { value: v.code, label: v.name };
              })}
            />
          </Form.Item>
          <Form.Item
            label="字典标签名"
            name="label"
            rules={[{ required: true, message: "请输入标签名" }]}
          >
            <Input placeholder="字典标签名" />
          </Form.Item>
          <Form.Item
            label="字典值"
            name="value"
            rules={[{ required: true, message: "请输入字典值" }]}
          >
            <Input placeholder="字典值" />
          </Form.Item>
          <Form.Item label="排序" name="sort">
            <InputNumber min={0} max={99} />
          </Form.Item>
          <Form.Item label="是否启用" name="enabled" initialValue={[true]}>
            <Radio.Group
              options={[
                { label: "开启", value: true },
                { label: "关闭", value: false },
              ]}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>
          <Form.Item label="备注描述" name="remark">
            <Input placeholder="备注描述" />
          </Form.Item>
          {/* <Form.Item label="标签" name="flag">
                    <Input placeholder="cn/en 之类的，查询时用于过滤" />
                </Form.Item> */}
        </Form>
      </Modal>
    );
  }
);

export default AddDictDataView;
