import { CopyOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import copy from 'copy-to-clipboard';
import React from 'react';

const CopyBtn: React.FC<{ value: string }> = ({ value }) => {
  const onCopyValue = () => {
    if (!value) return;
    let res = copy(value);
    if (res) return message.success('复制成功');
    return message.error('复制失败');
  };

  return <Button icon={<CopyOutlined />} onClick={onCopyValue}>复制</Button>;
};

export default CopyBtn;
