import { Button, Input, Space } from 'antd';
import React from 'react';
export interface NumberInputProps {
  value?: number;
  onChange?: (value: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange }) => {
  const min = -1;
  const max = 3000;
  const step = 1;
  const handleButtonClick = (step: number) => {
    const newValue = value! + step;

    if (min !== undefined && newValue < min) return;
    if (max !== undefined && newValue > max) return;
    onChange?.(newValue);
  };

  return (
    <Space.Compact >
      <Button type="default" onClick={() => handleButtonClick(-step)}>
        -
      </Button>
      <Input  value={value} onChange={(e)=>onChange?.(Number(e.target.value))} className="w-32 text-center" min={min} max={max} />

      <Button type="default" onClick={() => handleButtonClick(step)}>
        +
      </Button>
    </Space.Compact>
  );
};

export default NumberInput;
