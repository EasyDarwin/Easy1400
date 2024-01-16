import { ImportDevice } from '@/services/http/device';
import { ErrorHandle } from '@/services/http/http';
import { InboxOutlined } from '@ant-design/icons';
import {
  Alert,
  Col,
  List,
  Modal,
  Row,
  Typography,
  Upload,
  message,
} from 'antd';
import { AxiosResponse } from 'axios';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
export interface IImportFromProps {
  openModalvisible: () => void;
}

const ImportFrom: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    openModalvisible: () => {
      setModalVisible(true);
    },
  }));

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<Device.ImportMessage[]>([]);

  //文件上传
  const handleUpload = async (file: any) => {
    setFileList([]);
    const formData = new FormData();
    formData.append('file', file.file);
    ImportDevice(formData)
      .then((res: AxiosResponse) => {
        // 创建一个用于更新加载进度的回调函数
        const updateProgress = (message: Device.ImportMessage) => {
          if (message.current == message.total) {
            source.close();
          }
        };
        file.onSuccess();
        //这里因为代理的原因 只能在生产环境中测试
        const sourceUrl = `${location.origin}${res.data.url}`;
        const source = new EventSource(sourceUrl);
        source.onerror = function (event) {
          message.error('获取实时上传信息出错');
          source.close();
        };
        source.onmessage = function (event) {
          const message = JSON.parse(event.data);
          setFileList((prevList) => [...prevList, message]);
          updateProgress(message);
        };
      })
      .catch((err: Error) => {
        file.onError();
        ErrorHandle(err);
      });
  };

  //关闭表单
  const handleCancel = () => {
    setFileList([]);
    setModalVisible(false);
  };

  // 每次 fileList 更新时，将滚动条滚动到底部
  const listRef = useRef<any>();
  useEffect(() => {
    if (fileList.length > 0) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [fileList]);
  return (
    <Modal
      title="导入设备"
      centered
      open={modalVisible}
      onCancel={handleCancel}
      destroyOnClose={true}
      width="50%"
      footer={[]}
      keyboard={false}
      maskClosable={false}
      
    >
      <Alert message="注意上传中请勿关闭此弹出框" type="warning" showIcon />
      <div className="py-3">
        <Upload.Dragger maxCount={1} accept=".csv" customRequest={handleUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text ">直接点击或拖动文件到此处</p>
          <p className="ant-upload-hint">
            仅支持 .csv 格式的文件 注意上传中请勿关闭此弹出框
          </p>
        </Upload.Dragger>
        {fileList.length > 0 && (
          <div className="max-h-80 mt-2 overflow-y-auto" ref={listRef}>
            <List
              dataSource={fileList}
              renderItem={(item: Device.ImportMessage) => (
                <List.Item key={item.current}>
                  <Row gutter={8} className="w-full">
                    <Col span={8}>
                      <Typography.Text strong>{item.current}</Typography.Text>
                    </Col>
                    <Col span={16} className="text-right ">
                      <Typography.Text
                        code
                        className={item.err ? 'text-red-500' : 'text-green-500'}
                      >
                        {item.err ? item.err : '导入成功'}
                      </Typography.Text>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </div>
        )}
      </div>
    </Modal>
  );
});

export default ImportFrom;
