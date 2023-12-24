import { message } from "antd";
import copy from "copy-to-clipboard";

/**
 * 复制内容
 * @param {string} value 需要复制的内容
 */
export const onCopyValue = (value:string) => {
    if (!value) return
    let res = copy(value);
    if(res) return message.success('复制成功')
    return message.error('复制失败')
  };