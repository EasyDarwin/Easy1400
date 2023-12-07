import Box from '@/components/box/Box';
import { Button, Col, Row } from 'antd';

import Search from 'antd/es/input/Search';
import React, { useState } from 'react';

export interface ButtonList {
  loading?: boolean;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  type?: 'link' | 'text' | 'default' | 'primary' | 'dashed' | undefined;
  disabled?: boolean;
  onClick: () => void;
}

export interface SearchComponent {
  placeholder: string;
  onSearch: (value: string) => void;
}

interface IFunctionBarPorps {
  btnChannle: ButtonList[];
  searchChannle?: SearchComponent;
}

const FunctionBar: React.FC<IFunctionBarPorps> = ({
  btnChannle,
  searchChannle,
}) => {
  const [selectedID, setSelectedID] = useState(0);


  return (
    <>
      <Row className="w-full bg-white" justify="space-between">
        <Col>
          <Button.Group>
            {btnChannle.map((button, index) => (
              <Button
                key={index}
                loading={button.loading}
                onClick={()=>{
                  setSelectedID(index);
                  button.onClick()
                }}
                color={button.color}
                icon={button.icon}
                type={selectedID == index ? button.type : "default"}
                disabled={button.disabled}
              >
                {button.label}
              </Button>
            ))}
          </Button.Group>
        </Col>
        <Col>
          {searchChannle && (
            <Search
              className="w-96"
              enterButton
              placeholder={searchChannle.placeholder}
              onSearch={searchChannle.onSearch}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default FunctionBar;
