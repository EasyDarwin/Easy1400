import {
  FindImportHistory,
  ImportDevice,
  findImportHistory,
} from '@/services/http/device';
import { InboxOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@umijs/max';
import { Form, Modal, Upload, UploadProps } from 'antd';
import axios, { AxiosResponse } from 'axios';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
export interface IImportFromProps {
  openModalvisible: () => void;
}

const ImportFrom: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    openModalvisible: () => {
      setModalVisible(true);
    },
  }));

  const queryClient = useQueryClient();
  const [form] = Form.useForm<Device.APEObject>(); // 表单数据
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [historyQuery, setHistoryQuery] = useState<Device.FindImportHistoryReq>(
    {
      page: 1,
      size: 10,
      type: 'ape',
    },
  );

  //获取 上传 历史记录
  const { data } = useQuery([findImportHistory, historyQuery], () =>
    FindImportHistory(historyQuery).then((res) => {
      return res.data;
    }),
  );

  // const { mutate, isLoading } = useMutation(ImportDevice, {
  //   onSuccess: () => {
  //     message.success('设置成功');
  //     queryClient.invalidateQueries([getDeviceList]);
  //     form.resetFields();
  //     setModalVisible(false);
  //   },
  //   onError: ErrorHandle,
  // });

  //文件上传
  const handleUpload = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file.file);
    axios.post('/devices/import', formData).then(res=>{
      
    })
  };

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: '/devices/import',
    onChange(info) {
      console.log(info.file.response);

      // const { status } = info.file;
      // if (status !== 'uploading') {
      //   console.log(info.file, info.fileList);
      // }
      // if (status === 'done') {
      //   message.success(`${info.file.name} file uploaded successfully.`);
      // } else if (status === 'error') {
      //   message.error(`${info.file.name} file upload failed.`);
      // }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  //关闭表单
  const handleCancel = () => {
    form.resetFields();
    setModalVisible(false);
  };

  return (
    <Modal
      title="导入设备"
      centered
      open={modalVisible}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      destroyOnClose={true}
      width="50%"
    >
      <Form
        form={form}
        layout="vertical"
        labelAlign="left"
        onFinish={(v: any) => {}}
      >
        <Form.Item name="id">
          <Upload.Dragger customRequest={handleUpload}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-hint">点击或拖动文件到此处</p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
      {/* <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[
              <a key="list-loadmore-edit">edit</a>,
              <a key="list-loadmore-more">more</a>,
            ]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={<Avatar src={item.picture.large} />}
                title={<a href="https://ant.design">{item.name?.last}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
              <div>content</div>
            </Skeleton>
          </List.Item>
        )}
      /> */}
    </Modal>
  );
});

export default ImportFrom;
