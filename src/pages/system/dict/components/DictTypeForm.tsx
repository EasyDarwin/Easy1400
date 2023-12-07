import { Form, Input, Modal, message } from "antd";
import React, {
  useEffect,
  forwardRef,
  useState,
  useImperativeHandle,
} from "react";
import { AddDictType, findDictTypes,EditDictTypeData, } from "@/services/http/dict";
import { ErrorHandle } from "@/services/http/http";
import { useQueryClient } from "@umijs/max";

interface DictTypeForm {
  id:string;
  ref:any;
}

const AddTypeView:React.FC<DictTypeForm> = forwardRef(({id},ref) => {
  useImperativeHandle(ref, () => ({
    toggleOpen() {
      setIsModalVisible(true);
    },
    editFrom(name:string){
      setIsEdit(true)
      setIsModalVisible(true);
      form.resetFields();
      form.setFieldsValue({name})
    }
  }));

  const queryClient = useQueryClient();

  const [isEdit,setIsEdit] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const [form] = Form.useForm<any>(); // 表单数据

  //添加字典类型数据
  const onAddDictType = (row:Dict.AddType) => {
    AddDictType(row)
    .then((res) => {
      message.success("添加字典类型成功!");
      queryClient.invalidateQueries([findDictTypes]); //刷新字典类型列表
      setIsModalVisible(false)
    })
    .catch((error) => {
      ErrorHandle(error);
    });
  };

  //编辑字典类型
  const onEditDictType = (name:string) => {
    EditDictTypeData(id, name).then((res) => {
      message.success('修改成功')
      queryClient.invalidateQueries([findDictTypes]);
      setIsModalVisible(false)
      
    }).catch(error=>ErrorHandle(error))
  }

  const onCloseModal = () => {
    setIsEdit(false)
    form.resetFields();
    setIsModalVisible(false)
  }
  return (
    <div>
      <Modal
        title={isEdit ? "编辑字典类型" : "添加字典类型"}
        open={isModalVisible}
        onOk={()=>form.submit()}
        onCancel={onCloseModal}
        width={500}
        destroyOnClose={true}
      >
        <Form 
        form={form} 
        layout="vertical" 
        className="max-w-[500px]"
        onFinish={(row:Dict.AddType)=>{
          if(!isEdit) {
            onAddDictType(row);
            return
          }
          onEditDictType(row.name)
        }}
        >
         {isEdit ? <></> : ( <Form.Item
            label="类型编码"
            name="code"
            rules={[{ required: true, message: "请输入编码" }]}
          >
            <Input placeholder="请输入编码" />
          </Form.Item>)}
          <Form.Item
            label="类型名称"
            name="name"
            rules={[{ required: true, message: "请输入名称" }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default AddTypeView;
