import { getAttrConfig, setAttrConfig } from "@/services/store/local";
import { useEffect, useState } from "react";
import { FindDictDatas } from '@/services/http/dict';
import { AxiosResponse } from 'axios';

const AttributeText: React.FC<{ code: string; value: any; }> = ({ code, value }) => {
  const [label, setLabel] = useState<string>('')

  const getLabel = (list: any[]) => {
    return list.find((el: any) => el.value == value).label
  }

  useEffect(() => {
    if (!code || !value) return
    const list = getAttrConfig(code) as any

    if (list?.length) {
      setLabel(getLabel(list))
      return
    }
    FindDictDatas(code).then((res: AxiosResponse) => {
      const data = res.data.items?.filter((el: any) => el.enabled) || []
      setAttrConfig(code, data)
      setLabel(getLabel(data))
    }).catch(() => {
      setAttrConfig(code, [])
      setLabel('')
    })
  }, [])

  return label
}

export default AttributeText;
