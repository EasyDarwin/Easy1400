import { CopyOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import copy from 'copy-to-clipboard';
import React from 'react';

const CopyBtn: React.FC<{
  value: string;
  title?: string;
  disabled?: boolean;
}> = ({ value, title = '复制', disabled = false }) => {
  const onCopyValue = () => {
    if (!value) return;
    let res = copy(value);
    if (res) return message.success(`${value} 复制成功`);
    return message.error('复制失败');
  };

  return (
    <Button
      style={{
        border: 'null',
        borderRadius: '9px',
        borderColor: '#efefef',
      }}
      disabled={disabled || !value}
      icon={<CopyOutlined className="w-3" />}
      onClick={onCopyValue}
    >
      <span className="text-[14px]">{title}</span>
    </Button>
  );
};

export default CopyBtn;
