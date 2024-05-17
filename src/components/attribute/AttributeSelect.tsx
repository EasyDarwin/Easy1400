import { Select } from 'antd';
import { FindDictDatas } from '@/services/http/dict';
import { AxiosResponse } from 'axios';
import { useEffect, useState, useRef } from 'react'
import { getAttrConfig, setAttrConfig } from "@/services/store/local";

const AttributeSelect: React.FC<{
  code: string; 
  fieldNames?: any; 
  label?: string; 
  value?: any;
  change?: (v:any, info?:any) => void;
}> = ({
  code,
  label,
  value,
  fieldNames,
  change
}) => {
  const [val, setValue] = useState<any>(value)
  const [options, setOptions] = useState<any[]>([])
  const isMountedRef= useRef(false);

  useEffect(() => {
    const list = getAttrConfig(code) as any
    if (list?.length) {
      setOptions(list)
    } else {
      FindDictDatas(code).then((res: AxiosResponse) => {
        const data = res.data.items?.filter((el: any) => el.enabled) || []
        setOptions(data)
        setAttrConfig(code, data)
      }).catch(() => {
        setOptions([])
        setAttrConfig(code, [])
      })
    }
    return () => {}
  }, [])

  const onChange = (v: any, info: any) => {
    setValue(v)
    change?.(v, info)
  }

  return (
    <Select
      value={val}
      style={{ width: '100%' }}
      allowClear
      placeholder={'请选择' + label}
      options={options}
      fieldNames={{ label: 'label', value: 'value', ...fieldNames || {} }}
      onChange={onChange}
    />
  );
};

export default AttributeSelect;
