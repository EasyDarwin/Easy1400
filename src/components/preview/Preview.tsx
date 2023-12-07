import { Col, Descriptions, DescriptionsProps, Modal, Row } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

const Preview: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    setFieldsValue: () => {
      setModalVisible(true);
    },
  }));

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'UserName',
      children: 'Zhou Maomao',
    },
    {
      key: '2',
      label: 'Telephone',
      children: '1810000000',
    },
    {
      key: '3',
      label: 'Live',
      children: 'Hangzhou, Zhejiang',
    },
    {
      key: '4',
      label: 'Address',
      span: 2,
      children:
        'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
    },
    {
      key: '5',
      label: 'Remark',
      children: 'empty',
    },
  ];

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <Modal
      title="详情"
      centered
      width="70%"
      open={modalVisible}
      onOk={() => {}}
      onCancel={() => {
        setModalVisible(false);
      }}
      footer={[]}
    >
      <Row gutter={18}>
        <Col span={18}>
          <div className="w-full aspect-[4/3]">
            <img
              className="w-full h-full bg-blue-300"
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            ></img>
          </div>
        </Col>
        <Col span={6}>
          <Descriptions title="User Info" layout="vertical" items={items} />
        </Col>
      </Row>
    </Modal>
  );
});

export default Preview;
