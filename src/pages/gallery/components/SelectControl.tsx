import { Button, Checkbox, Popconfirm } from 'antd';
import React from 'react';

export interface ISelectControl {
  openCheckbox: boolean;
  isLoading?:boolean;
  onOpenCheckbox: () => void;
  onCheckAll: () => void;
  onCheckReverse: () => void;
  confirm: () => void;
  cancel: () => void;
}

const SelectControl: React.FC<ISelectControl> = ({
  onCheckAll,
  onCheckReverse,
  confirm,
  cancel,
  openCheckbox,
  onOpenCheckbox,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center py-2 bg-white h-[48px]">
      <div>
        {openCheckbox && (
          <Button.Group>
            <Button type="primary" onClick={onCheckAll}>
              全选
            </Button>
            <Button type="primary" onClick={onCheckReverse}>
              反选
            </Button>
            <Popconfirm
              title="批量删除"
              description="确定删除选择的图片吗?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" danger loading={isLoading}>
                批量删除
              </Button>
            </Popconfirm>
          </Button.Group>
        )}
      </div>
      <Checkbox onChange={onOpenCheckbox}>多选</Checkbox>
    </div>
  );
};

export default SelectControl;
