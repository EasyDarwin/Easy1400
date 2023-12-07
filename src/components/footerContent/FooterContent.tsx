import { cleanStoreage } from '@/services/http/http';
import { history } from '@umijs/max';
import { Button } from 'antd';
import React from 'react';

const FooterContent:React.FC = () => {
  return (
    <Button
      className="w-full"
      onClick={() => {
        history.push('/');
        cleanStoreage();
      }}
    >
      退出
    </Button>
  );
};

export default FooterContent;
