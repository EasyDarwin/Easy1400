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
export async function EditDevice(data: {
  id: string;
  data: Device.APEObject;
}) {
  return await PUT(`/devices/${data.id}`, data.data);
}
