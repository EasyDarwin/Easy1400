import { generateUniqueString } from '@/package/string/string';
import {
  AddDownwardCascade,
  EditDownwardCascade,
  findDownwardCascade,
} from '@/services/http/cascade';
import { ErrorHandle } from '@/services/http/http';
import { FindSystemInfo, findSystemInfo } from '@/services/http/system';
import { useMutation, useQuery, useQueryClient } from '@umijs/max';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Tooltip,
  message,
} from 'antd';
import { AxiosResponse } from 'axios';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export interface IDownCascadeRef {
  setFieldsValue: (data?: any, type?: boolean) => void;
}

const CascadeFrom: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
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

  //获取系统信息
  const { data: infoData, isLoading: infoLoading } =
    useQuery<System.SystemInfo>(
      [findSystemInfo],
      () => FindSystemInfo().then((res: AxiosResponse) => res.data),
      {
        onError: ErrorHandle,
      },
    );

  //添加
  const { mutate: addCascadeMutate, isLoading: addCascadeLoading } =
    useMutation(AddDownwardCascade, {
      onSuccess() {
        message.success('新增成功');
        handleClose();
        setTimeout(() => {
          queryClient.invalidateQueries([findDownwardCascade]);
        }, 1500);
      },
      onError: ErrorHandle,
    });

  //编辑
  const { mutate: editCascadeMutate, isLoading: editCascadeLoading } =
    useMutation(EditDownwardCascade, {
      onSuccess() {
        message.success('修改成功');
        handleClose();
        setTimeout(() => {
          queryClient.invalidateQueries([findDownwardCascade]);
        }, 1500);
      },
      onError: ErrorHandle,
    });

  //关闭表单
  const handleClose = () => {
    form.resetFields();
    setInputValue('');
    setModalVisible(false);
  };

  //校验 验证code第11~13位必须为503或120
  const validateCode = (_: any, value: string) => {
    if (!value || value.length !== 20) {
      return Promise.reject(new Error('Code长度必须为20'));
    }
    if (!['503', '120'].includes(value.substring(10, 13)) ) {
      return Promise.reject(new Error('第11~13位必须为503或120'));
    }
    return Promise.resolve();
  };

  //默认username跟随id，但是如果username有值就不跟随
  const useIdName = useRef<boolean>(false);
  const handlePlatformIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (useIdName.current) return;
    form.setFieldsValue({ user_name: e.target.value });
  };

  const handleDeviceUserNameChange = () => {
    useIdName.current = true; // 标记用户名输入框已被修改过
  };

  //一键导入，将系统信息导入表单
  const [inputValue, setInputValue] = useState('');
  const onClickPush = () => {
    try {
      if (!inputValue) return message.error('没有内容');
      let data = JSON.parse(inputValue);
      if (!data.platform_id) return message.error('请复制正确的信息');
      form.setFieldsValue({
        ...data,
        name: generateUniqueString(6),
        description: '使用一键导入生成',
      });
    } catch {
      return message.error('请复制正确的信息');
    }

    // let data = {
    //   platform_id: infoData?.username ?? '',
    //   name: generateUniqueString(6),
    //   user_name: infoData?.username ?? '',
    //   password: infoData?.password ?? '',
    //   remote_port: Number(infoData?.port ?? 0),
    // };
    // form.setFieldsValue(data);
    // navigator.permissions
    //   .query({ name: "clipboard-read" })
    //   .then((result) => {
    //     if (result.state === 'granted' || result.state === 'prompt') {
    //       navigator.clipboard
    //         .readText()
    //         .then((text) => {
    //           console.log(text);
    //           if (!text) return message.error('剪切板内没有内容');
    //           let data = JSON.parse(text);
    //           if (!data.platform_id) return message.error('请复制正确的信息');
    //           form.setFieldsValue(data);
    //         })
    //         .catch((err) => {
    //           return message.error('请检测复制内容是否正确!');
    //         });
    //     } else {
    //       return message.error('无法访问剪切板，请检查剪切板权限');
    //     }
    //   })
    //   .catch((error) => {
    //     return message.error('请求剪贴板权限时出错');
    //   });
  };

  return (
    <Modal
      title={isEdit ? '编辑下级视图库' : '新增下级视图库'}
      centered
      open={modalVisible}
      onOk={() => form.submit()}
      onCancel={handleClose}
      destroyOnClose={true}
      confirmLoading={addCascadeLoading || editCascadeLoading}
    >
      <Form
        form={form}
        layout="horizontal"
        labelAlign="left"
        labelCol={{ span: 4 }}
        onFinish={(v: Cascade.DownReq) => {
          if (isEdit) {
            editCascadeMutate({ id: v.platform_id, data: v });
          } else {
            addCascadeMutate(v);
          }
        }}
      >
        <Form.Item
          label="视图库ID"
          name="platform_id"
          rules={[{ required: true }, { validator: validateCode }]}
        >
          <Input
            maxLength={20}
            placeholder="下级视图库ID"
            disabled={isEdit}
            onChange={handlePlatformIdChange}
          />
        </Form.Item>

        <Form.Item label="名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="下级视图库名称" />
        </Form.Item>
        <Form.Item label="用户名" name="user_name" rules={[{ required: true }]}>
          <Input
            placeholder="用户名"
            disabled
            onChange={handleDeviceUserNameChange}
          />
        </Form.Item>
        <Form.Item
          label="接入密码"
          initialValue={infoData?.password}
          name="password"
          rules={[{ required: true }]}
        >
          <Input placeholder="接入密码" />
        </Form.Item>
        {/* <Form.Item label="视图库域" name="realm">
          <Input placeholder="下级视图库域" />
        </Form.Item> */}
        {/* <Form.Item label="IP地址" name="ip_addr">
          <Input placeholder="IP地址" />
        </Form.Item>
        <Form.Item label="IPv6地址" name="ipv6_addr">
          <Input placeholder="IPv6地址" />
        </Form.Item> */}
        <Form.Item label="端口" name="remote_port" rules={[{ required: true }]}>
          <InputNumber className="w-full" placeholder="端口" />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input className="w-full" placeholder="描述" />
        </Form.Item>
      </Form>
      {!isEdit && (
        <Row gutter={42}>
          <Col span={18}>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='将复制的系统信息导入。例如：{"platform_id":"12312312315031231231",.....}'
            ></Input>
          </Col>
          <Col span={6}>
            <Tooltip title="将系统信息导入">
              <Button onClick={onClickPush}>一键导入</Button>
            </Tooltip>
          </Col>
        </Row>
      )}
    </Modal>
  );
});

export default CascadeFrom;
