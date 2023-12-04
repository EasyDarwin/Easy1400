import { CopyOutlined } from '@ant-design/icons';
import React from 'react';
import copy from 'copy-to-clipboard';
import { message } from 'antd';

interface ICopyIconProps {
    value:string;
}

const CopyIcon: React.FC<ICopyIconProps> = ({value}) => {

  const onCopyValue = () => {
    if (!value) return
    let res = copy(value);
    if(res) return message.success('复制成功')
    return message.error('复制失败')
  };

  return (
    <>
      <CopyOutlined style={{fontSize:'12px',}} className='ml-1 cursor-pointer' onClick={onCopyValue}/>
    </>
  );
};

export default CopyIcon;
