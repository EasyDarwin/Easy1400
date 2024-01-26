import { AxiosProgressEvent } from 'axios';
import { DELETE, GET, POST, PUT } from './http';

//获取设备列表
export const getDeviceList = 'GetDeviceList';

export async function FindDeviceLists(data: Device.Pager) {
  return await GET<Device.FindReq>('/VIID/APEs', data);
}

//添加设备
export async function AddDevice(data: Device.APEObject) {
  return await POST('/devices', data);
}

//删除设备
export async function DelDevice(id: string) {
  return await DELETE(`/devices/${id}`);
}

//获取设备信息
export async function GetDeviceInfo(id: string) {
  return await GET(`/devices/${id}`);
}

//修改设备
export async function EditDevice(data: { id: string; data: Device.APEObject }) {
  return await PUT(`/devices/${data.id}`, data.data);
}

//设置每天最大采集数量
export async function EditMaxCollectNum(data: {
  id: string;
  max_count: number;
}) {
  return await PUT(`/devices/${data.id}/limit`, { max_count: data.max_count });
}

//导出 excel 表格
export async function ExportDevice(ids:string) {
  return await GET(`/devices/export`,{ids:ids});
}

//导入 设备列表
export async function ImportDevice(data: FormData) {
  return await POST(`/devices/import`, data,undefined,{'Content-Type': 'multipart/form-data'});
}


//获取导入历史
export const findImportHistory = 'FindImportHistory';
export async function FindImportHistory(data:Device.FindImportHistoryReq) {
  return await GET<Device.FindImportHistoryRes>(`/devices/history`, data);
}

//获取导入详情
export async function FindImportDetail(id:number) {
  return await GET<Device.ImportHistoryItem>(`/devices/history/${id}`);
}

//设置免鉴权
export async function SetDeviceNoAuth(data: { id: string; auth: boolean }) {
  return await POST(`/devices/${data.id}/auth/${data.auth}`)
}