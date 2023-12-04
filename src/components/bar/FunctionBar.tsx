import Box from '@/components/box/Box';
import { Button, Col, Row } from 'antd';

import Search from 'antd/es/input/Search';
import React from 'react';

export interface ButtonList {
  loading?: boolean;
  label: string;
  icon?: any;
  color?: string;
  type?: 'link' | 'text' | 'default' | 'primary' | 'dashed' | undefined;
  onClick: () => void;
}

interface IFunctionBarPorps {
  btnChannle: ButtonList[];
}

const FunctionBar: React.FC<IFunctionBarPorps> = ({ btnChannle }) => {
  return (
    <Box>
      <Row className="w-full bg-white" justify="space-between">
        <Col>
          {btnChannle.map((button, index) => (
            <Button
              key={index}
              loading={button.loading}
              onClick={button.onClick}
              color={button.color}
              icon={button.icon}
              type={button.type}
            >
              {button.label}
            </Button>
          ))}
        </Col>
        <Col>
          <Search className='w-96' enterButton placeholder="请输入设备 ID" />
        </Col>
      </Row>
    </Box>
  );
};

export default FunctionBar;
