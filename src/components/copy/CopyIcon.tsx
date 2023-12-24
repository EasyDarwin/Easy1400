import { onCopyValue } from '@/package/copy/copy';
import { CopyOutlined } from '@ant-design/icons';
import React from 'react';

interface ICopyIconProps {
  value: string;
}

const CopyIcon: React.FC<ICopyIconProps> = ({ value }) => {
  return (
    <>
      <CopyOutlined
        style={{ fontSize: '12px' }}
        className="ml-1 cursor-pointer"
        onClick={() => onCopyValue(value)}
      />
    </>
  );
};

export default CopyIcon;
