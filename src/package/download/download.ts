import { saveAs } from 'file-saver';
import iconv from 'iconv-lite';
/**
 * 文件流下载
 * @param data 文件数据
 * @param filename 文件名称
 * @param mime 媒体文件类型
 * @param bom 字节顺序 可选
 * */

export function downloadByData(data:any, filename:string, mime:any, bom?:any) {
    const encoder = iconv.encode(data,'gbk');
    const blob = new Blob([encoder], {type: mime || 'application/octet-stream'})
    saveAs(blob, filename)
}