import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Upload, UploadProps } from 'antd';

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

export interface ISearchComponent {
  placeholder: string;
  onSearch: (value: string) => void;
}

export interface IUploadProps {
  props: UploadProps;
  title: string;
  isLoading: boolean;
}

interface IFunctionBarPorps {
  btnChannle: ButtonList[];
  rigthChannle?: React.ReactNode;
  span?: [number, number];
  rigthChannleClass?: string;
  isBar?: boolean; //是否开启单选模式
  uploadProps?: IUploadProps;
  isUpload?: boolean; //是否开启上传模式
  btnPosition?: React.ReactNode;
}

const FunctionBar: React.FC<IFunctionBarPorps> = ({
  btnChannle,
  rigthChannle,
  span = [12, 12],
  rigthChannleClass,
  isBar = true,
  uploadProps,
  isUpload = false,
  btnPosition,
}) => {
  const [selectedID, setSelectedID] = useState(0);

  return (
    <>
      <Row className="w-full bg-white">
        <Col span={span[0]}>
          <Button.Group>
            {btnChannle.map((button, index) => (
              <Button
                key={index}
                loading={button.loading}
                onClick={() => {
                  setSelectedID(index);
                  button.onClick();
                }}
                color={button.color}
                icon={button.icon}
                type={selectedID == index || isBar ? button.type : 'default'}
                disabled={button.disabled}
              >
                {button.label}
              </Button>
            ))}
            {isUpload && (
              <Upload {...uploadProps?.props}>
                <Button
                  className="rounded-l-none"
                  type="primary"
                  loading={uploadProps?.isLoading}
                  icon={<DownloadOutlined />}
                >
                  {uploadProps?.title}
                </Button>
              </Upload>
            )}
          </Button.Group>
          {btnPosition}
        </Col>
        <Col span={span[1]} className={rigthChannleClass}>
          {rigthChannle}
        </Col>
      </Row>
    </>
  );
};

export default FunctionBar;
