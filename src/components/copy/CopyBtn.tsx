import { onCopyValue } from '@/package/copy/copy';
import { CopyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

const CopyBtn: React.FC<{
  value: string;
  title?: string;
  disabled?: boolean;
}> = ({ value, title = '复制', disabled = false }) => {
  return (
    <Button
      style={{
        border: 'null',
        borderRadius: '9px',
        borderColor: '#efefef',
      }}
      disabled={disabled || !value}
      icon={<CopyOutlined className="w-3" />}
      onClick={() => onCopyValue(value)}
    >
      <span className="text-[14px]">{title}</span>
    </Button>
  );
};

export default CopyBtn;
