import { FindImportDetail } from '@/services/http/device';
import { ErrorHandle } from '@/services/http/http';
import { useMutation } from '@umijs/max';
import { Col, List, Modal, Row, Typography } from 'antd';
import { AxiosResponse } from 'axios';
import { forwardRef, useImperativeHandle, useState } from 'react';
export interface IInfoModalRef {
  OpenModal: (id: number) => void;
}

const InfoModal: React.FC<{ ref: any }> = forwardRef<IInfoModalRef>(
  ({}, ref) => {
    useImperativeHandle(ref, () => ({
      OpenModal: (id: number) => {
        mutate(id);
        setModalVisible(true);
      },
    }));

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [data, setData] = useState<Device.ImportHistoryResult[]>();

    const { mutate, isLoading } = useMutation(FindImportDetail, {
      onSuccess: (res: AxiosResponse<Device.ImportHistoryItem>) => {
        setData(res.data.result.items);
      },
      onError: ErrorHandle,
    });

    return (
      <Modal
        title="导入详情"
        centered
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
        }}
        destroyOnClose={true}
        footer={null}
      >
        <div className="max-h-96 overflow-y-auto">
          <List
            dataSource={data ?? []}
            renderItem={(item: Device.ImportHistoryResult, index) => (
              <List.Item key={item.line}>
                <Row gutter={8} className="w-full">
                  <Col span={8}>
                    <Typography.Text strong>{item.line}</Typography.Text>
                  </Col>

                  <Col span={16} className="text-right">
                    <Typography.Text
                      code
                      className={
                        item.error ? ' text-red-500' : 'text-green-500'
                      }
                    >
                      {item.error ? item.error : '导入成功'}
                    </Typography.Text>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </div>
      </Modal>
    );
  },
);

export default InfoModal;
